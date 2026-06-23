"use client";

import { useState } from "react";
import Link from "next/link";

const SEVERITY_COLORS: Record<string, string> = {
  critical: "bg-red-50 text-red-700 border-red-200",
  high: "bg-orange-50 text-orange-700 border-orange-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export interface DiagnosisItem {
  slug: string;
  title: string;
  severity: string;
  viewCount: number;
}

export default function VehicleDiagnosisList({
  diagnoses,
  makeName,
  modelName,
}: {
  diagnoses: DiagnosisItem[];
  makeName: string;
  modelName: string;
}) {
  const [query, setQuery] = useState("");

  const words = query
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length >= 1);

  const filtered =
    words.length > 0
      ? diagnoses.filter((d) => {
          const text = d.title.toLowerCase();
          return words.every((w) => text.includes(w));
        })
      : diagnoses;

  return (
    <div className="bg-surface-1 rounded-2xl border border-surface-border p-6 mb-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-heading font-bold text-text-primary">
            {makeName} {modelName} Common Problems &amp; Diagnoses
          </h2>
          <p className="text-xs text-text-muted mt-1">
            {words.length > 0
              ? `${filtered.length} of ${diagnoses.length} diagnoses match "${query}"`
              : `${diagnoses.length} AI-powered diagnoses`}
          </p>
        </div>
        <div className="relative w-full sm:w-64 shrink-0">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none"
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
            placeholder={`Filter ${diagnoses.length} diagnoses...`}
            className="w-full h-10 pl-9 pr-9 bg-surface-0 border border-surface-border rounded-xl text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-surface-3 text-text-muted flex items-center justify-center hover:text-text-primary transition-colors"
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-text-muted text-center py-8">
          No diagnoses match &quot;{query}&quot;. Try different keywords.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {filtered.map((d) => (
            <Link
              key={d.slug}
              href={`/symptom-checker/${d.slug}`}
              className="flex items-center justify-between p-2.5 min-h-[44px] bg-surface-0 rounded-lg border border-surface-border hover:border-primary/30 hover:bg-primary/5 transition-colors group"
            >
              <span className="text-xs font-medium text-text-primary font-heading group-hover:text-primary transition-colors truncate flex-1 min-w-0">
                {d.title}
              </span>
              <span
                className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold border shrink-0 ml-1.5 ${
                  SEVERITY_COLORS[d.severity] ?? SEVERITY_COLORS.medium
                }`}
              >
                {d.severity}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
