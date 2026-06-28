import { getPopularRepairCosts } from "@/lib/data/server";
import Link from "next/link";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function CommonRepairCosts() {
  const repairs = await getPopularRepairCosts(8);

  if (repairs.length === 0) return null;

  return (
    <section
      className="w-full bg-surface-0"
      aria-labelledby="common-repairs-heading"
    >
      <div className="max-w-5xl mx-auto px-5 py-16 sm:py-20">
        <div className="text-center mb-10">
          <h2
            id="common-repairs-heading"
            className="text-2xl sm:text-3xl font-bold text-text-primary font-heading"
          >
            Common Repair Costs
          </h2>
          <p className="mt-2 text-text-muted text-sm sm:text-base max-w-xl mx-auto">
            See what other car owners typically pay for the most common repairs,
            across all vehicle tiers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {repairs.map((repair) => (
            <Link
              key={repair.slug}
              href={`/repair-cost/${repair.slug}`}
              className="group bg-surface-1 rounded-xl border border-surface-border p-5 hover:border-primary/20 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              {/* Icon */}
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors duration-200">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                 width={20} height={20}>
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>

              {/* Name */}
              <h3 className="text-sm font-semibold text-text-primary font-heading group-hover:text-primary transition-colors mb-2 line-clamp-2">
                {repair.name}
              </h3>

              {/* Cost range */}
              <p className="text-base font-bold text-text-primary font-heading">
                {formatCurrency(repair.minCost)} &ndash; {formatCurrency(repair.maxCost)}
              </p>

              {/* Avg */}
              <p className="text-xs text-text-muted mt-1">
                Avg: {formatCurrency(repair.avgCost)}
              </p>

              {/* Arrow */}
              <span className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                View details
                <svg
                  className="w-3 h-3"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                 width={12} height={12}>
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/repair-cost"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary font-heading hover:text-primary-glow transition-colors"
          >
            Browse all repair costs
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
             width={16} height={16}>
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Bottom gradient separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-surface-border to-transparent" />
    </section>
  );
}
