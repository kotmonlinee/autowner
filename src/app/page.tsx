import type { Metadata } from "next";
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
    title: "AI Diagnosis",
    desc: "Tell us your symptoms. AI analyzes possible causes, OBD codes, and repair costs.",
    href: "/symptom-checker",
    accent: "bg-primary",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      </svg>
    ),
  },
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
    title: "Quote Checker",
    desc: "Got a mechanic's quote? Enter it here and compare against real repair cost data.",
    href: "/quote-checker",
    accent: "bg-purple-500",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
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
];

export default async function HomePage() {
  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative w-full bg-surface-0 pt-12 sm:pt-24 pb-10 sm:pb-16">
        <div className="max-w-4xl mx-auto px-5 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display text-text-primary tracking-wide leading-tight">
            What's wrong with{" "}
            <span className="text-primary">your car</span>
            <span className="text-text-muted">?</span>
          </h1>
          <SmartSearchBar />
          <DiagnosisLink />
        </div>
      </section>

      {/* Tool Cards */}
      <section className="w-full bg-surface-0" aria-labelledby="tools-heading">
        <div className="max-w-5xl mx-auto px-5 pb-16">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {tools.map((tool, i) => {
              const isPrimary = i === 0;
              return (
              <Link
                key={tool.href}
                href={tool.href}
                className={`group flex flex-col p-4 sm:p-6 bg-surface-1 rounded-2xl border transition-all duration-200 ${
                  isPrimary
                    ? "border-primary/20 hover:border-primary/40 hover:shadow-lg hover:-translate-y-1"
                    : "border-surface-border hover:border-primary/20 hover:shadow-md hover:-translate-y-0.5"
                }`}
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${tool.accent} text-white flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-200 [&_svg]:w-5 [&_svg]:h-5 sm:[&_svg]:w-6 sm:[&_svg]:h-6`}>
                  {tool.icon}
                </div>
                <h2 className={`text-sm sm:text-base font-heading font-bold text-text-primary mb-1 sm:mb-2 group-hover:text-primary transition-colors ${isPrimary ? "text-primary" : ""}`}>
                  {tool.title}
                </h2>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed flex-1 line-clamp-2 sm:line-clamp-none">{tool.desc}</p>
                <span className="inline-flex items-center gap-1.5 mt-3 sm:mt-4 text-xs sm:text-sm font-medium text-primary font-heading group-hover:gap-2 transition-all duration-200">
                  {isPrimary ? "Diagnose Now" : "Get started"}
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </span>
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
