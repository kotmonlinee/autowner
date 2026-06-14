import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DiagnosisWizard from "./DiagnosisWizard";
import DiagnosisBrowser from "@/components/DiagnosisBrowser";
import { createServiceSupabase } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AI Car Diagnosis — Symptom Checker",
  description: "Describe your car's symptoms and get possible OBD-II codes, repair suggestions, and cost estimates.",
  alternates: { canonical: "https://www.autowner.com/symptom-checker" },
  openGraph: { title: "AI Car Diagnosis — Describe Your Symptoms", description: "Describe your car's symptoms and get an AI-powered diagnosis with OBD-II codes, repair suggestions, and cost estimates.", type: "website" },
  twitter: { card: "summary_large_image", title: "AI Car Diagnosis — Symptom Checker | AutOwner", description: "Describe your car's symptoms and get an AI diagnosis with repair costs and OBD codes." },
};

const PAGE_SIZE = 6;

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

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <Navbar />
      <main id="main-content" className="max-w-4xl mx-auto px-5 py-6 w-full flex-1">
        <nav className="mb-4 flex items-center gap-2 text-sm text-text-muted font-heading" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <svg className="w-3 h-3 text-surface-border" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span className="text-text-secondary">AI Diagnosis</span>
        </nav>
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-text-primary mb-3">AI Car Diagnosis</h1>
          <p className="text-text-muted text-sm sm:text-base leading-relaxed max-w-2xl">Tell us what's happening with your car. Our AI analyzes symptoms and provides possible causes, OBD-II codes, and repair estimates.</p>
        </div>
        <DiagnosisWizard />

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
