"use client";

import { useEffect } from "react";
import Link from "next/link";
import { logError } from "@/lib/error-logging";

export default function ContentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Content page error:", error);
    logError(error, { url: window.location.pathname });
  }, [error]);

  return (
    <div className="text-center py-20 px-5">
      <svg className="w-16 h-16 text-surface-3 mx-auto mb-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <h2 className="text-xl font-heading font-bold text-text-primary mb-2">Something went wrong</h2>
      <p className="text-sm text-text-muted mb-6 max-w-md mx-auto">This page failed to load. It may be a temporary issue — please try again.</p>
      <div className="flex items-center justify-center gap-3">
        <button onClick={() => reset()} className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold font-heading rounded-lg hover:bg-primary-glow transition-all">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 4v6h6M23 20v-6h-6" /><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" /></svg>
          Try again
        </button>
        <Link href="/" className="px-5 py-2.5 text-sm font-bold font-heading text-text-muted hover:text-text-secondary border border-surface-border rounded-lg hover:border-surface-4 transition-all">
          Go home
        </Link>
      </div>
    </div>
  );
}
