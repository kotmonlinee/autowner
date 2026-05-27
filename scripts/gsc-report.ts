// Pull Google Search Console data for SEO analysis
// Run: npx tsx scripts/gsc-report.ts
import { google } from "googleapis";
import { readFileSync } from "fs";

const SITE_URL = "sc-domain:www.autowner.com";

async function main() {
  const key = JSON.parse(readFileSync(".claude/gsc-key.json", "utf8"));
  const auth = new google.auth.GoogleAuth({
    credentials: key,
    scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
  });

  const webmasters = google.webmasters({ version: "v3", auth });

  // Get top 50 pages by impressions in last 28 days
  const res = await webmasters.searchanalytics.query({
    siteUrl: SITE_URL,
    requestBody: {
      startDate: new Date(Date.now() - 28 * 86400000).toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
      dimensions: ["page"],
      rowLimit: 50,
      orderBy: [{ field: "impressions", sortOrder: "DESCENDING" }],
    },
  });

  const rows = res.data.rows ?? [];
  console.log(`Top ${rows.length} pages by impressions:\n`);

  for (const row of rows) {
    const page = row.keys?.[0] || "";
    const impressions = row.impressions ?? 0;
    const clicks = row.clicks ?? 0;
    const ctr = impressions > 0 ? (clicks / impressions * 100).toFixed(1) : "0.0";
    const position = row.position?.toFixed(1) ?? "?";

    console.log(`${ctr}% CTR | ${impressions} imp | pos ${position} | ${page.replace("https://www.autowner.com", "")}`);
  }
}

main().catch(console.error);
