"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { getVehicleImageUrl } from "@/lib/vehicle-images";
import { getRepairImageUrl } from "@/lib/repair-images";
import { resolveRepairSlug } from "@/lib/internal-linking";

const SEVERITY_COLORS: Record<string, string> = {
  critical: "bg-red-50 text-red-700 border-red-200",
  high: "bg-orange-50 text-orange-700 border-orange-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

function getDiagnosisImage(diag: any, d: any): string | null {
  if (diag.vehicle_make && diag.vehicle_model) {
    const vImg = getVehicleImageUrl(
      (diag.vehicle_make as string).toLowerCase().replace(/\s+/g, "-"),
      (diag.vehicle_model as string).toLowerCase().replace(/\s+/g, "-")
    );
    if (vImg) return vImg;
  }
  if (d.repairKeywords?.length) {
    for (const kw of d.repairKeywords) {
      const slug = resolveRepairSlug(kw);
      if (slug) {
        const rImg = getRepairImageUrl(slug);
        if (rImg) return rImg;
      }
    }
  }
  return null;
}

export default function DiagnosisBrowser({ initialDiagnoses, initialTotalCount, initialPage }: {
  initialDiagnoses: any[];
  initialTotalCount: number;
  initialPage: number;
}) {
  const [query, setQuery] = useState("");
  const [diagnoses, setDiagnoses] = useState<any[]>(initialDiagnoses);
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
            const data = await res.json();
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
      const data = await res.json();
      setDiagnoses(data.diagnoses ?? []);
      setTotalCount(data.total ?? 0);
      setPage(p);
      document.getElementById("diagnosis-results")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="diagnosis-results" className="mt-16 pt-12 border-t border-surface-border">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2 shrink-0">
          <h2 className="text-lg font-heading font-bold text-text-primary">Popular Diagnoses</h2>
          <span className="text-xs text-text-muted">
            {searching ? "Searching..." : isSearching ? `${totalCount} results` : `${totalCount} diagnoses`}
          </span>
        </div>
        <div className="relative w-full sm:flex-1 sm:max-w-md">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={16} height={16}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter diagnoses..."
            className="w-full h-10 pl-9 pr-4 bg-surface-1 border border-surface-border rounded-xl text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-surface-3 text-text-muted flex items-center justify-center hover:text-text-primary transition-colors">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width={12} height={12}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          )}
        </div>
      </div>

      {diagnoses.length === 0 && !searching ? (
        <div className="text-center py-12 bg-surface-1 rounded-xl border border-surface-border">
          <p className="text-text-muted text-sm">
            {isSearching ? `No diagnoses found for "${query}". Try different keywords.` : "No diagnoses available yet."}
          </p>
          {isSearching && (
            <Link href="/symptom-checker" className="inline-flex items-center gap-1.5 mt-3 text-sm font-heading font-semibold text-primary hover:underline">
              Try a new diagnosis →
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {diagnoses.map((d: any) => {
              const diag = d.diagnosis_json;
              const sev = SEVERITY_COLORS[diag.severity] ?? SEVERITY_COLORS.medium;
              const vehicle = d.vehicle_make ? `${d.vehicle_make} ${d.vehicle_model ?? ""}` : null;
              const img = getDiagnosisImage(d, diag);
              return (
                <Link key={d.slug} href={`/symptom-checker/${d.slug}`}
                  className="flex flex-col bg-surface-1 rounded-xl border border-surface-border hover:border-primary/30 hover:shadow-sm transition-all group overflow-hidden">
                  {img && (
                    <div className="w-full h-36 bg-surface-2 overflow-hidden">
                      <img src={img} alt={diag.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                    </div>
                  )}
                  <div className="flex flex-col gap-2 p-4 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-heading font-semibold text-text-primary group-hover:text-primary transition-colors line-clamp-2">{diag.title}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${sev} font-heading`}>{diag.severity}</span>
                    </div>
                    {vehicle && <span className="text-xs text-text-muted font-heading">{vehicle}</span>}
                    {diag.costEstimate && <span className="text-xs text-text-muted font-heading">Est. {diag.costEstimate}</span>}
                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-surface-border">
                      <span className="text-xs text-text-muted">{d.view_count} view{d.view_count !== 1 ? "s" : ""}</span>
                      <svg className="w-3.5 h-3.5 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width={14} height={14}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Pagination */}
          {!isSearching && computedPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {page > 1 && (
                <button onClick={() => loadPage(page - 1)} className="flex items-center gap-1 px-3 py-2 text-sm font-heading font-medium text-text-secondary hover:text-text-primary bg-surface-1 border border-surface-border rounded-lg hover:bg-surface-2 transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={16} height={16}><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>Previous
                </button>
              )}
              {Array.from({ length: Math.min(computedPages, 7) }, (_, i) => {
                const p = page <= 4 ? i + 1 : i + page - 3;
                if (p > computedPages) return null;
                return (
                  <button key={p} onClick={() => loadPage(p)}
                    className={`px-3 py-2 text-sm font-heading font-medium rounded-lg transition-colors ${p === page ? "bg-primary text-white" : "text-text-secondary hover:text-text-primary bg-surface-1 border border-surface-border hover:bg-surface-2"}`}>
                    {p}
                  </button>
                );
              })}
              {page < computedPages && (
                <button onClick={() => loadPage(page + 1)} className="flex items-center gap-1 px-3 py-2 text-sm font-heading font-medium text-text-secondary hover:text-text-primary bg-surface-1 border border-surface-border rounded-lg hover:bg-surface-2 transition-colors">
                  Next<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={16} height={16}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </button>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}
