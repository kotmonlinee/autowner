import { getCurrentUser } from "@/lib/data/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { withRateLimit } from "@/lib/rate-limit";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Login required" }, { status: 401 });

    const limited = await withRateLimit(user.id, "reports:create", 3, 60);
    if (limited) return limited;

    let body: {
      targetType?: string;
      targetId?: string;
      reason?: string;
      description?: string;
    };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { targetType, targetId, reason, description } = body;

    // Validate required fields
    if (!targetType || !["post", "comment"].includes(targetType)) {
      return NextResponse.json({ error: "targetType must be 'post' or 'comment'" }, { status: 400 });
    }
    if (!targetId || typeof targetId !== "string") {
      return NextResponse.json({ error: "targetId is required" }, { status: 400 });
    }
    const validReasons = ["spam", "harassment", "misinformation", "offensive", "other"];
    if (!reason || !validReasons.includes(reason)) {
      return NextResponse.json({ error: `reason must be one of: ${validReasons.join(", ")}` }, { status: 400 });
    }

    const supabase = await createServerSupabase();

    // Prevent users from reporting their own content
    if (targetType === "post") {
      const { data: post } = await supabase
        .from("posts")
        .select("author_id")
        .eq("id", targetId)
        .single();
      if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
      if (post.author_id === user.id) {
        return NextResponse.json({ error: "You cannot report your own content" }, { status: 400 });
      }
    } else {
      const { data: comment } = await supabase
        .from("comments")
        .select("author_id")
        .eq("id", targetId)
        .single();
      if (!comment) return NextResponse.json({ error: "Comment not found" }, { status: 404 });
      if (comment.author_id === user.id) {
        return NextResponse.json({ error: "You cannot report your own content" }, { status: 400 });
      }
    }

    // Prevent duplicate reports
    const { data: existing } = await supabase
      .from("reports")
      .select("id")
      .eq("reporter_id", user.id)
      .eq("target_type", targetType)
      .eq("target_id", targetId)
      .eq("status", "pending")
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: "You have already reported this content" }, { status: 409 });
    }

    // Create the report
    const { data: report, error } = await supabase
      .from("reports")
      .insert({
        reporter_id: user.id,
        target_type: targetType,
        target_id: targetId,
        reason,
        description: description?.trim() || null,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Failed to create report:", error.message);
      return NextResponse.json({ error: "Failed to create report" }, { status: 500 });
    }

    return NextResponse.json({ success: true, reportId: report.id });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
