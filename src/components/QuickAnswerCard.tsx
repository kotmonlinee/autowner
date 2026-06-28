import type { QuickAnswer } from "@/lib/types";

export default function QuickAnswerCard({ quick_answer }: { quick_answer: QuickAnswer | null | undefined }) {
  if (!quick_answer) return null;

  const {
    most_likely_cause,
    probability,
    cost_min,
    cost_max,
    first_step,
    next_steps,
  } = quick_answer;

  const hasAnyContent =
    most_likely_cause || first_step || (cost_min !== undefined && cost_max !== undefined);

  if (!hasAnyContent) return null;

  const costMin = typeof cost_min === "number" ? cost_min : undefined;
  const costMax = typeof cost_max === "number" ? cost_max : undefined;
  const hasCost = costMin !== undefined || costMax !== undefined;

  return (
    <div className="mb-5 bg-surface-2 rounded-xl border-l-4 border-primary border-t border-r border-b border-surface-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 pt-4 pb-2">
        {/* Stethoscope/wrench combined icon */}
        <svg
          className="w-5 h-5 text-primary shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
         width={20} height={20}>
          {/* Tool/wrench body */}
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
        <span className="text-sm font-bold text-text-primary font-heading tracking-wide uppercase">
          Quick Diagnosis
        </span>
      </div>

      <div className="px-4 pb-4 space-y-3">
        {/* Most likely cause */}
        {most_likely_cause && (
          <div className="flex items-start gap-2">
            <span className="text-xs font-semibold text-text-muted shrink-0 mt-0.5 font-heading">
              Most likely cause:
            </span>
            <span className="text-sm text-text-primary leading-snug">
              {most_likely_cause}
              {probability && (
                <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-bold font-heading">
                  {probability} likely
                </span>
              )}
            </span>
          </div>
        )}

        {/* Estimated cost */}
        {hasCost && (
          <div className="flex items-start gap-2">
            <span className="text-xs font-semibold text-text-muted shrink-0 mt-0.5 font-heading">
              Estimated cost:
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-700/10 dark:bg-amber-400/10 border border-amber-700/20 dark:border-amber-400/20 text-severity-caution text-sm font-bold font-heading">
              {costMin !== undefined && costMax !== undefined
                ? costMin === costMax
                  ? costMin === 0
                    ? "Free"
                    : `$${costMin}`
                  : `$${costMin} – $${costMax}`
                : costMin !== undefined
                  ? `From $${costMin}`
                  : `Up to $${costMax}`}
            </span>
          </div>
        )}

        {/* First step */}
        {first_step && (
          <div className="flex items-start gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-xs font-bold font-heading shrink-0 mt-0.5">
              1
            </span>
            <div>
              <span className="text-xs font-semibold text-text-muted font-heading">
                First thing to check:
              </span>
              <p className="text-sm text-text-primary leading-snug mt-0.5">
                {first_step}
              </p>
            </div>
          </div>
        )}

        {/* Next steps */}
        {next_steps && next_steps.length > 0 && (
          <div className="pt-1">
            <span className="text-xs font-semibold text-text-muted font-heading">
              Next steps:
            </span>
            <ol className="mt-1.5 space-y-1 list-none">
              {next_steps.map((step, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-surface-3 text-text-secondary text-xs font-bold font-heading shrink-0 mt-0.5">
                    {i + 2}
                  </span>
                  <span className="text-sm text-text-primary leading-snug">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
