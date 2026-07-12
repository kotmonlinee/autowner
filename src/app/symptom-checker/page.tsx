import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DiagnosisWizard from "./DiagnosisWizard";
import DiagnosisBrowser from "@/components/DiagnosisBrowser";
import { createServiceSupabase } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Symptom Checker — Car Diagnostics",
  description: "Tell us your symptoms. We'll find the cause. Get possible OBD codes, repair suggestions, and cost estimates.",
  alternates: { canonical: "https://www.autowner.com/symptom-checker" },
  openGraph: { title: "Symptom Checker — Car Diagnostics", description: "Describe your car's symptoms and get possible causes, OBD codes, and estimated repair costs.", type: "website" },
  twitter: { card: "summary_large_image", title: "Symptom Checker — Car Diagnostics | AutOwner", description: "Describe your car's symptoms and get possible causes and estimated repair costs." },
};

const PAGE_SIZE = 6;

export default async function DiagnosisPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; symptom?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const prefilledSymptom = sp.symptom || null;

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

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <Navbar />
      <main id="main-content" className="max-w-4xl mx-auto px-5 py-6 w-full flex-1">
        <nav className="mb-4 flex items-center gap-2 text-sm text-text-muted font-heading" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <svg className="w-3 h-3 text-surface-border" fill="none" stroke="currentColor" viewBox="0 0 24 24" width={12} height={12}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span className="text-text-secondary">Symptom Checker</span>
        </nav>
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-text-primary mb-3">Symptom Checker</h1>
          <p className="text-text-muted text-sm sm:text-base leading-relaxed max-w-2xl">Tell us your symptoms. We'll find the cause. Get possible OBD codes, repair suggestions, and cost estimates.</p>
        </div>
        <DiagnosisWizard prefilledSymptom={prefilledSymptom} />

        {/* Diagnoses by Vehicle */}
        <section className="mt-8 mb-10 bg-surface-1 rounded-2xl border border-surface-border p-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <h2 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-1">Diagnoses by Vehicle</h2>
              <p className="text-xs text-text-muted">Browse problem diagnoses for your specific make and model.</p>
            </div>
            <Link href="/vehicles" className="flex items-center justify-between sm:inline-flex sm:gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold font-heading rounded-lg hover:bg-primary-glow hover:-translate-y-px transition-all duration-150 shadow-sm shadow-primary/20 shrink-0">
              Browse All Vehicles
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width={16} height={16}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </Link>
          </div>
        </section>

        <DiagnosisBrowser
          initialDiagnoses={popular}
          initialTotalCount={totalCount}
          initialPage={page}
        />
      </main>
      <Footer />
    </div>
  );
}
