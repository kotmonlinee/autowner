import { publishDraft, deleteDraft, getPostByIdAny, getCurrentUser } from "@/lib/data/server";
import { NextResponse } from "next/server";

// GET a specific draft (for pre-filling the edit form)
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Login required" }, { status: 401 });

    const { id } = await params;
    const post = await getPostByIdAny(id);

    if (!post) return NextResponse.json({ error: "Draft not found" }, { status: 404 });
    if (post.author_id !== user.id) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    return NextResponse.json({ draft: post });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PATCH: Publish a draft
export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Login required" }, { status: 401 });

    const { id } = await params;
    await publishDraft(id, user.id);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE a draft
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Login required" }, { status: 401 });

    const { id } = await params;
    await deleteDraft(id, user.id);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
