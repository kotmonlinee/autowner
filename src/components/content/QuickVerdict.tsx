import type { ReactNode } from "react";

type VerdictTone = "safe" | "caution" | "critical" | "info";

const toneClasses: Record<VerdictTone, string> = {
  safe: "border-severity-info-border bg-severity-info-bg",
  caution: "border-severity-caution-border bg-severity-caution-bg",
  critical: "border-severity-critical-border bg-severity-critical-bg",
  info: "border-surface-border bg-surface-1",
};

const labelClasses: Record<VerdictTone, string> = {
  safe: "text-severity-info",
  caution: "text-severity-caution",
  critical: "text-severity-critical",
  info: "text-primary",
};

export default function QuickVerdict({
  label,
  title,
  children,
  tone = "info",
  facts = [],
}: {
  label: string;
  title: string;
  children: ReactNode;
  tone?: VerdictTone;
  facts?: { label: string; value: string }[];
}) {
  return (
    <aside className={`mb-7 border-l-4 ${toneClasses[tone]}`} aria-label={label}>
      <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
        <div>
          <p className={`text-[10px] font-heading font-bold uppercase tracking-[0.15em] ${labelClasses[tone]}`}>
            {label}
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.025em] text-text-primary sm:text-3xl">
            {title}
          </h2>
          <div className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
            {children}
          </div>
        </div>
        {facts.length > 0 && (
          <dl className="grid grid-cols-2 border-l border-t border-surface-border/80">
            {facts.map((fact) => (
              <div key={fact.label} className="border-b border-r border-surface-border/80 p-3">
                <dt className="text-[9px] font-heading font-bold uppercase tracking-[0.12em] text-text-muted">
                  {fact.label}
                </dt>
                <dd className="mt-1 font-heading text-sm font-bold text-text-primary">{fact.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </aside>
  );
}
