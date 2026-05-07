import { createServiceSupabase } from "@/lib/supabase-server";
import { rateLimit } from "@/lib/rate-limit";
import { NextResponse } from "next/server";

/**
 * Extract a basic IP identifier from the request headers.
 * Uses x-forwarded-for (common on Vercel) or falls back to "unknown".
 */
function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return "unknown";
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);

    // Rate limit: 60 views per minute per IP (generous — viewing is fine)
    const result = await rateLimit(ip, "views:increment", 60, 60);
    if (!result.success) {
      return NextResponse.json(
        { error: "Too many requests" },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.max(0, result.reset - Math.ceil(Date.now() / 1000))),
          },
        },
      );
    }

    let body: { postId?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { postId } = body;
    if (!postId || typeof postId !== "string") {
      return NextResponse.json({ error: "postId is required" }, { status: 400 });
    }

    const supabase = await createServiceSupabase();

    // Fetch current value and increment
    const { data: post } = await supabase
      .from("posts")
      .select("view_count")
      .eq("id", postId)
      .single();

    const newCount = (post?.view_count ?? 0) + 1;

    await supabase
      .from("posts")
      .update({ view_count: newCount })
      .eq("id", postId);

    return NextResponse.json({ view_count: newCount });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
