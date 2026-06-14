// Usage: node scripts/expand-knowledge-graph.mjs
// Expands symptom_obd_codes and backfills symptom_causes.repair_slug
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

if (!DEEPSEEK_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing env vars");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function callDeepSeek(prompt) {
  const res = await fetch(DEEPSEEK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${DEEPSEEK_KEY}` },
    body: JSON.stringify({ model: "deepseek-chat", messages: [{ role: "user", content: prompt }], temperature: 0.3, max_tokens: 500 }),
  });
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

async function main() {
  // Load all data
  const [{ data: symptoms }, { data: diyList }] = await Promise.all([
    supabase.from("symptoms").select("*").order("name"),
    supabase.from("diy_difficulty").select("repair_slug, repair_name"),
  ]);
  if (!symptoms) { console.error("No symptoms"); return; }
  const diyItems = (diyList ?? []);
  console.log(`Loaded ${symptoms.length} symptoms, ${diyItems.length} DIY entries`);

  // ── Step 1: Backfill symptom_causes.repair_slug ──
  const { data: causes } = await supabase.from("symptom_causes").select("*");
  const causesWithoutSlug = (causes ?? []).filter(c => !c.repair_slug);
  console.log(`\n=== Step 1: Backfill repair_slug for ${causesWithoutSlug.length} causes ===`);
  let backfilled = 0;
  for (const c of causesWithoutSlug) {
    const nameLower = c.cause_name.toLowerCase();
    // Direct match against diy_difficulty.repair_name
    let match = diyItems.find(r =>
      r.repair_name.toLowerCase().includes(nameLower) ||
      nameLower.includes(r.repair_name.toLowerCase())
    );
    // Try slug match
    if (!match) {
      const slugified = nameLower.replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
      match = diyItems.find(r =>
        r.repair_slug.includes(slugified) || slugified.includes(r.repair_slug)
      );
    }
    if (match) {
      await supabase.from("symptom_causes").update({ repair_slug: match.repair_slug }).eq("id", c.id);
      backfilled++;
      console.log(`  ✓ ${c.cause_name} → ${match.repair_slug}`);
    } else {
      console.log(`  ✗ ${c.cause_name} — no match`);
    }
  }
  console.log(`  Backfilled: ${backfilled}/${causesWithoutSlug.length}`);

  // ── Step 2: Expand symptom_obd_codes for symptoms without OBD codes ──
  const { data: existingObd } = await supabase.from("symptom_obd_codes").select("symptom_id, obd_code");
  const symptomObdMap = new Map();
  for (const r of (existingObd ?? [])) {
    if (!symptomObdMap.has(r.symptom_id)) symptomObdMap.set(r.symptom_id, []);
    symptomObdMap.get(r.symptom_id).push(r.obd_code);
  }
  console.log(`\n=== Step 2: Generate OBD codes for all 58 symptoms ===`);
  let obdAdded = 0;

  for (let i = 0; i < symptoms.length; i++) {
    const s = symptoms[i];
    console.log(`[${i + 1}/${symptoms.length}] ${s.name}...`);

    // Get causes for this symptom
    const symptomCauses = (causes ?? []).filter(c => c.symptom_id === s.id);
    const causeList = symptomCauses.slice(0, 5).map(c => c.cause_name).join(", ");

    const prompt = `You are an ASE-certified master technician. For the automotive symptom "${s.name}" (category: ${s.category}, severity: ${s.severity}), common causes: ${causeList || "unknown"}.

Return a JSON array of the 3-5 most relevant OBD-II diagnostic trouble codes (e.g., ["P0300", "P0420"]). Only include codes that are genuinely associated with this symptom. Return ONLY the JSON array, nothing else.`;

    try {
      const content = await callDeepSeek(prompt);
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (!jsonMatch) { console.log("  ⚠ No JSON found"); continue; }
      const codes = JSON.parse(jsonMatch[0]);
      if (!Array.isArray(codes)) { console.log("  ⚠ Not an array"); continue; }

      for (const code of codes) {
        // Skip duplicates
        const { data: existing } = await supabase.from("symptom_obd_codes")
          .select("id").eq("symptom_id", s.id).eq("obd_code", code).maybeSingle();
        if (existing) continue;
        await supabase.from("symptom_obd_codes").insert({ symptom_id: s.id, obd_code: code });
        obdAdded++;
      }
      console.log(`  ✓ ${codes.join(", ")}`);
    } catch (e) {
      console.log(`  ✗ Error: ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 1200));
  }
  console.log(`  OBD codes added: ${obdAdded}`);
  console.log("\nDone!");
}

main().catch(console.error);
