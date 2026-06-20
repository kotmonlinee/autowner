/**
 * Enrich existing diagnoses with verification_steps + faq.
 * 300 concurrent workers, 1 diagnosis per API call.
 * Usage: node scripts/enrich-diagnoses.mjs
 */
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const DK = process.env.DEEPSEEK_API_KEY;
const CONCURRENCY = 300;

const SYSTEM = `ASE master tech. Enrich a car diagnosis with verification steps and FAQ. Do NOT change any existing fields — ONLY add new ones.

For each cause: add "verification_steps" — array of 3 steps (easiest→hardest). Specific, actionable, written for car owner.
For the diagnosis: add "faq" — array of 3 Q&A: "How urgent is this repair?", "Can I drive with this issue?", "What happens if I ignore this?"

Input: {title, severity, causes: [{description, likelihood}], whatToDo}
Output: same object with causes[].verification_steps[3] and faq[3] added.

Return ONLY the enriched JSON object, no markdown, no explanation.`;

async function enrichOne(row) {
  const d = row.diagnosis_json;
  const input = {
    title: (d.title || "").replace(/[\n\r\t"]+/g, " ").substring(0, 200),
    severity: d.severity || "medium",
    causes: (d.causes || []).map(c => ({ description: (c.description || "").replace(/[\n\r\t"]+/g, " ").substring(0, 200), likelihood: c.likelihood || "possible" })),
    whatToDo: (d.whatToDo || "").replace(/[\n\r\t"]+/g, " ").substring(0, 300),
  };

  try {
    const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${DK}` },
      body: JSON.stringify({ model: "deepseek-chat", messages: [{ role: "system", content: SYSTEM }, { role: "user", content: JSON.stringify(input) }], temperature: 0.3, max_tokens: 4000 }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || "";
    let enriched;
    try { enriched = JSON.parse(content.replace(/```json\n?|```/g, "").trim()); } catch {
      const s = content.indexOf("{");
      if (s >= 0) try { enriched = JSON.parse(content.substring(s).replace(/[\x00-\x08\x0B-\x1F]/g, " ").replace(/,\s*}/g, "}").replace(/,\s*]/g, "]")); } catch { return null; }
      else return null;
    }
    if (!enriched?.faq) return null;

    const updated = { ...d, faq: enriched.faq, causes: [] };
    for (let k = 0; k < (d.causes || []).length; k++) {
      const oc = d.causes[k];
      const vs = enriched.causes?.[k]?.verification_steps || [];
      updated.causes.push({ ...oc, verification_steps: vs });
    }
    await s.from("diagnoses").update({ diagnosis_json: updated }).eq("id", row.id);
    return true;
  } catch { return null; }
}

async function main() {
  const allRows = [];
  let rs = 0;
  while (true) {
    const { data } = await s.from("diagnoses").select("id,diagnosis_json").range(rs, rs + 999);
    if (!data?.length) break;
    for (const r of data) { if (!r.diagnosis_json?.faq) allRows.push(r); }
    rs += 1000;
  }
  console.log(`Enriching ${allRows.length} diagnoses with ${CONCURRENCY} workers...`);

  const queue = [...allRows];
  let done = 0, ok = 0;

  async function worker() {
    while (queue.length > 0) {
      const row = queue.shift();
      if (!row) break;
      const result = await enrichOne(row);
      done++;
      if (result) ok++;
      if (done % 500 === 0 || done === allRows.length) {
        console.log(`  ${done}/${allRows.length} (${(done/allRows.length*100).toFixed(0)}%) | ${ok}✓`);
      }
    }
  }

  const workers = Array.from({ length: CONCURRENCY }, () => worker());
  await Promise.all(workers);
  console.log(`Done: ${ok}/${allRows.length} enriched`);
}
main();
