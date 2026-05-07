import { editOwnComment, deleteOwnComment, getCurrentUser } from "@/lib/data/server";
import { checkContent } from "@/lib/moderation";
import { NextResponse } from "next/server";

/**
 * PATCH /api/comments/[id] — Edit a comment (author only).
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Login required" }, { status: 401 });

    const { id } = await params;

    let body: { body?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { body: commentBody } = body;
    if (!commentBody || typeof commentBody !== "string" || commentBody.trim().length === 0) {
      return NextResponse.json({ error: "Comment body is required" }, { status: 400 });
    }

    // Content moderation
    const modResult = checkContent(commentBody.trim());
    if (modResult.flagged) {
      return NextResponse.json({ error: modResult.reason ?? "Content flagged" }, { status: 400 });
    }

    await editOwnComment(id, user.id, commentBody.trim());

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update comment";
    const status = message === "Comment not found" ? 404
      : message.includes("only edit") ? 403
      : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

/**
 * DELETE /api/comments/[id] — Delete a comment (author only).
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Login required" }, { status: 401 });

    const { id } = await params;

    await deleteOwnComment(id, user.id);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete comment";
    const status = message === "Comment not found" ? 404
      : message.includes("only delete") ? 403
      : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
