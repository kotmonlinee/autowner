import { getAllRepairSlugs, getVehicleRepairSlugs } from "@/lib/data/server";
import { urlEntry, xmlResponse, BASE_URL } from "@/lib/sitemap-utils";

export const revalidate = 3600;

const MODELS_PER_PAGE = 35;

export async function GET(_req: Request, { params }: { params: Promise<{ page: string }> }) {
  const now = new Date().toISOString();
  const page = parseInt((await params).page, 10);
  const start = page * MODELS_PER_PAGE;

  const [repairSlugs, allModels] = await Promise.all([
    getAllRepairSlugs(),
    getVehicleRepairSlugs(100),
  ]);
  const modelSlice = allModels.slice(start, start + MODELS_PER_PAGE);
  const urls: string[] = [];

  // Generic repair pages (only on first page)
  if (page === 0) {
    for (const slug of repairSlugs) {
      urls.push(urlEntry(`${BASE_URL}/repair-cost/${slug}`, now, "monthly", 0.7));
    }
  }

  // Vehicle-specific repair cost pages
  for (const vm of modelSlice) {
    for (const slug of repairSlugs) {
      urls.push(urlEntry(`${BASE_URL}/repair-cost/${vm.makeSlug}/${vm.modelSlug}/${slug}`, now, "monthly", 0.65));
    }
  }

  // Vehicle Hub pages
  for (const vm of modelSlice) {
    urls.push(urlEntry(`${BASE_URL}/vehicles/${vm.makeSlug}/${vm.modelSlug}`, now, "monthly", 0.7));
  }

  return xmlResponse(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`
  );
}
