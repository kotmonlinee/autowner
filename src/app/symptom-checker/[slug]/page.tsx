import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageFeedback from "@/components/PageFeedback";
import { cache } from "react";
import { createServiceSupabase } from "@/lib/supabase-server";
import { resolveRepairSlug } from "@/lib/internal-linking";
import ShareButtons from "@/components/ShareButtons";
import { getVehicleImageUrl } from "@/lib/vehicle-images";
import { getRepairImageUrl } from "@/lib/repair-images";
import { getRelatedWarningLights } from "@/lib/repair-warning-lights";
import { TriangleAlert, Sparkles, ChevronRight, AlertTriangle, Wrench, DollarSign, ArrowRight, Hash, ListChecks } from "lucide-react";

export const revalidate = 604800;

export async function generateStaticParams() {
  const supabase = await createServiceSupabase();
  const { data } = await supabase
    .from("diagnoses")
    .select("slug")
    .order("view_count", { ascending: false })
    .limit(500);
  return ((data ?? []) as { slug: string }[]).map((d) => ({ slug: d.slug }));
}

const SEVERITY_CONFIG: Record<string, { bg: string; text: string; border: string; label: string; icon: React.ReactNode }> = {
  critical: { bg: "bg-severity-critical-bg", text: "text-severity-critical", border: "border-severity-critical-border", label: "Critical — Stop Driving", icon: <AlertTriangle className="w-6 h-6" /> },
  high: { bg: "bg-orange-50 dark:bg-orange-950/30", text: "text-orange-700 dark:text-orange-400", border: "border-orange-200 dark:border-orange-800", label: "Serious — Inspect Soon", icon: <AlertTriangle className="w-6 h-6" /> },
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
  "most likely": { bg: "bg-red-50 dark:bg-red-950/20", text: "text-red-700 dark:text-red-400", border: "border-red-200 dark:border-red-800", bar: "border-l-red-500", label: "Most Likely" },
  "possible": { bg: "bg-amber-50 dark:bg-amber-950/20", text: "text-amber-700 dark:text-amber-400", border: "border-amber-200 dark:border-amber-800", bar: "border-l-amber-400", label: "Possible" },
  "less common": { bg: "bg-surface-0 dark:bg-surface-0", text: "text-text-muted", border: "border-surface-border", bar: "border-l-surface-border", label: "Less Common" },
};

const getDiagnosisBySlug = cache(async (slug: string) => {
  const supabase = await createServiceSupabase();
  const { data } = await supabase.from("diagnoses").select("*").eq("slug", slug).maybeSingle();
  return (data as unknown as import("@/lib/types").Diagnosis) || null;
});

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const diagnosis = await getDiagnosisBySlug(slug);
  if (!diagnosis) return { title: "Diagnosis Not Found" };
  const d = diagnosis.diagnosis_json;
  return {
    title: `${d.title} | AutOwner AI Diagnosis`,
    description: d.summary,
    alternates: { canonical: `https://www.autowner.com/symptom-checker/${slug}` },
    openGraph: { title: d.title, description: d.summary, type: "article" },
    twitter: { card: "summary_large_image", title: d.title, description: d.summary },
  };
}

export default async function DiagnosisResultPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const diagnosis = await getDiagnosisBySlug(slug);
  if (!diagnosis) notFound();

  const d = diagnosis.diagnosis_json;
  const vehicle = diagnosis.vehicle_make ? `${diagnosis.vehicle_make} ${diagnosis.vehicle_model ?? ""} ${diagnosis.vehicle_year ?? ""}`.trim() : null;

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: d.title, description: d.summary, datePublished: diagnosis.created_at, dateModified: diagnosis.updated_at || diagnosis.created_at, publisher: { "@type": "Organization", name: "AutOwner" } }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://www.autowner.com/" }, { "@type": "ListItem", position: 2, name: "AI Diagnosis", item: "https://www.autowner.com/symptom-checker" }, { "@type": "ListItem", position: 3, name: d.title }] }) }} />
      {d.faq && d.faq.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: d.faq.map((item: any) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) }) }} />}
      <main id="main-content" className="max-w-4xl mx-auto px-5 py-6 flex-1 w-full">
        <nav className="mb-4 flex items-center gap-2 text-sm text-text-muted font-heading whitespace-nowrap overflow-x-auto" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition-colors shrink-0">Home</Link>
          <svg className="w-3 h-3 text-surface-border shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" width={12} height={12}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <Link href="/symptom-checker" className="hover:text-primary transition-colors shrink-0">AI Diagnosis</Link>
          <svg className="w-3 h-3 text-surface-border shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" width={12} height={12}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span className="text-text-secondary truncate">{d.title}</span>
        </nav>

        {vehicle && (
          <div className="flex items-center gap-3 mb-4">
            {vehicleImage && (
              <div className="w-14 h-10 rounded-lg overflow-hidden shrink-0 bg-surface-2 border border-surface-border">
                <img src={vehicleImage} alt={vehicle} className="w-full h-full object-cover" loading="lazy" />
              </div>
            )}
            <span className="text-xs text-text-muted font-heading">{vehicle}</span>
            <Link
              href={`/vehicles/${(diagnosis.vehicle_make ?? "").toLowerCase().replace(/\s+/g, "-")}/${(diagnosis.vehicle_model ?? "").toLowerCase().replace(/\s+/g, "-")}`}
              className="text-xs font-heading font-semibold text-primary hover:text-primary-glow transition-colors ml-auto shrink-0"
            >
              All {diagnosis.vehicle_make} {diagnosis.vehicle_model} issues →
            </Link>
          </div>
        )}

        {/* ── Hero: Severity-first header ── */}
        <div className={`${sev.bg} rounded-2xl border-2 ${sev.border} p-6 mb-6`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-14 h-14 rounded-2xl ${sev.bg} border-2 ${sev.border} flex items-center justify-center shrink-0 ${sev.text}`}>
              {sev.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-heading font-bold text-text-primary">{d.title}</h1>
                <Sparkles className="w-5 h-5 text-primary shrink-0" />
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">{d.summary}</p>
            </div>
          </div>
          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border-2 ${sev.border} ${sev.text} font-heading`}>
            <span className={`w-2 h-2 rounded-full ${sev.text} bg-current`} />
            {sev.label}
          </span>
        </div>

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
                        <Link href={`/repair-cost/${matchedRepair.repairSlug}`} className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-heading font-semibold hover:bg-primary/20 transition-colors">
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
              <Link href="/symptom-checker" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-glow hover:-translate-y-px transition-all font-heading shadow-sm shadow-primary/20">
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
                    <Link key={r.slug} href={`/repair-cost/${r.repairSlug}`} className="flex items-center gap-3 p-3 rounded-xl bg-surface-0 border border-surface-border hover:border-primary/30 hover:bg-primary/5 transition-all group">
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
                            <span className={`text-[10px] font-heading font-semibold px-1.5 py-0.5 rounded ${r.diyLevel && r.diyLevel <= 2 ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400" : r.diyLevel === 3 ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400" : "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"}`}>{r.diyLabel}</span>
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
                  <Link href={browseRepairUrl} className="inline-flex items-center gap-1.5 text-xs font-heading font-semibold text-primary hover:text-primary-glow transition-colors">
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
                <Link
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
                <Link key={obd.code} href={`/obd/${obd.code.toLowerCase()}`} className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-surface-1 border border-surface-border border-l-4 border-l-primary/40 hover:border-primary/30 hover:border-l-primary hover:bg-primary/5 transition-all">
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
                <Link key={light.slug} href={`/warning-lights/${light.slug}`}
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
                <Link key={s.slug} href={`/symptoms/${s.slug}`} className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-surface-1 border border-surface-border hover:border-primary/30 hover:bg-primary/5 transition-all group">
                  <span className="text-sm font-heading font-semibold text-text-primary group-hover:text-primary transition-colors truncate flex-1">{s.name}</span>
                  <svg className="w-4 h-4 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width={16} height={16}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── FAQ ── */}
        {d.faq && d.faq.length > 0 && (
          <div className="mb-6 bg-surface-1 rounded-2xl border border-surface-border p-5">
            <h2 className="text-lg font-heading font-bold text-text-primary mb-4">Frequently Asked Questions</h2>
            <div className="space-y-2">
              {d.faq.map((item: any, i: number) => (
                <details key={i} className="group bg-surface-0 rounded-xl border border-surface-border">
                  <summary className="flex items-center gap-2 cursor-pointer list-none px-4 py-3 min-h-[44px] font-heading font-semibold text-sm text-text-primary hover:text-primary transition-colors">
                    <svg className="w-4 h-4 shrink-0 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}><polyline points="9 18 15 12 9 6" /></svg>
                    {item.question}
                  </summary>
                  <p className="px-4 pb-4 ml-6 text-sm text-text-secondary leading-relaxed">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
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
        <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800 flex items-start gap-3">
          <TriangleAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
            <span className="font-semibold">Disclaimer:</span> This AI-generated diagnosis is for informational reference only. Always consult a qualified mechanic for an in-person inspection. AutOwner is not responsible for decisions made based on this information.
          </p>
        </div>
        <PageFeedback />
      </main>
      <Footer />
    </div>
  );
}
