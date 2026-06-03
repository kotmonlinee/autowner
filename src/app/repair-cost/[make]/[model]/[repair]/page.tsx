import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getVehicleRepairCost } from "@/lib/data/server";
import { searchRecalls } from "@/lib/nhtsa";
import { getRelatedRepairs } from "@/lib/internal-linking";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createServerSupabase } from "@/lib/supabase-server";

function formatMoney(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

async function getRelatedObdCodes(repairName: string, makeSlug: string): Promise<{ code: string; title: string; severity: number }[]> {
  const supabase = await createServerSupabase();
  // Get keyword-matched repair links to determine relevant OBD codes
  const repairs = getRelatedRepairs(repairName, 1);
  const keywords = repairs.length > 0 ? repairs[0].name.toLowerCase().split(" ") : repairName.toLowerCase().split(" ");
  // Search OBD codes matching these keywords
  const kw = keywords.slice(0, 3).join(" | ");
  const { data } = await supabase
    .from("obd_codes")
    .select("code, title, severity")
    .or(keywords.map((k) => `title.ilike.%${k}%`).join(","))
    .order("severity", { ascending: false })
    .limit(8);
  return (data as unknown as { code: string; title: string; severity: number }[]) ?? [];
}

async function getVehicleGenerations(makeSlug: string, modelSlug: string) {
  const supabase = await createServerSupabase();
  const { data: make } = await supabase.from("vehicle_makes").select("id").eq("slug", makeSlug).single();
  if (!make) return [];
  const { data: model } = await supabase.from("vehicle_models").select("id").eq("slug", modelSlug).eq("make_id", (make as { id: string }).id).single();
  if (!model) return [];
  const { data: gens } = await supabase
    .from("vehicle_generations")
    .select("name, year_start, year_end, vehicle_engines(code, name, displacement, fuel_type, horsepower)")
    .eq("model_id", (model as { id: string }).id)
    .order("year_start", { ascending: false });
  return (gens as unknown as any[]) ?? [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ make: string; model: string; repair: string }>;
}): Promise<Metadata> {
  const { make, model, repair } = await params;
  const data = await getVehicleRepairCost(make, model, repair);
  if (!data) return { title: "Not Found" };

  const title = `${data.make.name} ${data.model.name} ${data.repair.name} Cost — ${data.tierLabel} Estimate`;
  const tierCost = data.repair.tiers[data.tier];
  const desc = tierCost
    ? `${data.make.name} ${data.model.name} ${data.repair.name} typically costs ${formatMoney(tierCost.min)}–${formatMoney(tierCost.max)}. ${data.tierLabel} tier estimate with labor and parts breakdown.`
    : `${data.make.name} ${data.model.name} ${data.repair.name} — estimated cost, labor, and parts breakdown for ${data.tierLabel} vehicles.`;

  return {
    title,
    description: desc,
    alternates: { canonical: `https://www.autowner.com/repair-cost/${make}/${model}/${repair}` },
    openGraph: { title, description: desc, type: "article" },
    twitter: { card: "summary_large_image", title, description: desc },
  };
}

export default async function VehicleRepairPage({
  params,
}: {
  params: Promise<{ make: string; model: string; repair: string }>;
}) {
  const { make, model, repair } = await params;
  const data = await getVehicleRepairCost(make, model, repair);
  if (!data) notFound();

  const tierCost = data.repair.tiers[data.tier];
  const makeName = data.make.name;
  const modelName = data.model.name;
  const repairName = data.repair.name;

  const [recalls, obdCodes, generations] = await Promise.all([
    searchRecalls(makeName, modelName, "2020").catch(() => [] as Awaited<ReturnType<typeof searchRecalls>>),
    getRelatedObdCodes(repairName, make),
    getVehicleGenerations(make, model),
  ]);

  const relatedRecalls = recalls.filter((r) =>
    repairName.toLowerCase().split(" ").some((w) => w.length > 3 && r.Component?.toLowerCase().includes(w)),
  );

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <Navbar />
      <main id="main-content" className="max-w-4xl mx-auto px-5 py-6 flex-1 w-full">
        <nav className="mb-4 flex items-center gap-2 text-sm text-text-muted font-heading" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <svg className="w-3 h-3 text-surface-border" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <Link href="/repair-cost" className="hover:text-primary transition-colors">Repair Costs</Link>
          <svg className="w-3 h-3 text-surface-border" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <Link href={`/repair-cost/${repair}`} className="hover:text-primary transition-colors">{repairName}</Link>
          <svg className="w-3 h-3 text-surface-border" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span className="text-text-secondary">{makeName} {modelName}</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-heading font-bold text-text-primary mb-2">
          {makeName} {modelName} {repairName} Cost
        </h1>
        <p className="text-text-muted text-base mb-8">
          What does a {repairName.toLowerCase()} cost for a {makeName} {modelName}? Get the estimated price range, labor vs. parts breakdown, and related recalls.
        </p>

        {/* 1. Vehicle-Specific Price */}
        {tierCost && (
          <div className="bg-surface-1 rounded-2xl border border-primary/20 bg-primary/[0.02] p-6 sm:p-8 mb-6">
            <h2 className="text-xs font-heading font-bold text-text-muted uppercase tracking-wider mb-3">
              Estimated Cost for {makeName} {modelName}
            </h2>
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-4xl font-heading font-bold text-text-primary">
                {formatMoney(tierCost.min)} – {formatMoney(tierCost.max)}
              </span>
              <span className="text-sm text-text-muted font-heading">estimated total</span>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-4 bg-surface-0 rounded-xl border border-surface-border">
                <p className="text-xs text-text-muted font-heading mb-1">Labor</p>
                <p className="text-2xl font-heading font-bold text-text-primary">{formatMoney(tierCost.labor)}</p>
                <p className="text-xs text-text-muted mt-1">at typical shop rate</p>
              </div>
              <div className="p-4 bg-surface-0 rounded-xl border border-surface-border">
                <p className="text-xs text-text-muted font-heading mb-1">Parts</p>
                <p className="text-2xl font-heading font-bold text-text-primary">{formatMoney(tierCost.parts)}</p>
                <p className="text-xs text-text-muted mt-1">OEM or aftermarket</p>
              </div>
            </div>
            <p className="text-sm text-text-secondary">
              This estimate is based on the <strong>{data.tierLabel}</strong> vehicle tier. {makeName} {modelName} falls into this category due to its brand positioning. Confidence level: <strong>{tierCost.confidence}</strong>.
            </p>
          </div>
        )}

        {/* 2. Model Generations & Year Differences */}
        {generations.length > 0 && (
          <div className="bg-surface-1 rounded-2xl border border-surface-border p-6 mb-6">
            <h2 className="text-lg font-heading font-bold text-text-primary mb-3">
              {modelName} Generations & Year Differences
            </h2>
            <p className="text-sm text-text-secondary mb-4">
              Different generations of the {makeName} {modelName} may have different {repairName.toLowerCase()} costs due to design changes, parts availability, and labor complexity.
            </p>
            <div className="space-y-3">
              {generations.slice(0, 5).map((gen) => (
                <div key={gen.name} className="p-4 bg-surface-0 rounded-xl border border-surface-border">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-heading font-semibold text-text-primary">
                        {gen.name} ({gen.year_start}–{gen.year_end ?? "Present"})
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {(gen.vehicle_engines ?? []).slice(0, 3).map((eng: any) => (
                          <span key={eng.code} className="inline-flex items-center px-2 py-0.5 rounded bg-surface-1 border border-surface-border text-xs text-text-muted font-mono">
                            {eng.code}: {eng.displacement} {eng.fuel_type}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-text-muted whitespace-nowrap font-heading">
                      {gen.year_start == new Date().getFullYear() - 5 ? "Newer — similar cost" : gen.year_start < 2015 ? "Older — may vary" : "Similar cost range"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-text-muted mt-3">
              Prices may vary between generations. Older models may have higher labor costs due to part availability; newer models may require specialized tools or dealer-only parts.
            </p>
          </div>
        )}

        {/* 3. Related OBD-II Codes */}
        {obdCodes.length > 0 && (
          <div className="bg-surface-1 rounded-2xl border border-surface-border p-6 mb-6">
            <h2 className="text-lg font-heading font-bold text-text-primary mb-3">
              Common OBD-II Codes for {makeName} {modelName} {repairName}
            </h2>
            <p className="text-sm text-text-secondary mb-4">
              These diagnostic trouble codes are commonly associated with {repairName.toLowerCase()} issues on the {makeName} {modelName}:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {obdCodes.map((c) => (
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
          </div>
        )}

        {/* 4. All Tiers Comparison */}
        <div className="bg-surface-1 rounded-2xl border border-surface-border p-6 mb-6">
          <h2 className="text-lg font-heading font-bold text-text-primary mb-4">
            How This Cost Compares Across Vehicle Types
          </h2>
          <p className="text-sm text-text-secondary mb-4">
            The same repair can cost dramatically different amounts depending on the vehicle. Here's how the {makeName} {modelName} compares:
          </p>
          <div className="space-y-2">
            {Object.entries(data.repair.tiers).map(([tierKey, t]) => (
              <div key={tierKey} className={`flex items-center justify-between p-3 rounded-xl border ${tierKey === data.tier ? "bg-primary/5 border-primary/20" : "bg-surface-0 border-surface-border"}`}>
                <div className="min-w-0">
                  <span className="text-sm font-heading font-semibold text-text-primary">{t.tierLabel}</span>
                  <span className="text-xs text-text-muted ml-2 hidden sm:inline">{t.vehicles.map((v) => `${v.make} ${v.model}`).join(", ")}</span>
                </div>
                <span className="text-sm font-heading font-bold text-text-primary shrink-0 ml-4">{formatMoney(t.min)} – {formatMoney(t.max)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Related Recalls */}
        {relatedRecalls.length > 0 && (
          <div className="bg-surface-1 rounded-2xl border border-surface-border p-6 mb-6">
            <h2 className="text-lg font-heading font-bold text-text-primary mb-3">
              {makeName} {modelName} Recalls Related to {repairName}
            </h2>
            <p className="text-xs text-text-muted mb-4">
              A recall may cover the cost of this repair. Check if your vehicle is affected:
            </p>
            <div className="space-y-2">
              {relatedRecalls.slice(0, 5).map((r) => (
                <div key={r.NHTSACampaignNumber} className={`p-4 rounded-xl border ${r.parkIt ? "border-red-200 dark:border-red-800 bg-red-50/20" : "bg-surface-0 border-surface-border"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-text-muted">{r.NHTSACampaignNumber}</span>
                    {r.parkIt && <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 font-heading">Park It</span>}
                    {r.parkOutSide && <span className="px-2 py-0.5 rounded text-xs font-bold bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400 font-heading">Park Outside</span>}
                  </div>
                  <p className="text-sm font-heading font-semibold text-text-primary">{r.Component}</p>
                  <p className="text-xs text-text-secondary mt-1">{r.Summary}</p>
                </div>
              ))}
            </div>
            <Link href={`/recall-check?make=${encodeURIComponent(makeName)}&model=${encodeURIComponent(modelName)}&year=2020`}
              className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-primary hover:text-primary-glow transition-colors font-heading">
              Check all recalls for this vehicle →
            </Link>
          </div>
        )}

        {/* 6. Related Tools */}
        <div className="bg-surface-1 rounded-2xl border border-surface-border p-6">
          <h2 className="text-lg font-heading font-bold text-text-primary mb-4">More Tools for {makeName} Owners</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href={`/obd`} className="p-4 bg-surface-0 rounded-xl border border-surface-border hover:border-primary/30 hover:bg-primary/5 transition-colors">
              <span className="text-sm font-heading font-semibold text-text-primary">OBD-II Code Lookup</span>
              <p className="text-xs text-text-muted mt-1">Decode check engine lights for your {makeName}</p>
            </Link>
            <Link href={`/recall-check?make=${encodeURIComponent(makeName)}`} className="p-4 bg-surface-0 rounded-xl border border-surface-border hover:border-primary/30 hover:bg-primary/5 transition-colors">
              <span className="text-sm font-heading font-semibold text-text-primary">Recall Check</span>
              <p className="text-xs text-text-muted mt-1">All NHTSA safety recalls for {makeName} vehicles</p>
            </Link>
            <Link href={`/quote-checker`} className="p-4 bg-surface-0 rounded-xl border border-surface-border hover:border-primary/30 hover:bg-primary/5 transition-colors">
              <span className="text-sm font-heading font-semibold text-text-primary">Quote Checker</span>
              <p className="text-xs text-text-muted mt-1">Got a {repairName.toLowerCase()} quote? Verify if it's fair</p>
            </Link>
            <Link href={`/repair-cost/${repair}`} className="p-4 bg-surface-0 rounded-xl border border-surface-border hover:border-primary/30 hover:bg-primary/5 transition-colors">
              <span className="text-sm font-heading font-semibold text-text-primary">All Vehicle Tiers</span>
              <p className="text-xs text-text-muted mt-1">{repairName} costs across all vehicle types</p>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
