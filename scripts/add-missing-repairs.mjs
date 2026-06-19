/**
 * Add missing repair types to diy_difficulty and repair_costs tables.
 * Usage: node scripts/add-missing-repairs.mjs
 */
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const NEW_REPAIRS = [
  {
    slug: "wiring_harness_repair",
    name: "Wiring Harness / Connector Repair",
    difficulty: 2, label: "Intermediate", diy: "Maybe",
    time: "1–3h", risk: "Medium",
    tools: "Multimeter, wire stripper, soldering iron, heat shrink, electrical tape, contact cleaner",
    safety: "Disconnect battery before working on electrical systems. Use proper gauge wire for repairs.",
    costs: [
      { tier: "economy", make: "Honda", model: "Civic", min: 80, max: 250 },
      { tier: "mid_range", make: "Ford", model: "F-150", min: 100, max: 350 },
      { tier: "luxury", make: "BMW", model: "3 Series", min: 200, max: 600 },
      { tier: "truck_suv", make: "Chevrolet", model: "Tahoe", min: 120, max: 400 },
      { tier: "european", make: "Audi", model: "A4", min: 250, max: 700 },
    ],
  },
  {
    slug: "ecm_replacement",
    name: "ECM/PCM Replacement & Programming",
    difficulty: 4, label: "Advanced", diy: "No",
    time: "2–4h", risk: "High",
    tools: "Professional scan tool with programming capability, socket set, anti-static strap",
    safety: "ECM replacement requires dealer-level programming. Incorrect installation can cause no-start condition or damage other modules.",
    costs: [
      { tier: "economy", make: "Honda", model: "Civic", min: 500, max: 1200 },
      { tier: "mid_range", make: "Ford", model: "F-150", min: 600, max: 1500 },
      { tier: "luxury", make: "BMW", model: "3 Series", min: 1000, max: 2500 },
      { tier: "truck_suv", make: "Chevrolet", model: "Tahoe", min: 700, max: 1800 },
      { tier: "european", make: "Audi", model: "A4", min: 1200, max: 2800 },
    ],
  },
  {
    slug: "fuse_relay_replacement",
    name: "Fuse or Relay Replacement",
    difficulty: 1, label: "Beginner", diy: "Yes",
    time: "15–30min", risk: "Low",
    tools: "Fuse puller, multimeter, replacement fuse/relay of correct amperage",
    safety: "Always use the exact amperage fuse specified. Using higher amperage can cause electrical fire.",
    costs: [
      { tier: "economy", make: "Honda", model: "Civic", min: 5, max: 80 },
      { tier: "mid_range", make: "Ford", model: "F-150", min: 10, max: 100 },
      { tier: "luxury", make: "BMW", model: "3 Series", min: 15, max: 150 },
      { tier: "truck_suv", make: "Chevrolet", model: "Tahoe", min: 10, max: 100 },
      { tier: "european", make: "Audi", model: "A4", min: 15, max: 150 },
    ],
  },
  {
    slug: "transmission_fluid_flush",
    name: "Transmission Fluid Flush & Refill",
    difficulty: 2, label: "Intermediate", diy: "Maybe",
    time: "1–2h", risk: "Medium",
    tools: "Fluid pump, drain pan, torque wrench, OEM-spec transmission fluid, filter kit",
    safety: "Use only the manufacturer-specified transmission fluid. Wrong fluid can destroy the transmission.",
    costs: [
      { tier: "economy", make: "Honda", model: "Civic", min: 120, max: 280 },
      { tier: "mid_range", make: "Ford", model: "F-150", min: 150, max: 350 },
      { tier: "luxury", make: "BMW", model: "3 Series", min: 300, max: 600 },
      { tier: "truck_suv", make: "Chevrolet", model: "Tahoe", min: 180, max: 400 },
      { tier: "european", make: "Audi", model: "A4", min: 300, max: 650 },
    ],
  },
  {
    slug: "battery_terminal_service",
    name: "Battery Terminal & Ground Connection Service",
    difficulty: 1, label: "Beginner", diy: "Yes",
    time: "15–45min", risk: "Low",
    tools: "Wire brush, baking soda, dielectric grease, 10mm wrench, terminal cleaner",
    safety: "Disconnect negative terminal first, reconnect last. Avoid creating sparks near battery.",
    costs: [
      { tier: "economy", make: "Honda", model: "Civic", min: 0, max: 50 },
      { tier: "mid_range", make: "Ford", model: "F-150", min: 20, max: 80 },
      { tier: "luxury", make: "BMW", model: "3 Series", min: 30, max: 120 },
      { tier: "truck_suv", make: "Chevrolet", model: "Tahoe", min: 20, max: 80 },
      { tier: "european", make: "Audi", model: "A4", min: 30, max: 120 },
    ],
  },
  {
    slug: "smoke_test_vacuum_leak",
    name: "Smoke Test & Vacuum Leak Diagnosis",
    difficulty: 2, label: "Intermediate", diy: "Maybe",
    time: "30min–1h", risk: "Low",
    tools: "Smoke machine, UV dye (optional), carb cleaner spray, vacuum gauge",
    safety: "Engine should be cold when working around intake components. Avoid spraying carb cleaner near ignition sources.",
    costs: [
      { tier: "economy", make: "Honda", model: "Civic", min: 80, max: 180 },
      { tier: "mid_range", make: "Ford", model: "F-150", min: 100, max: 250 },
      { tier: "luxury", make: "BMW", model: "3 Series", min: 150, max: 350 },
      { tier: "truck_suv", make: "Chevrolet", model: "Tahoe", min: 100, max: 250 },
      { tier: "european", make: "Audi", model: "A4", min: 150, max: 380 },
    ],
  },
];

// Insert into diy_difficulty
console.log("Inserting into diy_difficulty...");
for (const r of NEW_REPAIRS) {
  const { error } = await supabase.from("diy_difficulty").upsert({
    repair_slug: r.slug,
    repair_name: r.name,
    difficulty_level: r.difficulty,
    difficulty_label: r.label,
    diy_friendly: r.diy,
    est_time: r.time,
    risk_level: r.risk,
    tools: r.tools,
    safety: r.safety,
    has_variability: true,
  }, { onConflict: "repair_slug" });
  if (error) console.log(`  ${r.slug} ERROR: ${error.message}`);
  else console.log(`  ${r.slug} ✓`);
}

// Insert into repair_costs
console.log("Inserting into repair_costs...");
let rcCount = 0;
for (const r of NEW_REPAIRS) {
  for (const c of r.costs) {
    const { error } = await supabase.from("repair_costs").upsert({
      repair_slug: r.slug,
      repair_name: r.name,
      make: c.make,
      model: c.model,
      tier: c.tier,
      min_cost: c.min,
      max_cost: c.max,
      avg_cost: Math.round((c.min + c.max) / 2),
    }, { onConflict: "repair_slug,make,model" });
    if (error) console.log(`  ${r.slug}/${c.make} ${c.model} ERROR: ${error.message}`);
    else rcCount++;
  }
}
console.log(`  ${rcCount} repair_costs entries added`);

// Repair matching is handled by ai-repair-match.mjs — do NOT run keyword matching here.
