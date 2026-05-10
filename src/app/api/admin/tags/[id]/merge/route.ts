import { getCurrentUser, mergeCarTag } from "@/lib/data/server";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: fromId } = await params;
    const body = await request.json();
    const { toId } = body as { toId: string };

    if (!toId || typeof toId !== "string") {
      return NextResponse.json({ error: "Target tag ID is required" }, { status: 400 });
    }

    if (fromId === toId) {
      return NextResponse.json({ error: "Cannot merge a tag into itself" }, { status: 400 });
    }

    await mergeCarTag(fromId, toId);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to merge tag";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
