import Link from "next/link";

export interface ContinueSolvingLink {
  href: string;
  label: string;
  description: string;
  meta?: string;
}

export default function ContinueSolving({
  title = "Continue solving",
  intro,
  links,
}: {
  title?: string;
  intro?: string;
  links: ContinueSolvingLink[];
}) {
  if (links.length === 0) return null;

  return (
    <section className="my-8 border-y border-surface-border bg-surface-1 px-5 py-7 sm:px-7">
      <p className="text-[10px] font-heading font-bold uppercase tracking-[0.15em] text-primary">
        Related paths
      </p>
      <h2 className="mt-1.5 font-display text-3xl font-semibold tracking-[-0.03em] text-text-primary">
        {title}
      </h2>
      {intro && <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">{intro}</p>}
      <div className="mt-5 grid border-l border-t border-surface-border sm:grid-cols-2">
        {links.map((link) => (
          <Link
            prefetch={false}
            key={link.href}
            href={link.href}
            className="group flex min-h-28 flex-col justify-between border-b border-r border-surface-border bg-surface-0 p-4 transition-colors hover:bg-surface-1"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="font-heading text-sm font-bold text-text-primary group-hover:text-primary">
                {link.label}
              </span>
              <span aria-hidden="true" className="text-primary transition-transform group-hover:translate-x-0.5">→</span>
            </div>
            <p className="mt-3 text-xs leading-5 text-text-muted">{link.description}</p>
            {link.meta && (
              <span className="mt-2 text-[9px] font-heading font-bold uppercase tracking-[0.12em] text-primary">
                {link.meta}
              </span>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
