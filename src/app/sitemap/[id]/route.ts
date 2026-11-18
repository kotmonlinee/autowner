import { getAllRepairSlugsWithDates, getTopObdCodes, getVehicleRepairSlugs, getAllWarningLights } from "@/lib/data/server";
import { createServiceSupabase } from "@/lib/supabase-server";

export const revalidate = 86400;
export const maxDuration = 60;

function xmlEscape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function urlEntry(loc: string, lastmod: string | null, changefreq: string, priority: number): string {
  const lastmodTag = lastmod ? `\n    <lastmod>${xmlEscape(lastmod)}</lastmod>` : "";
  return `  <url>\n    <loc>${xmlEscape(loc)}</loc>${lastmodTag}\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

interface DiagnosisSitemapRow {
  slug: string;
  created_at: string;
  updated_at: string | null;
}

interface SymptomSitemapRow {
  slug: string;
  created_at: string | null;
  updated_at: string | null;
}

interface VehicleSymptomSitemapRow {
  slug: string;
  created_at: string | null;
}

const BATCH = 1000;

/**
 * Fetch a contiguous range of diagnosis rows.
 *
 * The previous implementation treated a short page as "end of data" and broke
 * out of the loop, which cached a sitemap shard containing only a fraction of
 * its URLs (the OBD shard was once cached with 725 of 12k codes). Here the
 * exact row count bounds the loop, a short page is simply accepted, and any
 * query error aborts the request so a partial sitemap is never cached.
 */
async function fetchDiagnosisRange(startOffset: number, maxRows: number): Promise<DiagnosisSitemapRow[]> {
  const supabase = await createServiceSupabase();
  const { count, error: countError } = await supabase
    .from("diagnoses")
    .select("slug", { count: "exact", head: true });
  if (countError) throw new Error(`diagnoses count: ${countError.message}`);

  const end = Math.min(startOffset + maxRows, count ?? 0);
  const rows: DiagnosisSitemapRow[] = [];

  for (let offset = startOffset; offset < end; offset += BATCH) {
    const { data, error } = await supabase
      .from("diagnoses")
      .select("slug, created_at, updated_at")
      .order("created_at", { ascending: false })
      .order("slug", { ascending: false })
      .range(offset, offset + BATCH - 1);
    if (error) throw new Error(`diagnoses offset ${offset}: ${error.message}`);
    rows.push(...((data ?? []) as unknown as DiagnosisSitemapRow[]));
  }

  return rows;
}

async function fetchTableBySlug<T extends { slug: string }>(
  table: "symptoms" | "vehicle_symptoms",
  columns: string,
): Promise<T[]> {
  const supabase = await createServiceSupabase();
  const { count, error: countError } = await supabase
    .from(table)
    .select("slug", { count: "exact", head: true });
  if (countError) throw new Error(`${table} count: ${countError.message}`);

  const total = count ?? 0;
  const rows: T[] = [];

  for (let offset = 0; offset < total; offset += BATCH) {
    const { data, error } = await supabase
      .from(table)
      .select(columns)
      .order("slug")
      .range(offset, offset + BATCH - 1);
    if (error) throw new Error(`${table} offset ${offset}: ${error.message}`);
    rows.push(...((data ?? []) as unknown as T[]));
  }

  return rows;
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const baseUrl = "https://www.autowner.com";
  const urls: string[] = [];

  // ── id=0: Static + Tools + Warning Lights ─────────────────
  if (id === "0") {
    urls.push(urlEntry(baseUrl, null, "hourly", 1.0));
    urls.push(urlEntry(`${baseUrl}/repair-cost`, null, "weekly", 0.9));
    urls.push(urlEntry(`${baseUrl}/obd`, null, "weekly", 0.8));
    urls.push(urlEntry(`${baseUrl}/quote-checker`, null, "weekly", 0.8));
    urls.push(urlEntry(`${baseUrl}/warning-lights`, null, "weekly", 0.9));
    urls.push(urlEntry(`${baseUrl}/symptom-checker`, null, "weekly", 0.9));
    urls.push(urlEntry(`${baseUrl}/recall-check`, null, "weekly", 0.8));
    urls.push(urlEntry(`${baseUrl}/vehicles`, null, "weekly", 0.8));
    urls.push(urlEntry(`${baseUrl}/symptoms`, null, "weekly", 0.8));
    urls.push(urlEntry(`${baseUrl}/obd/severity-levels`, null, "weekly", 0.6));
    urls.push(urlEntry(`${baseUrl}/repair-cost/diy-levels`, null, "weekly", 0.6));
    for (const l of (await getAllWarningLights())) {
      urls.push(urlEntry(`${baseUrl}/warning-lights/${l.slug}`, l.updated_at ?? l.created_at ?? null, "weekly", 0.7));
    }
  }

  // ── id=1: Repair cost + Vehicle×Repair ────────────────────
  if (id === "1") {
    const [repairs, vehicleModels] = await Promise.all([
      getAllRepairSlugsWithDates(),
      getVehicleRepairSlugs(100),
    ]);
    for (const r of repairs) {
      urls.push(urlEntry(`${baseUrl}/repair-cost/${r.slug}`, r.lastmod, "weekly", 0.7));
    }
    for (const vm of vehicleModels) {
      urls.push(urlEntry(`${baseUrl}/vehicles/${vm.makeSlug}/${vm.modelSlug}`, null, "weekly", 0.7));
    }
  }

  // ── id=2: OBD codes + OBD×Vehicle ─────────────────────────
  if (id === "2") {
    const topObdCodes = await getTopObdCodes(15000);
    for (const c of topObdCodes) {
      const code = c.code;
      if (!/^[A-Z0-9]+$/i.test(code)) continue;
      urls.push(urlEntry(`${baseUrl}/obd/${code.toLowerCase()}`, c.updated_at ?? null, "weekly", 0.7));
    }
  }

  // ── id=3: Symptoms + Vehicle symptoms ─────────────────────
  if (id === "3") {
    const [symptoms, vehicleSymptoms] = await Promise.all([
      fetchTableBySlug<SymptomSitemapRow>("symptoms", "slug, created_at, updated_at"),
      fetchTableBySlug<VehicleSymptomSitemapRow>("vehicle_symptoms", "slug, created_at"),
    ]);
    for (const s of symptoms) {
      urls.push(urlEntry(`${baseUrl}/symptoms/${s.slug}`, s.updated_at ?? s.created_at ?? null, "weekly", 0.75));
    }
    for (const vs of vehicleSymptoms) {
      urls.push(urlEntry(`${baseUrl}/symptoms/${vs.slug}`, vs.created_at ?? null, "weekly", 0.7));
    }
  }

  // ── id=4: Diagnoses batch 1 (0–9999) ──────────────────────
  if (id === "4") {
    const rows = await fetchDiagnosisRange(0, 10000);
    for (const d of rows) {
      urls.push(urlEntry(`${baseUrl}/symptom-checker/${d.slug}`, d.updated_at ?? d.created_at ?? null, "weekly", 0.6));
    }
  }

  // ── id=5: Diagnoses batch 2 (10000–19999) ──────────────────
  if (id === "5") {
    const rows = await fetchDiagnosisRange(10000, 10000);
    for (const d of rows) {
      urls.push(urlEntry(`${baseUrl}/symptom-checker/${d.slug}`, d.updated_at ?? d.created_at ?? null, "weekly", 0.6));
    }
  }

  // ── id=6: Diagnoses batch 3 (20000+) ──────────────────────
  if (id === "6") {
    const rows = await fetchDiagnosisRange(20000, 30000);
    for (const d of rows) {
      urls.push(urlEntry(`${baseUrl}/symptom-checker/${d.slug}`, d.updated_at ?? d.created_at ?? null, "weekly", 0.6));
    }
  }

  // Never cache an empty content shard: an empty response would hide every URL
  // in that shard from search engines until the cache expires.
  if (["2", "3", "4", "5", "6"].includes(id) && urls.length === 0) {
    throw new Error(`sitemap/${id} generated no URLs`);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "CDN-Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      "Vercel-CDN-Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
