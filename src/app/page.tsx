import type { Metadata } from "next";
import { TOP_OBD_CODES, TOP_REPAIRS } from "@/lib/internal-linking";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmartSearchBar from "@/components/SmartSearchBar";
import DiagnosisLink from "@/components/DiagnosisLink";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "AutOwner — What's Wrong with Your Car?" },
  description:
    "AI-powered car diagnosis, OBD-II code lookup, repair cost estimates, and mechanic quote verification.",
  alternates: { canonical: "https://www.autowner.com" },
  openGraph: {
    siteName: "AutOwner", type: "website",
    title: "AutOwner — What's Wrong with Your Car?",
    description: "AI-powered car diagnosis, OBD-II code lookup, repair cost estimates, and mechanic quote verification.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Repair Cost Checker & OBD Code Lookup | AutOwner",
    description: "Check repair costs, verify mechanic quotes, decode warning lights and OBD codes.",
  },
};

const tools = [
  {
    title: "Repair Cost Estimator",
    desc: "Instant cost estimates for 55+ repairs across 5 vehicle tiers. See labor vs. parts breakdown.",
    href: "/repair-cost",
    accent: "bg-blue-500",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    title: "OBD-II Code Decoder",
    desc: "12,000+ diagnostic trouble codes with symptoms, causes, fixes, and estimated repair costs.",
    href: "/obd",
    accent: "bg-amber-500",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2" /><path d="M6 12h.01" />
      </svg>
    ),
  },
  {
    title: "Warning Lights Guide",
    desc: "Identify 50 dashboard warning symbols. Learn what they mean, how urgent they are, and what to do.",
    href: "/warning-lights",
    accent: "bg-red-500",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  {
    title: "Quote Checker",
    desc: "Got a mechanic's quote? Enter it here and compare against real repair cost data. No login needed.",
    href: "/quote-checker",
    accent: "bg-purple-500",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    title: "Recall Check",
    desc: "Search NHTSA safety recalls by make, model, and year. Find out if your vehicle has open recalls.",
    href: "/recall-check",
    accent: "bg-emerald-500",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </svg>
    ),
  },
  {
    title: "AI Diagnosis",
    desc: "Tell us your symptoms. AI analyzes possible causes, OBD codes, and repair costs.",
    href: "/symptom-checker",
    accent: "bg-violet-500",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      </svg>
    ),
  },
];

export default async function HomePage() {

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative w-full bg-surface-0 pt-16 sm:pt-24 pb-16 sm:pb-20 overflow-hidden">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display text-text-primary tracking-wide leading-tight">
                What's wrong with{" "}
                <span className="text-primary">your car</span>
                <span className="text-text-muted">?</span>
              </h1>
              <p className="mt-4 text-lg sm:text-xl text-text-muted max-w-xl mx-auto lg:mx-0 font-heading">
                Check repair costs, decode warning lights & OBD codes, and verify mechanic quotes.
              </p>
              <div className="mt-6">
                <SmartSearchBar />
              </div>
              <DiagnosisLink />
            </div>
            <div className="flex-1 w-full max-w-lg lg:max-w-none">
              <img
                src="/hero.jpg"
                alt=""
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tool Cards — 3 large + 3 small */}
      <section className="w-full bg-surface-0" aria-labelledby="tools-heading">
        <div className="max-w-5xl mx-auto px-5 pb-16">
          {/* Top row: 3 large cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            {tools.slice(0, 3).map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group flex flex-col p-6 sm:p-8 bg-surface-1 rounded-2xl border border-surface-border hover:border-primary/20 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                <div className={`w-14 h-14 rounded-2xl ${tool.accent} text-white flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-200`}>
                  {tool.icon}
                </div>
                <h2 className="text-xl font-heading font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">
                  {tool.title}
                </h2>
                <p className="text-sm text-text-muted leading-relaxed flex-1">{tool.desc}</p>
                <span className="inline-flex items-center gap-1.5 mt-5 text-sm font-medium text-primary font-heading opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200">
                  Get started
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </span>
              </Link>
            ))}
          </div>

          {/* Bottom row: 3 small cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {tools.slice(3).map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group flex items-center gap-4 p-4 bg-surface-1 rounded-xl border border-surface-border hover:border-primary/20 hover:shadow-sm transition-all duration-150"
              >
                <div className={`w-10 h-10 rounded-xl ${tool.accent} text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200 [&_svg]:w-5 [&_svg]:h-5`}>
                  {tool.icon}
                </div>
                <div>
                  <h3 className="text-sm font-heading font-semibold text-text-primary group-hover:text-primary transition-colors">{tool.title}</h3>
                  <p className="text-xs text-text-muted mt-0.5 line-clamp-1">{tool.desc.split(".")[0]}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Searches */}
      <section className="w-full bg-surface-1 border-y border-surface-border">
        <div className="max-w-5xl mx-auto px-5 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xs font-heading font-bold text-text-muted uppercase tracking-wider mb-3">Top OBD-II Codes</h3>
              <div className="flex flex-wrap gap-2">
                {TOP_OBD_CODES.map((c) => (
                  <Link key={c.code} href={`/obd/${c.code.toLowerCase()}`} className="px-3 py-1.5 rounded-lg bg-surface-0 border border-surface-border text-xs font-mono font-medium text-primary hover:border-primary/30 hover:bg-primary/5 transition-colors">{c.code}</Link>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-heading font-bold text-text-muted uppercase tracking-wider mb-3">Top Repair Costs</h3>
              <div className="flex flex-wrap gap-2">
                {TOP_REPAIRS.map((r) => (
                  <Link key={r.slug} href={`/repair-cost/${r.slug}`} className="px-3 py-1.5 rounded-lg bg-surface-0 border border-surface-border text-xs font-medium text-primary hover:border-primary/30 hover:bg-primary/5 transition-colors font-heading">{r.name}</Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Vehicle */}
      <section className="w-full bg-surface-0">
        <div className="max-w-5xl mx-auto px-5 py-10">
          <div className="text-center mb-6">
            <h2 className="text-xl font-heading font-bold text-text-primary">Browse by Vehicle</h2>
            <p className="text-sm text-text-muted mt-1">See repair costs for your specific car</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
            {[
              "toyota/camry","honda/civic","ford/f-150","toyota/rav4","honda/accord",
              "chevrolet/silverado-1500","jeep/wrangler","ford/mustang","bmw/3-series",
              "tesla/model-3","toyota/corolla","honda/cr-v","subaru/outback","nissan/altima",
              "hyundai/elantra","dodge/charger","jeep/grand-cherokee","ford/explorer",
              "tesla/model-y","toyota/tacoma",
            ].map((slug) => {
              const [make, model] = slug.split("/");
              return (
                <Link
                  key={slug}
                  href={`/vehicles/${make}/${model}`}
                  className="px-3 py-1.5 rounded-lg bg-surface-1 border border-surface-border text-xs font-medium text-text-secondary hover:text-primary hover:border-primary/20 hover:bg-primary/5 transition-colors font-heading"
                >
                  {make.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} {model.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
