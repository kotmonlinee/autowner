// Usage: node scripts/final-backfill.mjs
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const env = {};
readFileSync(".env.local", "utf8").split("\n").forEach(l => {
  const p = l.split("=");
  if (p.length > 1) env[p[0].trim()] = p.slice(1).join("=").trim();
});
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function callDeepSeek(prompt) {
  const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${env.DEEPSEEK_API_KEY}` },
    body: JSON.stringify({ model: "deepseek-chat", messages: [{ role: "user", content: prompt }], temperature: 0.3, max_tokens: 1000 }),
  });
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

async function main() {
  // Step 1: Add 5 missing repairs
  const NEW = [
    { slug: "abs_module", name: "ABS Module Replacement" },
    { slug: "brake_hose", name: "Brake Hose Replacement" },
    { slug: "heater_hose", name: "Heater Hose Replacement" },
    { slug: "oil_pump", name: "Oil Pump Replacement" },
    { slug: "transmission_pan_gasket", name: "Transmission Pan Gasket Replacement" },
  ];

  const { data: existing } = await supabase.from("diy_difficulty").select("repair_slug");
  const existingSet = new Set((existing ?? []).map(r => r.repair_slug));
  const toAdd = NEW.filter(r => !existingSet.has(r.slug));

  if (toAdd.length > 0) {
    const prompt = `Generate DIY data for these repairs. Return ONLY JSON: {"repair_slug":{"difficulty_level":1-5,"difficulty_label":"Beginner"|"Easy"|"Intermediate"|"Advanced"|"Professional","diy_friendly":"Yes"|"Maybe"|"No","est_time":"1–2h","risk_level":"Low"|"Medium"|"High"|"Very High","tools":"tool list","safety":"safety note","has_variability":true|false}}\n\n${toAdd.map(r => `${r.slug} (${r.name})`).join("\n")}`;

    const content = await callDeepSeek(prompt);
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const data = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

    for (const r of toAdd) {
      const d = data[r.slug];
      if (!d) continue;
      await supabase.from("diy_difficulty").insert({
        repair_slug: r.slug, repair_name: r.name,
        difficulty_level: d.difficulty_level, difficulty_label: d.difficulty_label,
        diy_friendly: d.diy_friendly, est_time: d.est_time,
        risk_level: d.risk_level, tools: d.tools, safety: d.safety,
        has_variability: d.has_variability ?? false,
      });
      console.log(`+ ${r.slug}`);
    }
  }

  // Step 2: Manual mapping for name-matching failures
  const MANUAL_MAP = {
    "Lifter Issue": "lifter_replacement",
    "Piston Ring Failure": "piston_rings",
    "Rod Bearing Failure": "rod_bearings",
    "Sway Bar Link Failure": "sway_bar_links",
    "Unbalanced Tires": "tire_balance",
    "Unbalanced Wheels": "tire_balance",
    "Worn Tires": "tire_replacement",
    "Valve Seal Failure": "valve_seals",
    "ABS Module Failure": "abs_module",
    "Brake Hose Failure": "brake_hose",
    "Heater Hose Failure": "heater_hose",
    "Oil Pump Failure": "oil_pump",
    "Transmission Pan Gasket Failure": "transmission_pan_gasket",
  };

  const { data: causes } = await supabase.from("symptom_causes").select("*").is("repair_slug", null);
  let backfilled = 0;
  for (const c of (causes ?? [])) {
    const slug = MANUAL_MAP[c.cause_name];
    if (slug) {
      await supabase.from("symptom_causes").update({ repair_slug: slug }).eq("id", c.id);
      backfilled++;
      console.log(`✓ ${c.cause_name} → ${slug}`);
    } else {
      console.log(`✗ ${c.cause_name} — too vague`);
    }
  }
  console.log(`\nBackfilled: ${backfilled}/${(causes??[]).length}`);
}

main().catch(console.error);
