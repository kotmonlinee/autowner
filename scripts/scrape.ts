// Content scraper using Pushshift API (Reddit archive)
// Run: npx tsx scripts/scrape.ts
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const sources = [
  { subreddit: "MechanicAdvice", category: "repair", size: 15 },
  { subreddit: "Cartalk", category: "repair", size: 10 },
  { subreddit: "AutoDetailing", category: "detailing", size: 10 },
  { subreddit: "cars", category: "buying-advice", size: 15 },
  { subreddit: "whatcarshouldIbuy", category: "buying-advice", size: 10 },
  { subreddit: "carmodification", category: "mods-tuning", size: 10 },
  { subreddit: "projectcar", category: "mods-tuning", size: 10 },
  { subreddit: "DIYAutoRepair", category: "diy-guides", size: 10 },
  { subreddit: "Justrolledintotheshop", category: "repair", size: 10 },
  { subreddit: "CarHacking", category: "mods-tuning", size: 5 },
  { subreddit: "AskMechanics", category: "repair", size: 10 },
  { subreddit: "Trucks", category: "buying-advice", size: 10 },
  { subreddit: "overlanding", category: "mods-tuning", size: 8 },
  { subreddit: "Tires", category: "maintenance", size: 8 },
  { subreddit: "EngineBuilding", category: "mods-tuning", size: 8 },
  { subreddit: "autorepair", category: "repair", size: 10 },
  { subreddit: "Drifting", category: "mods-tuning", size: 8 },
  { subreddit: "4x4", category: "mods-tuning", size: 8 },
  { subreddit: "Diesel", category: "maintenance", size: 8 },
  { subreddit: "classiccars", category: "buying-advice", size: 8 },
  { subreddit: "EVConversion", category: "mods-tuning", size: 5 },
  { subreddit: "Stance", category: "mods-tuning", size: 5 },
];

const PUSHSHIFT_URL = "https://api.pullpush.io/reddit/search/submission/";
const MIN_TITLE = 10;
const MIN_BODY = 50;

// ── Helpers ──────────────────────────────────────────────

function cleanHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&#x2F;/g, "/")
    .replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ")
    .replace(/\n{3,}/g, "\n\n").trim();
}

function extractImages(post: any): string[] {
  const images: string[] = [];

  if (post.post_hint === "image" && post.url) images.push(post.url);

  if (post.preview?.images) {
    for (const img of post.preview.images) {
      if (img.source?.url) {
        const u = img.source.url.replace(/&amp;/g, "&");
        if (!images.includes(u)) images.push(u);
      }
    }
  }

  if (post.is_gallery && post.media_metadata) {
    for (const [, meta] of Object.entries(post.media_metadata) as [string, any][]) {
      if (meta.s?.u) {
        const u = meta.s.u.replace(/&amp;/g, "&");
        if (!images.includes(u)) images.push(u);
      }
    }
  }

  if (!images.length && post.url && /\.(jpg|jpeg|png|gif|webp)(\?|$)/i.test(post.url)) {
    images.push(post.url);
  }

  return images;
}

function buildBody(post: any, rawBody: string, images: string[]): string {
  const parts: string[] = [];

  if (images.length > 0) {
    parts.push(`![${(post.title ?? "image").replace(/"/g, "'")}](${images[0]})`);
  }

  if (rawBody) {
    const cleaned = rawBody
      .replace(/^(#{1,3})\s*([^#])/gm, "$1 $2")
      .replace(/^(\d+)\.\s*/gm, "$1. ")
      .replace(/^\*\s*/gm, "* ")
      .replace(/\n{3,}/g, "\n\n").trim();
    parts.push(cleaned);
  } else if (!images.length) {
    parts.push(`> [View original post on Reddit](${post.url})`);
  }

  if (images.length > 1) {
    parts.push("\n**Gallery:**\n");
    for (const img of images.slice(1)) parts.push(`![](${img})`);
  }

  const sourceUrl = `https://reddit.com${post.permalink ?? ""}`;
  parts.push(`\n\n---\n*Originally posted on r/${post.subreddit} — [View discussion](${sourceUrl})*`);

  return parts.join("\n\n");
}

function shouldSkip(title: string, body: string, images: string[]): boolean {
  if (!title || title.length < MIN_TITLE) return true;
  if (title === "[removed]" || title === "[deleted]") return true;
  if (body === "[removed]" || body === "[deleted]") return true;
  if ((!body || body.length < MIN_BODY) && !images.length) return true;
  return false;
}

// ── Main ─────────────────────────────────────────────────

async function main() {
  console.log("AutOwner Content Scraper\n");
  let inserted = 0, skipped = 0, errors = 0;

  for (const src of sources) {
    try {
      const { data: cat } = await supabase.from("categories").select("id").eq("slug", src.category).single();
      if (!cat) { console.log(`  r/${src.subreddit}: ✗ category "${src.category}" not found`); errors++; continue; }

      const url = `${PUSHSHIFT_URL}?subreddit=${src.subreddit}&size=${src.size}&sort=desc`;
      const res = await fetch(url, { headers: { "User-Agent": "AutOwner/1.0" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      let ins = 0, sk = 0;
      for (const post of (json?.data ?? [])) {
        const title = post.title?.trim() ?? "";
        const rawBody = cleanHtml(post.selftext ?? "");
        const images = extractImages(post);
        const sourceUrl = `https://reddit.com${post.permalink ?? ""}`;

        const { data: dup } = await supabase.from("posts").select("id").eq("source_url", sourceUrl).maybeSingle();
        if (dup) { sk++; continue; }

        const { data: sim } = await supabase.from("posts").select("id").eq("title", title).eq("source", "scraped").maybeSingle();
        if (sim) { sk++; continue; }

        if (shouldSkip(title, rawBody, images)) { sk++; continue; }

        const body = buildBody(post, rawBody, images);
        const { error } = await supabase.from("posts").insert({
          title, body, category_id: cat.id,
          source: "scraped", source_url: sourceUrl, status: "approved",
        });
        if (!error) ins++; else console.log(`    ✗ insert: ${error.message}`);
      }

      console.log(`  r/${src.subreddit}: +${ins} new, ${sk} skipped — ${src.category}`);
      inserted += ins; skipped += sk;
    } catch (err: any) {
      console.log(`  r/${src.subreddit}: ✗ ${err.message}`);
      errors++;
    }
  }

  console.log(`\nDone: ${inserted} inserted, ${skipped} skipped, ${errors} errors`);
}

main().catch(console.error);
