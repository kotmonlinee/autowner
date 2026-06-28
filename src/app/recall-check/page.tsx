import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageFeedback from "@/components/PageFeedback";
import RecallForm from "./RecallForm";

export const revalidate = 86400;

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
      <main id="main-content" className="max-w-4xl mx-auto px-5 py-6 w-full flex-1">
        <nav className="mb-4 flex items-center gap-2 text-sm text-text-muted font-heading" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <svg className="w-3 h-3 text-surface-border" fill="none" stroke="currentColor" viewBox="0 0 24 24" width={12} height={12}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span className="text-text-secondary">Recall Check</span>
        </nav>
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary font-heading mb-3">
            Safety Recall Check
          </h1>
          <p className="text-text-muted text-sm sm:text-base leading-relaxed">
            Check if your vehicle has open safety recalls. Data sourced directly from the
            NHTSA (National Highway Traffic Safety Administration).
          </p>
        </div>

        <Suspense fallback={<div className="text-center py-12"><div className="w-8 h-8 mx-auto mb-3 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>}>
          <RecallForm />
        </Suspense>

        {/* Most Checked Vehicles */}
        <div className="mt-8 p-5 sm:p-6 bg-surface-1 rounded-2xl border border-surface-border">
          <h2 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-3">Most Checked Vehicles</h2>
          <p className="text-xs text-text-muted mb-4">Click to quickly check recalls for these commonly searched vehicles:</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { make: "Toyota", makeSlug: "toyota", model: "Camry", modelSlug: "camry", year: "2020" },
              { make: "Honda", makeSlug: "honda", model: "Civic", modelSlug: "civic", year: "2019" },
              { make: "Ford", makeSlug: "ford", model: "F-150 XL", modelSlug: "f-150", year: "2020" },
              { make: "Toyota", makeSlug: "toyota", model: "RAV4", modelSlug: "rav4", year: "2020" },
              { make: "Honda", makeSlug: "honda", model: "Accord", modelSlug: "accord", year: "2019" },
              { make: "Chevrolet", makeSlug: "chevrolet", model: "Silverado 1500", modelSlug: "silverado-1500", year: "2020" },
              { make: "Nissan", makeSlug: "nissan", model: "Altima", modelSlug: "altima", year: "2019" },
              { make: "Jeep", makeSlug: "jeep", model: "Grand Cherokee", modelSlug: "grand-cherokee", year: "2020" },
              { make: "Ford", makeSlug: "ford", model: "Explorer", modelSlug: "explorer", year: "2020" },
              { make: "Hyundai", makeSlug: "hyundai", model: "Elantra", modelSlug: "elantra", year: "2019" },
              { make: "BMW", makeSlug: "bmw", model: "3 Series", modelSlug: "3-series", year: "2023" },
              { make: "Subaru", makeSlug: "subaru", model: "Outback", modelSlug: "outback", year: "2020" },
            ].map((v) => (
              <Link key={`${v.make}-${v.model}-${v.year}`}
                href={`/recall-check?make=${encodeURIComponent(v.make)}&model=${encodeURIComponent(v.model)}&year=${v.year}`}
                className="group flex items-center gap-3 p-2 rounded-xl bg-surface-0 border border-surface-border hover:border-primary/30 hover:bg-primary/5 transition-colors overflow-hidden">
                <div className="w-14 h-11 sm:w-16 sm:h-12 rounded-lg overflow-hidden shrink-0 bg-surface-2">
                  <img src={`/vehicles/${v.makeSlug}-${v.modelSlug}.jpg`} alt={`${v.make} ${v.model}`} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <span className="text-sm font-medium text-text-secondary group-hover:text-primary transition-colors font-heading truncate">{v.make} {v.model} ({v.year})</span>
                <svg className="w-3.5 h-3.5 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width={14} height={14}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </Link>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <section className="mt-12 pt-10 border-t border-surface-border" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-xl font-heading font-bold text-text-primary mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q: "Are vehicle safety recalls free to fix?", a: "Yes. By law, all safety recalls must be repaired free of charge by authorized dealerships. The manufacturer covers all parts and labor costs. Never pay for a safety recall repair." },
              { q: "How do I know if my car has an open recall?", a: "Use our free recall checker above — select your vehicle's make, model, and year to see all open recalls from the NHTSA database. You can also check by VIN on NHTSA.gov/safercar for the most accurate results." },
              { q: "What does 'Park It' or 'Park Outside' mean?", a: "'Park It' means the recall is so critical you should not drive the vehicle until repaired. 'Park Outside' means the vehicle should be parked away from structures due to fire risk. Both are the highest severity recall classifications." },
              { q: "How often are recalls issued?", a: "The NHTSA issues hundreds of recalls each year covering millions of vehicles. Manufacturers also self-report defects. New recalls are published daily — check your vehicle regularly." },
              { q: "Can I still drive with an open recall?", a: "Most recalls are safe to drive while you wait for repairs. However, if your recall is marked 'Park It' or 'Do Not Drive', you should stop driving immediately and contact your dealer for towing and repair arrangements." },
              { q: "Does a recall affect my car's value?", a: "Open recalls do not directly reduce resale value but should be disclosed to buyers. Completed recall repairs show up on vehicle history reports like Carfax, which can give buyers confidence." },
            ].map((faq, i) => (
              <details key={i} className="group bg-surface-1 rounded-xl border border-surface-border">
                <summary className="flex items-center gap-2 cursor-pointer list-none p-4 font-heading font-semibold text-sm text-text-primary hover:text-primary transition-colors">
                  <svg className="w-4 h-4 shrink-0 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}><polyline points="9 18 15 12 9 6" /></svg>
                  {faq.q}
                </summary>
                <p className="px-4 pb-4 ml-6 text-sm text-text-secondary leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>
        <PageFeedback />
      </main>
      <Footer />
    </div>
  );
}
