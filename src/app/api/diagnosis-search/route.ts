import { NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase-server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "6", 10));
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));

  const supabase = await createServiceSupabase();

  if (q.length < 2) {
    // No search query — return top diagnoses by view count
    const offset = (page - 1) * limit;
    const { data, error, count } = await supabase.from("diagnoses")
      .select("slug, symptom_path, diagnosis_json, view_count, vehicle_make, vehicle_model", { count: "exact" })
      .order("view_count", { ascending: false })
      .range(offset, offset + limit - 1);
    if (error) return NextResponse.json({ diagnoses: [], total: 0, error: error.message }, { status: 500 });
    return NextResponse.json({ diagnoses: data ?? [], total: count ?? 0 });
  }

  // Split query into words and search each across all fields
  const words = q.toLowerCase().split(/\s+/).filter(w => w.length >= 2);
  const fetchLimit = Math.min(limit * 3, 100);

  // Build OR conditions for first 3 words (to keep query manageable)
  const searchWords = words.slice(0, 3);
  const orConditions = searchWords.flatMap(w => [
    `symptom_path.ilike.%${w}%`,
    `vehicle_make.ilike.%${w}%`,
    `vehicle_model.ilike.%${w}%`
  ]).join(",");

  const { data, error } = await supabase.from("diagnoses")
    .select("slug, symptom_path, diagnosis_json, view_count, vehicle_make, vehicle_model")
    .or(orConditions)
    .order("view_count", { ascending: false })
    .range(0, fetchLimit - 1);

  if (error) return NextResponse.json({ diagnoses: [], total: 0, error: error.message }, { status: 500 });

  // Post-filter: require ALL words to match somewhere (AND logic across search terms)
  const allResults = (data ?? []).filter((d: any) => {
    const json = d.diagnosis_json;
    const title = (json?.title ?? "").toLowerCase();
    const summary = (json?.summary ?? "").toLowerCase();
    const path = (d.symptom_path ?? "").toLowerCase();
    const make = (d.vehicle_make ?? "").toLowerCase();
    const model = (d.vehicle_model ?? "").toLowerCase();
    const allText = `${title} ${summary} ${path} ${make} ${model}`;
    return words.every(w => allText.includes(w));
  });

  // Paginate from filtered results
  const offset = (page - 1) * limit;
  const paged = allResults.slice(offset, offset + limit);

  return NextResponse.json({ diagnoses: paged, total: allResults.length });
}
