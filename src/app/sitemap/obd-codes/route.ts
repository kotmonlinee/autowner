import { getTopObdCodes, getVehicleRepairSlugs } from "@/lib/data/server";
import { urlEntry, wrapUrlset, xmlResponse, BASE_URL } from "@/lib/sitemap-utils";

export const revalidate = 3600;

export async function GET() {
  const now = new Date().toISOString();
  const [topObdCodes, vehicleModels] = await Promise.all([
    getTopObdCodes(15000),
    getVehicleRepairSlugs(100),
  ]);
  const urls: string[] = [];

  // OBD code detail pages
  for (const c of topObdCodes) {
    const code = c.code;
    if (!/^[A-Z0-9]+$/i.test(code)) continue;
    urls.push(urlEntry(`${BASE_URL}/obd/${code.toLowerCase()}`, now, "monthly", 0.7));
  }

  // OBD code × Vehicle cross-reference (top 50 codes × top 20 models)
  const standardObdCodes = topObdCodes.filter((c) => /^[PCBU]\d{4}$/i.test(c.code)).slice(0, 50);
  for (const c of standardObdCodes) {
    for (const vm of vehicleModels.slice(0, 20)) {
      urls.push(urlEntry(`${BASE_URL}/obd/${c.code.toLowerCase()}/${vm.makeSlug}/${vm.modelSlug}`, now, "monthly", 0.6));
    }
  }

  return xmlResponse(wrapUrlset(urls));
}
