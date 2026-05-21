// Import full OBD2 database from Wal33D/dtc-database (18,805 codes)
// Run: npx tsx scripts/import-full-obd.ts
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { DatabaseSync } from "node:sqlite";

// Parse .env.local
const env = Object.fromEntries(
  readFileSync(".env.local", "utf-8")
    .split("\n").filter(l => l && !l.startsWith("#"))
    .map(l => l.split("=").map(s => s.trim()))
);

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!);

const sqliteDb = new DatabaseSync("/tmp/dtc-db/data/dtc_codes.db");

interface DtcRow {
  code: string;
  manufacturer: string;
  description: string;
  type: string;
  is_generic: number;
}

// Enrich a code with severity, symptoms, causes, fixes, costs
function enrichCode(code: string, description: string, type: string, manufacturer: string): any {
  const codeUpper = code.toUpperCase();
  const prefix = codeUpper.charAt(0);

  // Severity: 1=info, 2=minor, 3=moderate, 4=serious, 5=critical
  let severity = 3;
  let minCost: number | null = null;
  let maxCost: number | null = null;
  let symptoms: string[] = ["Check engine light illuminated", "Diagnostic trouble code stored"];
  let causes: string[] = [description];
  let fixes: string[] = ["Scan with OBD2 diagnostic tool", "Inspect related components and wiring"];

  // Powertrain codes
  if (prefix === "P") {
    if (codeUpper < "P0200") { severity = 3; minCost = 100; maxCost = 400; } // Fuel/Air
    else if (codeUpper < "P0300") { severity = 3; minCost = 100; maxCost = 500; } // Fuel/Air
    else if (codeUpper < "P0400") { severity = 4; minCost = 150; maxCost = 800; } // Misfire/Ignition
    else if (codeUpper < "P0500") { severity = 3; minCost = 150; maxCost = 600; } // Emissions/EGR
    else if (codeUpper < "P0600") { severity = 3; minCost = 100; maxCost = 400; } // Idle/Speed
    else if (codeUpper < "P0700") { severity = 5; minCost = 500; maxCost = 2000; } // ECM/PCM
    else if (codeUpper < "P0900") { severity = 4; minCost = 300; maxCost = 3500; } // Transmission
    else if (codeUpper < "P1000") { severity = 3; minCost = 200; maxCost = 800; } // Transmission
    else { severity = 3; minCost = 150; maxCost = 600; } // Manufacturer-specific

    symptoms = ["Check engine light on", "Reduced fuel economy", "Possible rough idle or hesitation"];
    causes = [description, "Manufacturer-specific condition", "Fault in related component or circuit"];
    fixes = ["Diagnose with professional OBD2 scan tool", "Check manufacturer TSBs for known issues", "Inspect related components per service manual"];
  }

  // Chassis codes
  if (prefix === "C") {
    if (codeUpper < "C1000") { severity = 4; minCost = 200; maxCost = 800; } // ABS/TCS
    else { severity = 3; minCost = 150; maxCost = 600; } // Steering/Suspension
    symptoms = ["ABS or traction control warning light", "Reduced braking performance", "Diagnostic trouble code stored"];
    causes = [description, "Fault in ABS/TCS system", "Wheel speed sensor or hydraulic unit issue"];
    fixes = ["Diagnose ABS system with professional scan tool", "Check wheel speed sensors", "Inspect brake hydraulic unit"];
  }

  // Body codes
  if (prefix === "B") {
    severity = 2; minCost = 100; maxCost = 500;
    symptoms = ["Warning light or message on dashboard", "Affected system may not function"];
    causes = [description, "Body control module fault", "Wiring or sensor issue"];
    fixes = ["Scan body control module with diagnostic tool", "Check affected system fuse and relay", "Inspect wiring harness"];
  }

  // Network/Communication codes
  if (prefix === "U") {
    severity = 4; minCost = 200; maxCost = 1000;
    symptoms = ["Multiple warning lights", "Gauges may not work", "Vehicle may not start"];
    causes = [description, "CAN bus communication error", "Module connection or wiring fault"];
    fixes = ["Check CAN bus with oscilloscope", "Inspect module connectors and ground points", "Test individual modules for communication"];
  }

  return { code, title: description, severity, symptoms_json: symptoms, causes_json: causes, fixes_json: fixes, min_cost: minCost, max_cost: maxCost };
}

async function main() {
  // Get existing codes
  const { data: existing } = await supabase.from("obd_codes").select("code");
  const existingSet = new Set((existing ?? []).map((r: any) => r.code));
  console.log(`Existing: ${existingSet.size}`);

  // Export from SQLite
  const stmt = sqliteDb.prepare("SELECT code, manufacturer, description, type, is_generic FROM dtc_definitions ORDER BY code");
  const rows = stmt.all() as DtcRow[];
  console.log(`SQLite total: ${rows.length}`);

  // Filter to new codes
  const toImport: any[] = [];
  for (const row of rows) {
    if (existingSet.has(row.code)) continue;
    toImport.push(enrichCode(row.code, row.description, row.type, row.manufacturer));
  }
  console.log(`New to import: ${toImport.length}`);

  // Batch insert
  let inserted = 0;
  for (let i = 0; i < toImport.length; i += 100) {
    const batch = toImport.slice(i, i + 100);
    const { error } = await supabase.from("obd_codes").upsert(batch, { onConflict: "code" });
    if (error) {
      console.log(`Batch ${i}: error - ${error.message}`);
      // Try individual inserts for the batch to skip problematic codes
      for (const item of batch) {
        const { error: e2 } = await supabase.from("obd_codes").upsert([item], { onConflict: "code" });
        if (!e2) inserted++;
      }
    } else {
      inserted += batch.length;
      if (i % 500 === 0) console.log(`Progress: ${i}/${toImport.length}`);
    }
  }

  console.log(`Inserted: ${inserted}`);

  // Final stats
  const { count } = await supabase.from("obd_codes").select("code", { count: "exact", head: true });
  console.log(`Final total in DB: ${count}`);

  sqliteDb.close();
}

main().catch(console.error);
