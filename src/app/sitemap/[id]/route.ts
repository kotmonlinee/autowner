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

/**
 * Fetch a contiguous range of diagnosis rows in parallel batches.
 * Order is by created_at DESC; once any batch comes back short, higher
 * offsets are empty so we stop. Keeps serverless duration under budget.
 */
async function fetchDiagnosisBatches(
  startOffset: number,
  maxRows: number,
  batchSize = 1000,
  concurrency = 1,
): Promise<DiagnosisSitemapRow[]> {
  const offsets: number[] = [];
  for (let offset = startOffset; offset < startOffset + maxRows; offset += batchSize) {
    offsets.push(offset);
  }

  const rows: DiagnosisSitemapRow[] = [];
  for (let i = 0; i < offsets.length; i += concurrency) {
    const batch = await Promise.all(
      offsets.slice(i, i + concurrency).map(async (offset) => {
        const supabase = await createServiceSupabase();
        const { data } = await supabase
          .from("diagnoses")
          .select("slug, created_at, updated_at")
          .order("created_at", { ascending: false })
          .order("slug", { ascending: false })
          .range(offset, offset + batchSize - 1);
        return (data ?? []) as unknown as DiagnosisSitemapRow[];
      }),
    );
    for (const page of batch) rows.push(...page);
    if (batch.some((page) => page.length < batchSize)) break;
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
    urls.push(urlEntry(`${baseUrl}/search`, null, "weekly", 0.4));
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
    const supabase = await createServiceSupabase();
    const { data: symptoms } = await supabase.from("symptoms").select("slug, created_at, updated_at").order("slug");
    for (const s of (symptoms ?? []) as unknown as SymptomSitemapRow[]) {
      urls.push(urlEntry(`${baseUrl}/symptoms/${s.slug}`, s.updated_at ?? s.created_at ?? null, "weekly", 0.75));
    }
    let vsOffset = 0;
    while (true) {
      const { data: vsBatch } = await supabase.from("vehicle_symptoms")
        .select("slug, created_at").order("slug").range(vsOffset, vsOffset + 999);
      if (!vsBatch || vsBatch.length === 0) break;
      for (const vs of vsBatch as unknown as VehicleSymptomSitemapRow[]) {
        urls.push(urlEntry(`${baseUrl}/symptoms/${vs.slug}`, vs.created_at ?? null, "weekly", 0.7));
      }
      if (vsBatch.length < 1000) break;
      vsOffset += 1000;
    }
  }

  // ── id=4: Diagnoses batch 1 (0–9999) ──────────────────────
  if (id === "4") {
    const rows = await fetchDiagnosisBatches(0, 10000);
    for (const d of rows) {
      urls.push(urlEntry(`${baseUrl}/symptom-checker/${d.slug}`, d.updated_at ?? d.created_at ?? null, "weekly", 0.6));
    }
  }

  // ── id=5: Diagnoses batch 2 (10000–19999) ──────────────────
  if (id === "5") {
    const rows = await fetchDiagnosisBatches(10000, 10000);
    for (const d of rows) {
      urls.push(urlEntry(`${baseUrl}/symptom-checker/${d.slug}`, d.updated_at ?? d.created_at ?? null, "weekly", 0.6));
    }
  }

  // ── id=6: Diagnoses batch 3 (20000+) ──────────────────────
  if (id === "6") {
    const rows = await fetchDiagnosisBatches(20000, 30000);
    for (const d of rows) {
      urls.push(urlEntry(`${baseUrl}/symptom-checker/${d.slug}`, d.updated_at ?? d.created_at ?? null, "weekly", 0.6));
    }
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
