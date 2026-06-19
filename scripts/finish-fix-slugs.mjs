import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const DK = process.env.DEEPSEEK_API_KEY;

const { data: rc } = await s.from("repair_costs").select("repair_slug");
const slugs = [...new Set((rc || []).map(r => r.repair_slug))];
const cat = slugs.map(s => `  ${s} (${s.replace(/_/g, " ")})`).join("\n");

const SYS = `You are an ASE master tech. For each fix description, assign the SINGLE most appropriate repair_slug from the catalog below. If nothing matches, use null.

## Repair Catalog:
${cat}

Input: JSON array of fix items
Output: JSON array with repair_slug assigned
Rules: Use EXACT repair_slug values. Match based on fix text. Return ONLY valid JSON array.`;

// Find codes with fixes but no fix_repair_slugs
const toProcess = [];
let rs = 0;
while (true) {
  const { data } = await s.from("obd_codes").select("code,fixes_json,fix_repair_slugs").range(rs, rs + 999);
  if (!data?.length) break;
  for (const r of data) {
    const hasFixes = (r.fixes_json || []).filter(f => f.trim()).length > 0;
    const hasSlugs = (r.fix_repair_slugs || []).some(s => s);
    if (hasFixes && !hasSlugs) toProcess.push(r);
  }
  rs += 1000;
}
console.log(`Codes to fix: ${toProcess.length}`);

let done = 0;
for (let i = 0; i < toProcess.length; i += 50) {
  const batch = toProcess.slice(i, i + 50);
  const items = [];
  for (const row of batch) {
    (row.fixes_json || []).forEach((text, j) => { if (text.trim()) items.push({ code: row.code, fix_index: j, text }); });
  }

  const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${DK}` },
    body: JSON.stringify({ model: "deepseek-chat", messages: [{ role: "system", content: SYS }, { role: "user", content: JSON.stringify(items) }], temperature: 0.1, max_tokens: 8000 }),
  });
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content || "";
  let results = [];
  try { results = JSON.parse(content.replace(/```json\n?|```/g, "").trim()); } catch {}

  const byCode = new Map();
  for (const r of results) {
    if (r && r.code && r.repair_slug !== undefined && (r.repair_slug === null || slugs.includes(r.repair_slug))) {
      if (!byCode.has(r.code)) byCode.set(r.code, []);
      byCode.get(r.code).push({ index: r.fix_index, slug: r.repair_slug });
    }
  }

  for (const row of batch) {
    const entries = byCode.get(row.code) || [];
    const slugArr = new Array((row.fixes_json || []).length).fill(null);
    for (const { index, slug } of entries) { if (index < slugArr.length) slugArr[index] = slug; }
    await s.from("obd_codes").update({ fix_repair_slugs: slugArr }).eq("code", row.code);
  }
  done += batch.length;
  if (done % 2000 === 0) console.log(`  ${done}/${toProcess.length}`);
}
console.log(`Done: ${done} codes`);
