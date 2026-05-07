"use client";

import { useEffect } from "react";
import Link from "next/link";
import { logError } from "@/lib/error-logging";

export default function PostError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Post page error:", error);
    logError(error, { url: window.location.pathname });
  }, [error]);

  return (
    <div className="min-h-screen bg-surface-0 relative flex flex-col">
      {/* Navbar placeholder */}
      <header className="h-14 border-b border-surface-border bg-surface-1/80 backdrop-blur-sm" />

      <main className="flex-1 flex items-center justify-center px-5">
        <div className="max-w-md mx-auto text-center py-24">
          {/* Wrench icon */}
          <div className="flex items-center justify-center mb-8">
            <svg
              className="w-24 h-24 text-surface-3"
              viewBox="0 0 100 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="82" x2="52" y2="48" />
              <circle cx="70" cy="30" r="20" />
              <circle cx="70" cy="30" r="10" strokeWidth="2.5" />
              <line x1="56" y1="28" x2="65" y2="19" strokeWidth="3" />
              <line x1="52" y1="32" x2="61" y2="23" strokeWidth="3" />
              <circle cx="70" cy="30" r="4" fill="currentColor" strokeWidth="1" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-text-primary font-heading mb-2">
            Something went wrong
          </h1>

          <p className="text-text-muted mb-8 leading-relaxed">
            An unexpected error occurred while loading this post. This might be a
            temporary issue.
          </p>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => reset()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold font-heading rounded-lg hover:bg-primary-glow hover:-translate-y-px transition-all duration-150 shadow-sm shadow-primary/20"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 4v6h6M23 20v-6h-6" />
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
              </svg>
              Try again
            </button>

            <Link
              href="/"
              className="px-5 py-2.5 text-sm font-bold font-heading text-text-muted hover:text-text-secondary border border-surface-border rounded-lg hover:border-surface-4 transition-all"
            >
              Go home
            </Link>
          </div>
        </div>
      </main>

      {/* Footer placeholder */}
      <footer className="h-14 border-t border-surface-border" />
    </div>
  );
}
