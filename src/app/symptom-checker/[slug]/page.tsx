import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createServiceSupabase } from "@/lib/supabase-server";
import { resolveRepairSlug } from "@/lib/internal-linking";
import ShareButtons from "@/components/ShareButtons";
import { getVehicleImageUrl } from "@/lib/vehicle-images";
import { getRepairImageUrl } from "@/lib/repair-images";
import { getRelatedWarningLights } from "@/lib/repair-warning-lights";
import { TriangleAlert, Sparkles, ChevronRight, AlertTriangle, Wrench, DollarSign, ArrowRight, Hash, ListChecks } from "lucide-react";

const SEVERITY_CONFIG: Record<string, { bg: string; text: string; border: string; label: string; icon: React.ReactNode }> = {
  critical: { bg: "bg-severity-critical-bg", text: "text-severity-critical", border: "border-severity-critical-border", label: "Critical — Stop Driving", icon: <AlertTriangle className="w-6 h-6" /> },
  high: { bg: "bg-orange-50 dark:bg-orange-950/30", text: "text-orange-700 dark:text-orange-400", border: "border-orange-200 dark:border-orange-800", label: "Serious — Inspect Soon", icon: <AlertTriangle className="w-6 h-6" /> },
  medium: { bg: "bg-severity-caution-bg", text: "text-severity-caution", border: "border-severity-caution-border", label: "Moderate — Schedule Repair", icon: <AlertTriangle className="w-6 h-6" /> },
  low: { bg: "bg-severity-info-bg", text: "text-severity-info", border: "border-severity-info-border", label: "Low Concern", icon: <AlertTriangle className="w-6 h-6" /> },
};

function parseCostRange(costStr: string): { min: number; max: number } | null {
  const match = costStr.match(/\$?([\d,]+)\s*[–-]\s*\$?([\d,]+)/);
  if (!match) return null;
  return { min: parseInt(match[1].replace(/,/g, "")), max: parseInt(match[2].replace(/,/g, "")) };
}

const LIKELIHOOD_CONFIG: Record<string, { bg: string; text: string; border: string; bar: string; label: string }> = {
  "most likely": { bg: "bg-red-50 dark:bg-red-950/20", text: "text-red-700 dark:text-red-400", border: "border-red-200 dark:border-red-800", bar: "border-l-red-500", label: "Most Likely" },
  "possible": { bg: "bg-amber-50 dark:bg-amber-950/20", text: "text-amber-700 dark:text-amber-400", border: "border-amber-200 dark:border-amber-800", bar: "border-l-amber-400", label: "Possible" },
  "less common": { bg: "bg-surface-0 dark:bg-surface-0", text: "text-text-muted", border: "border-surface-border", bar: "border-l-surface-border", label: "Less Common" },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createServiceSupabase();
  const { data } = await supabase.from("diagnoses").select("diagnosis_json").eq("slug", slug).maybeSingle();
  if (!data) return { title: "Diagnosis Not Found" };
  const d = (data as unknown as import("@/lib/types").Diagnosis).diagnosis_json;
  return { title: `${d.title} | AutOwner AI Diagnosis`, description: d.summary };
}

export default async function DiagnosisResultPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createServiceSupabase();
  const { data } = await supabase.from("diagnoses").select("*").eq("slug", slug).maybeSingle();
  if (!data) notFound();

  const diagnosis = data as unknown as import("@/lib/types").Diagnosis;
  const d = diagnosis.diagnosis_json;
  const vehicle = diagnosis.vehicle_make ? `${diagnosis.vehicle_make} ${diagnosis.vehicle_model ?? ""} ${diagnosis.vehicle_year ?? ""}`.trim() : null;
  const obdCodeDetails: { code: string; title: string }[] = [];
  if (d.possibleCodes?.length) {
    const { data: obdData } = await supabase.from("obd_codes")
      .select("code, title")
      .in("code", d.possibleCodes)
      .order("code");
    if (obdData) {
      const detailMap = new Map((obdData as unknown as { code: string; title: string }[]).map((r) => [r.code, r.title]));
      for (const c of d.possibleCodes) obdCodeDetails.push({ code: c, title: detailMap.get(c) || "" });
    }
  }
  const vehicleImage = vehicle ? getVehicleImageUrl(
    (diagnosis.vehicle_make ?? "").toLowerCase().replace(/\s+/g, "-"),
    (diagnosis.vehicle_model ?? "").toLowerCase().replace(/\s+/g, "-")
  ) : null;
  const sev = SEVERITY_CONFIG[d.severity] ?? SEVERITY_CONFIG.medium;
  const cost = parseCostRange(d.costEstimate ?? "");

  // Resolve repairs: AI-matched slugs (precise) → fallback to keyword matching
  interface ResolvedRepair {
    slug: string; name: string; repairSlug: string; image: string | null;
    diyLevel: number | null; diyLabel: string | null; diyFriendly: string | null;
    estTime: string | null; riskLevel: string | null; avgCost: number | null;
  }
  let resolvedRepairs: ResolvedRepair[] = [];
  if (d.matchedRepairSlugs?.length) {
    const [{ data: diyData }, { data: costData }] = await Promise.all([
      supabase.from("diy_difficulty").select("*").in("repair_slug", d.matchedRepairSlugs),
      supabase.from("repair_costs").select("repair_slug, avg_cost").in("repair_slug", d.matchedRepairSlugs),
    ]);
    const costMap = new Map((costData ?? []).map((r: any) => [r.repair_slug, r.avg_cost]));
    for (const dbSlug of d.matchedRepairSlugs) {
      const diy = (diyData ?? []).find((r: any) => r.repair_slug === dbSlug) as any;
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
  } else {
    // Fallback: keyword → slug mapping for legacy diagnoses
    // Try diy_difficulty.repair_name match first, then resolveRepairSlug
    const { data: allDiy } = await supabase.from("diy_difficulty").select("*");
    const allDiyList = (allDiy ?? []) as any[];
    const keywords = d.repairKeywords ?? [];
    for (const item of keywords) {
      const itemLower = item.toLowerCase();
      // Direct name match against diy_difficulty
      let match = allDiyList.find((r: any) => r.repair_name.toLowerCase().includes(itemLower) || itemLower.includes(r.repair_name.toLowerCase()));
      // Try resolveRepairSlug and convert to underscore format
      if (!match) {
        const slug = resolveRepairSlug(item);
        if (slug) {
          const dbSlug = slug.replace(/-/g, "_");
          match = allDiyList.find((r: any) => r.repair_slug === dbSlug);
        }
      }
      if (!match) continue;
      const urlSlug = match.repair_slug.replace(/_/g, "-");
      resolvedRepairs.push({
        slug: match.repair_slug, name: match.repair_name, repairSlug: urlSlug,
        image: getRepairImageUrl(urlSlug),
        diyLevel: match.difficulty_level, diyLabel: match.difficulty_label,
        diyFriendly: match.diy_friendly, estTime: match.est_time, riskLevel: match.risk_level,
        avgCost: null,
      });
    }
  }
  const browseRepairUrl = vehicle
    ? `/vehicles/${(diagnosis.vehicle_make ?? "").toLowerCase().replace(/\s+/g, "-")}/${(diagnosis.vehicle_model ?? "").toLowerCase().replace(/\s+/g, "-")}`
    : "/repair-cost";

  // Cross-validate: ensure OBD codes have matching repairs via knowledge graph
  if (d.possibleCodes?.length && obdCodeDetails.length > 0) {
    const existingSlugs = new Set(resolvedRepairs.map((r) => r.slug));
    // OBD codes → symptom_obd_codes → symptom_causes → repair_slugs
    const { data: obdSymptoms } = await supabase.from("symptom_obd_codes")
      .select("symptom_id").in("obd_code", d.possibleCodes);
    const symptomIds = [...new Set((obdSymptoms ?? []).map((r: any) => r.symptom_id))];
    if (symptomIds.length > 0) {
      const { data: obdCauses } = await supabase.from("symptom_causes")
        .select("repair_slug").in("symptom_id", symptomIds);
      const missingSlugs = [...new Set((obdCauses ?? []).map((r: any) => r.repair_slug).filter(Boolean))]
        .filter((s) => !existingSlugs.has(s));
      if (missingSlugs.length > 0) {
        const { data: missingDiy } = await supabase.from("diy_difficulty")
          .select("*").in("repair_slug", missingSlugs);
        for (const diy of (missingDiy ?? []) as any[]) {
          const urlSlug = diy.repair_slug.replace(/_/g, "-");
          resolvedRepairs.push({
            slug: diy.repair_slug, name: diy.repair_name, repairSlug: urlSlug,
            image: getRepairImageUrl(urlSlug),
            diyLevel: diy.difficulty_level, diyLabel: diy.difficulty_label,
            diyFriendly: diy.diy_friendly, estTime: diy.est_time, riskLevel: diy.risk_level,
            avgCost: null,
          });
        }
      }
    }
  }

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
      <main id="main-content" className="max-w-3xl mx-auto px-5 py-6 flex-1 w-full">
        <nav className="mb-4 flex items-center gap-2 text-sm text-text-muted font-heading" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <svg className="w-3 h-3 text-surface-border" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <Link href="/symptom-checker" className="hover:text-primary transition-colors">AI Diagnosis</Link>
          <svg className="w-3 h-3 text-surface-border" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
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

        {/* ── Possible Causes ── */}
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
                return (
                  <div key={i} className={`flex items-start gap-4 p-4 rounded-xl border ${lc.bg} ${lc.border} border-l-4 ${lc.bar}`}>
                    <span className={`inline-flex items-center px-2.5 py-2 rounded-full text-[11px] font-bold border shrink-0 mt-0.5 ${lc.bg} ${lc.text} ${lc.border} font-heading`}>{lc.label}</span>
                    <p className="text-sm text-text-secondary leading-relaxed">{c.description}</p>
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
                  <svg className="w-3.5 h-3.5 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── Share ── */}
        <div className="mb-6 p-5 bg-surface-1 rounded-2xl border border-surface-border">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

        {/* ── Try another diagnosis ── */}
        <div className="mb-6 py-6 px-5 bg-surface-1 rounded-2xl border border-surface-border text-center">
          <p className="text-sm text-text-secondary font-heading font-medium mb-3">Not satisfied with this diagnosis?</p>
          <Link href="/symptom-checker" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-glow hover:-translate-y-px transition-all font-heading shadow-sm shadow-primary/20">
            Try Another Diagnosis
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* ── Disclaimer ── */}
        <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800 flex items-start gap-3">
          <TriangleAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
            <span className="font-semibold">Disclaimer:</span> This AI-generated diagnosis is for informational reference only. Always consult a qualified mechanic for an in-person inspection. AutOwner is not responsible for decisions made based on this information.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
