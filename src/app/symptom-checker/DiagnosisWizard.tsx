"use client";

import { useState, createElement } from "react";
import Link from "next/link";
import {
  CircleAlert, Gauge, Power, Wind, Car, TriangleAlert, Circle, Droplets, Cog, Zap,
  AudioLines, ArrowDown, Vibrate, ArrowLeftRight, Hammer, Timer, Ear, MousePointerClick,
  BatteryWarning, Ban, Shuffle, Thermometer, Fan, TrendingUp, Waves, TrendingDown,
  Move3d, SunDim, ArrowUpDown, Sparkles, SendHorizonal,
} from "lucide-react";
import { CATEGORIES, SUBCATEGORIES, DIAGNOSES, type DiagnosisNode, type DiagnosisEntry } from "@/lib/diagnosis-tree";

type Severity = "low" | "medium" | "high" | "critical";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  CircleAlert, Gauge, Power, Wind, Car, TriangleAlert, Circle, Droplets, Cog, Zap,
  AudioLines, ArrowDown, Vibrate, ArrowLeftRight, Hammer, Timer, Ear, MousePointerClick,
  BatteryWarning, Ban, Shuffle, Thermometer, Fan, TrendingUp, Waves, TrendingDown,
  Move3d, SunDim, ArrowUpDown,
};

const SEVERITY_CONFIG: Record<Severity, { bg: string; text: string; border: string; label: string }> = {
  critical: { bg: "bg-red-50 dark:bg-red-950/30", text: "text-red-700 dark:text-red-400", border: "border-red-200 dark:border-red-800", label: "Critical — Stop Driving" },
  high: { bg: "bg-orange-50 dark:bg-orange-950/30", text: "text-orange-700 dark:text-orange-400", border: "border-orange-200 dark:border-orange-800", label: "Serious — Inspect Soon" },
  medium: { bg: "bg-amber-50 dark:bg-amber-950/30", text: "text-amber-700 dark:text-amber-400", border: "border-amber-200 dark:border-amber-800", label: "Moderate — Schedule Repair" },
  low: { bg: "bg-emerald-50 dark:bg-emerald-950/30", text: "text-emerald-700 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-800", label: "Low — Check When Convenient" },
};

interface AiDiagnosis {
  title: string;
  severity: Severity;
  description: string;
  possibleCodes: string[];
  repairKeywords: string[];
  confidence: number;
}

export default function DiagnosisWizard() {
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [result, setResult] = useState<DiagnosisEntry | null>(null);
  const [freeText, setFreeText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AiDiagnosis | null>(null);
  const [aiError, setAiError] = useState("");

  const handleReset = () => { setStep(0); setCategory(""); setSubcategory(""); setResult(null); setAiResult(null); setAiError(""); };

  const handleAiDiagnose = async () => {
    if (!freeText.trim() || freeText.trim().length < 10) return;
    setAiLoading(true);
    setAiError("");
    try {
      const res = await fetch("/api/diagnosis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: freeText.trim() }),
      });
      const data = await res.json();
      if (data.error) { setAiError(data.error); return; }
      setAiResult({ ...data.diagnosis, confidence: 85 });
      setStep(2);
    } catch {
      setAiError("Failed to reach AI service. Please try the guided diagnosis below.");
    } finally {
      setAiLoading(false);
    }
  };

  const displayResult = (aiResult || result) ? {
    title: aiResult?.title ?? result?.title ?? "",
    severity: (aiResult?.severity ?? result?.severity ?? "medium") as Severity,
    description: aiResult?.description ?? result?.description ?? "",
    possibleCodes: aiResult?.possibleCodes ?? result?.possibleCodes ?? [],
    repairItems: aiResult?.repairKeywords ?? result?.repairSlugs?.map(s => s.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")) ?? [],
    confidence: aiResult?.confidence ?? result?.confidence ?? 85,
  } : null;

  const sev = displayResult ? SEVERITY_CONFIG[displayResult.severity] : null;

  return (
    <div>
      {/* Step 0: Categories + AI Input */}
      {step === 0 && (
        <div>
          {/* AI Free-text Input */}
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider">AI Symptom Analysis</h2>
              <span className="text-xs text-text-muted font-heading">Powered by DeepSeek</span>
            </div>
            <p className="text-sm text-text-secondary mb-4">Describe your car's symptoms in your own words and AI will analyze the likely cause:</p>
            <div className="flex gap-3">
              <textarea value={freeText} onChange={(e) => setFreeText(e.target.value)}
                className="flex-1 px-4 py-3 bg-surface-0 border border-surface-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-all resize-none"
                rows={2}
                placeholder='e.g., "My 2018 Honda Civic makes a grinding noise when I brake at low speeds, and the brake pedal feels soft..."'/>
              <button onClick={handleAiDiagnose} disabled={aiLoading || freeText.trim().length < 10}
                className="shrink-0 px-5 py-3 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-glow transition-colors disabled:opacity-50 font-heading flex items-center gap-2">
                {aiLoading ? <><span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"/>Analyzing...</> : <><SendHorizonal className="w-4 h-4"/>Diagnose</>}
              </button>
            </div>
            {aiError && <p className="text-xs text-red-400 mt-2">{aiError}</p>}
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-surface-border"/>
            <span className="text-xs text-text-muted font-heading uppercase tracking-wider">or select a category</span>
            <div className="flex-1 h-px bg-surface-border"/>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CATEGORIES.map((cat) => {
              const Icn = ICON_MAP[cat.icon];
              return (
                <button key={cat.key} onClick={() => { setCategory(cat.key); setStep(1); }}
                  className="flex items-center gap-4 p-4 bg-surface-1 rounded-xl border border-surface-border hover:border-primary/30 hover:shadow-sm transition-all text-left group">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                    {Icn ? createElement(Icn, { className: "w-5 h-5" }) : null}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-heading font-semibold text-text-primary group-hover:text-primary transition-colors">{cat.label}</div>
                    <div className="text-xs text-text-muted mt-0.5">{cat.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 1: Subcategory */}
      {step === 1 && (
        <div>
          <button onClick={handleReset} className="text-xs text-text-muted hover:text-primary transition-colors font-heading mb-4 inline-flex items-center gap-1">← Back</button>
          <h2 className="text-lg font-heading font-bold text-text-primary mb-2">Can you be more specific?</h2>
          <p className="text-sm text-text-muted mb-5">What exactly is happening with your {CATEGORIES.find(c => c.key === category)?.label.toLowerCase()}?</p>
          <div className="grid grid-cols-1 gap-2">
            {(SUBCATEGORIES[category] ?? []).map((sub) => {
              const Icn = ICON_MAP[sub.icon];
              return (
                <button key={sub.key} onClick={() => { setSubcategory(sub.key); setResult(DIAGNOSES[`${category}-${sub.key}`] ?? null); setStep(2); }}
                  className="flex items-center gap-4 p-4 bg-surface-1 rounded-xl border border-surface-border hover:border-primary/30 hover:shadow-sm transition-all text-left group">
                  <div className="w-8 h-8 rounded-lg bg-primary/5 text-primary flex items-center justify-center shrink-0">
                    {Icn ? createElement(Icn, { className: "w-4 h-4" }) : null}
                  </div>
                  <div className="min-w-0"><div className="text-sm font-heading font-semibold text-text-primary group-hover:text-primary transition-colors">{sub.label}</div><div className="text-xs text-text-muted mt-0.5">{sub.desc}</div></div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 2: Result */}
      {step === 2 && displayResult && sev && (
        <div>
          <button onClick={handleReset} className="text-xs text-text-muted hover:text-primary transition-colors font-heading mb-6 inline-flex items-center gap-1">← Diagnose another issue</button>

          <div className={`${sev.bg} rounded-2xl border ${sev.border} p-5 mb-6`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${sev.bg} border ${sev.border} flex items-center justify-center`}>
                <TriangleAlert className={`w-6 h-6 ${sev.text}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-heading font-bold text-text-primary">{displayResult.title}</h2>
                  {aiResult && <Sparkles className="w-4 h-4 text-primary"/>}
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${sev.border} ${sev.text} font-heading mt-1`}>{sev.label}</span>
              </div>
              <div className="text-right shrink-0">
                <div className="text-2xl font-heading font-bold text-text-primary">{displayResult.confidence}%</div>
                <div className="text-xs text-text-muted">confidence</div>
              </div>
            </div>
          </div>

          <p className="text-sm text-text-secondary leading-relaxed mb-8">{displayResult.description}</p>

          {displayResult.possibleCodes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-3">Possible OBD-II Codes</h3>
              <div className="flex flex-wrap gap-2">
                {displayResult.possibleCodes.map((code) => (
                  <Link key={code} href={`/obd/${code.toLowerCase()}`} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-1 border border-surface-border text-sm font-mono font-bold text-primary hover:border-primary/30 hover:bg-primary/5 transition-colors">{code}</Link>
                ))}
              </div>
              <Link href="/obd" className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-primary hover:text-primary-glow transition-colors font-heading">Browse all 12,000+ codes →</Link>
            </div>
          )}

          {displayResult.repairItems.length > 0 && (
            <div className="bg-surface-1 rounded-2xl border border-surface-border p-5 mb-6">
              <h3 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-3">Recommended Repairs</h3>
              <div className="space-y-2">
                {displayResult.repairItems.map((item) => {
                  const slug = item.toLowerCase().replace(/\s+/g, "-");
                  return (
                    <Link key={slug} href={`/repair-cost/${slug}`} className="flex items-center justify-between p-3 bg-surface-0 rounded-xl border border-surface-border hover:border-primary/30 hover:bg-primary/5 transition-colors group">
                      <span className="text-sm font-medium text-text-primary font-heading group-hover:text-primary transition-colors">{item}</span>
                      <span className="text-xs text-text-muted font-heading">View estimate →</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link href="/repair-cost" className="flex flex-col items-center gap-2 p-4 bg-surface-1 rounded-xl border border-surface-border hover:border-primary/30 hover:shadow-sm transition-all group"><CircleAlert className="w-5 h-5 text-primary"/><span className="text-xs font-heading font-semibold text-text-primary group-hover:text-primary transition-colors">Browse Repair Costs</span></Link>
            <Link href="/recall-check" className="flex flex-col items-center gap-2 p-4 bg-surface-1 rounded-xl border border-surface-border hover:border-primary/30 hover:shadow-sm transition-all group"><TriangleAlert className="w-5 h-5 text-primary"/><span className="text-xs font-heading font-semibold text-text-primary group-hover:text-primary transition-colors">Check Safety Recalls</span></Link>
            <Link href="/quote-checker" className="flex flex-col items-center gap-2 p-4 bg-surface-1 rounded-xl border border-surface-border hover:border-primary/30 hover:shadow-sm transition-all group"><Gauge className="w-5 h-5 text-primary"/><span className="text-xs font-heading font-semibold text-text-primary group-hover:text-primary transition-colors">Verify a Mechanic Quote</span></Link>
          </div>
        </div>
      )}
    </div>
  );
}
