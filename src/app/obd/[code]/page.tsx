import type { Metadata } from "next";
import { getObdCode, getRelatedObdCodes } from "@/lib/data/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";

// ── Helpers ──────────────────────────────────────────────

function severityColor(severity: number): { bg: string; text: string; border: string; label: string } {
  switch (severity) {
    case 5:
      return { bg: "#fef2f2", text: "#dc2626", border: "#fecaca", label: "Critical" };
    case 4:
      return { bg: "#fff7ed", text: "#ea580c", border: "#fed7aa", label: "Serious" };
    case 3:
      return { bg: "#fefce8", text: "#ca8a04", border: "#fde68a", label: "Moderate" };
    case 2:
    case 1:
    default:
      return { bg: "#f0fdf4", text: "#16a34a", border: "#bbf7d0", label: "Low" };
  }
}

// Dark-mode severity overrides
function severityStyles(severity: number): string {
  const light = severityColor(severity);
  return `background: ${light.bg}; color: ${light.text}; border-color: ${light.border};`;
}

function severityStylesDark(severity: number): string {
  switch (severity) {
    case 5:
      return "background: #450a0a; color: #fca5a5; border-color: #7f1d1d;";
    case 4:
      return "background: #431407; color: #fdba74; border-color: #7c2d12;";
    case 3:
      return "background: #422006; color: #fde047; border-color: #713f12;";
    case 2:
    case 1:
    default:
      return "background: #052e16; color: #86efac; border-color: #14532d;";
  }
}

// ── Benefit statement helper ────────────────────────────

function generateBenefitStatement(code: string, title: string, fixes: string[]): string {
  const t = title.toLowerCase();
  if (t.includes("catalyst") || t.includes("catalytic")) {
    return "Don't Replace Your Cat Yet";
  }
  if (t.includes("misfire")) {
    if (t.includes("random")) return "Start With Spark Plugs ($40)";
    if (/\bcylinder\s*[1-9]/i.test(t)) return "Swap Coils to Diagnose Free";
    return "Start With Spark Plugs ($40)";
  }
  if (t.includes("lean") && (t.includes("bank") || t.includes("system") || t.includes("fuel"))) {
    return "Usually a $15 Vacuum Leak";
  }
  if (t.includes("rich")) {
    return "Often Just a Dirty MAF Sensor";
  }
  if (t.includes("oxygen") || t.includes("o2 sensor") || t.includes("o2s")) {
    return "Don't Skip the Downstream Sensor";
  }
  if (t.includes("evaporative") || t.includes("evap")) {
    return "Check Your Gas Cap First ($0)";
  }
  if (t.includes("egr")) {
    return "Clean Your EGR Valve First";
  }
  if (t.includes("mass air") || t.includes("maf") || t.includes("mass or volume")) {
    return "Try Cleaning Before Replacing";
  }
  if (t.includes("knock")) {
    return "Could Be Bad Gas or Sensor";
  }
  if (t.includes("injector")) {
    return "Try Cleaner Before Replacing";
  }
  if (t.includes("throttle") || t.includes("idle air") || t.includes("iac")) {
    return "Clean Your Throttle Body First";
  }
  if (t.includes("thermostat") || t.includes("coolant temp")) {
    return "Easy DIY Thermostat Swap";
  }
  if (t.includes("ignition") || t.includes("coil")) {
    return "Swap Coils to Diagnose Free";
  }
  if (t.includes("camshaft") || t.includes("crankshaft")) {
    return "Check Oil Level & Sensor First";
  }
  if (t.includes("turbo") || t.includes("boost") || t.includes("supercharger")) {
    return "Check for Boost Leaks First";
  }
  if (t.includes("abs") || t.includes("brake")) {
    return "Often a Wheel Speed Sensor";
  }
  if (t.includes("airbag") || t.includes("srs")) {
    return "Don't Panic — Often Minor Fix";
  }
  if (t.includes("transmission") || t.includes("trans")) {
    return "Check Fluid Before Major Repairs";
  }
  if (t.includes("emission")) {
    return "Most Fixes Are Under $200";
  }
  if (t.includes("fuel pressure")) {
    return "Check Fuel Filter First ($20)";
  }
  if (t.includes("fuel trim")) {
    return "Start With Vacuum Leak Check";
  }
  if (t.includes("cylinder")) {
    return "Swap Coils to Isolate the Issue";
  }
  // Fallback: use first fix if short
  if (fixes.length > 0 && fixes[0].length < 45) {
    return `Likely Fix: ${fixes[0]}`;
  }
  return "Most Fixes Are Affordable DIY";
}

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params;
  const obd = await getObdCode(code);
  if (!obd) {
    return { title: "OBD Code Not Found — AutOwner" };
  }

  // ── Benefit-driven title ──
  const benefit = generateBenefitStatement(obd.code, obd.title, obd.fixes);
  let pageTitle = `${obd.code}: ${benefit}`;

  // Add cost range if available
  if (obd.min_cost != null && obd.min_cost > 0) {
    let costSuffix: string;
    if (obd.max_cost != null && obd.max_cost !== obd.min_cost) {
      costSuffix = ` ($${obd.min_cost}–$${obd.max_cost})`;
    } else {
      costSuffix = ` (from $${obd.min_cost})`;
    }
    // Only append if total is under 65 chars
    if ((pageTitle + costSuffix).length <= 65) {
      pageTitle += costSuffix;
    }
  }
  pageTitle = pageTitle.length > 65 ? pageTitle.substring(0, 62).replace(/\s+$/, "") + "..." : pageTitle;
  const title = `${pageTitle} — AutOwner`;

  // ── Compelling description ──
  const problemBrief = obd.title.length > 100
    ? obd.title.substring(0, 97).replace(/\s+$/g, "") + "..."
    : obd.title;
  let description = `${obd.code}: ${problemBrief.charAt(0).toLowerCase() + problemBrief.slice(1)}.`;
  if (obd.fixes.length > 0) {
    const cheapestFix = obd.fixes[0];
    description += ` Typical fix: ${cheapestFix}`;
    if (obd.min_cost != null && obd.min_cost > 0) {
      if (obd.max_cost != null && obd.max_cost !== obd.min_cost) {
        description += ` ($${obd.min_cost}–$${obd.max_cost}).`;
      } else {
        description += ` (from $${obd.min_cost}).`;
      }
    } else {
      description += ".";
    }
  }
  description += " Learn symptoms, causes, and all repair options before visiting a mechanic.";

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.autowner.com/obd/${obd.code.toLowerCase()}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: `https://www.autowner.com/obd/${obd.code.toLowerCase()}`,
      images: [
        {
          url: "https://www.autowner.com/og-default.jpg",
          width: 1200,
          height: 630,
          alt: `OBD Code ${obd.code}`,
        },
      ],
    },
  };
}

export default async function ObdCodePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const [obd, relatedCodes] = await Promise.all([
    getObdCode(code),
    getRelatedObdCodes(code, 5),
  ]);

  if (!obd) {
    return <ObdNotFound code={code} />;
  }

  const sev = severityColor(obd.severity);
  const sevDark = severityStylesDark(obd.severity);

  const canonCode = obd.code.toLowerCase();

  // FAQ structured data from symptoms, causes, fixes
  const faqItems: { question: string; answer: string }[] = [];

  if (obd.symptoms.length > 0) {
    faqItems.push({
      question: `What are the symptoms of code ${obd.code}?`,
      answer: obd.symptoms.join(". ") + ".",
    });
  }
  if (obd.causes.length > 0) {
    faqItems.push({
      question: `What causes OBD code ${obd.code}?`,
      answer: obd.causes.join(". ") + ".",
    });
  }
  if (obd.fixes.length > 0) {
    faqItems.push({
      question: `How do you fix OBD code ${obd.code}?`,
      answer: obd.fixes.join(". ") + ".",
    });
  }

  const faqJsonLd =
    faqItems.length > 0
      ? {
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
        }
      : null;

  // Article structured data
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${obd.code}: ${obd.title}`,
    description: `OBD-II diagnostic trouble code ${obd.code}: ${obd.title}. Severity: ${obd.severity}/5.`,
    datePublished: "2024-01-01T00:00:00Z",
    dateModified: new Date().toISOString(),
    author: {
      "@type": "Organization",
      name: "AutOwner",
      url: "https://www.autowner.com",
    },
    publisher: {
      "@type": "Organization",
      name: "AutOwner",
      url: "https://www.autowner.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.autowner.com/obd/${canonCode}`,
    },
  };

  // BreadcrumbList structured data
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.autowner.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "OBD Codes",
        item: "https://www.autowner.com/obd",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: obd.code,
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        {faqJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
          />
        )}

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
          <Link href="/obd" className="hover:text-primary transition-colors">
            OBD Codes
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
          <span className="text-text-secondary truncate">{obd.code}</span>
        </nav>

        {/* Search Box */}
        <form
          action="/obd"
          method="GET"
          className="mb-6"
        >
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
              placeholder="Enter OBD code (e.g. P0420, P0300)..."
              className="w-full h-12 pl-12 pr-5 bg-surface-1 border border-surface-border rounded-xl text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </form>

        {/* Code Header Card */}
        <div className="bg-surface-1 rounded-xl border border-surface-border p-6 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-text-primary tracking-wider">
              {obd.code}
            </h1>
            <span
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold font-heading border"
              style={{
                background: sev.bg,
                color: sev.text,
                borderColor: sev.border,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: sev.text }}
              />
              {sev.label} Severity (Level {obd.severity})
            </span>
          </div>

          <h2 className="text-xl font-heading font-semibold text-text-primary mb-3">
            {obd.title}
          </h2>
          <p className="text-text-muted text-sm leading-relaxed">
            OBD-II diagnostic trouble code <strong className="text-text-secondary">{obd.code}</strong> indicates a
            fault detected by the vehicle&apos;s onboard computer. This code applies to all OBD-II
            compliant vehicles and should be addressed promptly to avoid potential engine or emissions system damage.
          </p>
        </div>

        {/* Severity Explanation */}
        <div className="bg-surface-1 rounded-xl border border-surface-border p-5 mb-4">
          <h3 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-3">
            Severity Level {obd.severity} &mdash; {sev.label}
          </h3>
          <p className="text-text-muted text-sm leading-relaxed">
            {obd.severity <= 2 && (
              <>
                This code indicates a minor issue that is unlikely to cause immediate driveability
                problems. You can typically continue driving but should have the vehicle inspected
                at your earliest convenience.
              </>
            )}
            {obd.severity === 3 && (
              <>
                This code indicates a moderate issue that may affect vehicle performance and fuel
                economy. Continued driving is possible in most cases, but prompt diagnosis and
                repair are recommended to prevent further damage.
              </>
            )}
            {obd.severity === 4 && (
              <>
                This code indicates a serious issue that can cause noticeable driveability problems
                and potential engine damage if not addressed. The vehicle should be taken to a
                mechanic as soon as possible. Extended driving is not recommended.
              </>
            )}
            {obd.severity === 5 && (
              <>
                This code indicates a critical issue that may cause severe engine damage or complete
                engine failure. Stop driving immediately and have the vehicle towed to a repair shop.
                Continuing to drive could result in catastrophic engine damage and costly repairs.
              </>
            )}
          </p>
        </div>

        {/* Symptoms */}
        {obd.symptoms.length > 0 && (
          <div className="bg-surface-1 rounded-xl border border-surface-border p-5 mb-4">
            <h3 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-3">
              Common Symptoms
            </h3>
            <ul className="space-y-2">
              {obd.symptoms.map((s, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-text-secondary">
                  <svg
                    className="w-4 h-4 text-amber dark:text-amber-dark mt-0.5 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Possible Causes */}
        {obd.causes.length > 0 && (
          <div className="bg-surface-1 rounded-xl border border-surface-border p-5 mb-4">
            <h3 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-3">
              Possible Causes
            </h3>
            <ul className="space-y-2">
              {obd.causes.map((c, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-text-secondary">
                  <svg
                    className="w-4 h-4 text-text-muted mt-0.5 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Common Fixes */}
        {obd.fixes.length > 0 && (
          <div className="bg-surface-1 rounded-xl border border-surface-border p-5 mb-4">
            <h3 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-3">
              Common Fixes
            </h3>
            <ul className="space-y-2">
              {obd.fixes.map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-text-secondary">
                  <svg
                    className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Estimated Repair Cost */}
        {obd.min_cost != null && obd.max_cost != null && (
          <div className="bg-surface-1 rounded-xl border border-surface-border p-5 mb-4">
            <h3 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-3">
              Estimated Repair Cost
            </h3>
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-text-primary font-heading">
                ${obd.min_cost} &ndash; ${obd.max_cost}
              </span>
              <span className="text-xs text-text-muted">
                (typical range; varies by vehicle make and model)
              </span>
            </div>
            <p className="mt-2 text-xs text-text-muted">
              These are estimated costs based on generic repair data. Actual costs may vary depending
              on your vehicle, location, and labor rates.
            </p>
          </div>
        )}

        {/* Cross-links from cost section */}
        <div className="bg-surface-1 rounded-xl border border-surface-border p-5 mb-4">
          <h3 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-3">
            Explore Repair Costs
          </h3>
          <div className="space-y-2">
            <Link
              href="/repair-cost"
              className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-glow transition-colors"
            >
              See detailed cost breakdown by vehicle type
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <Link
              href="/quote-checker"
              className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-glow transition-colors"
            >
              Have a mechanic&apos;s quote? Verify it here
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Related OBD-II Codes */}
        {relatedCodes.length > 0 && (
          <div className="bg-surface-1 rounded-xl border border-surface-border p-5 mb-4">
            <h3 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-3">
              Related OBD-II Codes
            </h3>
            <p className="text-text-muted text-sm mb-3">
              These codes are in the same range as {obd.code} and often share similar causes and fixes.
            </p>
            <div className="flex flex-wrap gap-2">
              {relatedCodes.map((rel) => (
                <Link
                  key={rel.code}
                  href={`/obd/${rel.code.toLowerCase()}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-0 border border-surface-border text-sm font-mono font-bold text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors"
                >
                  {rel.code}
                  <span className="text-text-muted font-sans font-normal text-xs">
                    &mdash; {rel.title.length > 50 ? rel.title.substring(0, 47) + "..." : rel.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <h3 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-1">
                Worried about repair costs?
              </h3>
              <p className="text-text-muted text-sm">
                Get transparent estimates and verify your mechanic&apos;s quote before authorizing repairs.
              </p>
            </div>
            <Link
              href="/quote-checker"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold font-heading rounded-lg hover:bg-primary-glow hover:-translate-y-px transition-all duration-150 shadow-sm shadow-primary/20 shrink-0"
            >
              Check your quote
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Related Forum Posts */}
        <div className="bg-surface-1 rounded-xl border border-surface-border p-5 mb-4">
          <h3 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-3">
            Related Discussions
          </h3>
          <p className="text-text-muted text-sm mb-3">
            See what other car owners are saying about this code and related repairs.
          </p>
          <Link
            href={`/community?search=${encodeURIComponent(obd.code)}`}
            className="inline-flex items-center gap-2 text-sm font-semibold font-heading text-primary hover:text-primary-glow transition-colors"
          >
            View {obd.code} discussions in the community
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// ── Not Found View ──────────────────────────────────────

function ObdNotFound({ code }: { code: string }) {
  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <Navbar />
      <main className="max-w-4xl mx-auto px-5 py-16 flex-1 w-full text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-surface-1 border border-surface-border flex items-center justify-center">
          <svg
            className="w-8 h-8 text-text-muted"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h1 className="text-2xl font-heading font-bold text-text-primary mb-2">
          Code Not Found
        </h1>
        <p className="text-text-muted text-sm mb-6 max-w-md mx-auto">
          OBD code &ldquo;<strong className="text-text-secondary">{code.toUpperCase()}</strong>&rdquo; was not found
          in our database. This may be a manufacturer-specific code or an invalid code format.
        </p>

        <form action="/obd" method="GET" className="max-w-md mx-auto">
          <label className="block text-sm font-heading font-semibold text-text-secondary mb-2">
            Try searching for a different code:
          </label>
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
              placeholder="Enter OBD code (e.g. P0420, P0300)..."
              className="w-full h-12 pl-12 pr-5 bg-surface-1 border border-surface-border rounded-xl text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <div className="mt-4">
            <Link
              href="/obd"
              className="text-sm font-semibold font-heading text-primary hover:text-primary-glow transition-colors"
            >
              Browse all OBD codes
            </Link>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}
