import type { ReactNode } from "react";

export default function DiagnosticDataPanel({
  children,
  label = "Diagnostic data",
}: {
  children: ReactNode;
  label?: string;
}) {
  return (
    <div className="overflow-hidden border border-surface-border bg-surface-0">
      <div className="flex items-center justify-between border-b border-surface-border bg-surface-1 px-4 py-2.5">
        <span className="text-[10px] font-heading font-bold uppercase tracking-[0.14em] text-text-muted">
          {label}
        </span>
        <span className="flex items-center gap-1.5 text-[10px] font-heading text-text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-severity-info" />
          structured reference
        </span>
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}
