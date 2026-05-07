import { processVote, getCurrentUser } from "@/lib/data/server";
import { withRateLimit } from "@/lib/rate-limit";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Rate limit: 30 votes per minute per user
    const limited = await withRateLimit(user.id, "votes:create", 30, 60);
    if (limited) return limited;

    let body: { targetType?: string; targetId?: string; direction?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { targetType, targetId, direction } = body;
    if (!targetType || !targetId || !direction) {
      return NextResponse.json({ error: "Missing required fields: targetType, targetId, direction" }, { status: 400 });
    }
    if (!["post", "comment"].includes(targetType)) {
      return NextResponse.json({ error: "targetType must be 'post' or 'comment'" }, { status: 400 });
    }
    if (!["up", "down"].includes(direction)) {
      return NextResponse.json({ error: "direction must be 'up' or 'down'" }, { status: 400 });
    }

    const result = await processVote(user.id, targetType as "post" | "comment", targetId, direction as "up" | "down");
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
