import { NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pageUrl, helpful, reason } = body as { pageUrl?: string; helpful?: boolean; reason?: string };

    if (!pageUrl || helpful === undefined) {
      return NextResponse.json({ error: "pageUrl and helpful are required" }, { status: 400 });
    }

    const supabase = await createServiceSupabase();
    const { error } = await (supabase.from("page_feedback") as any).insert({
      page_url: pageUrl,
      helpful,
      reason: reason?.trim() || null,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to save feedback" }, { status: 500 });
  }
}
