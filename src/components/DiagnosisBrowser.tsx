"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Diagnosis } from "@/lib/types";

const SEVERITY_COLORS: Record<string, string> = {
  critical: "bg-severity-critical-bg text-severity-critical border-severity-critical-border",
  high: "bg-severity-caution-bg text-severity-caution border-severity-caution-border",
  medium: "bg-surface-2 text-text-secondary border-surface-border",
  low: "bg-severity-info-bg text-severity-info border-severity-info-border",
};

function getStartingCost(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const match = value.match(/\$+\s*([\d,]+)/);
  return match ? `$${match[1]}` : null;
}

export default function DiagnosisBrowser({ initialDiagnoses, initialTotalCount, initialPage }: {
  initialDiagnoses: Diagnosis[];
  initialTotalCount: number;
  initialPage: number;
}) {
  const [query, setQuery] = useState("");
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>(initialDiagnoses);
  const [page, setPage] = useState(initialPage);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const LIMIT = 6;
  const isSearching = query.trim().length >= 2;
  const computedPages = Math.max(1, Math.ceil(totalCount / LIMIT));

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setSearching(true);
        try {
          const res = await fetch(`/api/diagnosis-search?q=${encodeURIComponent(query.trim())}&limit=48`);
          if (res.ok) {
            const data = await res.json() as { diagnoses?: Diagnosis[]; total?: number };
            setDiagnoses(data.diagnoses ?? []);
            setTotalCount(data.total ?? 0);
            setPage(1);
          }
        } catch { /* fallback */ }
        setSearching(false);
      } else {
        setDiagnoses(initialDiagnoses);
        setTotalCount(initialTotalCount);
        setPage(initialPage);
        setSearching(false);
      }
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, initialDiagnoses, initialPage, initialTotalCount]);

  const loadPage = async (p: number) => {
    const q = query.trim().length >= 2 ? `&q=${encodeURIComponent(query.trim())}` : "";
    const res = await fetch(`/api/diagnosis-search?limit=${LIMIT}&page=${p}${q}`);
    if (res.ok) {
      const data = await res.json() as { diagnoses?: Diagnosis[]; total?: number };
      setDiagnoses(data.diagnoses ?? []);
      setTotalCount(data.total ?? 0);
      setPage(p);
      document.getElementById("diagnosis-results")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="diagnosis-results" className="mt-16 border-t border-surface-border pt-10">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <p className="text-[10px] font-heading font-bold uppercase tracking-[0.15em] text-primary">Diagnosis library</p>
          <h2 className="mt-2 font-display text-4xl font-semibold tracking-[-0.035em] text-text-primary sm:text-5xl">
            Browse previous diagnoses
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary">
            Start with frequently viewed reports or search by symptom, vehicle, or trouble code.
          </p>
        </div>
        <div className="relative w-full lg:max-w-md">
          <svg className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={16} height={16}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search diagnoses"
            aria-label="Search diagnoses"
            className="h-12 w-full border border-surface-border bg-surface-1 pl-11 pr-11 font-heading text-sm text-text-primary transition-colors placeholder:text-text-muted focus:border-primary focus:outline-none"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} aria-label="Clear diagnosis search"
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center border border-surface-border bg-surface-0 text-text-muted transition-colors hover:border-primary hover:text-primary">
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width={12} height={12}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          )}
        </div>
      </div>

      <div className="mt-7 flex items-center justify-between border-y border-surface-border bg-surface-1 px-4 py-3">
        <p className="text-[10px] font-heading font-bold uppercase tracking-[0.12em] text-text-muted">
          {isSearching ? "Search results" : "Most viewed"}
        </p>
        <p className="font-mono text-[10px] text-text-muted">
          {searching ? "Searching..." : `${totalCount.toLocaleString()} ${isSearching ? "results" : "reports"}`}
        </p>
      </div>

      {diagnoses.length === 0 && !searching ? (
        <div className="border-b border-surface-border bg-surface-1 py-14 text-center">
          <p className="font-display text-2xl font-semibold text-text-primary">
            {isSearching ? "No matching diagnoses" : "No diagnoses available yet"}
          </p>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-text-muted">
            {isSearching ? `No saved reports matched “${query}”. Try a vehicle model, symptom, or trouble code.` : "Start the guided diagnosis above to create the first result."}
          </p>
          {isSearching && (
            <Link prefetch={false} href="/symptom-checker" className="mt-5 inline-flex border-b border-primary pb-0.5 text-sm font-heading font-bold text-primary">
              Start a new diagnosis →
            </Link>
          )}
        </div>
      ) : (
        <>
          <ol className="divide-y divide-surface-border border-b border-surface-border">
            {diagnoses.map((d, index) => {
              const diag = d.diagnosis_json;
              const sev = SEVERITY_COLORS[diag.severity] ?? SEVERITY_COLORS.medium;
              const vehicle = d.vehicle_make ? `${d.vehicle_make} ${d.vehicle_model ?? ""}`.trim() : null;
              const startingCost = getStartingCost(diag.costEstimate);
              const displayNumber = String((page - 1) * LIMIT + index + 1).padStart(2, "0");
              return (
                <li key={d.slug}>
                  <Link prefetch={false} href={`/symptom-checker/${d.slug}`}
                    className="group grid min-w-0 grid-cols-[32px_minmax(0,1fr)_18px] items-start gap-3 bg-surface-0 px-3 py-5 transition-colors hover:bg-surface-1 sm:grid-cols-[44px_minmax(0,1fr)_18px] sm:gap-4 sm:px-4">
                    <span className="pt-1 font-mono text-[10px] font-bold text-primary">{displayNumber}</span>
                    <div className="min-w-0">
                      <h3 className="font-display text-xl font-semibold leading-tight tracking-[-0.025em] text-text-primary transition-colors group-hover:text-primary sm:text-2xl">
                        {diag.title}
                      </h3>
                      <div className="mt-3 flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2 text-[11px]">
                        {vehicle && (
                          <span className="font-heading font-bold uppercase tracking-[0.08em] text-text-secondary">{vehicle}</span>
                        )}
                        <span className={`inline-flex border px-2 py-0.5 font-heading font-bold uppercase tracking-[0.08em] ${sev}`}>
                          {diag.severity ?? "medium"}
                        </span>
                        {startingCost && (
                          <span className="text-text-muted">Est. from {startingCost}</span>
                        )}
                        <span className="text-text-muted">
                          {Number(d.view_count ?? 0).toLocaleString()} views
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="mt-1.5 h-4 w-4 shrink-0 text-text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                  </Link>
                </li>
              );
            })}
          </ol>

          {!isSearching && computedPages > 1 && (
            <nav className="mt-7 flex flex-wrap items-center justify-between gap-3" aria-label="Diagnosis pages">
              <p className="text-[10px] font-heading font-bold uppercase tracking-[0.1em] text-text-muted">
                Page {page} of {computedPages}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {page > 1 && (
                  <button onClick={() => loadPage(page - 1)} className="inline-flex min-h-10 items-center gap-2 border border-surface-border bg-surface-1 px-3 text-xs font-heading font-bold text-text-secondary transition-colors hover:border-primary hover:text-primary">
                    <span aria-hidden="true">←</span> Previous
                  </button>
                )}
                {Array.from({ length: Math.min(computedPages, 7) }, (_, i) => {
                  const p = page <= 4 ? i + 1 : i + page - 3;
                  if (p > computedPages) return null;
                  return (
                    <button key={p} onClick={() => loadPage(p)} aria-label={`Go to page ${p}`} aria-current={p === page ? "page" : undefined}
                      className={`flex h-10 w-10 items-center justify-center border text-xs font-heading font-bold transition-colors ${p === page ? "border-primary bg-primary text-white" : "border-surface-border bg-surface-1 text-text-secondary hover:border-primary hover:text-primary"}`}>
                      {p}
                    </button>
                  );
                })}
                {page < computedPages && (
                  <button onClick={() => loadPage(page + 1)} className="inline-flex min-h-10 items-center gap-2 border border-surface-border bg-surface-1 px-3 text-xs font-heading font-bold text-text-secondary transition-colors hover:border-primary hover:text-primary">
                    Next <span aria-hidden="true">→</span>
                  </button>
                )}
              </div>
            </nav>
          )}
        </>
      )}
    </section>
  );
}
