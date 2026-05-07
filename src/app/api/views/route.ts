// TODO: Rate limiting — add IP-based rate limiting in production (e.g. using Upstash Redis
// or Vercel KV). Each IP should be limited to ~1 view per second per post to prevent
// artificial view count inflation.
import { createServiceSupabase } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
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
