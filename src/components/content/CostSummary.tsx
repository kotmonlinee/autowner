import type { ReactNode } from "react";

export default function CostSummary({
  label,
  range,
  average,
  confidence,
  children,
}: {
  label: string;
  range: string;
  average?: string;
  confidence?: string;
  children?: ReactNode;
}) {
  return (
    <aside className="border-l-4 border-primary bg-primary/5 p-5 sm:p-6">
      <p className="text-[10px] font-heading font-bold uppercase tracking-[0.15em] text-text-muted">
        {label}
      </p>
      <p className="mt-2 font-display text-4xl font-semibold tracking-[-0.035em] text-text-primary">
        {range}
      </p>
      {(average || confidence) && (
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-muted">
          {average && <span>Typical average <strong className="text-text-primary">{average}</strong></span>}
          {confidence && <span>{confidence}</span>}
        </div>
      )}
      {children && <div className="mt-5 border-t border-primary/20 pt-4">{children}</div>}
    </aside>
  );
}
