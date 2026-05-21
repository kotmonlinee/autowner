import Link from "next/link";

export default function ToolCTAs() {
  return (
    <div className="space-y-3">
      {/* Estimate Repair Costs CTA */}
      <Link
        href="/repair-cost"
        className="group block bg-surface-1 rounded-xl border border-surface-border p-4 hover:border-primary/20 hover:bg-surface-2 transition-all duration-150"
      >
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
            <svg
              className="w-[18px] h-[18px] text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors font-heading">
              Estimate Repair Costs
            </h4>
            <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
              Get fair price estimates for common repairs on your vehicle.
            </p>
            <span className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-primary group-hover:text-primary-glow transition-colors font-heading">
              Try it
              <svg
                className="w-3 h-3 group-hover:translate-x-0.5 transition-transform"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </span>
          </div>
        </div>
      </Link>

      {/* Verify a Mechanic Quote CTA */}
      <Link
        href="/quote-checker"
        className="group block bg-surface-1 rounded-xl border border-surface-border p-4 hover:border-amber-500/20 hover:bg-surface-2 transition-all duration-150"
      >
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber/10 flex items-center justify-center shrink-0 mt-0.5">
            <svg
              className="w-[18px] h-[18px] text-amber"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-text-primary group-hover:text-amber transition-colors font-heading">
              Verify a Mechanic Quote
            </h4>
            <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
              Upload a mechanic&apos;s quote and let the community tell you if it&apos;s fair.
            </p>
            <span className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-amber group-hover:text-amber-dark transition-colors font-heading">
              Try it
              <svg
                className="w-3 h-3 group-hover:translate-x-0.5 transition-transform"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
