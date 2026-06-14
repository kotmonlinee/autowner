import { getPosts, getAllRepairSlugs, getTopObdCodes, getVehicleRepairSlugs } from "@/lib/data/server";
import { createServiceSupabase } from "@/lib/supabase-server";
import { warningLights } from "@/lib/warning-lights-data";

export const revalidate = 3600;

function xmlEscape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function urlEntry(loc: string, lastmod: string, changefreq: string, priority: number): string {
  return `  <url>\n    <loc>${xmlEscape(loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

export async function GET() {
  const baseUrl = "https://www.autowner.com";
  const now = new Date().toISOString();

  const [{ posts }, repairSlugs, topObdCodes, vehicleModels] = await Promise.all([
    getPosts({ sort: "new", limit: 10000 }),
    getAllRepairSlugs(),
    getTopObdCodes(15000),
    getVehicleRepairSlugs(100),
  ]);

  const urls: string[] = [];

  // Static pages
  urls.push(urlEntry(baseUrl, now, "hourly", 1.0));
  urls.push(urlEntry(`${baseUrl}/community`, now, "hourly", 0.9));
  urls.push(urlEntry(`${baseUrl}/about`, now, "monthly", 0.4));
  urls.push(urlEntry(`${baseUrl}/privacy`, now, "yearly", 0.1));
  urls.push(urlEntry(`${baseUrl}/terms`, now, "yearly", 0.1));
  urls.push(urlEntry(`${baseUrl}/contact`, now, "yearly", 0.4));
  urls.push(urlEntry(`${baseUrl}/search`, now, "weekly", 0.4));

  // Tool landing pages
  urls.push(urlEntry(`${baseUrl}/repair-cost`, now, "weekly", 0.9));
  urls.push(urlEntry(`${baseUrl}/obd`, now, "weekly", 0.8));
  urls.push(urlEntry(`${baseUrl}/quote-checker`, now, "weekly", 0.8));
  urls.push(urlEntry(`${baseUrl}/warning-lights`, now, "weekly", 0.9));
  urls.push(urlEntry(`${baseUrl}/symptom-checker`, now, "weekly", 0.9));
  urls.push(urlEntry(`${baseUrl}/recall-check`, now, "weekly", 0.8));
  urls.push(urlEntry(`${baseUrl}/vehicles`, now, "weekly", 0.8));
  urls.push(urlEntry(`${baseUrl}/obd/severity-levels`, now, "monthly", 0.6));
  urls.push(urlEntry(`${baseUrl}/repair-cost/diy-levels`, now, "monthly", 0.6));

  // Repair cost detail pages
  for (const slug of repairSlugs) {
    urls.push(urlEntry(`${baseUrl}/repair-cost/${slug}`, now, "monthly", 0.7));
  }

  // Vehicle-specific repair cost pages (model × repair cross-reference)
  for (const vm of vehicleModels) {
    for (const slug of repairSlugs) {
      urls.push(urlEntry(`${baseUrl}/repair-cost/${slug}-${vm.makeSlug}-${vm.modelSlug}`, now, "monthly", 0.65));
    }
  }

  // Vehicle Hub pages
  for (const vm of vehicleModels) {
    urls.push(urlEntry(`${baseUrl}/vehicles/${vm.makeSlug}/${vm.modelSlug}`, now, "monthly", 0.7));
  }

  // OBD code × Vehicle cross-reference pages (top 50 codes × top 20 models)
  const standardObdCodes = topObdCodes.filter((c) => /^[PCBU]\d{4}$/i.test(c.code)).slice(0, 50);
  for (const c of standardObdCodes) {
    for (const vm of vehicleModels.slice(0, 20)) {
      urls.push(urlEntry(`${baseUrl}/obd/${c.code.toLowerCase()}/${vm.makeSlug}/${vm.modelSlug}`, now, "monthly", 0.6));
    }
  }

  // OBD code detail pages
  for (const c of topObdCodes) {
    const code = c.code;
    // Skip codes with non-alphanumeric garbage (comma, tab, newline, etc.)
    if (!/^[A-Z0-9]+$/i.test(code)) continue;
    urls.push(urlEntry(`${baseUrl}/obd/${code.toLowerCase()}`, now, "monthly", 0.7));
  }

  // Warning light detail pages
  for (const l of warningLights) {
    urls.push(urlEntry(`${baseUrl}/warning-lights/${l.slug}`, now, "monthly", 0.7));
  }

  // Post pages
  for (const p of posts) {
    const slug = p.slug || p.id;
    const lastmod = p.updated_at ? new Date(p.updated_at).toISOString() : now;
    const priority = p.content_type === "guide" || p.content_type === "review" ? 0.9 : 0.6;
    urls.push(urlEntry(`${baseUrl}/post/${slug}`, lastmod, "weekly", priority));
  }

  // Symptom detail pages
  try {
    const supabase = await createServiceSupabase();
    const { data: symptoms } = await supabase.from("symptoms").select("slug").order("slug");
    if (symptoms) {
      for (const s of (symptoms as any[])) {
        urls.push(urlEntry(`${baseUrl}/symptoms/${s.slug}`, now, "monthly", 0.75));
      }
    }
  } catch { /* skip */ }

  // Symptoms browse page
  urls.push(urlEntry(`${baseUrl}/symptoms`, now, "weekly", 0.8));

  // Vehicle-specific symptom pages — paginate
  try {
    const supabase = await createServiceSupabase();
    const BATCH = 1000;
    let offset = 0;
    while (true) {
      const { data } = await supabase.from("vehicle_symptoms")
        .select("slug")
        .order("slug")
        .range(offset, offset + BATCH - 1);
      if (!data || data.length === 0) break;
      for (const vs of (data as any[])) {
        urls.push(urlEntry(`${baseUrl}/symptoms/${vs.slug}`, now, "monthly", 0.7));
      }
      if (data.length < BATCH) break;
      offset += BATCH;
    }
  } catch { /* skip */ }

  // AI Diagnosis pages — paginate to bypass Supabase 1,000-row limit
  try {
    const supabase = await createServiceSupabase();
    const BATCH = 1000;
    let offset = 0;
    while (true) {
      const { data } = await supabase.from("diagnoses")
        .select("slug, created_at")
        .order("created_at", { ascending: false })
        .range(offset, offset + BATCH - 1);
      if (!data || data.length === 0) break;
      for (const d of data) {
        urls.push(urlEntry(`${baseUrl}/symptom-checker/${d.slug}`, d.created_at ?? now, "monthly", 0.6));
      }
      if (data.length < BATCH) break;
      offset += BATCH;
    }
  } catch { /* diagnoses fetch failed, skip */ }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "CDN-Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      "Vercel-CDN-Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
