import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getVehicleRepairCost } from "@/lib/data/server";
import { searchRecalls } from "@/lib/nhtsa";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function formatMoney(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
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
    alternates: {
      canonical: `https://www.autowner.com/repair-cost/${make}/${model}/${repair}`,
    },
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

  // Fetch NHTSA recalls related to this repair
  let recalls: Awaited<ReturnType<typeof searchRecalls>> = [];
  try {
    recalls = await searchRecalls(makeName, modelName, String(new Date().getFullYear()));
  } catch { /* NHTSA may be unavailable */ }

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <Navbar />
      <main id="main-content" className="max-w-4xl mx-auto px-5 py-6 flex-1 w-full">
        {/* Breadcrumb */}
        <nav className="mb-4 flex items-center gap-2 text-sm text-text-muted font-heading" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/repair-cost" className="hover:text-primary transition-colors">Repair Costs</Link>
          <span>/</span>
          <Link href={`/repair-cost/${repair}`} className="hover:text-primary transition-colors">{repairName}</Link>
          <span>/</span>
          <span className="text-text-secondary">{makeName} {modelName}</span>
        </nav>

        <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
          {makeName} {modelName} {repairName} Cost
        </h1>
        <p className="text-text-muted mb-8">
          Estimated repair cost for a {makeName} {modelName} — {data.tierLabel} tier vehicle.
        </p>

        {/* Price Card */}
        {tierCost && (
          <div className="bg-surface-1 rounded-2xl border border-surface-border p-6 mb-6">
            <div className="flex items-baseline gap-4 mb-4">
              <span className="text-3xl font-heading font-bold text-text-primary">
                {formatMoney(tierCost.min)} – {formatMoney(tierCost.max)}
              </span>
              <span className="text-sm text-text-muted font-heading">estimated total</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-surface-0 rounded-xl border border-surface-border">
                <p className="text-xs text-text-muted font-heading mb-0.5">Labor</p>
                <p className="text-lg font-heading font-bold text-text-primary">{formatMoney(tierCost.labor)}</p>
              </div>
              <div className="p-3 bg-surface-0 rounded-xl border border-surface-border">
                <p className="text-xs text-text-muted font-heading mb-0.5">Parts</p>
                <p className="text-lg font-heading font-bold text-text-primary">{formatMoney(tierCost.parts)}</p>
              </div>
            </div>
            <p className="text-xs text-text-muted mt-3">
              {data.tierLabel} tier estimate for {makeName} {modelName}. Based on {tierCost.confidence} confidence data.
            </p>
          </div>
        )}

        {/* All Tiers Comparison */}
        <div className="bg-surface-1 rounded-2xl border border-surface-border p-6 mb-6">
          <h2 className="text-lg font-heading font-bold text-text-primary mb-4">Cost Comparison by Vehicle Tier</h2>
          <div className="space-y-3">
            {Object.entries(data.repair.tiers).map(([tierKey, t]) => (
              <div key={tierKey} className={`flex items-center justify-between p-3 rounded-xl border ${tierKey === data.tier ? "bg-primary/5 border-primary/20" : "bg-surface-0 border-surface-border"}`}>
                <div>
                  <span className="text-sm font-heading font-semibold text-text-primary">{t.tierLabel}</span>
                  <span className="text-xs text-text-muted ml-2">{t.vehicles.map((v) => `${v.make} ${v.model}`).join(", ")}</span>
                </div>
                <span className="text-sm font-heading font-bold text-text-primary">{formatMoney(t.min)} – {formatMoney(t.max)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Related Recalls */}
        {recalls.length > 0 && (
          <div className="bg-surface-1 rounded-2xl border border-surface-border p-6 mb-6">
            <h2 className="text-lg font-heading font-bold text-text-primary mb-3">
              {makeName} {modelName} Safety Recalls
            </h2>
            <p className="text-xs text-text-muted mb-4">Recent safety recalls may be related to this repair:</p>
            <div className="space-y-2">
              {recalls.slice(0, 5).map((r) => (
                <div key={r.NHTSACampaignNumber} className="p-3 bg-surface-0 rounded-xl border border-surface-border">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-text-muted">{r.NHTSACampaignNumber}</span>
                    {r.parkIt && <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 font-heading">Park It</span>}
                  </div>
                  <p className="text-sm font-heading font-semibold text-text-primary">{r.Component}</p>
                  <p className="text-xs text-text-secondary mt-1 line-clamp-2">{r.Summary}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cross-links */}
        <div className="bg-surface-1 rounded-2xl border border-surface-border p-6 mb-6">
          <h2 className="text-lg font-heading font-bold text-text-primary mb-3">Related Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href={`/obd`} className="p-3 bg-surface-0 rounded-xl border border-surface-border hover:border-primary/30 hover:bg-primary/5 transition-colors">
              <span className="text-sm font-heading font-semibold text-text-primary">OBD-II Code Lookup</span>
              <p className="text-xs text-text-muted mt-0.5">Find diagnostic trouble codes for your {makeName} {modelName}</p>
            </Link>
            <Link href={`/recall-check?make=${encodeURIComponent(makeName)}&year=2020`} className="p-3 bg-surface-0 rounded-xl border border-surface-border hover:border-primary/30 hover:bg-primary/5 transition-colors">
              <span className="text-sm font-heading font-semibold text-text-primary">Recall Check</span>
              <p className="text-xs text-text-muted mt-0.5">Check all NHTSA recalls for {makeName}</p>
            </Link>
            <Link href={`/quote-checker`} className="p-3 bg-surface-0 rounded-xl border border-surface-border hover:border-primary/30 hover:bg-primary/5 transition-colors">
              <span className="text-sm font-heading font-semibold text-text-primary">Quote Checker</span>
              <p className="text-xs text-text-muted mt-0.5">Verify your mechanic's quote for this repair</p>
            </Link>
            <Link href={`/repair-cost/${repair}`} className="p-3 bg-surface-0 rounded-xl border border-surface-border hover:border-primary/30 hover:bg-primary/5 transition-colors">
              <span className="text-sm font-heading font-semibold text-text-primary">All Vehicle Tiers</span>
              <p className="text-xs text-text-muted mt-0.5">Compare {repairName} costs across all vehicle types</p>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
