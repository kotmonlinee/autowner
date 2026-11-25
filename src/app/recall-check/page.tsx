import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageFeedback from "@/components/PageFeedback";
import RecallForm from "./RecallForm";
import { DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_META } from "@/lib/constants";
import Breadcrumbs from "@/components/content/Breadcrumbs";
import PageHeader from "@/components/content/PageHeader";
import ContentSection from "@/components/content/ContentSection";
import FaqList from "@/components/content/FaqList";

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
    images: [DEFAULT_OG_IMAGE_META],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vehicle Safety Recall Check — Free NHTSA Lookup",
    description: "Check if your vehicle has open safety recalls.",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function RecallCheckPage() {
  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <Navbar />
      <main id="main-content" className="max-w-4xl mx-auto px-5 py-6 w-full flex-1">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Recall Check" }]} />
        <PageHeader
          eyebrow="Free NHTSA lookup"
          title="Safety recall check"
          description="Check whether a vehicle has an open safety recall before paying for a repair. Recall remedies are completed by an authorized dealer at no cost to the owner."
          aside={
            <div className="border-l-4 border-primary bg-primary/5 p-5">
              <p className="text-[10px] font-heading font-bold uppercase tracking-[0.14em] text-primary">Source</p>
              <p className="mt-2 font-display text-2xl font-semibold text-text-primary">NHTSA</p>
              <p className="mt-2 text-xs leading-5 text-text-secondary">Results come from the National Highway Traffic Safety Administration recall database.</p>
            </div>
          }
        />

        <Suspense fallback={<div className="text-center py-12"><div className="w-8 h-8 mx-auto mb-3 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>}>
          <RecallForm />
        </Suspense>

        {/* Most Checked Vehicles */}
        <ContentSection className="mt-8" eyebrow="Common lookups" title="Most checked vehicles" intro="Select a vehicle and year to prefill the NHTSA recall form.">
          <div className="grid border-l border-t border-surface-border sm:grid-cols-3">
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
              <Link prefetch={false} key={`${v.make}-${v.model}-${v.year}`}
                href={`/recall-check?make=${encodeURIComponent(v.make)}&model=${encodeURIComponent(v.model)}&year=${v.year}`}
                className="group flex items-center gap-3 overflow-hidden border-b border-r border-surface-border bg-surface-1 p-3 transition-colors hover:bg-primary/5">
                <div className="h-11 w-14 shrink-0 overflow-hidden border border-surface-border bg-surface-2 sm:h-12 sm:w-16">
                  <img src={`/vehicles/${v.makeSlug}-${v.modelSlug}.jpg`} alt={`${v.make} ${v.model}`} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <span className="text-sm font-medium text-text-secondary group-hover:text-primary transition-colors font-heading truncate">{v.make} {v.model} ({v.year})</span>
                <svg className="w-3.5 h-3.5 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width={14} height={14}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </Link>
            ))}
          </div>
        </ContentSection>

        {/* FAQ */}
        <ContentSection eyebrow="Before contacting the dealer" title="Recall questions">
          <FaqList items={[
              { q: "Are vehicle safety recalls free to fix?", a: "Yes. By law, all safety recalls must be repaired free of charge by authorized dealerships. The manufacturer covers all parts and labor costs. Never pay for a safety recall repair." },
              { q: "How do I know if my car has an open recall?", a: "Use our free recall checker above — select your vehicle's make, model, and year to see all open recalls from the NHTSA database. You can also check by VIN on NHTSA.gov/safercar for the most accurate results." },
              { q: "What does 'Park It' or 'Park Outside' mean?", a: "'Park It' means the recall is so critical you should not drive the vehicle until repaired. 'Park Outside' means the vehicle should be parked away from structures due to fire risk. Both are the highest severity recall classifications." },
              { q: "How often are recalls issued?", a: "The NHTSA issues hundreds of recalls each year covering millions of vehicles. Manufacturers also self-report defects. New recalls are published daily — check your vehicle regularly." },
              { q: "Can I still drive with an open recall?", a: "Most recalls are safe to drive while you wait for repairs. However, if your recall is marked 'Park It' or 'Do Not Drive', you should stop driving immediately and contact your dealer for towing and repair arrangements." },
              { q: "Does a recall affect my car's value?", a: "Open recalls do not directly reduce resale value but should be disclosed to buyers. Completed recall repairs show up on vehicle history reports like Carfax, which can give buyers confidence." },
            ].map((faq) => ({ question: faq.q, answer: faq.a }))} />
        </ContentSection>
        <PageFeedback />
      </main>
      <Footer />
    </div>
  );
}
