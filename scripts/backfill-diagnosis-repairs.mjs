// Usage: node scripts/backfill-diagnosis-repairs.mjs
// Backfills matchedRepairSlugs for historical diagnoses by matching
// repairKeywords against the diy_difficulty table.
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const env = {};
readFileSync(".env.local", "utf8").split("\n").forEach(l => {
  const p = l.split("=");
  if (p.length > 1) env[p[0].trim()] = p.slice(1).join("=").trim();
});

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY ?? "";

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing env vars");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  // Fetch all DIY entries
  const { data: allDiy } = await supabase.from("diy_difficulty").select("*");
  const diyList = (allDiy ?? []);
  console.log(`Loaded ${diyList.length} DIY entries`);

  // Fetch all diagnoses
  const { data: diagnoses } = await supabase.from("diagnoses").select("id, slug, diagnosis_json").order("created_at");
  if (!diagnoses) { console.error("No diagnoses found"); return; }
  console.log(`Loaded ${diagnoses.length} diagnoses`);

  let updated = 0;
  let skipped = 0;
  let matched = 0;

  for (let i = 0; i < diagnoses.length; i++) {
    const row = diagnoses[i];
    const json = row.diagnosis_json;

    // Skip if already has matchedRepairSlugs
    if (json.matchedRepairSlugs?.length) {
      skipped++;
      continue;
    }

    const keywords = json.repairKeywords ?? [];
    if (!keywords.length) {
      skipped++;
      continue;
    }

    const matchedSlugs = [];
    for (const kw of keywords) {
      const kwLower = kw.toLowerCase();
      // Direct name match
      let match = diyList.find(r =>
        r.repair_name.toLowerCase().includes(kwLower) ||
        kwLower.includes(r.repair_name.toLowerCase())
      );
      // Try slug match (convert hyphen to underscore)
      if (!match) {
        const slugified = kwLower.replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
        match = diyList.find(r =>
          r.repair_slug.includes(slugified) || slugified.includes(r.repair_slug)
        );
      }
      if (match && !matchedSlugs.includes(match.repair_slug)) {
        matchedSlugs.push(match.repair_slug);
      }
    }

    if (matchedSlugs.length > 0) {
      json.matchedRepairSlugs = matchedSlugs;
      await supabase.from("diagnoses").update({ diagnosis_json: json }).eq("id", row.id);
      updated++;
      matched += matchedSlugs.length;
      console.log(`  [${i + 1}/${diagnoses.length}] ${row.slug}: ${keywords.join(", ")} → ${matchedSlugs.join(", ")}`);
    } else {
      console.log(`  [${i + 1}/${diagnoses.length}] ${row.slug}: ${keywords.join(", ")} → NO MATCH`);
    }

    // Rate limit
    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\nDone! ${updated} updated, ${skipped} skipped, ${matched} repair slugs matched.`);
}

main().catch(console.error);
