"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import WarningLightIcon from "@/components/WarningLightIcon";
import { warningLights, type WarningLightSeverity } from "@/lib/warning-lights-data";

const SEVERITY_CONFIG: Record<WarningLightSeverity, { label: string; bg: string; text: string; border: string; iconBg: string }> = {
  critical: { label: "Critical", bg: "bg-severity-critical-bg", text: "text-severity-critical", border: "border-severity-critical-border", iconBg: "bg-severity-critical-bg text-severity-critical" },
  caution: { label: "Caution", bg: "bg-severity-caution-bg", text: "text-severity-caution", border: "border-severity-caution-border", iconBg: "bg-severity-caution-bg text-severity-caution" },
  informational: { label: "Informational", bg: "bg-severity-info-bg", text: "text-severity-info", border: "border-severity-info-border", iconBg: "bg-severity-info-bg text-severity-info" },
};

const URGENCY_DOT: Record<WarningLightSeverity, string> = {
  critical: "bg-red-500",
  caution: "bg-amber-500",
  informational: "bg-emerald-500",
};

const SORTED = [...warningLights].sort(
  (a, b) => (SEVERITY_CONFIG[a.severity] ? 0 : 1) - (SEVERITY_CONFIG[b.severity] ? 0 : 1) +
    Object.keys(SEVERITY_CONFIG).indexOf(a.severity) - Object.keys(SEVERITY_CONFIG).indexOf(b.severity)
);

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

export default function WarningLightsGrid() {
  const [activeSeverity, setActiveSeverity] = useState<WarningLightSeverity | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let items = SORTED;
    if (activeSeverity !== "all") items = items.filter((l) => l.severity === activeSeverity);
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter((l) => l.title.toLowerCase().includes(q) || l.meaning.toLowerCase().includes(q));
    }
    return items;
  }, [activeSeverity, search]);

  const grouped = useMemo(() => {
    const order = ["critical", "caution", "informational"];
    return order
      .map((key) => {
        const sev = key as WarningLightSeverity;
        const items = filtered.filter((l) => l.severity === sev);
        return { severity: sev, label: SEVERITY_CONFIG[sev].label, iconBg: SEVERITY_CONFIG[sev].iconBg, items };
      })
      .filter((g) => g.items.length > 0);
  }, [filtered]);

  return (
    <>
      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={16} height={16}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            placeholder="Search warning lights..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-surface-1 border border-surface-border rounded-xl text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {[{ key: "all", label: "All" }, { key: "critical", label: "Critical" }, { key: "caution", label: "Caution" }, { key: "informational", label: "Informational" }].map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveSeverity(f.key as WarningLightSeverity | "all")}
              className={`px-3.5 py-2 rounded-lg text-sm font-heading font-semibold transition-colors ${
                activeSeverity === f.key
                  ? "bg-primary text-white"
                  : "bg-surface-1 text-text-secondary border border-surface-border hover:border-primary/30"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* No results */}
      {filtered.length === 0 && (
        <div className="text-center py-12 bg-surface-1 rounded-xl border border-surface-border">
          <p className="text-text-muted text-sm">No warning lights match your search.</p>
        </div>
      )}

      {/* Grouped by severity */}
      {grouped.map((group) => (
        <section key={group.severity} className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className={`w-3 h-3 rounded-full ${URGENCY_DOT[group.severity]}`} />
            <h2 className="text-lg font-heading font-bold text-text-primary">{group.label}</h2>
            <span className="text-xs text-text-muted font-heading">({group.items.length})</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {group.items.map((light) => {
              const sev = SEVERITY_CONFIG[light.severity];
              return (
                <Link
                  key={light.slug}
                  href={`/warning-lights/${light.slug}`}
                  className={`group flex flex-col p-5 rounded-2xl border-l-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${sev.bg} ${sev.border}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <WarningLightIcon slug={light.slug} size={40} severity={light.severity} />
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold font-heading ${sev.bg} ${sev.text} border ${sev.border}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${URGENCY_DOT[light.severity]}`} />
                      {sev.label}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-text-primary font-heading group-hover:text-primary transition-colors mb-2">
                    {light.title}
                  </h3>

                  <p className="text-sm text-text-secondary leading-relaxed line-clamp-2 mb-4 flex-1">
                    {light.meaning}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-surface-border">
                    <span className="text-xs text-text-muted truncate">
                      {formatCurrency(light.min_cost)} – {formatCurrency(light.max_cost)}
                    </span>
                    <svg className="w-4 h-4 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width={16} height={16}>
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </>
  );
}
