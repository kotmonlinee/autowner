import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageFeedback from "@/components/PageFeedback";
import { unstable_cache } from "next/cache";
import { createServiceSupabase } from "@/lib/supabase-server";
import { resolveRepairSlug } from "@/lib/internal-linking";
import ShareButtons from "@/components/ShareButtons";
import { getVehicleImageUrl } from "@/lib/vehicle-images";
import { getRepairImageUrl } from "@/lib/repair-images";
import { getRelatedWarningLights } from "@/lib/repair-warning-lights";
import { absoluteSeoTitle, seoDescription, vehicleSubjectTitle } from "@/lib/seo";
import { DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_META } from "@/lib/constants";
import { Sparkles, ChevronRight, AlertTriangle, Wrench, DollarSign, ArrowRight, Hash, ListChecks } from "lucide-react";
import Breadcrumbs from "@/components/content/Breadcrumbs";
import PageHeader from "@/components/content/PageHeader";
import QuickVerdict from "@/components/content/QuickVerdict";
import ContentSection from "@/components/content/ContentSection";
import ContinueSolving from "@/components/content/ContinueSolving";
import FaqList from "@/components/content/FaqList";
import TrustDisclosure from "@/components/content/TrustDisclosure";

export const revalidate = 3888000;
export const dynamic = "force-static";

const SEVERITY_CONFIG: Record<string, { bg: string; text: string; border: string; label: string; icon: React.ReactNode }> = {
  critical: { bg: "bg-severity-critical-bg", text: "text-severity-critical", border: "border-severity-critical-border", label: "Critical — Stop Driving", icon: <AlertTriangle className="w-6 h-6" /> },
  high: { bg: "bg-orange-50 ", text: "text-orange-700 ", border: "border-orange-200 ", label: "Serious — Inspect Soon", icon: <AlertTriangle className="w-6 h-6" /> },
  medium: { bg: "bg-severity-caution-bg", text: "text-severity-caution", border: "border-severity-caution-border", label: "Moderate — Schedule Repair", icon: <AlertTriangle className="w-6 h-6" /> },
  low: { bg: "bg-severity-info-bg", text: "text-severity-info", border: "border-severity-info-border", label: "Low Concern", icon: <AlertTriangle className="w-6 h-6" /> },
};

function parseCostRange(costStr: string): { min: number; max: number } | null {
  const cleaned = costStr.replace(/[,]/g, "");
  // Range: $500-$1000, $500–$1,000, $500 to $1000, 500-1000
  let m = cleaned.match(/\$?(\d+)\s*(?:[–\-]|to)\s*\$?(\d+)/i);
  if (m) return { min: parseInt(m[1]), max: parseInt(m[2]) };
  // Single value: "Around $500", "Typically $800", "$500+"
  m = cleaned.match(/\$?(\d{3,})/);
  if (m) {
    const v = parseInt(m[1]);
    return { min: Math.round(v * 0.8), max: Math.round(v * 1.2) };
  }
  return null;
}

const LIKELIHOOD_CONFIG: Record<string, { bg: string; text: string; border: string; bar: string; label: string }> = {
  "most likely": { bg: "bg-red-50 ", text: "text-red-700 ", border: "border-red-200 ", bar: "border-l-red-500", label: "Most Likely" },
  "possible": { bg: "bg-amber-50 ", text: "text-amber-700 ", border: "border-amber-200 ", bar: "border-l-amber-400", label: "Possible" },
  "less common": { bg: "bg-surface-0 ", text: "text-text-muted", border: "border-surface-border", bar: "border-l-surface-border", label: "Less Common" },
};

const getDiagnosisBySlug = unstable_cache(async (slug: string) => {
  const supabase = await createServiceSupabase();
  const { data, error } = await supabase.from("diagnoses").select("*").eq("slug", slug).maybeSingle();
  // Never cache a transient failure as "diagnosis not found".
  if (error) throw new Error(error.message);
  return (data as unknown as import("@/lib/types").Diagnosis) || null;
}, ["diagnosis-by-slug-v2"], { revalidate: 2592000 });

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const diagnosis = await getDiagnosisBySlug(slug);
  if (!diagnosis) return { title: "Diagnosis Not Found", robots: { index: false, follow: false } };
  const d = diagnosis.diagnosis_json;
  const pageTitle = vehicleSubjectTitle(d.title, {
    make: diagnosis.vehicle_make,
    model: diagnosis.vehicle_model,
    year: diagnosis.vehicle_year,
  });
  return {
    title: absoluteSeoTitle(pageTitle),
    description: seoDescription(d.summary),
    alternates: { canonical: `https://www.autowner.com/symptom-checker/${slug}` },
    openGraph: { title: pageTitle, description: seoDescription(d.summary), type: "article", images: [DEFAULT_OG_IMAGE_META] },
    twitter: { card: "summary_large_image", title: pageTitle, description: seoDescription(d.summary), images: [DEFAULT_OG_IMAGE] },
  };
}

export default async function DiagnosisResultPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const diagnosis = await getDiagnosisBySlug(slug);
  if (!diagnosis) notFound();

  const d = diagnosis.diagnosis_json;
  const vehicle = diagnosis.vehicle_make ? `${diagnosis.vehicle_make} ${diagnosis.vehicle_model ?? ""} ${diagnosis.vehicle_year ?? ""}`.trim() : null;
  const pageTitle = vehicleSubjectTitle(d.title, {
    make: diagnosis.vehicle_make,
    model: diagnosis.vehicle_model,
    year: diagnosis.vehicle_year,
  });

  // Parallel: OBD codes + repair resolution
  const supabase = await createServiceSupabase();
  const obdPromise = d.possibleCodes?.length
    ? supabase.from("obd_codes").select("code, title").in("code", d.possibleCodes).order("code")
    : Promise.resolve(null);
  const diyPromise = d.matchedRepairSlugs?.length
    ? supabase.from("diy_difficulty").select("*").in("repair_slug", d.matchedRepairSlugs)
    : Promise.resolve(null);
  const costPromise = d.matchedRepairSlugs?.length
    ? supabase.from("repair_costs").select("repair_slug, avg_cost").in("repair_slug", d.matchedRepairSlugs)
    : Promise.resolve(null);

  const [obdResult, diyResult, costResult] = await Promise.all([obdPromise, diyPromise, costPromise]);

  const obdCodeDetails: { code: string; title: string }[] = [];
  if (obdResult?.data) {
    const detailMap = new Map((obdResult.data as any[]).map(r => [r.code, r.title]));
    for (const c of (d.possibleCodes || [])) obdCodeDetails.push({ code: c, title: detailMap.get(c) || "" });
  }
  const vehicleImage = vehicle ? getVehicleImageUrl(
    (diagnosis.vehicle_make ?? "").toLowerCase().replace(/\s+/g, "-"),
    (diagnosis.vehicle_model ?? "").toLowerCase().replace(/\s+/g, "-")
  ) : null;
  const sev = SEVERITY_CONFIG[d.severity] ?? SEVERITY_CONFIG.medium;
  const cost = parseCostRange(d.costEstimate ?? "");

  // Resolve repairs from AI-matched slugs
  interface ResolvedRepair {
    slug: string; name: string; repairSlug: string; image: string | null;
    diyLevel: number | null; diyLabel: string | null; diyFriendly: string | null;
    estTime: string | null; riskLevel: string | null; avgCost: number | null;
  }
  let resolvedRepairs: ResolvedRepair[] = [];
  if (d.matchedRepairSlugs?.length) {
    const costMap = new Map((costResult?.data ?? []).map((r: any) => [r.repair_slug, r.avg_cost]));
    for (const dbSlug of d.matchedRepairSlugs) {
      const diy = (diyResult?.data ?? []).find((r: any) => r.repair_slug === dbSlug) as any;
      if (!diy) continue;
      const urlSlug = dbSlug.replace(/_/g, "-");
      resolvedRepairs.push({
        slug: dbSlug, name: diy.repair_name, repairSlug: urlSlug,
        image: getRepairImageUrl(urlSlug),
        diyLevel: diy.difficulty_level, diyLabel: diy.difficulty_label,
        diyFriendly: diy.diy_friendly, estTime: diy.est_time, riskLevel: diy.risk_level,
        avgCost: costMap.get(dbSlug) ?? null,
      });
    }
  }

  // Parallel: related symptoms + cross-validation from knowledge graph
  const relatedSymptomsPromise = resolvedRepairs.length > 0
    ? (async () => {
        const slugs = resolvedRepairs.map(r => r.slug);
        const { data: causeData } = await supabase.from("symptom_causes").select("symptom_id").in("repair_slug", slugs);
        const sids = [...new Set((causeData ?? []).map((r: any) => r.symptom_id))];
        if (!sids.length) return [];
        const { data } = await supabase.from("symptoms").select("slug, name, category").in("id", sids).limit(5);
        return (data ?? []) as any[];
      })()
    : Promise.resolve([] as any[]);

  const crossValidatePromise = d.possibleCodes?.length && obdCodeDetails.length > 0
    ? (async () => {
        const existingSlugs = new Set(resolvedRepairs.map(r => r.slug));
        const { data: obdSx } = await supabase.from("symptom_obd_codes").select("symptom_id").in("obd_code", d.possibleCodes!);
        const sxIds = [...new Set((obdSx ?? []).map((r: any) => r.symptom_id))];
        if (!sxIds.length) return [];
        const { data: causes } = await supabase.from("symptom_causes").select("repair_slug").in("symptom_id", sxIds);
        const missing = [...new Set((causes ?? []).map((r: any) => r.repair_slug).filter(Boolean))].filter(s => !existingSlugs.has(s));
        if (!missing.length) return [];
        const { data: diy } = await supabase.from("diy_difficulty").select("*").in("repair_slug", missing);
        return (diy ?? []).map((r: any) => ({
          slug: r.repair_slug, name: r.repair_name, repairSlug: r.repair_slug.replace(/_/g, "-"),
          image: getRepairImageUrl(r.repair_slug.replace(/_/g, "-")),
          diyLevel: r.difficulty_level, diyLabel: r.difficulty_label, diyFriendly: r.diy_friendly,
          estTime: r.est_time, riskLevel: r.risk_level, avgCost: null,
        }));
      })()
    : Promise.resolve([] as any[]);

  const [relatedSymptoms, crossValidatedRepairs] = await Promise.all([relatedSymptomsPromise, crossValidatePromise]);
  resolvedRepairs.push(...crossValidatedRepairs);

  const browseRepairUrl = vehicle
    ? `/vehicles/${(diagnosis.vehicle_make ?? "").toLowerCase().replace(/\s+/g, "-")}/${(diagnosis.vehicle_model ?? "").toLowerCase().replace(/\s+/g, "-")}`
    : "/repair-cost";

  // Collect related warning lights from resolved repairs
  const relatedWarningLights: { slug: string; title: string }[] = [];
  if (resolvedRepairs.length > 0) {
    const seen = new Set<string>();
    for (const r of resolvedRepairs) {
      const lights = getRelatedWarningLights(r.repairSlug);
      for (const l of lights) {
        if (!seen.has(l.slug)) { seen.add(l.slug); relatedWarningLights.push(l); }
      }
    }
  }

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: pageTitle, description: d.summary, datePublished: diagnosis.created_at, dateModified: diagnosis.updated_at || diagnosis.created_at, publisher: { "@type": "Organization", name: "AutOwner" } }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://www.autowner.com/" }, { "@type": "ListItem", position: 2, name: "Symptom Checker", item: "https://www.autowner.com/symptom-checker" }, { "@type": "ListItem", position: 3, name: d.title }] }) }} />
      {d.faq && d.faq.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: d.faq.map((item: any) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) }) }} />}
      <main id="main-content" className="max-w-4xl mx-auto px-5 py-6 flex-1 w-full">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Symptom Checker", href: "/symptom-checker" },
            { label: d.title },
          ]}
        />

        <PageHeader
          eyebrow={vehicle ? "Vehicle-specific AI-assisted diagnosis" : "AI-assisted symptom diagnosis"}
          title={pageTitle}
          description={d.summary}
          aside={
            <div className="border border-surface-border bg-surface-1">
              {vehicle && vehicleImage && (
                <div className="aspect-[16/7] overflow-hidden bg-surface-2">
                  <img src={vehicleImage} alt={vehicle} className="h-full w-full object-cover" loading="lazy" />
                </div>
              )}
              <div className="p-4">
                <p className="text-[10px] font-heading font-bold uppercase tracking-[0.14em] text-text-muted">Reported vehicle</p>
                <p className="mt-1 font-display text-2xl font-semibold text-text-primary">{vehicle ?? "Vehicle not specified"}</p>
                {vehicle && (
                  <Link prefetch={false} href={browseRepairUrl} className="mt-4 flex items-center justify-between border-t border-surface-border pt-3 text-xs font-heading font-bold text-primary">
                    Open the complete vehicle record <span aria-hidden="true">→</span>
                  </Link>
                )}
              </div>
            </div>
          }
        />

        <QuickVerdict
          label="Assessment"
          title={sev.label}
          tone={d.severity === "critical" ? "critical" : d.severity === "high" || d.severity === "medium" ? "caution" : "safe"}
          facts={[
            { label: "Most likely", value: d.causes?.[0]?.description?.split(".")[0] ?? "Needs inspection" },
            { label: "Repair range", value: cost ? `$${cost.min.toLocaleString()}–$${cost.max.toLocaleString()}` : "Estimate only" },
            { label: "Best next step", value: d.causes?.[0]?.verification_steps?.[0] ?? d.whatToDo?.split(".")[0] ?? "Verify the cause" },
            { label: "Confirmed repairs", value: `${resolvedRepairs.length} matched` },
          ]}
        >
          <p>{d.whatToDo?.split(". ")[0] || "Use the cause-by-cause verification steps before authorizing any replacement."}</p>
        </QuickVerdict>

        {/* ── Possible Causes (with verification steps) ── */}
        {d.causes?.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-heading font-bold text-text-muted uppercase tracking-wider mb-3">Diagnosis Details</p>
            <h2 className="text-lg font-heading font-bold text-text-primary mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </span>
              Possible Causes
            </h2>
            <div className="space-y-3">
              {d.causes.map((c: any, i: number) => {
                const lc = LIKELIHOOD_CONFIG[c.likelihood] ?? LIKELIHOOD_CONFIG["possible"];
                const matchedRepair = c.repair_slug ? resolvedRepairs.find((r: any) => r.slug === c.repair_slug) : null;
                return (
                  <div key={i} className={`rounded-xl border overflow-hidden ${lc.bg} ${lc.border} border-l-4 ${lc.bar}`}>
                    <div className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <span className={`inline-flex items-center px-2.5 py-2 rounded-full text-[11px] font-bold border shrink-0 mt-0.5 ${lc.bg} ${lc.text} ${lc.border} font-heading`}>{lc.label}</span>
                        <p className="text-sm text-text-secondary leading-relaxed pt-0.5">{c.description}</p>
                      </div>
                      {c.verification_steps?.length > 0 && (
                        <div className="ml-2 pl-4 border-l-2 border-text-muted/20 space-y-2 mb-3">
                          <p className="text-xs font-heading font-bold text-text-primary uppercase tracking-wider">How to Verify</p>
                          {c.verification_steps.map((step: string, j: number) => (
                            <div key={j} className="flex gap-2.5 text-xs">
                              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-[10px] font-bold">{j + 1}</span>
                              <p className="text-text-secondary leading-relaxed pt-0.5">{step}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      {matchedRepair && (
                        <Link prefetch={false} href={`/repair-cost/${matchedRepair.repairSlug}`} className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-heading font-semibold hover:bg-primary/20 transition-colors">
                          <Wrench className="w-3.5 h-3.5" />
                          {matchedRepair.name} — View Repair Cost
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── What To Do Next ── */}
        {(d.whatToDo || d.costEstimate || resolvedRepairs.length > 0) && (
          <div className="mb-6 space-y-4">
            <p className="text-xs font-heading font-bold text-text-muted uppercase tracking-wider">What To Do Next</p>

            {d.whatToDo && (
              <div className="bg-surface-1 rounded-2xl border border-surface-border p-5">
                <h2 className="text-lg font-heading font-bold text-text-primary mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <ListChecks className="w-4 h-4" />
                  </span>
                  What You Should Do
                </h2>
                <div className="space-y-1">
                  {d.whatToDo.split(". ").filter(Boolean).map((step, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-xl hover:bg-surface-2 transition-colors">
                      <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-sm font-bold font-heading">{i + 1}</span>
                      <p className="text-sm text-text-secondary leading-relaxed pt-0.5">{step.endsWith(".") ? step : step + "."}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Try another diagnosis ── */}
            <div className="py-5 px-4 bg-surface-1 rounded-2xl border border-surface-border text-center">
              <p className="text-sm text-text-secondary font-heading font-medium mb-3">Not satisfied with this diagnosis?</p>
              <Link prefetch={false} href="/symptom-checker" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-glow hover:-translate-y-px transition-all font-heading shadow-sm shadow-primary/20">
                Try Another Diagnosis
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {resolvedRepairs.length > 0 && (
              <div className="bg-surface-1 rounded-2xl border border-surface-border p-5">
                <h2 className="text-lg font-heading font-bold text-text-primary mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Wrench className="w-4 h-4" />
                  </span>
                  Related Repairs
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {resolvedRepairs.map((r) => (
                    <Link prefetch={false} key={r.slug} href={`/repair-cost/${r.repairSlug}`} className="flex items-center gap-3 p-3 rounded-xl bg-surface-0 border border-surface-border hover:border-primary/30 hover:bg-primary/5 transition-all group">
                      <div className="w-12 h-10 rounded-lg overflow-hidden shrink-0 bg-surface-2 flex items-center justify-center">
                        {r.image ? (
                          <img src={r.image} alt={r.name} className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <Wrench className="w-5 h-5 text-text-muted" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-text-primary font-heading truncate block group-hover:text-primary transition-colors">{r.name}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          {r.diyLabel && (
                            <span className={`text-[10px] font-heading font-semibold px-1.5 py-0.5 rounded ${r.diyLevel && r.diyLevel <= 2 ? "bg-green-50 text-green-700  " : r.diyLevel === 3 ? "bg-amber-50 text-amber-700  " : "bg-red-50 text-red-700  "}`}>{r.diyLabel}</span>
                          )}
                          {r.estTime && <span className="text-[10px] text-text-muted font-heading">{r.estTime}</span>}
                          {r.avgCost && <span className="text-[10px] text-text-muted font-heading">~${Math.round(r.avgCost).toLocaleString()}</span>}
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-text-muted shrink-0 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-surface-border">
                  <Link prefetch={false} href={browseRepairUrl} className="inline-flex items-center gap-1.5 text-xs font-heading font-semibold text-primary hover:text-primary-glow transition-colors">
                    Browse all repair costs
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}

            {d.costEstimate && (
              <div className="bg-surface-1 rounded-2xl border border-surface-border p-5">
                <h2 className="text-lg font-heading font-bold text-text-primary mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                  </span>
                  Estimated Repair Cost
                </h2>
                <p className="text-sm text-text-secondary">{d.costEstimate}</p>
                {cost && <p className="text-xs text-text-muted mt-1">Typical range: ${cost.min.toLocaleString()} – ${cost.max.toLocaleString()}</p>}
              </div>
            )}

            {/* Quote Checker CTA */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1">
                  <h3 className="text-sm font-heading font-bold text-text-primary mb-0.5">Got a mechanic&apos;s quote? Check if it&apos;s fair</h3>
                  <p className="text-text-muted text-xs">Compare your quote against real repair cost data for your vehicle.</p>
                </div>
                <Link prefetch={false}
                  href={`/quote-checker?repair=${encodeURIComponent(resolvedRepairs[0]?.name || d.title)}${
                    vehicle ? `&make=${encodeURIComponent(diagnosis.vehicle_make || "")}&model=${encodeURIComponent(diagnosis.vehicle_model || "")}` : ""
                  }`}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold font-heading rounded-lg hover:bg-primary-glow hover:-translate-y-px transition-all duration-150 shadow-sm shadow-primary/20 shrink-0"
                >
                  Check your quote
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        )}

        {/* ── Related OBD Codes ── */}
        {(obdCodeDetails.length > 0 || relatedWarningLights.length > 0 || relatedSymptoms.length > 0) && (
          <ContinueSolving
            title="Investigate another angle"
            intro="A scanner code, dashboard warning, or related symptom can confirm or challenge this diagnosis."
            links={[
              ...obdCodeDetails.slice(0, 1).map((obd) => ({
                href: `/obd/${obd.code.toLowerCase()}`,
                label: `${obd.code}: ${obd.title}`,
                description: "Check the scanner code's driving risk, causes, and repair range.",
                meta: "related OBD code",
              })),
              ...relatedWarningLights.slice(0, 1).map((light) => ({
                href: `/warning-lights/${light.slug}`,
                label: light.title,
                description: "Understand what the dashboard warning means and how urgently to act.",
                meta: "dashboard warning",
              })),
              ...relatedSymptoms.slice(0, 2).map((symptom) => ({
                href: `/symptoms/${symptom.slug}`,
                label: symptom.name,
                description: "Compare the broader symptom, likely causes, and repair costs.",
                meta: "related symptom",
              })),
            ]}
          />
        )}

        {d.possibleCodes && d.possibleCodes.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-heading font-bold text-text-primary mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Hash className="w-4 h-4" />
              </span>
              Related OBD-II Codes
            </h2>
            <div className="space-y-2">
              {obdCodeDetails.map((obd) => (
                <Link prefetch={false} key={obd.code} href={`/obd/${obd.code.toLowerCase()}`} className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-surface-1 border border-surface-border border-l-4 border-l-primary/40 hover:border-primary/30 hover:border-l-primary hover:bg-primary/5 transition-all">
                  <span className="text-sm font-mono font-bold text-primary shrink-0">{obd.code}</span>
                  <span className="h-4 w-px bg-surface-border shrink-0" />
                  <span className="text-xs text-text-secondary truncate">{obd.title}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-text-muted ml-auto shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── Related Warning Lights ── */}
        {relatedWarningLights.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-heading font-bold text-text-primary mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </span>
              Related Dashboard Warning Lights
            </h2>
            <div className="space-y-2">
              {relatedWarningLights.slice(0, 6).map((light) => (
                <Link prefetch={false} key={light.slug} href={`/warning-lights/${light.slug}`}
                  className="group flex items-center gap-3 px-4 py-2.5 rounded-xl bg-surface-1 border border-surface-border hover:border-primary/30 hover:bg-primary/5 transition-all">
                  <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-surface-2">
                    <img src={`/warning-lights/${light.slug}.jpg`} alt={light.title} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <span className="text-sm font-heading font-semibold text-text-primary group-hover:text-primary transition-colors truncate flex-1 min-w-0">{light.title}</span>
                  <svg className="w-3.5 h-3.5 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width={14} height={14}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── Related Symptoms ── */}
        {relatedSymptoms.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-heading font-bold text-text-primary mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={16} height={16}><path d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
              </span>
              Related Symptoms
            </h2>
            <div className="space-y-2">
              {relatedSymptoms.map((s) => (
                <Link prefetch={false} key={s.slug} href={`/symptoms/${s.slug}`} className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-surface-1 border border-surface-border hover:border-primary/30 hover:bg-primary/5 transition-all group">
                  <span className="text-sm font-heading font-semibold text-text-primary group-hover:text-primary transition-colors truncate flex-1">{s.name}</span>
                  <svg className="w-4 h-4 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width={16} height={16}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── FAQ ── */}
        {d.faq && d.faq.length > 0 && (
          <ContentSection eyebrow="Before you act on the diagnosis" title="Diagnosis questions">
            <FaqList items={d.faq.map((item: any) => ({ question: item.question, answer: item.answer }))} />
          </ContentSection>
        )}

        {/* ── Share ── */}
        <div className="mb-6 p-5 bg-surface-1 rounded-2xl border border-surface-border">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={16} height={16}>
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" />
              </svg>
            </span>
            <div>
              <p className="text-sm font-heading font-semibold text-text-primary">Share this diagnosis</p>
              <p className="text-xs text-text-muted">Help others with similar symptoms</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-surface-border">
            <ShareButtons url={`https://www.autowner.com/symptom-checker/${slug}`} title={d.title} />
          </div>
        </div>

        {/* ── Disclaimer ── */}
        <TrustDisclosure title="AI-assisted, not confirmed">
          This diagnosis is a structured starting point, not a substitute for an in-person inspection. Verify the cause using the listed checks and consult a qualified mechanic when the symptom is safety-critical, intermittent, or difficult to reproduce.
        </TrustDisclosure>
        <PageFeedback />
      </main>
      <Footer />
    </div>
  );
}
