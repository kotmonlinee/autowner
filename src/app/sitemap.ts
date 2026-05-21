import type { MetadataRoute } from "next";
import { getPosts, getCategories, getAllRepairSlugs } from "@/lib/data/server";
import { warningLights } from "@/lib/warning-lights-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.autowner.com";

  const [{ posts }, categories, repairSlugs] = await Promise.all([
    getPosts({ limit: 1000 }),
    getCategories(),
    getAllRepairSlugs(),
  ]);

  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/post/${post.slug || post.id}`,
    lastModified: new Date(post.updated_at || post.created_at),
    changeFrequency: "weekly" as const,
    priority: post.content_type === "guide" || post.content_type === "review" ? 0.9 : 0.6,
  }));

  const categoryUrls = categories.map((cat) => ({
    url: `${baseUrl}/?category=${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  // Tool landing pages
  const toolLandingPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/repair-cost`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/obd`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/quote-checker`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/warning-lights`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  // Repair cost detail pages
  const repairCostUrls: MetadataRoute.Sitemap = repairSlugs.map((slug) => ({
    url: `${baseUrl}/repair-cost/${slug}`,
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
    { url: baseUrl, lastModified: new Date(), changeFrequency: "hourly", priority: 1.0 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.4 },
    ...toolLandingPages,
    ...categoryUrls,
    ...repairCostUrls,
    ...warningLightUrls,
    ...postUrls,
  ];
}
