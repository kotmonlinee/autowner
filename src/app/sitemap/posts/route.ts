import { getPosts } from "@/lib/data/server";
import { urlEntry, wrapUrlset, xmlResponse, BASE_URL } from "@/lib/sitemap-utils";

export const revalidate = 3600;

export async function GET() {
  const now = new Date().toISOString();
  const { posts } = await getPosts({ sort: "new", limit: 10000 });
  const urls: string[] = [];

  for (const p of posts) {
    const slug = p.slug || p.id;
    const lastmod = p.updated_at ? new Date(p.updated_at).toISOString() : now;
    const priority = p.content_type === "guide" || p.content_type === "review" ? 0.9 : 0.6;
    urls.push(urlEntry(`${BASE_URL}/post/${slug}`, lastmod, "weekly", priority));
  }

  return xmlResponse(wrapUrlset(urls));
}
