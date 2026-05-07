import { createServerSupabase } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, stack, url, userId, userAgent } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }

    const supabase = await createServerSupabase();

    await supabase.from("error_logs").insert({
      message,
      stack: typeof stack === "string" ? stack : null,
      url: typeof url === "string" ? url : null,
      user_id: typeof userId === "string" ? userId : null,
      user_agent: typeof userAgent === "string" ? userAgent : null,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    // Still return 200 to the client — logging failures shouldn't surface
    console.error("log-error endpoint failure:", err);
    return NextResponse.json({ ok: false });
  }
}
