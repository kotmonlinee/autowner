// Parse a repair-cost slug to determine if it's generic or vehicle-specific.
// Format: {repair-slug}-{make-slug}-{model-slug}  (e.g., "brake-pads-toyota-camry")
// Strategy: try suffix matching against known make+model combinations.

import { createServiceSupabase } from "@/lib/supabase-server";

let _knownMakesModels: { makeSlug: string; modelSlug: string }[] | null = null;

async function getKnownMakesModels(): Promise<{ makeSlug: string; modelSlug: string }[]> {
  if (_knownMakesModels) return _knownMakesModels;
  const supabase = await createServiceSupabase();
  const { data } = await supabase
    .from("vehicle_models")
    .select("slug, vehicle_makes!inner(slug)")
    .limit(500);
  if (!data) return [];
  _knownMakesModels = (data as unknown as { slug: string; vehicle_makes: { slug: string } }[]).map(
    (r) => ({ makeSlug: r.vehicle_makes.slug, modelSlug: r.slug })
  );
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
