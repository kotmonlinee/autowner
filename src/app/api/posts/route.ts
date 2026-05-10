import { createPost, getCurrentUser } from "@/lib/data/server";
import { checkContent } from "@/lib/moderation";
import { withRateLimit } from "@/lib/rate-limit";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Login required" }, { status: 401 });

    // Rate limit: 3 posts per hour per user
    const limited = await withRateLimit(user.id, "posts:create", 3, 3600);
    if (limited) return limited;

    let body: { title?: string; body?: string; categoryId?: string; tags?: unknown; quickAnswer?: Record<string, unknown> | null; engineIds?: string[] };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { title, body: postBody, categoryId, tags, quickAnswer, engineIds } = body;

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if (!postBody || typeof postBody !== "string" || postBody.trim().length === 0) {
      return NextResponse.json({ error: "Body is required" }, { status: 400 });
    }
    if (!Array.isArray(tags ?? [])) {
      return NextResponse.json({ error: "Tags must be an array" }, { status: 400 });
    }

    // Content moderation
    const modResult = checkContent(title, postBody);
    if (modResult.flagged) {
      return NextResponse.json({ error: modResult.reason ?? "Content flagged by moderation" }, { status: 400 });
    }

    const id = await createPost({
      title: title.trim(),
      body: postBody.trim(),
      categoryId: categoryId ?? "",
      authorId: user.id,
      tags: (tags ?? []) as { name: string; slug: string }[],
      quickAnswer: quickAnswer ?? null,
      engineIds: (engineIds ?? []) as string[],
    });
    return NextResponse.json({ id });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
