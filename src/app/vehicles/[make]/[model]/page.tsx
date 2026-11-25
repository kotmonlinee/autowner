import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cache } from "react";
import { getAllRepairSlugs } from "@/lib/data/server";
import { getVehicleImageUrl } from "@/lib/vehicle-images";
import { getRelatedWarningLights } from "@/lib/repair-warning-lights";
import VehicleImage from "@/components/VehicleImage";
import VehicleDiagnosisListAsync from "@/components/VehicleDiagnosisListAsync";
import PageFeedback from "@/components/PageFeedback";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createServiceSupabase } from "@/lib/supabase-server";
import { MAKE_TIER } from "@/lib/constants";
import Breadcrumbs from "@/components/content/Breadcrumbs";
import PageHeader from "@/components/content/PageHeader";
import ContentSection from "@/components/content/ContentSection";
import ContinueSolving from "@/components/content/ContinueSolving";
import QuoteCta from "@/components/content/QuoteCta";

export const revalidate = 6048000;
export const dynamic = "force-static";

export async function generateStaticParams() {
  const supabase = await createServiceSupabase();
  const { data } = await supabase.from("vehicle_models").select("slug, vehicle_makes!inner(slug)")
    .limit(500);
  return ((data ?? []) as any[]).map((m) => ({ make: m.vehicle_makes.slug, model: m.slug }));
}

function formatMoney(n: number): string {
  return n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n}`;
}

const getVehicleData = cache(async (makeSlug: string, modelSlug: string) => {
  const supabase = await createServiceSupabase();
  const { data: make } = await supabase.from("vehicle_makes").select("id, name, slug").eq("slug", makeSlug).single();
  if (!make) return null;
  const m = make as { id: string; name: string; slug: string };
  const { data: model } = await supabase.from("vehicle_models").select("name, slug").eq("slug", modelSlug).eq("make_id", m.id).single();
  if (!model) return null;
  return { make: { name: m.name, slug: m.slug }, model: model as { name: string; slug: string } };
});

async function getVehicleStats(makeName: string, modelName: string, makeSlug: string, modelSlug: string) {
  const supabase = await createServiceSupabase();
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
  const supabase = await createServiceSupabase();
  const tier = MAKE_TIER[makeSlug] ?? "mid_range";

  const batchSize = 20;
  const batchQueries: any[] = [];
  for (let i = 0; i < repairSlugs.length; i += batchSize) {
    const batch = repairSlugs.slice(i, i + batchSize);
    const dbSlugs = batch.map((s) => s.replace(/-/g, "_"));
    batchQueries.push((supabase
        .from("repair_costs")
        .select("repair_name, repair_slug, min_cost, max_cost, avg_cost")
        .in("repair_slug", [...batch, ...dbSlugs])
        .eq("tier", tier) as any) as Promise<any>);
  }

  const batchResults = await Promise.all(batchQueries);
  const results: { name: string; slug: string; min: number; max: number; avg: number }[] = [];
  for (const { data } of batchResults) {
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
  const supabase = await createServiceSupabase();
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
  if (!data) return { title: "Not Found", robots: { index: false, follow: false } };

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

  const supabase = await createServiceSupabase();
  const repairSlugs = await getAllRepairSlugs();
  const [repairCosts, obdCodes, stats] = await Promise.all([
    getRepairCostsForVehicle(makeSlug, repairSlugs),
    getCommonObdCodes(makeSlug, modelSlug),
    getVehicleStats(makeName, modelName, makeSlug, modelSlug),
  ]);

  const imageUrl = getVehicleImageUrl(makeSlug, modelSlug);
  const vehicleDescription = generateVehicleDescription(makeName, modelName, stats);
  const relatedWarningLights = (() => {
    const seen = new Set<string>();
    const lights: { slug: string; title: string }[] = [];
    for (const repair of repairCosts) {
      for (const light of getRelatedWarningLights(repair.slug)) {
        if (!seen.has(light.slug)) {
          seen.add(light.slug);
          lights.push(light);
        }
      }
    }
    return lights;
  })();

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
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Vehicles", href: "/vehicles" }, { label: `${makeName} ${modelName}` }]} />
        <PageHeader
          eyebrow="Vehicle diagnostic record"
          title={`${makeName} ${modelName}`}
          description={vehicleDescription}
          aside={imageUrl ? <VehicleImage src={imageUrl} alt={`${makeName} ${modelName}`} /> : undefined}
        />

        {/* Safety Recalls — check first before looking at costs */}
        <div className="mb-7 border-l-4 border-severity-caution bg-severity-caution-bg p-5">
          <p className="text-[10px] font-heading font-bold uppercase tracking-[0.15em] text-severity-caution">Check this before paying for a repair</p>
          <h2 className="mt-1.5 font-display text-2xl font-semibold text-text-primary">Open safety recalls are repaired free</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-text-secondary">Your {makeName} {modelName} may have an open recall. A recall repair is completed by an authorized dealer at no cost to the owner.</p>
          <Link prefetch={false} href={`/recall-check?make=${encodeURIComponent(makeName)}&model=${encodeURIComponent(modelName)}&year=2020`} className="mt-4 inline-flex items-center justify-between gap-6 bg-text-primary px-4 py-2.5 text-xs font-heading font-bold text-white transition-colors hover:bg-primary">
            Check recalls for this vehicle <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Repair Costs by Category */}
        {Object.entries(categories).filter(([, repairs]) => repairs.length > 0).map(([cat, repairs]) => (
          <div key={cat} className="mb-7 border-t border-surface-border pt-6">
            <div className="mb-4 flex items-end justify-between gap-4">
              <h2 className="font-display text-3xl font-semibold tracking-[-0.025em] text-text-primary">{cat}</h2>
              <span className="text-[10px] font-heading font-bold uppercase tracking-[0.12em] text-text-muted">{repairs.length} repairs</span>
            </div>
            <div className="grid min-w-0 grid-cols-1 border-l border-t border-surface-border sm:grid-cols-2">
              {repairs.map((r) => (
                <Link prefetch={false}
                  key={r.slug}
                  href={`/repair-cost/${r.slug}-${makeSlug}-${modelSlug}`}
                  className="group flex min-h-12 min-w-0 items-center justify-between overflow-hidden border-b border-r border-surface-border bg-surface-1 p-3 transition-colors hover:bg-primary/5"
                >
                  <span className="text-sm font-medium text-text-primary font-heading group-hover:text-primary transition-colors truncate flex-1 min-w-0">{r.name}</span>
                  <span className="text-sm font-bold text-primary font-heading shrink-0 mx-2">{formatMoney(r.min)}–{formatMoney(r.max)}</span>
                  <svg className="w-3.5 h-3.5 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width={14} height={14}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </Link>
              ))}
            </div>
          </div>
        ))}

        <QuoteCta
          href={`/quote-checker?make=${encodeURIComponent(makeName)}&model=${encodeURIComponent(modelName)}`}
          title={`Check a ${makeName} ${modelName} repair quote`}
          description="Compare the proposed total and itemized parts-and-labor costs with the expected range before authorizing work."
          action="Verify the quote"
        />

        {/* Common OBD Codes */}
        {obdCodes.length > 0 && (
          <ContentSection eyebrow="Scanner evidence" title={`Common OBD-II codes for ${makeName}`}>
            <div className="grid min-w-0 grid-cols-1 border-l border-t border-surface-border sm:grid-cols-2">
              {obdCodes.slice(0, 8).map((c: any) => (
                <Link prefetch={false}
                  key={c.code}
                  href={`/obd/${c.code.toLowerCase()}`}
                  className="group flex min-h-12 min-w-0 items-center gap-3 overflow-hidden border-b border-r border-surface-border bg-surface-1 p-3 transition-colors hover:bg-primary/5"
                >
                  <span className="text-sm font-mono font-bold text-primary shrink-0">{c.code}</span>
                  <span className="text-xs text-text-secondary line-clamp-1 flex-1 min-w-0">{c.title}</span>
                  <svg className="w-3.5 h-3.5 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width={14} height={14}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </Link>
              ))}
            </div>
            <Link prefetch={false} href="/obd" className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary transition-colors hover:text-primary-dark font-heading">
              Browse all 12,000+ codes →
            </Link>
          </ContentSection>
        )}

        {/* Diagnoses — loaded async to avoid blocking page render */}
        <VehicleDiagnosisListAsync makeName={makeName} modelName={modelName} />

        <ContinueSolving
          title={`Continue diagnosing the ${makeName} ${modelName}`}
          intro="Move from the repair list to the dashboard warning, scanner code, or symptom that matches what you are seeing."
          links={[
            ...relatedWarningLights.slice(0, 3).map((light) => ({
              href: `/warning-lights/${light.slug}`,
              label: light.title,
              description: "Understand the warning's urgency and the systems to inspect.",
              meta: "dashboard warning",
            })),
            {
              href: "/symptom-checker",
              label: "Describe the symptom",
              description: "Use the guided diagnosis when you have behavior but no confirmed code or failed part.",
              meta: "symptom wizard",
            },
            {
              href: "/repair-cost",
              label: "Compare another repair",
              description: "Review the complete repair cost index before authorizing work.",
              meta: "repair index",
            },
          ]}
        />

        {/* AI Diagnosis CTA */}
        <div className="border-l-4 border-primary bg-primary/5 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <h2 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-1">Having a Problem with Your {makeName} {modelName}?</h2>
              <p className="text-xs text-text-secondary">Not sure what repair you need? Describe your symptoms and our AI will diagnose the issue.</p>
            </div>
            <Link prefetch={false} href={`/symptom-checker`} className="flex shrink-0 items-center justify-between gap-5 bg-primary px-5 py-2.5 text-sm font-semibold font-heading text-white transition-colors hover:bg-primary-dark sm:inline-flex">
              Diagnose Your {makeName}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        <PageFeedback />
      </main>
      <Footer />
    </div>
  );
}
