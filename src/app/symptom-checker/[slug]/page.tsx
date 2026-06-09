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
  const validRepairs = (d.repairKeywords ?? []).filter((item) => resolveRepairSlug(item));
  const browseRepairUrl = vehicle
    ? `/vehicles/${(diagnosis.vehicle_make ?? "").toLowerCase().replace(/\s+/g, "-")}/${(diagnosis.vehicle_model ?? "").toLowerCase().replace(/\s+/g, "-")}`
    : "/repair-cost";

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <Navbar />
      <main id="main-content" className="max-w-3xl mx-auto px-5 py-6 flex-1 w-full">
        <nav className="mb-4 text-sm text-text-muted font-heading">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>{" "}/{" "}
          <Link href="/symptom-checker" className="hover:text-primary transition-colors">AI Diagnosis</Link>{" "}/{" "}
          <span className="text-text-secondary">Result</span>
        </nav>

        {vehicle && (
          <div className="flex items-center gap-3 mb-4">
            {vehicleImage && (
              <div className="w-14 h-10 rounded-lg overflow-hidden shrink-0 bg-surface-2 border border-surface-border">
                <img src={vehicleImage} alt={vehicle} className="w-full h-full object-cover" />
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
          <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold border-2 ${sev.border} ${sev.text} font-heading`}>
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
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border shrink-0 mt-0.5 ${lc.bg} ${lc.text} ${lc.border} font-heading`}>{lc.label}</span>
                    <p className="text-sm text-text-secondary leading-relaxed">{c.description}</p>
                  </div>
                );
              })}
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

        {/* ── Divider: Try another diagnosis ── */}
        <div className="my-8 py-6 px-5 bg-surface-1 rounded-2xl border border-surface-border text-center">
          <p className="text-sm text-text-secondary font-heading font-medium mb-3">Not satisfied with this diagnosis?</p>
          <Link href="/symptom-checker" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-glow hover:-translate-y-px transition-all font-heading shadow-sm shadow-primary/20">
            Try Another Diagnosis
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* ── What To Do Next ── */}
        {(d.whatToDo || d.costEstimate || validRepairs.length > 0) && (
          <div className="mb-6">
            <p className="text-xs font-heading font-bold text-text-muted uppercase tracking-wider mb-4">What To Do Next</p>

            {d.whatToDo && (
              <div className="mb-4">
                <h2 className="text-lg font-heading font-bold text-text-primary mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <ListChecks className="w-4 h-4" />
                  </span>
                  What You Should Do
                </h2>
                <div className="space-y-1">
                  {d.whatToDo.split(". ").filter(Boolean).map((step, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-xl hover:bg-surface-1 transition-colors">
                      <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-sm font-bold font-heading">{i + 1}</span>
                      <p className="text-sm text-text-secondary leading-relaxed pt-0.5">{step.endsWith(".") ? step : step + "."}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {validRepairs.length > 0 && (
              <div className="mb-4">
                <h2 className="text-lg font-heading font-bold text-text-primary mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Wrench className="w-4 h-4" />
                  </span>
                  Related Repairs
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {validRepairs.map((item: string) => {
                    const repairSlug = resolveRepairSlug(item);
                    const img = repairSlug ? getRepairImageUrl(repairSlug) : null;
                    return (
                      <Link key={item} href={`/repair-cost/${repairSlug}`} className="flex items-center gap-3 p-2 rounded-xl bg-surface-0 border border-surface-border hover:border-primary/30 hover:bg-primary/5 transition-all">
                        <div className="w-12 h-10 rounded-lg overflow-hidden shrink-0 bg-surface-2">
                          {img && <img src={img} alt={item} className="w-full h-full object-cover" />}
                        </div>
                        <span className="text-sm font-medium text-text-primary font-heading truncate">{item}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-text-muted shrink-0 ml-auto" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {d.costEstimate && (
              <div>
                <h2 className="text-lg font-heading font-bold text-text-primary mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                  </span>
                  Estimated Repair Cost
                </h2>
                <p className="text-sm text-text-secondary">{d.costEstimate}</p>
                {cost && <p className="text-xs text-text-muted mt-1">Typical range: ${cost.min.toLocaleString()} – ${cost.max.toLocaleString()}</p>}
                <div className="mt-4 pt-4 border-t border-surface-border">
                  <Link href={browseRepairUrl} className="inline-flex items-center gap-1.5 text-sm font-heading font-semibold text-primary hover:text-primary-glow transition-colors">
                    Browse All Repair Costs
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

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
