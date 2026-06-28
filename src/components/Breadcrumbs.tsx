import Link from "next/link";

interface BreadcrumbsProps {
  items: { label: string; href?: string }[];
}

function Chevron() {
  return (
    <svg
      className="w-3 h-3 text-surface-border shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
     width={12} height={12}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  );
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav
      className="mb-4 flex items-center gap-2 text-sm text-text-muted font-heading"
      aria-label="Breadcrumb"
    >
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <Chevron />}
          {item.href ? (
            <Link href={item.href} className="hover:text-primary transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-text-secondary">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
