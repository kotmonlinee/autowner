import type { Metadata } from "next";
import { getRepairCosts, getVehicleRepairSlugs } from "@/lib/data/server";
import type { RepairCostFull, RepairCostTier } from "@/lib/types";
import { getRepairImageUrl } from "@/lib/repair-images";
import { createServiceSupabase } from "@/lib/supabase-server";
import { getRelatedWarningLights } from "@/lib/repair-warning-lights";
import Navbar from "@/components/Navbar";

export const revalidate = 86400; // ISR: revalidate every 24 hours (static reference data)
import Footer from "@/components/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";

// ── Tier display order ──────────────────────────────────

const TIER_ORDER = ["economy", "mid_range", "luxury", "truck_suv", "european"];

// ── Helpers ──────────────────────────────────────────────

function formatMoney(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

function formatRange(min: number, max: number): string {
  return `${formatMoney(min)} - ${formatMoney(max)}`;
}

function confidenceLabel(level: string): string {
  switch (level) {
    case "high":
      return "High confidence estimate";
    case "medium":
      return "Moderate confidence estimate";
    case "low":
      return "Low confidence estimate";
    default:
      return "Estimate";
  }
}

function tierSlugToUrl(slug: string): string {
  return slug.replace(/_/g, "-");
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const repair = await getRepairCosts(slug);
  if (!repair) {
    return { title: "Repair Cost Not Found" };
  }
  const title = `${repair.name} Cost: ${formatRange(repair.overallMin, repair.overallMax)} (2026)`;
  const description = `${repair.name} typically costs ${formatRange(repair.overallMin, repair.overallMax)} across all vehicle types. Compare prices by vehicle tier, see labor vs. parts breakdown, and find related repairs.`;
  return {
    title,
    description,
    alternates: {
      canonical: `https://www.autowner.com/repair-cost/${tierSlugToUrl(repair.slug)}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: `https://www.autowner.com/repair-cost/${tierSlugToUrl(repair.slug)}`,
      images: [
        {
          url: "https://www.autowner.com/og-default.jpg",
          width: 1200,
          height: 630,
          alt: repair.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://www.autowner.com/og-default.jpg"],
    },
  };
}

export default async function RepairCostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [repair, popularVehicles] = await Promise.all([
    getRepairCosts(slug),
    getVehicleRepairSlugs(20),
  ]);

  if (!repair) notFound();

  // Fetch related OBD codes by repair name keywords
  const supabase = await createServiceSupabase();
  const repairKeywords = repair.name.toLowerCase().split(" ").filter((w) => w.length > 3);
  let obdCodes: { code: string; title: string }[] = [];
  if (repairKeywords.length > 0) {
    const conditions = repairKeywords.slice(0, 3).map((kw) => `title.ilike.%${kw}%`).join(",");
    const { data } = await supabase.from("obd_codes")
      .select("code, title")
      .or(conditions)
      .order("code")
      .limit(10);
    obdCodes = (data as unknown as { code: string; title: string }[]) ?? [];
  }

  const tierKeys = TIER_ORDER.filter((t) => repair.tiers[t]);
  const tierCards = tierKeys.map((t) => repair.tiers[t]);

  // FAQ structured data
  const faqItems: { question: string; answer: string }[] = [];

  // Overall cost FAQ
  faqItems.push({
    question: `How much does ${repair.name.toLowerCase()} cost?`,
    answer: `${repair.name} typically costs between ${formatMoney(repair.overallMin)} and ${formatMoney(repair.overallMax)}, with an average cost of ${formatMoney(repair.overallAvg)}. The final price depends on your vehicle make and model, labor rates in your area, and whether OEM or aftermarket parts are used.`,
  });

  // Labor vs parts FAQ
  if (tierCards.length > 0) {
    const first = tierCards[0];
    const laborPct = Math.round((first.labor / (first.labor + first.parts)) * 100);
    faqItems.push({
      question: `What percentage of ${repair.name.toLowerCase()} cost is labor vs parts?`,
      answer: `Labor typically accounts for about ${laborPct}% of the total cost (approximately ${formatMoney(first.labor)}), while parts account for the remaining ${100 - laborPct}% (approximately ${formatMoney(first.parts)}). This varies by vehicle and shop.`,
    });
  }

  // Tier-specific FAQ
  for (const tier of tierCards.slice(0, 3)) {
    const vehicleNames = tier.vehicles.map((v) => `${v.make} ${v.model}`).join(" / ");
    faqItems.push({
      question: `How much does ${repair.name.toLowerCase()} cost for a ${vehicleNames}?`,
      answer: `For ${tier.tierLabel.toLowerCase()} vehicles like the ${vehicleNames}, ${repair.name.toLowerCase()} costs between ${formatMoney(tier.min)} and ${formatMoney(tier.max)}, with an average of ${formatMoney(tier.avg)}. Labor: ${formatMoney(tier.labor)}, parts: ${formatMoney(tier.parts)}.`,
    });
  }

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${repair.name} — Cost Estimate & Price Guide`,
    description: `${repair.name} typically costs ${formatRange(repair.overallMin, repair.overallMax)}. Compare prices across 5 vehicle tiers.`,
    datePublished: new Date().toISOString(),
    publisher: {
      "@type": "Organization",
      name: "AutOwner",
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.autowner.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Repair Costs",
        item: "https://www.autowner.com/repair-cost",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: repair.name,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <Navbar />

      <main id="main-content" className="max-w-4xl mx-auto px-5 py-6 flex-1 w-full">
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />

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
          <Link href="/repair-cost" className="hover:text-primary transition-colors">
            Repair Costs
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
          <span className="text-text-secondary truncate">{repair.name}</span>
        </nav>

        {/* Title + Image */}
        <div className="flex items-start gap-5 mb-6">
          {(() => {
            const img = getRepairImageUrl(repair.slug.replace(/_/g, "-"));
            if (!img) return null;
            return (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 bg-surface-2 border border-surface-border">
                <img src={img} alt={repair.name} className="w-full h-full object-cover" />
              </div>
            );
          })()}
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary mb-2">
              {repair.name}
            </h1>
            <p className="text-text-muted text-sm leading-relaxed">
              Compare repair cost estimates across 5 vehicle tiers, including labor and parts breakdown.
              All prices are estimates based on {confidenceLabel(repair.confidence).toLowerCase()}.
            </p>
          </div>
        </div>

        {/* Price Summary Card */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-6">
          <div className="text-center">
            <p className="text-xs font-heading font-bold text-text-muted uppercase tracking-wider mb-2">
              Estimated Cost Range
            </p>
            <p className="text-3xl sm:text-4xl font-heading font-bold text-text-primary mb-1">
              {formatRange(repair.overallMin, repair.overallMax)}
            </p>
            <p className="text-sm text-text-muted">
              Average: <strong className="text-text-secondary">{formatMoney(repair.overallAvg)}</strong>
              {" · "}
              <span className="inline-flex items-center gap-1">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    repair.confidence === "high"
                      ? "bg-green-500"
                      : repair.confidence === "medium"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                />
                {confidenceLabel(repair.confidence)}
              </span>
            </p>
          </div>
        </div>

        {/* Price Breakdown by Vehicle Tier */}
        <section className="mb-6">
          <h2 className="text-lg font-heading font-bold text-text-primary mb-4">
            Cost by Vehicle Tier
          </h2>
          <div className="space-y-3">
            {tierCards.map((tier) => (
              <TierCard key={tier.tier} tier={tier} repairName={repair.name} />
            ))}
          </div>
        </section>

        {/* CTA: Quote Checker */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <h3 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-1">
                Got a quote from your mechanic?
              </h3>
              <p className="text-text-muted text-sm">
                Compare it against our estimates to see if you&apos;re getting a fair deal.
              </p>
            </div>
            <Link
              href={`/quote-checker?repair=${encodeURIComponent(repair.name)}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold font-heading rounded-lg hover:bg-primary-glow hover:-translate-y-px transition-all duration-150 shadow-sm shadow-primary/20 shrink-0"
            >
              Check your quote
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </Link>
          </div>
        </div>

        {/* Labor vs Parts Breakdown */}
        <section className="mb-6">
          <h2 className="text-lg font-heading font-bold text-text-primary mb-4">
            Labor vs Parts Breakdown
          </h2>
          <div className="space-y-3">
            {tierCards.map((tier) => {
              const total = tier.labor + tier.parts;
              const laborPct = total > 0 ? Math.round((tier.labor / total) * 100) : 0;
              const partsPct = 100 - laborPct;
              return (
                <div
                  key={tier.tier}
                  className="bg-surface-1 rounded-xl border border-surface-border p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-heading font-semibold text-text-secondary">
                      {tier.tierLabel}
                    </span>
                    <span className="text-xs text-text-muted">
                      Total: {formatMoney(tier.avg)}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {/* Labor bar */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-text-muted">Labor</span>
                        <span className="text-text-secondary font-medium">
                          {formatMoney(tier.labor)} ({laborPct}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-surface-3 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${laborPct}%` }}
                        />
                      </div>
                    </div>
                    {/* Parts bar */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-text-muted">Parts</span>
                        <span className="text-text-secondary font-medium">
                          {formatMoney(tier.parts)} ({partsPct}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-surface-3 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber dark:bg-amber-dark rounded-full transition-all"
                          style={{ width: `${partsPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Factors Affecting Price */}
        <div className="bg-surface-1 rounded-xl border border-surface-border p-5 mb-6">
          <h2 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-3">
            Factors Affecting Price
          </h2>
          <ul className="space-y-2">
            <li className="flex items-start gap-2.5 text-sm text-text-secondary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              <span><strong>Vehicle make and model</strong> &mdash; luxury and European vehicles typically cost more due to specialized parts and higher labor rates.</span>
            </li>
            <li className="flex items-start gap-2.5 text-sm text-text-secondary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              <span><strong>Labor rates</strong> &mdash; vary by region, from $80/hour in rural areas to $200+/hour at dealerships in major cities.</span>
            </li>
            <li className="flex items-start gap-2.5 text-sm text-text-secondary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              <span><strong>OEM vs aftermarket parts</strong> &mdash; OEM parts cost 30-50% more but often come with better warranties.</span>
            </li>
            <li className="flex items-start gap-2.5 text-sm text-text-secondary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              <span><strong>Shop type</strong> &mdash; dealerships charge the most, independent shops less, and chain shops fall in between.</span>
            </li>
            <li className="flex items-start gap-2.5 text-sm text-text-secondary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              <span><strong>Additional repairs</strong> &mdash; sometimes related components need replacement, increasing total cost.</span>
            </li>
          </ul>
        </div>


        {/* Common OBD Codes */}
        {obdCodes.length > 0 && (
          <div className="bg-surface-1 rounded-xl border border-surface-border p-5 mb-4">
            <h2 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-3">
              Related OBD-II Codes
            </h2>
            <p className="text-text-muted text-xs mb-3">
              These diagnostic trouble codes are commonly related to {repair.name.toLowerCase()}:
            </p>
            <div className="space-y-2">
              {obdCodes.map((obd) => (
                <Link key={obd.code} href={`/obd/${obd.code.toLowerCase()}`}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-surface-0 border border-surface-border border-l-4 border-l-primary/40 hover:border-primary/30 hover:border-l-primary hover:bg-primary/5 transition-all">
                  <span className="text-sm font-mono font-bold text-primary shrink-0">{obd.code}</span>
                  <span className="h-4 w-px bg-surface-border shrink-0" />
                  <span className="text-xs text-text-secondary truncate">{obd.title}</span>
                </Link>
              ))}
            </div>
            <Link href="/obd" className="inline-flex items-center gap-1.5 mt-3 text-xs font-medium text-primary hover:text-primary-glow transition-colors">
              Browse all OBD-II codes
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </Link>
          </div>
        )}

        {/* Related Dashboard Warning Lights */}
        {(() => {
          const lights = getRelatedWarningLights(repair.slug.replace(/_/g, "-"));
          if (lights.length === 0) return null;
          return (
            <div className="bg-surface-1 rounded-xl border border-surface-border p-5 mb-4">
              <h2 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-3">Related Dashboard Warning Lights</h2>
              <p className="text-text-muted text-xs mb-3">These warning lights may appear when you have {repair.name.toLowerCase()} issues:</p>
              <div className="space-y-2">
                {lights.map((light) => (
                  <Link key={light.slug} href={`/warning-lights/${light.slug}`}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-surface-0 border border-surface-border hover:border-primary/30 hover:bg-primary/5 transition-all">
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-surface-2">
                      <img src={`/warning-lights/${light.slug}.jpg`} alt={light.title} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-sm font-heading font-semibold text-text-primary hover:text-primary transition-colors">{light.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          );
        })()}

        {/* AI Diagnosis CTA */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <h2 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-1">Not Sure This Is the Right Repair?</h2>
              <p className="text-sm text-text-muted">Describe your symptoms to our AI — it identifies possible causes, OBD codes, and cost estimates in seconds.</p>
            </div>
            <Link href="/symptom-checker" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold font-heading rounded-lg hover:bg-primary-glow hover:-translate-y-px transition-all duration-150 shadow-sm shadow-primary/20 shrink-0">
              Diagnose with AI
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </Link>
          </div>
        </div>

        {/* Cost for Popular Vehicles */}
        <div className="bg-surface-1 rounded-xl border border-surface-border p-5 mb-4">
          <h2 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-3">
            {repair.name} Cost for Popular Vehicles
          </h2>
          <p className="text-xs text-text-muted mb-3">
            See how much this repair costs for specific makes and models:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {popularVehicles.slice(0, 20).map((v) => (
              <Link
                key={`${v.makeSlug}-${v.modelSlug}`}
                href={`/repair-cost/${v.makeSlug}/${v.modelSlug}/${slug}`}
                className="px-3 py-2 rounded-lg bg-surface-0 border border-surface-border text-xs font-medium text-text-secondary hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-colors font-heading truncate"
                title={`${v.makeName} ${v.modelName} ${repair.name}`}
              >
                {v.makeName} {v.modelName}
              </Link>
            ))}
          </div>
          <Link
            href="/repair-cost"
            className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-primary hover:text-primary-glow transition-colors font-heading"
          >
            Compare all vehicles →
          </Link>
        </div>

        {/* FAQ */}
        <div className="bg-surface-1 rounded-xl border border-surface-border p-5 mb-4">
          <h2 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-2">
            {faqItems.map((item, i) => (
              <details key={i} className="group">
                <summary className="flex items-center justify-between px-4 py-3 cursor-pointer text-sm font-heading font-semibold text-text-primary hover:text-primary transition-colors bg-surface-0 rounded-lg border border-surface-border">
                  {item.question}
                  <svg className="w-4 h-4 text-text-muted group-open:rotate-180 transition-transform shrink-0 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9" /></svg>
                </summary>
                <p className="px-4 pb-4 pt-2 text-sm text-text-secondary leading-relaxed">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber/5 dark:bg-yellow-950/20 border border-amber/20 dark:border-yellow-800/20 rounded-xl p-4">
          <div className="flex items-start gap-2.5">
            <svg className="w-5 h-5 text-amber dark:text-amber-dark mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            <p className="text-xs text-text-muted leading-relaxed">
              <strong className="text-text-secondary">Disclaimer:</strong> Prices are estimates only
              and may vary by location, vehicle condition, shop rates, and parts availability. Always
              get multiple quotes before authorizing repairs. Use our{" "}
              <Link href={`/quote-checker?repair=${encodeURIComponent(repair.name)}`} className="text-primary hover:text-primary-glow underline">Quote Checker</Link>{" "}
              to verify your mechanic&apos;s estimate.
            </p>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}

// ── Tier Card Component ──────────────────────────────────

function TierCard({ tier, repairName }: { tier: RepairCostTier; repairName: string }) {
  const vehicleNames = tier.vehicles.map((v) => `${v.make} ${v.model}`).join(" / ");

  return (
    <div className="bg-surface-1 rounded-xl border border-surface-border p-4 hover:border-primary/20 hover:shadow-sm transition-all duration-150">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-sm font-heading font-bold text-text-primary mb-0.5">
            {tier.tierLabel}
          </h3>
          <p className="text-xs text-text-muted">{vehicleNames}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-lg font-heading font-bold text-text-primary">
            {formatRange(tier.min, tier.max)}
          </p>
          <p className="text-xs text-text-muted">
            Avg: {formatMoney(tier.avg)}
          </p>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-surface-border flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <svg
            className="w-3.5 h-3.5 text-primary"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
          </svg>
          <span className="text-xs text-text-muted">
            Labor: {formatMoney(tier.labor)}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg
            className="w-3.5 h-3.5 text-amber dark:text-amber-dark"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
          <span className="text-xs text-text-muted">
            Parts: {formatMoney(tier.parts)}
          </span>
        </div>
        <span className="ml-auto text-xs font-heading text-text-muted">
          {tier.confidence === "high" ? "High confidence" : tier.confidence === "medium" ? "Medium confidence" : "Estimate"}
        </span>
      </div>
    </div>
  );
}
