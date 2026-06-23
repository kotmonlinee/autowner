export const revalidate = 3600;

function sitemapEntry(loc: string, lastmod: string): string {
  return `  <sitemap>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </sitemap>`;
}

export async function GET() {
  const baseUrl = "https://www.autowner.com";
  const now = new Date().toISOString();

  const entries = [
    sitemapEntry(`${baseUrl}/sitemap/0`, now),
    sitemapEntry(`${baseUrl}/sitemap/1`, now),
    sitemapEntry(`${baseUrl}/sitemap/2`, now),
    sitemapEntry(`${baseUrl}/sitemap/3`, now),
    sitemapEntry(`${baseUrl}/sitemap/4`, now),
    sitemapEntry(`${baseUrl}/sitemap/5`, now),
    sitemapEntry(`${baseUrl}/sitemap/6`, now),
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
