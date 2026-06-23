"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function RootLoading() {
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setTimedOut(true), 15000);
    return () => clearTimeout(t);
  }, []);

  if (timedOut) {
    return (
      <div className="min-h-screen bg-surface-0 flex flex-col">
        <header className="h-14 border-b border-surface-border bg-surface-1/80" />
        <main className="flex-1 flex items-center justify-center px-5">
          <div className="text-center">
            <svg className="w-12 h-12 text-surface-3 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <h1 className="text-lg font-heading font-bold text-text-primary mb-2">Taking too long to load</h1>
            <p className="text-sm text-text-muted mb-6">This page is taking longer than expected.</p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => window.location.reload()} className="px-5 py-2.5 bg-primary text-white text-sm font-bold font-heading rounded-lg hover:bg-primary-glow transition-all">Reload</button>
              <Link href="/" className="px-5 py-2.5 text-sm font-bold font-heading text-text-muted border border-surface-border rounded-lg hover:border-surface-4 transition-all">Go home</Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <header className="h-14 border-b border-surface-border bg-surface-1/80 flex items-center px-5">
        <div className="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 80" width="120" height="23" className="h-[23px] w-auto opacity-30">
            <defs><linearGradient id="ld-grad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#2563eb"/><stop offset="100%" stopColor="#60a5fa"/></linearGradient></defs>
            <text x="76" y="54" fontFamily="'Russo One','Arial Black',sans-serif" fontSize="40" fill="currentColor" className="text-text-primary">AUT<tspan fill="url(#ld-grad)">O</tspan>WNER</text>
          </svg>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-2 text-text-muted">
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
          <span className="text-sm font-heading">Loading...</span>
        </div>
      </main>
    </div>
  );
}
