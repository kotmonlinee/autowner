import { getCurrentUser, renameCarTag } from "@/lib/data/server";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await request.json();
    const { name } = body as { name: string };

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Tag name is required" }, { status: 400 });
    }

    await renameCarTag(id, name.trim());
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to rename tag";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
