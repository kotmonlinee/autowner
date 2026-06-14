import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createServiceSupabase } from "@/lib/supabase-server";

export const revalidate = 86400;

const CATEGORY_LABELS: Record<string, string> = {
  starting: "Starting Problems", vibration: "Vibration", performance: "Performance",
  warning_lights: "Warning Lights", temperature: "Temperature", noise: "Noise",
  smells: "Smells", smoke: "Smoke", leaks: "Leaks", brakes: "Brakes",
  steering: "Steering", electrical: "Electrical", hvac: "HVAC", transmission: "Transmission",
};

const SEVERITY_COLORS: Record<string, string> = {
  low: "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
  medium: "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  high: "bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800",
  critical: "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
};

const DRIVING_LABELS: Record<string, string> = {
  safe: "Safe to Drive", limited: "Limited Driving", unsafe: "Do Not Drive",
};

const DRIVING_COLORS: Record<string, string> = {
  safe: "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  limited: "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  unsafe: "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
};

function formatMoney(n: number): string { return `$${n.toLocaleString()}`; }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createServiceSupabase();
  const { data } = await supabase.from("symptoms").select("name").eq("slug", slug).maybeSingle();
  if (!data) return { title: "Symptom Not Found" };
  const s = data as any;
  return {
    title: `${s.name}: Causes, Repair Cost & Is It Safe To Drive?`,
    description: `Learn the most common causes of ${s.name.toLowerCase()}, expected repair costs, diagnosis steps, and whether it is safe to continue driving.`,
    alternates: { canonical: `https://www.autowner.com/symptoms/${slug}` },
  };
}

export default async function SymptomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createServiceSupabase();
  const { data: symptom } = await supabase.from("symptoms").select("*").eq("slug", slug).maybeSingle();
  if (!symptom) notFound();

  const s = symptom as any;

  // Fetch causes
  const { data: causes } = await supabase.from("symptom_causes")
    .select("*")
    .eq("symptom_id", s.id)
    .order("probability", { ascending: false });

  const causeList = (causes ?? []) as any[];

  // Deduplicate causes by name
  const seen = new Set<string>();
  const causesWithCosts: any[] = [];
  for (const c of causeList) {
    if (!seen.has(c.cause_name)) { seen.add(c.cause_name); causesWithCosts.push(c); }
  }

  // Fetch repair costs for causes that link to a repair
  const linkedSlugs = [...new Set(causesWithCosts.filter((c) => c.repair_slug).map((c: any) => c.repair_slug))];
  const costMap = new Map<string, { min: number; max: number }>();
  if (linkedSlugs.length > 0) {
    const dbSlugs = linkedSlugs.map((s) => s.replace(/-/g, "_"));
    const { data: costs } = await supabase.from("repair_costs")
      .select("repair_slug, min_cost, max_cost")
      .in("repair_slug", [...linkedSlugs, ...dbSlugs]);
    for (const rc of (costs ?? []) as any[]) {
      const key = rc.repair_slug;
      if (!costMap.has(key) || rc.min_cost < costMap.get(key)!.min) {
        costMap.set(key, { min: rc.min_cost, max: rc.max_cost });
      }
    }
  }

  // Attach costs to causes
  const causesWithPrices = causesWithCosts.map((c) => {
    const cost = c.repair_slug ? costMap.get(c.repair_slug) ?? costMap.get(c.repair_slug.replace(/-/g, "_")) : null;
    return { ...c, repair_cost_min: cost?.min ?? null, repair_cost_max: cost?.max ?? null };
  });

  // Compute overall cost range
  const costsWithData = causesWithPrices.filter((c) => c.repair_cost_min != null);
  const costMin = costsWithData.length > 0 ? Math.min(...costsWithData.map((c) => c.repair_cost_min!)) : null;
  const costMax = costsWithData.length > 0 ? Math.max(...costsWithData.map((c) => c.repair_cost_max!)) : null;

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-5 py-8 w-full">
        {/* Breadcrumb */}
        <nav className="mb-4 flex items-center gap-2 text-sm text-text-muted font-heading" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <svg className="w-3 h-3 text-surface-border" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span className="text-text-secondary">{s.name}</span>
        </nav>

        {/* Hero */}
        <div className="bg-surface-1 rounded-2xl border border-surface-border p-5 sm:p-8 mb-6">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary mb-3">{s.name}</h1>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold font-heading border ${SEVERITY_COLORS[s.severity]}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${s.severity === "critical" ? "bg-red-500" : s.severity === "high" ? "bg-orange-500" : s.severity === "medium" ? "bg-amber-500" : "bg-emerald-500"}`} />
                  {s.severity.charAt(0).toUpperCase() + s.severity.slice(1)} Severity
                </span>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold font-heading border ${DRIVING_COLORS[s.driving_risk]}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${s.driving_risk === "unsafe" ? "bg-red-500" : s.driving_risk === "limited" ? "bg-amber-500" : "bg-emerald-500"}`} />
                  {DRIVING_LABELS[s.driving_risk]}
                </span>
              </div>
            </div>
            {costMin != null && costMax != null && (
              <div className="text-right">
                <p className="text-xs text-text-muted font-heading uppercase tracking-wider">Typical Repair Cost</p>
                <p className="text-2xl font-heading font-bold text-text-primary">{formatMoney(costMin!)} – {formatMoney(costMax!)}</p>
                <p className="text-[10px] text-text-muted">varies by cause — see breakdown below</p>
              </div>
            )}
          </div>
          <Link href={`/symptom-checker`} className="inline-flex items-center gap-1.5 text-sm font-heading font-semibold text-primary hover:text-primary-glow transition-colors">
            Describe YOUR exact symptoms for a personalized diagnosis →
          </Link>
        </div>

        {/* Most Common Causes */}
        <div className="bg-surface-1 rounded-2xl border border-surface-border p-5 sm:p-6 mb-6">
          <h2 className="text-lg font-heading font-bold text-text-primary mb-4">Most Common Causes</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-border">
                  <th className="text-left py-2 px-3 text-xs font-heading font-bold text-text-muted uppercase tracking-wider">Cause</th>
                  <th className="text-center py-2 px-3 text-xs font-heading font-bold text-text-muted uppercase tracking-wider hidden sm:table-cell">Probability</th>
                  <th className="text-center py-2 px-3 text-xs font-heading font-bold text-text-muted uppercase tracking-wider hidden sm:table-cell">Severity</th>
                  <th className="text-right py-2 px-3 text-xs font-heading font-bold text-text-muted uppercase tracking-wider">Repair Cost</th>
                  <th className="w-8"></th>
                </tr>
              </thead>
              <tbody>
                {causesWithPrices.map((c, i) => {
                  const costMin = c.repair_cost_min;
                  const costMax = c.repair_cost_max;
                  const repairSlug = c.repair_slug;
                  return (
                    <tr key={i} className="border-b border-surface-border last:border-0 hover:bg-surface-0/50 transition-colors">
                      <td className="py-2.5 px-3">
                        {repairSlug ? (
                          <Link href={`/repair-cost/${repairSlug.replace(/_/g, "-")}`} className="text-sm font-heading font-medium text-primary hover:text-primary-glow transition-colors">{c.cause_name}</Link>
                        ) : (
                          <span className="text-sm font-heading font-medium text-text-primary">{c.cause_name}</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center hidden sm:table-cell">
                        <div className="flex items-center justify-center gap-1.5">
                          <div className="w-12 h-1.5 bg-surface-3 rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${c.probability}%` }} />
                          </div>
                          <span className="text-xs font-heading text-text-secondary">{c.probability}%</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-center hidden sm:table-cell">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold font-heading ${c.severity === "critical" ? "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400" : c.severity === "high" ? "bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-400" : "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400"}`}>{c.severity}</span>
                      </td>
                      <td className="py-2.5 px-3 text-right text-sm font-heading">
                        {costMin != null ? (
                          <span className="font-bold text-text-primary">{formatMoney(costMin)} – {formatMoney(costMax)}</span>
                        ) : (
                          <span className="text-text-muted">—</span>
                        )}
                      </td>
                      <td className="py-2.5 px-1">
                        {repairSlug && <svg className="w-3.5 h-3.5 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 sm:p-6 text-center mb-6">
          <h2 className="text-lg font-heading font-bold text-text-primary mb-2">Not Sure This Is Your Issue?</h2>
          <p className="text-sm text-text-secondary mb-4">Describe your exact symptoms to our AI. It'll identify possible causes, OBD codes, and repair costs in seconds.</p>
          <Link href="/symptom-checker" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-glow transition-all font-heading shadow-sm shadow-primary/20">
            Diagnose Your Symptoms
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </Link>
        </div>

        {/* FAQ */}
        <div className="bg-surface-1 rounded-2xl border border-surface-border p-5 sm:p-6 mb-4">
          <h2 className="text-lg font-heading font-bold text-text-primary mb-4">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {[
              { q: `What causes ${s.name.toLowerCase()}?`, a: `The most common causes include ${causesWithPrices.slice(0, 3).map((c: any) => (c.cause_name as string).toLowerCase()).join(", ")}. A proper diagnosis is recommended to pinpoint the exact cause and avoid replacing the wrong part.` },
              { q: `How much does it cost to fix ${s.name.toLowerCase()}?`, a: costMin != null && costMax != null ? `Repair costs typically range from ${formatMoney(costMin)} to ${formatMoney(costMax)}, depending on the underlying cause. The final price depends on your vehicle make and model, labor rates in your area, and whether OEM or aftermarket parts are used.` : `Costs vary widely depending on the cause. Get a professional diagnosis first — replacing the wrong part wastes money.` },
              { q: `Is it safe to drive with ${s.name.toLowerCase()}?`, a: s.driving_risk === "unsafe" ? "No. This symptom indicates a serious issue that could cause further damage or create a safety hazard. Have the vehicle towed to a repair shop." : s.driving_risk === "limited" ? "Limited driving only. You can drive short distances to a repair shop, but avoid highway speeds and hard driving. Continuing to drive may worsen the problem and increase repair costs." : "Yes, you can typically continue driving, but schedule a diagnosis soon. Ignoring symptoms can allow minor issues to become major repairs." },
              { q: `Can I fix ${s.name.toLowerCase()} myself?`, a: "It depends on the cause. Some causes are DIY-friendly (like spark plug replacement, L2 Easy). Others require professional equipment and experience (like engine repair, L5 Professional). Check each cause above for its DIY difficulty level." },
            ].map((faq, i) => (
              <details key={i} className="group bg-surface-0 rounded-xl border border-surface-border">
                <summary className="flex items-center gap-2 cursor-pointer list-none px-4 py-3 min-h-[44px] font-heading font-semibold text-sm text-text-primary hover:text-primary transition-colors">
                  <svg className="w-4 h-4 shrink-0 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
                  {faq.q}
                </summary>
                <p className="px-4 pb-4 ml-6 text-sm text-text-secondary leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
