import { getTopObdCodes, getVehicleRepairSlugs } from "@/lib/data/server";
import { urlEntry, xmlResponse, BASE_URL } from "@/lib/sitemap-utils";

export const revalidate = 3600;

const PAGE_SIZE = 3000;

export async function GET(_req: Request, { params }: { params: Promise<{ page: string }> }) {
  const now = new Date().toISOString();
  const page = parseInt((await params).page, 10);
  const start = page * PAGE_SIZE;
  const [topObdCodes, vehicleModels] = await Promise.all([
    getTopObdCodes(start + PAGE_SIZE),
    getVehicleRepairSlugs(100),
  ]);
  const obdSlice = topObdCodes.slice(start);
  const urls: string[] = [];

  for (const c of obdSlice) {
    const code = c.code;
    if (!/^[A-Z0-9]+$/i.test(code)) continue;
    urls.push(urlEntry(`${BASE_URL}/obd/${code.toLowerCase()}`, now, "monthly", 0.7));
  }

  // Cross-reference only on first page
  if (page === 0) {
    const standardObdCodes = topObdCodes.filter((c) => /^[PCBU]\d{4}$/i.test(c.code)).slice(0, 50);
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
