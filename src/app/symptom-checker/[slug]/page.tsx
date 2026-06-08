import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createServiceSupabase } from "@/lib/supabase-server";
import { resolveRepairSlug } from "@/lib/internal-linking";
import ShareButtons from "@/components/ShareButtons";
import { TriangleAlert, Sparkles, CircleAlert, Gauge } from "lucide-react";

const SEVERITY_CONFIG: Record<string, { bg: string; text: string; border: string; label: string }> = {
  critical: { bg: "bg-red-50 dark:bg-red-950/30", text: "text-red-700 dark:text-red-400", border: "border-red-200 dark:border-red-800", label: "Critical — Stop Driving" },
  high: { bg: "bg-orange-50 dark:bg-orange-950/30", text: "text-orange-700 dark:text-orange-400", border: "border-orange-200 dark:border-orange-800", label: "Serious — Inspect Soon" },
  medium: { bg: "bg-amber-50 dark:bg-amber-950/30", text: "text-amber-700 dark:text-amber-400", border: "border-amber-200 dark:border-amber-800", label: "Moderate — Schedule Repair" },
  low: { bg: "bg-emerald-50 dark:bg-emerald-950/30", text: "text-emerald-700 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-800", label: "Low Concern" },
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
  const sev = SEVERITY_CONFIG[d.severity] ?? SEVERITY_CONFIG.medium;

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <Navbar />
      <main id="main-content" className="max-w-4xl mx-auto px-5 py-6 flex-1 w-full">
        <nav className="mb-4 text-sm text-text-muted font-heading">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link> / <Link href="/symptom-checker" className="hover:text-primary transition-colors">AI Diagnosis</Link> / <span className="text-text-secondary">Result</span>
        </nav>

        {vehicle && <p className="text-xs text-text-muted font-heading mb-2">{vehicle}</p>}

        <div className={`${sev.bg} rounded-2xl border ${sev.border} p-5 mb-6`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${sev.bg} border ${sev.border} flex items-center justify-center shrink-0`}><TriangleAlert className={`w-6 h-6 ${sev.text}`} /></div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2"><h1 className="text-xl font-heading font-bold text-text-primary">{d.title}</h1><Sparkles className="w-4 h-4 text-primary shrink-0"/></div>
              <p className="text-sm text-text-secondary mt-1">{d.summary}</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${sev.border} ${sev.text} font-heading mt-2`}>{sev.label}</span>
            </div>
          </div>
        </div>

        {d.causes?.length > 0 && (
          <div className="bg-surface-1 rounded-2xl border border-surface-border p-5 mb-4">
            <h2 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-3">Possible Causes</h2>
            <div className="space-y-3">
              {d.causes.map((c: any, i: number) => {
                const badge = c.likelihood === "most likely" ? "bg-red-50 text-red-700 border-red-200" : c.likelihood === "possible" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-surface-0 text-text-muted border-surface-border";
                return <div key={i} className="flex items-start gap-3 p-3 bg-surface-0 rounded-xl border border-surface-border"><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 mt-0.5 ${badge} font-heading`}>{c.likelihood}</span><p className="text-sm text-text-secondary leading-relaxed">{c.description}</p></div>;
              })}
            </div>
          </div>
        )}

        {d.whatToDo && (
          <div className="bg-surface-1 rounded-2xl border border-surface-border p-5 mb-4">
            <h2 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-2">What You Should Do</h2>
            <p className="text-sm text-text-secondary leading-relaxed">{d.whatToDo}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {d.costEstimate && (
            <div className="bg-surface-1 rounded-2xl border border-surface-border p-5">
              <h2 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-2">Estimated Repair Cost</h2>
              <p className="text-2xl font-heading font-bold text-text-primary">{d.costEstimate}</p>
            </div>
          )}
          {d.possibleCodes && d.possibleCodes.length > 0 && (
            <div className="bg-surface-1 rounded-2xl border border-surface-border p-5">
              <h2 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-2">Related OBD-II Codes</h2>
              <div className="flex flex-wrap gap-2">
                {d.possibleCodes.map((c: string) => <Link key={c} href={`/obd/${c.toLowerCase()}`} className="inline-flex items-center px-3 py-1.5 rounded-lg bg-surface-0 border border-surface-border text-sm font-mono font-bold text-primary hover:border-primary/30 hover:bg-primary/5 transition-colors">{c}</Link>)}
              </div>
            </div>
          )}
        </div>

        {d.repairKeywords && d.repairKeywords.length > 0 && (
          <div className="bg-surface-1 rounded-2xl border border-surface-border p-5 mb-4">
            <h2 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-3">Related Repairs</h2>
            <div className="space-y-2">
              {d.repairKeywords.map((item: string) => {
                  const slug = resolveRepairSlug(item);
                  if (!slug) return null;
                  return <Link key={item} href={`/repair-cost/${slug}`} className="flex items-center justify-between p-3 bg-surface-0 rounded-xl border border-surface-border hover:border-primary/30 hover:bg-primary/5 transition-colors group"><span className="text-sm font-medium text-text-primary font-heading group-hover:text-primary transition-colors">{item}</span><span className="text-xs text-text-muted font-heading">View estimate →</span></Link>;
                })}
            </div>
          </div>
        )}

        <div className="bg-amber-50/30 dark:bg-amber-950/10 rounded-xl border border-amber-200 dark:border-amber-800 p-4 mb-6">
          <div className="flex items-start gap-3"><TriangleAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" /><div><p className="text-xs font-heading font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-1">Disclaimer</p><p className="text-xs text-text-secondary leading-relaxed">This AI-generated diagnosis is for informational reference only. Always consult a qualified mechanic for an in-person inspection. AutOwner is not responsible for decisions made based on this information.</p></div></div>
        </div>

        <div className="mb-6 p-4 bg-surface-0 rounded-xl border border-surface-border">
          <h3 className="text-sm font-semibold text-text-primary mb-3 font-heading">Share this diagnosis</h3>
          <ShareButtons url={`https://www.autowner.com/symptom-checker/${slug}`} title={d.title} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link href="/repair-cost" className="flex flex-col items-center gap-2 p-4 bg-surface-1 rounded-xl border border-surface-border hover:border-primary/30 hover:shadow-sm transition-all group"><CircleAlert className="w-5 h-5 text-primary"/><span className="text-xs font-heading font-semibold text-text-primary group-hover:text-primary transition-colors">Browse Repair Costs</span></Link>
          <Link href="/recall-check" className="flex flex-col items-center gap-2 p-4 bg-surface-1 rounded-xl border border-surface-border hover:border-primary/30 hover:shadow-sm transition-all group"><TriangleAlert className="w-5 h-5 text-primary"/><span className="text-xs font-heading font-semibold text-text-primary group-hover:text-primary transition-colors">Check Safety Recalls</span></Link>
          <Link href="/quote-checker" className="flex flex-col items-center gap-2 p-4 bg-surface-1 rounded-xl border border-surface-border hover:border-primary/30 hover:shadow-sm transition-all group"><Gauge className="w-5 h-5 text-primary"/><span className="text-xs font-heading font-semibold text-text-primary group-hover:text-primary transition-colors">Verify a Mechanic Quote</span></Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
