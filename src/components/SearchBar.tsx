"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { resolveSearchRoute } from "@/lib/search-routing";

export default function SearchBar({ id = "global-search-input" }: { id?: string }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const route = resolveSearchRoute(query);
    if (route) router.push(route);
  };

  // ⌘K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById(id)?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [id]);

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md" role="search">
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" width={16} height={16}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          id={id}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search code, symptom, repair..."
          aria-label="Search codes, symptoms, repairs, or vehicles"
          className="h-10 w-full rounded-md border border-surface-border bg-surface-1 pl-9 pr-16 text-sm text-text-primary transition-colors placeholder:text-text-muted focus:border-primary focus:outline-none"
        />
        <kbd className="absolute right-2.5 top-1/2 hidden -translate-y-1/2 items-center rounded border border-surface-border bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-text-muted xl:inline-flex">
          {typeof navigator !== "undefined" && navigator.platform?.includes("Mac") ? "⌘" : "Ctrl"}K
        </kbd>
      </div>
    </form>
  );
}
