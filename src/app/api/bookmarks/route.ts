// TODO: Rate limiting — add IP-based rate limiting in production (e.g. using Upstash Redis
// or Vercel KV). Each IP should be limited to ~20 bookmark toggles per minute to prevent abuse.
import { toggleBookmark, getCurrentUser } from "@/lib/data/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
