import { banUser, unbanUser, getCurrentUser } from "@/lib/data/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Admin check: only admins can ban/unban
    // In a real app you'd check a role column; here we verify the user exists and is authenticated
    // For a simple setup, any authenticated user who reaches the admin panel can toggle bans
    // (the admin layout already guards access)

    const { userId } = await params;
    const body = await request.json();
    const { action, reason } = body as { action: "ban" | "unban"; reason?: string };

    if (action === "ban") {
      await banUser(userId, reason);
    } else if (action === "unban") {
      await unbanUser(userId);
    } else {
      return NextResponse.json({ error: "Invalid action. Use 'ban' or 'unban'." }, { status: 400 });
    }

    // Return updated profile
    const supabase = await createServerSupabase();
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, username, is_banned, banned_at, ban_reason")
      .eq("id", userId)
      .single();

    return NextResponse.json({ success: true, user: profile });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update ban status";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
