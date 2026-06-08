import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import WarningLightIcon from "@/components/WarningLightIcon";
import { warningLights, type WarningLightSeverity } from "@/lib/warning-lights-data";

export const metadata: Metadata = {
  title: "Dashboard Warning Lights Guide",
  description:
    "Identify and understand every dashboard warning light. Learn what each symbol means, how urgent it is, and what it might cost to fix.",
  alternates: {
    canonical: "https://www.autowner.com/warning-lights",
  },
  openGraph: {
    title: "Dashboard Warning Lights Guide",
    description:
      "Identify and understand every dashboard warning light. Learn what each symbol means, how urgent it is, and what it might cost to fix.",
  },
};

const SEVERITY_CONFIG: Record<WarningLightSeverity, { label: string; bg: string; text: string; border: string; order: number }> = {
  critical: {
    label: "Critical",
    bg: "bg-surface-1 dark:bg-red-950/30",
    text: "text-red-700 dark:text-red-400",
    border: "border-l-4 border-red-500 dark:border dark:border-red-800 dark:border-l",
    order: 0,
  },
  caution: {
    label: "Caution",
    bg: "bg-surface-1 dark:bg-amber-950/30",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-l-4 border-amber-500 dark:border dark:border-amber-800 dark:border-l",
    order: 1,
  },
  informational: {
    label: "Informational",
    bg: "bg-surface-1 dark:bg-emerald-950/30",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-l-4 border-emerald-500 dark:border dark:border-emerald-800 dark:border-l",
    order: 2,
  },
};

// Urgency dot colors
const URGENCY_DOT: Record<WarningLightSeverity, string> = {
  critical: "bg-red-500",
  caution: "bg-amber-500",
  informational: "bg-emerald-500",
};

// Sort: critical first, then caution, then informational
const sortedLights = [...warningLights].sort((a, b) => {
  return SEVERITY_CONFIG[a.severity].order - SEVERITY_CONFIG[b.severity].order;
});

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function WarningLightsPage() {
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
              { "@type": "ListItem", position: 2, name: "Dashboard Warning Lights", item: "https://www.autowner.com/warning-lights" },
            ],
          }),
        }}
      />

      <main id="main-content" className="max-w-4xl mx-auto px-5 py-10 w-full flex-1">
        {/* Page header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary font-heading">
              Dashboard Warning Lights
            </h1>
          </div>
          <p className="text-text-muted text-base leading-relaxed max-w-2xl">
            Don&apos;t ignore that light on your dashboard. Browse our guide to the 25
            most common warning lights, learn what they mean, and find out how urgent
            the issue is and what repairs might cost.
          </p>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-5">
            {Object.entries(SEVERITY_CONFIG).map(([key, config]) => (
              <div
                key={key}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-1 border border-surface-border"
              >
                <span className={`w-2.5 h-2.5 rounded-full ${URGENCY_DOT[key as WarningLightSeverity]}`} />
                <span className="text-xs font-medium text-text-secondary font-heading">
                  {config.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Grid of warning light cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedLights.map((light) => {
            const sev = SEVERITY_CONFIG[light.severity];
            return (
              <Link
                key={light.slug}
                href={`/warning-lights/${light.slug}`}
                className={`group flex flex-col p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md max-w-full overflow-hidden ${sev.bg} ${sev.border}`}
              >
                {/* Icon + severity badge */}
                <div className="flex items-start justify-between mb-3">
                  <WarningLightIcon slug={light.slug} size={40} severity={light.severity} />
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold font-heading ${sev.bg} ${sev.text} border ${sev.border}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${URGENCY_DOT[light.severity]}`} />
                    {sev.label}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-text-primary font-heading group-hover:text-primary transition-colors mb-2">
                  {light.title}
                </h3>

                {/* Brief description */}
                <p className="text-sm text-text-secondary leading-relaxed line-clamp-2 mb-4 flex-1">
                  {light.meaning}
                </p>

                {/* Cost range */}
                <div className="flex items-center justify-between text-xs text-text-muted pt-3 border-t border-surface-border gap-2 max-w-full">
                  <span className="truncate">
                    Cost: {formatCurrency(light.min_cost)} &ndash;{" "}
                    {formatCurrency(light.max_cost)}
                  </span>
                  <span className="inline-flex items-center gap-1 text-primary font-medium font-heading opacity-0 group-hover:opacity-100 transition-opacity">
                    Details
                    <svg
                      className="w-3 h-3"
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
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
