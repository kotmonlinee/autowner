export const revalidate = 3600;

function sitemapEntry(loc: string): string {
  return `  <sitemap>\n    <loc>${loc}</loc>\n  </sitemap>`;
}

export async function GET() {
  const baseUrl = "https://www.autowner.com";

  const entries = [
    sitemapEntry(`${baseUrl}/sitemap/0`),
    sitemapEntry(`${baseUrl}/sitemap/1`),
    sitemapEntry(`${baseUrl}/sitemap/2`),
    sitemapEntry(`${baseUrl}/sitemap/3`),
    sitemapEntry(`${baseUrl}/sitemap/4`),
    sitemapEntry(`${baseUrl}/sitemap/5`),
    sitemapEntry(`${baseUrl}/sitemap/6`),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</sitemapindex>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "CDN-Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      "Vercel-CDN-Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
