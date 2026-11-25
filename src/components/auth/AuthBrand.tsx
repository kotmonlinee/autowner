import Link from "next/link";

export default function AuthBrand() {
  return (
    <Link href="/" prefetch={false} className="inline-flex items-center gap-2.5" aria-label="AutOwner home">
      <span className="flex h-8 w-8 items-center justify-center bg-text-primary text-surface-1">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 17h14M6.5 10.5 9 7l3 2.4 3-2.4 2.5 3.5v5h-11v-5Z" />
          <circle cx="9" cy="16" r="1" />
          <circle cx="15" cy="16" r="1" />
        </svg>
      </span>
      <span className="font-display text-2xl font-semibold tracking-[-0.035em] text-text-primary">AutOwner</span>
    </Link>
  );
}
