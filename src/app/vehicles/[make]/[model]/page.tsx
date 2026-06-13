import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllRepairSlugs } from "@/lib/data/server";
import { getVehicleImageUrl } from "@/lib/vehicle-images";
import { getRelatedWarningLights } from "@/lib/repair-warning-lights";
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

async function getVehicleStats(makeName: string, modelName: string, makeSlug: string, modelSlug: string) {
  const supabase = await createServerSupabase();
  const tier = MAKE_TIER[makeSlug] ?? "mid_range";

  // Get make/model IDs for generations query
  const { data: makeData } = await supabase.from("vehicle_makes").select("id").eq("slug", makeSlug).single();
  const { data: modelData } = await supabase.from("vehicle_models").select("id").eq("slug", modelSlug).eq("make_id", (makeData as any)?.id).single();
  const modelId = (modelData as any)?.id;

  const [genRes, repairRes, obdRes, diagRes] = await Promise.all([
    modelId
      ? supabase.from("vehicle_generations").select("name, year_start, year_end").eq("model_id", modelId).order("year_start")
      : Promise.resolve({ data: [] }),
    supabase.from("repair_costs").select("repair_name, min_cost, max_cost").eq("tier", tier),
    supabase.from("obd_codes").select("code, title, severity").or(`title.ilike.%${makeName.toLowerCase()}%,title.ilike.%${modelName.toLowerCase()}%`).order("severity", { ascending: false }).limit(12),
    supabase.from("diagnoses").select("id", { count: "exact", head: true }).or(`vehicle_make.ilike.%${makeName.toLowerCase()}%`),
  ]);

  const generations = (genRes.data ?? []) as unknown as any[];
  const repairs = (repairRes.data ?? []) as unknown as any[];
  const obdCodes = (obdRes.data ?? []) as unknown as any[];
  const diagCount = diagRes.count ?? 0;

  // Deduplicate cheapest repairs by name
  const seen = new Set<string>();
  const uniqueRepairs: any[] = [];
  for (const r of repairs) {
    if (!seen.has(r.repair_name)) { seen.add(r.repair_name); uniqueRepairs.push(r); }
  }
  const sortedByMin = uniqueRepairs.filter((r: any) => r.min_cost > 0).sort((a: any, b: any) => a.min_cost - b.min_cost);
  const cheapest = sortedByMin.slice(0, 3).map((r: any) => r.repair_name);
  const costMin = sortedByMin.length > 0 ? sortedByMin[0].min_cost : null;
  const costMax = sortedByMin.length > 0 ? Math.max(...sortedByMin.map((r: any) => r.max_cost)) : null;
  const costRange = costMin != null && costMax != null ? { min: costMin, max: costMax } : null;

  const tierLabels: Record<string, string> = {
    economy: "economy vehicles like Honda Civic / Toyota Corolla",
    mid_range: "mid-range vehicles like Ford F-150 / Honda Accord",
    luxury: "luxury vehicles like BMW 3 Series / Mercedes C-Class",
    truck_suv: "trucks and SUVs like Chevy Tahoe / Ram 1500",
    european: "European vehicles like Audi A4 / Volvo S60",
  };

  return {
    genCount: generations.length,
    genYears: generations.length > 0
      ? `${generations[0]?.year_start ?? "?"}–${generations[generations.length - 1]?.year_end ?? "Present"}`
      : null,
    repairCount: uniqueRepairs.length,
    cheapest,
    costRange,
    obdCount: obdCodes.length,
    diagCount,
    tierLabel: tierLabels[tier] ?? tier,
  };
}

function generateVehicleDescription(makeName: string, modelName: string, stats: Awaited<ReturnType<typeof getVehicleStats>>) {
  const parts: string[] = [];

  // Data coverage
  const coverage = [];
  if (stats.repairCount > 0) coverage.push(`${stats.repairCount} repair cost estimates`);
  if (stats.obdCount > 0) coverage.push(`${stats.obdCount} common OBD-II codes`);
  if (stats.diagCount > 0) coverage.push(`${stats.diagCount} AI-powered diagnoses`);
  if (coverage.length > 0) {
    parts.push(`Our database tracks ${coverage.join(", ")} for this model.`);
  }

  // Cost profile
  if (stats.costRange && stats.cheapest.length > 0) {
    const cheapestList = stats.cheapest.map((c) => c.toLowerCase()).join(", ");
    parts.push(`Repair costs range from $${stats.costRange.min.toLocaleString()} (${stats.cheapest[0].toLowerCase()}) to $${stats.costRange.max.toLocaleString()}, typical for ${stats.tierLabel}. Common repairs include ${cheapestList}.`);
  }

  return parts.join(" ");
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
  const stats = await getVehicleStats(makeName, modelName, makeSlug, modelSlug);
  const vehicleDescription = generateVehicleDescription(makeName, modelName, stats);

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
          <Link href="/vehicles" className="hover:text-primary transition-colors">Vehicles</Link>
          <svg className="w-3 h-3 text-surface-border" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span className="text-text-secondary">{makeName} {modelName}</span>
        </nav>

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-text-primary mb-3">
              {makeName} {modelName}
            </h1>
            <p className="text-text-muted text-sm sm:text-base leading-relaxed max-w-2xl">
              {vehicleDescription}
            </p>
          </div>
          {imageUrl && <VehicleImage src={imageUrl} alt={`${makeName} ${modelName}`} />}
        </div>

        {/* Safety Recalls — check first before looking at costs */}
        <div className="bg-amber-50/30 dark:bg-amber-950/10 rounded-2xl border border-amber-200 dark:border-amber-800 p-5 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
            </div>
            <div className="flex-1">
              <h2 className="text-sm font-heading font-bold text-text-primary mb-1">Check for Safety Recalls First</h2>
              <p className="text-xs text-text-secondary mb-3">Your {makeName} {modelName} may have open recalls — repairs covered by a recall are <strong>free</strong> at dealerships.</p>
              <Link href={`/recall-check?make=${encodeURIComponent(makeName)}&model=${encodeURIComponent(modelName)}&year=2020`} className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-lg transition-colors font-heading">
                Check Recalls Now →
              </Link>
            </div>
          </div>
        </div>

        {/* Repair Costs by Category */}
        {Object.entries(categories).filter(([, repairs]) => repairs.length > 0).map(([cat, repairs]) => (
          <div key={cat} className="bg-surface-1 rounded-2xl border border-surface-border p-6 mb-4">
            <h2 className="text-lg font-heading font-bold text-text-primary mb-4">{cat}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {repairs.map((r) => (
                <Link
                  key={r.slug}
                  href={`/repair-cost/${r.slug}-${makeSlug}-${modelSlug}`}
                  className="flex items-center justify-between p-3 min-h-[44px] bg-surface-0 rounded-xl border border-surface-border hover:border-primary/30 hover:bg-primary/5 transition-colors group"
                >
                  <span className="text-sm font-medium text-text-primary font-heading group-hover:text-primary transition-colors truncate flex-1 min-w-0">{r.name}</span>
                  <span className="text-sm font-bold text-primary font-heading shrink-0 mx-2">{formatMoney(r.min)}–{formatMoney(r.max)}</span>
                  <svg className="w-3.5 h-3.5 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
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
                  className="group flex items-center gap-3 p-3 min-h-[44px] bg-surface-0 rounded-xl border border-surface-border hover:border-primary/30 hover:bg-primary/5 transition-colors"
                >
                  <span className="text-sm font-mono font-bold text-primary shrink-0">{c.code}</span>
                  <span className="text-xs text-text-secondary line-clamp-1 flex-1 min-w-0">{c.title}</span>
                  <svg className="w-3.5 h-3.5 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </Link>
              ))}
            </div>
            <Link href="/obd" className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-primary hover:text-primary-glow transition-colors font-heading">
              Browse all 12,000+ codes →
            </Link>
          </div>
        )}

        {/* Related Warning Lights */}
        {(() => {
          const seen = new Set<string>();
          const warningLights: { slug: string; title: string }[] = [];
          for (const r of repairCosts) {
            const lights = getRelatedWarningLights(r.slug);
            for (const l of lights) {
              if (!seen.has(l.slug)) { seen.add(l.slug); warningLights.push(l); }
            }
          }
          if (warningLights.length === 0) return null;
          return (
            <div className="bg-surface-1 rounded-2xl border border-surface-border p-6 mb-4">
              <h2 className="text-lg font-heading font-bold text-text-primary mb-4">
                Common Warning Lights for {makeName} {modelName}
              </h2>
              <p className="text-xs text-text-muted mb-3">Dashboard warning lights that may appear with {makeName} {modelName} repairs:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {warningLights.slice(0, 8).map((light) => (
                  <Link key={light.slug} href={`/warning-lights/${light.slug}`}
                    className="group flex items-center gap-3 p-3 min-h-[44px] bg-surface-0 rounded-xl border border-surface-border hover:border-primary/30 hover:bg-primary/5 transition-colors">
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-surface-2">
                      <img src={`/warning-lights/${light.slug}.jpg`} alt={light.title} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <span className="text-sm font-heading font-semibold text-text-primary group-hover:text-primary transition-colors truncate flex-1 min-w-0">{light.title}</span>
                    <svg className="w-3.5 h-3.5 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                  </Link>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Related Diagnoses */}
        {relatedDiagnoses.length > 0 && (
          <div className="bg-surface-1 rounded-2xl border border-surface-border p-6 mb-4">
            <h2 className="text-lg font-heading font-bold text-text-primary mb-4">
              {makeName} {modelName} Diagnoses
            </h2>
            <p className="text-xs text-text-muted mb-3">AI-powered diagnoses from {makeName} {modelName} owners describing their symptoms:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {relatedDiagnoses.map((d: any) => (
                <Link key={d.slug} href={`/symptom-checker/${d.slug}`} className="flex items-center justify-between p-3 min-h-[44px] bg-surface-0 rounded-xl border border-surface-border hover:border-primary/30 hover:bg-primary/5 transition-colors group">
                  <span className="text-sm font-medium text-text-primary font-heading group-hover:text-primary transition-colors truncate flex-1 min-w-0">{d.title}</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 mx-2 ${d.severity === "critical" ? "bg-red-50 text-red-700 border-red-200" : d.severity === "high" ? "bg-orange-50 text-orange-700 border-orange-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>{d.severity}</span>
                  <svg className="w-3.5 h-3.5 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* AI Diagnosis CTA */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <h2 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-1">Having a Problem with Your {makeName} {modelName}?</h2>
              <p className="text-xs text-text-secondary">Not sure what repair you need? Describe your symptoms and our AI will diagnose the issue.</p>
            </div>
            <Link href={`/symptom-checker`} className="flex items-center justify-between sm:inline-flex sm:gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold font-heading rounded-lg hover:bg-primary-glow hover:-translate-y-px transition-all duration-150 shadow-sm shadow-primary/20 shrink-0">
              Diagnose Your {makeName}
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </Link>
          </div>
        </div>

        {/* Quote Checker */}
        <div className="bg-surface-1 rounded-2xl border border-surface-border p-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <h2 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-1">Got a Quote from Your Mechanic?</h2>
              <p className="text-xs text-text-secondary">Verify if the quoted price for your {makeName} {modelName} repair is fair.</p>
            </div>
            <Link href={`/quote-checker?make=${encodeURIComponent(makeName)}&model=${encodeURIComponent(modelName)}`} className="flex items-center justify-between sm:inline-flex sm:gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold font-heading rounded-lg hover:bg-primary-glow hover:-translate-y-px transition-all duration-150 shadow-sm shadow-primary/20 shrink-0">
              Verify Quote
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
