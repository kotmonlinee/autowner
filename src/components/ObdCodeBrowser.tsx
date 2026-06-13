"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

interface ObdCode {
  code: string;
  title: string;
  severity: number;
}

function severityBar(severity: number): string {
  if (severity >= 5) return "bg-red-500 w-1.5";
  if (severity >= 4) return "bg-orange-500 w-1";
  if (severity >= 3) return "bg-yellow-500 w-1";
  return "bg-green-500 w-1";
}

function severityBadgeClass(severity: number): string {
  if (severity >= 5) return "bg-severity-critical-bg text-severity-critical border-severity-critical-border";
  if (severity >= 4) return "bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800";
  if (severity >= 3) return "bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800";
  return "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800";
}

const SEVERITY_LABELS: Record<number, string> = { 5: "Critical", 4: "Serious", 3: "Moderate", 2: "Minor", 1: "Minor" };

const PREFIXES = [
  { key: "", label: "All" },
  { key: "P", label: "Powertrain" },
  { key: "C", label: "Chassis" },
  { key: "B", label: "Body" },
  { key: "U", label: "Network" },
];

export default function ObdCodeBrowser({ initialCodes, initialPrefix }: { initialCodes: ObdCode[]; initialPrefix: string }) {
  const [query, setQuery] = useState("");
  const [prefix, setPrefix] = useState(initialPrefix);
  const [codes, setCodes] = useState<ObdCode[]>(initialCodes);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchCodes = useCallback(async (q: string, p: string) => {
    try {
      const params = new URLSearchParams();
      if (q.trim().length >= 2) params.set("q", q.trim());
      if (p) params.set("prefix", p);
      params.set("limit", "50");
      const res = await fetch(`/api/obd-search?${params}`);
      if (res.ok) {
        const data = await res.json();
        setCodes(data.codes ?? []);
      }
    } catch {
      // keep current codes on error
    }
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (query.trim().length >= 2 || prefix) {
        fetchCodes(query, prefix);
      } else if (!prefix) {
        setCodes(initialCodes);
      }
    }, 200);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, prefix, fetchCodes, initialCodes]);

  return (
    <>
      {/* Search */}
      <div className="max-w-xl mb-6">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by code or keyword (e.g. P0420, catalyst)..."
            className="w-full h-12 sm:h-14 pl-12 pr-5 bg-surface-1 border border-surface-border rounded-xl text-text-primary placeholder:text-text-muted text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-surface-3 text-text-muted flex items-center justify-center hover:text-text-primary transition-colors"
              aria-label="Clear search"
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          )}
        </div>
      </div>

      {/* Prefix filter tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {PREFIXES.map((p) => (
          <button
            key={p.key || "all"}
            type="button"
            onClick={() => setPrefix(p.key)}
            className={`px-4 py-2 rounded-lg text-sm font-heading font-semibold transition-colors ${
              prefix === p.key
                ? "bg-primary text-white"
                : "bg-surface-1 text-text-secondary border border-surface-border hover:border-primary/30 hover:text-text-primary"
            }`}
          >
            {p.key ? <><span className="font-mono font-bold mr-1.5">{p.key}</span>{p.label}</> : p.label}
          </button>
        ))}
      </div>

      {/* Results */}
      {codes.length === 0 ? (
        <div className="text-center py-12 bg-surface-1 rounded-xl border border-surface-border">
          <p className="text-text-muted text-sm">No codes found{query ? ` for "${query}"` : ""}.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {codes.map((c) => (
            <Link key={c.code} href={`/obd/${c.code.toLowerCase()}`}
              className="group flex items-center gap-3 px-4 py-3.5 min-h-[48px] bg-surface-1 rounded-xl border border-surface-border hover:border-primary/20 hover:shadow-sm transition-all overflow-hidden">
              <span className={`shrink-0 self-stretch rounded-full ${severityBar(c.severity)}`} />
              <span className="text-sm font-mono font-bold text-text-primary group-hover:text-primary transition-colors shrink-0 w-14 sm:w-16">{c.code}</span>
              <span className="flex-1 min-w-0 text-sm text-text-secondary truncate">{c.title}</span>
              <span className={`inline-flex items-center px-2.5 py-1 rounded text-[11px] font-bold font-heading border shrink-0 ${severityBadgeClass(c.severity)}`}>{SEVERITY_LABELS[c.severity] ?? "Minor"}</span>
              <svg className="w-4 h-4 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 hidden sm:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
