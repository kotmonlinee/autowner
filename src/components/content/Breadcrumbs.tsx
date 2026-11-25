import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-7 flex items-center gap-2 overflow-x-auto whitespace-nowrap border-b border-surface-border pb-3 text-[11px] font-heading font-bold uppercase tracking-[0.12em] text-text-muted"
    >
      {items.map((item, index) => {
        const current = index === items.length - 1;
        return (
          <span key={`${item.label}-${index}`} className="flex shrink-0 items-center gap-2">
            {index > 0 && <span aria-hidden="true" className="text-surface-4">/</span>}
            {item.href && !current ? (
              <Link href={item.href} prefetch={false} className="transition-colors hover:text-primary">
                {item.label}
              </Link>
            ) : (
              <span className={current ? "max-w-[42vw] truncate text-text-secondary sm:max-w-md" : ""} aria-current={current ? "page" : undefined}>
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
