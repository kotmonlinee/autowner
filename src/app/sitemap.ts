import type { MetadataRoute } from "next";
import { getPosts, getCategories } from "@/lib/data/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.autowner.com";

  const [{ posts }, categories] = await Promise.all([
    getPosts({ limit: 1000 }),
    getCategories(),
  ]);

  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/post/${post.id}`,
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

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "hourly", priority: 1.0 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.4 },
    ...categoryUrls,
    ...postUrls,
  ];
}
