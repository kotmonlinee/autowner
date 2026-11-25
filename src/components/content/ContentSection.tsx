import type { ReactNode } from "react";

type ContentSectionTone = "plain" | "paper" | "ink" | "notice";

const toneClasses: Record<ContentSectionTone, string> = {
  plain: "border-t border-surface-border py-7",
  paper: "border-y border-surface-border bg-surface-1 px-5 py-7 sm:px-7",
  ink: "bg-text-primary px-5 py-7 text-surface-1 sm:px-7",
  notice: "border-l-4 border-primary bg-primary/5 px-5 py-6",
};

interface ContentSectionProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  intro?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  tone?: ContentSectionTone;
}

export default function ContentSection({
  id,
  eyebrow,
  title,
  intro,
  action,
  children,
  className = "",
  tone = "plain",
}: ContentSectionProps) {
  const ink = tone === "ink";

  return (
    <section id={id} className={`${toneClasses[tone]} ${className}`}>
      {(eyebrow || title || action) && (
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            {eyebrow && (
              <p className={`text-[10px] font-heading font-bold uppercase tracking-[0.15em] ${ink ? "text-primary" : "text-text-muted"}`}>
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className={`mt-1.5 font-display text-2xl font-semibold tracking-[-0.025em] sm:text-3xl ${ink ? "text-surface-1" : "text-text-primary"}`}>
                {title}
              </h2>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      {intro && (
        <p className={`mb-5 max-w-3xl text-sm leading-6 ${ink ? "text-white/65" : "text-text-secondary"}`}>
          {intro}
        </p>
      )}
      {children}
    </section>
  );
}
