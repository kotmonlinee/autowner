import type { Metadata } from "next";
import { getAllRepairSlugs } from "@/lib/data/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Repair Cost Estimator — Compare Prices by Vehicle Tier — AutOwner",
  description:
    "Compare car repair costs across 5 vehicle tiers. Find estimates for brakes, engine, transmission, suspension, AC, exhaust, and more. See labor vs parts breakdown.",
  alternates: {
    canonical: "https://www.autowner.com/repair-cost",
  },
  openGraph: {
    title: "Repair Cost Estimator — AutOwner",
    description:
      "Compare car repair costs across 5 vehicle tiers. Find estimates for brakes, engine, transmission, suspension, and more.",
    type: "website",
    url: "https://www.autowner.com/repair-cost",
    images: [
      {
        url: "https://www.autowner.com/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Repair Cost Estimator — AutOwner",
      },
    ],
  },
};

// ── Repair category definitions ─────────────────────────

const CATEGORIES = [
  {
    name: "Brakes",
    slug: "brakes",
    keywords: ["brake", "rotor", "caliper", "pad"],
    description: "Brake pads, rotors, calipers, and brake fluid",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
  },
  {
    name: "Engine",
    slug: "engine",
    keywords: ["engine", "head_gasket", "timing", "spark", "valve", "injector", "ignition", "fuel_pump", "fuel_filter", "belt", "mount", "pcv", "throttle"],
    description: "Timing belts, head gaskets, spark plugs, fuel system",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
      </svg>
    ),
  },
  {
    name: "Transmission",
    slug: "transmission",
    keywords: ["transmission", "clutch", "differential", "transfer_case", "fluid"],
    description: "Clutch, transmission fluid, differential service",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="19" r="2" />
        <circle cx="15" cy="5" r="2" />
        <circle cx="5" cy="12" r="2" />
        <circle cx="19" cy="12" r="2" />
        <line x1="7.5" y1="17" x2="10.5" y2="14" />
        <line x1="13.5" y1="7" x2="16.5" y2="10" />
        <line x1="7" y1="12" x2="17" y2="12" />
      </svg>
    ),
  },
  {
    name: "Suspension",
    slug: "suspension",
    keywords: ["strut", "shock", "tie_rod", "ball_joint", "control_arm", "cv_axle", "wheel_bearing", "power_steering"],
    description: "Struts, shocks, control arms, tie rods, wheel bearings",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    name: "AC / Heating",
    slug: "ac-heating",
    keywords: ["ac_compressor", "evaporator", "heater", "blower", "cabin"],
    description: "AC compressor, heater core, blower motor, cabin filter",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
  {
    name: "Electrical",
    slug: "electrical",
    keywords: ["alternator", "starter", "battery", "sensor", "mass_air", "oxygen", "window", "door_lock"],
    description: "Alternator, starter, battery, sensors, window regulators",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    name: "Exhaust",
    slug: "exhaust",
    keywords: ["catalytic", "muffler", "egr", "exhaust"],
    description: "Catalytic converter, muffler, EGR valve",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="6" y1="6" x2="18" y2="18" />
        <line x1="18" y1="6" x2="6" y2="18" />
      </svg>
    ),
  },
  {
    name: "Maintenance",
    slug: "maintenance",
    keywords: ["oil_change", "coolant", "windshield", "air_filter", "power_steering_flush", "brake_fluid_flush", "serpentine"],
    description: "Oil changes, flushes, filters, belts, windshield",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
];

export default async function RepairCostLandingPage() {
  const allSlugs = await getAllRepairSlugs();

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <Navbar />

      <main id="main-content" className="max-w-3xl mx-auto px-5 py-6 flex-1 w-full">
        {/* Breadcrumb */}
        <nav
          className="mb-4 flex items-center gap-2 text-sm text-text-muted font-heading"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <svg
            className="w-3 h-3 text-surface-border"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          <span className="text-text-secondary">Repair Costs</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-text-primary mb-3">
            Repair Cost Estimator
          </h1>
          <p className="text-text-muted text-sm sm:text-base max-w-xl mx-auto">
            Compare repair costs across 5 vehicle tiers. See what other car owners
            pay for common repairs, with labor and parts breakdowns.
          </p>
        </div>

        {/* Search Box */}
        <form action="/repair-cost" method="GET" className="max-w-xl mx-auto mb-10">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              name="q"
              type="search"
              placeholder="Search repairs (e.g. brake pads, oil change, timing belt)..."
              className="w-full h-14 pl-12 pr-5 bg-surface-1 border border-surface-border rounded-xl text-text-primary placeholder:text-text-muted text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </form>

        {/* Browse by Category */}
        <section className="mb-10">
          <h2 className="text-lg font-heading font-bold text-text-primary mb-4">
            Browse by Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.slug}
                className="bg-surface-1 rounded-xl border border-surface-border p-5 hover:border-primary/20 hover:shadow-sm transition-all duration-150"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    {cat.icon}
                  </div>
                  <h3 className="text-sm font-heading font-bold text-text-primary">
                    {cat.name}
                  </h3>
                </div>
                <p className="text-xs text-text-muted mb-3">{cat.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {allSlugs
                    .filter((slug) =>
                      cat.keywords.some((kw) => slug.includes(kw.replace(/_/g, "-")))
                    )
                    .slice(0, 4)
                    .map((slug) => (
                      <Link
                        key={slug}
                        href={`/repair-cost/${slug}`}
                        className="px-2 py-1 bg-surface-3 text-text-muted rounded text-xs font-medium hover:bg-surface-4 hover:text-text-secondary transition-colors"
                      >
                        {slug
                          .replace(/-/g, " ")
                          .split(" ")
                          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                          .join(" ")}
                      </Link>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* All Repairs */}
        {allSlugs.length > 0 && (
          <section>
            <h2 className="text-lg font-heading font-bold text-text-primary mb-4">
              All Repair Types
            </h2>
            <div className="flex flex-wrap gap-2">
              {allSlugs.map((slug) => (
                <Link
                  key={slug}
                  href={`/repair-cost/${slug}`}
                  className="px-3 py-1.5 bg-surface-1 border border-surface-border rounded-lg text-sm text-text-secondary hover:border-primary/20 hover:text-primary hover:shadow-sm transition-all duration-150 font-medium"
                >
                  {slug
                    .replace(/-/g, " ")
                    .split(" ")
                    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(" ")}
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
