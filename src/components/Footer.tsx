import Link from "next/link";

const groups = [
  {
    title: "Diagnose",
    links: [
      { label: "Symptom Checker", href: "/symptom-checker" },
      { label: "OBD Codes", href: "/obd" },
      { label: "Common Symptoms", href: "/symptoms" },
      { label: "Warning Lights", href: "/warning-lights" },
    ],
  },
  {
    title: "Repair",
    links: [
      { label: "Repair Costs", href: "/repair-cost" },
      { label: "Check a Quote", href: "/quote-checker" },
      { label: "DIY Levels", href: "/repair-cost/diy-levels" },
      { label: "Recall Check", href: "/recall-check" },
    ],
  },
  {
    title: "More",
    links: [
      { label: "Vehicles", href: "/vehicles" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-surface-border bg-surface-1" role="contentinfo">
      <div className="mx-auto max-w-[1180px] px-5 py-12 sm:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_repeat(4,1fr)]">
          <div className="max-w-sm">
            <Link prefetch={false} href="/" className="inline-flex items-center gap-2.5" aria-label="AutOwner home">
              <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-text-primary text-surface-1">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 17h14M6.5 10.5 9 7l3 2.4 3-2.4 2.5 3.5v5h-11v-5Z" />
                  <circle cx="9" cy="16" r="1" />
                  <circle cx="15" cy="16" r="1" />
                </svg>
              </span>
              <span className="font-display text-2xl font-semibold text-text-primary">AutOwner</span>
            </Link>
            <p className="mt-4 text-sm leading-6 text-text-secondary">
              Clear automotive diagnosis, repair costs, and practical next steps for the problem in front of you.
            </p>
            <p className="mt-4 text-xs leading-5 text-text-muted">
              Automotive information is not a substitute for an in-person inspection. Stop driving when a condition may be unsafe.
            </p>
          </div>

          {groups.map((group) => (
            <div key={group.title}>
              <h2 className="text-xs font-heading font-bold uppercase tracking-[0.12em] text-text-primary">{group.title}</h2>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      prefetch={false}
                      href={link.href}
                      className="text-sm text-text-secondary transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-surface-border pt-6 text-xs text-text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 AutOwner. All rights reserved.</p>
          <p>Vehicle diagnosis and repair should always follow the manufacturer&apos;s safety guidance.</p>
        </div>
      </div>
    </footer>
  );
}
