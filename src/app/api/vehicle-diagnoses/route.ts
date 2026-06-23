import { NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase-server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const make = searchParams.get("make");
  const model = searchParams.get("model");
  if (!make || !model) return NextResponse.json({ diagnoses: [] });

  const supabase = await createServiceSupabase();
  const { data } = await supabase
    .from("diagnosis_summaries")
    .select("slug, title, severity, view_count")
    .eq("vehicle_make", make)
    .eq("vehicle_model", model)
    .order("view_count", { ascending: false })
    .limit(500);

  return NextResponse.json({
    diagnoses: (data ?? []).map((d: any) => ({
      slug: d.slug,
      title: d.title ?? "Car Diagnosis",
      severity: d.severity ?? "medium",
      viewCount: d.view_count ?? 0,
    })),
  });
}
