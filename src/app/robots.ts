import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/auth/", "/_vercel/insights/"],
    },
    sitemap: "https://www.autowner.com/sitemap.xml",
  };
}
