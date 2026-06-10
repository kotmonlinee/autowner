import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllRepairSlugs } from "@/lib/data/server";
import { getVehicleImageUrl } from "@/lib/vehicle-images";
import VehicleImage from "@/components/VehicleImage";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createServerSupabase } from "@/lib/supabase-server";

const MAKE_TIER: Record<string, string> = {
  toyota: "economy", honda: "economy", nissan: "economy", hyundai: "economy",
  kia: "economy", subaru: "economy", mazda: "economy", volkswagen: "mid_range",
  ford: "mid_range", chevrolet: "mid_range", gmc: "truck_suv", dodge: "mid_range",
  jeep: "truck_suv", ram: "truck_suv", chrysler: "mid_range", buick: "mid_range",
  bmw: "european", "mercedes-benz": "european", audi: "european",
  porsche: "european", volvo: "european", "land-rover": "european",
  mini: "european", jaguar: "european",
  cadillac: "luxury", lexus: "luxury", acura: "luxury", infiniti: "luxury",
  lincoln: "luxury", genesis: "luxury",
  tesla: "luxury", rivian: "truck_suv", lucid: "luxury",
};

function formatMoney(n: number): string {
  return n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n}`;
}

async function getVehicleData(makeSlug: string, modelSlug: string) {
  const supabase = await createServerSupabase();
  const { data: make } = await supabase.from("vehicle_makes").select("id, name, slug").eq("slug", makeSlug).single();
  if (!make) return null;
  const m = make as { id: string; name: string; slug: string };
  const { data: model } = await supabase.from("vehicle_models").select("name, slug").eq("slug", modelSlug).eq("make_id", m.id).single();
  if (!model) return null;
  return { make: { name: m.name, slug: m.slug }, model: model as { name: string; slug: string } };
}

async function getRepairCostsForVehicle(makeSlug: string, repairSlugs: string[]) {
  const supabase = await createServerSupabase();
  const tier = MAKE_TIER[makeSlug] ?? "mid_range";
  const results: { name: string; slug: string; min: number; max: number; avg: number }[] = [];

  // Fetch in batches
  for (let i = 0; i < repairSlugs.length; i += 20) {
    const batch = repairSlugs.slice(i, i + 20);
    const dbSlugs = batch.map((s) => s.replace(/-/g, "_"));
    const { data } = await supabase
      .from("repair_costs")
      .select("repair_name, repair_slug, min_cost, max_cost, avg_cost")
      .in("repair_slug", [...batch, ...dbSlugs])
      .eq("tier", tier);
    for (const row of (data ?? []) as any[]) {
      results.push({
        name: row.repair_name,
        slug: row.repair_slug.replace(/_/g, "-"),
        min: row.min_cost,
        max: row.max_cost,
        avg: row.avg_cost,
      });
    }
  }
  return results.sort((a, b) => a.name.localeCompare(b.name));
}

async function getCommonObdCodes(makeSlug: string, modelSlug: string) {
  const supabase = await createServerSupabase();
  // Get OBD codes most commonly associated with this vehicle's make
  const makeKeywords: Record<string, string[]> = {
    toyota: ["camry", "corolla", "toyota", "rav4"],
    honda: ["civic", "accord", "honda", "cr-v"],
    ford: ["f-150", "mustang", "ford", "explorer"],
    chevrolet: ["silverado", "chevy", "chevrolet", "equinox"],
    bmw: ["bmw", "series", "x3", "x5"],
    jeep: ["wrangler", "jeep", "grand cherokee"],
    tesla: ["tesla", "model"],
  };
  const keywords = makeKeywords[makeSlug] ?? [makeSlug];
  const q = keywords.join(" | ");
  const { data } = await supabase
    .from("obd_codes")
    .select("code, title, severity")
    .or(keywords.map((k) => `title.ilike.%${k}%`).join(","))
    .order("severity", { ascending: false })
    .limit(12);
  return (data as unknown as any[]) ?? [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ make: string; model: string }>;
}): Promise<Metadata> {
  const { make, model } = await params;
  const data = await getVehicleData(make, model);
  if (!data) return { title: "Not Found" };

  const title = `${data.make.name} ${data.model.name} Repair Costs, OBD Codes & Common Problems`;
  const desc = `Complete guide to ${data.make.name} ${data.model.name} — repair costs for 50+ jobs, common OBD-II diagnostic codes, safety recalls, and engine specifications.`;

  return {
    title,
    description: desc,
    alternates: { canonical: `https://www.autowner.com/vehicles/${make}/${model}` },
    openGraph: { title, description: desc, type: "article" },
    twitter: { card: "summary_large_image", title, description: desc },
  };
}

export default async function VehicleHubPage({
  params,
}: {
  params: Promise<{ make: string; model: string }>;
}) {
  const { make: makeSlug, model: modelSlug } = await params;
  const data = await getVehicleData(makeSlug, modelSlug);
  if (!data) notFound();

  const { make, model } = data;
  const makeName = make.name;
  const modelName = model.name;

  const supabase = await createServerSupabase();
  const repairSlugs = await getAllRepairSlugs();
  const [repairCosts, obdCodes, diagnosisData] = await Promise.all([
    getRepairCostsForVehicle(makeSlug, repairSlugs),
    getCommonObdCodes(makeSlug, modelSlug),
    supabase.from("diagnoses").select("slug, diagnosis_json, view_count").or(`vehicle_make.ilike.${makeSlug},vehicle_make.ilike.%${makeName}%`).order("view_count", { ascending: false }).limit(6),
  ]);
  const relatedDiagnoses = ((diagnosisData.data ?? []) as unknown as any[]).map((d: any) => ({
    slug: d.slug,
    title: d.diagnosis_json?.title ?? "Car Diagnosis",
    severity: d.diagnosis_json?.severity ?? "medium",
    costEstimate: d.diagnosis_json?.costEstimate,
  }));

  const imageUrl = getVehicleImageUrl(makeSlug, modelSlug);

  // Group repairs by category
  const categories: Record<string, typeof repairCosts> = {
    "Brakes & Suspension": [],
    "Engine & Drivetrain": [],
    "Electrical & AC": [],
    "Fluids & Filters": [],
    "Body & Other": [],
  };

  for (const r of repairCosts) {
    const n = r.name.toLowerCase();
    if (n.includes("brake") || n.includes("rotor") || n.includes("caliper") || n.includes("strut") || n.includes("shock") || n.includes("ball joint") || n.includes("tie rod") || n.includes("control arm") || n.includes("wheel bearing") || n.includes("cv axle") || n.includes("alignment")) {
      categories["Brakes & Suspension"].push(r);
    } else if (n.includes("engine") || n.includes("transmission") || n.includes("clutch") || n.includes("drive belt") || n.includes("serpentine") || n.includes("timing") || n.includes("head gasket") || n.includes("valve cover") || n.includes("turbo") || n.includes("motor mount") || n.includes("oil") || n.includes("spark plug") || n.includes("ignition") || n.includes("fuel") || n.includes("egr") || n.includes("pcv") || n.includes("throttle") || n.includes("catalytic") || n.includes("muffler") || n.includes("exhaust") || n.includes("oxygen sensor") || n.includes("o2 sensor") || n.includes("mass air")) {
      categories["Engine & Drivetrain"].push(r);
    } else if (n.includes("alternator") || n.includes("starter") || n.includes("battery") || n.includes("ac") || n.includes("air condition") || n.includes("compressor") || n.includes("blower") || n.includes("heater") || n.includes("evaporator") || n.includes("window") || n.includes("door lock")) {
      categories["Electrical & AC"].push(r);
    } else if (n.includes("fluid") || n.includes("filter") || n.includes("flush") || n.includes("change")) {
      categories["Fluids & Filters"].push(r);
    } else {
      categories["Body & Other"].push(r);
    }
  }

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <Navbar />
      <main id="main-content" className="max-w-4xl mx-auto px-5 py-6 flex-1 w-full">
        <nav className="mb-4 flex items-center gap-2 text-sm text-text-muted font-heading" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <svg className="w-3 h-3 text-surface-border" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <Link href="/repair-cost" className="hover:text-primary transition-colors">Repair Costs</Link>
          <svg className="w-3 h-3 text-surface-border" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span className="text-text-secondary">{makeName} {modelName}</span>
        </nav>

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-text-primary mb-2">
              {makeName} {modelName}
            </h1>
            <p className="text-text-muted text-base">
              Complete guide to repair costs, common OBD-II codes, and maintenance for the {makeName} {modelName}.
            </p>
          </div>
          {imageUrl && <VehicleImage src={imageUrl} alt={`${makeName} ${modelName}`} />}
        </div>

        {/* Repair Costs by Category */}
        {Object.entries(categories).filter(([, repairs]) => repairs.length > 0).map(([cat, repairs]) => (
          <div key={cat} className="bg-surface-1 rounded-2xl border border-surface-border p-6 mb-4">
            <h2 className="text-lg font-heading font-bold text-text-primary mb-4">{cat}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {repairs.map((r) => (
                <Link
                  key={r.slug}
                  href={`/repair-cost/${makeSlug}/${modelSlug}/${r.slug}`}
                  className="flex items-center justify-between p-3 bg-surface-0 rounded-xl border border-surface-border hover:border-primary/30 hover:bg-primary/5 transition-colors group"
                >
                  <span className="text-sm font-medium text-text-primary font-heading group-hover:text-primary transition-colors">{r.name}</span>
                  <span className="text-sm font-bold text-primary font-heading">{formatMoney(r.min)}–{formatMoney(r.max)}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Common OBD Codes */}
        {obdCodes.length > 0 && (
          <div className="bg-surface-1 rounded-2xl border border-surface-border p-6 mb-4">
            <h2 className="text-lg font-heading font-bold text-text-primary mb-4">
              Common OBD-II Codes for {makeName}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {obdCodes.slice(0, 8).map((c: any) => (
                <Link
                  key={c.code}
                  href={`/obd/${c.code.toLowerCase()}`}
                  className="flex items-center gap-3 p-3 bg-surface-0 rounded-xl border border-surface-border hover:border-primary/30 hover:bg-primary/5 transition-colors"
                >
                  <span className="text-sm font-mono font-bold text-primary shrink-0">{c.code}</span>
                  <span className="text-xs text-text-secondary line-clamp-1">{c.title}</span>
                </Link>
              ))}
            </div>
            <Link href="/obd" className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-primary hover:text-primary-glow transition-colors font-heading">
              Browse all 12,000+ codes →
            </Link>
          </div>
        )}

        {/* Related Diagnoses */}
        {relatedDiagnoses.length > 0 && (
          <div className="bg-surface-1 rounded-2xl border border-surface-border p-6 mb-4">
            <h2 className="text-lg font-heading font-bold text-text-primary mb-4">
              {makeName} {modelName} Diagnoses
            </h2>
            <p className="text-xs text-text-muted mb-3">AI-powered diagnoses from {makeName} {modelName} owners describing their symptoms:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {relatedDiagnoses.map((d: any) => (
                <Link key={d.slug} href={`/symptom-checker/${d.slug}`} className="flex items-center justify-between p-3 bg-surface-0 rounded-xl border border-surface-border hover:border-primary/30 hover:bg-primary/5 transition-colors group">
                  <span className="text-sm font-medium text-text-primary font-heading group-hover:text-primary transition-colors truncate">{d.title}</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ml-2 ${d.severity === "critical" ? "bg-red-50 text-red-700 border-red-200" : d.severity === "high" ? "bg-orange-50 text-orange-700 border-orange-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>{d.severity}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* AI Diagnosis CTA */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 mb-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl shrink-0">🔍</span>
            <div>
              <h2 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-1">Having a Problem with Your {makeName} {modelName}?</h2>
              <p className="text-xs text-text-secondary mb-2">Not sure what repair you need? Use our AI symptom checker to diagnose the issue based on your car's symptoms.</p>
              <Link href={`/symptom-checker`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-glow transition-colors font-heading">Diagnose Your {makeName} →</Link>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-surface-1 rounded-2xl border border-surface-border p-6">
          <h2 className="text-lg font-heading font-bold text-text-primary mb-4">More for {makeName} Owners</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link href={`/recall-check?make=${encodeURIComponent(makeName)}&model=${encodeURIComponent(modelName)}&year=2020`} className="p-3 bg-surface-0 rounded-xl border border-surface-border hover:border-primary/30 transition-colors text-sm font-heading font-semibold text-text-primary text-center">
              Safety Recalls
            </Link>
            <Link href={`/warning-lights`} className="p-3 bg-surface-0 rounded-xl border border-surface-border hover:border-primary/30 transition-colors text-sm font-heading font-semibold text-text-primary text-center">
              Warning Lights Guide
            </Link>
            <Link href={`/quote-checker?make=${encodeURIComponent(makeName)}&model=${encodeURIComponent(modelName)}`} className="p-3 bg-surface-0 rounded-xl border border-surface-border hover:border-primary/30 transition-colors text-sm font-heading font-semibold text-text-primary text-center">
              Check a Quote
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
