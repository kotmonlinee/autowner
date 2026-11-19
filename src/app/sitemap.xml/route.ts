import { unstable_cache } from "next/cache";
import { createServiceSupabase } from "@/lib/supabase-server";

export const revalidate = 3600;

function sitemapEntry(loc: string, lastmod: string | null): string {
  const lastmodTag = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : "";
  return `  <sitemap>\n    <loc>${loc}</loc>${lastmodTag}\n  </sitemap>`;
}

type DateFields = {
  updated_at?: string | null;
  created_at?: string | null;
};

function normalizeLastmod(value: string | null | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function latestDate(row: DateFields | null): string | null {
  return normalizeLastmod(row?.updated_at ?? row?.created_at);
}

async function fetchLatestDate(table: "warning_lights" | "repair_costs" | "obd_codes" | "symptoms" | "vehicle_symptoms" | "diagnoses"): Promise<string | null> {
  try {
    const supabase = await createServiceSupabase();
    const { data, error } = await supabase
      .from(table)
      .select("updated_at, created_at")
      .order("updated_at", { ascending: false, nullsFirst: false })
      .limit(1)
      .maybeSingle();
    if (error) return null;
    return latestDate(data as DateFields | null);
  } catch {
    return null;
  }
}

const getSitemapLastmods = unstable_cache(async () => {
  const [lights, repairs, obd, symptoms, vehicleSymptoms, diagnoses] = await Promise.all([
    fetchLatestDate("warning_lights"),
    fetchLatestDate("repair_costs"),
    fetchLatestDate("obd_codes"),
    fetchLatestDate("symptoms"),
    fetchLatestDate("vehicle_symptoms"),
    fetchLatestDate("diagnoses"),
  ]);

  const newest = (...values: Array<string | null>) =>
    values.filter((value): value is string => Boolean(value)).sort().at(-1) ?? null;

  return {
    staticTools: lights,
    repairsAndVehicles: repairs,
    obd,
    symptoms: newest(symptoms, vehicleSymptoms),
    diagnoses,
  };
}, ["sitemap-index-lastmod-v1"], { revalidate: 3600 });

export async function GET() {
  const baseUrl = "https://www.autowner.com";
  const dates = await getSitemapLastmods();

  const entries = [
    sitemapEntry(`${baseUrl}/sitemap/0`, dates.staticTools),
    sitemapEntry(`${baseUrl}/sitemap/1`, dates.repairsAndVehicles),
    sitemapEntry(`${baseUrl}/sitemap/2`, dates.obd),
    sitemapEntry(`${baseUrl}/sitemap/3`, dates.symptoms),
    sitemapEntry(`${baseUrl}/sitemap/4`, dates.diagnoses),
    sitemapEntry(`${baseUrl}/sitemap/5`, dates.diagnoses),
    sitemapEntry(`${baseUrl}/sitemap/6`, dates.diagnoses),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</sitemapindex>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "CDN-Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      "Vercel-CDN-Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
