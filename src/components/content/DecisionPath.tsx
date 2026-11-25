import Link from "next/link";

export interface DecisionOption {
  label: string;
  title: string;
  description: string;
  href?: string;
  action?: string;
}

export default function DecisionPath({ options }: { options: DecisionOption[] }) {
  return (
    <ol className="grid border-l border-t border-surface-border md:grid-cols-3">
      {options.map((option, index) => {
        const content = (
          <>
            <div className="flex items-start justify-between gap-4">
              <span className="text-[10px] font-heading font-bold uppercase tracking-[0.15em] text-primary">
                0{index + 1} / {option.label}
              </span>
              {option.href && <span aria-hidden="true" className="text-primary">→</span>}
            </div>
            <h3 className="mt-5 font-display text-2xl font-semibold tracking-[-0.025em] text-text-primary">
              {option.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-text-secondary">{option.description}</p>
            {option.action && (
              <span className="mt-6 block text-xs font-heading font-bold uppercase tracking-[0.1em] text-primary">
                {option.action}
              </span>
            )}
          </>
        );

        return (
          <li key={option.title} className="border-b border-r border-surface-border">
            {option.href ? (
              <Link prefetch={false} href={option.href} className="group flex h-full min-h-56 flex-col p-5 transition-colors hover:bg-surface-1">
                {content}
              </Link>
            ) : (
              <div className="flex h-full min-h-56 flex-col p-5">{content}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
