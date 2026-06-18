"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { DiagnosticCause } from "@/lib/types";

function matchScore(cause: DiagnosticCause, selectedSymptoms: Set<string>): number {
  let score = 0;
  for (const kw of cause.keywords) {
    for (const s of selectedSymptoms) {
      if (s.toLowerCase().includes(kw) || kw.includes(s.toLowerCase())) score++;
    }
  }
  return score;
}

interface Props {
  code: string;
  symptoms: string[];
  diagnosticCauses: DiagnosticCause[];
}

const TOOL_ICONS: Record<string, string> = {
  "👀 No tools": "👀",
  "🔧 Basic tools": "🔧",
  "📟 OBD scanner": "📟",
  "🏪 Shop": "🏪",
};

export default function ObdDiagnosticFunnel({ code, symptoms, diagnosticCauses }: Props) {
  const [selectedSymptoms, setSelectedSymptoms] = useState<Set<string>>(new Set());
  const [expandedCause, setExpandedCause] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<Record<number, "confirmed" | "ruled-out" | null>>({});

  const toggleSymptom = (s: string) => {
    setSelectedSymptoms((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
    setFeedback({});
    setExpandedCause(null);
  };

  // Rank causes by match score
  const rankedCauses = useMemo(() => {
    if (selectedSymptoms.size === 0) return [];

    const scored = diagnosticCauses.map((c) => ({
      ...c,
      score: matchScore(c, selectedSymptoms),
    }));

    // If no matches via keywords, show all sorted by probability
    const hasMatches = scored.some((c) => c.score > 0);
    if (!hasMatches) {
      return [...scored].sort((a, b) => b.probability - a.probability);
    }

    return scored
      .filter((c) => c.score > 0)
      .sort((a, b) => b.score - a.score || b.probability - a.probability);
  }, [selectedSymptoms, diagnosticCauses]);

  // Find the top confirmed cause
  const confirmedCause = rankedCauses.find((c, i) => feedback[i] === "confirmed");
  const ruledOut = rankedCauses.filter((c, i) => feedback[i] === "ruled-out");

  return (
    <div className="bg-surface-1 rounded-xl border-2 border-primary/15 p-5 mb-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
            <path d="M8 11h6M11 8v6" />
          </svg>
        </span>
        <div>
          <h2 className="text-base font-heading font-bold text-text-primary">
            Pinpoint the Cause
          </h2>
          <p className="text-xs text-text-muted">
            Select your symptoms and we&apos;ll show you how to verify each possible cause, step by step
          </p>
        </div>
      </div>

      {/* Step 1: Symptom checklist */}
      <div className="mb-5">
        <p className="text-xs font-heading font-bold text-text-primary uppercase tracking-wider mb-2">
          Step 1 — What symptoms are you noticing?
        </p>
        <p className="text-xs text-text-muted mb-3">
          Select all that apply to your {code} situation
        </p>
        <div className="flex flex-wrap gap-2">
          {symptoms.map((s) => {
            const isSelected = selectedSymptoms.has(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => toggleSymptom(s)}
                className={`px-3.5 py-2 rounded-lg text-xs font-heading font-semibold border transition-all ${
                  isSelected
                    ? "bg-primary text-white border-primary shadow-sm shadow-primary/20"
                    : "bg-surface-0 border-surface-border text-text-secondary hover:border-primary/30"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Ranked causes */}
      {rankedCauses.length > 0 && (
        <div className="border-t border-surface-border pt-4">
          <p className="text-xs font-heading font-bold text-text-primary uppercase tracking-wider mb-2">
            Step 2 — Most likely causes
          </p>
          <p className="text-xs text-text-muted mb-3">
            {selectedSymptoms.size > 0
              ? `Based on your ${selectedSymptoms.size} selected symptom${selectedSymptoms.size > 1 ? "s" : ""}, here are the matching causes:`
              : "Select symptoms above to narrow down the causes"}
          </p>

          <div className="space-y-3">
            {rankedCauses.map((cause, i) => {
              const isExpanded = expandedCause === i;
              const fb = feedback[i];

              return (
                <div
                  key={cause.cause || `cause-${i}`}
                  className={`rounded-lg border transition-all ${
                    fb === "confirmed"
                      ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/20"
                      : fb === "ruled-out"
                      ? "border-surface-border bg-surface-0 opacity-60"
                      : "border-surface-border bg-surface-0 hover:border-primary/20"
                  }`}
                >
                  {/* Cause header */}
                  <button
                    type="button"
                    onClick={() => setExpandedCause(isExpanded ? null : i)}
                    className="w-full text-left p-4 flex items-start gap-3"
                  >
                    {/* Probability bar */}
                    <div className="shrink-0 w-10 text-center">
                      <span className={`text-lg font-bold font-mono ${
                        fb === "confirmed" ? "text-emerald-600" : "text-primary"
                      }`}>
                        {cause.probability}%
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-heading font-semibold text-text-primary">
                        {cause.cause}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-[10px] font-heading text-text-muted">
                          {cause.costRange}
                        </span>
                        <span className="text-[10px] font-heading text-text-muted">
                          {cause.diyLevel}
                        </span>
                        <span className="text-[10px] font-heading text-text-muted">
                          {cause.estTime}
                        </span>
                      </div>
                      {fb && (
                        <span className={`inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          fb === "confirmed"
                            ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                            : "bg-surface-2 text-text-muted line-through"
                        }`}>
                          {fb === "confirmed" ? "✓ Confirmed" : "✗ Ruled out"}
                        </span>
                      )}
                    </div>
                    <svg
                      className={`w-4 h-4 text-text-muted shrink-0 mt-1 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {/* Expanded: verification steps + actions */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-surface-border pt-3">
                      {/* Verification steps */}
                      <p className="text-xs font-heading font-bold text-text-secondary mb-2">
                        How to verify:
                      </p>
                      <div className="space-y-2 mb-4">
                        {cause.checks.map((check, j) => (
                          <div key={j} className="flex items-start gap-2.5 text-xs">
                            <span className="shrink-0 mt-0.5" title={check.level}>
                              {TOOL_ICONS[check.level] || "•"}
                            </span>
                            <div>
                              <p className="text-text-secondary">{check.method}</p>
                              <p className="text-[10px] text-primary/70 font-heading mt-0.5">
                                → {check.verdict}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-surface-border">
                        {fb !== "confirmed" && (
                          <button
                            type="button"
                            onClick={() => setFeedback((prev) => ({ ...prev, [i]: "confirmed" }))}
                            className="px-3 py-1.5 rounded-lg text-[11px] font-heading font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                          >
                            ✓ This is my problem
                          </button>
                        )}
                        {fb !== "ruled-out" && (
                          <button
                            type="button"
                            onClick={() => setFeedback((prev) => ({ ...prev, [i]: "ruled-out" }))}
                            className="px-3 py-1.5 rounded-lg text-[11px] font-heading font-semibold border border-surface-border text-text-muted hover:text-text-secondary hover:border-text-muted transition-colors"
                          >
                            ✗ Not this one
                          </button>
                        )}
                        {cause.repairSlug && (
                          <Link
                            href={`/repair-cost/${cause.repairSlug}`}
                            className="ml-auto px-3 py-1.5 rounded-lg text-[11px] font-heading font-bold bg-primary text-white hover:bg-primary-glow transition-colors flex items-center gap-1"
                          >
                            View Repair
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                          </Link>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 3: Confirmed diagnosis */}
      {confirmedCause && (
        <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-950/20 border-2 border-emerald-300 dark:border-emerald-700 rounded-xl">
          <p className="text-sm font-heading font-bold text-text-primary mb-2">
            Diagnosis confirmed
          </p>
          <p className="text-sm text-text-secondary mb-3">
            {confirmedCause.cause}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {confirmedCause.repairSlug && (
              <Link
                href={`/repair-cost/${confirmedCause.repairSlug}`}
                className="px-5 py-2.5 bg-emerald-600 text-white text-sm font-heading font-bold rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                See Repair Options
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </Link>
            )}
            <Link
              href={`/quote-checker`}
              className="px-4 py-2 text-sm font-heading font-semibold text-primary border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors"
            >
              Check Repair Quote
            </Link>
          </div>
        </div>
      )}

      {/* No matches fallback */}
      {selectedSymptoms.size > 0 && rankedCauses.length > 0 && (
        <p className="mt-4 text-xs text-text-muted text-center">
          Not sure? Try our full{" "}
          <Link href={`/symptom-checker`} className="text-primary font-semibold hover:underline">
            AI Diagnosis Wizard
          </Link>{" "}
          for a deeper analysis with vehicle-specific guidance
        </p>
      )}
    </div>
  );
}
