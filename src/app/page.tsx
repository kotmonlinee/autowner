import type { Metadata } from "next";
import { getRecentActivityCount } from "@/lib/data/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmartSearchBar from "@/components/SmartSearchBar";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Repair Cost Checker & OBD Code Lookup",
  description:
    "Check repair costs, decode OBD trouble codes, identify warning lights, and verify mechanic quotes. Free tools for car owners.",
  alternates: { canonical: "https://www.autowner.com" },
  openGraph: {
    siteName: "AutOwner", type: "website",
    title: "Repair Cost Checker & OBD Code Lookup | AutOwner",
    description: "Check repair costs, decode OBD trouble codes, identify warning lights, and verify mechanic quotes. Free tools for car owners.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Repair Cost Checker & OBD Code Lookup | AutOwner",
    description: "Check repair costs, verify mechanic quotes, decode warning lights and OBD codes.",
  },
};

// ── Design A: Search-Centric ──────────────────────────────────

const popularSearches = [
  "Brake pad replacement cost",
  "Check engine light P0420",
  "Airbag warning light on",
  "Alternator replacement estimate",
  "Timing belt cost F-150",
  "Oil change price near me",
  "Catalytic converter repair",
  "TPMS sensor replacement",
  "Transmission fluid flush cost",
  "AC compressor not working",
];

const tools = [
  { title: "Repair Costs", desc: "See what repairs should cost", href: "/repair-cost", color: "bg-blue-500" },
  { title: "OBD-II Codes", desc: "Decode check engine lights", href: "/obd", color: "bg-amber-500" },
  { title: "Warning Lights", desc: "Understand dashboard symbols", href: "/warning-lights", color: "bg-red-500" },
  { title: "Recall Check", desc: "Check for safety recalls", href: "/recall-check", color: "bg-emerald-500" },
  { title: "Quote Checker", desc: "Verify mechanic quotes", href: "/quote-checker", color: "bg-purple-500" },
  { title: "Community", desc: "Discuss with car owners", href: "/community", color: "bg-cyan-500" },
];

export default async function HomePage() {
  const activity = await getRecentActivityCount();

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative w-full bg-surface-0 pt-24 sm:pt-32 pb-16 sm:pb-20">
        <div className="max-w-3xl mx-auto px-5 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display text-text-primary tracking-wide leading-tight">
            What's wrong with{" "}
            <span className="text-primary">your car</span>
            <span className="text-text-muted">?</span>
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-text-muted max-w-xl mx-auto leading-relaxed font-heading">
            Check repair costs, decode warning lights & OBD codes, and verify mechanic quotes.
          </p>

          <div className="mt-8 mb-6">
            <SmartSearchBar />
          </div>

          <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
            {popularSearches.map((q) => (
              <Link
                key={q}
                href={`/repair-cost?q=${encodeURIComponent(q)}`}
                className="px-3 py-1.5 rounded-lg text-xs text-text-muted hover:text-primary hover:bg-primary/5 transition-colors font-heading"
              >
                {q}
              </Link>
            ))}
          </div>

          <div className="mt-4 text-xs text-text-muted font-heading">
            <strong className="text-text-primary">{activity.newArticles}</strong> new articles this week ·{" "}
            <strong className="text-text-primary">{activity.newDiscussions}</strong> new discussions
          </div>
        </div>
      </section>

      {/* Tool Strip */}
      <section className="w-full bg-surface-1 border-y border-surface-border">
        <div className="max-w-5xl mx-auto px-5 py-8">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {tools.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-surface-2 transition-colors group"
              >
                <div className={`w-10 h-10 rounded-xl ${t.color} flex items-center justify-center`}>
                  <span className="text-white text-xs font-bold font-heading">{t.title.charAt(0)}</span>
                </div>
                <span className="text-xs font-medium text-text-primary font-heading text-center group-hover:text-primary transition-colors">{t.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Content */}
      <section className="w-full bg-surface-0">
        <div className="max-w-5xl mx-auto px-5 py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-heading font-bold text-text-primary">
              Most searched repairs & codes
            </h2>
            <p className="mt-2 text-text-muted text-sm">Real estimates from NHTSA repair cost data</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "Brake Pad Replacement", range: "$200 – $500", href: "/repair-cost/brake-pads-front" },
              { title: "Oxygen Sensor Replacement", range: "$200 – $400", href: "/repair-cost/oxygen-sensor" },
              { title: "Catalytic Converter", range: "$800 – $2,500", href: "/repair-cost/catalytic-converter" },
              { title: "Alternator Replacement", range: "$400 – $800", href: "/repair-cost/alternator" },
              { title: "Starter Replacement", range: "$300 – $600", href: "/repair-cost/starter" },
              { title: "Water Pump Replacement", range: "$350 – $700", href: "/repair-cost/water-pump" },
              { title: "Spark Plugs Replacement", range: "$150 – $350", href: "/repair-cost/spark-plugs" },
              { title: "Fuel Pump Replacement", range: "$400 – $900", href: "/repair-cost/fuel-pump" },
              { title: "Timing Belt Replacement", range: "$500 – $1,000", href: "/repair-cost/timing-belt" },
            ].map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="flex items-center justify-between p-4 bg-surface-1 rounded-xl border border-surface-border hover:border-primary/20 hover:shadow-sm transition-all duration-150 group"
              >
                <span className="text-sm font-medium text-text-primary font-heading group-hover:text-primary transition-colors">{r.title}</span>
                <span className="text-sm font-bold text-primary font-heading">{r.range}</span>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/repair-cost" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-glow transition-colors font-heading">
              Browse all repair costs →
            </Link>
          </div>
        </div>
      </section>

      {/* Popular OBD Codes */}
      <section className="w-full bg-surface-1 border-t border-surface-border">
        <div className="max-w-5xl mx-auto px-5 py-12">
          <div className="text-center mb-8">
            <h2 className="text-xl font-heading font-bold text-text-primary">Top Diagnostic Codes</h2>
            <p className="mt-1 text-text-muted text-sm">Search by OBD-II code to find your issue</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
            {["P0420","P0300","P0171","P0455","P0442","P0401","P0301","P0302","P0303","P0304","P0430","P0135","P0141","P0440","P0446","P0128","P0325","P0400","P0500","P0700"].map((code) => (
              <Link
                key={code}
                href={`/obd/${code.toLowerCase()}`}
                className="inline-flex items-center px-3 py-1.5 rounded-lg bg-surface-0 border border-surface-border text-xs font-mono font-medium text-primary hover:border-primary/30 hover:bg-primary/5 hover:-translate-y-px transition-all duration-150"
              >
                {code}
              </Link>
            ))}
          </div>
          <div className="text-center mt-5">
            <Link href="/obd" className="text-xs font-semibold text-primary hover:text-primary-glow transition-colors font-heading">
              View all 12,000+ codes →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
