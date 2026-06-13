import type { Metadata } from "next";
import { getRepairCosts, getVehicleRepairSlugs } from "@/lib/data/server";
import type { RepairCostFull, RepairCostTier } from "@/lib/types";
import { getRepairImageUrl } from "@/lib/repair-images";
import { getVehicleImageUrl } from "@/lib/vehicle-images";
import { createServiceSupabase } from "@/lib/supabase-server";
import { getRelatedWarningLights } from "@/lib/repair-warning-lights";
import { parseRepairSlug } from "@/lib/repair-slug-parser";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 86400;

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
    case "high": return "High confidence estimate";
    case "medium": return "Moderate confidence estimate";
    case "low": return "Low confidence estimate";
    default: return "Estimate";
  }
}

// ── Tier labels ─────────────────────────────────────────

const TIER_LABELS: Record<string, string> = {
  economy: "Economy (Toyota Corolla / Honda Civic)",
  mid_range: "Mid-Range (Ford F-150 / Honda Accord)",
  luxury: "Luxury (BMW 3 Series / Mercedes C-Class)",
  truck_suv: "Truck / SUV (Chevy Tahoe / Ram 1500)",
  european: "European (Audi A4 / Volvo S60)",
};

// ── Metadata ────────────────────────────────────────────

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const parsed = await parseRepairSlug(slug);
  const repairSlug = parsed?.repairSlug ?? slug;
  const repair = await getRepairCosts(repairSlug);
  if (!repair) return { title: "Repair Cost Not Found" };

  const canonical = parsed
    ? `https://www.autowner.com/repair-cost/${slug}`
    : `https://www.autowner.com/repair-cost/${slug}`;

  if (parsed) {
    const supabase = await createServiceSupabase();
    const [makeRes, modelRes] = await Promise.all([
      supabase.from("vehicle_makes").select("name").eq("slug", parsed.makeSlug).single(),
      supabase.from("vehicle_models").select("name").eq("slug", parsed.modelSlug).single(),
    ]);
    const makeName = (makeRes.data as { name: string } | null)?.name ?? parsed.makeSlug;
    const modelName = (modelRes.data as { name: string } | null)?.name ?? parsed.modelSlug;
    const title = `${makeName} ${modelName} ${repair.name} Cost: ${formatRange(repair.overallMin, repair.overallMax)} (2026)`;
    const desc = `${repair.name} for ${makeName} ${modelName} typically costs ${formatRange(repair.overallMin, repair.overallMax)}. Compare labor vs. parts costs and see what affects the price.`;
    return {
      title, description: desc,
      alternates: { canonical },
      openGraph: { title, description: desc, type: "article", url: canonical },
      twitter: { card: "summary_large_image", title, description: desc },
    };
  }

  const title = `${repair.name} Cost: ${formatRange(repair.overallMin, repair.overallMax)} (2026)`;
  const description = `${repair.name} typically costs ${formatRange(repair.overallMin, repair.overallMax)} across all vehicle types. Compare prices by vehicle tier, see labor vs. parts breakdown, and find related repairs.`;
  return {
    title, description,
    alternates: { canonical },
    openGraph: { title, description, type: "article", url: canonical, images: [{ url: "https://www.autowner.com/og-default.jpg", width: 1200, height: 630, alt: repair.name }] },
    twitter: { card: "summary_large_image", title, description, images: ["https://www.autowner.com/og-default.jpg"] },
  };
}

// ── Page ─────────────────────────────────────────────────

export default async function RepairCostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const parsed = await parseRepairSlug(slug);
  const repairSlug = parsed?.repairSlug ?? slug;

  const [repair, popularVehicles] = await Promise.all([
    getRepairCosts(repairSlug),
    getVehicleRepairSlugs(20),
  ]);

  if (!repair) notFound();

  // Vehicle-specific data
  let makeName = "";
  let modelName = "";
  if (parsed) {
    const supabase = await createServiceSupabase();
    const [makeRes, modelRes] = await Promise.all([
      supabase.from("vehicle_makes").select("name").eq("slug", parsed.makeSlug).single(),
      supabase.from("vehicle_models").select("name").eq("slug", parsed.modelSlug).single(),
    ]);
    makeName = (makeRes.data as { name: string } | null)?.name ?? parsed.makeSlug;
    modelName = (modelRes.data as { name: string } | null)?.name ?? parsed.modelSlug;
  }

  const vehicleImageUrl = parsed ? getVehicleImageUrl(parsed.makeSlug, parsed.modelSlug) : null;

  // Related OBD codes
  const supabase = await createServiceSupabase();
  const repairKeywords = repair.name.toLowerCase().split(" ").filter((w) => w.length > 3);
  let obdCodes: { code: string; title: string }[] = [];
  if (repairKeywords.length > 0) {
    const conditions = repairKeywords.slice(0, 3).map((kw) => `title.ilike.%${kw}%`).join(",");
    const { data } = await supabase.from("obd_codes")
      .select("code, title").or(conditions).order("code").limit(10);
    obdCodes = (data as unknown as { code: string; title: string }[]) ?? [];
  }

  const tierKeys = TIER_ORDER.filter((t) => repair.tiers[t]);
  const tierCards = tierKeys.map((t) => repair.tiers[t]);

  // Determine which tier this vehicle falls into (for vehicle-specific pages)
  let vehicleTier: string | null = null;
  let vehicleTierCard: RepairCostTier | null = null;
  if (parsed) {
    for (const t of tierCards) {
      const hasVehicle = t.vehicles.some(
        (v) => v.make.toLowerCase() === parsed.makeSlug || v.model.toLowerCase() === parsed.modelSlug
      );
      if (hasVehicle) { vehicleTier = t.tier; vehicleTierCard = t; break; }
    }
  }

  // FAQ
  const faqItems: { question: string; answer: string }[] = [];
  if (parsed && makeName && modelName) {
    faqItems.push({
      question: `How much does ${repair.name.toLowerCase()} cost for a ${makeName} ${modelName}?`,
      answer: `${repair.name} for a ${makeName} ${modelName} typically costs between ${formatMoney(repair.overallMin)} and ${formatMoney(repair.overallMax)}, with an average of ${formatMoney(repair.overallAvg)}. Labor accounts for approximately ${formatMoney(tierCards[0]?.labor ?? 0)} and parts approximately ${formatMoney(tierCards[0]?.parts ?? 0)}.`,
    });
    faqItems.push({
      question: `Can I save money on ${repair.name.toLowerCase()} for my ${makeName} ${modelName}?`,
      answer: `Yes. You can save by comparing quotes from multiple shops, using aftermarket parts instead of OEM (typically 30-50% less), or doing the repair yourself if you have the tools and experience. Always get at least 3 quotes before authorizing work.`,
    });
    faqItems.push({
      question: `What affects the cost of ${repair.name.toLowerCase()} on a ${makeName} ${modelName}?`,
      answer: `The main factors are your location (labor rates vary significantly by region), whether you use OEM or aftermarket parts, the shop's hourly rate (dealership vs. independent mechanic), and the vehicle's condition. Independent shops typically charge 20-40% less than dealerships.`,
    });
    faqItems.push({
      question: `How long does ${repair.name.toLowerCase()} take on a ${makeName} ${modelName}?`,
      answer: `${repair.name} on a ${makeName} ${modelName} typically takes 1-4 hours depending on the mechanic's experience and whether any complications arise during the repair. Ask your shop for an estimated labor time before authorizing work.`,
    });
  } else {
    faqItems.push({
      question: `How much does ${repair.name.toLowerCase()} cost?`,
      answer: `${repair.name} typically costs between ${formatMoney(repair.overallMin)} and ${formatMoney(repair.overallMax)}, with an average cost of ${formatMoney(repair.overallAvg)}. The final price depends on your vehicle make and model, labor rates in your area, and whether OEM or aftermarket parts are used.`,
    });
    if (tierCards.length > 0) {
      const first = tierCards[0];
      const laborPct = Math.round((first.labor / (first.labor + first.parts)) * 100);
      faqItems.push({
        question: `What percentage of ${repair.name.toLowerCase()} cost is labor vs parts?`,
        answer: `Labor typically accounts for about ${laborPct}% of the total cost (approximately ${formatMoney(first.labor)}), while parts account for the remaining ${100 - laborPct}% (approximately ${formatMoney(first.parts)}). This varies by vehicle and shop.`,
      });
    }
    for (const tier of tierCards.slice(0, 3)) {
      const vehicleNames = tier.vehicles.map((v) => `${v.make} ${v.model}`).join(" / ");
      faqItems.push({
        question: `How much does ${repair.name.toLowerCase()} cost for a ${vehicleNames}?`,
        answer: `For ${tier.tierLabel.toLowerCase()} vehicles like the ${vehicleNames}, ${repair.name.toLowerCase()} costs between ${formatMoney(tier.min)} and ${formatMoney(tier.max)}, with an average of ${formatMoney(tier.avg)}. Labor: ${formatMoney(tier.labor)}, parts: ${formatMoney(tier.parts)}.`,
      });
    }
  }

  const faqJsonLd = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
  };

  const articleJsonLd = {
    "@context": "https://schema.org", "@type": "Article",
    headline: parsed ? `${makeName} ${modelName} ${repair.name} — Cost Estimate & Price Guide` : `${repair.name} — Cost Estimate & Price Guide`,
    description: `${repair.name} for ${parsed ? `${makeName} ${modelName}` : "all vehicle types"} typically costs ${formatRange(repair.overallMin, repair.overallMax)}. Compare prices across 5 vehicle tiers.`,
    datePublished: new Date().toISOString(),
    publisher: { "@type": "Organization", name: "AutOwner" },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.autowner.com/" },
      { "@type": "ListItem", position: 2, name: "Repair Costs", item: "https://www.autowner.com/repair-cost" },
      ...(parsed
        ? [{ "@type": "ListItem", position: 3, name: repair.name, item: `https://www.autowner.com/repair-cost/${repairSlug}` },
           { "@type": "ListItem", position: 4, name: `${makeName} ${modelName}` }]
        : [{ "@type": "ListItem", position: 3, name: repair.name }]
      ),
    ],
  };

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <Navbar />

      <main id="main-content" className="max-w-4xl mx-auto px-5 py-6 flex-1 w-full">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

        {/* Breadcrumb */}
        <nav className="mb-4 flex items-center gap-2 text-sm text-text-muted font-heading" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <svg className="w-3 h-3 text-surface-border" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <Link href="/repair-cost" className="hover:text-primary transition-colors">Repair Costs</Link>
          {parsed && (
            <>
              <svg className="w-3 h-3 text-surface-border" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              <Link href={`/repair-cost/${repairSlug}`} className="hover:text-primary transition-colors">{repair.name}</Link>
              <svg className="w-3 h-3 text-surface-border" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              <Link href={`/vehicles/${parsed.makeSlug}/${parsed.modelSlug}`} className="hover:text-primary transition-colors">{makeName} {modelName}</Link>
            </>
          )}
          {!parsed && (
            <>
              <svg className="w-3 h-3 text-surface-border" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              <span className="text-text-secondary truncate">{repair.name}</span>
            </>
          )}
        </nav>

        {/* Title + Image */}
        <div className="flex items-start gap-4 sm:gap-5 mb-6">
          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            {parsed && vehicleImageUrl && (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-surface-2 border border-surface-border">
                <img src={vehicleImageUrl} alt={`${makeName} ${modelName}`} className="w-full h-full object-cover" loading="lazy" />
              </div>
            )}
            {(() => {
              const img = getRepairImageUrl(repair.slug.replace(/_/g, "-"));
              if (!img) return null;
              return (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-surface-2 border border-surface-border">
                  <img src={img} alt={repair.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
              );
            })()}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary mb-2">
              {parsed ? `${makeName} ${modelName} ${repair.name} Cost` : repair.name}
            </h1>
            <p className="text-text-muted text-sm leading-relaxed">
              {parsed
                ? `What does a ${repair.name.toLowerCase()} cost for a ${makeName} ${modelName}? Get the estimated price range, labor vs. parts breakdown, and related recalls.`
                : `Compare repair cost estimates across 5 vehicle tiers, including labor and parts breakdown. All prices are estimates based on ${confidenceLabel(repair.confidence).toLowerCase()}.`}
            </p>
          </div>
        </div>

        {/* Price Summary Card */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-6">
          <div className="text-center">
            <p className="text-xs font-heading font-bold text-text-muted uppercase tracking-wider mb-2">
              {parsed && vehicleTierCard ? `Estimated Cost for ${makeName} ${modelName}` : "Estimated Cost Range"}
            </p>
            <p className="text-3xl sm:text-4xl font-heading font-bold text-text-primary mb-1">
              {parsed && vehicleTierCard
                ? formatRange(vehicleTierCard.min, vehicleTierCard.max)
                : formatRange(repair.overallMin, repair.overallMax)}
            </p>
            <p className="text-sm text-text-muted">
              Average: <strong className="text-text-secondary">{formatMoney(parsed && vehicleTierCard ? vehicleTierCard.avg : repair.overallAvg)}</strong>
              {parsed && vehicleTierCard && (
                <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-heading font-bold">
                  {vehicleTierCard.tierLabel}
                </span>
              )}
              {" · "}
              <span className="inline-flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${repair.confidence === "high" ? "bg-green-500" : repair.confidence === "medium" ? "bg-yellow-500" : "bg-red-500"}`} />
                {confidenceLabel(repair.confidence)}
              </span>
            </p>
          </div>
        </div>

        {/* Safety Recalls (vehicle-specific only) */}
        {parsed && makeName && (
          <div className="bg-amber-50/30 dark:bg-amber-950/10 rounded-2xl border border-severity-caution-border p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-severity-caution-bg flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-severity-caution" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-heading font-bold text-text-primary mb-1">Check for Open Safety Recalls</h2>
                <p className="text-sm text-text-secondary mb-3">
                  Your {makeName} {modelName} may have open safety recalls. Repairs covered by a recall are <strong>free</strong> at dealerships.
                </p>
                <Link
                  href={`/recall-check?make=${encodeURIComponent(makeName)}&model=${encodeURIComponent(modelName)}&year=2020`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl transition-colors font-heading"
                >
                  Check Recalls Now →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Price Breakdown by Vehicle Tier */}
        <section className="mb-6">
          <h2 className="text-lg font-heading font-bold text-text-primary mb-4">
            Cost by Vehicle Tier
          </h2>
          <div className="space-y-3">
            {tierCards.map((tier) => {
              const isActive = vehicleTier === tier.tier;
              return (
              <div
                key={tier.tier}
                className={`rounded-xl border-2 p-4 transition-all duration-150 ${
                  isActive
                    ? "border-primary/40 bg-primary/5 shadow-sm"
                    : "bg-surface-1 border-surface-border hover:border-primary/20 hover:shadow-sm"
                }`}
              >
                {isActive && (
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-xs font-heading font-bold text-primary uppercase tracking-wider">Your Vehicle Tier</span>
                  </div>
                )}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className={`text-sm font-heading font-bold ${isActive ? "text-primary" : "text-text-primary"}`}>
                    {TIER_LABELS[tier.tier] ?? tier.tierLabel}
                  </h3>
                  <div className="flex items-center gap-3 shrink-0">
                    <p className={`text-lg font-heading font-bold ${isActive ? "text-primary" : "text-text-primary"}`}>
                      {formatRange(tier.min, tier.max)}
                    </p>
                    <span className="text-xs font-heading text-text-muted">
                      {tier.confidence === "high" ? "High confidence" : tier.confidence === "medium" ? "Medium confidence" : "Estimate"}
                    </span>
                  </div>
                </div>
                <div className="bg-surface-0 rounded-xl border border-surface-border p-3">
                  <p className="text-xs font-heading font-bold text-text-primary mb-2">
                    Average cost: <span className="text-base">{formatMoney(tier.avg)}</span>
                  </p>
                  <div className="space-y-2">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-text-muted">Labor</span>
                        <span className="text-text-secondary font-medium">{formatMoney(tier.labor)} ({Math.round((tier.labor / (tier.labor + tier.parts)) * 100)}%)</span>
                      </div>
                      <div className="w-full h-2 bg-surface-3 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${Math.round((tier.labor / (tier.labor + tier.parts)) * 100)}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-text-muted">Parts</span>
                        <span className="text-text-secondary font-medium">{formatMoney(tier.parts)} ({Math.round((tier.parts / (tier.labor + tier.parts)) * 100)}%)</span>
                      </div>
                      <div className="w-full h-2 bg-surface-3 rounded-full overflow-hidden">
                        <div className="h-full bg-amber dark:bg-amber-dark rounded-full transition-all" style={{ width: `${Math.round((tier.parts / (tier.labor + tier.parts)) * 100)}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              );
            })}
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
              href={`/quote-checker?repair=${encodeURIComponent(repair.name)}${parsed ? `&make=${encodeURIComponent(makeName)}&model=${encodeURIComponent(modelName)}` : ""}`}
              className="flex items-center justify-between sm:inline-flex sm:gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold font-heading rounded-lg hover:bg-primary-glow hover:-translate-y-px transition-all duration-150 shadow-sm shadow-primary/20 shrink-0"
            >
              Check your quote
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </Link>
          </div>
        </div>

        {/* Factors Affecting Price */}
        <div className="bg-surface-1 rounded-xl border border-surface-border p-5 mb-6">
          <h2 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-3">Factors Affecting Price</h2>
          <ul className="space-y-2">
            {[
              ["Vehicle make and model", "luxury and European vehicles typically cost more due to specialized parts and higher labor rates."],
              ["Labor rates", "vary by region, from $80/hour in rural areas to $200+/hour at dealerships in major cities."],
              ["OEM vs aftermarket parts", "OEM parts cost 30-50% more but often come with better warranties."],
              ["Shop type", "dealerships charge the most, independent shops less, and chain shops fall in between."],
              ["Additional repairs", "sometimes related components need replacement, increasing total cost."],
            ].map(([label, desc]) => (
              <li key={label} className="flex items-start gap-2.5 text-sm text-text-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <span><strong>{label}</strong> &mdash; {desc}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* DIY Assessment */}
        <DiySection repairName={repair.name} tierCards={tierCards} parsed={parsed} makeName={makeName} modelName={modelName} />

        {/* Common OBD Codes */}
        {obdCodes.length > 0 && (
          <div className="bg-surface-1 rounded-xl border border-surface-border p-5 mb-4">
            <h2 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-3">Related OBD-II Codes</h2>
            <p className="text-text-muted text-xs mb-3">These diagnostic trouble codes are commonly related to {repair.name.toLowerCase()}:</p>
            <div className="space-y-2">
              {obdCodes.map((obd) => (
                <Link key={obd.code} href={`/obd/${obd.code.toLowerCase()}`}
                  className="group flex items-center gap-3 px-4 py-2.5 rounded-xl bg-surface-0 border border-surface-border border-l-4 border-l-primary/40 hover:border-primary/30 hover:border-l-primary hover:bg-primary/5 transition-all">
                  <span className="text-sm font-mono font-bold text-primary shrink-0">{obd.code}</span>
                  <span className="h-4 w-px bg-surface-border shrink-0" />
                  <span className="text-xs text-text-secondary truncate flex-1 min-w-0">{obd.title}</span>
                  <svg className="w-3.5 h-3.5 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
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
                    className="group flex items-center gap-3 px-4 py-2.5 rounded-xl bg-surface-0 border border-surface-border hover:border-primary/30 hover:bg-primary/5 transition-all">
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-surface-2">
                      <img src={`/warning-lights/${light.slug}.jpg`} alt={light.title} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <span className="text-sm font-heading font-semibold text-text-primary group-hover:text-primary transition-colors truncate flex-1 min-w-0">{light.title}</span>
                    <svg className="w-3.5 h-3.5 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
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
            <Link href={`/symptom-checker${parsed ? `?make=${encodeURIComponent(makeName)}&model=${encodeURIComponent(modelName)}` : ""}`} className="flex items-center justify-between sm:inline-flex sm:gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold font-heading rounded-lg hover:bg-primary-glow hover:-translate-y-px transition-all duration-150 shadow-sm shadow-primary/20 shrink-0">
              Diagnose with AI
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
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
            {popularVehicles.slice(0, 20).map((v) => {
              const compositeSlug = `${repairSlug}-${v.makeSlug}-${v.modelSlug}`;
              return (
                <Link
                  key={`${v.makeSlug}-${v.modelSlug}`}
                  href={`/repair-cost/${compositeSlug}`}
                  className="group flex items-center justify-between px-3 py-2 rounded-lg bg-surface-0 border border-surface-border text-xs font-medium text-text-secondary hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-colors font-heading"
                  title={`${v.makeName} ${v.modelName} ${repair.name}`}
                >
                  <span className="truncate">{v.makeName} {v.modelName}</span>
                  <svg className="w-3 h-3 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </Link>
              );
            })}
          </div>
          <Link href="/vehicles" className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-primary hover:text-primary-glow transition-colors font-heading">
            Browse all vehicles →
          </Link>
        </div>

        {/* FAQ */}
        <div className="bg-surface-1 rounded-xl border border-surface-border p-5 mb-4">
          <h2 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-4">Frequently Asked Questions</h2>
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
              <strong className="text-text-secondary">Disclaimer:</strong> Prices are estimates only and may vary by location, vehicle condition, shop rates, and parts availability. Always get multiple quotes before authorizing repairs. Use our{" "}
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

// ── DIY Assessment Component ──────────────────────────────

const DIY_CONFIG: Record<string, { difficulty: string; level: "easy" | "moderate" | "hard"; tools: string[]; safety: string; timeHours: number }> = {
  brakes: {
    difficulty: "Moderate", level: "moderate",
    tools: ["Socket set", "Jack + jack stands", "Lug wrench", "C-clamp or brake caliper tool", "Brake grease", "Torque wrench"],
    safety: "Always use jack stands — never work under a car supported only by a jack. Wear gloves and eye protection.",
    timeHours: 1.5,
  },
  engine: {
    difficulty: "Hard", level: "hard",
    tools: ["Socket set", "Torque wrench", "Jack + jack stands", "Multimeter", "OBD-II scanner", "Gasket scraper"],
    safety: "Let engine cool completely before starting. Disconnect battery negative terminal. Have a fire extinguisher nearby.",
    timeHours: 3,
  },
  transmission: {
    difficulty: "Hard", level: "hard",
    tools: ["Socket set", "Drain pan", "Transmission jack", "Torque wrench", "Fluid pump", "Safety glasses"],
    safety: "Fluid may be hot — let cool first. Use proper support for the transmission. Dispose of old fluid at a recycling center.",
    timeHours: 3.5,
  },
  suspension: {
    difficulty: "Hard", level: "hard",
    tools: ["Socket set", "Breaker bar", "Jack + jack stands", "Spring compressor", "Torque wrench", "Ball joint separator"],
    safety: "Spring compressors can be lethal — follow instructions exactly. Have wheel aligned after suspension work.",
    timeHours: 2.5,
  },
  electrical: {
    difficulty: "Moderate", level: "moderate",
    tools: ["Socket set", "Multimeter", "OBD-II scanner", "Wire stripper + connectors", "Dielectric grease", "Zip ties"],
    safety: "Disconnect battery negative terminal before working on electrical components. Never bypass fuses.",
    timeHours: 1.5,
  },
  ac_heating: {
    difficulty: "Hard", level: "hard",
    tools: ["A/C manifold gauge set", "Vacuum pump", "Refrigerant", "Socket set", "UV leak detection kit"],
    safety: "Refrigerant requires EPA certification to handle legally. Consider hiring a pro for A/C repairs.",
    timeHours: 3,
  },
  exhaust: {
    difficulty: "Moderate", level: "moderate",
    tools: ["Socket set", "Penetrating oil", "Jack + jack stands", "Exhaust hanger tool", "Gloves", "Safety glasses"],
    safety: "Exhaust components get very hot. Let cool completely. Use penetrating oil on rusty bolts overnight.",
    timeHours: 2,
  },
  maintenance: {
    difficulty: "Easy", level: "easy",
    tools: ["Socket set", "Drain pan", "Funnel", "Filter wrench", "Gloves", "Shop towels"],
    safety: "Let fluids cool before draining. Dispose of used oil and filters at a recycling center. Never pour down drains.",
    timeHours: 0.75,
  },
  glass_body: {
    difficulty: "Moderate", level: "moderate",
    tools: ["Trim removal tool", "Socket set", "Screwdrivers", "Panel clip pliers", "Torx bit set"],
    safety: "Wear gloves when handling glass. Use proper support when removing heavy panels.",
    timeHours: 1.5,
  },
};

function categorizeRepair(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("brake") || n.includes("rotor") || n.includes("caliper") || n.includes("pad")) return "brakes";
  if (n.includes("engine") || n.includes("timing") || n.includes("head gasket") || n.includes("valve") || n.includes("spark") || n.includes("ignition") || n.includes("fuel") || n.includes("injector") || n.includes("belt") || n.includes("mount") || n.includes("pcv") || n.includes("throttle") || n.includes("turbo")) return "engine";
  if (n.includes("transmission") || n.includes("clutch") || n.includes("differential") || n.includes("transfer case") || n.includes("cv axle")) return "transmission";
  if (n.includes("strut") || n.includes("shock") || n.includes("ball joint") || n.includes("tie rod") || n.includes("control arm") || n.includes("wheel bearing") || n.includes("power steering")) return "suspension";
  if (n.includes("alternator") || n.includes("starter") || n.includes("battery") || n.includes("sensor") || n.includes("window") || n.includes("door lock") || n.includes("wiring")) return "electrical";
  if (n.includes("ac") || n.includes("air condition") || n.includes("compressor") || n.includes("heater") || n.includes("blower") || n.includes("evaporator") || n.includes("cabin")) return "ac_heating";
  if (n.includes("catalytic") || n.includes("muffler") || n.includes("egr") || n.includes("exhaust") || n.includes("o2 sensor") || n.includes("oxygen sensor")) return "exhaust";
  if (n.includes("oil change") || n.includes("fluid") || n.includes("filter") || n.includes("flush") || n.includes("windshield") || n.includes("serpentine") || n.includes("coolant")) return "maintenance";
  return "glass_body";
}

function DiySection({ repairName, tierCards, parsed, makeName, modelName }: {
  repairName: string;
  tierCards: any[];
  parsed: any;
  makeName: string;
  modelName: string;
}) {
  const category = categorizeRepair(repairName);
  const config = DIY_CONFIG[category] ?? DIY_CONFIG.glass_body;

  // Use the active tier's labor cost if vehicle-specific, otherwise first tier
  const tierCard = tierCards[0];
  if (!tierCard) return null;
  const laborCost = tierCard.labor;
  const partsCost = tierCard.parts;

  const difficultyColors = {
    easy: "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    moderate: "bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    hard: "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
  };

  return (
    <div className="bg-surface-1 rounded-2xl border border-surface-border p-6 mb-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
        </span>
        <h2 className="text-lg font-heading font-bold text-text-primary">Can You DIY This?</h2>
      </div>

      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border mb-6 ${difficultyColors[config.level]}`}>
        <span className={`w-3 h-3 rounded-full shrink-0 ${config.level === "easy" ? "bg-emerald-500" : config.level === "moderate" ? "bg-amber-500" : "bg-red-500"}`} />
        <span className="text-sm font-heading font-bold">Difficulty: {config.difficulty}</span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-surface-0 rounded-xl border border-surface-border p-4 text-center">
          <p className="text-2xl sm:text-3xl font-heading font-bold text-text-primary mb-1">{config.timeHours}h</p>
          <p className="text-xs text-text-muted font-heading">Estimated Time</p>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800 p-4 text-center">
          <p className="text-2xl sm:text-3xl font-heading font-bold text-emerald-600 dark:text-emerald-400 mb-1">{formatMoney(laborCost)}</p>
          <p className="text-xs text-text-muted font-heading">You Save in Labor</p>
        </div>
      </div>

      <div className="bg-surface-0 rounded-xl border border-surface-border p-4 mb-3">
        <p className="text-xs font-heading font-bold text-text-primary uppercase tracking-wider mb-2">Common Tools Needed</p>
        <div className="flex flex-wrap gap-1.5">
          {config.tools.map((tool) => (
            <span key={tool} className="px-2.5 py-1 rounded-lg bg-surface-1 border border-surface-border text-xs text-text-secondary font-heading">{tool}</span>
          ))}
        </div>
      </div>

      <div className="flex items-start gap-2 bg-red-50/50 dark:bg-red-950/10 rounded-xl border border-red-200/50 dark:border-red-800/50 p-3">
        <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
        <p className="text-xs text-text-secondary leading-relaxed"><strong className="text-text-primary">Safety:</strong> {config.safety}</p>
      </div>
    </div>
  );
}
