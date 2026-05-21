// Import OBD codes from JSON into Supabase
// Run: npx tsx scripts/import-obd-json.ts
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf-8").split("\n").filter(l=>l&&!l.startsWith("#")).map(l=>l.split("=").map(s=>s.trim()))
);
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!);

interface RawCode { code: string; description: string }

function enrich(raw: RawCode) {
  const code = raw.code.toUpperCase();
  const p = code.charAt(0);
  let severity = 3, minCost: number | null = null, maxCost: number | null = null;
  let symptoms = JSON.stringify(["Diagnostic trouble code stored", "Check engine light may illuminate"]);
  let causes = JSON.stringify([raw.description, "Fault in related component or circuit"]);
  let fixes = JSON.stringify(["Scan with OBD2 diagnostic tool", "Inspect related components and wiring"]);

  if (p === "P") {
    symptoms = JSON.stringify(["Check engine light on", "Reduced fuel economy", "Possible rough idle or hesitation"]);
    causes = JSON.stringify([raw.description, "Manufacturer-specific condition", "Fault in related component or circuit"]);
    fixes = JSON.stringify(["Diagnose with professional OBD2 scan tool", "Check manufacturer TSBs", "Inspect related components per service manual"]);
    if (code < "P0200") { severity = 3; minCost = 100; maxCost = 400; }
    else if (code < "P0300") { severity = 3; minCost = 100; maxCost = 500; }
    else if (code < "P0400") { severity = 4; minCost = 150; maxCost = 800; }
    else if (code < "P0500") { severity = 3; minCost = 150; maxCost = 600; }
    else if (code < "P0600") { severity = 3; minCost = 100; maxCost = 400; }
    else if (code < "P0700") { severity = 5; minCost = 500; maxCost = 2000; }
    else if (code < "P0900") { severity = 4; minCost = 300; maxCost = 3500; }
    else if (code < "P1000") { severity = 3; minCost = 200; maxCost = 800; }
    else { severity = 3; minCost = 150; maxCost = 600; }
  } else if (p === "C") {
    symptoms = JSON.stringify(["ABS/traction warning light", "Diagnostic trouble code stored"]);
    severity = 4; minCost = 200; maxCost = 800;
  } else if (p === "B") {
    symptoms = JSON.stringify(["Warning light/message on dashboard", "Affected system may not function"]);
    severity = 2; minCost = 100; maxCost = 500;
  } else if (p === "U") {
    symptoms = JSON.stringify(["Multiple warning lights", "Gauges may not work", "Vehicle may not start"]);
    severity = 4; minCost = 200; maxCost = 1000;
  }

  return { code, title: raw.description, severity, symptoms_json: symptoms, causes_json: causes, fixes_json: fixes, min_cost: minCost, max_cost: maxCost };
}

async function main() {
  const data: RawCode[] = JSON.parse(readFileSync("/tmp/obd_codes_full.json", "utf8"));
  console.log(`JSON has ${data.length} codes`);

  // Get existing codes to skip
  const { data: existing } = await supabase.from("obd_codes").select("code");
  const existingSet = new Set((existing ?? []).map((r: any) => r.code));
  console.log(`Existing in DB: ${existingSet.size}`);

  // Enrich and filter
  const toImport = data.filter(d => !existingSet.has(d.code)).map(enrich);
  console.log(`New to import: ${toImport.length}`);

  // Batch upsert 500 at a time
  let done = 0;
  for (let i = 0; i < toImport.length; i += 500) {
    const batch = toImport.slice(i, i + 500);
    // Deduplicate within batch
    const seen = new Set<string>();
    const unique = batch.filter(r => { if (seen.has(r.code)) return false; seen.add(r.code); return true; });

    const { error } = await supabase.from("obd_codes").upsert(unique, { onConflict: "code" });
    if (error) {
      console.log(`Batch ${i}: ${error.message} — retrying smaller`);
      for (const r of unique) {
        await supabase.from("obd_codes").upsert([r], { onConflict: "code" });
      }
    }
    done += unique.length;
    console.log(`Progress: ${done}/${toImport.length} (${Math.round(done/toImport.length*100)}%)`);
  }

  const { count } = await supabase.from("obd_codes").select("code", { count: "exact", head: true });
  console.log(`Done! Final count: ${count}`);
}

main().catch(console.error);
