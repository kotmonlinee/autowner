import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createServiceSupabase } from "@/lib/supabase-server";
import { getRepairImageUrl } from "@/lib/repair-images";

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

  const totalResults = (obdRes.data?.length ?? 0) + repairs.length + (diagRes.data?.length ?? 0) + warningLights.length + (postRes.data?.length ?? 0);

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <Navbar />
      <main className="max-w-3xl mx-auto px-5 py-8 flex-1 w-full">
        <form action="/search" method="GET" className="mb-6">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input name="q" type="search" defaultValue={query} className="w-full h-14 pl-12 pr-5 bg-surface-1 border border-surface-border rounded-xl text-text-primary placeholder:text-text-muted text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
          </div>
        </form>

        <p className="text-sm text-text-muted mb-6">{totalResults} result{totalResults !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;</p>

        {totalResults === 0 && (
          <div className="text-center py-12 bg-surface-1 rounded-xl border border-surface-border">
            <p className="text-text-muted text-sm">No results found. Try a different keyword or browse:</p>
            <div className="flex justify-center gap-3 mt-4">
              <Link href="/obd" className="text-xs font-semibold text-primary hover:text-primary-glow font-heading">OBD Codes</Link>
              <Link href="/repair-cost" className="text-xs font-semibold text-primary hover:text-primary-glow font-heading">Repair Costs</Link>
              <Link href="/symptom-checker" className="text-xs font-semibold text-primary hover:text-primary-glow font-heading">AI Diagnosis</Link>
            </div>
          </div>
        )}

        {obdRes.data && (obdRes.data as unknown as any[]).length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-3">OBD-II Codes</h2>
            <div className="space-y-2">
              {(obdRes.data as unknown as any[]).map((c: any) => (
                <Link key={c.code} href={`/obd/${c.code.toLowerCase()}`} className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-surface-1 border border-surface-border border-l-4 border-l-primary/40 hover:border-primary/30 hover:border-l-primary hover:bg-primary/5 transition-all">
                  <span className="text-sm font-mono font-bold text-primary shrink-0">{c.code}</span>
                  <span className="h-4 w-px bg-surface-border shrink-0" />
                  <span className="text-xs text-text-secondary truncate">{c.title}</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border shrink-0 ml-auto ${c.severity >= 5 ? "bg-red-50 text-red-700 border-red-200" : c.severity >= 4 ? "bg-orange-50 text-orange-700 border-orange-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>S{c.severity}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {repairs.length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-3">Repair Costs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {repairs.map((r: any) => {
                const img = getRepairImageUrl(r.slug);
                return (
                  <Link key={r.slug} href={`/repair-cost/${r.slug}`} className="flex items-center gap-3 p-2 rounded-xl bg-surface-1 border border-surface-border hover:border-primary/30 hover:bg-primary/5 transition-all">
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-surface-2">{img && <img src={img} alt={r.name} className="w-full h-full object-cover" / loading="lazy">}</div>
                    <span className="text-sm font-medium text-text-primary font-heading truncate flex-1">{r.name}</span>
                    <span className="text-xs font-bold text-text-muted shrink-0">${r.min}–${r.max}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {diagRes.data && (diagRes.data as unknown as any[]).length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-3">AI Diagnoses</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(diagRes.data as unknown as any[]).map((d: any) => (
                <Link key={d.slug} href={`/symptom-checker/${d.slug}`} className="flex items-center justify-between p-3 bg-surface-1 rounded-xl border border-surface-border hover:border-primary/30 hover:bg-primary/5 transition-colors">
                  <span className="text-sm font-medium text-text-primary font-heading truncate">{d.diagnosis_json?.title ?? "Diagnosis"}</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ml-2 ${d.diagnosis_json?.severity === "critical" ? "bg-red-50 text-red-700 border-red-200" : d.diagnosis_json?.severity === "high" ? "bg-orange-50 text-orange-700 border-orange-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>{d.diagnosis_json?.severity ?? "medium"}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {warningLights.length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-3">Warning Lights</h2>
            <div className="flex flex-wrap gap-2">
              {warningLights.map((w) => (
                <Link key={w.slug} href={`/warning-lights/${w.slug}`} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-1 border border-surface-border text-sm text-text-secondary hover:text-primary hover:border-primary/30 transition-all font-heading font-medium">{w.title}</Link>
              ))}
            </div>
          </section>
        )}

        {postRes.data && (postRes.data as unknown as any[]).length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-3">Articles</h2>
            <div className="space-y-2">
              {(postRes.data as unknown as any[]).map((p: any) => (
                <Link key={p.id} href={`/post/${p.slug || p.id}`} className="block p-4 bg-surface-1 rounded-xl border border-surface-border hover:border-primary/20 transition-colors">
                  <p className="text-sm font-semibold text-text-primary font-heading">{p.title}</p>
                  <p className="text-xs text-text-muted mt-1 line-clamp-2">{(p.body ?? "").replace(/[#*`>\-\n]/g, " ").slice(0, 150)}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
