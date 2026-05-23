/**
 * Enrich top 50 most commonly searched OBD-II codes with detailed
 * symptoms, causes, fixes, and cost data for SEO.
 *
 * Usage: npx tsx scripts/enrich-obd-codes.ts
 *
 * For each code we provide specific (not generic) symptoms, real common
 * causes in order of likelihood, actual repair procedures with cost
 * ranges, and realistic min/max cost estimates.
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf-8")
    .split("\n")
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => l.split("=").map((s) => s.trim()))
);

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
});

interface ObdEnrichment {
  code: string;
  title: string;
  severity: number;
  symptoms: string[];
  causes: string[];
  fixes: string[];
  min_cost: number;
  max_cost: number;
}

// ─────────────────────────────────────────────────────────────
// Top 50 OBD-II codes with REAL automotive repair knowledge
// Symptoms/causes/fixes are actual, specific, ordered by likelihood
// ─────────────────────────────────────────────────────────────

const ENRICHED_CODES: ObdEnrichment[] = [
  // ── 1. P0420 ──
  {
    code: "P0420",
    title: "Catalyst System Efficiency Below Threshold (Bank 1)",
    severity: 3,
    symptoms: [
      "Check Engine Light on (often the only symptom)",
      "Failed emissions test",
      "Reduced fuel economy (10-20% drop)",
      "Rotten egg (sulfur) smell from exhaust",
      "Loss of power at highway speeds",
    ],
    causes: [
      "Faulty downstream (post-cat) O2 sensor — most common cause, test sensor before replacing catalytic converter",
      "Exhaust leak before the catalytic converter (cracked manifold, loose flange, blown gasket)",
      "Failed catalytic converter (rare — only after ruling out O2 sensor and exhaust leaks)",
      "Engine running rich — faulty MAF sensor, leaking fuel injectors, or stuck-open purge valve dumping excess fuel",
      "Oil or coolant contamination of the catalyst from leaking valve cover gasket or head gasket",
      "Use of leaded fuel or incorrect fuel additives poisoning the catalyst",
    ],
    fixes: [
      "Replace downstream O2 (Bank 1 Sensor 2) sensor ($80-250)",
      "Repair exhaust leak — replace gasket, tighten flange, or weld cracked manifold ($50-400)",
      "Replace catalytic converter ($500-2500 depending on vehicle and whether OEM or aftermarket)",
      "Fix rich running condition — clean MAF sensor ($10-30 DIY), replace leaking injectors ($200-600)",
      "Perform fuel system cleaning and switch to Top Tier fuel ($80-150)",
    ],
    min_cost: 50,
    max_cost: 2500,
  },

  // ── 2. P0300 ──
  {
    code: "P0300",
    title: "Random/Multiple Cylinder Misfire Detected",
    severity: 4,
    symptoms: [
      "Flashing Check Engine Light under acceleration",
      "Engine shaking, stumbling, or rough idle",
      "Significant loss of power and hesitation",
      "Increased fuel consumption",
      "May cause catalytic converter damage if driven for extended period",
    ],
    causes: [
      "Worn or fouled spark plugs — most common cause, especially at recommended replacement interval (60k-100k miles)",
      "Vacuum leak — cracked intake manifold gasket, split PCV hose, or leaking brake booster",
      "Clogged or dirty fuel injectors causing uneven fuel delivery across cylinders",
      "Faulty ignition coils (on coil-on-plug systems) or worn distributor cap/rotor (older vehicles)",
      "Low fuel pressure — weak fuel pump or clogged fuel filter",
      "Engine mechanical issues — low compression, burnt valves, or blown head gasket (less common, more expensive)",
    ],
    fixes: [
      "Replace spark plugs and inspect ignition coils ($100-400 for parts, $150-300 labor at shop)",
      "Smoke-test and repair vacuum leak ($100-250 diagnostic + $20-400 repair depending on location)",
      "Professional fuel injector cleaning service or replacement ($80-200 cleaning, $300-800 replacement)",
      "Replace faulty ignition coil(s) — replace all if one is failing preventively ($50-150 per coil)",
      "Compression test and leak-down test to check for internal engine damage ($100-200 diagnostic)",
    ],
    min_cost: 80,
    max_cost: 3000,
  },

  // ── 3. P0171 ──
  {
    code: "P0171",
    title: "System Too Lean (Bank 1)",
    severity: 3,
    symptoms: [
      "Check Engine Light on",
      "Engine hesitation or surging at light throttle",
      "Rough idle, may stall at stops",
      "Poor fuel economy (lean mixture can actually increase consumption as ECU compensates)",
      "Lack of power under acceleration",
    ],
    causes: [
      "Vacuum leak (most common) — cracked intake boot between MAF and throttle body, split PCV hose, leaking intake manifold gasket",
      "Dirty or faulty MAF sensor under-reporting airflow into the engine",
      "Clogged fuel filter or weak fuel pump causing low fuel pressure",
      "Faulty upstream O2 sensor (Bank 1 Sensor 1) sending incorrect lean signal",
      "Leaking fuel injector O-rings or stuck-closed injector on Bank 1",
      "Exhaust leak before the upstream O2 sensor allowing false air readings",
    ],
    fixes: [
      "Diagnose and repair vacuum leak — smoke test ($100-150), repair hose or gasket ($20-400)",
      "Clean MAF sensor with MAF cleaner spray ($10 DIY), or replace MAF sensor ($80-300)",
      "Replace fuel filter ($50-150) or fuel pump ($300-800)",
      "Replace upstream Bank 1 O2 sensor ($100-300)",
      "Replace intake manifold gaskets ($200-600 including labor)",
    ],
    min_cost: 10,
    max_cost: 1500,
  },

  // ── 4. P0174 ──
  {
    code: "P0174",
    title: "System Too Lean (Bank 2)",
    severity: 3,
    symptoms: [
      "Check Engine Light on",
      "Rough idle, especially when cold",
      "Engine hesitation under acceleration",
      "Whistling or hissing sound from engine bay (vacuum leak)",
      "Possible P0171 also set (both banks lean indicates a shared cause)",
    ],
    causes: [
      "Vacuum leak on Bank 2 side of engine — intake manifold gasket, injector O-rings, or vacuum hose",
      "Dirty or faulty MAF sensor (if both P0171 and P0174 are present, MAF is prime suspect)",
      "Clogged Bank 2 fuel injectors or low fuel pressure affecting that bank",
      "Exhaust leak before Bank 2 upstream O2 sensor",
      "Faulty Bank 2 upstream O2 sensor",
      "PCV system leak pulling unmetered air (affects both banks)",
    ],
    fixes: [
      "Smoke test and repair vacuum leak on Bank 2 ($100-250 diagnostic, $20-400 repair)",
      "Clean or replace MAF sensor ($10-300)",
      "Clean or replace Bank 2 fuel injectors ($80-800)",
      "Replace Bank 2 upstream O2 sensor ($100-300)",
      "Replace PCV valve and hose ($30-150)",
    ],
    min_cost: 10,
    max_cost: 1500,
  },

  // ── 5. P0455 ──
  {
    code: "P0455",
    title: "Evaporative Emission System Leak Detected (Large Leak)",
    severity: 3,
    symptoms: [
      "Check Engine Light on",
      "Fuel odor, especially after refueling",
      "No noticeable driveability issues (EVAP is emissions-only on most vehicles)",
      "May fail emissions test",
      "Gas cap warning light on some vehicles (separate or same as CEL)",
    ],
    causes: [
      "Loose, damaged, or missing gas cap — most common and cheapest fix, always check first",
      "Cracked or disconnected EVAP hose — the rubber hoses degrade over 10+ years",
      "Faulty purge valve stuck open — allows vacuum to continuously pull on the EVAP system",
      "Faulty vent valve stuck closed — prevents EVAP system from completing self-test",
      "Cracked charcoal canister — common on vehicles driven on rough roads",
      "Damaged fuel tank pressure sensor or fuel filler neck",
    ],
    fixes: [
      "Tighten or replace gas cap ($10-30) — clear code and drive 50+ miles to verify fix",
      "Replace damaged EVAP hose or tubing ($20-150)",
      "Replace EVAP purge valve/solenoid ($50-200, often DIY-friendly)",
      "Replace EVAP vent valve/solenoid ($60-250)",
      "Replace charcoal canister ($200-600) — requires dropping the fuel tank on some vehicles",
    ],
    min_cost: 10,
    max_cost: 800,
  },

  // ── 6. P0442 ──
  {
    code: "P0442",
    title: "Evaporative Emission System Leak Detected (Small Leak)",
    severity: 3,
    symptoms: [
      "Check Engine Light on (usually the only symptom)",
      "Slight fuel odor in or around vehicle",
      "No driveability issues",
      "May take multiple drive cycles before CEL reappears after clearing",
    ],
    causes: [
      "Loose or worn gas cap — the rubber seal degrades over time causing a small leak",
      "Small crack or pinhole in EVAP hose — often at connection points or where hoses rub against engine components",
      "Faulty EVAP purge valve not sealing completely when closed",
      "Small leak at charcoal canister vent valve O-ring",
      "Fuel tank pressure sensor seal deteriorating",
      "Small leak at fuel pump/module access cover gasket (under rear seat or in trunk)",
    ],
    fixes: [
      "Replace gas cap with OEM or high-quality aftermarket unit ($10-30)",
      "Smoke test EVAP system to locate small leak ($80-150 diagnostic)",
      "Replace affected EVAP hose section or O-ring ($10-100 parts)",
      "Replace EVAP purge valve ($50-200)",
      "Replace fuel tank pressure sensor seal or sensor assembly ($40-200)",
    ],
    min_cost: 10,
    max_cost: 500,
  },

  // ── 7. P0401 ──
  {
    code: "P0401",
    title: "Exhaust Gas Recirculation Flow Insufficient Detected",
    severity: 3,
    symptoms: [
      "Check Engine Light on",
      "Engine pinging/knocking under light acceleration (EGR reduces combustion temps)",
      "Failed emissions test (high NOx)",
      "Rough idle or stalling on some vehicles",
      "Slightly increased fuel consumption",
    ],
    causes: [
      "Clogged EGR passages in intake manifold — carbon buildup blocks the flow path (extremely common on direct-injection engines)",
      "Faulty EGR valve — stuck closed due to carbon deposits, or failed solenoid",
      "Faulty DPFE sensor (Ford vehicles) — Differential Pressure Feedback sensor fails and reports incorrect flow",
      "Vacuum line disconnected or cracked between EGR valve and control solenoid",
      "Faulty EGR control solenoid not actuating the valve",
      "Blocked EGR tube — carbon-clogged metal pipe between exhaust manifold and EGR valve",
    ],
    fixes: [
      "Clean EGR passages in intake manifold ($200-500 labor, requires intake removal on many engines)",
      "Replace EGR valve ($150-450 including parts and labor)",
      "Replace DPFE sensor (Ford-specific, $40-100 parts, 10-minute DIY)",
      "Replace cracked vacuum lines to EGR system ($5-30 DIY)",
      "Remove and clean or replace EGR tube ($50-200)",
    ],
    min_cost: 5,
    max_cost: 600,
  },

  // ── 8. P0301 ──
  {
    code: "P0301",
    title: "Cylinder 1 Misfire Detected",
    severity: 4,
    symptoms: [
      "Flashing or steady Check Engine Light",
      "Engine vibration and shaking, especially at idle",
      "Rough idle and hesitation on acceleration",
      "Loss of power",
      "Possible fuel smell from unburned fuel entering exhaust",
    ],
    causes: [
      "Worn or fouled spark plug on cylinder 1",
      "Faulty ignition coil (on coil-on-plug engines) or bad spark plug wire (older vehicles) for cylinder 1",
      "Clogged or leaking fuel injector on cylinder 1",
      "Low compression in cylinder 1 — burnt valve, worn piston rings, or head gasket failure",
      "Vacuum leak specific to cylinder 1 intake runner (intake manifold gasket breach)",
      "Carbon buildup on intake valves (direct injection engines) causing poor air/fuel mixing on cylinder 1",
    ],
    fixes: [
      "Replace cylinder 1 spark plug ($10-30 DIY, $80-150 shop)",
      "Swap ignition coil with another cylinder to test — replace if misfire follows ($50-150 per coil)",
      "Professional fuel injector cleaning or replace cylinder 1 injector ($80-400)",
      "Compression and leak-down test — if low, may need valve job or ring replacement ($1500-4000 for major engine work)",
      "Walnut blast intake valves to remove carbon buildup (direct injection only, $400-800)",
    ],
    min_cost: 10,
    max_cost: 4000,
  },

  // ── 9. P0302 ──
  {
    code: "P0302",
    title: "Cylinder 2 Misfire Detected",
    severity: 4,
    symptoms: [
      "Flashing or steady Check Engine Light",
      "Engine shaking at idle and under load",
      "Hesitation and loss of power",
      "Rough acceleration",
      "Increased emissions, possible catalytic converter damage if driven",
    ],
    causes: [
      "Worn or fouled spark plug on cylinder 2",
      "Faulty ignition coil or bad spark plug wire for cylinder 2",
      "Clogged or leaking fuel injector on cylinder 2",
      "Low compression in cylinder 2 due to burnt valve, worn rings, or head gasket leak",
      "Intake manifold gasket leak at cylinder 2 runner",
      "Carbon buildup on intake valves (direct injection engines)",
    ],
    fixes: [
      "Replace cylinder 2 spark plug ($10-30 DIY, $80-150 shop)",
      "Test and replace coil/wire for cylinder 2 ($50-200)",
      "Clean or replace cylinder 2 fuel injector ($80-400)",
      "Compression test — engine teardown if low ($1500-4000)",
      "Intake valve carbon cleaning for direct injection engines ($400-800)",
    ],
    min_cost: 10,
    max_cost: 4000,
  },

  // ── 10. P0303 ──
  {
    code: "P0303",
    title: "Cylinder 3 Misfire Detected",
    severity: 4,
    symptoms: [
      "Flashing or steady Check Engine Light",
      "Engine vibration, especially noticeable at idle RPM",
      "Rough running and hesitation",
      "Loss of power",
      "Unburnt fuel odor from exhaust",
    ],
    causes: [
      "Worn or fouled spark plug on cylinder 3",
      "Faulty ignition coil or spark plug wire for cylinder 3",
      "Clogged or leaking fuel injector on cylinder 3",
      "Low compression in cylinder 3 — burnt valve, worn rings, or head gasket",
      "Intake manifold gasket leak at cylinder 3 intake runner",
      "Carbon buildup on intake valves (direct injection engines)",
    ],
    fixes: [
      "Replace cylinder 3 spark plug ($10-30 DIY, $80-150 shop)",
      "Test coil by swapping with another cylinder — replace if needed ($50-200)",
      "Clean or replace cylinder 3 fuel injector ($80-400)",
      "Compression/leak-down test — major engine repair if low ($1500-4000)",
      "Intake valve carbon cleaning (DI engines) ($400-800)",
    ],
    min_cost: 10,
    max_cost: 4000,
  },

  // ── 11. P0304 ──
  {
    code: "P0304",
    title: "Cylinder 4 Misfire Detected",
    severity: 4,
    symptoms: [
      "Flashing or steady Check Engine Light",
      "Engine vibration, worse under load",
      "Rough idle and acceleration hesitation",
      "Loss of power",
      "Possible rotten egg smell as unburnt fuel reaches catalytic converter",
    ],
    causes: [
      "Worn or fouled spark plug on cylinder 4",
      "Faulty ignition coil or bad spark plug wire for cylinder 4",
      "Clogged or leaking fuel injector on cylinder 4",
      "Low compression — burnt valve, worn rings, head gasket breach on cylinder 4",
      "Intake manifold gasket leak at cylinder 4 runner",
      "Carbon buildup on intake valves (direct injection engines)",
    ],
    fixes: [
      "Replace cylinder 4 spark plug ($10-30 DIY, $80-150 shop)",
      "Test and replace coil/wire for cylinder 4 ($50-200)",
      "Clean or replace cylinder 4 fuel injector ($80-400)",
      "Compression test — engine repair if low ($1500-4000)",
      "Walnut blast intake valves (DI engines, $400-800)",
    ],
    min_cost: 10,
    max_cost: 4000,
  },

  // ── 12. P0135 ──
  {
    code: "P0135",
    title: "O2 Sensor Heater Circuit Malfunction (Bank 1 Sensor 1)",
    severity: 3,
    symptoms: [
      "Check Engine Light on",
      "May fail emissions test",
      "Poor fuel economy (especially during warm-up when heater is needed most)",
      "Extended time in open-loop mode after cold start",
      "Possible rough idle during first few minutes after cold start",
    ],
    causes: [
      "Failed O2 sensor heater element — most common, internal sensor failure from age/heat cycles",
      "Blown O2 sensor heater fuse — check fuse box before replacing sensor",
      "Damaged or corroded wiring/connector at O2 sensor — heat from exhaust manifold melts wires",
      "Short to ground in O2 sensor heater circuit",
      "Faulty PCM (rare — only after ruling out sensor, fuse, and wiring)",
    ],
    fixes: [
      "Replace Bank 1 Sensor 1 (upstream) O2 sensor — use OEM or Denso/NTK for best results ($80-250)",
      "Replace blown O2 sensor heater fuse ($1-5 DIY)",
      "Repair damaged wiring or connector at O2 sensor pigtail ($30-150)",
      "Reprogram or replace PCM (very rare, only as last resort) ($500-1500)",
    ],
    min_cost: 1,
    max_cost: 1500,
  },

  // ── 13. P0141 ──
  {
    code: "P0141",
    title: "O2 Sensor Heater Circuit Malfunction (Bank 1 Sensor 2)",
    severity: 2,
    symptoms: [
      "Check Engine Light on (usually the only symptom)",
      "May not affect driveability — downstream sensor is for catalyst monitoring only",
      "Could fail emissions test",
      "Slightly delayed transition to closed-loop fuel control after cold start",
    ],
    causes: [
      "Failed downstream O2 sensor heater element — most common cause at 100k+ miles",
      "Blown O2 sensor heater fuse (shared fuse may affect multiple sensors)",
      "Corroded or damaged wiring at O2 sensor connector — road debris or heat exposure",
      "Exhaust leak near sensor causing thermal shock to sensor element",
      "Faulty PCM (rare)",
    ],
    fixes: [
      "Replace Bank 1 Sensor 2 (downstream/post-cat) O2 sensor ($60-200)",
      "Check and replace O2 sensor heater fuse ($1-5)",
      "Repair damaged wiring/connector at sensor ($30-150)",
      "Fix exhaust leak damaging sensor ($50-300)",
    ],
    min_cost: 1,
    max_cost: 400,
  },

  // ── 14. P0011 ──
  {
    code: "P0011",
    title: "\"A\" Camshaft Position — Timing Over-Advanced or System Performance (Bank 1)",
    severity: 4,
    symptoms: [
      "Check Engine Light on",
      "Rough idle, especially when engine is cold",
      "Engine rattling noise from timing chain area on cold start",
      "Reduced fuel economy",
      "Loss of power and poor acceleration",
    ],
    causes: [
      "Low engine oil level or dirty/old oil — VVT system relies on oil pressure, this is the #1 cause and the cheapest fix",
      "Faulty VVT (variable valve timing) solenoid — stuck in advanced position, common on many Asian and domestic engines",
      "Stretched or worn timing chain — causes camshaft to run ahead of crankshaft position",
      "Clogged VVT oil control valve screen — debris restricts oil flow to the actuator",
      "Faulty camshaft position sensor sending incorrect signal",
      "Worn timing chain tensioner not maintaining proper chain tension",
    ],
    fixes: [
      "Check oil level and condition — change oil and filter with correct viscosity ($30-80 DIY, $60-120 shop)",
      "Replace VVT solenoid ($50-200 parts, often accessible from outside the engine)",
      "Replace timing chain, guides, and tensioner ($800-2000 including labor)",
      "Clean or replace VVT oil control valve ($80-300)",
      "Replace camshaft position sensor ($60-200)",
    ],
    min_cost: 30,
    max_cost: 2500,
  },

  // ── 15. P0014 ──
  {
    code: "P0014",
    title: "\"B\" Camshaft Position — Timing Over-Retarded (Bank 1)",
    severity: 4,
    symptoms: [
      "Check Engine Light on",
      "Engine runs rough, especially at idle",
      "Poor acceleration and sluggish throttle response",
      "Decreased fuel economy",
      "Possible stalling when coming to a stop",
    ],
    causes: [
      "Low engine oil or wrong oil viscosity — VVT system cannot properly actuate, always check oil first",
      "Faulty VVT solenoid stuck in retarded position",
      "Worn timing chain or belt causing cam timing to lag",
      "Failed VVT actuator (cam phaser) — internal locking pin failure, common on Ford and GM engines",
      "Clogged oil passages to VVT actuator from sludge buildup",
    ],
    fixes: [
      "Oil change with correct viscosity and OEM filter ($30-120)",
      "Replace VVT solenoid ($50-250)",
      "Replace VVT actuator/cam phaser ($300-1000 parts + $300-800 labor)",
      "Replace timing chain/belt kit ($800-2000)",
      "Engine flush to clear sludge from oil passages ($100-200)",
    ],
    min_cost: 30,
    max_cost: 2500,
  },

  // ── 16. P0128 ──
  {
    code: "P0128",
    title: "Coolant Thermostat (Coolant Temperature Below Thermostat Regulating Temperature)",
    severity: 2,
    symptoms: [
      "Check Engine Light on",
      "Engine temperature gauge reads lower than normal or fluctuates",
      "Poor cabin heater output (weak or no heat in winter)",
      "Reduced fuel economy (engine runs rich in extended warm-up mode)",
      "Engine takes noticeably longer to reach operating temperature",
    ],
    causes: [
      "Thermostat stuck open — most common cause, the internal spring or wax element fails",
      "Low coolant level — insufficient coolant around the temperature sensor can cause false low readings",
      "Faulty engine coolant temperature (ECT) sensor reporting incorrect low temperature",
      "Cooling fan running constantly when it should not (stuck fan relay) — overcooling the engine",
    ],
    fixes: [
      "Replace thermostat — use OEM temperature rating, not a colder aftermarket thermostat ($80-400 including labor and coolant)",
      "Top up coolant and bleed air from system ($5-40 DIY, $80-150 shop)",
      "Replace engine coolant temperature sensor ($40-200)",
      "Replace stuck cooling fan relay ($15-80)",
    ],
    min_cost: 15,
    max_cost: 500,
  },

  // ── 17. P0440 ──
  {
    code: "P0440",
    title: "Evaporative Emission Control System Malfunction",
    severity: 3,
    symptoms: [
      "Check Engine Light on",
      "Fuel odor from rear of vehicle",
      "Hissing sound from fuel tank area after engine shutdown",
      "No significant driveability issues on most vehicles",
      "May fail emissions test",
    ],
    causes: [
      "Loose or faulty gas cap — always check first, most common and cheapest fix",
      "Faulty EVAP purge control valve — stuck open causing continuous vacuum draw",
      "Faulty EVAP vent control valve — stuck closed, unable to complete system test",
      "Cracked or disconnected EVAP vacuum hose or vapor line",
      "Faulty charcoal canister — saturated with fuel from overfilling tank repeatedly",
      "Damaged fuel tank pressure sensor",
    ],
    fixes: [
      "Tighten or replace gas cap ($10-30)",
      "Replace EVAP purge valve ($50-200)",
      "Replace EVAP vent valve ($60-250)",
      "Smoke test to locate and repair EVAP hose/vapor leak ($100-200 diagnostic + parts)",
      "Replace charcoal canister ($200-600)",
    ],
    min_cost: 10,
    max_cost: 700,
  },

  // ── 18. P0456 ──
  {
    code: "P0456",
    title: "Evaporative Emission System Leak Detected (Very Small Leak)",
    severity: 2,
    symptoms: [
      "Check Engine Light on (often the only symptom)",
      "No noticeable fuel smell in most cases",
      "No driveability issues",
      "CEL may turn off and back on intermittently",
    ],
    causes: [
      "Gas cap not tightened until it clicks — extremely common, always verify before doing anything else",
      "Gas cap rubber seal aging/hardening (micro-cracks only detectable under vacuum)",
      "Very small pinhole in EVAP hose — often at a bend or clamp point",
      "EVAP canister vent valve O-ring slightly deteriorated",
      "Fuel filler neck check valve not fully seating",
      "Extremely small leak at EVAP system wiring pass-through grommet or seal",
    ],
    fixes: [
      "Tighten gas cap until it clicks 3+ times, clear code, drive 100+ miles ($0)",
      "Replace gas cap — use OEM for best seal ($10-30)",
      "Smoke test EVAP system to pinpoint very small leak ($80-150 diagnostic)",
      "Replace leaking O-ring or hose section ($5-50 parts)",
      "Replace fuel filler neck assembly if check valve failed ($150-400)",
    ],
    min_cost: 0,
    max_cost: 500,
  },

  // ── 19. P0430 ──
  {
    code: "P0430",
    title: "Catalyst System Efficiency Below Threshold (Bank 2)",
    severity: 3,
    symptoms: [
      "Check Engine Light on (may be the only symptom)",
      "Failed emissions test",
      "Reduced fuel economy",
      "Rotten egg (sulfur) smell from tailpipe",
      "Lack of power, especially at highway speeds",
    ],
    causes: [
      "Faulty Bank 2 downstream O2 sensor — always test sensor before replacing catalytic converter",
      "Exhaust leak before Bank 2 catalytic converter (cracked manifold, loose flange)",
      "Failed Bank 2 catalytic converter (only after ruling out sensor and leaks)",
      "Engine running rich on Bank 2 — leaking Bank 2 fuel injector(s), misfire dumping raw fuel into cat",
      "Oil or coolant contamination of catalytic converter from valve cover gasket or head gasket leak on Bank 2",
    ],
    fixes: [
      "Replace Bank 2 downstream O2 sensor ($80-250)",
      "Repair Bank 2 exhaust leak ($50-400)",
      "Replace Bank 2 catalytic converter ($500-2500)",
      "Fix Bank 2 misfire or rich condition ($100-800)",
      "Perform fuel system and catalytic converter cleaning treatment ($80-150)",
    ],
    min_cost: 50,
    max_cost: 2500,
  },

  // ── 20. P0101 ──
  {
    code: "P0101",
    title: "Mass or Volume Air Flow \"A\" Circuit Range/Performance",
    severity: 3,
    symptoms: [
      "Check Engine Light on",
      "Engine stalling or rough idle",
      "Hesitation on acceleration",
      "Poor fuel economy or black smoke from exhaust",
      "Difficulty starting, especially when hot",
    ],
    causes: [
      "Dirty MAF sensor — oil and debris on the sensor wire cause incorrect readings, very common on vehicles with oiled air filters (K&N style)",
      "Faulty MAF sensor — internal failure from age or contamination",
      "Air leak between MAF sensor and throttle body — unmetered air entering after MAF causes inaccurate readings",
      "Clogged air filter restricting airflow",
      "Wiring or connector issues at MAF sensor — corroded pins, broken wires",
      "PCV system leak introducing unmetered air downstream of MAF",
    ],
    fixes: [
      "Clean MAF sensor with dedicated MAF cleaner spray — do NOT use carb cleaner or brake cleaner ($10 DIY)",
      "Replace air filter ($15-40)",
      "Replace MAF sensor — use OEM or Hitachi/Denso, aftermarket MAFs have high failure rate ($80-400)",
      "Repair intake air leak between MAF and throttle body ($20-150)",
      "Clean or repair MAF wiring connector ($10-100)",
    ],
    min_cost: 10,
    max_cost: 500,
  },

  // ── 21. P0113 ──
  {
    code: "P0113",
    title: "Intake Air Temperature Sensor 1 Circuit High Input",
    severity: 2,
    symptoms: [
      "Check Engine Light on",
      "Hard starting in cold weather",
      "Poor fuel economy (ECU defaults to rich mixture)",
      "Engine may run rough or stall when cold",
      "Black smoke from tailpipe in extreme cases",
    ],
    causes: [
      "Faulty IAT sensor — internal open circuit, common failure mode",
      "Damaged or corroded wiring/connector at IAT sensor — high resistance causes high voltage reading",
      "Open circuit in IAT sensor ground wire",
      "IAT sensor contaminated with oil or dirt (from aftermarket oiled air filter)",
      "Faulty PCM (rare)",
    ],
    fixes: [
      "Replace IAT sensor — often integrated into MAF sensor on modern vehicles ($30-150 standalone, $80-400 if part of MAF assembly)",
      "Repair damaged wiring or connector at IAT sensor ($30-150)",
      "Clean oil/debris from IAT sensor element ($0-10 DIY)",
      "Repair open ground circuit ($50-200)",
    ],
    min_cost: 0,
    max_cost: 400,
  },

  // ── 22. P0121 ──
  {
    code: "P0121",
    title: "Throttle/Pedal Position Sensor \"A\" Circuit Range/Performance",
    severity: 3,
    symptoms: [
      "Check Engine Light on",
      "Erratic or unresponsive throttle",
      "Engine may enter limp mode (reduced power, max ~30 mph)",
      "Sudden RPM changes without pedal input",
      "Vehicle may not accelerate when pressing the gas pedal",
    ],
    causes: [
      "Faulty throttle position sensor (TPS) — internal wear on the resistive track causes dead spots",
      "Carbon buildup in throttle body preventing proper throttle plate movement",
      "Damaged wiring or loose connector at throttle body",
      "Faulty accelerator pedal position sensor (drive-by-wire vehicles) — separate from TPS",
      "Faulty electronic throttle body assembly — internal motor or sensor failure",
    ],
    fixes: [
      "Clean throttle body to remove carbon buildup ($50-200 shop, $10-20 DIY with spray cleaner)",
      "Replace throttle position sensor (TPS) ($40-200 parts, may require throttle body relearn procedure)",
      "Replace complete electronic throttle body assembly ($300-800 including labor and relearn)",
      "Repair damaged wiring or connector ($50-200)",
      "Perform throttle body idle relearn procedure ($0-100 diagnostic fee)",
    ],
    min_cost: 10,
    max_cost: 800,
  },

  // ── 23. P0130 ──
  {
    code: "P0130",
    title: "O2 Sensor Circuit Malfunction (Bank 1 Sensor 1)",
    severity: 3,
    symptoms: [
      "Check Engine Light on",
      "Poor fuel economy",
      "Rough idle and hesitation",
      "Failed emissions test",
      "Black smoke from exhaust (engine running rich)",
    ],
    causes: [
      "Faulty upstream O2 sensor — slow response or dead sensor, common at 80k-100k miles",
      "Exhaust leak before the O2 sensor introducing outside air and false lean readings",
      "Damaged wiring or corroded connector at O2 sensor",
      "Contaminated O2 sensor — silicone (from wrong RTV sealant), coolant (head gasket leak), or oil fouling",
      "Blown O2 sensor heater circuit fuse causing sensor to stay in open-loop mode",
      "Vacuum leak causing actual lean condition — sensor reads correctly but mixture is actually lean",
    ],
    fixes: [
      "Replace Bank 1 Sensor 1 (upstream) O2 sensor ($80-300 including labor)",
      "Repair exhaust leak before sensor ($50-400)",
      "Repair damaged wiring/connector ($30-150)",
      "Fix root cause of sensor contamination — replace head gasket ($1500-3000), fix oil leak ($200-1000)",
      "Replace O2 sensor heater fuse ($1-5)",
    ],
    min_cost: 1,
    max_cost: 3000,
  },

  // ── 24. P0133 ──
  {
    code: "P0133",
    title: "O2 Sensor Circuit Slow Response (Bank 1 Sensor 1)",
    severity: 3,
    symptoms: [
      "Check Engine Light on",
      "Gradually worsening fuel economy over weeks/months",
      "Sluggish throttle response",
      "May pass or fail emissions test depending on how slow the sensor is",
      "Often no noticeable driveability issue initially",
    ],
    causes: [
      "Aging O2 sensor — response time degrades naturally over 80k-120k miles, this is the most common cause",
      "Exhaust leak before sensor diluting exhaust gas reaching the sensor",
      "Contaminated sensor — oil ash from burning oil, coolant from small head gasket leak, or silicone sealant poisoning",
      "Carbon buildup on sensor element from rich running condition",
      "Low-quality aftermarket sensor previously installed with poor response characteristics",
    ],
    fixes: [
      "Replace upstream O2 sensor with OEM or high-quality (Denso/NTK/Bosch) sensor ($80-300)",
      "Repair exhaust leak affecting sensor reading ($50-400)",
      "Fix oil consumption issue causing sensor contamination ($500-3000 depending on cause)",
      "Perform fuel injection cleaning to correct rich condition fouling sensor ($80-200)",
    ],
    min_cost: 80,
    max_cost: 3000,
  },

  // ── 25. P0172 ──
  {
    code: "P0172",
    title: "System Too Rich (Bank 1)",
    severity: 3,
    symptoms: [
      "Check Engine Light on",
      "Black smoke from exhaust",
      "Strong fuel smell from tailpipe",
      "Poor fuel economy (significantly reduced MPG)",
      "Rough idle and engine may flood on startup",
      "Spark plug fouling — black, sooty deposits on plugs",
    ],
    causes: [
      "Faulty MAF sensor over-reporting airflow — PCM injects more fuel than needed",
      "Leaking fuel injector(s) on Bank 1 — dripping fuel even when closed",
      "Faulty fuel pressure regulator causing excessive fuel pressure",
      "Restricted air filter or intake — engine gets less air than MAF reported",
      "Faulty upstream O2 sensor stuck rich — sending incorrect signal to PCM",
      "EVAP purge valve stuck open dumping fuel vapors continuously",
    ],
    fixes: [
      "Clean or replace MAF sensor ($10-400)",
      "Replace leaking Bank 1 fuel injector(s) ($200-800)",
      "Replace fuel pressure regulator ($80-300)",
      "Replace restricted air filter ($15-40)",
      "Replace faulty upstream O2 sensor ($80-300)",
      "Replace stuck-open EVAP purge valve ($50-200)",
    ],
    min_cost: 10,
    max_cost: 800,
  },

  // ── 26. P0175 ──
  {
    code: "P0175",
    title: "System Too Rich (Bank 2)",
    severity: 3,
    symptoms: [
      "Check Engine Light on",
      "Black smoke and strong fuel smell from exhaust (Bank 2 side)",
      "Poor fuel economy",
      "Rough idle, may stall at stop lights",
      "Spark plug fouling on Bank 2 cylinders (black soot)",
    ],
    causes: [
      "Faulty MAF sensor (if both banks rich, MAF is likely cause)",
      "Leaking Bank 2 fuel injector(s)",
      "Faulty Bank 2 upstream O2 sensor sending false rich or stuck signal",
      "Excessive fuel pressure from failed pressure regulator",
      "Restricted air intake or dirty air filter",
      "EVAP purge valve stuck open",
    ],
    fixes: [
      "Clean or replace MAF sensor ($10-400)",
      "Replace leaking Bank 2 fuel injector(s) ($200-800)",
      "Replace Bank 2 upstream O2 sensor ($80-300)",
      "Replace fuel pressure regulator ($80-300)",
      "Replace air filter ($15-40)",
    ],
    min_cost: 10,
    max_cost: 800,
  },

  // ── 27. P0305 ──
  {
    code: "P0305",
    title: "Cylinder 5 Misfire Detected",
    severity: 4,
    symptoms: [
      "Flashing or steady Check Engine Light",
      "Engine running rough with noticeable vibration",
      "Loss of power and hesitation",
      "Increased fuel consumption",
      "Risk of catalytic converter damage if driven long distances while misfiring",
    ],
    causes: [
      "Worn or fouled spark plug on cylinder 5",
      "Faulty ignition coil (or spark plug wire on older engines) for cylinder 5",
      "Clogged or leaking fuel injector on cylinder 5",
      "Low compression in cylinder 5 — burnt valve, worn rings, head gasket failure",
      "Intake manifold gasket leak at cylinder 5 runner",
      "Carbon buildup on intake valves (direct injection engines)",
    ],
    fixes: [
      "Replace cylinder 5 spark plug ($10-30 DIY, $80-150 shop)",
      "Test and replace coil/wire for cylinder 5 ($50-200)",
      "Clean or replace cylinder 5 fuel injector ($80-400)",
      "Compression test and engine diagnosis ($100-200 test, $1500-4000 if major repair needed)",
      "Intake valve carbon cleaning (DI engines, $400-800)",
    ],
    min_cost: 10,
    max_cost: 4000,
  },

  // ── 28. P0306 ──
  {
    code: "P0306",
    title: "Cylinder 6 Misfire Detected",
    severity: 4,
    symptoms: [
      "Flashing or steady Check Engine Light",
      "Engine vibration and rough running",
      "Loss of power and hesitation under load",
      "Poor fuel economy",
      "Unburnt fuel smell from exhaust",
    ],
    causes: [
      "Worn or fouled spark plug on cylinder 6",
      "Faulty ignition coil or spark plug wire for cylinder 6",
      "Clogged or leaking fuel injector on cylinder 6",
      "Low compression — burnt exhaust valve, worn piston rings, head gasket leak on cylinder 6",
      "Intake manifold gasket leak at cylinder 6 runner",
      "Carbon buildup on intake valves (direct injection)",
    ],
    fixes: [
      "Replace cylinder 6 spark plug ($10-30 DIY, $80-150 shop)",
      "Test and replace coil/wire for cylinder 6 ($50-200)",
      "Clean or replace cylinder 6 fuel injector ($80-400)",
      "Compression test and repair ($1500-4000 for major engine work)",
      "Walnut blast intake valves (DI engines, $400-800)",
    ],
    min_cost: 10,
    max_cost: 4000,
  },

  // ── 29. P0325 ──
  {
    code: "P0325",
    title: "Knock Sensor 1 Circuit Malfunction (Bank 1 or Single Sensor)",
    severity: 3,
    symptoms: [
      "Check Engine Light on",
      "Engine pinging or knocking under acceleration (PCM retards timing with faulty sensor)",
      "Reduced power and acceleration performance",
      "Decreased fuel economy",
      "May not have noticeable symptoms other than CEL in some cases",
    ],
    causes: [
      "Faulty knock sensor — internal piezoelectric element failure from age, heat cycles, or physical damage",
      "Damaged or corroded wiring/connector at knock sensor — located deep in engine V, exposed to extreme heat",
      "Knock sensor wiring shorted to ground from insulation melting on hot engine surfaces",
      "Excessive engine mechanical noise — loose timing chain, piston slap, or rod knock tricking the sensor",
      "Incorrect knock sensor torque — must be torqued to spec (typically 15-25 ft-lbs), over-tightening damages the sensor",
      "Faulty PCM (rare)",
    ],
    fixes: [
      "Replace knock sensor — often requires intake manifold removal on V-engines ($150-500 including labor)",
      "Repair damaged wiring or connector at knock sensor ($50-200)",
      "Re-torque knock sensor to factory specification if loose ($30-100 diagnostic labor)",
      "Address mechanical engine noise if present ($500-4000 depending on cause)",
      "Reprogram or replace PCM (very rare, $500-1500)",
    ],
    min_cost: 30,
    max_cost: 4000,
  },

  // ── 30. P0335 ──
  {
    code: "P0335",
    title: "Crankshaft Position Sensor \"A\" Circuit Malfunction",
    severity: 5,
    symptoms: [
      "Engine cranks but will not start — this sensor is critical for ignition timing",
      "Engine stalling while driving (dangerous — can cause loss of power steering and brakes)",
      "Check Engine Light on",
      "Intermittent starting problems (starts sometimes, then randomly won't start)",
      "Tachometer erratic or not working during cranking",
    ],
    causes: [
      "Faulty crankshaft position sensor — heat-related failure, often fails when engine is hot and works again when cool",
      "Damaged or corroded wiring/connector at sensor — sensor is often near exhaust manifold, wiring insulation melts over time",
      "Cracked or broken reluctor ring/flexplate teeth — sensor cannot read crank position",
      "Excessive air gap between sensor and reluctor ring (out of spec)",
      "Faulty PCM (rare)",
      "Broken timing belt or chain — engine won't start AND sensor code sets because crank signal is absent",
    ],
    fixes: [
      "Replace crankshaft position sensor — often 1-bolt and 1-connector job, but location can be hard to reach ($80-300 including labor)",
      "Repair damaged wiring/connector at sensor ($50-200)",
      "Replace flexplate or reluctor ring if damaged ($800-2000, requires transmission removal)",
      "Check timing belt/chain — if broken, major engine repair may be needed ($500-3000)",
    ],
    min_cost: 50,
    max_cost: 3000,
  },

  // ── 31. P0340 ──
  {
    code: "P0340",
    title: "Camshaft Position Sensor \"A\" Circuit Malfunction (Bank 1 or Single Sensor)",
    severity: 4,
    symptoms: [
      "Check Engine Light on",
      "Engine cranks but may not start, or extended cranking before starting",
      "Engine stalling at idle or when decelerating",
      "Rough running and misfire-like symptoms",
      "Reduced fuel economy",
    ],
    causes: [
      "Faulty camshaft position sensor — common failure on many vehicles at 100k+ miles",
      "Damaged wiring or corroded connector — sensor often located on cylinder head near oil and heat",
      "Oil contamination on sensor face — metal debris from engine wear sticks to magnetic sensor tip",
      "Incorrect air gap between sensor and target wheel",
      "Faulty PCM or wiring short to ground/voltage",
      "Timing chain/belt has jumped a tooth — cam and crank signals no longer correlate",
    ],
    fixes: [
      "Replace camshaft position sensor ($50-250 including labor)",
      "Repair damaged wiring or corroded connector ($30-150)",
      "Clean oil and metal debris from sensor face and reinstall ($0-10 DIY)",
      "Verify and correct timing if chain/belt has jumped ($500-2000)",
    ],
    min_cost: 0,
    max_cost: 2000,
  },

  // ── 32. P0351 ──
  {
    code: "P0351",
    title: "Ignition Coil \"A\" Primary/Secondary Circuit Malfunction",
    severity: 4,
    symptoms: [
      "Check Engine Light on (may flash under load)",
      "Engine misfire, rough running, shaking",
      "Loss of power and acceleration",
      "Poor fuel economy",
      "Engine may not start if coil is completely dead (COP systems)",
    ],
    causes: [
      "Faulty ignition coil — internal winding short or open circuit from heat stress",
      "Damaged wiring or loose connector at coil — broken wire at connector from engine vibration",
      "Blown ignition coil fuse (shared for multiple coils, if blown all on that circuit fail)",
      "Faulty ignition control module (ICM) or PCM coil driver transistor failed",
      "Spark plug with excessive gap forcing coil to work harder and overheat",
    ],
    fixes: [
      "Replace ignition coil \"A\" (cylinder 1 on most engines, check firing order) ($50-200)",
      "Repair damaged wiring or connector at coil ($30-150)",
      "Replace blown ignition fuse ($1-5)",
      "Replace spark plugs if worn — excessive gap damages coils ($40-200 for set)",
      "Replace PCM if internal driver failed (rare, $500-1500)",
    ],
    min_cost: 1,
    max_cost: 1500,
  },

  // ── 33. P0400 ──
  {
    code: "P0400",
    title: "Exhaust Gas Recirculation Flow Malfunction",
    severity: 3,
    symptoms: [
      "Check Engine Light on",
      "Engine pinging/detonation under load",
      "Rough idle or stalling",
      "Failed emissions test (high NOx)",
      "Surging at steady highway speeds",
    ],
    causes: [
      "Clogged EGR passages in intake — carbon deposits restrict flow, very common on direct-injection engines",
      "Faulty EGR valve — stuck open (causes rough idle) or stuck closed (causes knocking)",
      "Faulty EGR vacuum solenoid or control circuit",
      "Cracked or disconnected vacuum lines to EGR system",
      "Faulty DPFE sensor (Ford vehicles)",
      "Clogged EGR tube between exhaust manifold and EGR valve",
    ],
    fixes: [
      "Clean EGR passages and intake manifold runners ($200-500 labor)",
      "Replace EGR valve ($150-450)",
      "Replace EGR vacuum solenoid ($40-150)",
      "Replace cracked vacuum lines ($5-30 DIY)",
      "Replace DPFE sensor ($40-100)",
    ],
    min_cost: 5,
    max_cost: 600,
  },

  // ── 34. P0404 ──
  {
    code: "P0404",
    title: "Exhaust Gas Recirculation Circuit Range/Performance",
    severity: 3,
    symptoms: [
      "Check Engine Light on",
      "Engine surge or hesitation at steady throttle",
      "Rough idle, may stall",
      "Engine knock under acceleration",
      "Failed emissions test",
    ],
    causes: [
      "Faulty EGR valve position sensor — internal feedback potentiometer worn, reports incorrect position",
      "Carbon buildup preventing EGR valve from reaching commanded position",
      "Damaged wiring or poor connection at EGR valve electrical connector",
      "Faulty EGR control solenoid",
      "PCM software issue requiring update/reflash",
    ],
    fixes: [
      "Replace EGR valve assembly (includes position sensor) ($150-450)",
      "Clean EGR valve and passages of carbon deposits ($100-350)",
      "Repair damaged wiring or connector at EGR valve ($30-150)",
      "Perform PCM software update ($80-200 at dealer)",
    ],
    min_cost: 30,
    max_cost: 500,
  },

  // ── 35. P0410 ──
  {
    code: "P0410",
    title: "Secondary Air Injection System Malfunction",
    severity: 3,
    symptoms: [
      "Check Engine Light on",
      "Failed emissions test",
      "Usually no driveability issues",
      "Whining noise from air pump on cold start (if pump failing)",
      "May hear air hissing if there is a leak in the system",
    ],
    causes: [
      "Failed secondary air injection pump — electric motor seizes from water/moisture ingestion, very common on BMW, VW, Audi, and Volvo",
      "Faulty secondary air injection relay — contacts burn out from high current draw of pump motor",
      "Blown secondary air injection fuse",
      "Stuck-closed combination valve (check valve) — prevents air from reaching exhaust manifold",
      "Cracked or disconnected air injection hose — rubber hoses dry out and split over time",
      "Clogged secondary air passages in cylinder head (carbon buildup)",
    ],
    fixes: [
      "Replace secondary air injection pump ($300-800 including labor)",
      "Replace secondary air injection relay ($20-80)",
      "Replace blown fuse ($1-5)",
      "Replace combination/check valve ($80-300)",
      "Replace cracked or disconnected hoses ($30-200)",
      "Clean carbon-clogged air passages in cylinder head ($300-800 labor-intensive)",
    ],
    min_cost: 1,
    max_cost: 1000,
  },

  // ── 36. P0411 ──
  {
    code: "P0411",
    title: "Secondary Air Injection System Incorrect Flow Detected",
    severity: 3,
    symptoms: [
      "Check Engine Light on (usually only symptom)",
      "Failed emissions test",
      "No driveability issues in most cases",
      "Air pump may run continuously or not at all",
    ],
    causes: [
      "Failed secondary air pump — bearings worn out, motor draws high current and blows fuse",
      "Leaking or disconnected air injection hose",
      "Faulty combination/check valve — stuck open (allows exhaust into pump, destroying it) or stuck closed",
      "Faulty secondary air injection control solenoid",
      "Clogged air passages in cylinder head",
    ],
    fixes: [
      "Replace secondary air injection pump ($300-800)",
      "Replace leaking hoses in secondary air system ($30-200)",
      "Replace combination valve — do this preventively when replacing pump ($80-300)",
      "Replace control solenoid ($50-200)",
      "Clean carbon from air injection passages ($300-800)",
    ],
    min_cost: 30,
    max_cost: 1000,
  },

  // ── 37. P0421 ──
  {
    code: "P0421",
    title: "Warm Up Catalyst Efficiency Below Threshold (Bank 1)",
    severity: 3,
    symptoms: [
      "Check Engine Light on",
      "Failed emissions test",
      "Reduced fuel economy",
      "Rotten egg smell from exhaust",
      "Engine may feel sluggish, especially when cold",
    ],
    causes: [
      "Faulty warm-up catalytic converter (close-coupled/pre-cat) — Mazda, Audi, VW commonly have pre-cats that fail first",
      "Faulty downstream O2 sensor failing to accurately monitor catalyst performance",
      "Exhaust leak between engine and pre-catalytic converter",
      "Engine misfire dumping raw fuel into catalyst, destroying its efficiency",
      "Oil consumption contaminating the catalytic converter substrate",
    ],
    fixes: [
      "Replace downstream O2 sensor first — cheaper and more likely the cause than actual cat failure ($80-250)",
      "Replace warm-up (pre-cat) catalytic converter ($400-1200)",
      "Repair exhaust leak before pre-cat ($50-400)",
      "Fix engine misfire causing catalyst damage ($100-800)",
      "Address oil consumption issue ($500-3000)",
    ],
    min_cost: 50,
    max_cost: 3000,
  },

  // ── 38. P0441 ──
  {
    code: "P0441",
    title: "Evaporative Emission Control System Incorrect Purge Flow",
    severity: 3,
    symptoms: [
      "Check Engine Light on",
      "Slight fuel odor from engine bay",
      "No significant driveability issues",
      "Rough idle in some cases (if purge valve stuck open)",
      "Failed emissions test",
    ],
    causes: [
      "Faulty EVAP purge valve — stuck closed (no flow) or stuck open (constant flow causing vacuum leak)",
      "Clogged charcoal canister — saturated with liquid fuel from topping off the tank",
      "Cracked or disconnected purge hose between valve and intake manifold",
      "Faulty EVAP pressure sensor reporting incorrect system pressure",
      "Wiring or connector issue at purge valve",
    ],
    fixes: [
      "Replace EVAP purge valve/solenoid ($50-200, often a 10-minute DIY job)",
      "Replace charcoal canister if fuel-saturated ($200-600)",
      "Replace cracked or disconnected purge hose ($10-50 each)",
      "Replace EVAP system pressure sensor ($60-200)",
      "Clear EVAP system lines of obstruction ($50-150 diagnostic labor)",
    ],
    min_cost: 10,
    max_cost: 700,
  },

  // ── 39. P0443 ──
  {
    code: "P0443",
    title: "Evaporative Emission Control System Purge Control Valve Circuit Malfunction",
    severity: 3,
    symptoms: [
      "Check Engine Light on",
      "No significant driveability issues in most cases",
      "Rough idle if purge valve stuck open (vacuum leak)",
      "Fuel odor",
      "Failed emissions test",
    ],
    causes: [
      "Faulty EVAP purge valve solenoid — coil resistance out of spec or mechanically stuck",
      "Damaged wiring or corroded connector at purge valve",
      "Blown purge valve circuit fuse",
      "Faulty PCM purge valve driver (rare)",
      "Short to ground or open circuit in purge valve wiring harness",
    ],
    fixes: [
      "Replace EVAP purge valve/solenoid ($50-200)",
      "Repair damaged wiring or replace connector at purge valve ($30-150)",
      "Replace blown fuse ($1-5)",
      "Reprogram or replace PCM (very rare) ($500-1500)",
    ],
    min_cost: 1,
    max_cost: 1500,
  },

  // ── 40. P0446 ──
  {
    code: "P0446",
    title: "Evaporative Emission Control System Vent Control Circuit Malfunction",
    severity: 3,
    symptoms: [
      "Check Engine Light on",
      "Fuel odor from rear of vehicle",
      "Hissing sound from fuel tank area when engine running",
      "Difficulty refueling — pump nozzle keeps clicking off",
      "Failed emissions test",
    ],
    causes: [
      "Faulty EVAP vent valve/solenoid — stuck closed, can't relieve tank pressure during refueling",
      "Clogged vent valve filter — dust and dirt block the fresh air intake for EVAP system, very common on trucks and SUVs driven on dirt roads",
      "Damaged wiring or corroded connector at vent valve (located under vehicle near fuel tank, exposed to road salt and moisture)",
      "Spider webs or debris in vent line — surprisingly common, spiders are attracted to fuel vapors",
      "Charcoal canister clogged or saturated",
      "Blown vent valve fuse",
    ],
    fixes: [
      "Replace EVAP vent valve/solenoid ($60-250)",
      "Clean or replace clogged vent filter ($10-50 parts, often DIY-accessible)",
      "Repair damaged wiring near fuel tank ($50-200)",
      "Clear vent line of debris or spider webs ($30-100 labor)",
      "Replace charcoal canister ($200-600)",
    ],
    min_cost: 10,
    max_cost: 700,
  },

  // ── 41. P0449 ──
  {
    code: "P0449",
    title: "Evaporative Emission Control System Vent Valve/Solenoid Circuit Malfunction",
    severity: 3,
    symptoms: [
      "Check Engine Light on",
      "Difficulty refueling — gas pump keeps shutting off prematurely",
      "Fuel odor",
      "No driveability issues on most vehicles",
      "Failed emissions test",
    ],
    causes: [
      "Faulty EVAP vent valve solenoid — most common issue, especially on GM trucks and SUVs",
      "Corroded wiring or damaged connector at vent valve — valve is under vehicle exposed to water, salt, and debris",
      "Blown vent valve circuit fuse",
      "Internal PCM driver failure (rare, but known on some GM models)",
      "Short to ground in vent valve wiring from chafed harness under vehicle",
    ],
    fixes: [
      "Replace EVAP vent valve/solenoid assembly ($60-250)",
      "Repair corroded wiring or replace connector near fuel tank ($50-200)",
      "Replace blown fuse ($1-5)",
      "Reprogram or replace PCM (rare, $500-1500)",
    ],
    min_cost: 1,
    max_cost: 1500,
  },

  // ── 42. P0457 ──
  {
    code: "P0457",
    title: "Evaporative Emission System Leak Detected (Fuel Cap Loose/Off)",
    severity: 1,
    symptoms: [
      "Check Engine Light on",
      "No driveability issues",
      "May also trigger a separate gas cap warning light on some vehicles",
      "CEL may self-clear after several drive cycles if cap was tightened",
    ],
    causes: [
      "Gas cap left loose or not fully tightened after refueling — #1 cause by far",
      "Gas cap missing (left at gas station)",
      "Gas cap seal (O-ring) torn or flattened — no longer seals properly after years of use",
      "Fuel filler neck damage or debris preventing cap from seating",
      "Aftermarket locking gas cap not sealing properly",
    ],
    fixes: [
      "Tighten gas cap until it clicks 3+ times, clear code, verify after 50+ miles ($0)",
      "Replace missing or damaged gas cap with OEM quality ($10-30)",
      "Clean fuel filler neck sealing surface of dirt or corrosion ($0-5 DIY)",
      "Replace damaged fuel filler neck if sealing surface is compromised ($150-400)",
    ],
    min_cost: 0,
    max_cost: 400,
  },

  // ── 43. P0463 ──
  {
    code: "P0463",
    title: "Fuel Level Sensor \"A\" Circuit High Input",
    severity: 2,
    symptoms: [
      "Check Engine Light on",
      "Fuel gauge reads empty or full constantly (inaccurate)",
      "Low fuel light may stay on or never come on",
      "Range/distance-to-empty display inaccurate or not functioning",
      "No driveability issues",
    ],
    causes: [
      "Faulty fuel level sending unit — resistive track worn, common on vehicles with 150k+ miles",
      "Damaged wiring or corroded connector at fuel pump module (under rear seat or accessible from trunk)",
      "Fuel pump module float arm stuck or bent — can happen during fuel pump replacement",
      "Open circuit in fuel level sensor signal wire",
      "Instrument cluster failure (rare — other gauges would also malfunction)",
    ],
    fixes: [
      "Replace fuel level sending unit — often sold as part of fuel pump assembly ($200-600 including labor, tank must be dropped on many vehicles)",
      "Repair damaged wiring or corroded connector at fuel pump module ($50-200)",
      "Straighten or replace bent float arm ($30-200 labor if accessible without dropping tank)",
      "Replace instrument cluster (rare, $500-1200)",
    ],
    min_cost: 30,
    max_cost: 1200,
  },

  // ── 44. P0500 ──
  {
    code: "P0500",
    title: "Vehicle Speed Sensor \"A\" Malfunction",
    severity: 4,
    symptoms: [
      "Check Engine Light on",
      "Speedometer erratic, not working, or reads zero",
      "Transmission may shift erratically or stay in limp mode (3rd gear only)",
      "ABS light may also be on (shared wheel speed data on modern vehicles)",
      "Cruise control will not engage",
      "Odometer may stop counting miles",
    ],
    causes: [
      "Faulty vehicle speed sensor (VSS) — located on transmission output shaft or differential",
      "Damaged wiring or corroded connector at VSS — exposed to road debris and weather under vehicle",
      "Broken or missing speedometer drive gear (older vehicles with mechanical speedometer cable drive)",
      "Faulty ABS module providing speed data (modern vehicles where VSS signal comes from ABS/wheel speed sensors)",
      "Blown fuse for instrument cluster/speed sensor circuit",
    ],
    fixes: [
      "Replace vehicle speed sensor — usually 1-bolt job on transmission housing ($50-200 including labor)",
      "Repair damaged wiring or corroded connector ($30-150)",
      "Replace speedometer drive gear if broken ($80-300, may require transmission disassembly)",
      "Repair or replace ABS module if it's the source of speed data ($400-1200)",
      "Replace blown fuse ($1-5)",
    ],
    min_cost: 1,
    max_cost: 1200,
  },

  // ── 45. P0505 ──
  {
    code: "P0505",
    title: "Idle Air Control System Malfunction",
    severity: 3,
    symptoms: [
      "Check Engine Light on",
      "Engine idle speed too high or too low",
      "Engine stalling when coming to a stop or when AC compressor engages",
      "Surging idle — RPM fluctuates up and down at idle",
      "Hard starting — engine dies immediately unless giving throttle",
    ],
    causes: [
      "Faulty IAC (idle air control) valve — carbon buildup jams the pintle, or solenoid fails electrically",
      "Carbon buildup in throttle body blocking the IAC air bypass passage",
      "Vacuum leak — allows unmetered air, IAC cannot compensate enough",
      "Damaged wiring or corroded connector at IAC valve",
      "Dirty throttle body not allowing throttle plate to close to proper idle position",
      "Faulty PCM (rare)",
    ],
    fixes: [
      "Clean IAC valve and throttle body of carbon deposits ($50-200 shop, $10-20 DIY with throttle body cleaner)",
      "Replace IAC valve ($60-250 parts, 10-minute DIY on most engines)",
      "Diagnose and repair vacuum leak ($100-250 diagnostic + $20-400 repair)",
      "Repair damaged wiring/connector at IAC valve ($30-150)",
      "Perform idle relearn procedure after cleaning/replacement ($0-100 diagnostic fee)",
    ],
    min_cost: 10,
    max_cost: 500,
  },

  // ── 46. P0507 ──
  {
    code: "P0507",
    title: "Idle Air Control System RPM Higher Than Expected",
    severity: 3,
    symptoms: [
      "Check Engine Light on",
      "Engine idle speed too high (typically 1000-1500 RPM in park/neutral)",
      "Vehicle creeps forward faster than normal when in drive with brake applied",
      "Engine RPM hanging between shifts (manual transmission)",
      "High fuel consumption at idle",
    ],
    causes: [
      "Vacuum leak — unmetered air entering intake manifold, most common cause by far",
      "Stuck-open IAC valve — carbon deposits prevent pintle from closing",
      "Binding or sticky throttle cable/linkage preventing throttle plate from fully closing",
      "Faulty throttle position sensor — reporting throttle is partially open when it's not",
      "Intake manifold gasket leak (common on older vehicles with plastic intake manifolds)",
      "Faulty PCV valve stuck open creating internal vacuum leak",
    ],
    fixes: [
      "Diagnose and repair vacuum leak — smoke test ($100-150) + repair ($20-400)",
      "Clean or replace IAC valve ($10-250)",
      "Lubricate or replace sticky throttle cable ($30-150)",
      "Replace faulty throttle position sensor ($40-200)",
      "Replace intake manifold gaskets ($200-600)",
      "Replace PCV valve ($10-40)",
    ],
    min_cost: 10,
    max_cost: 600,
  },

  // ── 47. P0600 ──
  {
    code: "P0600",
    title: "Serial Communication Link Malfunction",
    severity: 4,
    symptoms: [
      "Check Engine Light on",
      "Multiple warning lights may illuminate simultaneously",
      "Transmission may enter limp mode",
      "Engine may run rough or stall",
      "Gauges may flicker or stop working intermittently",
    ],
    causes: [
      "Damaged or corroded CAN bus wiring — twisted pair communication wires between modules",
      "Faulty PCM or other control module pulling down the communication bus",
      "Loose or corroded ground connections — multiple modules share grounds, a bad ground affects communication",
      "Low battery voltage or failing alternator — modules shut down communication below ~9V",
      "Aftermarket electronics (remote start, alarm, stereo) tapping into CAN bus incorrectly",
      "Corroded connector at a control module allowing moisture intrusion",
    ],
    fixes: [
      "Inspect and clean all main ground connections ($50-200 labor)",
      "Repair damaged CAN bus wiring ($100-500 depending on location and accessibility)",
      "Test battery and charging system — replace battery or alternator if needed ($150-500)",
      "Remove aftermarket electronics improperly installed on CAN bus ($50-200 labor)",
      "Isolate and replace faulty control module ($500-2000)",
    ],
    min_cost: 50,
    max_cost: 2000,
  },

  // ── 48. P0601 ──
  {
    code: "P0601",
    title: "Internal Control Module Memory Check Sum Error",
    severity: 5,
    symptoms: [
      "Check Engine Light on",
      "Vehicle may not start — PCM fails self-check at key-on",
      "Engine may stall and not restart",
      "Multiple unrelated trouble codes may be set",
      "Transmission and other systems may malfunction",
    ],
    causes: [
      "Failed PCM internal memory — EEPROM or flash memory corruption from age or heat cycles",
      "Low battery voltage or voltage spike during jump-start damaging PCM memory",
      "Failed PCM software update — interrupted flash process (battery died during reflash)",
      "Water intrusion into PCM housing — corroded circuit board, common on vehicles with PCM in cowl or fender well",
      "Aftermarket performance chip/tuner causing memory corruption",
      "Failing alternator sending voltage spikes to PCM",
    ],
    fixes: [
      "Attempt PCM software reflash at dealership or with professional scan tool ($80-200)",
      "Replace PCM with new or remanufactured unit — must be programmed to VIN and immobilizer ($500-2000 including programming)",
      "Repair water-damaged PCM connector and seal PCM housing ($100-300 if PCM not damaged)",
      "Remove aftermarket tuner/chip and reflash to stock ($80-200)",
      "Replace failing alternator to prevent repeat failure ($300-700)",
    ],
    min_cost: 80,
    max_cost: 2000,
  },

  // ── 49. P0700 ──
  {
    code: "P0700",
    title: "Transmission Control System Malfunction (MIL Request)",
    severity: 4,
    symptoms: [
      "Check Engine Light on (this is a request from TCM to turn on CEL)",
      "Transmission may shift harshly or erratically",
      "Vehicle may be stuck in one gear (limp mode)",
      "Delayed engagement when shifting from Park to Drive or Reverse",
      "Transmission slipping or not shifting at all",
    ],
    causes: [
      "This code means the TCM has detected a fault — there are ALWAYS additional transmission-specific codes (P07xx) stored that identify the actual problem",
      "Low or contaminated transmission fluid — always check fluid level and condition first",
      "Faulty transmission shift solenoid(s) — identified by additional P0750-P0770 codes",
      "Faulty transmission speed sensor — input or output shaft sensor failure",
      "Internal transmission mechanical failure — worn clutch packs, broken band, or failed torque converter",
      "Faulty TCM (transmission control module) — separate module or integrated into PCM",
    ],
    fixes: [
      "READ THE ADDITIONAL TRANSMISSION CODES — P0700 is just the gateway code, never diagnose P0700 alone",
      "Check and replace transmission fluid and filter ($150-350 for service)",
      "Replace faulty shift solenoid(s) (specific P07xx code will identify which one) ($300-800 including labor and fluid)",
      "Replace transmission speed sensor ($150-400)",
      "Transmission rebuild or replacement if internal mechanical failure ($2000-5000)",
    ],
    min_cost: 150,
    max_cost: 5000,
  },

  // ── 50. P0740 ──
  {
    code: "P0740",
    title: "Torque Converter Clutch Circuit Malfunction",
    severity: 4,
    symptoms: [
      "Check Engine Light on",
      "Torque converter clutch (TCC) not locking up at highway speed — RPM higher than normal at steady cruise",
      "Torque converter clutch staying engaged — engine stalls when coming to a stop (like stopping a manual without pushing clutch)",
      "Reduced fuel economy (unlocked converter at highway speeds = 2-5 MPG loss)",
      "Transmission overheating on long highway drives",
      "Transmission may enter limp mode",
    ],
    causes: [
      "Low or contaminated transmission fluid — TCC relies on fluid pressure to engage",
      "Faulty TCC solenoid — internal electrical failure or stuck from debris in fluid",
      "Faulty brake light switch — PCM disengages TCC when brake is applied; a faulty switch can prevent lockup (always check this before replacing transmission parts)",
      "Damaged wiring or connector at transmission case connector",
      "Worn torque converter clutch lining — mechanical failure requiring converter replacement",
      "Valve body wear — TCC apply valve bore wear prevents proper fluid routing",
    ],
    fixes: [
      "Test brake light switch function — replace if faulty ($15-40, 5-minute DIY)",
      "Transmission fluid and filter service ($150-350)",
      "Replace TCC solenoid ($200-500 parts + labor + fluid)",
      "Repair wiring or connector at transmission ($50-300)",
      "Replace torque converter ($800-2000, requires transmission removal)",
      "Rebuild or replace valve body ($500-1500)",
    ],
    min_cost: 15,
    max_cost: 2500,
  },
];

// ─────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────

async function main() {
  console.log(`Enriching ${ENRICHED_CODES.length} OBD codes with detailed automotive content...\n`);

  let successCount = 0;
  let errorCount = 0;

  // Process in batches of 10 to avoid overwhelming the connection
  const BATCH_SIZE = 10;

  for (let i = 0; i < ENRICHED_CODES.length; i += BATCH_SIZE) {
    const batch = ENRICHED_CODES.slice(i, i + BATCH_SIZE);
    const rows = batch.map((e) => ({
      code: e.code,
      title: e.title,
      severity: e.severity,
      symptoms_json: e.symptoms,
      causes_json: e.causes,
      fixes_json: e.fixes,
      min_cost: e.min_cost,
      max_cost: e.max_cost,
    }));

    const { error } = await supabase
      .from("obd_codes")
      .upsert(rows, { onConflict: "code" });

    if (error) {
      console.error(`  Batch ${Math.floor(i / BATCH_SIZE) + 1} ERROR:`, error.message);
      errorCount += batch.length;
    } else {
      successCount += batch.length;
      const codes = batch.map((e) => e.code).join(", ");
      console.log(`  Batch ${Math.floor(i / BATCH_SIZE) + 1}: Updated ${codes}`);
    }
  }

  console.log();
  console.log("================================");
  console.log(`Enrichment complete!`);
  console.log(`  Successfully enriched: ${successCount} codes`);
  console.log(`  Errors:                ${errorCount}`);
  console.log("================================");
}

main().catch((err) => {
  console.error("Script failed:", err);
  process.exit(1);
});
