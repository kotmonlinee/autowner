import type { MetadataRoute } from "next";
import { getPosts, getCategories, getAllRepairSlugs, getTopObdCodes } from "@/lib/data/server";
import { warningLights } from "@/lib/warning-lights-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.autowner.com";

  const [{ posts }, categories, repairSlugs, topObdCodes] = await Promise.all([
    getPosts({ limit: 10000 }),
    getCategories(),
    getAllRepairSlugs(),
    getTopObdCodes(50000), // all 12K+ OBD codes
  ]);

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "hourly", priority: 1.0 },
    { url: `${baseUrl}/community`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.1 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.1 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.4 },
  ];

  // Tool landing pages
  const toolLandingPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/repair-cost`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/obd`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/quote-checker`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/warning-lights`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
  ];

  return [
    ...staticPages,
    ...toolLandingPages,
    ...categories.map(cat => ({ url: `${baseUrl}/?category=${cat.slug}`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.7 })),
    ...repairSlugs.map(slug => ({ url: `${baseUrl}/repair-cost/${slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 })),
    ...topObdCodes.map(c => ({ url: `${baseUrl}/obd/${c.code.toLowerCase()}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 })),
    ...warningLights.map(l => ({ url: `${baseUrl}/warning-lights/${l.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 })),
    ...posts.map(p => ({ url: `${baseUrl}/post/${p.slug || p.id}`, lastModified: p.updated_at ? new Date(p.updated_at) : new Date(), changeFrequency: "weekly" as const, priority: p.content_type === "guide" || p.content_type === "review" ? 0.9 : 0.6 })),
  ];
}
