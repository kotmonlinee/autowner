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

        {/* Most Checked Vehicles */}
        <div className="mb-8 p-5 bg-surface-1 rounded-2xl border border-surface-border">
          <h2 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-3">Most Checked Vehicles</h2>
          <p className="text-xs text-text-muted mb-3">Click to quickly check recalls for these commonly searched vehicles:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { make: "Toyota", makeSlug: "toyota", model: "Camry", modelSlug: "camry", year: "2020" },
              { make: "Honda", makeSlug: "honda", model: "Civic", modelSlug: "civic", year: "2019" },
              { make: "Ford", makeSlug: "ford", model: "F-150", modelSlug: "f-150", year: "2020" },
              { make: "Toyota", makeSlug: "toyota", model: "RAV4", modelSlug: "rav4", year: "2020" },
              { make: "Honda", makeSlug: "honda", model: "Accord", modelSlug: "accord", year: "2019" },
              { make: "Chevrolet", makeSlug: "chevrolet", model: "Silverado 1500", modelSlug: "silverado-1500", year: "2020" },
              { make: "Nissan", makeSlug: "nissan", model: "Altima", modelSlug: "altima", year: "2019" },
              { make: "Jeep", makeSlug: "jeep", model: "Grand Cherokee", modelSlug: "grand-cherokee", year: "2020" },
              { make: "Ford", makeSlug: "ford", model: "Explorer", modelSlug: "explorer", year: "2020" },
              { make: "Hyundai", makeSlug: "hyundai", model: "Elantra", modelSlug: "elantra", year: "2019" },
              { make: "BMW", makeSlug: "bmw", model: "3 Series", modelSlug: "3-series", year: "2020" },
              { make: "Subaru", makeSlug: "subaru", model: "Outback", modelSlug: "outback", year: "2020" },
            ].map((v) => (
              <a key={`${v.make}-${v.model}-${v.year}`}
                href={`/recall-check?make=${encodeURIComponent(v.make)}&model=${encodeURIComponent(v.model)}&year=${v.year}`}
                className="flex items-center gap-3 p-2 rounded-xl bg-surface-0 border border-surface-border hover:border-primary/30 hover:bg-primary/5 transition-colors overflow-hidden">
                <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-surface-2">
                  <img src={`/vehicles/${v.makeSlug}-${v.modelSlug}.jpg`} alt={`${v.make} ${v.model}`} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <span className="text-xs font-medium text-text-secondary hover:text-primary transition-colors font-heading">{v.make} {v.model} ({v.year})</span>
              </a>
            ))}
          </div>
        </div>

        <RecallForm />

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
                  <svg className="w-4 h-4 shrink-0 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
                  {faq.q}
                </summary>
                <p className="px-4 pb-4 ml-6 text-sm text-text-secondary leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
