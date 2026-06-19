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

const codes = ["P0171", "P0002", "P0300", "P0420", "P0442", "B0043", "P001A", "P2DB1", "C0001", "U0100"];
const items = [];
for (const code of codes) {
  const { data } = await s.from("obd_codes").select("fixes_json").eq("code", code).single();
  (data?.fixes_json || []).forEach((text, i) => { if (text.trim()) items.push({ code, fix_index: i, text }); });
}

console.log(`Testing ${items.length} fix items across ${codes.length} codes...`);
const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
  method: "POST",
  headers: { "Content-Type": "application/json", Authorization: `Bearer ${DK}` },
  body: JSON.stringify({
    model: "deepseek-chat",
    messages: [
      { role: "system", content: SYS },
      { role: "user", content: JSON.stringify(items) },
    ],
    temperature: 0.1,
    max_tokens: 8000,
  }),
});
const data = await res.json();
const content = data.choices?.[0]?.message?.content || "";
const results = JSON.parse(content.replace(/```json\n?|```/g, "").trim());

const byCode = new Map();
for (const r of results) {
  if (!byCode.has(r.code)) byCode.set(r.code, []);
  byCode.get(r.code).push(r);
}

let ok = 0, fail = 0;
for (const code of codes) {
  console.log(`\n${code}:`);
  const { data: obd } = await s.from("obd_codes").select("fixes_json").eq("code", code).single();
  (obd?.fixes_json || []).forEach((fix, i) => {
    const r = byCode.get(code)?.find(r => r.fix_index === i);
    const slug = r?.repair_slug || "null";
    const valid = slug === "null" || !slug || slugs.includes(slug);
    console.log(`  ${valid ? "✅" : "❌"} [${i}] ${fix.substring(0, 55)} → ${slug}`);
    if (valid) ok++; else fail++;
  });
}
console.log(`\nValid: ${ok}, Invalid slugs: ${fail}`);
