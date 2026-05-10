import { insertComment, getCurrentUser } from "@/lib/data/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { checkContent } from "@/lib/moderation";
import { withRateLimit } from "@/lib/rate-limit";
import { sendNotificationEmailSimple } from "@/lib/email";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Login required" }, { status: 401 });

    // Rate limit: 5 comments per minute per user
    const limited = await withRateLimit(user.id, "comments:create", 5, 60);
    if (limited) return limited;

    let body: { postId?: string; body?: string; parentId?: string | null };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { postId, body: commentBody, parentId } = body;
    if (!postId || typeof postId !== "string") {
      return NextResponse.json({ error: "postId is required" }, { status: 400 });
    }
    if (!commentBody || typeof commentBody !== "string" || commentBody.trim().length === 0) {
      return NextResponse.json({ error: "Comment body is required" }, { status: 400 });
    }

    // Content moderation
    const modResult = checkContent(commentBody);
    if (modResult.flagged) {
      return NextResponse.json({ error: modResult.reason ?? "Content flagged by moderation" }, { status: 400 });
    }

    const comment = await insertComment(postId, user.id, commentBody.trim(), parentId ?? null);

    // Create notifications
    let notificationError: string | null = null;
    try {
      const supabase = await createServerSupabase();
      const commenterName = comment.profiles?.username ?? "Someone";

      // Fetch the post to get author_id and title
      const { data: post } = await supabase
        .from("posts")
        .select("author_id, title")
        .eq("id", postId)
        .single();

      // 1. Notify post author (unless they're the commenter)
      if (post && post.author_id && post.author_id !== user.id) {
        await supabase.from("notifications").insert({
          user_id: post.author_id,
          type: "post_comment",
          message: `${commenterName} commented on your post ${post.title}`,
          link: `/post/${postId}`,
        });

        // Send email notification (logs in dev mode; configure EMAIL_PROVIDER for production)
        sendNotificationEmailSimple(
          post.author_id,
          `${commenterName} commented on your post`,
          `${commenterName} commented on your post "${post.title}" on AutOwner.`,
          `/post/${postId}`,
        ).catch((e) => {
          console.error("Failed to send notification email:", e instanceof Error ? e.message : e);
        });
      }

      // 2. If this is a reply, notify the parent comment's author
      if (parentId) {
        const { data: parentComment } = await supabase
          .from("comments")
          .select("author_id, body")
          .eq("id", parentId)
          .single();

        if (parentComment && parentComment.author_id && parentComment.author_id !== user.id) {
          // Don't double-notify if parent author is also the post author (already got post_comment)
          const parentIsPostAuthor = post && post.author_id === parentComment.author_id;
          if (!parentIsPostAuthor) {
            const preview = parentComment.body
              ? parentComment.body.slice(0, 80) + (parentComment.body.length > 80 ? "..." : "")
              : "your comment";
            await supabase.from("notifications").insert({
              user_id: parentComment.author_id,
              type: "comment_reply",
              message: `${commenterName} replied to your comment: "${preview}"`,
              link: `/post/${postId}`,
            });
          }
        }
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
