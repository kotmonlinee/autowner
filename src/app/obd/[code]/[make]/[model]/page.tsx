import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getObdCode, getRelatedObdCodes } from "@/lib/data/server";
import { getRelatedRepairs } from "@/lib/internal-linking";
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
  tesla: "luxury", rivian: "truck_suv", lucid: "luxury",
};

function formatMoney(n: number): string { return `$${n.toLocaleString("en-US")}`; }

async function getVehicleInfo(makeSlug: string, modelSlug: string) {
  const supabase = await createServerSupabase();
  const [{ data: make }, { data: model }] = await Promise.all([
    supabase.from("vehicle_makes").select("name, slug").eq("slug", makeSlug).single(),
    supabase.from("vehicle_models").select("name, slug").eq("slug", modelSlug).single(),
  ]);
  if (!make || !model) return null;
  return { make: make as { name: string; slug: string }, model: model as { name: string; slug: string } };
}

async function getRepairCostsFor(makeSlug: string, repairSlugs: string[]) {
  const supabase = await createServerSupabase();
  const tier = MAKE_TIER[makeSlug] ?? "mid_range";
  const results: { name: string; slug: string; min: number; max: number }[] = [];
  for (const s of repairSlugs) {
    const dbSlug = s.replace(/-/g, "_");
    const { data } = await supabase
      .from("repair_costs")
      .select("repair_name, repair_slug, min_cost, max_cost")
      .or(`repair_slug.eq.${s},repair_slug.eq.${dbSlug}`)
      .eq("tier", tier)
      .maybeSingle();
    if (data) {
      const r = data as any;
      results.push({ name: r.repair_name, slug: r.repair_slug.replace(/_/g, "-"), min: r.min_cost, max: r.max_cost });
    }
  }
  return results;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string; make: string; model: string }>;
}): Promise<Metadata> {
  const { code, make, model } = await params;
  const [obd, vehicle] = await Promise.all([getObdCode(code), getVehicleInfo(make, model)]);
  if (!obd || !vehicle) return { title: "Not Found" };

  const title = `${obd.code} Code on ${vehicle.make.name} ${vehicle.model.name} — Causes & Repair Cost`;
  const costText = obd.min_cost ? ` Repair costs typically ${formatMoney(obd.min_cost)}–${formatMoney(obd.max_cost ?? obd.min_cost)}.` : "";
  const desc = `${obd.code} on ${vehicle.make.name} ${vehicle.model.name}: ${obd.title}.${costText} Learn causes, symptoms, and whether it's safe to drive.`;

  return {
    title, description: desc,
    alternates: { canonical: `https://www.autowner.com/obd/${code.toLowerCase()}/${make}/${model}` },
    openGraph: { title, description: desc, type: "article" },
    twitter: { card: "summary_large_image", title, description: desc },
  };
}

export default async function ObdVehiclePage({
  params,
}: {
  params: Promise<{ code: string; make: string; model: string }>;
}) {
  const { code, make: makeSlug, model: modelSlug } = await params;
  const [obd, vehicle] = await Promise.all([getObdCode(code), getVehicleInfo(makeSlug, modelSlug)]);
  if (!obd || !vehicle) notFound();

  const { make, model } = vehicle;
  const makeName = make.name;
  const modelName = model.name;
  const relatedRepairs = getRelatedRepairs(obd.title, 5);
  const repairCosts = await getRepairCostsFor(makeSlug, relatedRepairs.map((r) => r.slug));
  const imageUrl = getVehicleImageUrl(makeSlug, modelSlug);

  const severityLabel = obd.severity >= 5 ? "Critical" : obd.severity >= 4 ? "Serious" : obd.severity >= 3 ? "Moderate" : "Low";
  const severityColor = obd.severity >= 5 ? "text-red-600 bg-red-50 border-red-200" : obd.severity >= 4 ? "text-orange-600 bg-orange-50 border-orange-200" : obd.severity >= 3 ? "text-amber-600 bg-amber-50 border-amber-200" : "text-emerald-600 bg-emerald-50 border-emerald-200";

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <Navbar />
      <main id="main-content" className="max-w-4xl mx-auto px-5 py-6 flex-1 w-full">
        <nav className="mb-4 flex items-center gap-2 text-sm text-text-muted font-heading" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <svg className="w-3 h-3 text-surface-border" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <Link href="/obd" className="hover:text-primary transition-colors">OBD Codes</Link>
          <svg className="w-3 h-3 text-surface-border" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <Link href={`/obd/${obd.code.toLowerCase()}`} className="hover:text-primary transition-colors">{obd.code}</Link>
          <svg className="w-3 h-3 text-surface-border" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <Link href={`/vehicles/${makeSlug}/${modelSlug}`} className="hover:text-primary transition-colors">{makeName} {modelName}</Link>
        </nav>

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border font-heading ${severityColor}`}>
                {severityLabel} — S{obd.severity}
              </span>
              <span className="text-sm text-text-muted font-heading">{makeName} {modelName}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-text-primary mb-1">
              {obd.code} on {makeName} {modelName}
            </h1>
            <p className="text-text-muted text-base">{obd.title}</p>
          </div>
          {imageUrl && <VehicleImage src={imageUrl} alt={`${makeName} ${modelName}`} />}
        </div>

        {/* Severity + Cost */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-surface-1 rounded-2xl border border-surface-border p-5">
            <h2 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-2">Can you still drive?</h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              {obd.severity >= 5 ? "Stop driving immediately. This code indicates a critical issue that could cause severe damage or safety hazards." :
               obd.severity >= 4 ? "Continued driving is possible but risky. Have the vehicle inspected as soon as possible to avoid further damage." :
               obd.severity >= 3 ? "You can continue driving in most cases, but schedule a diagnosis soon. Performance and fuel economy may be affected." :
               "This is typically safe to drive with. Schedule an inspection at your convenience."}
            </p>
          </div>
          {obd.min_cost != null && (
            <div className="bg-surface-1 rounded-2xl border border-primary/20 bg-primary/[0.02] p-5">
              <h2 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-2">Estimated Repair Cost</h2>
              <p className="text-3xl font-heading font-bold text-text-primary">
                {formatMoney(obd.min_cost)}{obd.max_cost ? ` – ${formatMoney(obd.max_cost)}` : "+"}
              </p>
              <p className="text-xs text-text-muted mt-1">For {makeName} {modelName} — {MAKE_TIER[makeSlug]?.replace("_", "/") ?? "mid_range"} tier</p>
            </div>
          )}
        </div>

        {/* Related Repair Costs */}
        {repairCosts.length > 0 && (
          <div className="bg-surface-1 rounded-2xl border border-surface-border p-6 mb-4">
            <h2 className="text-lg font-heading font-bold text-text-primary mb-4">
              {obd.code} Repair Costs for {makeName} {modelName}
            </h2>
            <div className="space-y-2">
              {repairCosts.map((r) => (
                <Link key={r.slug} href={`/repair-cost/${makeSlug}/${modelSlug}/${r.slug}`}
                  className="flex items-center justify-between p-3 bg-surface-0 rounded-xl border border-surface-border hover:border-primary/30 hover:bg-primary/5 transition-colors group">
                  <span className="text-sm font-medium text-text-primary font-heading group-hover:text-primary transition-colors">{r.name}</span>
                  <span className="text-sm font-bold text-primary font-heading">{formatMoney(r.min)}–{formatMoney(r.max)}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Common Symptoms + Causes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {obd.symptoms.length > 0 && (
            <div className="bg-surface-1 rounded-2xl border border-surface-border p-5">
              <h2 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-3">Common Symptoms</h2>
              <ul className="space-y-1.5">
                {obd.symptoms.slice(0, 5).map((s, i) => (
                  <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {obd.causes.length > 0 && (
            <div className="bg-surface-1 rounded-2xl border border-surface-border p-5">
              <h2 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-3">Possible Causes</h2>
              <ul className="space-y-1.5">
                {obd.causes.slice(0, 5).map((c, i) => (
                  <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                    <span className="text-text-muted mt-0.5">•</span> {c}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Links */}
        <div className="bg-surface-1 rounded-2xl border border-surface-border p-5">
          <h2 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-3">More for {makeName} {modelName}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Link href={`/vehicles/${makeSlug}/${modelSlug}`} className="p-3 bg-surface-0 rounded-xl border border-surface-border hover:border-primary/30 transition-colors text-xs font-heading font-semibold text-text-primary text-center">All Repair Costs</Link>
            <Link href={`/obd/${obd.code.toLowerCase()}`} className="p-3 bg-surface-0 rounded-xl border border-surface-border hover:border-primary/30 transition-colors text-xs font-heading font-semibold text-text-primary text-center">All Vehicles for {obd.code}</Link>
            <Link href={`/recall-check?make=${encodeURIComponent(makeName)}&model=${encodeURIComponent(modelName)}&year=2020`} className="p-3 bg-surface-0 rounded-xl border border-surface-border hover:border-primary/30 transition-colors text-xs font-heading font-semibold text-text-primary text-center">Safety Recalls</Link>
            <Link href={`/quote-checker?make=${encodeURIComponent(makeName)}&model=${encodeURIComponent(modelName)}`} className="p-3 bg-surface-0 rounded-xl border border-surface-border hover:border-primary/30 transition-colors text-xs font-heading font-semibold text-text-primary text-center">Check a Quote</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
