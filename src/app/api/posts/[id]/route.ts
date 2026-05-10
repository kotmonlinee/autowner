import { editOwnPost, softDeleteOwnPost, getCurrentUser } from "@/lib/data/server";
import { withRateLimit } from "@/lib/rate-limit";
import { checkContent } from "@/lib/moderation";
import { NextResponse } from "next/server";

/**
 * PATCH /api/posts/[id] — Edit a post (author only).
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Login required" }, { status: 401 });

    const { id } = await params;

    let body: { title?: string; body?: string; category_id?: string | null };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { title, body: postBody, category_id } = body;

    if (!title && !postBody && category_id === undefined) {
      return NextResponse.json({ error: "At least one of title, body, or category_id is required" }, { status: 400 });
    }

    // Content moderation on the update
    const modResult = checkContent(
      title ?? "",
      postBody ?? "",
    );
    if (modResult.flagged) {
      return NextResponse.json({ error: modResult.reason ?? "Content flagged" }, { status: 400 });
    }

    await editOwnPost(id, user.id, {
      ...(title !== undefined && { title: title.trim() }),
      ...(postBody !== undefined && { body: postBody.trim() }),
      ...(category_id !== undefined && { category_id }),
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update post";
    const status = message === "Post not found" ? 404
      : message.includes("only edit") ? 403
      : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

/**
 * DELETE /api/posts/[id] — Soft-delete a post (author only).
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Login required" }, { status: 401 });

    const { id } = await params;

    await softDeleteOwnPost(id, user.id);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete post";
    const status = message === "Post not found" ? 404
      : message.includes("only delete") ? 403
      : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
