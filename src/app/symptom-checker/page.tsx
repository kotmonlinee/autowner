import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DiagnosisWizard from "./DiagnosisWizard";
import { createServiceSupabase } from "@/lib/supabase-server";
import { getVehicleImageUrl } from "@/lib/vehicle-images";
import { getRepairImageUrl } from "@/lib/repair-images";
import { resolveRepairSlug } from "@/lib/internal-linking";
import { TriangleAlert, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AI Car Diagnosis — Symptom Checker",
  description: "Describe your car's symptoms and get possible OBD-II codes, repair suggestions, and cost estimates.",
};

const SEVERITY_COLORS: Record<string, string> = {
  critical: "bg-red-50 text-red-700 border-red-200",
  high: "bg-orange-50 text-orange-700 border-orange-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const PAGE_SIZE = 24;

function getDiagnosisImage(diag: any, d: any): string | null {
  if (diag.vehicle_make && diag.vehicle_model) {
    const vImg = getVehicleImageUrl(
      (diag.vehicle_make as string).toLowerCase().replace(/\s+/g, "-"),
      (diag.vehicle_model as string).toLowerCase().replace(/\s+/g, "-")
    );
    if (vImg) return vImg;
  }
  if (d.repairKeywords?.length) {
    for (const kw of d.repairKeywords) {
      const slug = resolveRepairSlug(kw);
      if (slug) {
        const rImg = getRepairImageUrl(slug);
        if (rImg) return rImg;
      }
    }
  }
  return null;
}

export default async function DiagnosisPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);

  let popular: any[] = [];
  let totalCount = 0;
  try {
    const supabase = await createServiceSupabase();
    const [{ data }, { count }] = await Promise.all([
      supabase.from("diagnoses")
        .select("slug, symptom_path, diagnosis_json, view_count, vehicle_make, vehicle_model")
        .order("view_count", { ascending: false })
        .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1),
      supabase.from("diagnoses")
        .select("id", { count: "exact", head: true }),
    ]);
    popular = (data ?? []) as unknown as any[];
    totalCount = count ?? 0;
  } catch { /* diagnoses fetch failed, skip */ }

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <Navbar />
      <main id="main-content" className="max-w-4xl mx-auto px-5 py-10 w-full flex-1">
        <h1 className="text-3xl sm:text-4xl font-heading font-bold text-text-primary mb-2">AI Car Diagnosis</h1>
        <p className="text-text-muted text-base mb-8">Tell us what's happening with your car. Our AI analyzes symptoms and provides possible causes, OBD-II codes, and repair estimates.</p>
        <DiagnosisWizard />

        {popular.length > 0 && (
          <section className="mt-16 pt-12 border-t border-surface-border">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-heading font-bold text-text-primary">Popular Diagnoses</h2>
                <span className="text-xs text-text-muted">{totalCount} results</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {popular.map((d: any) => {
                const diag = d.diagnosis_json;
                const sev = SEVERITY_COLORS[diag.severity] ?? SEVERITY_COLORS.medium;
                const vehicle = d.vehicle_make ? `${d.vehicle_make} ${d.vehicle_model ?? ""}` : null;
                const img = getDiagnosisImage(d, diag);
                return (
                  <Link key={d.slug} href={`/symptom-checker/${d.slug}`}
                    className="flex flex-col bg-surface-1 rounded-xl border border-surface-border hover:border-primary/30 hover:shadow-sm transition-all group overflow-hidden">
                    {img && (
                      <div className="w-full h-36 bg-surface-2 overflow-hidden">
                        <img src={img} alt={diag.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" / loading="lazy">
                      </div>
                    )}
                    <div className="flex flex-col gap-2 p-4 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-sm font-heading font-semibold text-text-primary group-hover:text-primary transition-colors line-clamp-2">{diag.title}</span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${sev} font-heading`}>{diag.severity}</span>
                      </div>
                      {vehicle && <span className="text-xs text-text-muted font-heading">{vehicle}</span>}
                      {diag.costEstimate && <span className="text-xs text-text-muted font-heading">Est. {diag.costEstimate}</span>}
                      <div className="flex items-center justify-between mt-auto pt-2 border-t border-surface-border">
                        <span className="text-xs text-text-muted">{d.view_count} view{d.view_count !== 1 ? "s" : ""}</span>
                        <TriangleAlert className="w-3 h-3 text-text-muted" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                {page > 1 && (
                  <Link href={`/symptom-checker?page=${page - 1}`} className="flex items-center gap-1 px-3 py-2 text-sm font-heading font-medium text-text-secondary hover:text-text-primary bg-surface-1 border border-surface-border rounded-lg hover:bg-surface-2 transition-colors">
                    <ChevronLeft className="w-4 h-4" />Previous
                  </Link>
                )}
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  const p = page <= 4 ? i + 1 : i + page - 3;
                  if (p > totalPages) return null;
                  return (
                    <Link key={p} href={`/symptom-checker?page=${p}`}
                      className={`px-3 py-2 text-sm font-heading font-medium rounded-lg transition-colors ${p === page ? "bg-primary text-white" : "text-text-secondary hover:text-text-primary bg-surface-1 border border-surface-border hover:bg-surface-2"}`}>
                      {p}
                    </Link>
                  );
                })}
                {page < totalPages && (
                  <Link href={`/symptom-checker?page=${page + 1}`} className="flex items-center gap-1 px-3 py-2 text-sm font-heading font-medium text-text-secondary hover:text-text-primary bg-surface-1 border border-surface-border rounded-lg hover:bg-surface-2 transition-colors">
                    Next<ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            )}
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
