import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RecallForm from "./RecallForm";

export const metadata: Metadata = {
  title: "Vehicle Safety Recall Check — Free NHTSA Lookup",
  description:
    "Check if your vehicle has open safety recalls. Search by make, model, and year. Free, instant results from the NHTSA database.",
  alternates: { canonical: "https://www.autowner.com/recall-check" },
  openGraph: {
    title: "Vehicle Safety Recall Check — Free NHTSA Lookup",
    description: "Check if your vehicle has open safety recalls. Free, instant results.",
    type: "website",
    url: "https://www.autowner.com/recall-check",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vehicle Safety Recall Check — Free NHTSA Lookup",
    description: "Check if your vehicle has open safety recalls.",
  },
};

export default function RecallCheckPage() {
  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <Navbar />
      <main id="main-content" className="max-w-4xl mx-auto px-5 py-10 w-full flex-1">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary font-heading">
            Safety Recall Check
          </h1>
          <p className="mt-2 text-text-muted text-base leading-relaxed">
            Check if your vehicle has open safety recalls. Data sourced directly from the
            NHTSA (National Highway Traffic Safety Administration).
          </p>
        </div>
        <RecallForm />
      </main>
      <Footer />
    </div>
  );
}
