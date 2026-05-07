// TODO: Rate limiting — add IP-based rate limiting in production (e.g. using Upstash Redis
// or Vercel KV). Each IP should be limited to ~5 comments per minute to prevent spam.
import { insertComment, getCurrentUser } from "@/lib/data/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Login required" }, { status: 401 });

    let body: { postId?: string; body?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { postId, body: commentBody } = body;
    if (!postId || typeof postId !== "string") {
      return NextResponse.json({ error: "postId is required" }, { status: 400 });
    }
    if (!commentBody || typeof commentBody !== "string" || commentBody.trim().length === 0) {
      return NextResponse.json({ error: "Comment body is required" }, { status: 400 });
    }

    const comment = await insertComment(postId, user.id, commentBody.trim());

    // Create notification for post author (unless they're the commenter)
    let notificationError: string | null = null;
    try {
      const supabase = await createServerSupabase();

      // Fetch the post to get author_id and title
      const { data: post } = await supabase
        .from("posts")
        .select("author_id, title")
        .eq("id", postId)
        .single();

      if (post && post.author_id && post.author_id !== user.id) {
        const commenterName = comment.profiles?.username ?? "Someone";
        await supabase.from("notifications").insert({
          user_id: post.author_id,
          type: "post_comment",
          message: `${commenterName} commented on your post ${post.title}`,
          link: `/post/${postId}`,
        });
      }
    } catch (e: unknown) {
      // Notification failure is non-fatal — log it but return the comment anyway
      notificationError = e instanceof Error ? e.message : "Notification creation failed";
      console.error("Failed to create notification:", notificationError);
    }

    return NextResponse.json({ comment });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
