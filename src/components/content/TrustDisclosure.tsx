import type { ReactNode } from "react";

export default function TrustDisclosure({
  title = "How to use this estimate",
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <aside className="my-6 grid gap-4 border border-severity-caution-border bg-severity-caution-bg/60 p-5 sm:grid-cols-[.35fr_.65fr]">
      <p className="text-[10px] font-heading font-bold uppercase tracking-[0.14em] text-severity-caution">
        {title}
      </p>
      <div className="text-xs leading-6 text-text-secondary">{children}</div>
    </aside>
  );
}
