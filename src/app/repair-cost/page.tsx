import type { Metadata } from "next";
import { getAllRepairSlugs, getRepairCategoryCounts, getPopularRepairCosts } from "@/lib/data/server";
import { getRepairImageUrl } from "@/lib/repair-images";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RepairSearchFilter from "@/components/RepairSearchFilter";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Repair Cost Estimator — Compare Prices by Vehicle Tier",
  description:
    "Compare car repair costs across 5 vehicle tiers. Find estimates for brakes, engine, transmission, suspension, AC, exhaust, and more. See labor vs parts breakdown.",
  alternates: {
    canonical: "https://www.autowner.com/repair-cost",
  },
  openGraph: {
    title: "Repair Cost Estimator",
    description:
      "Compare car repair costs across 5 vehicle tiers. Find estimates for brakes, engine, transmission, suspension, and more.",
    type: "website",
    url: "https://www.autowner.com/repair-cost",
    images: [
      {
        url: "https://www.autowner.com/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Repair Cost Estimator",
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
        <rect x="1" y="6" width="18" height="12" rx="2" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="8" y1="22" x2="16" y2="22" />
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

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function RepairCostLandingPage() {
  const allSlugs = await getAllRepairSlugs();
  const categorySlugs = CATEGORIES.map((c) => ({ slug: c.slug, keywords: c.keywords }));
  const categoryCounts = await getRepairCategoryCounts(categorySlugs);
  const popularRepairs = await getPopularRepairCosts(10);

  const totalRepairs = allSlugs.length;

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://www.autowner.com" },
              { "@type": "ListItem", position: 2, name: "Repair Costs", item: "https://www.autowner.com/repair-cost" },
            ],
          }),
        }}
      />

      <main id="main-content" className="max-w-4xl mx-auto px-5 py-6 flex-1 w-full">
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
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-text-primary mb-3">
            Repair Cost Estimator
          </h1>
          <p className="text-text-muted text-sm sm:text-base max-w-2xl">
            Compare repair costs across 5 vehicle tiers. See what other car owners
            pay for common repairs, with labor and parts breakdowns.
          </p>
          {totalRepairs > 0 && (
            <p className="text-xs text-text-muted mt-2">
              {totalRepairs} repair types available across {CATEGORIES.length} categories
            </p>
          )}
        </div>

        {/* Popular Repair Costs */}
        {popularRepairs.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-heading font-bold text-text-primary mb-4">
              Popular Repair Costs
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {popularRepairs.slice(0, 9).map((repair) => {
                const img = getRepairImageUrl(repair.slug);
                return (
                <Link
                  key={repair.slug}
                  href={`/repair-cost/${repair.slug}`}
                  className="group bg-surface-1 border border-surface-border rounded-xl p-4 hover:border-primary/20 hover:shadow-sm transition-all duration-150 max-w-full overflow-hidden"
                >
                  {img && (
                    <div className="w-full h-24 sm:h-32 rounded-lg overflow-hidden mb-3 bg-surface-2">
                      <img src={img} alt={repair.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                    </div>
                  )}
                  <h3 className="text-sm font-semibold text-text-primary font-heading group-hover:text-primary transition-colors mb-2 line-clamp-2">
                    {repair.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2 max-w-full">
                      <span className="text-lg font-bold text-text-primary font-heading truncate">
                        {formatCurrency(repair.minCost)} &ndash; {formatCurrency(repair.maxCost)}
                      </span>
                    </div>
                    <svg className="w-4 h-4 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs text-text-muted">
                      Avg: {formatCurrency(repair.avgCost)}
                    </span>
                    <span className="text-xs px-1.5 py-0.5 bg-surface-3 text-text-muted rounded-full">
                      {repair.tierCount} tiers
                    </span>
                  </div>
                </Link>
                );
              })}
            </div>
            {popularRepairs.length > 9 && (
              <div className="text-center mt-4">
                <Link
                  href="#all-repairs"
                  className="text-sm font-medium text-primary hover:text-primary-glow transition-colors"
                >
                  View all {totalRepairs} repair types &darr;
                </Link>
              </div>
            )}
          </section>
        )}

        {/* Browse by Vehicle */}
        <section className="mb-10 bg-surface-1 rounded-2xl border border-surface-border p-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <h2 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-1">Repair Costs by Vehicle</h2>
              <p className="text-xs text-text-muted">Find cost estimates for your specific make and model across all repair types.</p>
            </div>
            <Link href="/vehicles" className="flex items-center justify-between sm:inline-flex sm:gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold font-heading rounded-lg hover:bg-primary-glow hover:-translate-y-px transition-all duration-150 shadow-sm shadow-primary/20 shrink-0">
              Browse Vehicles
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </Link>
          </div>
        </section>

        {/* Browse by Category */}
        <section className="mb-10">
          <h2 className="text-lg font-heading font-bold text-text-primary mb-4">
            Browse by Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CATEGORIES.map((cat) => {
              const count = categoryCounts[cat.slug] ?? 0;
              return (
                <div
                  key={cat.slug}
                  className="bg-surface-1 rounded-xl border border-surface-border p-5 hover:border-primary/20 hover:shadow-sm transition-all duration-150 max-w-full overflow-hidden"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      {cat.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-heading font-bold text-text-primary">
                        {cat.name}
                      </h3>
                      {count > 0 && (
                        <p className="text-xs text-text-muted">
                          {count} repair type{count !== 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-text-muted mb-3">{cat.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {allSlugs
                      .filter((slug) =>
                        cat.keywords.some((kw) => slug.includes(kw.replace(/_/g, "-")))
                      )
                      .slice(0, 5)
                      .map((slug) => (
                        <Link
                          key={slug}
                          href={`/repair-cost/${slug}`}
                          className="px-3 py-2 bg-surface-0 border border-surface-border text-text-secondary rounded-lg text-xs font-medium hover:border-primary/30 hover:text-primary transition-colors font-heading"
                        >
                          {slug
                            .replace(/-/g, " ")
                            .split(" ")
                            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                            .join(" ")}
                        </Link>
                      ))}
                    {count > 5 && (
                      <span className="px-2 py-1 text-xs text-text-muted">
                        +{count - 5} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* All Repair Types — client-side searchable */}
        <div id="all-repairs">
          <RepairSearchFilter allSlugs={allSlugs} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
