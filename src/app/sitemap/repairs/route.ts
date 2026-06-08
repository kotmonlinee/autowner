import { getAllRepairSlugs, getVehicleRepairSlugs } from "@/lib/data/server";
import { urlEntry, wrapUrlset, xmlResponse, BASE_URL } from "@/lib/sitemap-utils";

export const revalidate = 3600;

export async function GET() {
  const now = new Date().toISOString();
  const [repairSlugs, vehicleModels] = await Promise.all([
    getAllRepairSlugs(),
    getVehicleRepairSlugs(100),
  ]);
  const urls: string[] = [];

  // Generic repair cost pages
  for (const slug of repairSlugs) {
    urls.push(urlEntry(`${BASE_URL}/repair-cost/${slug}`, now, "monthly", 0.7));
  }

  // Vehicle-specific repair cost pages (model × repair cross-reference)
  for (const vm of vehicleModels) {
    for (const slug of repairSlugs) {
      urls.push(urlEntry(`${BASE_URL}/repair-cost/${vm.makeSlug}/${vm.modelSlug}/${slug}`, now, "monthly", 0.65));
    }
  }

  // Vehicle Hub pages
  for (const vm of vehicleModels) {
    urls.push(urlEntry(`${BASE_URL}/vehicles/${vm.makeSlug}/${vm.modelSlug}`, now, "monthly", 0.7));
  }

  return xmlResponse(wrapUrlset(urls));
}
