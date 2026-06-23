import { getAllRepairSlugs, getTopObdCodes, getVehicleRepairSlugs } from "@/lib/data/server";
import { createServiceSupabase } from "@/lib/supabase-server";
import { warningLights } from "@/lib/warning-lights-data";

export const revalidate = 3600;

function xmlEscape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function urlEntry(loc: string, lastmod: string, changefreq: string, priority: number): string {
  return `  <url>\n    <loc>${xmlEscape(loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const baseUrl = "https://www.autowner.com";
  const now = new Date().toISOString();
  const urls: string[] = [];

  // ── id=0: Static + Tools + Warning Lights ─────────────────
  if (id === "0") {
    urls.push(urlEntry(baseUrl, now, "hourly", 1.0));
    urls.push(urlEntry(`${baseUrl}/about`, now, "weekly", 0.4));
    urls.push(urlEntry(`${baseUrl}/privacy`, now, "weekly", 0.1));
    urls.push(urlEntry(`${baseUrl}/terms`, now, "weekly", 0.1));
    urls.push(urlEntry(`${baseUrl}/contact`, now, "weekly", 0.4));
    urls.push(urlEntry(`${baseUrl}/search`, now, "weekly", 0.4));
    urls.push(urlEntry(`${baseUrl}/repair-cost`, now, "weekly", 0.9));
    urls.push(urlEntry(`${baseUrl}/obd`, now, "weekly", 0.8));
    urls.push(urlEntry(`${baseUrl}/quote-checker`, now, "weekly", 0.8));
    urls.push(urlEntry(`${baseUrl}/warning-lights`, now, "weekly", 0.9));
    urls.push(urlEntry(`${baseUrl}/symptom-checker`, now, "weekly", 0.9));
    urls.push(urlEntry(`${baseUrl}/recall-check`, now, "weekly", 0.8));
    urls.push(urlEntry(`${baseUrl}/vehicles`, now, "weekly", 0.8));
    urls.push(urlEntry(`${baseUrl}/symptoms`, now, "weekly", 0.8));
    urls.push(urlEntry(`${baseUrl}/obd/severity-levels`, now, "weekly", 0.6));
    urls.push(urlEntry(`${baseUrl}/repair-cost/diy-levels`, now, "weekly", 0.6));
    for (const l of warningLights) {
      urls.push(urlEntry(`${baseUrl}/warning-lights/${l.slug}`, now, "weekly", 0.7));
    }
  }

  // ── id=1: Repair cost + Vehicle×Repair ────────────────────
  if (id === "1") {
    const [repairSlugs, vehicleModels] = await Promise.all([
      getAllRepairSlugs(),
      getVehicleRepairSlugs(100),
    ]);
    for (const s of repairSlugs) {
      urls.push(urlEntry(`${baseUrl}/repair-cost/${s}`, now, "weekly", 0.7));
    }
    for (const vm of vehicleModels) {
      for (const s of repairSlugs) {
        urls.push(urlEntry(`${baseUrl}/repair-cost/${s}-${vm.makeSlug}-${vm.modelSlug}`, now, "weekly", 0.65));
      }
      urls.push(urlEntry(`${baseUrl}/vehicles/${vm.makeSlug}/${vm.modelSlug}`, now, "weekly", 0.7));
    }
  }

  // ── id=2: OBD codes + OBD×Vehicle ─────────────────────────
  if (id === "2") {
    const topObdCodes = await getTopObdCodes(15000);
    const vehicleModels = await getVehicleRepairSlugs(20);

    const standardCodes = topObdCodes.filter((c) => /^[PCBU]\d{4}$/i.test(c.code)).slice(0, 50);
    for (const c of standardCodes) {
      for (const vm of vehicleModels) {
        urls.push(urlEntry(`${baseUrl}/obd/${c.code.toLowerCase()}/${vm.makeSlug}/${vm.modelSlug}`, now, "weekly", 0.6));
      }
    }
    for (const c of topObdCodes) {
      const code = c.code;
      if (!/^[A-Z0-9]+$/i.test(code)) continue;
      urls.push(urlEntry(`${baseUrl}/obd/${code.toLowerCase()}`, now, "weekly", 0.7));
    }
  }

  // ── id=3: Symptoms + Vehicle symptoms ─────────────────────
  if (id === "3") {
    const supabase = await createServiceSupabase();
    const { data: symptoms } = await supabase.from("symptoms").select("slug, created_at, updated_at").order("slug");
    for (const s of (symptoms ?? []) as any[]) {
      const lm = s.updated_at ?? s.created_at ?? now;
      urls.push(urlEntry(`${baseUrl}/symptoms/${s.slug}`, lm, "weekly", 0.75));
    }
    let vsOffset = 0;
    while (true) {
      const { data: vsBatch } = await supabase.from("vehicle_symptoms")
        .select("slug, created_at").order("slug").range(vsOffset, vsOffset + 999);
      if (!vsBatch || vsBatch.length === 0) break;
      for (const vs of vsBatch as any[]) {
        urls.push(urlEntry(`${baseUrl}/symptoms/${vs.slug}`, vs.created_at ?? now, "weekly", 0.7));
      }
      if (vsBatch.length < 1000) break;
      vsOffset += 1000;
    }
  }

  // ── id=4: Diagnoses batch 1 (0–9999) ──────────────────────
  if (id === "4") {
    const supabase = await createServiceSupabase();
    const BATCH = 1000;
    for (let offset = 0; offset < 10000; offset += BATCH) {
      const { data } = await supabase.from("diagnoses")
        .select("slug, created_at")
        .order("created_at", { ascending: false })
        .range(offset, offset + BATCH - 1);
      if (!data || data.length === 0) break;
      for (const d of data) {
        urls.push(urlEntry(`${baseUrl}/symptom-checker/${d.slug}`, d.created_at ?? now, "weekly", 0.6));
      }
    }
  }

  // ── id=5: Diagnoses batch 2 (10000–19999) ──────────────────
  if (id === "5") {
    const supabase = await createServiceSupabase();
    const BATCH = 1000;
    for (let offset = 10000; offset < 20000; offset += BATCH) {
      const { data } = await supabase.from("diagnoses")
        .select("slug, created_at")
        .order("created_at", { ascending: false })
        .range(offset, offset + BATCH - 1);
      if (!data || data.length === 0) break;
      for (const d of data) {
        urls.push(urlEntry(`${baseUrl}/symptom-checker/${d.slug}`, d.created_at ?? now, "weekly", 0.6));
      }
    }
  }

  // ── id=6: Diagnoses batch 3 (20000+) ──────────────────────
  if (id === "6") {
    const supabase = await createServiceSupabase();
    const BATCH = 1000;
    for (let offset = 20000; offset < 50000; offset += BATCH) {
      const { data } = await supabase.from("diagnoses")
        .select("slug, created_at")
        .order("created_at", { ascending: false })
        .range(offset, offset + BATCH - 1);
      if (!data || data.length === 0) break;
      for (const d of data) {
        urls.push(urlEntry(`${baseUrl}/symptom-checker/${d.slug}`, d.created_at ?? now, "weekly", 0.6));
      }
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
