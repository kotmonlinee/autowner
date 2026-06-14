// Usage: node scripts/denoise-obd-symptoms.mjs
// Uses DeepSeek to prune OBD↔symptom mappings to only direct relevance
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const env = {};
readFileSync(".env.local", "utf8").split("\n").forEach(l => {
  const p = l.split("=");
  if (p.length > 1) env[p[0].trim()] = p.slice(1).join("=").trim();
});

const DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions";
const DEEPSEEK_KEY = env.DEEPSEEK_API_KEY ?? "";
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY ?? "";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function callDeepSeek(prompt) {
  const res = await fetch(DEEPSEEK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${DEEPSEEK_KEY}` },
    body: JSON.stringify({ model: "deepseek-chat", messages: [{ role: "user", content: prompt }], temperature: 0.1, max_tokens: 1000 }),
  });
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

async function main() {
  // Get all distinct OBD codes
  const { data: allMappings } = await supabase.from("symptom_obd_codes").select("obd_code, symptom_id");
  const { data: symptoms } = await supabase.from("symptoms").select("id, slug, name, category").order("name");

  const symptomMap = new Map(symptoms.map(s => [s.id, s]));
  const codeMap = new Map();
  for (const m of (allMappings ?? [])) {
    if (!codeMap.has(m.obd_code)) codeMap.set(m.obd_code, []);
    codeMap.get(m.obd_code).push(symptomMap.get(m.symptom_id));
  }

  const codes = [...codeMap.keys()].sort();
  console.log(`${codes.length} unique OBD codes to review\n`);

  const BATCH_SIZE = 5;
  let removed = 0, kept = 0;

  for (let i = 0; i < codes.length; i += BATCH_SIZE) {
    const batch = codes.slice(i, i + BATCH_SIZE);
    const batchDesc = batch.map(code => {
      const linked = codeMap.get(code) ?? [];
      return `${code}: ${linked.map(s => s?.name ?? "?").join(" | ")}`;
    }).join("\n");

    const prompt = `You are an ASE master technician. Review each OBD-II code and its currently associated symptoms. KEEP only symptoms that are DIRECTLY indicated by this specific code. REMOVE symptoms that are only loosely related or share indirect causes.

Rules:
- P0300 (random misfire) → keep: engine-misfire, rough-idle, check-engine-light-flashing. Remove: general vibration, power loss, poor acceleration, highway vibration.
- P0420 (catalyst efficiency) → keep: check-engine-light-on, rotten-egg-smell. Remove: general engine performance issues.
- P0171 (lean bank 1) → keep: engine-hesitation, rough-idle, poor-acceleration. Remove: general starting problems.
- Brake codes (C-series) → only keep brake-specific symptoms, remove general noise/vibration.
- If unsure, KEEP the symptom.

Current mappings:
${batchDesc}

Return ONLY a JSON object mapping each OBD code to an array of symptom names to KEEP (exact names as shown above). Format: {"P0300": ["Engine Misfire", "Rough Idle"], "P0420": ["Check Engine Light On"]}`;

    try {
      const content = await callDeepSeek(prompt);
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) { console.log(`Batch ${i}: no JSON`); continue; }
      const keepMap = JSON.parse(jsonMatch[0]);

      for (const code of batch) {
        const keepNames = keepMap[code];
        if (!Array.isArray(keepNames)) continue;

        const current = codeMap.get(code) ?? [];
        const toKeep = current.filter(s => keepNames.some(n => n.toLowerCase() === s?.name?.toLowerCase()));
        const toRemove = current.filter(s => !toKeep.includes(s));

        if (toRemove.length > 0) {
          const removeIds = toRemove.filter(Boolean).map(s => s.id);
          if (removeIds.length > 0) {
            await supabase.from("symptom_obd_codes")
              .delete()
              .eq("obd_code", code)
              .in("symptom_id", removeIds);
          }
        }

        removed += toRemove.length;
        kept += toKeep.length;
        console.log(`${code}: ${current.length}→${toKeep.length} (${toRemove.map(s => s?.name).join(", ") || "none removed"})`);
      }
    } catch (e) {
      console.log(`  Batch error: ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 1500));
  }

  // Get final counts
  const { count } = await supabase.from("symptom_obd_codes").select("*", { count: "exact", head: true });
  console.log(`\nRemoved: ${removed}, Kept: ${kept}, Final: ${count}`);
}

main().catch(console.error);
