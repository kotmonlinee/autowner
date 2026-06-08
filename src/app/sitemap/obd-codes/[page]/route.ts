import { createServiceSupabase } from "@/lib/supabase-server";
import { getVehicleRepairSlugs } from "@/lib/data/server";
import { urlEntry, xmlResponse, BASE_URL } from "@/lib/sitemap-utils";

export const revalidate = 3600;

const PAGE_SIZE = 3000;

export async function GET(_req: Request, { params }: { params: Promise<{ page: string }> }) {
  const now = new Date().toISOString();
  const page = parseInt((await params).page, 10);
  const supabase = await createServiceSupabase();

  // Fetch only this page's OBD codes
  const obdCodes: { code: string }[] = [];
  const BATCH = 1000;
  for (let offset = page * PAGE_SIZE; offset < (page + 1) * PAGE_SIZE; offset += BATCH) {
    const { data } = await supabase.from("obd_codes")
      .select("code")
      .order("code", { ascending: true })
      .range(offset, offset + BATCH - 1);
    if (!data || data.length === 0) break;
    obdCodes.push(...(data as unknown as { code: string }[]));
  }
  const urls: string[] = [];

  for (const c of obdCodes) {
    const code = c.code;
    if (!/^[A-Z0-9]+$/i.test(code)) continue;
    urls.push(urlEntry(`${BASE_URL}/obd/${code.toLowerCase()}`, now, "monthly", 0.7));
  }

  // OBD × Vehicle cross-reference on first page only
  if (page === 0) {
    const vehicleModels = await getVehicleRepairSlugs(100);
    // Fetch top 50 standard codes for cross-reference
    const standardCodes: { code: string }[] = [];
    for (let offset = 0; offset < 50; offset += BATCH) {
      const { data } = await supabase.from("obd_codes")
        .select("code")
        .order("code", { ascending: true })
        .range(offset, offset + Math.min(BATCH, 50 - offset) - 1);
      if (!data || data.length === 0) break;
      standardCodes.push(...(data as unknown as { code: string }[]));
    }
    const standardObdCodes = standardCodes.filter((c) => /^[PCBU]\d{4}$/i.test(c.code));
    for (const c of standardObdCodes) {
      for (const vm of vehicleModels.slice(0, 20)) {
        urls.push(urlEntry(`${BASE_URL}/obd/${c.code.toLowerCase()}/${vm.makeSlug}/${vm.modelSlug}`, now, "monthly", 0.6));
      }
    }
  }

  return xmlResponse(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`
  );
}
