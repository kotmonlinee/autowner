import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const NEW = [
  {
    slug: "sensor_replacement",
    name: "Sensor Replacement (Generic)",
    difficulty: 2, label: "Intermediate", diy: "Maybe", time: "1–2h", risk: "Medium",
    tools: "Multimeter, socket set, scan tool, dielectric grease",
    safety: "Disconnect battery before replacing electrical sensors. Use OEM sensors for critical engine management components.",
    costs: [
      { make: "Honda", model: "Civic", tier: "economy", min: 80, max: 350, labor: 60, parts: 290 },
      { make: "Ford", model: "F-150", tier: "mid_range", min: 120, max: 450, labor: 90, parts: 360 },
      { make: "BMW", model: "3 Series", tier: "luxury", min: 200, max: 700, labor: 150, parts: 550 },
      { make: "Chevrolet", model: "Tahoe", tier: "truck_suv", min: 150, max: 500, labor: 100, parts: 400 },
      { make: "Audi", model: "A4", tier: "european", min: 220, max: 750, labor: 160, parts: 590 },
    ],
  },
  {
    slug: "throttle_body_service",
    name: "Throttle Body Cleaning / Replacement",
    difficulty: 2, label: "Intermediate", diy: "Maybe", time: "1–2h", risk: "Medium",
    tools: "Throttle body cleaner, socket set, torque wrench, scan tool for relearn",
    safety: "Do not use carb cleaner on coated throttle bodies. Perform idle relearn procedure after cleaning.",
    costs: [
      { make: "Honda", model: "Civic", tier: "economy", min: 80, max: 350, labor: 60, parts: 290 },
      { make: "Ford", model: "F-150", tier: "mid_range", min: 120, max: 500, labor: 90, parts: 410 },
      { make: "BMW", model: "3 Series", tier: "luxury", min: 250, max: 800, labor: 180, parts: 620 },
      { make: "Chevrolet", model: "Tahoe", tier: "truck_suv", min: 150, max: 550, labor: 100, parts: 450 },
      { make: "Audi", model: "A4", tier: "european", min: 280, max: 850, labor: 200, parts: 650 },
    ],
  },
  {
    slug: "ecm_software_update",
    name: "ECM/PCM Software Update / Reprogramming",
    difficulty: 3, label: "Advanced", diy: "No", time: "1–2h", risk: "Medium",
    tools: "Professional scan tool with J2534 pass-thru, battery charger, OEM software subscription",
    safety: "Maintain stable battery voltage during programming (use charger). Interrupted programming can brick the ECM.",
    costs: [
      { make: "Honda", model: "Civic", tier: "economy", min: 100, max: 250, labor: 100, parts: 150 },
      { make: "Ford", model: "F-150", tier: "mid_range", min: 120, max: 300, labor: 120, parts: 180 },
      { make: "BMW", model: "3 Series", tier: "luxury", min: 200, max: 500, labor: 200, parts: 300 },
      { make: "Chevrolet", model: "Tahoe", tier: "truck_suv", min: 150, max: 350, labor: 150, parts: 200 },
      { make: "Audi", model: "A4", tier: "european", min: 250, max: 550, labor: 250, parts: 300 },
    ],
  },
];

// Add to diy_difficulty
console.log("Adding to diy_difficulty...");
for (const r of NEW) {
  const { error } = await supabase.from("diy_difficulty").upsert({
    repair_slug: r.slug, repair_name: r.name,
    difficulty_level: r.difficulty, difficulty_label: r.label,
    diy_friendly: r.diy, est_time: r.time, risk_level: r.risk,
    tools: r.tools, safety: r.safety, has_variability: true,
  }, { onConflict: "repair_slug" });
  console.log(`  ${r.slug}: ${error ? error.message : "✓"}`);
}

// Add to repair_costs
console.log("Adding to repair_costs...");
let rcCount = 0;
for (const r of NEW) {
  for (const c of r.costs) {
    const { error } = await supabase.from("repair_costs").upsert({
      repair_slug: r.slug, repair_name: r.name,
      make: c.make, model: c.model, tier: c.tier,
      min_cost: c.min, max_cost: c.max, avg_cost: Math.round((c.min + c.max) / 2),
      labor_cost: c.labor, parts_cost: c.max - c.labor, confidence_level: "medium",
    }, { onConflict: "repair_slug,make,model" });
    if (error) console.log(`  ${r.slug}/${c.make} ${c.model}: ${error.message}`);
    else rcCount++;
  }
}
console.log(`  ${rcCount} entries added`);

// Repair matching is handled by ai-repair-match.mjs — do NOT run keyword matching here.
