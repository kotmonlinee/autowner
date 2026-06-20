/**
 * Generate missing Step1-3 diagnosis articles, following the EXACT same flow as
 * src/app/api/diagnosis/route.ts (prompt, slug, repair catalog, DB insert).
 *
 * Usage: node scripts/generate-missing-diagnoses.mjs
 */
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions";
const AI_KEY = process.env.DEEPSEEK_API_KEY;
const CONCURRENCY = 50;
const CHECKPOINT_FILE = "scripts/diag_checkpoint.json";

// ── Exact same prompt as route.ts ──────────────────────────
const SYSTEM_PROMPT_BASE = `You are an ASE-certified master technician with 20 years of experience. Diagnose car problems based on user-described symptoms.

When a specific vehicle (make, model, year) is provided, you MUST incorporate vehicle-specific context into ALL fields.
If no vehicle is given, provide a general diagnosis.

The user may also provide diagnostic context — use it to refine your diagnosis:
- Check engine light status (off/on/flashing): A flashing CEL indicates an active misfire that will damage the catalytic converter.
- Problem duration (just started/days/weeks): Helps distinguish sudden failures from gradual wear.
- Odometer reading: Use to determine if the issue aligns with known service intervals (e.g., timing belt at 90k).
- Recent repair work: A symptom that started right after a repair often points to an installation error or disturbed component.

CRITICAL — Repair matching: You will be given a catalog of available repairs. Each cause MUST have a "repair_slug" from the catalog, or null if nothing matches.

CRITICAL — Consistency: Every OBD code in "possibleCodes" must have at least one corresponding repair in "matchedRepairSlugs". matchedRepairSlugs collects all non-null repair_slug values from causes.

CRITICAL — Verification steps: Each cause MUST have 3 verification_steps, ordered from easiest (no tools) to hardest (professional equipment). Write specific, actionable steps — never vague like "check the sensor".

Return ONLY valid JSON with this structure:
{
  "title": "Short diagnosis title, include vehicle if known",
  "severity": "low" | "medium" | "high" | "critical",
  "summary": "2-3 sentence plain-language summary of the diagnosis, explaining what's happening and why",
  "causes": [
    {
      "description": "Detailed cause description, written for car owner to understand",
      "likelihood": "most likely" | "possible" | "less common",
      "verification_steps": [
        "Step 1: Easiest check — no tools needed (eyes, ears, hands)",
        "Step 2: Intermediate check — basic tools or OBD scanner",
        "Step 3: Professional verification — shop equipment if needed"
      ],
      "repair_slug": "exact_slug_from_catalog_or_null"
    }
  ],
  "whatToDo": "Practical next steps. If vehicle is known, mention model-specific issues. 2-3 sentences.",
  "costEstimate": "Repair cost range in USD specific to vehicle if known. Say 'Varies widely' if uncertain.",
  "possibleCodes": ["P0420"],
  "matchedRepairSlugs": ["brake_pads_front"],
  "faq": [
    {"question": "How urgent is this repair?", "answer": "Specific urgency based on severity and symptoms"},
    {"question": "Can I drive with this issue?", "answer": "Clear yes/no with explanation of risks"},
    {"question": "What happens if I ignore this?", "answer": "Progression of symptoms and potential damage/cost if untreated"}
  ]
}
Rules: severity: "critical"=stop driving immediately, "high"=get inspected within days, "medium"=schedule soon, "low"=monitor. 2-3 causes ordered by likelihood. Max 4 codes. 3 faq items. Write for non-mechanic.`;

// ── Same slug generation as route.ts ───────────────────────
function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h).toString(36).padStart(6, "0");
}

function generateSlug(symptoms, vehicle) {
  const parts = symptoms.match(/Symptom: ([^.]+)\. Location: ([^.]+)\. When: ([^.]+)\./);
  const baseParts = [];
  if (parts) {
    baseParts.push(parts[1].trim(), parts[2].trim(), parts[3].trim());
  } else {
    baseParts.push(symptoms.substring(0, 40));
  }
  if (vehicle) baseParts.push(vehicle);
  const hash = hashStr(symptoms + (vehicle ?? ""));
  return `${baseParts.join(" ")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "")
    .substring(0, 64)}-${hash}`;
}

// ── All 189 combinations ───────────────────────────────────
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

// S1 key → label (matching DiagnosisWizard STEP1 labels)
const S1_LABELS = {
  noise: "Unusual noise or sound",
  smell: "Strange smell or odor",
  smoke: "Smoke or steam from the car",
  vibration: "Vibration or shaking",
  performance: "Power loss, stalling, or hesitation",
  "warning-lights": "Dashboard warning light is on",
  temperature: "Engine overheating or temperature issue",
  starting: "Hard to start or won't start",
  fluid: "Fluid leaking under the car",
  brakes: "Brake or steering issue",
  electrical: "Electrical problem (lights, windows, battery)",
  hvac: "AC or heater not working properly",
  transmission: "Transmission or gear shifting problem",
};

// Build all 189 combos
const allCombos = [];
for (const [s1Key, s2s] of Object.entries(TREE)) {
  for (const [s2Label, step3s] of s2s) {
    for (const [s3Label] of step3s) {
      allCombos.push({ key: `${s1Key}/${s2Label}/${s3Label}`, s1: S1_LABELS[s1Key], s2: s2Label, s3: s3Label });
    }
  }
}

// ── Query format: exactly matches what DiagnosisWizard sends ──
function buildQuery(combo) {
  return `Symptom: ${combo.s1}. Location: ${combo.s2}. When: ${combo.s3}.`;
}

// ── Main ───────────────────────────────────────────────────
async function main() {
  // 1. Fetch repair catalog (same as route.ts does)
  const { data: repairCatalog } = await supabase.from("diy_difficulty").select("repair_slug, repair_name").order("repair_name");
  const repairList = (repairCatalog ?? []).map(r => `- ${r.repair_slug} (${r.repair_name})`).join("\n");
  const systemPrompt = SYSTEM_PROMPT_BASE + `\n\nAvailable repairs in our catalog (pick from these for matchedRepairSlugs):\n${repairList}`;
  console.log(`${repairCatalog.length} repair types loaded\n`);

  // 2. Check which combos are already in DB (using same slug logic)
  console.log("Checking existing coverage...");
  const allSlugs = new Set();
  let offset = 0;
  while (true) {
    const { data } = await supabase.from("diagnoses").select("slug, symptom_path").range(offset, offset + 999);
    if (!data?.length) break;
    for (const d of data) allSlugs.add(d.slug);
    offset += 1000;
  }

  const missing = [];
  for (const c of allCombos) {
    const symptoms = buildQuery(c);
    const slug = generateSlug(symptoms, undefined);
    if (!allSlugs.has(slug)) missing.push({ ...c, symptoms, slug });
  }
  console.log(`${missing.length}/${allCombos.length} missing\n`);

  if (missing.length === 0) { console.log("All covered!"); return; }

  // 3. Resume from checkpoint
  let done = new Set();
  let failed = [];
  if (fs.existsSync(CHECKPOINT_FILE)) {
    const ck = JSON.parse(fs.readFileSync(CHECKPOINT_FILE, "utf-8"));
    done = new Set(ck.done ?? []);
    failed = ck.failed ?? [];
    console.log(`Resuming: ${done.size} done, ${failed.length} failed`);
  }

  const pending = missing.filter(m => !done.has(m.key));
  console.log(`Remaining: ${pending.length}\n`);

  async function processOne(combo) {
    const { symptoms, slug, s1, s2, s3 } = combo;
    try {
      const res = await fetch(DEEPSEEK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${AI_KEY}` },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Diagnose these car symptoms: ${symptoms}` },
          ],
          temperature: 0.3, max_tokens: 4000,
        }),
      });

      if (!res.ok) return { key: combo.key, err: `HTTP${res.status}` };

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content || "";
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return { key: combo.key, err: "no_json" };

      const diagnosis = JSON.parse(jsonMatch[0]);

      // Same DB insert as route.ts
      const { error } = await supabase.from("diagnoses").insert({
        slug,
        symptom_path: symptoms.substring(0, 200),
        vehicle_make: null,
        vehicle_model: null,
        vehicle_year: null,
        diagnosis_json: diagnosis,
        view_count: 1,
      });

      if (error) return { key: combo.key, err: error.message };
      return { key: combo.key, ok: true };

    } catch (e) {
      return { key: combo.key, err: e.message?.substring(0, 60) };
    }
  }

  function saveCheckpoint() {
    fs.writeFileSync(CHECKPOINT_FILE, JSON.stringify({ done: [...done], failed }, null, 2));
  }

  const t0 = Date.now();
  let ok = 0, errCount = 0;

  for (let i = 0; i < pending.length; i += CONCURRENCY) {
    const batch = pending.slice(i, i + CONCURRENCY);
    const results = await Promise.allSettled(batch.map(processOne));

    for (const r of results) {
      if (r.status === "fulfilled" && r.value) {
        if (r.value.ok) { ok++; done.add(r.value.key); }
        else { errCount++; failed.push(r.value); done.add(r.value.key); }
      } else {
        errCount++;
      }
    }

    const processed = i + batch.length;
    if (processed % (CONCURRENCY * 2) === 0 || processed >= pending.length) {
      const elapsed = ((Date.now() - t0) / 60000).toFixed(1);
      const rate = ((processed) / ((Date.now() - t0) / 60000)).toFixed(0);
      console.log(`[${processed}/${pending.length} ${(processed/pending.length*100).toFixed(1)}% | ${elapsed}m | ~${rate}/min | ${ok}✓ ${errCount}✗]`);
      saveCheckpoint();
    }
  }

  saveCheckpoint();
  const totalMin = ((Date.now() - t0) / 60000).toFixed(1);
  console.log(`\nDone in ${totalMin}m. OK:${ok} Failed:${errCount}`);
  if (failed.length) console.log(`Failed keys:\n${failed.map(f => `  ${f.key}: ${f.err}`).join("\n")}`);
}

main().catch(e => { console.error(e); process.exit(1); });
