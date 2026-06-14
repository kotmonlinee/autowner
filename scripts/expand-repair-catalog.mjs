// Usage: node scripts/expand-repair-catalog.mjs
// Uses DeepSeek to generate DIY difficulty data for new repair types
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
    body: JSON.stringify({ model: "deepseek-chat", messages: [{ role: "user", content: prompt }], temperature: 0.3, max_tokens: 2000 }),
  });
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

const NEW_REPAIRS = [
  { slug: "abs_sensor", name: "ABS Sensor Replacement" },
  { slug: "ignition_switch", name: "Ignition Switch Replacement" },
  { slug: "crankshaft_position_sensor", name: "Crankshaft Position Sensor Replacement" },
  { slug: "camshaft_position_sensor", name: "Camshaft Position Sensor Replacement" },
  { slug: "throttle_position_sensor", name: "Throttle Position Sensor Replacement" },
  { slug: "oil_pressure_sensor", name: "Oil Pressure Sensor Replacement" },
  { slug: "wheel_speed_sensor", name: "Wheel Speed Sensor Replacement" },
  { slug: "cooling_fan", name: "Cooling Fan Replacement" },
  { slug: "master_cylinder", name: "Master Cylinder Replacement" },
  { slug: "brake_line", name: "Brake Line Replacement" },
  { slug: "steering_rack", name: "Steering Rack Replacement" },
  { slug: "sway_bar_links", name: "Sway Bar Link Replacement" },
  { slug: "wheel_alignment", name: "Wheel Alignment" },
  { slug: "tire_balance", name: "Tire Balance" },
  { slug: "tire_replacement", name: "Tire Replacement" },
  { slug: "oil_pan_gasket", name: "Oil Pan Gasket Replacement" },
  { slug: "rear_main_seal", name: "Rear Main Seal Replacement" },
  { slug: "intake_manifold_gasket", name: "Intake Manifold Gasket Replacement" },
  { slug: "piston_rings", name: "Piston Ring Replacement" },
  { slug: "turbocharger", name: "Turbocharger Replacement" },
  { slug: "valve_adjustment", name: "Valve Adjustment" },
  { slug: "idle_air_control_valve", name: "Idle Air Control Valve Replacement" },
  { slug: "evap_system", name: "EVAP System Diagnosis & Repair" },
  { slug: "blend_door_actuator", name: "Blend Door Actuator Replacement" },
  { slug: "driveshaft", name: "Driveshaft Replacement" },
  { slug: "transmission_seal", name: "Transmission Seal Replacement" },
  { slug: "power_steering_hose", name: "Power Steering Hose Replacement" },
  { slug: "vacuum_leak", name: "Vacuum Leak Diagnosis & Repair" },
  { slug: "heat_shield", name: "Heat Shield Repair" },
  { slug: "neutral_safety_switch", name: "Neutral Safety Switch Replacement" },
  { slug: "rod_bearings", name: "Rod Bearing Replacement" },
  { slug: "lifter_replacement", name: "Lifter Replacement" },
  { slug: "valve_seals", name: "Valve Seal Replacement" },
  { slug: "steering_angle_sensor", name: "Steering Angle Sensor Replacement" },
];

// Level mapping based on general automotive knowledge
const LEVEL_HINTS = {
  abs_sensor: "L3", ignition_switch: "L3", crankshaft_position_sensor: "L4",
  camshaft_position_sensor: "L4", throttle_position_sensor: "L3", oil_pressure_sensor: "L3",
  wheel_speed_sensor: "L2", cooling_fan: "L3", master_cylinder: "L4",
  brake_line: "L4", steering_rack: "L5", sway_bar_links: "L3",
  wheel_alignment: "L3 (requires alignment machine)", tire_balance: "L2 (requires balancer machine)",
  tire_replacement: "L2 (requires mounting machine)", oil_pan_gasket: "L4",
  rear_main_seal: "L5", intake_manifold_gasket: "L4", piston_rings: "L5",
  turbocharger: "L5", valve_adjustment: "L4", idle_air_control_valve: "L2",
  evap_system: "L3 (requires smoke machine)", blend_door_actuator: "L4 (dash removal)",
  driveshaft: "L4", transmission_seal: "L4", power_steering_hose: "L3",
  vacuum_leak: "L2 (diagnosis), L3 (repair)", heat_shield: "L1",
  neutral_safety_switch: "L3", rod_bearings: "L5", lifter_replacement: "L5",
  valve_seals: "L5", steering_angle_sensor: "L4 (requires calibration)",
};

async function main() {
  // Filter out already-existing slugs
  const { data: existing } = await supabase.from("diy_difficulty").select("repair_slug");
  const existingSet = new Set((existing ?? []).map(r => r.repair_slug));
  const toAdd = NEW_REPAIRS.filter(r => !existingSet.has(r.slug));

  if (toAdd.length === 0) { console.log("All repairs already exist"); return; }
  console.log(`${toAdd.length} new repairs to add\n`);

  const BATCH_SIZE = 4;
  let added = 0;

  for (let i = 0; i < toAdd.length; i += BATCH_SIZE) {
    const batch = toAdd.slice(i, i + BATCH_SIZE);
    const batchDesc = batch.map(r => `${r.slug} ("${r.name}", ~${LEVEL_HINTS[r.slug] || "L3"})`).join("\n");

    const prompt = `You are an ASE master technician. Generate DIY difficulty data for these automotive repairs. Return ONLY a JSON object mapping repair_slug to its data.

For each repair, provide:
- difficulty_level: 1 (Beginner) to 5 (Professional only)
- difficulty_label: "Beginner","Easy","Intermediate","Advanced", or "Professional"
- diy_friendly: "Yes","Maybe", or "No"
- est_time: e.g. "1–2h","3–4h","6–8h"
- risk_level: "Low","Medium","High", or "Very High"
- tools: comma-separated list of required tools
- safety: 1-2 sentence safety warning
- has_variability: true if time/cost varies significantly by vehicle, false otherwise

Repairs to generate:
${batchDesc}

Return format: {"repair_slug": {"difficulty_level":3,"difficulty_label":"Intermediate","diy_friendly":"Yes","est_time":"2–3h","risk_level":"Medium","tools":"Jack, jack stands, wrench set","safety":"Always disconnect battery first.","has_variability":false}}`;

    try {
      const content = await callDeepSeek(prompt);
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) { console.log(`Batch ${i}: no JSON`); continue; }
      const data = JSON.parse(jsonMatch[0]);

      for (const r of batch) {
        const d = data[r.slug];
        if (!d) { console.log(`  ⚠ ${r.slug} — no data`); continue; }
        await supabase.from("diy_difficulty").insert({
          repair_slug: r.slug,
          repair_name: r.name,
          difficulty_level: d.difficulty_level,
          difficulty_label: d.difficulty_label,
          diy_friendly: d.diy_friendly,
          est_time: d.est_time,
          risk_level: d.risk_level,
          tools: d.tools,
          safety: d.safety,
          has_variability: d.has_variability ?? false,
        });
        added++;
        console.log(`  ✓ ${r.slug} (${r.name}) — L${d.difficulty_level} ${d.diy_friendly}`);
      }
    } catch (e) {
      console.log(`  ✗ Batch error: ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 1500));
  }

  console.log(`\nAdded ${added} repairs. Now backfilling symptom_causes...`);

  // Backfill remaining causes
  const { data: causes } = await supabase.from("symptom_causes").select("*");
  const causesWithoutSlug = (causes ?? []).filter(c => !c.repair_slug);

  // Name-to-slug mapping for new repairs
  const allDiy = await supabase.from("diy_difficulty").select("repair_slug, repair_name");
  const diyItems = (allDiy.data ?? []);

  let backfilled = 0;
  for (const c of causesWithoutSlug) {
    const nameLower = c.cause_name.toLowerCase();
    let match = diyItems.find(r =>
      r.repair_name.toLowerCase().includes(nameLower) ||
      nameLower.includes(r.repair_name.toLowerCase())
    );
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
    }
  }
  console.log(`\nBackfilled: ${backfilled}/${causesWithoutSlug.length}`);
  console.log("Done!");
}

main().catch(console.error);
