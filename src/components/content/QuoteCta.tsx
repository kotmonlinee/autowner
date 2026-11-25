import Link from "next/link";

export default function QuoteCta({
  href,
  title = "Got a mechanic's quote?",
  description = "Compare the proposed price with the expected parts-and-labor range before you authorize work.",
  action = "Check the quote",
}: {
  href: string;
  title?: string;
  description?: string;
  action?: string;
}) {
  return (
    <aside className="my-7 flex flex-col justify-between gap-5 border-l-4 border-primary bg-text-primary p-5 text-surface-1 sm:flex-row sm:items-center sm:p-6">
      <div>
        <p className="text-[10px] font-heading font-bold uppercase tracking-[0.15em] text-primary">Second opinion</p>
        <h2 className="mt-1 font-display text-2xl font-semibold tracking-[-0.025em] text-white">{title}</h2>
        <p className="mt-2 max-w-2xl text-xs leading-5 text-white/65">{description}</p>
      </div>
      <Link
        prefetch={false}
        href={href}
        className="inline-flex shrink-0 items-center justify-between gap-5 bg-primary px-5 py-3 text-sm font-heading font-bold text-white transition-colors hover:bg-primary-dark"
      >
        {action}
        <span aria-hidden="true">→</span>
      </Link>
    </aside>
  );
}
