import type { Metadata } from "next";
import { getObdCode, getRelatedObdCodes } from "@/lib/data/server";
import { getRelatedRepairs } from "@/lib/internal-linking";
import { getRepairImageUrl } from "@/lib/repair-images";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createServiceSupabase } from "@/lib/supabase-server";

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

// ── Driving safety advice ────────────────────────────────

function getDrivingAdvice(severity: number): { emoji: string; text: string; bgClass: string; borderClass: string } {
  if (severity >= 5) {
    return {
      emoji: "⚠️",
      text: "Stop driving — this code indicates a critical issue that could cause severe engine damage or safety risk. Tow to a shop immediately.",
      bgClass: "bg-red-50 dark:bg-red-950",
      borderClass: "border-red-200 dark:border-red-800",
    };
  }
  if (severity === 4) {
    return {
      emoji: "⚠️",
      text: "Limited driving — get to a repair shop within 1–2 days. Avoid long trips and highway speeds.",
      bgClass: "bg-orange-50 dark:bg-orange-950",
      borderClass: "border-orange-300 dark:border-orange-800",
    };
  }
  if (severity >= 2) {
    return {
      emoji: "⚠️",
      text: "Short-distance driving is usually OK, but have this diagnosed within a week to prevent further damage.",
      bgClass: "bg-yellow-50 dark:bg-yellow-950",
      borderClass: "border-yellow-300 dark:border-yellow-800",
    };
  }
  return {
    emoji: "✅",
    text: "Safe to drive — this is an informational or minor issue. Schedule diagnosis at your convenience.",
    bgClass: "bg-green-50 dark:bg-green-950",
    borderClass: "border-green-300 dark:border-green-800",
  };
}

// ── Natural language intro helper ────────────────────────

function generateNaturalIntro(obd: { code: string; title: string; symptoms: string[]; causes: string[]; severity: number }): string {
  const parts: string[] = [];
  if (obd.causes.length > 0) {
    parts.push(`Commonly triggered by ${obd.causes.slice(0, 2).join(" or ").toLowerCase()}.`);
  }
  if (obd.symptoms.length > 0) {
    const symptomList = obd.symptoms.slice(0, 3).join(", ").toLowerCase();
    parts.push(`Symptoms may include ${symptomList}.`);
  }
  if (obd.severity >= 5) {
    parts.push("This is a critical issue — do not continue driving.");
  } else if (obd.severity >= 4) {
    parts.push("Have this diagnosed promptly to avoid further damage.");
  }
  return parts.join(" ");
}

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params;
  const obd = await getObdCode(code);
  if (!obd) {
    return { title: "OBD Code Not Found" };
  }

  const title = `${obd.code} Code: Meaning, Repair Cost & Can You Still Drive?`;

  const costRange = obd.min_cost != null && obd.max_cost != null
    ? `$${obd.min_cost}–$${obd.max_cost}`
    : null;
  const costText = costRange
    ? `Repair costs typically ${costRange}. `
    : "";
  const description = `${costText}Learn what ${obd.code} means, common causes, symptoms, and whether it's safe to keep driving.`;

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
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://www.autowner.com/og-default.jpg"],
    },
  };
}

export default async function ObdCodePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;

  const [obd, relatedCodes] = await Promise.all([
    getObdCode(code),
    getRelatedObdCodes(code, 5),
  ]);

  // Fetch related diagnoses that mention this OBD code
  let relatedDiagnoses: { slug: string; title: string; severity: string }[] = [];
  try {
    const diagSupabase = await createServiceSupabase();
    const { data: diagData } = await diagSupabase.from("diagnoses")
      .select("slug, diagnosis_json, view_count")
      .contains("diagnosis_json", { possibleCodes: [obd?.code ?? code.toUpperCase()] })
      .order("view_count", { ascending: false })
      .limit(5);
    relatedDiagnoses = ((diagData ?? []) as unknown as import("@/lib/types").Diagnosis[]).map((d) => ({
      slug: d.slug,
      title: d.diagnosis_json?.title ?? "Car Diagnosis",
      severity: d.diagnosis_json?.severity ?? "medium",
    }));
  } catch { /* diagnoses fetch failed, skip */ }

  const relatedRepairs = getRelatedRepairs(obd?.title ?? "", 3);

  if (!obd) {
    return <ObdNotFound code={code} />;
  }

  const sev = severityColor(obd.severity);
  const sevDark = severityStylesDark(obd.severity);
  const driving = getDrivingAdvice(obd.severity);
  const naturalIntro = generateNaturalIntro(obd);

  const canonCode = obd.code.toLowerCase();

  // ── FAQ items ──────────────────────────────────────────

  const faqItems: { question: string; answer: string }[] = [];

  // 1. What does {CODE} mean?
  const meaningAnswer = obd.title
    ? `${obd.code} stands for "${obd.title}". ${naturalIntro}`
    : `${obd.code} is a diagnostic trouble code that indicates ${naturalIntro}`;
  faqItems.push({
    question: `What does ${obd.code} mean?`,
    answer: meaningAnswer,
  });

  // 2. Can you drive with {CODE}?
  faqItems.push({
    question: `Can you drive with ${obd.code}?`,
    answer: driving.text.replace(/^[⚠️✅]\s*/, ""),
  });

  // 3. How much does it cost to fix {CODE}?
  let costAnswer: string;
  if (obd.min_cost != null && obd.max_cost != null && obd.min_cost > 0) {
    if (obd.max_cost !== obd.min_cost) {
      costAnswer = `Repair costs for ${obd.code} typically range from $${obd.min_cost} to $${obd.max_cost}, depending on your vehicle make, model, and local labor rates. `;
    } else {
      costAnswer = `The typical repair cost for ${obd.code} starts at approximately $${obd.min_cost}, though costs vary by vehicle and location. `;
    }
  } else {
    costAnswer = `Repair costs for ${obd.code} vary widely depending on the root cause, your vehicle, and local labor rates. `;
  }
  if (obd.fixes.length > 0) {
    costAnswer += `Common fixes include: ${obd.fixes.slice(0, 3).join("; ")}.`;
  } else {
    costAnswer += `A professional diagnosis is recommended to determine the exact cause and cost.`;
  }
  faqItems.push({
    question: `How much does it cost to fix ${obd.code}?`,
    answer: costAnswer,
  });

  // 4. Will {CODE} clear itself?
  let clearAnswer: string;
  if (obd.severity <= 1) {
    clearAnswer = `${obd.code} may clear itself after a few drive cycles if the underlying issue was temporary (such as a loose gas cap or minor sensor glitch). However, if the underlying problem persists, the code will return. It's best to have the vehicle diagnosed even if the light goes off.`;
  } else if (obd.severity <= 3) {
    clearAnswer = `${obd.code} is unlikely to clear itself permanently. Even if the check engine light turns off temporarily, the underlying issue typically remains and the code will return. Proper diagnosis and repair are recommended.`;
  } else {
    clearAnswer = `${obd.code} will not clear itself. This code indicates a serious issue that requires immediate attention. The check engine light will remain on until the problem is properly diagnosed and repaired.`;
  }
  faqItems.push({
    question: `Will ${obd.code} clear itself?`,
    answer: clearAnswer,
  });

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
    description: `Learn what ${obd.code} means, common symptoms, repair costs, and whether it's safe to keep driving.`,
    datePublished: new Date().toISOString(),
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


        {/* Code Header Card */}
        <div className="bg-surface-1 rounded-xl border border-surface-border p-6 mb-4 border-l-4" style={{ borderLeftColor: sev.text }}>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <h1 className="text-3xl sm:text-4xl font-mono font-bold text-text-primary tracking-wider">
              {obd.code}
            </h1>
            <Link
              href={`/obd/severity-levels?level=${obd.severity}`}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-full text-xs font-bold font-heading border hover:ring-2 hover:ring-offset-1 hover:ring-offset-surface-0 transition-all"
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
            </Link>
          </div>

          <div className="border-t border-surface-border pt-3">
            <p className="text-xl sm:text-2xl font-heading font-bold text-text-primary mb-3">
              {obd.title}
            </p>
            <p className="text-text-secondary text-sm leading-relaxed">
              {naturalIntro}
            </p>
          </div>
        </div>

        {/* NEW: Above-the-Fold "Can you still drive?" Answer Block */}
        <div className={`${driving.bgClass} rounded-xl border-2 ${driving.borderClass} p-5 mb-4`}>
          <h2 className="text-base font-heading font-bold text-text-primary mb-2">
            Can you still drive with {obd.code}?
          </h2>
          <p className="text-sm leading-relaxed text-text-secondary mb-3">
            <span className="mr-1.5">{driving.emoji}</span>
            {driving.text}
          </p>
        </div>


        {/* Symptoms */}
        {obd.symptoms.length > 0 && (
          <div className="bg-surface-1 rounded-xl border border-surface-border p-5 mb-4">
            <h2 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-3">
              Common Symptoms
            </h2>
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
            <h2 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-3">
              Possible Causes
            </h2>
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
            <h2 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-3">
              Common Fixes
            </h2>
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
            <h2 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-3">
              Estimated Repair Cost
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-3">
              <span className="text-2xl font-bold text-text-primary font-heading">
                ${obd.min_cost} &ndash; ${obd.max_cost}
              </span>
              <span className="text-xs text-text-muted">
                Typical range; varies by vehicle make, model, and local labor rates.
              </span>
            </div>
            <Link href="/repair-cost" className="inline-flex items-center gap-1 mt-3 text-xs font-heading font-semibold text-primary hover:text-primary-glow transition-colors">
              See all repair cost estimates
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </Link>
            <div className="mt-4 pt-4 border-t border-surface-border">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1">
                  <p className="text-sm font-heading font-semibold text-text-primary">Worried about repair costs?</p>
                  <p className="text-xs text-text-muted">Get transparent estimates and verify your mechanic&apos;s quote before authorizing repairs.</p>
                </div>
                <Link href="/quote-checker" className="flex items-center justify-between sm:inline-flex gap-2 px-4 py-2 bg-primary text-white text-xs font-semibold font-heading rounded-lg hover:bg-primary-glow transition-all sm:shrink-0">
                  Check your quote
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Related Repairs */}
        {relatedRepairs.length > 0 && (
          <div className="bg-surface-1 rounded-xl border border-surface-border p-5 mb-4">
            <h2 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-3">Related Repairs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {relatedRepairs.map((repair) => {
                const img = getRepairImageUrl(repair.slug);
                return (
                  <Link key={repair.slug} href={`/repair-cost/${repair.slug}`}
                    className="flex items-center gap-3 p-2 rounded-lg bg-surface-0 border border-surface-border hover:border-primary/30 hover:bg-primary/5 transition-all group">
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-surface-2">
                      {img && <img src={img} alt={repair.name} className="w-full h-full object-cover" loading="lazy" />}
                    </div>
                    <span className="text-sm font-medium text-text-primary font-heading truncate flex-1 min-w-0">{repair.name}</span>
                    <svg className="w-4 h-4 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Related OBD-II Codes */}
        {relatedCodes.length > 0 && (
          <div className="bg-surface-1 rounded-xl border border-surface-border p-5 mb-4">
            <h2 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-3">
              Related OBD-II Codes
            </h2>
            <p className="text-text-muted text-sm mb-3">
              These codes are in the same range as {obd.code} and often share similar causes and fixes.
            </p>
            <div className="space-y-1.5">
              {relatedCodes.map((rel) => (
                <Link key={rel.code} href={`/obd/${rel.code.toLowerCase()}`}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-surface-0 border border-surface-border hover:border-primary/30 hover:bg-primary/5 transition-colors group">
                  <span className="w-14 sm:w-16 text-sm font-mono font-bold text-primary shrink-0 text-right">{rel.code}</span>
                  <span className="flex-1 min-w-0 text-xs text-text-secondary font-heading truncate">{rel.title}</span>
                  <svg className="w-3.5 h-3.5 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </Link>
              ))}
            </div>
            <Link href="/obd" className="inline-flex items-center gap-1 mt-3 text-xs font-heading font-semibold text-primary hover:text-primary-glow transition-colors">
              Browse all 12,000+ codes
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </Link>
          </div>
        )}

        {/* Related Symptom Diagnoses */}
        {relatedDiagnoses.length > 0 && (
          <div className="bg-surface-1 rounded-xl border border-surface-border p-5 mb-4">
            <h2 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-3">
              {obd.code} Symptoms & Diagnosis
            </h2>
            <p className="text-xs text-text-muted mb-3">People with this code often experience these symptoms:</p>
            <div className="space-y-2">
              {relatedDiagnoses.map((d) => (
                <Link key={d.slug} href={`/symptom-checker/${d.slug}`} className="flex items-center justify-between p-3 bg-surface-0 rounded-lg border border-surface-border hover:border-primary/30 hover:bg-primary/5 transition-colors group">
                  <span className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors">{d.title}</span>
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${d.severity === "critical" ? "bg-red-50 text-red-700" : d.severity === "high" ? "bg-orange-50 text-orange-700" : "bg-amber-50 text-amber-700"} font-heading`}>{d.severity}</span>
                </Link>
              ))}
            </div>
          </div>
        )}



        {/* FAQ */}
        {faqItems.length > 0 && (
          <div className="bg-surface-1 rounded-xl border border-surface-border p-5 mb-4">
            <h2 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-4">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqItems.map((item, i) => (
                <details key={i} className="group" open={i === 0}>
                  <summary className="flex items-center gap-2 cursor-pointer list-none font-heading font-semibold text-sm text-text-primary hover:text-primary transition-colors select-none py-2.5 min-h-[44px]">
                    <svg className="w-4 h-4 shrink-0 transition-transform group-open:rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                    {item.question}
                  </summary>
                  <p className="mt-2 ml-6 text-sm text-text-secondary leading-relaxed">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        )}

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
