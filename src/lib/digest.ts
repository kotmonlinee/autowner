// Weekly digest email generator.
// Called by a cron job or admin trigger. For each user with a primary vehicle,
// finds new posts from the last 7 days related to their vehicle's engine and
// sends an HTML email digest.
import { createServiceSupabase } from "@/lib/supabase-server";
import { sendNotificationEmail } from "@/lib/email";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.autowner.com";

interface DigestPost {
  id: string;
  slug?: string | null;
  title: string;
  vote_score: number;
  comment_count: number;
  view_count: number;
  engine_label?: string;
}

/**
 * Generate and send a weekly digest for a single user.
 * Returns true if the digest was sent, false if skipped (no primary vehicle
 * or no posts to report).
 */
export async function generateWeeklyDigest(userId: string): Promise<boolean> {
  const supabase = await createServiceSupabase();

  // 1. Get the user's primary vehicle (with engine details)
  const { data: primaryVehicleRaw } = await supabase
    .from("user_vehicles")
    .select(
      "engine_id, vehicle_engines(code, name, vehicle_generations(name, year_start, year_end, vehicle_models(name, slug, vehicle_makes(name, slug))))",
    )
    .eq("user_id", userId)
    .eq("is_primary", true)
    .maybeSingle();

  const primaryVehicle = primaryVehicleRaw as Record<string, unknown> | null;

  if (!primaryVehicle?.engine_id) {
    // No primary vehicle — skip
    return false;
  }

  const engineId = primaryVehicle.engine_id as string;
  const eng = primaryVehicle.vehicle_engines as Record<string, unknown> | null;
  const gen = eng?.vehicle_generations as Record<string, unknown> | null;
  const model = gen?.vehicle_models as Record<string, unknown> | null;
  const make = model?.vehicle_makes as Record<string, unknown> | null;

  const vehicleLabel = [
    make?.name,
    model?.name,
    gen?.name ? `(${gen.name})` : null,
    eng?.code,
  ]
    .filter(Boolean)
    .join(" ");

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  // 2. Find new posts linked to the user's engine (via post_vehicles)
  const { data: engineLinksRaw } = await supabase
    .from("post_vehicles")
    .select("post_id")
    .eq("engine_id", engineId);

  const engineLinks = (engineLinksRaw as { post_id: string }[] | null) ?? [];

  let enginePosts: DigestPost[] = [];
  if (engineLinks.length) {
    const postIds = engineLinks.map((l) => l.post_id);
    const { data: posts } = await supabase
      .from("posts")
      .select("id, title, vote_score, comment_count, view_count")
      .in("id", postIds)
      .eq("status", "approved")
      .gte("created_at", sevenDaysAgo)
      .order("vote_score", { ascending: false })
      .limit(10);

    enginePosts = ((posts as unknown as DigestPost[]) ?? []).map((p) => ({
      ...p,
      engine_label: vehicleLabel,
    }));
  }

  // 3. Find additional posts in categories that overlap with engine-linked content.
  // We look at the most common category among posts linked to this engine, then
  // fetch recent high-scoring posts from that category.
  let categoryPosts: DigestPost[] = [];
  if (engineLinks.length) {
    // Find categories used by engine-linked posts
    const { data: enginePostCategoriesRaw } = await supabase
      .from("posts")
      .select("category_id, categories(name, slug)")
      .in(
        "id",
        engineLinks.map((l) => l.post_id),
      )
      .eq("status", "approved")
      .not("category_id", "is", null);

    const enginePostCategories = (enginePostCategoriesRaw as { category_id: string; categories: { name: string; slug: string } | null }[] | null) ?? [];

    if (enginePostCategories.length) {
      // Pick the most common category
      const categoryCounts = new Map<string, { name: string; slug: string }>();
      for (const row of enginePostCategories) {
        if (row.categories) {
          categoryCounts.set(row.category_id, row.categories);
        }
      }

      const mostCommonId = [...categoryCounts.keys()][0];
      if (mostCommonId) {
        // Fetch recent posts in this category, excluding those already found
        const existingIds = new Set(enginePosts.map((p) => p.id));
        const { data: catPosts } = await supabase
          .from("posts")
          .select("id, slug, title, vote_score, comment_count, view_count")
          .eq("category_id", mostCommonId)
          .eq("status", "approved")
          .gte("created_at", sevenDaysAgo)
          .order("vote_score", { ascending: false })
          .limit(10);

        categoryPosts = ((catPosts as unknown as DigestPost[]) ?? []).filter(
          (p) => !existingIds.has(p.id),
        );
      }
    }
  }

  // 4. If still no posts, fetch trending posts as fallback
  let trendingPosts: DigestPost[] = [];
  if (enginePosts.length === 0 && categoryPosts.length === 0) {
    const { data: trending } = await supabase
      .from("posts")
      .select("id, slug, title, vote_score, comment_count, view_count")
      .eq("status", "approved")
      .gte("created_at", sevenDaysAgo)
      .order("vote_score", { ascending: false })
      .limit(5);

    trendingPosts = (trending as unknown as DigestPost[]) ?? [];
  }

  const allPosts = [...enginePosts, ...categoryPosts, ...trendingPosts].slice(0, 10);

  if (allPosts.length === 0) {
    // Nothing to report this week
    return false;
  }

  // 5. Format the HTML email
  const postListHtml = allPosts
    .map(
      (p) => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #2a2d35;">
        <a href="${SITE_URL}/post/${p.slug || p.id}" style="color: #f0f1f3; text-decoration: none; font-weight: 600; font-size: 14px; display: block; margin-bottom: 4px;">
          ${escapeHtml(p.title)}
        </a>
        <span style="font-size: 12px; color: #6b7280;">
          ${p.vote_score ?? 0} votes &middot; ${p.comment_count ?? 0} comments &middot; ${p.view_count ?? 0} views
          ${p.engine_label ? `&middot; ${escapeHtml(p.engine_label)}` : ""}
        </span>
      </td>
    </tr>`,
    )
    .join("\n");

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Weekly AutOwner Digest</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0b0f; color: #f0f1f3; padding: 0; margin: 0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; padding: 24px;">
    <tr>
      <td style="padding: 32px 0 24px; text-align: center;">
        <span style="font-family: 'Trebuchet MS', sans-serif; font-size: 24px; font-weight: bold; color: #f0f1f3; letter-spacing: 0.02em;">
          AUTO<span style="color: #ed1c24;">WNER</span>
        </span>
      </td>
    </tr>
    <tr>
      <td style="background-color: #111318; border: 1px solid #2a2d35; border-radius: 12px; padding: 24px;">
        <h2 style="font-size: 18px; font-weight: 700; color: #f0f1f3; margin: 0 0 8px; font-family: 'Trebuchet MS', sans-serif;">
          Your Weekly Digest
        </h2>
        <p style="font-size: 13px; color: #6b7280; margin: 0 0 20px;">
          ${dateStr}${vehicleLabel ? ` &middot; Based on your ${escapeHtml(vehicleLabel)}` : ""}
        </p>

        ${allPosts.length > 0 ? `
        <p style="font-size: 14px; color: #9ca3af; margin: 0 0 16px;">
          Here are the top posts for your vehicle this week:
        </p>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${postListHtml}
        </table>
        ` : `
        <p style="font-size: 14px; color: #9ca3af; margin: 0 0 16px;">
          No new posts for your vehicle this week. Check back next week!
        </p>
        `}

        <a href="${SITE_URL}" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #ed1c24; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">
          Browse All Posts
        </a>
      </td>
    </tr>
    <tr>
      <td style="padding: 16px 0; text-align: center; font-size: 12px; color: #6b7280;">
        You received this email because you have an account on <a href="${SITE_URL}" style="color: #9ca3af;">AutOwner</a> with a primary vehicle set.
      </td>
    </tr>
  </table>
</body>
</html>`.trim();

  await sendNotificationEmail(userId, "Your Weekly AutOwner Digest", htmlBody);
  return true;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
