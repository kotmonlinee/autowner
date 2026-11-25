import type { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  children?: ReactNode;
  aside?: ReactNode;
}

export default function PageHeader({
  eyebrow,
  title,
  description,
  children,
  aside,
}: PageHeaderProps) {
  return (
    <header className="relative mb-8 border-b border-surface-border pb-8 sm:mb-10 sm:pb-10">
      <div className={`grid gap-8 ${aside ? "lg:grid-cols-[minmax(0,1.25fr)_minmax(260px,.75fr)] lg:items-end" : ""}`}>
        <div>
          <p className="text-[11px] font-heading font-bold uppercase tracking-[0.16em] text-primary">
            {eyebrow}
          </p>
          <h1 className="mt-3 max-w-4xl font-display text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-text-primary sm:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="mt-5 max-w-3xl text-base leading-7 text-text-secondary sm:text-lg">
              {description}
            </p>
          )}
          {children && <div className="mt-5">{children}</div>}
        </div>
        {aside && <div>{aside}</div>}
      </div>
    </header>
  );
}
