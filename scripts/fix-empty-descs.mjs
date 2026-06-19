import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const DK = process.env.DEEPSEEK_API_KEY;

// Find all codes with empty cause_description
const { data: repairs } = await supabase.from("diy_difficulty").select("repair_slug,repair_name,difficulty_label,est_time");
const cat = repairs.map(r => `  - ${r.repair_slug} | ${r.repair_name} | ${r.difficulty_label} | ${r.est_time}`).join("\n");

const badCodes = [];
let rs = 0;
while (true) {
  const { data } = await supabase.from("obd_diagnostic_steps").select("obd_code,causes").range(rs, rs + 999);
  if (!data?.length) break;
  for (const row of data) {
    if ((row.causes || []).some(c => !c.cause_description || c.cause_description.trim() === "")) {
      badCodes.push(row.obd_code);
    }
  }
  rs += 1000;
}

console.log(`Found ${badCodes.length} codes with empty descriptions`);

let ok = 0, fail = 0;
for (const code of badCodes) {
  const { data: obd } = await supabase.from("obd_codes").select("title").eq("code", code).single();

  const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${DK}` },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: `Car diagnostic expert. Generate a diagnostic cause for an OBD code. "cause_description" MUST be specific and detailed (30+ characters). Never empty.\n\nReturn ONLY: {"diagnostic_causes":[{"cause_description":"<SPECIFIC 30+ CHARS>","symptom_keywords":["kw1","kw2"],"probability":50,"verification_steps":[{"level":"no_tools|basic_tools|obd_scanner|shop","method":"<actionable step>","verdict":"If X → Y"}]}]}\n\nRepair catalog:\n${cat}` },
        { role: "user", content: `${code} | ${obd?.title || ""}` }
      ],
      temperature: 0.3, max_tokens: 2000,
    }),
  });

  const j = await res.json();
  const txt = j.choices?.[0]?.message?.content || "";
  let p;
  try { p = JSON.parse(txt.replace(/```json\n?|```/g, "").trim()); } catch (e) {
    const s = txt.indexOf("{");
    if (s === -1) { fail++; continue; }
    try { p = JSON.parse(txt.substring(s).replace(/,\s*}/g, "}").replace(/,\s*]/g, "]")); } catch { fail++; continue; }
  }

  if (!p.diagnostic_causes?.length || p.diagnostic_causes.some(d => !d.cause_description || d.cause_description.length < 10)) {
    console.log(`  ${code} ✗ still empty`);
    fail++;
    continue;
  }

  const diags = p.diagnostic_causes.map((d, i) => {
    const r = repairs.find(x => x.repair_slug === d.repair_slug) || null;
    return {
      cause_index: i,
      cause_description: d.cause_description,
      probability: d.probability || 50,
      symptom_keywords: d.symptom_keywords || [],
      repair_slug: r?.repair_slug || null,
      repair_name: r?.repair_name || null,
      difficulty_label: r?.difficulty_label || null,
      est_time: r?.est_time || null,
      verification_steps: (d.verification_steps || []).map(v => ({
        level: v.level || "basic_tools",
        method: v.method || "",
        verdict: v.verdict || "",
      })),
    };
  });

  await supabase.from("obd_diagnostic_steps").upsert({
    obd_code: code,
    causes: diags,
    generated_at: new Date().toISOString(),
  }, { onConflict: "obd_code" });

  ok++;
  if (ok % 10 === 0) console.log(`  ${ok}/${badCodes.length} done`);
}

console.log(`Done: ${ok}✓ ${fail}✗`);
