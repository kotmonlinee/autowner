import { BASE_URL, xmlResponse } from "@/lib/sitemap-utils";

export const revalidate = 3600;

function sitemapEntry(loc: string): string {
  return `  <sitemap>\n    <loc>${loc}</loc>\n  </sitemap>`;
}

export function GET() {
  const children = [
    "/sitemap/pages",
    "/sitemap/posts",
    "/sitemap/obd-codes",
    "/sitemap/repairs",
    "/sitemap/diagnoses",
  ];

  const entries = children.map((path) => sitemapEntry(`${BASE_URL}${path}`));
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</sitemapindex>`;

  return xmlResponse(xml);
}
