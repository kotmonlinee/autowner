"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import SearchBar from "./SearchBar";

const primaryLinks = [
  { label: "Diagnose", href: "/symptom-checker" },
  { label: "OBD Codes", href: "/obd" },
  { label: "Repair Costs", href: "/repair-cost" },
  { label: "Vehicles", href: "/vehicles" },
  { label: "Warning Lights", href: "/warning-lights" },
];

const secondaryLinks = [
  { label: "Symptoms", href: "/symptoms" },
  { label: "Recall Check", href: "/recall-check" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-surface-border bg-surface-0/95 backdrop-blur-xl" aria-label="Main navigation">
        <div className="mx-auto flex h-16 max-w-[1180px] items-center gap-5 px-5">
          <Link prefetch={false} href="/" className="group flex shrink-0 items-center gap-2.5" aria-label="AutOwner home">
            <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-text-primary text-surface-1">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 17h14M6.5 10.5 9 7l3 2.4 3-2.4 2.5 3.5v5h-11v-5Z" />
                <circle cx="9" cy="16" r="1" />
                <circle cx="15" cy="16" r="1" />
              </svg>
            </span>
            <span className="font-display text-[25px] font-semibold tracking-[-0.035em] text-text-primary">AutOwner</span>
          </Link>

          <div className="hidden items-stretch self-stretch lg:flex">
            {primaryLinks.map((link) => (
              <Link
                prefetch={false}
                key={link.href}
                href={link.href}
                className={`relative flex items-center px-3 text-[13px] font-heading font-semibold transition-colors ${
                  isActive(link.href) ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {link.label}
                {isActive(link.href) && <span className="absolute inset-x-3 bottom-0 h-0.5 bg-primary" />}
              </Link>
            ))}
          </div>

          <div className="ml-auto hidden w-56 xl:block">
            <SearchBar id="desktop-global-search" />
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              prefetch={false}
              href="/quote-checker"
              className="rounded-md bg-primary px-4 py-2.5 text-xs font-heading font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-primary-dark"
            >
              Check a Quote
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            className="ml-auto flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-1.5 rounded-md text-text-primary transition-colors hover:bg-surface-2 lg:!hidden"
          >
            <span className={`h-0.5 w-5 bg-current transition-transform ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`h-0.5 w-5 bg-current transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-5 bg-current transition-transform ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>

        <div
          id="mobile-navigation"
          aria-hidden={!menuOpen}
          inert={!menuOpen}
          className={`overflow-hidden border-t border-surface-border bg-surface-0 transition-[max-height,opacity] lg:hidden ${menuOpen ? "max-h-[calc(100vh-4rem)] opacity-100" : "max-h-0 border-t-0 opacity-0"}`}
        >
          <div className="mx-auto max-h-[calc(100vh-4rem)] max-w-[1180px] overflow-y-auto px-5 pb-6 pt-4">
            <SearchBar id="mobile-global-search" />

            <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-1">
              {primaryLinks.map((link) => (
                <Link
                  prefetch={false}
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex min-h-11 items-center border-b border-surface-border text-sm font-heading font-semibold ${
                    isActive(link.href) ? "text-primary" : "text-text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-5">
              <p className="mb-2 text-[10px] font-heading font-bold uppercase tracking-[0.12em] text-text-muted">More</p>
              <div className="grid grid-cols-2 gap-x-5 gap-y-1">
                {secondaryLinks.map((link) => (
                  <Link
                    prefetch={false}
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex min-h-11 items-center text-sm font-heading text-text-secondary"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </nav>

      {menuOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 top-16 z-40 bg-text-primary/35 lg:hidden"
        />
      )}
    </>
  );
}
