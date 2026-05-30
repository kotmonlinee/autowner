// Import NHTSA vehicle models into our database
// Fetches all models for each make across a wide year range
// Run: npx tsx scripts/import-nhtsa-models.ts

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const NHTSA_BASE = "https://api.nhtsa.gov/products/vehicle/models";

async function fetchNhtsaModels(make: string, year: string): Promise<string[]> {
  const url = `${NHTSA_BASE}?make=${encodeURIComponent(make)}&modelYear=${year}&issueType=r`;
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results ?? []).map((r: { model: string }) => r.model);
  } catch {
    return [];
  }
}

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function main() {
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

  // Get all makes from our database
  const { data: makes } = await supabase
    .from("vehicle_makes")
    .select("id, name, slug")
    .order("name");

  if (!makes?.length) { console.log("No makes found"); return; }

  const years = Array.from({ length: 32 }, (_, i) => String(1995 + i)); // 1995-2026

  console.log(`Fetching NHTSA models for ${makes.length} makes across ${years.length} years...`);

  let totalInserted = 0;

  for (const make of makes) {
    const makeId = (make as { id: string; name: string; slug: string }).id;
    const makeName = (make as { name: string }).name;
    const allModels = new Set<string>();

    // Fetch models across all years (NHTSA batches by year)
    for (const year of years) {
      const models = await fetchNhtsaModels(makeName, year);
      for (const m of models) allModels.add(m);
    }

    if (allModels.size === 0) { console.log(`  ${makeName}: 0 models (skipped)`); continue; }

    // Batch insert/upsert
    const rows = Array.from(allModels).map((name) => ({
      make_id: makeId,
      name,
      slug: slugify(name),
    }));

    const { error } = await supabase
      .from("vehicle_models")
      .upsert(rows, { onConflict: "make_id, slug", ignoreDuplicates: true });

    if (error) {
      console.error(`  ${makeName}: ERROR - ${error.message}`);
    } else {
      console.log(`  ${makeName}: ${allModels.size} models`);
      totalInserted += allModels.size;
    }
  }

  console.log(`\nDone. ${totalInserted} total models imported.`);
}

main().catch(console.error);
