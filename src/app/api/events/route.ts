// POST /api/events — Client-side event tracking endpoint.
// Accepts event data + anonymousId from the client, adds userId from the
// auth session if available, and inserts into user_events.
import { createServiceSupabase } from "@/lib/supabase-server";
import { createServerSupabase } from "@/lib/supabase-server";
import { rateLimit } from "@/lib/rate-limit";
import { NextResponse } from "next/server";

const VALID_EVENT_TYPES = new Set([
  "view_post",
  "search",
  "bookmark",
  "vote",
  "comment",
  "select_vehicle",
  "follow_vehicle",
  "register",
  "login",
]);

export async function POST(request: Request) {
  try {
    let body: {
      eventType?: string;
      targetType?: string;
      targetId?: string;
      metadata?: Record<string, unknown>;
      anonymousId?: string;
    };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { eventType, targetType, targetId, metadata, anonymousId } = body;

    if (!eventType || typeof eventType !== "string") {
      return NextResponse.json({ error: "eventType is required" }, { status: 400 });
    }

    if (!VALID_EVENT_TYPES.has(eventType)) {
      return NextResponse.json({ error: "Unknown event type" }, { status: 400 });
    }

    // Require at least one identifier
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const identifier = anonymousId ?? clientIp;

    if (!identifier || identifier === "unknown") {
      return NextResponse.json(
        { error: "anonymousId or IP is required" },
        { status: 400 },
      );
    }

    // Rate limit: 100 events per minute per identifier
    const result = await rateLimit(identifier, "events:track", 100, 60);
    if (!result.success) {
      return NextResponse.json(
        { error: "Too many requests" },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              Math.max(0, result.reset - Math.ceil(Date.now() / 1000)),
            ),
          },
        },
      );
    }

    // Get userId from auth session if available
    let userId: string | null = null;
    try {
      // Use server client (not service) to read the session cookie
      const supabase = await createServerSupabase();
      const { data } = await supabase.auth.getUser();
      userId = data.user?.id ?? null;
    } catch {
      // User not authenticated — that's fine for anonymous events
    }

    // Insert event
    const serviceSupabase = await createServiceSupabase();
    await serviceSupabase.from("user_events").insert({
      user_id: userId,
      anonymous_id: anonymousId ?? null,
      event_type: eventType,
      target_type: targetType ?? null,
      target_id: targetId ?? null,
      metadata: metadata ?? null,
    });

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
