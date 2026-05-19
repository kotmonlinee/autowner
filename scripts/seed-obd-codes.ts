/**
 * Seed OBD-II diagnostic trouble codes from the OBDIICodes open dataset.
 *
 * Usage: npx tsx scripts/seed-obd-codes.ts
 *
 * This script fetches codes.json from the fabiovila/OBDIICodes repo,
 * enriches P-codes with automotive knowledge, and upserts them into
 * the obd_codes table via the Supabase client.
 *
 * The source dataset contains 2187 P-codes. The seed targets
 * at least 200 of the most commonly searched generic (P00xx-P0Axx) codes.
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf-8")
    .split("\n")
    .filter(l => l && !l.startsWith("#"))
    .map(l => l.split("=").map(s => s.trim()))
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

interface ObdCodeRaw {
  Code: string;
  Description: string;
}

interface ObdCodeEnriched {
  code: string;
  title: string;
  severity: number;
  symptoms: string[];
  causes: string[];
  fixes: string[];
  min_cost: number | null;
  max_cost: number | null;
}

// ── Knowledge base for enrichment (mirrors migration SQL logic) ──

const SEVERITY_MAP: Record<string, number> = {
  P00: 3, P01: 3, P02: 3, P03: 4, P04: 3,
  P05: 3, P06: 4, P07: 4, P08: 4, P09: 3, P0A: 3,
};

const COST_MAP: Record<string, [number, number]> = {
  P00: [200, 800], P01: [100, 500], P02: [150, 600],
  P03: [100, 1500], P04: [150, 1000], P05: [100, 500],
  P06: [400, 2500], P07: [200, 4000], P08: [200, 3000],
  P09: [200, 1500], P0A: [300, 3000],
};

function inferEnrichment(raw: ObdCodeRaw): ObdCodeEnriched {
  const code = raw.Code.replace("/SAE", "").trim();
  const desc = raw.Description;
  const descLower = desc.toLowerCase();
  const prefix = code.substring(0, 3);

  // Severity
  let severity = SEVERITY_MAP[prefix] || 3;

  // Symptoms
  const symptoms: string[] = ["Check Engine Light illuminated"];
  if (/misfire|ignition/i.test(descLower)) {
    symptoms.push("Engine misfire/rough running", "Flashing Check Engine Light", "Loss of power");
    severity = Math.max(severity, 4);
  }
  if (/fuel|injector|pump|regulator/i.test(descLower))
    symptoms.push("Poor fuel economy", "Engine hesitation", "Hard starting");
  if (/camshaft|crankshaft|timing|position/i.test(descLower)) {
    symptoms.push("Engine rattle/timing noise", "Rough idle", "Reduced power");
    severity = Math.max(severity, 4);
  }
  if (/o2|oxygen/i.test(descLower))
    symptoms.push("Failed emissions test", "Poor fuel economy");
  if (/transmission|shift|solenoid|clutch|torque/i.test(descLower)) {
    symptoms.push("Harsh or delayed shifting", "Transmission slippage", "Limp mode");
    severity = Math.max(severity, 4);
  }
  if (/temperature|coolant|thermostat/i.test(descLower))
    symptoms.push("Temperature gauge fluctuation", "Poor heater output");
  if (/evap|purge|vent|leak|vapor|canister/i.test(descLower))
    symptoms.push("Fuel odor detected", "Difficulty refueling");
  if (/throttle|pedal|accelerator/i.test(descLower)) {
    symptoms.push("Erratic throttle response", "Reduced power/limp mode");
    severity = Math.max(severity, 4);
  }
  if (/turbo|boost|supercharger/i.test(descLower)) {
    symptoms.push("Loss of boost pressure", "Reduced power", "Turbo whine/whistle");
    severity = Math.max(severity, 4);
  }
  if (/catalyst|catalytic/i.test(descLower))
    symptoms.push("Rotten egg exhaust smell", "Failed emissions test", "Reduced fuel economy");
  if (/egr|exhaust gas recirculation/i.test(descLower))
    symptoms.push("Engine knock under load", "Rough idle", "Failed emissions test");
  if (/battery|alternator|generator|voltage/i.test(descLower))
    symptoms.push("Battery warning light", "Charging system malfunction");

  // Causes
  const causes: string[] = [];
  if (/circuit|open|high|low|range|performance|signal|voltage/i.test(descLower))
    causes.push("Damaged, corroded, or shorted wiring in related circuit");
  if (/sensor/i.test(descLower))
    causes.push("Faulty sensor (internal failure)");
  if (/valve|solenoid|actuator/i.test(descLower))
    causes.push("Failed or stuck valve/solenoid/actuator");
  if (/fuel/i.test(descLower))
    causes.push("Fuel system contamination or component failure");
  if (/pcm|ecm|tcm|module/i.test(descLower))
    causes.push("Faulty control module (PCM/ECM/TCM)");
  if (causes.length === 0)
    causes.push("Component failure in related system", "Wiring or connector fault", "Faulty sensor or actuator");

  // Fixes
  const fixes: string[] = [];
  if (/circuit|open|high|low/i.test(descLower))
    fixes.push("Inspect and repair wiring harness and connectors");
  if (/sensor/i.test(descLower))
    fixes.push("Replace faulty sensor");
  if (/valve|solenoid|actuator/i.test(descLower))
    fixes.push("Replace faulty valve/solenoid/actuator");
  if (/fuel|injector|pump/i.test(descLower))
    fixes.push("Service or replace affected fuel system component");
  if (/pcm|ecm|tcm|module/i.test(descLower))
    fixes.push("Reprogram or replace control module");
  fixes.push("Clear DTC and verify repair with test drive");
  if (fixes.length < 2)
    fixes.push("Diagnose and replace faulty component indicated by code", "Inspect and repair related wiring");

  const [minCost, maxCost] = COST_MAP[prefix] || [150, 1000];

  return {
    code,
    title: desc,
    severity,
    symptoms: symptoms.slice(0, 6),
    causes: causes.slice(0, 5),
    fixes: fixes.slice(0, 5),
    min_cost: minCost,
    max_cost: maxCost,
  };
}

async function main() {
  console.log("Fetching OBD-II codes from open dataset...");

  const res = await fetch(
    "https://raw.githubusercontent.com/fabiovila/OBDIICodes/master/codes.json"
  );
  if (!res.ok) {
    console.error(`Failed to fetch codes.json: ${res.status} ${res.statusText}`);
    process.exit(1);
  }

  const rawCodes: ObdCodeRaw[] = await res.json();
  console.log(`Fetched ${rawCodes.length} total codes`);

  // Filter to generic P-codes (P00xx-P0Axx) for broadest relevance
  const genericPCodes = rawCodes.filter((c) => {
    const code = c.Code.replace("/SAE", "").trim();
    return /^P0/.test(code);
  });

  console.log(`Filtered to ${genericPCodes.length} generic P-codes (P00xx-P0Axx)`);
  console.log("Enriching codes with automotive knowledge...");

  const enriched = genericPCodes.map(inferEnrichment);
  console.log(`Enriched ${enriched.length} codes`);

  // Upsert in batches of 50
  const BATCH_SIZE = 50;
  let inserted = 0;
  let skipped = 0;

  for (let i = 0; i < enriched.length; i += BATCH_SIZE) {
    const batch = enriched.slice(i, i + BATCH_SIZE);
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

    const { data, error } = await supabase
      .from("obd_codes")
      .upsert(rows, { onConflict: "code", ignoreDuplicates: true });

    if (error) {
      console.error(`Batch ${Math.floor(i / BATCH_SIZE) + 1} error:`, error.message);
      skipped += batch.length;
    } else {
      inserted += batch.length;
      console.log(
        `  Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(enriched.length / BATCH_SIZE)}: ` +
        `upserted ${batch.length} codes`
      );
    }
  }

  console.log();
  console.log("Done!");
  console.log(`  Inserted/updated: ${inserted}`);
  console.log(`  Skipped (errors):  ${skipped}`);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
