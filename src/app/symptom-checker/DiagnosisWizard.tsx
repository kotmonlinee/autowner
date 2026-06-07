"use client";

import { useState, createElement, useEffect } from "react";
import Link from "next/link";
import {
  CircleAlert, Gauge, Power, Wind, Car, TriangleAlert, Circle, Droplets, Cog, Zap,
  AudioLines, ArrowDown, Vibrate, ArrowLeftRight, Hammer, Timer, Ear, MousePointerClick,
  BatteryWarning, Ban, Shuffle, Thermometer, Fan, TrendingUp, Waves, TrendingDown,
  Move3d, SunDim, ArrowUpDown, Sparkles, SendHorizonal, ChevronRight,
} from "lucide-react";
import { fetchVehicleMakes, fetchVehicleModels } from "@/lib/data/browser";
import { CATEGORIES, SUBCATEGORIES, type DiagnosisNode } from "@/lib/diagnosis-tree";

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
  low: { bg: "bg-emerald-50 dark:bg-emerald-950/30", text: "text-emerald-700 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-800", label: "Low Concern" },
};

interface CauseItem {
  description: string;
  likelihood: string;
}
interface AiResult {
  title: string;
  severity: Severity;
  summary: string;
  causes: CauseItem[];
  whatToDo: string;
  costEstimate: string;
  possibleCodes: string[];
  repairKeywords: string[];
}

export default function DiagnosisWizard() {
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState<DiagnosisNode | null>(null);

  // Vehicle info (step 2)
  const [makes, setMakes] = useState<{ name: string; slug: string }[]>([]);
  const [models, setModels] = useState<{ name: string; slug: string }[]>([]);
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedMakeSlug, setSelectedMakeSlug] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AiResult | null>(null);
  const [aiError, setAiError] = useState("");

  const catLabel = CATEGORIES.find(c => c.key === category)?.label ?? "";
  const subLabel = subcategory?.label ?? "";

  // Load makes for vehicle dropdown
  useEffect(() => { fetchVehicleMakes().then(setMakes); }, []);

  // Load models when make changes
  useEffect(() => {
    if (!selectedMakeSlug) { setModels([]); return; }
    fetchVehicleModels(selectedMakeSlug).then(data => setModels(data.map((m: any) => ({ name: m.name, slug: m.slug }))));
  }, [selectedMakeSlug]);

  const handleReset = () => { setStep(0); setCategory(""); setSubcategory(null); setAiResult(null); setAiError(""); setSelectedMake(""); setSelectedMakeSlug(""); setSelectedModel(""); setSelectedYear(""); };

  const handleDiagnose = async () => {
    setAiLoading(true); setAiError("");
    const vehicleInfo = selectedMake ? ` Vehicle: ${[selectedMake, selectedModel, selectedYear].filter(Boolean).join(" ")}.` : "";
    const symptoms = `Category: ${catLabel}. Specific issue: ${subLabel}.${vehicleInfo}`;
    try {
      const res = await fetch("/api/diagnosis", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ symptoms }) });
      const data = await res.json();
      if (data.error) { setAiError(data.error); return; }
      setAiResult(data.diagnosis);
      setStep(3);
    } catch { setAiError("AI service unavailable. Please try again."); }
    finally { setAiLoading(false); }
  };

  const displayResult = aiResult;
  const sev = displayResult ? SEVERITY_CONFIG[displayResult.severity] : null;

  const YEAR = new Date().getFullYear();
  const YEARS = Array.from({ length: 30 }, (_, i) => String(YEAR - i));

  return (
    <div>
      {/* Step 1: Category */}
      {step === 0 && (
        <div>
          <h2 className="text-lg font-heading font-bold text-text-primary mb-2">What problem are you experiencing?</h2>
          <p className="text-sm text-text-muted mb-5">Select the category that best matches your issue</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CATEGORIES.map((cat) => {
              const Icn = ICON_MAP[cat.icon];
              return (
                <button key={cat.key} onClick={() => { setCategory(cat.key); setStep(1); }}
                  className="flex items-center gap-4 p-4 bg-surface-1 rounded-xl border border-surface-border hover:border-primary/30 hover:shadow-sm transition-all text-left group">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">{Icn ? createElement(Icn, { className: "w-5 h-5" }) : null}</div>
                  <div className="min-w-0"><div className="text-sm font-heading font-semibold text-text-primary group-hover:text-primary transition-colors">{cat.label}</div><div className="text-xs text-text-muted mt-0.5">{cat.desc}</div></div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 2: Subcategory */}
      {step === 1 && (
        <div>
          <button onClick={handleReset} className="text-xs text-text-muted hover:text-primary transition-colors font-heading mb-4 inline-flex items-center gap-1">← Back</button>
          <h2 className="text-lg font-heading font-bold text-text-primary mb-2">Can you be more specific?</h2>
          <p className="text-sm text-text-muted mb-5">What exactly is happening with your {catLabel.toLowerCase()}?</p>
          <div className="grid grid-cols-1 gap-2">
            {(SUBCATEGORIES[category] ?? []).map((sub) => {
              const Icn = ICON_MAP[sub.icon];
              return (
                <button key={sub.key} onClick={() => { setSubcategory(sub); setStep(2); }}
                  className="flex items-center gap-4 p-4 bg-surface-1 rounded-xl border border-surface-border hover:border-primary/30 hover:shadow-sm transition-all text-left group">
                  <div className="w-8 h-8 rounded-lg bg-primary/5 text-primary flex items-center justify-center shrink-0">{Icn ? createElement(Icn, { className: "w-4 h-4" }) : null}</div>
                  <div className="flex-1 min-w-0"><div className="text-sm font-heading font-semibold text-text-primary group-hover:text-primary transition-colors">{sub.label}</div><div className="text-xs text-text-muted mt-0.5">{sub.desc}</div></div>
                  <ChevronRight className="w-4 h-4 text-text-muted shrink-0" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 3: Vehicle Info + Diagnose */}
      {step === 2 && (
        <div>
          <button onClick={() => { setStep(1); setSubcategory(null); }} className="text-xs text-text-muted hover:text-primary transition-colors font-heading mb-4 inline-flex items-center gap-1">← Back</button>

          {/* Selection Summary */}
          <div className="bg-surface-1 rounded-2xl border border-surface-border p-5 mb-6">
            <h2 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-3">Your Symptoms</h2>
            <div className="flex items-center gap-2 mb-2">
              <div className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-heading font-semibold">{catLabel}</div>
              <ChevronRight className="w-4 h-4 text-text-muted" />
              <div className="px-3 py-1.5 bg-primary/5 text-primary rounded-lg text-sm font-heading font-semibold">{subLabel}</div>
            </div>
            <p className="text-xs text-text-muted">{subcategory?.desc}</p>
          </div>

          {/* Vehicle Info (optional) */}
          <div className="bg-surface-1 rounded-2xl border border-surface-border p-5 mb-6">
            <h2 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-1">Vehicle Info (Optional)</h2>
            <p className="text-xs text-text-muted mb-4">Adding your vehicle helps the AI give a more accurate diagnosis and cost estimate</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <select value={selectedMake} onChange={(e) => {
                const make = makes.find(m => m.name === e.target.value);
                setSelectedMake(e.target.value);
                setSelectedMakeSlug(make?.slug ?? "");
                setSelectedModel("");
              }} className="w-full px-4 py-2.5 bg-surface-0 border border-surface-border rounded-xl text-sm text-text-primary focus:border-primary/50 transition-all appearance-none font-heading">
                <option value="">Select make</option>
                {makes.map(m => <option key={m.slug} value={m.name}>{m.name}</option>)}
              </select>
              <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} disabled={!models.length}
                className="w-full px-4 py-2.5 bg-surface-0 border border-surface-border rounded-xl text-sm text-text-primary focus:border-primary/50 transition-all appearance-none font-heading disabled:opacity-50">
                <option value="">{selectedMake ? "Select model" : "Select make first"}</option>
                {models.map(m => <option key={m.slug} value={m.name}>{m.name}</option>)}
              </select>
              <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-4 py-2.5 bg-surface-0 border border-surface-border rounded-xl text-sm text-text-primary focus:border-primary/50 transition-all appearance-none font-heading">
                <option value="">Select year (optional)</option>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          <button onClick={handleDiagnose} disabled={aiLoading}
            className="w-full sm:w-auto px-8 py-3 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-glow transition-all duration-150 disabled:opacity-50 font-heading shadow-sm shadow-primary/20 flex items-center gap-2 justify-center">
            {aiLoading ? <><span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"/>Analyzing with AI...</> : <><Sparkles className="w-4 h-4"/>Diagnose with AI</>}
          </button>
          {aiError && <p className="text-xs text-red-400 mt-3">{aiError}</p>}
        </div>
      )}

      {/* Step 4: AI Result */}
      {step === 3 && displayResult && sev && (
        <div>
          <button onClick={handleReset} className="text-xs text-text-muted hover:text-primary transition-colors font-heading mb-6 inline-flex items-center gap-1">← Diagnose another issue</button>

          {/* Header */}
          <div className={`${sev.bg} rounded-2xl border ${sev.border} p-5 mb-6`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${sev.bg} border ${sev.border} flex items-center justify-center shrink-0`}><TriangleAlert className={`w-6 h-6 ${sev.text}`} /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2"><h2 className="text-xl font-heading font-bold text-text-primary">{displayResult.title}</h2><Sparkles className="w-4 h-4 text-primary shrink-0"/></div>
                <p className="text-sm text-text-secondary mt-1">{displayResult.summary}</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${sev.border} ${sev.text} font-heading mt-2`}>{sev.label}</span>
              </div>
            </div>
          </div>

          {/* Possible Causes */}
          {displayResult.causes?.length > 0 && (
            <div className="bg-surface-1 rounded-2xl border border-surface-border p-5 mb-4">
              <h3 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-3">Possible Causes</h3>
              <div className="space-y-3">
                {displayResult.causes.map((cause, i) => {
                  const badge = cause.likelihood === "most likely" ? "bg-red-50 text-red-700 border-red-200" : cause.likelihood === "possible" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-surface-0 text-text-muted border-surface-border";
                  return (
                    <div key={i} className="flex items-start gap-3 p-3 bg-surface-0 rounded-xl border border-surface-border">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 mt-0.5 ${badge} font-heading`}>{cause.likelihood}</span>
                      <p className="text-sm text-text-secondary leading-relaxed">{cause.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* What To Do */}
          {displayResult.whatToDo && (
            <div className="bg-surface-1 rounded-2xl border border-surface-border p-5 mb-4">
              <h3 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-2">What You Should Do</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{displayResult.whatToDo}</p>
            </div>
          )}

          {/* Cost + Codes row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {displayResult.costEstimate && (
              <div className="bg-surface-1 rounded-2xl border border-surface-border p-5">
                <h3 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-2">Estimated Repair Cost</h3>
                <p className="text-2xl font-heading font-bold text-text-primary">{displayResult.costEstimate}</p>
                <p className="text-xs text-text-muted mt-1">Typical shop price including parts and labor</p>
              </div>
            )}
            {displayResult.possibleCodes.length > 0 && (
              <div className="bg-surface-1 rounded-2xl border border-surface-border p-5">
                <h3 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-2">Related OBD-II Codes</h3>
                <div className="flex flex-wrap gap-2">
                  {displayResult.possibleCodes.map(code => (
                    <Link key={code} href={`/obd/${code.toLowerCase()}`} className="inline-flex items-center px-3 py-1.5 rounded-lg bg-surface-0 border border-surface-border text-sm font-mono font-bold text-primary hover:border-primary/30 hover:bg-primary/5 transition-colors">{code}</Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Repair Links */}
          {displayResult.repairKeywords.length > 0 && (
            <div className="bg-surface-1 rounded-2xl border border-surface-border p-5 mb-4">
              <h3 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-3">Related Repairs</h3>
              <div className="space-y-2">
                {displayResult.repairKeywords.map(item => {
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

          {/* Disclaimer */}
          <div className="bg-amber-50/30 dark:bg-amber-950/10 rounded-xl border border-amber-200 dark:border-amber-800 p-4 mb-6">
            <div className="flex items-start gap-3">
              <TriangleAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-heading font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-1">Disclaimer</p>
                <p className="text-xs text-text-secondary leading-relaxed">
                  This AI-generated diagnosis is for informational reference only and does not constitute professional mechanical advice. Results are based on symptom patterns and may not reflect your vehicle's actual condition. Always consult a qualified mechanic for an in-person inspection and definitive diagnosis. AutOwner is not responsible for decisions made based on this information.
                </p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
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
