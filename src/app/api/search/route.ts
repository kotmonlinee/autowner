import { NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase-server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  if (!q || q.length < 2) return NextResponse.json({ results: [] });

  const supabase = await createServiceSupabase();
  const lower = q.toLowerCase();

  const [obdRes, repairRes, lightRes, diagRes] = await Promise.all([
    supabase.from("obd_codes").select("code, title").or(`code.ilike.${lower}%,title.ilike.%${lower}%`).order("code").limit(5),
    supabase.from("repair_costs").select("repair_slug, repair_name").or(`repair_name.ilike.%${lower}%`).order("repair_name").limit(5),
    Promise.resolve(
      [
        { slug: "check-engine", title: "Check Engine Light (MIL)" },
        { slug: "oil-pressure", title: "Oil Pressure Warning" },
        { slug: "battery-charging", title: "Battery Charging Warning" },
        { slug: "brake-system", title: "Brake System Warning" },
        { slug: "coolant-temperature", title: "Coolant Temperature Warning" },
        { slug: "tpms", title: "Tire Pressure (TPMS)" },
        { slug: "abs", title: "ABS Warning" },
        { slug: "airbag", title: "Airbag / SRS Warning" },
        { slug: "traction-control", title: "Traction Control Warning" },
        { slug: "power-steering", title: "Power Steering Warning" },
        { slug: "glow-plug", title: "Glow Plug Indicator" },
        { slug: "reduced-power", title: "Reduced Engine Power" },
        { slug: "service-vehicle", title: "Service Vehicle Soon" },
        { slug: "oil-change", title: "Oil Change Reminder" },
        { slug: "washer-fluid", title: "Washer Fluid Low" },
        { slug: "door-ajar", title: "Door / Trunk Ajar" },
        { slug: "seat-belt", title: "Seat Belt Reminder" },
        { slug: "security", title: "Security / Immobilizer" },
        { slug: "low-fuel", title: "Low Fuel Level" },
      ].filter((w) => w.title.toLowerCase().includes(lower)).slice(0, 5)
    ),
    supabase.from("diagnoses").select("slug, diagnosis_json, view_count").ilike("symptom_path", `%${lower}%`).order("view_count", { ascending: false }).limit(5),
  ]);

  const results: { type: string; label: string; href: string; detail?: string }[] = [];

  if (obdRes.data) {
    for (const row of obdRes.data as unknown as { code: string; title: string }[]) {
      results.push({ type: "OBD Code", label: row.code, href: `/obd/${row.code.toLowerCase()}`, detail: row.title });
    }
  }

  if (repairRes.data) {
    for (const row of repairRes.data as unknown as { repair_slug: string; repair_name: string }[]) {
      const slug = row.repair_slug.replace(/_/g, "-");
      // deduplicate
      if (!results.some((r) => r.href === `/repair-cost/${slug}`)) {
        results.push({ type: "Repair Cost", label: row.repair_name, href: `/repair-cost/${slug}` });
      }
    }
  }

  if (Array.isArray(lightRes)) {
    for (const w of lightRes) {
      results.push({ type: "Warning Light", label: w.title, href: `/warning-lights/${w.slug}` });
    }
  }

  if (diagRes.data) {
    for (const row of diagRes.data as unknown as { slug: string; diagnosis_json: any }[]) {
      const diag = row.diagnosis_json;
      results.push({ type: "Diagnosis", label: diag.title, href: `/symptom-checker/${row.slug}`, detail: diag.summary?.slice(0, 80) });
    }
  }

  return NextResponse.json({ results: results.slice(0, 15) });
}
