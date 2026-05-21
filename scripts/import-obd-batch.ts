// Import OBD codes from SQL file in optimized batches
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf-8").split("\n").filter(l=>l&&!l.startsWith("#")).map(l=>l.split("=").map(s=>s.trim()))
);
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!);

async function main() {
  const sql = readFileSync("supabase/migrations/018_full_obd_codes.sql", "utf8");
  const batches = sql.match(/INSERT INTO obd_codes[^;]+;/g) || [];
  console.log(`Total batches: ${batches.length}`);

  for (let i = 0; i < batches.length; i++) {
    const b = batches[i];
    // @ts-ignore - dotAll flag needs ES2018
    const match = b.match(/VALUES\s+(.+);/s);
    if (!match) { console.log(`Batch ${i}: no VALUES found`); continue; }

    const rows: any[] = [];
    const allValues = match[1];
    // Split by ),( — each row is enclosed in parentheses
    const rowStrs = allValues.split(/\),\s*\(/);
    for (const rs of rowStrs) {
      const clean = rs.replace(/^\(|\)$/g, "");
      // Simple comma split (values are safe — no commas in strings)
      const vals = clean.split(/, (?=(?:[^']*'[^']*')*[^']*$)/);
      if (vals.length >= 8) {
        const code = vals[0].replace(/^'|'$/g, "");
        rows.push({
          code,
          title: vals[1].replace(/^'|'$/g, ""),
          severity: parseInt(vals[2]) || 3,
          symptoms_json: vals[3],
          causes_json: vals[4],
          fixes_json: vals[5],
          min_cost: vals[6] === "NULL" ? null : parseInt(vals[6]),
          max_cost: vals[7] === "NULL" ? null : parseInt(vals[7]),
        });
      }
    }

    if (rows.length === 0) { console.log(`Batch ${i}: no rows`); continue; }

    // Deduplicate
    const seen = new Set<string>();
    const unique = rows.filter(r => {
      if (seen.has(r.code)) return false;
      seen.add(r.code);
      return true;
    });

    try {
      const { error } = await supabase.from("obd_codes").upsert(unique, { onConflict: "code" });
      if (error) {
        // If batch fails, try one by one
        console.log(`Batch ${i}: retrying individually (${error.message})`);
        for (const r of unique) {
          await supabase.from("obd_codes").upsert([r], { onConflict: "code" });
        }
      }
    } catch (e: any) {
      console.log(`Batch ${i}: error - ${e.message}`);
    }

    if (i % 5 === 0) console.log(`Progress: ${i}/${batches.length}`);
  }

  const { count } = await supabase.from("obd_codes").select("code", { count: "exact", head: true });
  console.log(`Final count: ${count}`);
}

main().catch(console.error);
