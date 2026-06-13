import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createServiceSupabase } from "@/lib/supabase-server";

export const metadata: Metadata = {
  title: "Search",
  description: "Search OBD codes, repairs, diagnoses, and warning lights.",
};

const WARNING_LIGHTS = [
  { slug: "check-engine", title: "Check Engine Light (MIL)" },
  { slug: "oil-pressure", title: "Oil Pressure Warning" },
  { slug: "battery-charging", title: "Battery Charging Warning" },
  { slug: "brake-system", title: "Brake System Warning" },
  { slug: "coolant-temperature", title: "Coolant Temperature Warning" },
  { slug: "tpms", title: "Tire Pressure (TPMS)" },
  { slug: "abs", title: "ABS Warning" },
  { slug: "airbag", title: "Airbag / SRS Warning" },
  { slug: "traction-control", title: "Traction Control Warning" },
  { slug: "power-steering", title: "Power Steering Warning" },
  { slug: "reduced-power", title: "Reduced Engine Power" },
  { slug: "service-vehicle", title: "Service Vehicle Soon" },
  { slug: "oil-change", title: "Oil Change Reminder" },
  { slug: "washer-fluid", title: "Washer Fluid Low" },
  { slug: "door-ajar", title: "Door/Trunk Ajar" },
  { slug: "seat-belt", title: "Seat Belt Reminder" },
  { slug: "security", title: "Security / Immobilizer" },
  { slug: "low-fuel", title: "Low Fuel Level" },
];

const SEVERITY_LABELS: Record<number, string> = { 5: "Critical", 4: "Serious", 3: "Moderate", 2: "Minor", 1: "Minor" };

function severityBadge(severity: number) {
  if (severity >= 5) return "bg-severity-critical-bg text-severity-critical border-severity-critical-border";
  if (severity >= 4) return "bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800";
  if (severity >= 3) return "bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800";
  return "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800";
}

function Arrow() {
  return (
    <svg className="w-4 h-4 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const sp = await searchParams;
  const query = sp.q?.trim() || "";

  if (!query) {
    return (
      <div className="min-h-screen bg-surface-0 flex flex-col">
        <Navbar />
        <main className="max-w-3xl mx-auto px-5 py-8 flex-1 w-full">
          <nav className="mb-6 flex items-center gap-2 text-sm text-text-muted font-heading" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <svg className="w-3 h-3 text-surface-border" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <span className="text-text-secondary">Search</span>
          </nav>
          <form action="/search" method="GET" className="mb-8">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <input name="q" type="search" placeholder="Search OBD codes, repairs, symptoms, warning lights..." className="w-full h-14 pl-12 pr-5 bg-surface-1 border border-surface-border rounded-xl text-text-primary placeholder:text-text-muted text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" autoFocus />
            </div>
          </form>
          <p className="text-text-muted text-sm text-center">Enter a keyword to search across OBD codes, repairs, diagnoses, and warning lights.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const supabase = await createServiceSupabase();
  const lower = query.toLowerCase();

  const [obdRes, repairRes, diagRes, postRes] = await Promise.all([
    supabase.from("obd_codes").select("code, title, severity").or(`code.ilike.${lower}%,title.ilike.%${lower}%`).order("code").limit(8),
    supabase.from("repair_costs").select("repair_slug, repair_name, min_cost, max_cost").or(`repair_name.ilike.%${lower}%`).order("repair_name").limit(8),
    supabase.from("diagnoses").select("slug, diagnosis_json, view_count").ilike("symptom_path", `%${lower}%`).order("view_count", { ascending: false }).limit(6),
    supabase.from("posts").select("id, slug, title, body").eq("status", "approved").textSearch("search_vector", query, { config: "english" }).limit(6),
  ]);

  const warningLights = WARNING_LIGHTS.filter((w) => w.title.toLowerCase().includes(lower)).slice(0, 6);
  const repairs = ((repairRes.data ?? []) as unknown as any[]).reduce((acc: any[], r: any) => {
    const slug = r.repair_slug.replace(/_/g, "-");
    if (!acc.some((x) => x.slug === slug)) acc.push({ slug, name: r.repair_name, min: r.min_cost, max: r.max_cost });
    return acc;
  }, []);

  const obdCodes = (obdRes.data ?? []) as unknown as any[];
  const diagnoses = (diagRes.data ?? []) as unknown as any[];
  const posts = (postRes.data ?? []) as unknown as any[];

  const totalResults = obdCodes.length + repairs.length + diagnoses.length + warningLights.length + posts.length;

  const hasResults = totalResults > 0;

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <Navbar />
      <main className="max-w-3xl mx-auto px-5 py-8 flex-1 w-full">
        <nav className="mb-4 flex items-center gap-2 text-sm text-text-muted font-heading" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <svg className="w-3 h-3 text-surface-border" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span className="text-text-secondary">Search</span>
        </nav>

        <form action="/search" method="GET" className="mb-6">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input name="q" type="search" defaultValue={query} className="w-full h-12 sm:h-14 pl-12 pr-5 bg-surface-1 border border-surface-border rounded-xl text-text-primary placeholder:text-text-muted text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
          </div>
        </form>

        {!hasResults ? (
          <div className="text-center py-16 bg-surface-1 rounded-xl border border-surface-border">
            <p className="text-text-muted text-sm mb-1">No results found for &ldquo;{query}&rdquo;</p>
            <p className="text-text-muted text-xs">Try a different keyword or browse:</p>
            <div className="flex justify-center gap-3 mt-4">
              <Link href="/obd" className="text-sm font-semibold text-primary hover:text-primary-glow font-heading">OBD Codes</Link>
              <Link href="/repair-cost" className="text-sm font-semibold text-primary hover:text-primary-glow font-heading">Repair Costs</Link>
              <Link href="/symptom-checker" className="text-sm font-semibold text-primary hover:text-primary-glow font-heading">AI Diagnosis</Link>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm text-text-muted mb-6">
              {totalResults} result{totalResults !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
            </p>

            {/* OBD-II Codes */}
            {obdCodes.length > 0 && (
              <section className="mb-8">
                <h2 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  OBD-II Codes
                  <span className="text-xs font-normal text-text-muted normal-case tracking-normal">({obdCodes.length})</span>
                </h2>
                <div className="space-y-1.5">
                  {obdCodes.map((c: any) => (
                    <Link key={c.code} href={`/obd/${c.code.toLowerCase()}`} className="group flex items-center gap-3 px-4 py-2.5 rounded-xl bg-surface-1 border border-surface-border hover:border-primary/30 hover:bg-primary/5 transition-all">
                      <span className="text-sm font-mono font-bold text-primary shrink-0 w-16">{c.code}</span>
                      <span className="flex-1 min-w-0 text-sm text-text-secondary truncate">{c.title}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold font-heading border shrink-0 ${severityBadge(c.severity ?? 1)}`}>{SEVERITY_LABELS[c.severity] ?? "Minor"}</span>
                      <Arrow />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Repair Costs */}
            {repairs.length > 0 && (
              <section className="mb-8">
                <h2 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber" />
                  Repair Costs
                  <span className="text-xs font-normal text-text-muted normal-case tracking-normal">({repairs.length})</span>
                </h2>
                <div className="space-y-1.5">
                  {repairs.map((r: any) => (
                    <Link key={r.slug} href={`/repair-cost/${r.slug}`} className="group flex items-center gap-3 px-4 py-2.5 rounded-xl bg-surface-1 border border-surface-border hover:border-primary/30 hover:bg-primary/5 transition-all">
                      <span className="text-sm font-heading font-medium text-text-primary truncate flex-1 min-w-0">{r.name}</span>
                      <span className="text-xs font-heading text-text-muted shrink-0">${r.min}–${r.max}</span>
                      <Arrow />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* AI Diagnoses */}
            {diagnoses.length > 0 && (
              <section className="mb-8">
                <h2 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  AI Diagnoses
                  <span className="text-xs font-normal text-text-muted normal-case tracking-normal">({diagnoses.length})</span>
                </h2>
                <div className="space-y-1.5">
                  {diagnoses.map((d: any) => (
                    <Link key={d.slug} href={`/symptom-checker/${d.slug}`} className="group flex items-center gap-3 px-4 py-2.5 rounded-xl bg-surface-1 border border-surface-border hover:border-primary/30 hover:bg-primary/5 transition-all">
                      <span className="text-sm font-heading font-medium text-text-primary truncate flex-1 min-w-0">{d.diagnosis_json?.title ?? "Diagnosis"}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold font-heading border shrink-0 ${d.diagnosis_json?.severity === "critical" ? "bg-red-50 text-red-700 border-red-200" : d.diagnosis_json?.severity === "high" ? "bg-orange-50 text-orange-700 border-orange-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>{d.diagnosis_json?.severity ?? "medium"}</span>
                      <Arrow />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Warning Lights */}
            {warningLights.length > 0 && (
              <section className="mb-8">
                <h2 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-severity-caution" />
                  Warning Lights
                  <span className="text-xs font-normal text-text-muted normal-case tracking-normal">({warningLights.length})</span>
                </h2>
                <div className="space-y-1.5">
                  {warningLights.map((w) => (
                    <Link key={w.slug} href={`/warning-lights/${w.slug}`} className="group flex items-center gap-3 px-4 py-2.5 rounded-xl bg-surface-1 border border-surface-border hover:border-primary/30 hover:bg-primary/5 transition-all">
                      <span className="text-sm font-heading font-medium text-text-primary truncate flex-1 min-w-0">{w.title}</span>
                      <Arrow />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Articles */}
            {posts.length > 0 && (
              <section className="mb-8">
                <h2 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Articles
                  <span className="text-xs font-normal text-text-muted normal-case tracking-normal">({posts.length})</span>
                </h2>
                <div className="space-y-1.5">
                  {posts.map((p: any) => (
                    <Link key={p.id} href={`/post/${p.slug || p.id}`} className="group flex items-start gap-3 px-4 py-3 rounded-xl bg-surface-1 border border-surface-border hover:border-primary/30 hover:bg-primary/5 transition-all">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-heading font-semibold text-text-primary group-hover:text-primary transition-colors">{p.title}</p>
                        <p className="text-xs text-text-muted mt-1 line-clamp-1">{(p.body ?? "").replace(/[#*`>\-\n]/g, " ").slice(0, 120)}</p>
                      </div>
                      <Arrow />
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
