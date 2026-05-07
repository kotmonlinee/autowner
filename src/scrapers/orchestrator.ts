import { createServiceSupabase } from "@/lib/supabase-server";
import { sources } from "./sources";

const PUSHSHIFT_URL = "https://api.pullpush.io/reddit/search/submission/";
const MIN_TITLE_LENGTH = 10;
const MIN_BODY_LENGTH = 50;

// ── Helpers ──────────────────────────────────────────────

function cleanHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#x2F;/g, "/")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// Extract the best image from a Reddit post
function extractImages(post: any): string[] {
  const images: string[] = [];

  // Direct image post (i.redd.it, imgur, etc.)
  if (post.post_hint === "image" && post.url) {
    images.push(post.url);
  }

  // Preview images (embedded in self posts)
  if (post.preview?.images) {
    for (const img of post.preview.images) {
      if (img.source?.url) {
        const cleanUrl = img.source.url.replace(/&amp;/g, "&");
        if (!images.includes(cleanUrl)) {
          images.push(cleanUrl);
        }
      }
    }
  }

  // Gallery posts
  if (post.is_gallery && post.media_metadata) {
    for (const [id, meta] of Object.entries(post.media_metadata) as [string, any][]) {
      if (meta.s?.u) {
        const galleryUrl = meta.s.u.replace(/&amp;/g, "&");
        if (!images.includes(galleryUrl)) {
          images.push(galleryUrl);
        }
      }
    }
  }

  // If URL ends with image extension but wasn't caught above
  if (!images.length && post.url && /\.(jpg|jpeg|png|gif|webp)(\?|$)/i.test(post.url)) {
    images.push(post.url);
  }

  return images;
}

function shouldSkip(title: string, body: string, images: string[]): boolean {
  if (!title || title.length < MIN_TITLE_LENGTH) return true;
  if (title === "[removed]" || title === "[deleted]") return true;
  // Allow image-only posts (no body needed if there are images)
  if (body === "[removed]" || body === "[deleted]") return true;
  if (!body || body.length < MIN_BODY_LENGTH) {
    if (!images.length) return true; // skip if no body AND no images
  }
  return false;
}

// Build a rich markdown body with images and formatting
function buildPostBody(post: any, rawBody: string, images: string[]): string {
  const parts: string[] = [];

  // Featured image at top — use the best resolution one
  if (images.length > 0) {
    const bestImage = images[0];
    const altText = post.title?.replace(/"/g, "'") ?? "Post image";
    parts.push(`![${altText}](${bestImage})`);
  }

  // Main body text
  if (rawBody) {
    // Clean up markdown: ensure proper spacing around headers, lists, etc.
    const body = rawBody
      .replace(/^(#{1,3})\s*([^#])/gm, "$1 $2")       // normalize header spacing
      .replace(/^(\d+)\.\s*/gm, "$1. ")                 // normalize numbered lists
      .replace(/^\*\s*/gm, "* ")                         // normalize bullet lists
      .replace(/\n{3,}/g, "\n\n")                       // collapse excessive newlines
      .trim();
    parts.push(body);
  } else if (!images.length) {
    // Link post with no selftext — include the link as a quote
    parts.push(`> [View original post on Reddit](${post.url})`);
  }

  // Gallery: add remaining images inline
  if (images.length > 1) {
    parts.push("\n**Gallery:**\n");
    for (const img of images.slice(1)) {
      parts.push(`![](${img})`);
    }
  }

  // Source attribution
  const sourceUrl = `https://reddit.com${post.permalink ?? ""}`;
  parts.push(`\n\n---\n*Originally posted on r/${post.subreddit} — [View discussion](${sourceUrl})*`);

  return parts.join("\n\n");
}

async function fetchPushshift(subreddit: string, size: number): Promise<any[]> {
  const url = `${PUSHSHIFT_URL}?subreddit=${subreddit}&size=${size}&sort=desc`;
  const res = await fetch(url, {
    headers: { "User-Agent": "AutOwner/1.0 content aggregator" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return json?.data ?? [];
}

async function scrapeSource(source: typeof sources[0]): Promise<{ inserted: number; skipped: number }> {
  const supabase = await createServiceSupabase();

  const { data: category } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", source.categorySlug)
    .single();

  if (!category) throw new Error(`Category ${source.categorySlug} not found`);

  const submissions = await fetchPushshift(source.subreddit, source.size);
  let inserted = 0;
  let skipped = 0;

  for (const post of submissions) {
    const title = post.title?.trim() ?? "";
    const rawBody = cleanHtml(post.selftext ?? "");
    const images = extractImages(post);
    const sourceUrl = `https://reddit.com${post.permalink ?? ""}`;

    // Dedup by URL
    const { data: exists } = await supabase
      .from("posts")
      .select("id")
      .eq("source_url", sourceUrl)
      .maybeSingle();
    if (exists) { skipped++; continue; }

    // Dedup by title
    const { data: similar } = await supabase
      .from("posts")
      .select("id")
      .eq("title", title)
      .eq("source", "scraped")
      .maybeSingle();
    if (similar) { skipped++; continue; }

    if (shouldSkip(title, rawBody, images)) { skipped++; continue; }

    const body = buildPostBody(post, rawBody, images);

    const { error } = await supabase.from("posts").insert({
      title,
      body,
      category_id: category.id,
      source: "scraped",
      source_url: sourceUrl,
      status: "approved",
    });

    if (!error) inserted++;
  }

  return { inserted, skipped };
}

export async function runScrape(): Promise<{ total: number; details: string[] }> {
  const details: string[] = [];
  let total = 0;

  for (const source of sources) {
    try {
      const { inserted, skipped } = await scrapeSource(source);
      details.push(`r/${source.subreddit}: +${inserted} new, ${skipped} skipped — ${source.categorySlug}`);
      total += inserted;
    } catch (err) {
      details.push(`r/${source.subreddit}: error — ${err instanceof Error ? err.message : "unknown"}`);
    }
  }

  return { total, details };
}
