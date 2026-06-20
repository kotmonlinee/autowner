/**
 * Check which Step1-3 combinations are covered by existing diagnoses.
 * Usage: node scripts/check-diagnosis-coverage.mjs
 */
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Inline all 189 combinations (S1 label, S2 label, S3 label)
const combos = [];
const TREE = {
  noise: [
    ["From the engine compartment",[["On cold start"],["When accelerating"],["At idle / stopped"],["All the time"]]],
    ["From the wheels or brakes",[["When braking"],["While driving"],["Over bumps"]]],
    ["From under the car",[["Over bumps"],["When turning"],["All the time"]]],
    ["Inside the cabin",[["While driving"],["When AC or heat is on"]]],
    ["From the exhaust",[["When accelerating"],["At idle"]]],
    ["Squealing from belt area (front of engine)",[["On cold start, goes away"],["When accelerating"],["When AC turns on"]]],
    ["Not sure where it's from",[["All the time"],["Occasionally"]]],
  ],
  smell: [
    ["Sweet / maple syrup smell",[["While driving or after parking"],["When AC or heat is on"]]],
    ["Burning rubber smell",[["After driving or high speed"]]],
    ["Burning oil smell",[["From the engine bay"],["From the exhaust"]]],
    ["Gasoline / fuel smell",[["On cold start"],["While driving or after refueling"],["All the time"]]],
    ["Musty / moldy smell",[["When AC is on"],["After rain or car wash"]]],
    ["Rotten egg / sulfur smell",[["When accelerating or after high speed"],["At idle"]]],
    ["Exhaust fumes inside car",[["At idle or stopped"],["While driving"]]],
    ["Burning plastic / electrical smell",[["While driving"],["After using power accessories"]]],
  ],
  smoke: [
    ["White smoke from exhaust",[["On cold start (goes away)"],["All the time (thick white)"]]],
    ["Blue or gray smoke from exhaust",[["On cold start"],["When accelerating"],["All the time"]]],
    ["Black smoke from exhaust",[["When accelerating hard"],["All the time"]]],
    ["Smoke or steam from engine bay",[["With overheating or temp gauge high"],["With burning smell"],["After parking"]]],
  ],
  vibration: [
    ["Steering wheel shakes",[["At highway speed (50-75 mph)"],["When braking"],["All the time"]]],
    ["Whole car shakes or vibrates",[["At idle / stopped"],["When accelerating"],["At highway speeds"],["While driving at any speed"]]],
    ["Seat or floor vibrates",[["At idle / stopped"],["While driving"]]],
    ["Brake pedal pulses or vibrates",[["When braking"],["At highway speed braking"]]],
  ],
  performance: [
    ["Engine stalls or dies",[["At idle or when stopping"],["While driving"],["When engine is cold"]]],
    ["Rough or uneven idle",[["On cold start"],["All the time"],["Worse with AC on"]]],
    ["Loss of power or weak acceleration",[["All the time"],["Going uphill or under load"],["Worse when engine is hot"]]],
    ["Jerking or hesitation when accelerating",[["During hard acceleration"],["At low speed / in traffic"]]],
    ["Engine misfire or running rough",[["All the time"],["After rain or car wash"]]],
    ["Engine surges or RPM fluctuates while cruising",[["At steady throttle"],["Going uphill"]]],
    ["Sudden drop in fuel economy",[["Recently started"],["During winter"]]],
  ],
  "warning-lights": [
    ["Check Engine light (solid)",[["No other symptoms"],["With shaking or power loss"],["After refueling"]]],
    ["Check Engine light (flashing)",[["With shaking or rough running"]]],
    ["Oil pressure warning (red)",[["Came on while driving"],["At idle, goes away with RPM"]]],
    ["Battery / Charging warning (red)",[["Came on while driving"],["With dimming headlights"]]],
    ["ABS warning light",[["Always on"],["Comes and goes"]]],
    ["Airbag / SRS warning light",[["Always on"]]],
    ["Traction control light",[["Always on"],["Flashes when wheels slip"]]],
    ["Tire pressure warning (TPMS)",[["Always on"],["Only in cold weather"]]],
    ["Brake warning light (red)",[["Always on"],["With soft brake pedal"]]],
    ["Coolant temperature warning (red/blue)",[["Red — engine overheating"],["Blue — engine cold (normal)"]]],
  ],
  temperature: [
    ["Engine overheating",[["While driving"],["At idle or in traffic"],["Worse with AC on"]]],
    ["Temperature gauge reads high",[["While driving"],["Slowly rising over time"]]],
    ["Coolant boiling or overflowing",[["After engine shutdown"],["While driving"]]],
    ["Heater blows cold air",[["All the time"],["Only at idle, warm when driving"]]],
    ["Cooling fan not running",[["Engine overheating at idle"],["When AC is turned on"]]],
    ["Temperature gauge fluctuates rapidly",[["While driving"],["At idle after driving"]]],
  ],
  starting: [
    ["Clicking sound, won't crank",[["Every time"],["Occasionally"]]],
    ["No sound at all when turning key",[["Every time"],["Occasionally"]]],
    ["Engine cranks but won't start",[["When engine is cold"],["After engine is warm"]]],
    ["Engine cranks slowly",[["Worse in cold weather"],["All the time"]]],
    ["Starts then immediately dies",[["When engine is cold"],["Every time"]]],
    ["Cranks normally but won't start",[["When engine is cold"],["After engine is warm"],["After sitting for days"]]],
    ["Takes longer to start than usual",[["Getting worse over time"],["Worse when cold"]]],
  ],
  fluid: [
    ["Brown or black fluid under engine",[["Just a few drops"],["Noticeable puddle"],["With burning smell from engine"]]],
    ["Green, orange or pink fluid under front",[["After parking"],["Car runs hot or overheats"]]],
    ["Red fluid under middle of car",[["After parking"],["With shifting problems"]]],
    ["Clear or yellowish fluid near wheels",[["Brake pedal feels soft"],["After parking"]]],
    ["Red or pink fluid near front of car",[["Steering feels heavy or stiff"],["After parking"]]],
    ["Clear water under car",[["When AC was running (normal)"],["AC wasn't on"]]],
  ],
  brakes: [
    ["Brake pedal feels soft or spongy",[["All the time"],["During hard braking"]]],
    ["Brake pedal goes to the floor",[["Every time"],["Brake fluid level is dropping"]]],
    ["Grinding or squealing when braking",[["Every time I brake"],["First few stops then goes away"]]],
    ["Car pulls to one side when braking",[["Every time I brake"],["Only during hard braking"]]],
    ["Car pulls to one side while driving",[["All the time"],["Mostly at highway speed"]]],
    ["Steering feels heavy or stiff",[["All the time"],["At low speed or parking"]]],
    ["Steering feels loose or wanders",[["At highway speed"],["Over bumps"]]],
    ["Parking brake won't hold or won't release",[["Won't hold on hills"],["Won't release / light stays on"]]],
  ],
  electrical: [
    ["Battery keeps dying or won't hold charge",[["Overnight or after sitting"],["While driving (alternator)"]]],
    ["Headlights or interior lights dimming",[["At idle"],["All the time"]]],
    ["Dashboard or lights flickering",[["While driving"],["All the time"]]],
    ["Power window not working",[["Just one window"],["All windows"]]],
    ["Radio or infotainment not working",[["No power at all"],["Works sometimes"]]],
    ["Fuse keeps blowing repeatedly",[["Same fuse every time"],["After rain or car wash"]]],
    ["Wipers, locks, or horn not working",[["Just one accessory"],["Multiple accessories"],["Works sometimes"]]],
  ],
  hvac: [
    ["AC not blowing cold air",[["All the time"],["Cold on highway, warm in traffic"],["Gradually got worse over time"]]],
    ["Very weak airflow from vents",[["On all fan speeds"],["Only on certain speeds"]]],
    ["Musty or moldy smell from vents",[["When AC is on"],["All the time"]]],
    ["Heater not blowing hot air",[["All the time"],["Even after engine warms up"]]],
    ["AC system won't turn on at all",[["Doesn't work"],["Works sometimes"]]],
  ],
  transmission: [
    ["Transmission slipping or revving without moving",[["When cold"],["After warming up"],["Going uphill"]]],
    ["Harsh or jerky gear shifts",[["Every shift"],["Only when cold"],["Only between certain gears"]]],
    ["Delay when shifting into Drive or Reverse",[["When cold"],["All the time"]]],
    ["Car in gear but won't move",[["When engine is cold"],["After warming up"]]],
    ["Whining or humming noise from transmission",[["When accelerating"],["At all speeds"]]],
    ["Shuddering or shaking at low speed",[["Under light acceleration (30–50 mph)"],["Going uphill at low speed"]]],
  ],
};

for (const [s1Key, s2s] of Object.entries(TREE)) {
  for (const [s2Label, step3s] of s2s) {
    for (const [s3Label] of step3s) {
      // S1 key → label for matching against symptom_path
      const S1_LABEL = {
        noise: "Unusual noise or sound", smell: "Strange smell or odor", smoke: "Smoke or steam from the car",
        vibration: "Vibration or shaking", performance: "Power loss, stalling, or hesitation",
        "warning-lights": "Dashboard warning light is on", temperature: "Engine overheating or temperature issue",
        starting: "Hard to start or won't start", fluid: "Fluid leaking under the car",
        brakes: "Brake or steering issue", electrical: "Electrical problem (lights, windows, battery)",
        hvac: "AC or heater not working properly", transmission: "Transmission or gear shifting problem",
      };
      combos.push({ key: `${s1Key}/${s2Label}/${s3Label}`, s1: S1_LABEL[s1Key], s2: s2Label, s3: s3Label });
    }
  }
}
console.log(`Total combinations: ${combos.length}\n`);

// Fetch all diagnosis symptom_paths
const allPaths = [];
let offset = 0;
while (true) {
  const { data } = await supabase.from("diagnoses")
    .select("slug, symptom_path")
    .order("created_at", { ascending: false })
    .range(offset, offset + 999);
  if (!data?.length) break;
  allPaths.push(...data);
  offset += 1000;
}
console.log(`Total diagnoses in DB: ${allPaths.length}\n`);

// Match: check if each combo's S2+S3 keywords appear in any symptom_path
const covered = [];
const missing = [];

for (const combo of combos) {
  // S2 label: "From the engine compartment"
  // S3 label: "On cold start"
  // In symptom_path: "Location: From the engine compartment. When: On cold start"
  // We'll search for Location and When separately
  const s2Match = allPaths.find((d) => {
    const sp = (d.symptom_path || "").toLowerCase();
    // Match S1 keyword + S2 label fragment
    const hasS1 = sp.includes(combo.s1.toLowerCase());
    // For S2, match the first few words
    const s2Words = combo.s2.toLowerCase().split(" ").slice(0, 3).join(" ");
    const hasS2 = sp.includes(s2Words);
    // For S3, match the first few words
    const s3Words = combo.s3.toLowerCase().split(" ").slice(0, 3).join(" ");
    const hasS3 = sp.includes(s3Words);
    return hasS1 && hasS2 && hasS3;
  });

  if (s2Match) {
    covered.push({ ...combo, slug: s2Match.slug });
  } else {
    missing.push(combo);
  }
}

console.log(`Covered: ${covered.length}`);
console.log(`Missing: ${missing.length}\n`);

if (missing.length > 0) {
  console.log("=== Missing combinations ===");
  for (const m of missing) {
    console.log(`  ${m.key}`);
  }
}

console.log(`\n=== Coverage by category ===`);
const byCat = {};
for (const c of combos) {
  const cat = c.s1;
  if (!byCat[cat]) byCat[cat] = { total: 0, covered: 0 };
  byCat[cat].total++;
}
for (const c of covered) {
  byCat[c.s1].covered++;
}
for (const [cat, stats] of Object.entries(byCat)) {
  const pct = ((stats.covered / stats.total) * 100).toFixed(0);
  console.log(`  ${cat}: ${stats.covered}/${stats.total} (${pct}%)`);
}
