import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WarningLightIcon from "@/components/WarningLightIcon";
import {
  warningLights,
  getWarningLightBySlug,
  type WarningLight,
  type WarningLightSeverity,
} from "@/lib/warning-lights-data";

export function generateStaticParams() {
  return warningLights.map((w) => ({ slug: w.slug }));
}

function generateWarningLightTitle(light: WarningLight): string {
  const t = light.title;

  if (t.includes("Check Engine")) {
    return "Check Engine Light On? Can You Still Drive?";
  }
  if (t.includes("Oil Pressure")) {
    return "Oil Pressure Warning: Stop Driving Immediately";
  }
  if (t.includes("Battery")) {
    return "Battery Warning Light: What It Means & Repair Cost";
  }
  if (t.includes("Brake")) {
    return "Brake Warning Light On? Causes & Repair Costs";
  }
  if (t.includes("ABS")) {
    return "ABS Light On? Causes & Repair Costs";
  }
  if (t.includes("Airbag")) {
    return "Airbag Light On? Causes & Repair Cost";
  }
  if (t.includes("Tire Pressure")) {
    return "TPMS Light: What It Means & Safe Tire Pressure";
  }
  if (t.includes("Coolant")) {
    return "Coolant Temperature Warning: Stop Driving?";
  }

  return `${t}: Symptoms, Causes & Repair Cost`;
}

function generateWarningLightDescription(light: WarningLight): string {
  const desc = `Is your ${light.title} on? Learn what it means, common causes, repair costs, and whether it's safe to keep driving.`;
  return desc.length <= 160 ? desc : desc.substring(0, 160);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const light = getWarningLightBySlug(slug);
  if (!light) {
    return { title: "Warning Light Not Found" };
  }

  const seoTitle = generateWarningLightTitle(light);
  const seoDescription = generateWarningLightDescription(light);

  return {
    title: seoTitle,
    description: seoDescription,
    alternates: {
      canonical: `https://www.autowner.com/warning-lights/${light.slug}`,
    },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: ["https://www.autowner.com/og-default.jpg"],
    },
  };
}

const SEVERITY_CONFIG: Record<
  WarningLightSeverity,
  { label: string; bg: string; text: string; border: string; iconBg: string }
> = {
  critical: {
    label: "Critical — Stop driving",
    bg: "bg-red-50 dark:bg-red-950/30",
    text: "text-red-700 dark:text-red-400",
    border: "border-red-200 dark:border-red-800",
    iconBg: "bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400",
  },
  caution: {
    label: "Caution — Service soon",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-800",
    iconBg: "bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400",
  },
  informational: {
    label: "Informational — For your awareness",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-800",
    iconBg:
      "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400",
  },
};

const URGENCY_DOT: Record<WarningLightSeverity, string> = {
  critical: "bg-red-500",
  caution: "bg-amber-500",
  informational: "bg-emerald-500",
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function WarningLightDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const light = getWarningLightBySlug(slug);

  if (!light) {
    notFound();
  }

  const sev = SEVERITY_CONFIG[light.severity];

  // ── Structured Data ──────────────────────────────────

  const faqItems = [
    {
      question: `What does the ${light.title} mean?`,
      answer: light.meaning,
    },
    {
      question: `Can I still drive with the ${light.title} on?`,
      answer: light.can_drive,
    },
    {
      question: `How much does it cost to fix the ${light.title}?`,
      answer: `Repair costs typically range from ${formatCurrency(light.min_cost)} to ${formatCurrency(light.max_cost)}, depending on the underlying cause, your vehicle make and model, and local labor rates. Always get multiple quotes for an accurate price.`,
    },
    {
      question: `What causes the ${light.title} to come on?`,
      answer: light.causes.join(". ") + ".",
    },
  ];

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
    headline: light.title,
    description: light.meaning.substring(0, 160),
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
        name: "Warning Lights",
        item: "https://www.autowner.com/warning-lights",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: light.title,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <Navbar />

      <main id="main-content" className="max-w-4xl mx-auto px-5 py-10 w-full flex-1">
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
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-text-muted">
            <li>
              <Link href="/" className="hover:text-text-primary transition-colors">
                Home
              </Link>
            </li>
            <li>
              <svg
                className="w-3 h-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </li>
            <li>
              <Link
                href="/warning-lights"
                className="hover:text-text-primary transition-colors"
              >
                Warning Lights
              </Link>
            </li>
            <li>
              <svg
                className="w-3 h-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </li>
            <li className="text-text-primary font-medium truncate">
              {light.title}
            </li>
          </ol>
        </nav>

        {/* Header section */}
        <div className="mb-8">
          <div className="flex items-start gap-4 mb-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${sev.iconBg}`}>
              <WarningLightIcon slug={light.slug} size={32} severity={light.severity} />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary font-heading mb-2">
                {light.title}
              </h1>
              <div
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-semibold font-heading ${sev.bg} ${sev.text} ${sev.border}`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${URGENCY_DOT[light.severity]}`}
                />
                {sev.label}
              </div>
            </div>
          </div>
        </div>

        {/* Meaning */}
        <section
          className="bg-surface-1 border border-surface-border rounded-2xl p-6 mb-4"
          aria-labelledby="meaning-heading"
        >
          <h2
            id="meaning-heading"
            className="text-lg font-bold text-text-primary font-heading mb-3"
          >
            What It Means
          </h2>
          <p className="text-text-secondary leading-relaxed">{light.meaning}</p>
        </section>

        {/* Common Causes */}
        <section
          className="bg-surface-1 border border-surface-border rounded-2xl p-6 mb-4"
          aria-labelledby="causes-heading"
        >
          <h2
            id="causes-heading"
            className="text-lg font-bold text-text-primary font-heading mb-3"
          >
            Common Causes
          </h2>
          <ul className="space-y-2">
            {light.causes.map((cause, i) => (
              <li key={i} className="flex items-start gap-3 text-text-secondary">
                <svg
                  className="w-4 h-4 mt-0.5 text-primary shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="text-sm leading-relaxed">{cause}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Can I still drive? */}
        <section
          className={`rounded-2xl p-6 mb-4 border ${sev.bg} ${sev.border}`}
          aria-labelledby="can-drive-heading"
        >
          <h2
            id="can-drive-heading"
            className="text-lg font-bold text-text-primary font-heading mb-3"
          >
            Can I Still Drive?
          </h2>
          <p className="text-text-secondary leading-relaxed">{light.can_drive}</p>
        </section>

        {/* Repair cost estimate */}
        <section
          className="bg-surface-1 border border-surface-border rounded-2xl p-6 mb-4"
          aria-labelledby="cost-heading"
        >
          <h2
            id="cost-heading"
            className="text-lg font-bold text-text-primary font-heading mb-3"
          >
            Estimated Repair Cost
          </h2>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-text-primary font-heading">
              {formatCurrency(light.min_cost)} &ndash; {formatCurrency(light.max_cost)}
            </span>
          </div>
          <p className="text-xs text-text-muted mt-2">
            This is an estimate only. Actual costs vary by vehicle make, model, year,
            location, and shop labor rates. Always get multiple quotes for major repairs.
          </p>
        </section>

        {/* Related OBD Codes */}
        {light.related_obd_codes.length > 0 && (
          <section
            className="bg-surface-1 border border-surface-border rounded-2xl p-6 mb-4"
            aria-labelledby="obd-heading"
          >
            <h2
              id="obd-heading"
              className="text-lg font-bold text-text-primary font-heading mb-3"
            >
              Related OBD-II Trouble Codes
            </h2>
            <div className="flex flex-wrap gap-2">
              {light.related_obd_codes.map((code) => (
                <Link
                  key={code}
                  href={`/obd/${code}`}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg bg-surface-0 border border-surface-border text-sm font-mono text-primary hover:border-primary/30 hover:bg-primary/5 transition-colors"
                >
                  {code}
                </Link>
              ))}
            </div>
            <p className="text-xs text-text-muted mt-3">
              These OBD codes are commonly associated with this warning light. Scan your
              vehicle with an OBD-II scanner to get the exact code before diagnosing.
            </p>
          </section>
        )}

        {/* FAQ Section */}
        <section
          className="bg-surface-1 border border-surface-border rounded-2xl p-6 mb-4"
          aria-labelledby="faq-heading"
        >
          <h2
            id="faq-heading"
            className="text-lg font-bold text-text-primary font-heading mb-4"
          >
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <div key={i}>
                <h3 className="text-sm font-heading font-semibold text-text-secondary mb-1">
                  {item.question}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Back link */}
        <div className="mt-8 text-center">
          <Link
            href="/warning-lights"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary font-heading hover:text-primary-glow transition-colors"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to all warning lights
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
