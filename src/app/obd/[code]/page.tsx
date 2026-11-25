import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE } from "@/lib/constants";
import { unstable_cache } from "next/cache";
import { getObdCode, getRelatedObdCodes, getObdDiagnosticSteps, getVehicleRepairSlugs, getValidRepairSlugs } from "@/lib/data/server";
import { getRelatedRepairs } from "@/lib/internal-linking";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageFeedback from "@/components/PageFeedback";
import ObdDiagnosticFunnel from "@/components/ObdDiagnosticFunnel";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createServiceSupabase } from "@/lib/supabase-server";
import Breadcrumbs from "@/components/content/Breadcrumbs";
import PageHeader from "@/components/content/PageHeader";
import QuickVerdict from "@/components/content/QuickVerdict";
import ContentSection from "@/components/content/ContentSection";
import CostSummary from "@/components/content/CostSummary";
import ContinueSolving from "@/components/content/ContinueSolving";
import FaqList from "@/components/content/FaqList";
import AdSlot from "@/components/content/AdSlot";

export const revalidate = 2592000;
export const dynamic = "force-static";

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

// ── Natural language intro ────────────────────────────────

function generateNaturalIntro(obd: { code: string; title: string; symptoms: string[]; causes: string[]; severity: number }): string {
  const causeText = obd.causes.length > 0
    ? `The most common cause is ${obd.causes[0].toLowerCase()}.`
    : "";
  const symptomText = obd.symptoms.length > 0
    ? `Drivers typically notice ${obd.symptoms.slice(0, 2).join(" and ").toLowerCase()}.`
    : "";
  return `${obd.code} indicates "${obd.title}". ${causeText} ${symptomText}`.trim();
}

/**
 * Related diagnoses used to select slug + diagnosis_json + view_count for every
 * JSONB match before sorting. A popular code matches thousands of rows and each
 * diagnosis_json is several KB, so a single render could materialise megabytes.
 * Sort on the small columns only, pull titles from the lightweight
 * diagnosis_summaries view afterwards, and cache the result per code.
 */
// Once we learn that migration 039 has not been applied, stop re-issuing the
// column query (and logging 42703) for the lifetime of this instance.
let possibleCodesReady: boolean | null = null;

const fetchRelatedDiagnoses = unstable_cache(
  async (code: string): Promise<{ slug: string; title: string; severity: string }[]> => {
    try {
      const supabase = await createServiceSupabase();
      const normalized = code.toUpperCase();

      let rows: { slug: string }[] = [];
      let queryError: { message: string } | null = null;

      // Fast path: possible_codes is a generated column holding just the
      // possibleCodes array, with its own small GIN index (migration 039).
      if (possibleCodesReady !== false) {
        const fast = await supabase.from("diagnoses")
          .select("slug, view_count")
          // Pass a JSON string: postgrest-js serialises JS arrays as PostgreSQL
          // array literals (cs.{P0420}), which a jsonb column rejects with
          // 22P02. A string is emitted verbatim, giving cs.["P0420"].
          .contains("possible_codes", JSON.stringify([normalized]))
          .order("view_count", { ascending: false })
          .limit(5);

        if (fast.error) {
          // Missing column (migration pending) or any other failure: fall back
          // to the diagnosis_json filter instead of failing the page.
          possibleCodesReady = false;
        } else {
          possibleCodesReady = true;
          rows = (fast.data ?? []) as { slug: string }[];
        }
      }

      // Fallback until that migration is applied. No ORDER BY on purpose: the
      // GIN scan can stop after five matches instead of sorting every match,
      // which is what pushed this statement past statement_timeout.
      if (!queryError && possibleCodesReady === false) {
        const fallback = await supabase.from("diagnoses")
          .select("slug, view_count")
          .contains("diagnosis_json", { possibleCodes: [normalized] })
          .limit(5);
        if (fallback.error) queryError = fallback.error;
        else rows = (fallback.data ?? []) as { slug: string }[];
      }

      if (queryError) throw new Error(queryError.message);
      if (rows.length === 0) return [];
      const slugs = rows.map((row) => row.slug);

      // Only five rows are needed, so pulling diagnosis_json here is cheap;
      // the expensive part was projecting it for every JSONB match above.
      const { data: summaries } = await supabase
        .from("diagnoses")
        .select("slug, diagnosis_json")
        .in("slug", slugs);

      const bySlug = new Map(
        ((summaries ?? []) as { slug: string; diagnosis_json: { title?: string; severity?: string } | null }[])
          .map((s) => [s.slug, s]),
      );

      return slugs.map((slug) => {
        const summary = bySlug.get(slug);
        return {
          slug,
          title: summary?.diagnosis_json?.title ?? "Car Diagnosis",
          severity: summary?.diagnosis_json?.severity ?? "medium",
        };
      });
    } catch { return []; }
  },
  ["related-diagnoses-v2"],
  { revalidate: 86400 },
);

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params;
  const obd = await getObdCode(code);
  if (!obd) {
    return { title: "OBD Code Not Found", robots: { index: false, follow: false } };
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
          url: DEFAULT_OG_IMAGE,
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
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export default async function ObdCodePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;

  const [obd, relatedCodes, diagnosticCauses, relatedDiagnoses, validRepairSlugList, popularVehicles] = await Promise.all([
    getObdCode(code),
    getRelatedObdCodes(code, 5),
    getObdDiagnosticSteps(code),
    fetchRelatedDiagnoses(code),
    getValidRepairSlugs(),
    getVehicleRepairSlugs(10),
  ]);

  if (!obd) notFound();

  const validRepairSlugs = new Set(validRepairSlugList);

  // Related repairs — derived from diagnostic causes, filtered by valid slugs
  const relatedRepairs = (() => {
    const seen = new Set<string>();
    const repairs: { slug: string; name: string; diyLabel: string | null; estTime: string | null }[] = [];
    for (const dc of diagnosticCauses) {
      if (dc.repairSlug && dc.repairName && validRepairSlugs.has(dc.repairSlug) && !seen.has(dc.repairSlug)) {
        seen.add(dc.repairSlug);
        repairs.push({ slug: dc.repairSlug, name: dc.repairName, diyLabel: dc.diyLevel, estTime: dc.estTime });
        if (repairs.length >= 4) break;
      }
    }
    if (repairs.length > 0) return repairs;
    // Fallback: keyword matching, filtered
    return getRelatedRepairs(obd.title, 5)
      .filter(r => validRepairSlugs.has(r.slug))
      .slice(0, 4)
      .map((r) => ({ slug: r.slug, name: r.name, diyLabel: null, estTime: null }));
  })();

  const sev = severityColor(obd.severity);
  const driving = getDrivingAdvice(obd.severity);
  const naturalIntro = generateNaturalIntro(obd);

  const canonCode = obd.code.toLowerCase();

  // Direct lookup: fix_repair_slugs[i] ↔ fixes_json[i], AI-aligned
  const fixRepairSlugs = obd.fix_repair_slugs;

  // ── FAQ items ──────────────────────────────────────────

  const faqItems: { question: string; answer: string }[] = [];

  // 1. What does {CODE} mean?
  const meaningAnswer = `${obd.code} indicates "${obd.title}". ${naturalIntro}`;
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
    costAnswer = `Repair costs for ${obd.code} typically range from $${obd.min_cost} to $${obd.max_cost}, depending on your vehicle and local labor rates. `;
    if (obd.fixes.length > 0) {
      costAnswer += `The most common fixes are: ${obd.fixes.slice(0, 2).join("; ")}.`;
    }
  } else {
    costAnswer = `Repair costs for ${obd.code} vary depending on the root cause. A professional diagnosis is recommended to get an accurate estimate.`;
  }
  faqItems.push({
    question: `How much does it cost to fix ${obd.code}?`,
    answer: costAnswer,
  });

  // 4. Will {CODE} clear itself?
  let clearAnswer: string;
  if (obd.severity <= 1) {
    clearAnswer = `${obd.code} may clear itself after a few drive cycles if the underlying issue was temporary. However, if the problem persists, the code will return. It's best to have it diagnosed even if the light goes off.`;
  } else if (obd.severity <= 3) {
    clearAnswer = `${obd.code} is unlikely to clear itself permanently. Even if the check engine light turns off temporarily, the underlying issue typically remains. Proper diagnosis and repair are recommended.`;
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
    datePublished: (obd.created_at as string) || "2026-05-07T00:00:00.000Z",
    dateModified: (obd.updated_at as string) || (obd.created_at as string) || "2026-05-07T00:00:00.000Z",
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

        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "OBD Codes", href: "/obd" }, { label: obd.code }]} />

        <PageHeader
          eyebrow={`OBD-II diagnostic code${obd.severity >= 4 ? " / urgent" : ""}`}
          title={`${obd.code}: ${obd.title}`}
          description={naturalIntro}
          aside={
            <div className="border border-surface-border bg-text-primary p-5 text-surface-1 shadow-[8px_8px_0_0_#d8d0c2]">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
                <span className="text-[10px] font-heading font-bold uppercase tracking-[0.15em] text-white/45">Fault code</span>
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: sev.text }} />
              </div>
              <p className="mt-5 font-mono text-5xl font-bold tracking-[-0.05em] text-primary">{obd.code}</p>
              <div className="mt-5 grid grid-cols-2 gap-px bg-white/10">
                <Link href={`/obd/severity-levels?level=${obd.severity}`} prefetch={false} className="bg-text-primary p-3 transition-colors hover:bg-white/5">
                  <span className="block text-[9px] font-heading font-bold uppercase tracking-[0.12em] text-white/45">Severity</span>
                  <span className="mt-1 block text-sm font-heading font-bold text-white">{sev.label} / L{obd.severity}</span>
                </Link>
                <div className="bg-text-primary p-3">
                  <span className="block text-[9px] font-heading font-bold uppercase tracking-[0.12em] text-white/45">System</span>
                  <span className="mt-1 block text-sm font-heading font-bold text-white">{obd.code.charAt(0) === "P" ? "Powertrain" : obd.code.charAt(0) === "B" ? "Body" : obd.code.charAt(0) === "C" ? "Chassis" : "Network"}</span>
                </div>
              </div>
            </div>
          }
        />

        <QuickVerdict
          label="Driving guidance"
          title={`Can you still drive with ${obd.code}?`}
          tone={obd.severity >= 5 ? "critical" : obd.severity >= 3 ? "caution" : "safe"}
          facts={[
            { label: "Likely cause", value: obd.causes[0] ?? "Needs diagnosis" },
            { label: "Repair range", value: obd.min_cost != null && obd.max_cost != null ? `$${obd.min_cost}–$${obd.max_cost}` : "Varies" },
            { label: "First action", value: obd.severity >= 5 ? "Stop and tow" : obd.severity >= 3 ? "Inspect promptly" : "Verify the code" },
            { label: "Evidence", value: "Scanner + symptoms" },
          ]}
        >
          <p>{driving.text}</p>
        </QuickVerdict>

        <AdSlot placement="obd-after-verdict" />

        {/* Common Symptoms */}
        {obd.symptoms.length > 0 && (
          <ContentSection eyebrow="What the driver notices" title="Common symptoms">
            <ul className="grid border-l border-t border-surface-border sm:grid-cols-2">
              {obd.symptoms.map((s, i) => (
                <li key={i} className="flex items-start gap-3 border-b border-r border-surface-border p-4 text-sm text-text-secondary">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-amber" />
                  {s}
                </li>
              ))}
            </ul>
          </ContentSection>
        )}

        {/* Most Likely Causes */}
        {obd.causes.length > 0 && (
          <ContentSection eyebrow="Start with evidence" title="Most likely causes">
            <ul className="divide-y divide-surface-border border-y border-surface-border">
              {obd.causes.map((c, i) => (
                <li key={i} className="flex items-start gap-4 py-3 text-sm text-text-secondary">
                  <span className="font-mono text-xs font-bold text-primary">0{i + 1}</span>
                  {c}
                </li>
              ))}
            </ul>
          </ContentSection>
        )}

        {/* Diagnostic Funnel — narrow down the exact cause */}
        {diagnosticCauses.length > 0 ? (
          <ObdDiagnosticFunnel
            code={obd.code}
            symptoms={obd.symptoms}
            diagnosticCauses={diagnosticCauses.map(dc => ({
              ...dc,
              repairSlug: dc.repairSlug && validRepairSlugs.has(dc.repairSlug) ? dc.repairSlug : null,
            }))}
          />
        ) : (
          <div className="bg-surface-1 rounded-xl border border-surface-border p-5 mb-4 text-center">
            <p className="text-sm text-text-muted">
              Interactive diagnosis is being prepared for {obd.code}. Check the quick reference below for common causes and fixes.
            </p>
          </div>
        )}

        {/* Common Fixes */}
        {obd.fixes.length > 0 && (
          <ContentSection eyebrow="Repair options" title="Common fixes">
            <ul className="space-y-0 divide-y divide-surface-border border-y border-surface-border">
              {obd.fixes.map((f, i) => {
                const slug = fixRepairSlugs[i];
                const repair = slug ? { slug: slug.replace(/_/g, "-"), name: "" } : null;
                return (
                  <li key={i} className="flex items-start gap-3 py-3 text-sm text-text-secondary">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-severity-info" />
                    {repair ? (
                      <Link prefetch={false} href={`/repair-cost/${repair.slug}`} className="font-heading font-semibold text-primary hover:underline">
                        {f}
                      </Link>
                    ) : (
                      f
                    )}
                  </li>
                );
              })}
            </ul>
          </ContentSection>
        )}

        {/* Estimated Repair Cost */}
        {obd.min_cost != null && obd.max_cost != null && (
          <div className="my-7">
            <CostSummary
              label={`Typical ${obd.code} repair range`}
              range={`$${obd.min_cost} – $${obd.max_cost}`}
              confidence="Varies by vehicle, root cause, region, and parts strategy"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <p className="max-w-xl text-xs leading-5 text-text-secondary">
                  Treat this as a planning range until the failed component is verified. The final repair depends on which listed cause is responsible.
                </p>
                <Link prefetch={false} href="/quote-checker" className="inline-flex shrink-0 items-center justify-between gap-4 bg-primary px-4 py-2.5 text-xs font-heading font-bold text-white transition-colors hover:bg-primary-dark">
                  Check a quote <span aria-hidden="true">→</span>
                </Link>
              </div>
            </CostSummary>
          </div>
        )}

        {/* Related Repairs */}
        {relatedRepairs.length > 0 && (
          <ContinueSolving
            title={`Turn ${obd.code} into a repair decision`}
            intro="Check the likely repair cost, compare the code with other faults, or start again from the symptom."
            links={[
              ...relatedRepairs.slice(0, 3).map((repair) => ({
                href: `/repair-cost/${repair.slug}`,
                label: repair.name,
                description: repair.estTime ? `Typical DIY time: ${repair.estTime}. Compare parts, labor, and the shop option.` : "Compare typical parts, labor, and the decision to repair or delegate.",
                meta: repair.diyLabel ?? "repair cost",
              })),
              {
                href: "/symptom-checker",
                label: "Describe the symptom instead",
                description: "Use the guided diagnosis when the code does not explain the behavior you are noticing.",
                meta: "diagnostic wizard",
              },
            ]}
          />
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
                <Link prefetch={false} key={rel.code} href={`/obd/${rel.code.toLowerCase()}`}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-surface-0 border border-surface-border hover:border-primary/30 hover:bg-primary/5 transition-colors group">
                  <span className="w-14 sm:w-16 text-sm font-mono font-bold text-primary shrink-0 text-right">{rel.code}</span>
                  <span className="flex-1 min-w-0 text-xs text-text-secondary font-heading truncate">{rel.title}</span>
                  <svg className="w-3.5 h-3.5 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width={14} height={14}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </Link>
              ))}
            </div>
            <Link prefetch={false} href="/obd" className="inline-flex items-center gap-1 mt-3 text-xs font-heading font-semibold text-primary hover:text-primary-glow transition-colors">
              Browse all 12,000+ codes
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width={12} height={12}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
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
                <Link prefetch={false} key={d.slug} href={`/symptom-checker/${d.slug}`} className="flex items-center justify-between p-3 bg-surface-0 rounded-lg border border-surface-border hover:border-primary/30 hover:bg-primary/5 transition-colors group">
                  <span className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors">{d.title}</span>
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${d.severity === "critical" ? "bg-red-50 text-red-700" : d.severity === "high" ? "bg-orange-50 text-orange-700" : "bg-amber-50 text-amber-700"} font-heading`}>{d.severity}</span>
                </Link>
              ))}
            </div>
          </div>
        )}



        {/* FAQ */}
        {faqItems.length > 0 && (
          <ContentSection eyebrow="Before you clear the code" title={`${obd.code} questions`}>
            <FaqList items={faqItems} openFirst />
          </ContentSection>
        )}

        {popularVehicles.length > 0 && (
          <div className="bg-surface-1 rounded-xl border border-surface-border p-5 mb-4">
            <h2 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-3">
              {obd.code} on Popular Vehicles
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {popularVehicles.slice(0, 9).map((v) => (
                <Link prefetch={false}
                  key={`${v.makeSlug}-${v.modelSlug}`}
                  href={`/obd/${code}/${v.makeSlug}/${v.modelSlug}`}
                  className="text-xs text-text-secondary hover:text-primary transition-colors truncate"
                >
                  {v.makeName} {v.modelName}
                </Link>
              ))}
            </div>
          </div>
        )}

        <PageFeedback />
      </main>

      <Footer />
    </div>
  );
}
