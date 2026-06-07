import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DiagnosisWizard from "./DiagnosisWizard";
import { createServiceSupabase } from "@/lib/supabase-server";
import { TriangleAlert, TrendingUp } from "lucide-react";

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

export default async function DiagnosisPage() {
  // Fetch popular diagnoses
  let popular: any[] = [];
  try {
    const supabase = await createServiceSupabase();
    const { data } = await (supabase.from("diagnoses") as any)
      .select("slug, symptom_path, diagnosis_json, view_count, vehicle_make, vehicle_model")
      .order("view_count", { ascending: false })
      .limit(12);
    popular = data ?? [];
  } catch { /* table may not exist yet */ }

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <Navbar />
      <main id="main-content" className="max-w-4xl mx-auto px-5 py-10 w-full flex-1">
        <h1 className="text-3xl sm:text-4xl font-heading font-bold text-text-primary mb-2">AI Car Diagnosis</h1>
        <p className="text-text-muted text-base mb-8">Tell us what's happening with your car. Our AI analyzes symptoms and provides possible causes, OBD-II codes, and repair estimates.</p>
        <DiagnosisWizard />

        {popular.length > 0 && (
          <section className="mt-16 pt-12 border-t border-surface-border">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-heading font-bold text-text-primary">Popular Diagnoses</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {popular.map((d: any) => {
                const diag = d.diagnosis_json;
                const sev = SEVERITY_COLORS[diag.severity] ?? SEVERITY_COLORS.medium;
                const vehicle = d.vehicle_make ? `${d.vehicle_make} ${d.vehicle_model ?? ""}` : null;
                return (
                  <Link key={d.slug} href={`/symptom-checker/${d.slug}`}
                    className="flex flex-col gap-2 p-4 bg-surface-1 rounded-xl border border-surface-border hover:border-primary/30 hover:shadow-sm transition-all group">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-heading font-semibold text-text-primary group-hover:text-primary transition-colors line-clamp-2">{diag.title}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${sev} font-heading`}>{diag.severity}</span>
                    </div>
                    {vehicle && <span className="text-xs text-text-muted font-heading">{vehicle}</span>}
                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-surface-border">
                      <span className="text-xs text-text-muted">{d.view_count} view{d.view_count !== 1 ? "s" : ""}</span>
                      <TriangleAlert className="w-3 h-3 text-text-muted" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
