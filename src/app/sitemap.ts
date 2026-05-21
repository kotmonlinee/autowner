import type { MetadataRoute } from "next";
import { getPosts, getCategories, getAllRepairSlugs, getTopObdCodes } from "@/lib/data/server";
import { warningLights } from "@/lib/warning-lights-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.autowner.com";

  const [{ posts }, categories, repairSlugs, topObdCodes] = await Promise.all([
    getPosts({ limit: 1000 }),
    getCategories(),
    getAllRepairSlugs(),
    getTopObdCodes(1000),
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

  // Post URLs
  const postUrls: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/post/${post.slug || post.id}`,
    lastModified: new Date(post.updated_at || post.created_at),
    changeFrequency: "weekly" as const,
    priority: post.content_type === "guide" || post.content_type === "review" ? 0.9 : 0.6,
  }));

  // Category pages
  const categoryUrls: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/?category=${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  // Repair cost detail pages
  const repairCostUrls: MetadataRoute.Sitemap = repairSlugs.map((slug) => ({
    url: `${baseUrl}/repair-cost/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // OBD code detail pages (top 1000 most searched)
  const obdCodeUrls: MetadataRoute.Sitemap = topObdCodes.map((code) => ({
    url: `${baseUrl}/obd/${code.code.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Warning light detail pages
  const warningLightUrls: MetadataRoute.Sitemap = warningLights.map((light) => ({
    url: `${baseUrl}/warning-lights/${light.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...toolLandingPages,
    ...categoryUrls,
    ...repairCostUrls,
    ...obdCodeUrls,
    ...warningLightUrls,
    ...postUrls,
  ];
}
