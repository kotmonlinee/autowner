import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DiagnosisWizard from "./DiagnosisWizard";

export const metadata: Metadata = {
  title: "AI Car Diagnosis — Symptom Checker",
  description: "Describe your car's symptoms and get possible OBD-II codes, repair suggestions, and cost estimates. Free AI-powered diagnosis.",
  alternates: { canonical: "https://www.autowner.com/diagnosis" },
  openGraph: {
    title: "AI Car Diagnosis — Symptom Checker | AutOwner",
    description: "Describe your car's symptoms and get possible OBD-II codes, repair suggestions, and cost estimates.",
  },
};

export default function DiagnosisPage() {
  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <Navbar />
      <main id="main-content" className="max-w-4xl mx-auto px-5 py-10 w-full flex-1">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-text-primary">
            AI Car Diagnosis
          </h1>
          <p className="mt-2 text-text-muted text-base leading-relaxed">
            Tell us what's happening with your car. We'll help identify possible causes, OBD-II codes, and repair options.
          </p>
        </div>
        <Suspense fallback={<div className="text-center py-12"><div className="w-8 h-8 mx-auto mb-3 rounded-full border-2 border-primary border-t-transparent animate-spin"/></div>}>
          <DiagnosisWizard />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
