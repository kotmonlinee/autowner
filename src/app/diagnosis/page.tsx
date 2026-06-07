import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DiagnosisWizard from "./DiagnosisWizard";

export const metadata: Metadata = {
  title: "AI Car Diagnosis — Symptom Checker",
  description: "Describe your car's symptoms and get possible OBD-II codes, repair suggestions, and cost estimates.",
};

export default function DiagnosisPage() {
  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <Navbar />
      <main id="main-content" className="max-w-4xl mx-auto px-5 py-10 w-full flex-1">
        <h1 className="text-3xl sm:text-4xl font-heading font-bold text-text-primary mb-2">AI Car Diagnosis</h1>
        <p className="text-text-muted text-base mb-8">Tell us what's happening with your car.</p>
        <DiagnosisWizard />
      </main>
      <Footer />
    </div>
  );
}
