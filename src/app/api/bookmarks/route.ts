import { toggleBookmark, getCurrentUser } from "@/lib/data/server";
import { withRateLimit } from "@/lib/rate-limit";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Rate limit: 20 bookmark toggles per minute per user
    const limited = await withRateLimit(user.id, "bookmarks:toggle", 20, 60);
    if (limited) return limited;

    let body: { postId?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { postId } = body;
    if (!postId || typeof postId !== "string") {
      return NextResponse.json({ error: "postId is required" }, { status: 400 });
    }

    const bookmarked = await toggleBookmark(user.id, postId);
    return NextResponse.json({ bookmarked });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
