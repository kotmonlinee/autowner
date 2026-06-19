import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const DK = process.env.DEEPSEEK_API_KEY;

const { data: rc } = await s.from("repair_costs").select("repair_slug");
const slugs = [...new Set((rc || []).map(r => r.repair_slug))];
const cat = slugs.map(sl => `  ${sl} (${sl.replace(/_/g, " ")})`).join("\n");

const SYS = `ASE master tech. For each fix, assign SINGLE best repair_slug from catalog. NULL only if genuinely no match.\n\nCatalog:\n${cat}\n\nInput: [{code,fix_index,text}]\nOutput: [{code,fix_index,repair_slug}]\nExact slugs only. JSON only.`;

// Each batch: 30 codes, fetch their fixes and existing slugs
let rs = 0, fixed = 0, skipped = 0, batchNum = 0;
while (true) {
  const { data: batch } = await s.from("obd_codes")
    .select("code,fixes_json,fix_repair_slugs")
    .not("fixes_json", "eq", "[]")
    .range(rs, rs + 29);
  if (!batch?.length) break;
  rs += 30;

  // Filter to codes that NEED fixing (all-null fix_repair_slugs)
  const needsFix = batch.filter(r => {
    const sl = r.fix_repair_slugs || [];
    return sl.length > 0 && !sl.some(x => x);
  });
  if (!needsFix.length) { skipped += batch.length; continue; }

  batchNum++;
  const items = [];
  for (const r of needsFix) {
    (r.fixes_json || []).forEach((t, j) => { if (t.trim()) items.push({ code: r.code, fix_index: j, text: t }); });
  }
  if (!items.length) { skipped += batch.length; continue; }

  try {
    const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${DK}` },
      body: JSON.stringify({ model: "deepseek-chat", messages: [{ role: "system", content: SYS }, { role: "user", content: JSON.stringify(items) }], temperature: 0.1, max_tokens: 8000 }),
    });
    if (!res.ok) { console.error(`  [batch ${batchNum}] HTTP ${res.status}`); skipped += batch.length; continue; }
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || "";
    const results = JSON.parse(content.replace(/```json\n?|```/g, "").trim());

    const byCode = new Map();
    for (const r of results) {
      if (r && r.code && r.repair_slug !== undefined && (r.repair_slug === null || slugs.includes(r.repair_slug))) {
        if (!byCode.has(r.code)) byCode.set(r.code, []);
        byCode.get(r.code).push({ i: r.fix_index, s: r.repair_slug });
      }
    }

    // ONLY update codes that got at least one non-null slug
    let batchFixed = 0;
    for (const r of needsFix) {
      const entries = (byCode.get(r.code) || []).filter(e => e.s);
      if (entries.length === 0) continue; // skip — AI returned all nulls for this code
      const arr = new Array((r.fixes_json || []).length).fill(null);
      for (const { i, s } of entries) { if (i < arr.length) arr[i] = s; }
      await s.from("obd_codes").update({ fix_repair_slugs: arr }).eq("code", r.code);
      batchFixed++;
    }
    fixed += batchFixed;
  } catch (e) {
    console.error(`  [batch ${batchNum}] Error: ${e.message.substring(0, 50)}`);
  }
  skipped += batch.length - needsFix.length;

  if (batchNum % 50 === 0) console.log(`  Batch ${batchNum} | Fixed ${fixed} | Skipped ${skipped}`);
}
console.log(`Done: Fixed ${fixed}, Skipped ${skipped}`);

// Final count
let allNull = 0;
rs = 0;
while (true) {
  const { data } = await s.from("obd_codes").select("fix_repair_slugs").not("fixes_json", "eq", "[]").range(rs, rs + 999);
  if (!data?.length) break;
  for (const r of data) { const sl = r.fix_repair_slugs || []; if (sl.length > 0 && !sl.some(x => x)) allNull++; }
  rs += 1000;
}
console.log(`Remaining all-null: ${allNull}`);
