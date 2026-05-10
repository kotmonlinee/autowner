// POST /api/admin/digest — Trigger weekly digest email generation.
// Requires the scrape API secret (x-scrape-secret header) for authorization.
// Optional `userId` body parameter for testing a single user.
// Without userId, sends digests to ALL users with primary vehicles.
import { createServiceSupabase } from "@/lib/supabase-server";
import { generateWeeklyDigest } from "@/lib/digest";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Authenticate via secret
    const secret = request.headers.get("x-scrape-secret");
    if (!secret || secret !== process.env.SCRAPE_API_SECRET) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 403 });
    }

    let body: { userId?: string };
    try {
      body = await request.json().catch(() => ({}));
    } catch {
      body = {};
    }

    const supabase = await createServiceSupabase();

    if (body.userId) {
      // Send digest to a single user (testing mode)
      const sent = await generateWeeklyDigest(body.userId);
      return NextResponse.json({
        sent: sent ? 1 : 0,
        skipped: sent ? 0 : 1,
        target: body.userId,
      });
    }

    // Send digests to all users who have a primary vehicle
    const { data: primaryUsers } = await supabase
      .from("user_vehicles")
      .select("user_id")
      .eq("is_primary", true);

    if (!primaryUsers?.length) {
      return NextResponse.json({ sent: 0, skipped: 0, message: "No users with primary vehicles found" });
    }

    // Dedupe user IDs
    const userIds = [...new Set(primaryUsers.map((v) => v.user_id))];

    let sent = 0;
    let skipped = 0;

    for (const userId of userIds) {
      try {
        const wasSent = await generateWeeklyDigest(userId);
        if (wasSent) {
          sent++;
        } else {
          skipped++;
        }
      } catch (error) {
        console.error(`[digest] Error generating digest for user ${userId}:`, error);
        skipped++;
      }
    }

    return NextResponse.json({ sent, skipped, total: userIds.length });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
