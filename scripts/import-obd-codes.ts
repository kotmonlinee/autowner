// Import all OBD2 codes from fabiovila/OBDIICodes dataset
// Run: npx tsx scripts/import-obd-codes.ts
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf-8")
    .split("\n").filter(l => l && !l.startsWith("#"))
    .map(l => l.split("=").map(s => s.trim()))
);

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!);

interface ObdItem { Code: string; Description: string }

function enrichCode(code: string, description: string) {
  const prefix = code.toUpperCase();
  let severity = 3, minCost: number | null = null, maxCost: number | null = null;
  let symptoms: string[] = ["Diagnostic trouble code stored", "Check engine light may illuminate"];
  let causes: string[] = ["Fault in related component or circuit", "See manufacturer service manual"];
  let fixes: string[] = ["Diagnose with professional scan tool", "Inspect related components and wiring"];

  if (prefix.startsWith("P2") || prefix.startsWith("P3")) {
    severity = 4; minCost = 300; maxCost = 1500;
    symptoms = ["Check engine light on", "Reduced engine performance", "Diagnostic trouble code stored"];
  }
  if (prefix.startsWith("P3")) { minCost = 350; maxCost = 2000; }

  return { code, title: description, severity, symptoms_json: symptoms, causes_json: causes, fixes_json: fixes, min_cost: minCost, max_cost: maxCost };
}

async function main() {
  const data: ObdItem[] = JSON.parse(readFileSync("/tmp/obd-codes/codes.json", "utf8"));

  // Get existing codes
  const { data: existing } = await supabase.from("obd_codes").select("code");
  const existingSet = new Set((existing ?? []).map((r: any) => r.code));

  // Filter to new codes
  const toInsert: any[] = [];
  for (const item of data) {
    const code = item.Code.split("/")[0].trim();
    if (existingSet.has(code)) continue;
    toInsert.push(enrichCode(code, item.Description));
  }

  console.log(`Adding ${toInsert.length} codes (${toInsert.filter(c => c.code.startsWith("P2")).length} P2, ${toInsert.filter(c => c.code.startsWith("P3")).length} P3)`);

  // Batch upsert
  for (let i = 0; i < toInsert.length; i += 100) {
    const batch = toInsert.slice(i, i + 100);
    const { error } = await supabase.from("obd_codes").upsert(batch, { onConflict: "code" });
    if (error) console.log(`Batch ${i}: error - ${error.message}`);
    else console.log(`Batch ${i}/${toInsert.length}: ${batch.length} codes`);
  }

  // Final count
  const { count } = await supabase.from("obd_codes").select("code", { count: "exact", head: true });
  console.log(`Total codes in DB: ${count}`);
}

main().catch(console.error);
