import { NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase-server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "6", 10));
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const offset = (page - 1) * limit;

  const supabase = await createServiceSupabase();

  let query = supabase.from("diagnoses")
    .select("slug, symptom_path, diagnosis_json, view_count, vehicle_make, vehicle_model", { count: "exact" })
    .order("view_count", { ascending: false })
    .range(offset, offset + limit - 1);

  if (q.length >= 2) {
    const lower = q.toLowerCase();
    query = query.or(
      `symptom_path.ilike.%${lower}%,vehicle_make.ilike.%${lower}%,vehicle_model.ilike.%${lower}%`,
    );
  }

  const { data, error, count } = await query;

  // Client-side filter for diagnosis_json->>title since Supabase .or() doesn't chain well with JSONB
  let results = (data ?? []) as unknown as any[];
  if (q.length >= 2) {
    const lower = q.toLowerCase();
    results = results.filter((d: any) => {
      const title = d.diagnosis_json?.title?.toLowerCase() ?? "";
      const summary = d.diagnosis_json?.summary?.toLowerCase() ?? "";
      const path = (d.symptom_path ?? "").toLowerCase();
      const make = (d.vehicle_make ?? "").toLowerCase();
      const model = (d.vehicle_model ?? "").toLowerCase();
      const all = `${title} ${summary} ${path} ${make} ${model}`;
      return all.includes(lower);
    });
  }

  if (error) return NextResponse.json({ diagnoses: [], error: error.message }, { status: 500 });

  return NextResponse.json({ diagnoses: results, total: count ?? 0 });
}
