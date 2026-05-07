// TODO: Rate limiting — add IP-based rate limiting in production (e.g. using Upstash Redis
// or Vercel KV). Stats endpoint should be cached (e.g. 5-minute stale-while-revalidate) to
// reduce DB load; rate limiting provides a backstop against aggressive polling.
import { createServerSupabase } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export interface StatsResponse {
  totalPosts: number;
  totalUsers: number;
  totalComments: number;
  totalVotes: number;
  postsByCategory: { name: string; slug: string; count: number }[];
  postsByContentType: Record<string, number>;
  postsBySource: { user: number; scraped: number };
}

export async function GET() {
  try {
    const supabase = await createServerSupabase();

    // ── Total counts ────────────────────────────────────

    const [
      { count: totalPosts },
      { count: totalUsers },
      { count: totalComments },
      { count: totalVotes },
    ] = await Promise.all([
      supabase.from("posts").select("id", { count: "exact", head: true }),
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("comments").select("id", { count: "exact", head: true }),
      supabase.from("votes").select("id", { count: "exact", head: true }),
    ]);

    // ── Posts by source ────────────────────────────────

    const [{ count: userCount }, { count: scrapedCount }] = await Promise.all([
      supabase.from("posts").select("id", { count: "exact", head: true }).eq("source", "user"),
      supabase.from("posts").select("id", { count: "exact", head: true }).eq("source", "scraped"),
    ]);

    // ── Posts by category ──────────────────────────────

    const { data: categories } = await supabase
      .from("categories")
      .select("id, name, slug")
      .order("sort_order");

    const postsByCategory: { name: string; slug: string; count: number }[] = [];

    for (const cat of categories ?? []) {
      const { count } = await supabase
        .from("posts")
        .select("id", { count: "exact", head: true })
        .eq("category_id", cat.id);
      postsByCategory.push({
        name: cat.name,
        slug: cat.slug,
        count: count ?? 0,
      });
    }

    // ── Posts by content_type ──────────────────────────

    const { data: contentTypeData } = await supabase
      .from("posts")
      .select("content_type");

    const postsByContentType: Record<string, number> = {};
    for (const row of contentTypeData ?? []) {
      const type = row.content_type ?? "unclassified";
      postsByContentType[type] = (postsByContentType[type] ?? 0) + 1;
    }

    // ── Response ───────────────────────────────────────

    const stats: StatsResponse = {
      totalPosts: totalPosts ?? 0,
      totalUsers: totalUsers ?? 0,
      totalComments: totalComments ?? 0,
      totalVotes: totalVotes ?? 0,
      postsByCategory,
      postsByContentType,
      postsBySource: {
        user: userCount ?? 0,
        scraped: scrapedCount ?? 0,
      },
    };

    return NextResponse.json(stats);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch stats";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
