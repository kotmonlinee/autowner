import { BASE_URL, xmlResponse } from "@/lib/sitemap-utils";

export const revalidate = 3600;

function sitemapEntry(loc: string): string {
  return `  <sitemap>\n    <loc>${loc}</loc>\n  </sitemap>`;
}

export function GET() {
  const entries: string[] = [
    sitemapEntry(`${BASE_URL}/sitemap/pages`),
    sitemapEntry(`${BASE_URL}/sitemap/posts`),
    sitemapEntry(`${BASE_URL}/sitemap/diagnoses`),
  ];

  // OBD codes: 5 pages of 3,000 each
  for (let i = 0; i < 5; i++) {
    entries.push(sitemapEntry(`${BASE_URL}/sitemap/obd-codes/${i}`));
  }

  // Repairs: 3 pages of 35 models each
  for (let i = 0; i < 3; i++) {
    entries.push(sitemapEntry(`${BASE_URL}/sitemap/repairs/${i}`));
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</sitemapindex>`;

  return xmlResponse(xml);
}
