import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Sparkles, Search, ChevronRight, Wrench, AlertTriangle } from "lucide-react";

export default function DemoHomepage() {
  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* ── New Hero: Dual Entry ── */}
        <section className="relative pt-12 sm:pt-20 pb-16 sm:pb-24 px-5">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs font-heading font-bold text-primary uppercase tracking-[0.2em] mb-4">AI-Powered Car Diagnostics</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display text-text-primary tracking-tight leading-tight mb-4">
              Your car is trying to tell you{" "}
              <span className="text-primary">something</span>.
            </h1>
            <p className="text-lg text-text-muted max-w-xl mx-auto mb-10">
              Describe your symptoms, decode warning lights, check repair costs — all in one place.
            </p>

            {/* Dual entry cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {/* Primary: AI Diagnosis */}
              <Link href="/symptom-checker" className="group relative overflow-hidden rounded-2xl bg-primary p-6 sm:p-8 text-left hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
                <Sparkles className="w-8 h-8 text-white mb-4 relative z-10" />
                <h2 className="text-xl sm:text-2xl font-heading font-bold text-white mb-2 relative z-10">AI Symptom Checker</h2>
                <p className="text-sm text-white/80 mb-4 relative z-10">Tell us what's happening and get an instant diagnosis, repair costs, and next steps.</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-heading font-bold text-white relative z-10 group-hover:gap-2 transition-all">
                  Diagnose Now
                  <ChevronRight className="w-4 h-4" />
                </span>
              </Link>

              {/* Secondary: OBD Lookup */}
              <Link href="/obd" className="group rounded-2xl bg-surface-1 border-2 border-surface-border hover:border-primary/20 p-6 sm:p-8 text-left hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <Search className="w-8 h-8 text-text-primary mb-4" />
                <h2 className="text-xl sm:text-2xl font-heading font-bold text-text-primary mb-2">OBD Code Lookup</h2>
                <p className="text-sm text-text-muted mb-4">Already have a code? Look up meanings, severity, and repair estimates for 12,000+ codes.</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-heading font-bold text-primary group-hover:gap-2 transition-all">
                  Search Codes
                  <ChevronRight className="w-4 h-4" />
                </span>
              </Link>
            </div>

            {/* Quick access row */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {[
                { label: "Repair Costs", href: "/repair-cost", icon: <Wrench className="w-4 h-4" /> },
                { label: "Warning Lights", href: "/warning-lights", icon: <AlertTriangle className="w-4 h-4" /> },
                { label: "Browse by Vehicle", href: "/vehicles", icon: <Search className="w-4 h-4" /> },
                { label: "All Tools", href: "#tools", icon: <ChevronRight className="w-4 h-4" /> },
              ].map((item) => (
                <Link key={item.href} href={item.href} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-surface-1 border border-surface-border text-sm text-text-secondary hover:text-primary hover:border-primary/20 transition-colors font-heading font-medium">
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── "How It Works" ── */}
        <section className="max-w-5xl mx-auto px-5 pb-16">
          <p className="text-xs font-heading font-bold text-text-muted uppercase tracking-wider text-center mb-8">How It Works</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Describe Your Symptoms", desc: "Tell us what you're hearing, feeling, or seeing. No mechanical knowledge needed." },
              { step: "2", title: "Get AI Diagnosis", desc: "Our AI identifies possible causes, related OBD codes, and estimated repair costs." },
              { step: "3", title: "Make Informed Decisions", desc: "Compare repair estimates, check recalls, and verify mechanic quotes before you pay." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-heading font-bold text-lg mb-3">{item.step}</span>
                <h3 className="text-sm font-heading font-bold text-text-primary mb-1.5">{item.title}</h3>
                <p className="text-xs text-text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Tool cards (kept from original) ── */}
        <section id="tools" className="max-w-5xl mx-auto px-5 pb-20 border-t border-surface-border pt-16">
          <p className="text-xs font-heading font-bold text-text-muted uppercase tracking-wider text-center mb-8">All Tools</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { title: "Repair Cost Estimator", desc: "55+ repairs across 5 vehicle tiers", href: "/repair-cost" },
              { title: "OBD-II Decoder", desc: "12,000+ diagnostic trouble codes", href: "/obd" },
              { title: "Warning Lights Guide", desc: "50 dashboard symbols explained", href: "/warning-lights" },
              { title: "Quote Checker", desc: "Verify mechanic quotes against real data", href: "/quote-checker" },
              { title: "Recall Check", desc: "NHTSA safety recalls lookup", href: "/recall-check" },
              { title: "Community Guides", desc: "DIY articles & repair tutorials", href: "/community" },
            ].map((tool) => (
              <Link key={tool.href} href={tool.href} className="group p-4 bg-surface-1 rounded-xl border border-surface-border hover:border-primary/20 hover:shadow-sm transition-all">
                <h3 className="text-sm font-heading font-bold text-text-primary group-hover:text-primary transition-colors mb-1">{tool.title}</h3>
                <p className="text-xs text-text-muted">{tool.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
