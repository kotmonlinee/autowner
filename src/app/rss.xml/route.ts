import { createServerSupabase } from "@/lib/supabase-server";
import type { PostWithRelations } from "@/lib/types";

const SITE_URL = "https://www.autowner.com";
const FEED_TITLE = "AutOwner";
const FEED_DESCRIPTION = "Car maintenance, repair guides, mods, detailing, and buying advice from the community.";

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function stripMarkdown(markdown: string, maxLength = 300): string {
  let text = markdown
    // Remove images
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
    // Remove links but keep text
    .replace(/\[([^\]]*)\]\([^)]+\)/g, "$1")
    // Remove headings
    .replace(/^#{1,6}\s+/gm, "")
    // Remove bold/italic
    .replace(/(\*{1,3}|_{1,3})(.*?)\1/g, "$2")
    // Remove inline code
    .replace(/`{1,3}[^`]*`{1,3}/g, "")
    // Remove horizontal rules
    .replace(/^[-*_]{3,}\s*$/gm, "")
    // Remove blockquotes
    .replace(/^>\s?/gm, "")
    // Remove list markers
    .replace(/^[\s]*[-*+]\s+/gm, "")
    .replace(/^[\s]*\d+\.\s+/gm, "")
    // Collapse multiple newlines
    .replace(/\n{3,}/g, "\n\n")
    // Remove remaining markdown artifacts
    .replace(/[*_~]/g, "")
    .trim();

  if (text.length > maxLength) {
    // Truncate at nearest word boundary
    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(" ");
    return truncated.substring(0, lastSpace > 0 ? lastSpace : maxLength) + "...";
  }

  return text;
}

function toRfc822Date(dateStr: string): string {
  const date = new Date(dateStr);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    `${days[date.getUTCDay()]}, ${pad(date.getUTCDate())} ${months[date.getUTCMonth()]} ` +
    `${date.getUTCFullYear()} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:` +
    `${pad(date.getUTCSeconds())} +0000`
  );
}

export async function GET() {
  const supabase = await createServerSupabase();

  const { data: posts } = await supabase
    .from("posts")
    .select("*, categories(name, slug)")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(50);

  const items = (posts as unknown as PostWithRelations[]) ?? [];

  const lastBuildDate = items.length > 0
    ? toRfc822Date(items[0].created_at)
    : toRfc822Date(new Date().toISOString());

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(FEED_TITLE)}</title>
    <description>${escapeXml(FEED_DESCRIPTION)}</description>
    <link>${escapeXml(SITE_URL)}</link>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${escapeXml(SITE_URL)}/rss.xml" rel="self" type="application/rss+xml"/>
${items
  .map((post) => {
    const link = `${SITE_URL}/post/${post.id}`;
    const description = escapeXml(stripMarkdown(post.body, 300));
    const pubDate = toRfc822Date(post.created_at);
    const category = post.categories?.name
      ? `    <category>${escapeXml(post.categories.name)}</category>`
      : "";
    const title = escapeXml(post.title);

    return `    <item>
      <title>${title}</title>
      <link>${escapeXml(link)}</link>
      <description>${description}</description>
      <pubDate>${pubDate}</pubDate>
${category}
      <guid isPermaLink="true">${escapeXml(link)}</guid>
    </item>`;
  })
  .join("\n")}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
