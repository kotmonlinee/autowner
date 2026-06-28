"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { resolveSearchRoute } from "@/lib/search-routing";
import { logError } from "@/lib/error-logging";

const popularLinks = [
  { name: "OBD-II Codes", href: "/obd" },
  { name: "Repair Costs", href: "/repair-cost" },
  { name: "Warning Lights", href: "/warning-lights" },
  { name: "Recall Check", href: "/recall-check" },
  { name: "Quote Checker", href: "/quote-checker" },
];

export default function NotFound() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    logError(`404: ${pathname}`, { url: pathname });
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const route = resolveSearchRoute(query);
    if (route) router.push(route);
  };

  return (
    <div className="min-h-screen bg-surface-0 flex items-center justify-center">
      <div className="max-w-lg mx-auto px-5 py-24 text-center">
        <div className="mb-8 flex items-center justify-center">
          <svg className="w-32 h-32 sm:w-40 sm:h-40 text-surface-3" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width={128} height={128}>
            <line x1="18" y1="82" x2="52" y2="48" />
            <circle cx="70" cy="30" r="20" />
            <circle cx="70" cy="30" r="10" strokeWidth="2.5" />
            <line x1="56" y1="28" x2="65" y2="19" strokeWidth="3" />
            <line x1="52" y1="32" x2="61" y2="23" strokeWidth="3" />
            <circle cx="70" cy="30" r="4" fill="currentColor" strokeWidth="1" />
            <line x1="22" y1="78" x2="30" y2="70" strokeWidth="2" />
            <line x1="26" y1="82" x2="34" y2="74" strokeWidth="2" />
            <line x1="30" y1="78" x2="38" y2="70" strokeWidth="2" />
          </svg>
        </div>

        <h1 className="text-8xl sm:text-9xl font-bold text-text-primary font-display mb-4 tracking-tight">404</h1>
        <p className="text-xl sm:text-2xl font-semibold text-text-primary font-heading mb-3">This page isn&apos;t under the hood.</p>
        <p className="text-text-muted mb-8 max-w-md mx-auto leading-relaxed">The page you&apos;re looking for has been towed, sold for parts, or never existed.</p>

        <form onSubmit={handleSearch} className="max-w-sm mx-auto mb-8" role="search">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" width={16} height={16}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search codes, repairs, quotes..."
              className="w-full pl-10 pr-4 py-2.5 bg-surface-1 border border-surface-border rounded-xl text-text-primary text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-text-muted" />
          </div>
        </form>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {popularLinks.map((l) => (
            <Link key={l.href} href={l.href} className="px-3 py-2 rounded-lg bg-surface-1 border border-surface-border text-xs font-medium text-text-secondary hover:text-primary hover:border-primary/20 transition-colors font-heading">
              {l.name}
            </Link>
          ))}
        </div>

        <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-sm font-semibold font-heading rounded-lg hover:bg-primary-glow hover:-translate-y-px transition-all duration-150 shadow-sm shadow-primary/20">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width={16} height={16}>
            <path d="M5 12h14M12 5l-7 7 7 7" />
          </svg>
          Back to Homepage
        </Link>
      </div>
    </div>
  );
}
