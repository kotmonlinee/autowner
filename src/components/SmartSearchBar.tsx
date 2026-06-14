"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { resolveSearchRoute } from "@/lib/search-routing";

interface Suggestion {
  type: string;
  label: string;
  href: string;
  detail?: string;
}

const TYPE_COLORS: Record<string, string> = {
  "OBD Code": "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  "Repair Cost": "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  "Warning Light": "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
  "Diagnosis": "bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800",
  "Symptom": "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
};

export default function SmartSearchBar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchSuggestions = useCallback(async (q: string) => {
    if (abortRef.current) abortRef.current.abort();
    if (q.trim().length < 2) { setSuggestions([]); setOpen(false); return; }
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: controller.signal });
      if (!res.ok) return;
      const data = await res.json();
      setSuggestions(data.results ?? []);
      setOpen((data.results ?? []).length > 0);
      setSelectedIndex(-1);
    } catch { /* aborted */ }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchSuggestions(query), 200);
    return () => clearTimeout(timer);
  }, [query, fetchSuggestions]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navigate = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Use keyboard-selected suggestion if any
    if (selectedIndex >= 0 && suggestions[selectedIndex]) {
      navigate(suggestions[selectedIndex].href);
      return;
    }
    const route = resolveSearchRoute(query);
    if (route) { setOpen(false); router.push(route); }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIndex((i) => Math.min(i + 1, suggestions.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIndex((i) => Math.max(i - 1, -1)); }
    else if (e.key === "Escape") { setOpen(false); }
    else if (e.key === "Enter" && selectedIndex >= 0) { e.preventDefault(); navigate(suggestions[selectedIndex].href); }
  };

  return (
    <div ref={containerRef} className="relative mt-6 sm:mt-10 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3" role="search">
        <div className="relative flex-1">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            name="search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => { if (suggestions.length > 0) setOpen(true); }}
            onKeyDown={handleKeyDown}
            placeholder="Search symptoms, repairs, codes..."
            aria-label="Search symptoms, repairs, or OBD codes"
            className="w-full h-14 pl-12 pr-5 bg-surface-1 border border-surface-border rounded-xl text-text-primary placeholder:text-text-muted text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <button type="submit" className="h-14 px-8 bg-primary text-white font-semibold font-heading rounded-xl hover:bg-primary-glow hover:-translate-y-px transition-all duration-150 shadow-sm shadow-primary/25 text-base sm:shrink-0">
          Check Now
        </button>
      </form>

      {open && suggestions.length > 0 && (
        <div className="absolute z-50 top-full mt-2 w-full bg-surface-1 border border-surface-border rounded-xl shadow-lg overflow-hidden">
          {suggestions.map((s, i) => (
            <button
              key={`${s.type}-${s.label}`}
              type="button"
              onClick={() => navigate(s.href)}
              onMouseEnter={() => setSelectedIndex(i)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-surface-2 transition-colors ${i === selectedIndex ? "bg-surface-2" : ""}`}
            >
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold font-heading border shrink-0 ${TYPE_COLORS[s.type] ?? "bg-surface-0 text-text-muted border-surface-border"}`}>{s.type}</span>
              <span className="text-sm text-text-primary font-heading font-medium truncate">{s.label}</span>
              {s.detail && <span className="hidden sm:inline text-xs text-text-muted truncate ml-auto">{s.detail}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
