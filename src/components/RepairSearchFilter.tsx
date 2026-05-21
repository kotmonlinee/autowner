"use client";

import { useState } from "react";
import Link from "next/link";

function formatSlug(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function RepairSearchFilter({
  allSlugs,
}: {
  allSlugs: string[];
}) {
  const [query, setQuery] = useState("");

  const filtered = query.trim().length > 0
    ? allSlugs.filter((slug) =>
        slug.toLowerCase().includes(query.toLowerCase().trim())
      )
    : allSlugs;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-heading font-bold text-text-primary">
          All Repair Types
          {query.trim() && (
            <span className="ml-2 text-sm font-normal text-text-muted">
              ({filtered.length} of {allSlugs.length})
            </span>
          )}
        </h2>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter repairs (e.g. brake, oil, timing)..."
          className="w-full h-12 pl-12 pr-4 bg-surface-1 border border-surface-border rounded-xl text-text-primary placeholder:text-text-muted text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
        />
        {query.trim() && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
            aria-label="Clear search"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* Results */}
      {filtered.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {filtered.map((slug) => (
            <Link
              key={slug}
              href={`/repair-cost/${slug}`}
              className="px-3 py-1.5 bg-surface-1 border border-surface-border rounded-lg text-sm text-text-secondary hover:border-primary/20 hover:text-primary hover:shadow-sm transition-all duration-150 font-medium"
            >
              {formatSlug(slug)}
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-text-muted text-sm">
            No repairs match &quot;{query}&quot;. Try a different search term.
          </p>
        </div>
      )}
    </section>
  );
}
