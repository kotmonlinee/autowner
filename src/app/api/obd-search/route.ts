import { NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase-server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const prefix = searchParams.get("prefix")?.toUpperCase() ?? "";
  const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "50", 10));

  const supabase = await createServiceSupabase();

  let query = supabase.from("obd_codes").select("code, title, severity").order("code");

  if (prefix && /^[PCBU]$/i.test(prefix)) {
    query = query.ilike("code", `${prefix}%`);
  }

  if (q.length >= 2) {
    const lower = q.toLowerCase();
    query = query.or(`code.ilike.${lower}%,title.ilike.%${lower}%`);
  }

  query = query.limit(limit);
  const { data, error } = await query;

  if (error) return NextResponse.json({ codes: [], error: error.message }, { status: 500 });

  return NextResponse.json({
    codes: (data ?? []) as unknown as { code: string; title: string; severity: number }[],
  });
}
