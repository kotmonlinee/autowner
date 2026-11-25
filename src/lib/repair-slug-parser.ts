// Parse a repair-cost slug to determine if it's generic or vehicle-specific.
// Format: {repair-slug}-{make-slug}-{model-slug}  (e.g., "brake-pads-toyota-camry")
// Strategy: try suffix matching against known make+model combinations.

import { createServiceSupabase } from "@/lib/supabase-server";

let _knownMakesModels: { makeSlug: string; modelSlug: string }[] | null = null;

async function getKnownMakesModels(): Promise<{ makeSlug: string; modelSlug: string }[]> {
  if (_knownMakesModels) return _knownMakesModels;
  const supabase = await createServiceSupabase();

  // PostgREST caps a single response at 1,000 rows. The vehicle catalog is
  // larger than that, so paging is required; a fixed 500-row limit silently
  // made otherwise valid vehicle-specific repair URLs return 404.
  const rows: { slug: string; vehicle_makes: { slug: string } }[] = [];
  const pageSize = 1000;
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from("vehicle_models")
      .select("slug, vehicle_makes!inner(slug)")
      .order("slug")
      .range(from, from + pageSize - 1);

    if (error || !data) break;
    rows.push(...(data as unknown as { slug: string; vehicle_makes: { slug: string } }[]));
    if (data.length < pageSize) break;
  }

  if (rows.length === 0) return [];
  _knownMakesModels = rows.map((row) => ({
    makeSlug: row.vehicle_makes.slug,
    modelSlug: row.slug,
  }));
  return _knownMakesModels;
}

export interface ParsedRepairSlug {
  repairSlug: string;
  makeSlug: string;
  modelSlug: string;
}

export async function parseRepairSlug(
  slug: string
): Promise<ParsedRepairSlug | null> {
  const known = await getKnownMakesModels();
  // Try matching from the end: check if slug ends with "-{makeSlug}-{modelSlug}"
  for (const { makeSlug, modelSlug } of known) {
    const suffix = `-${makeSlug}-${modelSlug}`;
    if (slug.endsWith(suffix)) {
      const repairSlug = slug.slice(0, slug.length - suffix.length);
      if (repairSlug.length > 0) {
        return { repairSlug, makeSlug, modelSlug };
      }
    }
  }
  return null;
}
