// Batch generate AI diagnosis articles from the decision tree
// Run: npx tsx scripts/generate-diagnoses.ts
// Generates 91 base + 91×20 vehicles = 1,911 articles

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY!;

interface Option {
  key: string; label: string;
}

interface Step2Option extends Option {
  step3s: Option[];
}

// Decision tree — same structure as src/lib/diagnosis-tree.ts
const STEP1: Option[] = [
  { key: "noise", label: "Unusual noise or sound" },
  { key: "smell", label: "Strange smell or odor" },
  { key: "vibration", label: "Vibration or shaking" },
  { key: "power", label: "Power loss or weak acceleration" },
  { key: "dash-light", label: "Dashboard warning light is on" },
  { key: "starting", label: "Hard to start or won't start" },
  { key: "fluid", label: "Fluid leaking under the car" },
  { key: "climate", label: "AC not cold or smells bad" },
  { key: "brakes-steering", label: "Brake or steering issue" },
  { key: "other", label: "Something else is wrong" },
];

const STEP2: Record<string, Step2Option[]> = {
  noise: [
    { key: "engine-bay", label: "From the engine compartment", step3s: [
      { key: "cold-start", label: "On cold start" }, { key: "accelerating", label: "When accelerating" }, { key: "idle", label: "At idle / stopped" }, { key: "always", label: "All the time" },
    ]},
    { key: "wheels-brakes", label: "From the wheels or brakes", step3s: [
      { key: "braking", label: "When braking" }, { key: "driving", label: "While driving" }, { key: "bumps", label: "Over bumps" },
    ]},
    { key: "under-car", label: "From under the car", step3s: [
      { key: "bumps", label: "Over bumps" }, { key: "turning", label: "When turning" }, { key: "always", label: "All the time" },
    ]},
    { key: "inside", label: "Inside the cabin", step3s: [
      { key: "driving", label: "While driving" }, { key: "ac-on", label: "When AC is on" },
    ]},
    { key: "exhaust", label: "From the exhaust", step3s: [
      { key: "accelerating", label: "When accelerating" }, { key: "idle", label: "At idle" },
    ]},
    { key: "unsure", label: "Not sure where it's from", step3s: [
      { key: "always", label: "All the time" },
    ]},
  ],
  smell: [
    { key: "sweet", label: "Sweet smell", step3s: [{ key: "driving", label: "While driving or after parking" }, { key: "ac-on", label: "When AC is on" }] },
    { key: "burning-rubber", label: "Burning rubber smell", step3s: [{ key: "after-driving", label: "After driving or high speed" }] },
    { key: "burning-oil", label: "Burning oil smell", step3s: [{ key: "engine-bay", label: "From the engine bay" }] },
    { key: "gasoline", label: "Gasoline / fuel smell", step3s: [{ key: "cold-start", label: "On cold start" }, { key: "driving", label: "While driving or after refueling" }, { key: "always", label: "All the time" }] },
    { key: "musty", label: "Musty smell", step3s: [{ key: "ac-on", label: "When AC is on" }, { key: "after-rain", label: "After rain" }] },
    { key: "chemical", label: "Sharp chemical smell", step3s: [{ key: "always", label: "All the time" }] },
    { key: "rotten-egg", label: "Rotten egg smell", step3s: [{ key: "accelerating", label: "When accelerating" }] },
  ],
  vibration: [
    { key: "steering-wheel", label: "Steering wheel shakes", step3s: [{ key: "highway", label: "At highway speed" }, { key: "braking", label: "When braking" }, { key: "always", label: "All the time" }] },
    { key: "body-shake", label: "Whole car shakes", step3s: [{ key: "idle", label: "At idle" }, { key: "accelerating", label: "When accelerating" }, { key: "bumps", label: "Over bumps" }, { key: "driving", label: "While driving" }] },
    { key: "seat-floor", label: "Seat or floor vibrates", step3s: [{ key: "idle", label: "At idle" }] },
  ],
  power: [
    { key: "slow-response", label: "Slow throttle response", step3s: [{ key: "always", label: "All the time" }, { key: "hot", label: "Worse when engine is hot" }] },
    { key: "jerking", label: "Jerking or hesitation", step3s: [{ key: "hard-accel", label: "During hard acceleration" }, { key: "low-speed", label: "At low speed" }] },
    { key: "no-power-uphill", label: "No power uphill or under load", step3s: [{ key: "uphill", label: "Uphill or heavy load" }, { key: "always", label: "All the time" }] },
    { key: "rpm-up-no-go", label: "Engine revs but car won't move", step3s: [{ key: "always", label: "All the time" }, { key: "sometimes", label: "Occasionally" }] },
  ],
  "dash-light": [
    { key: "check-engine-yellow", label: "Check Engine light", step3s: [{ key: "no-symptoms", label: "No other symptoms" }, { key: "shaking", label: "With shaking or power loss" }, { key: "flashing", label: "Flashing when accelerating" }] },
    { key: "oil-red", label: "Oil pressure light", step3s: [{ key: "driving", label: "Came on while driving" }] },
    { key: "battery-red", label: "Battery light", step3s: [{ key: "driving", label: "Came on while driving" }] },
    { key: "abs-yellow", label: "ABS light", step3s: [{ key: "always-on", label: "Always on" }] },
    { key: "airbag-yellow", label: "Airbag light", step3s: [{ key: "always-on", label: "Always on" }] },
    { key: "tpms-yellow", label: "Tire pressure light", step3s: [{ key: "always-on", label: "Always on" }] },
  ],
  starting: [
    { key: "clicking", label: "Clicking sound", step3s: [{ key: "always", label: "Every time" }, { key: "sometimes", label: "Occasionally" }] },
    { key: "no-sound", label: "No sound", step3s: [{ key: "always", label: "Every time" }, { key: "sometimes", label: "Occasionally" }] },
    { key: "cranks-no-start", label: "Cranks but won't start", step3s: [{ key: "cold", label: "Engine cold" }, { key: "hot", label: "Engine warm" }] },
    { key: "long-crank", label: "Takes longer to start", step3s: [{ key: "worsening", label: "Getting worse" }] },
    { key: "starts-dies", label: "Starts then dies", step3s: [{ key: "cold", label: "Engine cold" }, { key: "always", label: "Every time" }] },
  ],
  fluid: [
    { key: "oil", label: "Brown/black fluid", step3s: [{ key: "few-drops", label: "Just a few drops" }, { key: "puddle", label: "Noticeable puddle" }] },
    { key: "coolant", label: "Green/orange/pink fluid", step3s: [{ key: "parked", label: "After parking" }, { key: "overheating", label: "Car runs hot" }] },
    { key: "transmission", label: "Red fluid", step3s: [{ key: "parked", label: "After parking" }] },
    { key: "clear-water", label: "Clear water", step3s: [{ key: "ac-on", label: "AC was running" }, { key: "not-ac", label: "AC wasn't on" }] },
  ],
  climate: [
    { key: "not-cold", label: "Not cold", step3s: [{ key: "always", label: "All the time" }, { key: "highway-only", label: "Cold on highway, warm in traffic" }, { key: "starts-cold", label: "Cold at first then warm" }] },
    { key: "weak-airflow", label: "Weak airflow", step3s: [{ key: "always", label: "All the time" }, { key: "intermittent", label: "Comes and goes" }] },
    { key: "musty-smell", label: "Musty smell", step3s: [{ key: "ac-on", label: "When AC is on" }] },
    { key: "no-power", label: "Won't turn on", step3s: [{ key: "always", label: "Doesn't work" }] },
  ],
  "brakes-steering": [
    { key: "heavy-steering", label: "Heavy steering", step3s: [{ key: "always", label: "All the time" }, { key: "low-speed", label: "At low speed" }] },
    { key: "soft-brakes", label: "Soft brake pedal", step3s: [{ key: "always", label: "All the time" }, { key: "hard-stop", label: "During hard braking" }] },
    { key: "hard-brakes", label: "Hard brake pedal", step3s: [{ key: "always", label: "All the time" }] },
    { key: "wont-move", label: "In gear but won't move", step3s: [{ key: "cold", label: "Engine cold" }, { key: "hot", label: "Engine warm" }] },
    { key: "hard-shift", label: "Harsh gear shifts", step3s: [{ key: "every-shift", label: "Every shift" }] },
  ],
  other: [
    { key: "high-fuel", label: "Drop in fuel economy", step3s: [{ key: "recent", label: "Recently started" }, { key: "winter", label: "During winter" }] },
    { key: "heavy-steering-other", label: "Heavy steering", step3s: [{ key: "always", label: "All the time" }, { key: "low-speed", label: "At low speed" }] },
    { key: "soft-brakes-other", label: "Soft brakes", step3s: [{ key: "always", label: "All the time" }, { key: "hard-stop", label: "During hard braking" }] },
    { key: "hard-brakes-other", label: "Hard brake pedal", step3s: [{ key: "always", label: "All the time" }] },
    { key: "wont-move-other", label: "Won't move", step3s: [{ key: "cold", label: "Engine cold" }] },
    { key: "hard-shift-other", label: "Harsh shifts", step3s: [{ key: "every-shift", label: "Every shift" }] },
  ],
};

const TOP_VEHICLES = [
  { make: "Toyota", model: "Camry", year: "2020" },
  { make: "Honda", model: "Civic", year: "2019" },
  { make: "Ford", model: "F-150", year: "2020" },
  { make: "Toyota", model: "RAV4", year: "2020" },
  { make: "Honda", model: "Accord", year: "2019" },
  { make: "Honda", model: "CR-V", year: "2020" },
  { make: "Toyota", model: "Corolla", year: "2019" },
  { make: "Ford", model: "Explorer", year: "2020" },
  { make: "Chevrolet", model: "Silverado 1500", year: "2020" },
  { make: "Nissan", model: "Altima", year: "2019" },
  { make: "Nissan", model: "Rogue", year: "2020" },
  { make: "Jeep", model: "Wrangler", year: "2020" },
  { make: "Ford", model: "Mustang", year: "2020" },
  { make: "BMW", model: "3 Series", year: "2019" },
  { make: "Tesla", model: "Model 3", year: "2020" },
  { make: "Hyundai", model: "Elantra", year: "2019" },
  { make: "Subaru", model: "Outback", year: "2020" },
  { make: "Jeep", model: "Grand Cherokee", year: "2020" },
  { make: "Toyota", model: "Tacoma", year: "2020" },
  { make: "Tesla", model: "Model Y", year: "2021" },
];

function slugify(...parts: string[]): string {
  return parts.join(" ").toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/(^-|-$)/g, "").substring(0, 80);
}

async function callAI(symptoms: string): Promise<any> {
  const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${DEEPSEEK_KEY}` },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are an ASE-certified master technician. Diagnose car problems. Return ONLY JSON: {\"title\":\"...\",\"severity\":\"low|medium|high|critical\",\"summary\":\"...\",\"causes\":[{\"description\":\"...\",\"likelihood\":\"most likely|possible|less common\"}],\"whatToDo\":\"...\",\"costEstimate\":\"...\",\"possibleCodes\":[\"P0420\"],\"repairKeywords\":[\"brake pads\"]}" },
        { role: "user", content: `Diagnose these car symptoms: ${symptoms}` },
      ],
      temperature: 0.3, max_tokens: 800,
    }),
  });
  if (!res.ok) throw new Error(`AI API error: ${res.status}`);
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content ?? "";
  const match = content.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON in response");
  return JSON.parse(match[0]);
}

async function main() {
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
  let totalGenerated = 0;
  let totalSkipped = 0;

  // Generate all 91 base combinations (no vehicle)
  console.log("=== Generating base diagnoses (91 paths, no vehicle) ===\n");
  for (const s1 of STEP1) {
    for (const s2 of (STEP2[s1.key] ?? [])) {
      for (const s3 of s2.step3s) {
        const symptoms = `Vehicle: unknown vehicle. Symptom: ${s1.label}. Location: ${s2.label}. When: ${s3.label}.`;
        const slug = slugify(s1.label, s2.label, s3.label);

        // Check if already exists
        const { data: existing } = await (supabase.from("diagnoses") as any).select("slug").eq("slug", slug).maybeSingle();
        if (existing) { totalSkipped++; continue; }

        try {
          console.log(`  Generating: ${slug}...`);
          const diag = await callAI(symptoms);
          await (supabase.from("diagnoses") as any).insert({
            slug, symptom_path: symptoms.substring(0, 200),
            diagnosis_json: diag, view_count: 1,
          });
          totalGenerated++;
          console.log(`    → ${diag.title} (${diag.severity})`);
        } catch (e: any) {
          console.error(`    ✗ Failed: ${e.message}`);
        }
      }
    }
  }
  console.log(`\nBase diagnoses: ${totalGenerated} generated, ${totalSkipped} skipped (already exist)\n`);

  // Generate vehicle-specific combinations
  console.log("=== Generating vehicle-specific diagnoses (91×20) ===\n");
  let vehicleTotal = 0;
  let vehicleSkipped = 0;

  for (const v of TOP_VEHICLES) {
    console.log(`\n--- ${v.make} ${v.model} ${v.year} ---`);
    for (const s1 of STEP1) {
      for (const s2 of (STEP2[s1.key] ?? [])) {
        for (const s3 of s2.step3s) {
          const vehicleStr = `${v.make} ${v.model} ${v.year}`;
          const symptoms = `Vehicle: ${vehicleStr}. Symptom: ${s1.label}. Location: ${s2.label}. When: ${s3.label}.`;
          const slug = slugify(s1.label, s2.label, s3.label, vehicleStr);

          const { data: existing } = await (supabase.from("diagnoses") as any).select("slug").eq("slug", slug).maybeSingle();
          if (existing) { vehicleSkipped++; continue; }

          try {
            const diag = await callAI(symptoms);
            await (supabase.from("diagnoses") as any).insert({
              slug, symptom_path: symptoms.substring(0, 200),
              vehicle_make: v.make, vehicle_model: v.model, vehicle_year: v.year,
              diagnosis_json: diag, view_count: 1,
            });
            vehicleTotal++;
            if (vehicleTotal % 20 === 0) process.stdout.write(".");
          } catch (e: any) {
            process.stdout.write("x");
          }
        }
      }
    }
  }
  console.log(`\n\nVehicle diagnoses: ${vehicleTotal} generated, ${vehicleSkipped} skipped`);
  console.log(`\n=== TOTAL: ${totalGenerated + vehicleTotal} new, ${totalSkipped + vehicleSkipped} skipped ===`);
}

main().catch(console.error);
