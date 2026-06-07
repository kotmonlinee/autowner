"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TriangleAlert, Sparkles, CircleAlert, Gauge, SendHorizonal, ChevronRight } from "lucide-react";
import { fetchVehicleMakes, fetchVehicleModels } from "@/lib/data/browser";
import { STEP1, STEP2, type Step2Option, type Option } from "@/lib/diagnosis-tree";
import { resolveRepairSlug } from "@/lib/internal-linking";
import ShareButtons from "@/components/ShareButtons";

type Severity = "low" | "medium" | "high" | "critical";
const SEVERITY_CONFIG: Record<Severity, { bg: string; text: string; border: string; label: string }> = {
  critical: { bg: "bg-red-50 dark:bg-red-950/30", text: "text-red-700 dark:text-red-400", border: "border-red-200 dark:border-red-800", label: "Critical — Stop Driving" },
  high: { bg: "bg-orange-50 dark:bg-orange-950/30", text: "text-orange-700 dark:text-orange-400", border: "border-orange-200 dark:border-orange-800", label: "Serious — Inspect Soon" },
  medium: { bg: "bg-amber-50 dark:bg-amber-950/30", text: "text-amber-700 dark:text-amber-400", border: "border-amber-200 dark:border-amber-800", label: "Moderate — Schedule Repair" },
  low: { bg: "bg-emerald-50 dark:bg-emerald-950/30", text: "text-emerald-700 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-800", label: "Low Concern" },
};

interface AiResult {
  title: string; severity: Severity; summary: string;
  causes: { description: string; likelihood: string }[];
  whatToDo: string; costEstimate: string;
  possibleCodes: string[]; repairKeywords: string[];
}

const YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 30 }, (_, i) => String(YEAR - i));

export default function DiagnosisWizard() {
  const [step, setStep] = useState(0);
  const [s1, setS1] = useState<Option | null>(null);
  const [s2, setS2] = useState<Step2Option | null>(null);
  const [s3, setS3] = useState<Option | null>(null);

  const [makes, setMakes] = useState<{ name: string; slug: string }[]>([]);
  const [models, setModels] = useState<{ name: string; slug: string }[]>([]);
  const [makeName, setMakeName] = useState("");
  const [makeSlug, setMakeSlug] = useState("");
  const [modelName, setModelName] = useState("");
  const [year, setYear] = useState("");
  const [extraNotes, setExtraNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiResult | null>(null);
  const [resultSlug, setResultSlug] = useState("");
  const [error, setError] = useState("");

  useEffect(() => { fetchVehicleMakes().then(setMakes); }, []);
  useEffect(() => {
    if (!makeSlug) { setModels([]); return; }
    fetchVehicleModels(makeSlug).then(d => setModels(d.map((m: any) => ({ name: m.name, slug: m.slug }))));
  }, [makeSlug]);

  const reset = () => { setStep(0); setS1(null); setS2(null); setS3(null); setResult(null); setError(""); setExtraNotes(""); setResultSlug(""); };

  const handleDiagnose = async () => {
    if (!s1 || !s2 || !s3) return;
    setLoading(true); setError("");
    const v = makeName ? `${[makeName, modelName, year].filter(Boolean).join(" ")}` : "unknown vehicle";
    const extra = extraNotes.trim() ? ` Additional notes: ${extraNotes.trim()}.` : "";
    const q = `Vehicle: ${v}. Symptom: ${s1.label}. Location: ${s2.label}. When: ${s3.label}.${extra}`;
    try {
      const r = await fetch("/api/diagnosis", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ symptoms: q, make: makeName || undefined, model: modelName || undefined, year: year || undefined }) });
      const d = await r.json();
      if (d.error) { setError(d.error); return; }
      setResult(d.diagnosis); setResultSlug(d.slug || ""); setStep(4);
    } catch { setError("AI service unavailable. Please try again."); }
    finally { setLoading(false); }
  };

  const sev = result ? SEVERITY_CONFIG[result.severity] : null;

  const selectedPath = [s1, s2, s3].filter(Boolean);
  const StepIndicator = () => (
    <div className="flex items-center gap-2 mb-6 text-xs font-heading text-text-muted">
      <span className="text-primary font-bold">Step {step + 1}/4</span>
      <span className="text-text-muted">·</span>
      <span>{step === 0 ? "What" : step === 1 ? "Where" : step === 2 ? "When" : "Vehicle & Diagnosis"}</span>
    </div>
  );

  return (
    <div>
      {/* Step 1: Symptom type */}
      {step === 0 && (
        <div>
          <StepIndicator />
          <h2 className="text-xl font-heading font-bold text-text-primary mb-1">What do you notice?</h2>
          <p className="text-sm text-text-muted mb-5">Pick the symptom that best describes what's happening</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {STEP1.map((o, i) => {
              const emojis = ["🔊","👃","📳","⚡","💡","🔑","💧","🌡️","🛞","📋"];
              const accents = ["border-l-blue-500","border-l-purple-500","border-l-orange-500","border-l-amber-500","border-l-red-500","border-l-emerald-500","border-l-cyan-500","border-l-teal-500","border-l-rose-500","border-l-gray-500"];
              return (
                <button key={o.key} onClick={() => { setS1(o); setStep(1); }}
                  className={`flex items-center gap-4 p-5 bg-surface-1 rounded-xl border border-l-4 border-surface-border hover:shadow-md hover:-translate-y-0.5 transition-all text-left group ${accents[i] ?? "border-l-primary"} hover:bg-surface-2/50`}>
                  <span className="text-3xl shrink-0">{emojis[i]}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-heading font-bold text-text-primary group-hover:text-primary transition-colors">{o.label}</div>
                    <div className="text-xs text-text-muted mt-1">
                      {["Clicking, squealing, grinding, or rattling","Sweet, burning, fuel, or musty smells","Shaking steering wheel, body, or seats","Slow acceleration, hesitation, surging","Check engine, ABS, battery, oil light","Hard to start, won't crank, clicks","Oil, coolant, or water under the car","AC blows warm, weak airflow, smells","Brakes feel soft, steering is heavy","Anything else bothering you"][i]}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              );
            })}
          </div>
          <SelectedPath items={selectedPath} />
        </div>
      )}

      {/* Step 2: Location/Specific */}
      {step === 1 && s1 && (
        <div>
          <StepIndicator />
          <button onClick={() => { setStep(0); setS2(null); }} className="text-xs text-text-muted hover:text-primary transition-colors font-heading mb-3 inline-flex items-center gap-1">← Back</button>
          <h2 className="text-xl font-heading font-bold text-text-primary mb-1">Where is it coming from?</h2>
          <p className="text-sm text-text-muted mb-5">You selected: <strong className="text-text-primary">{s1.label}</strong></p>
          <div className="grid grid-cols-1 gap-2 mb-6">
            {(STEP2[s1.key] ?? []).map(o => (
              <button key={o.key} onClick={() => { setS2(o); setStep(2); }}
                className="flex items-center justify-between gap-3 p-4 bg-surface-1 rounded-xl border border-surface-border hover:border-primary/30 hover:shadow-sm transition-all text-left group">
                <span className="text-sm font-heading font-semibold text-text-primary group-hover:text-primary transition-colors">{o.label}</span>
                <ChevronRight className="w-4 h-4 text-text-muted shrink-0" />
              </button>
            ))}
          </div>
          <SelectedPath items={selectedPath} />
        </div>
      )}

      {/* Step 3: When */}
      {step === 2 && s1 && s2 && (
        <div>
          <StepIndicator />
          <button onClick={() => { setStep(1); setS3(null); }} className="text-xs text-text-muted hover:text-primary transition-colors font-heading mb-3 inline-flex items-center gap-1">← Back</button>
          <h2 className="text-xl font-heading font-bold text-text-primary mb-1">When does it happen?</h2>
          <p className="text-sm text-text-muted mb-5">{s1.label} · {s2.label}</p>
          <div className="grid grid-cols-1 gap-2 mb-6">
            {s2.step3s.map(o => (
              <button key={o.key} onClick={() => { setS3(o); setStep(3); }}
                className="flex items-center justify-between gap-3 p-4 bg-surface-1 rounded-xl border border-surface-border hover:border-primary/30 hover:shadow-sm transition-all text-left group">
                <span className="text-sm font-heading font-semibold text-text-primary group-hover:text-primary transition-colors">{o.label}</span>
                <ChevronRight className="w-4 h-4 text-text-muted shrink-0" />
              </button>
            ))}
          </div>
          <SelectedPath items={selectedPath} />
        </div>
      )}

      {/* Step 4: Vehicle + Diagnose */}
      {step === 3 && s1 && s2 && s3 && (
        <div>
          <StepIndicator />
          <button onClick={() => { setStep(2); }} className="text-xs text-text-muted hover:text-primary transition-colors font-heading mb-4 inline-flex items-center gap-1">← Back</button>

          <div className="bg-surface-1 rounded-2xl border border-surface-border p-5 mb-6">
            <h2 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-3">Your Symptoms</h2>
            <div className="flex flex-wrap items-center gap-1.5">
              {[s1, s2, s3].map((item, i) => (
                <span key={i} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight className="w-3 h-3 text-text-muted" />}
                  <span className={`px-3 py-1.5 rounded-lg text-sm font-heading font-semibold ${i === 0 ? "bg-primary/10 text-primary" : i === 1 ? "bg-primary/5 text-primary" : "bg-surface-0 border border-surface-border text-text-primary"}`}>{item!.label}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="bg-primary/5 border-2 border-primary/20 rounded-2xl p-5 mb-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider">Add Your Vehicle for Better Results</h2>
                <p className="text-xs text-text-secondary mt-1">Telling us what you drive makes the diagnosis <strong className="text-primary">significantly more accurate</strong> — the AI can factor in model-specific issues, recall history, and real repair costs for your exact car.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <select value={makeName} onChange={e => {
                const m = makes.find(x => x.name === e.target.value);
                setMakeName(e.target.value); setMakeSlug(m?.slug ?? ""); setModelName("");
              }} className="w-full px-4 py-2.5 bg-surface-0 border border-surface-border rounded-xl text-sm text-text-primary focus:border-primary/50 transition-all appearance-none font-heading">
                <option value="">Select make</option>
                {makes.map(m => <option key={m.slug} value={m.name}>{m.name}</option>)}
              </select>
              <select value={modelName} onChange={e => setModelName(e.target.value)} disabled={!models.length}
                className="w-full px-4 py-2.5 bg-surface-0 border border-surface-border rounded-xl text-sm text-text-primary focus:border-primary/50 transition-all appearance-none font-heading disabled:opacity-50">
                <option value="">{makeName ? "Select model" : "Select make first"}</option>
                {models.map(m => <option key={m.slug} value={m.name}>{m.name}</option>)}
              </select>
              <select value={year} onChange={e => setYear(e.target.value)}
                className="w-full px-4 py-2.5 bg-surface-0 border border-surface-border rounded-xl text-sm text-text-primary focus:border-primary/50 transition-all appearance-none font-heading">
                <option value="">Select year</option>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-xs font-heading font-bold text-text-primary uppercase tracking-wider mb-1.5">Anything else? (Optional)</label>
            <textarea value={extraNotes} onChange={e => setExtraNotes(e.target.value)}
              className="w-full px-4 py-3 bg-surface-0 border border-surface-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-all resize-none"
              rows={2}
              placeholder="e.g., The noise started after I had my brakes replaced last month, or It only happens when the engine is warm..."/>
          </div>

          <button onClick={handleDiagnose} disabled={loading}
            className="w-full sm:w-auto px-8 py-3 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-glow transition-all duration-150 disabled:opacity-50 font-heading shadow-sm shadow-primary/20 flex items-center gap-2 justify-center">
            {loading ? <><span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"/>Analyzing with AI...</> : <><Sparkles className="w-4 h-4"/>Diagnose with AI</>}
          </button>
          {error && <p className="text-xs text-red-400 mt-3">{error}</p>}
        </div>
      )}

      {/* Step 5: Result */}
      {step === 4 && result && sev && (
        <div>
          <button onClick={reset} className="text-xs text-text-muted hover:text-primary transition-colors font-heading mb-6 inline-flex items-center gap-1">← Diagnose another issue</button>

          <div className={`${sev.bg} rounded-2xl border ${sev.border} p-5 mb-6`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${sev.bg} border ${sev.border} flex items-center justify-center shrink-0`}><TriangleAlert className={`w-6 h-6 ${sev.text}`} /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2"><h2 className="text-xl font-heading font-bold text-text-primary">{result.title}</h2><Sparkles className="w-4 h-4 text-primary shrink-0"/></div>
                <p className="text-sm text-text-secondary mt-1">{result.summary}</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${sev.border} ${sev.text} font-heading mt-2`}>{sev.label}</span>
              </div>
            </div>
          </div>

          {result.causes?.length > 0 && (
            <div className="bg-surface-1 rounded-2xl border border-surface-border p-5 mb-4">
              <h3 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-3">Possible Causes</h3>
              <div className="space-y-3">
                {result.causes.map((c, i) => {
                  const badge = c.likelihood === "most likely" ? "bg-red-50 text-red-700 border-red-200" : c.likelihood === "possible" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-surface-0 text-text-muted border-surface-border";
                  return <div key={i} className="flex items-start gap-3 p-3 bg-surface-0 rounded-xl border border-surface-border"><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 mt-0.5 ${badge} font-heading`}>{c.likelihood}</span><p className="text-sm text-text-secondary leading-relaxed">{c.description}</p></div>;
                })}
              </div>
            </div>
          )}

          {result.whatToDo && (
            <div className="bg-surface-1 rounded-2xl border border-surface-border p-5 mb-4">
              <h3 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-2">What You Should Do</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{result.whatToDo}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {result.costEstimate && (
              <div className="bg-surface-1 rounded-2xl border border-surface-border p-5">
                <h3 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-2">Estimated Repair Cost</h3>
                <p className="text-2xl font-heading font-bold text-text-primary">{result.costEstimate}</p>
                <p className="text-xs text-text-muted mt-1">Typical shop price including parts and labor</p>
              </div>
            )}
            {result.possibleCodes.length > 0 && (
              <div className="bg-surface-1 rounded-2xl border border-surface-border p-5">
                <h3 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-2">Related OBD-II Codes</h3>
                <div className="flex flex-wrap gap-2">
                  {result.possibleCodes.map(c => <Link key={c} href={`/obd/${c.toLowerCase()}`} className="inline-flex items-center px-3 py-1.5 rounded-lg bg-surface-0 border border-surface-border text-sm font-mono font-bold text-primary hover:border-primary/30 hover:bg-primary/5 transition-colors">{c}</Link>)}
                </div>
              </div>
            )}
          </div>

          {result.repairKeywords.length > 0 && (
            <div className="bg-surface-1 rounded-2xl border border-surface-border p-5 mb-4">
              <h3 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-3">Related Repairs</h3>
              <div className="space-y-2">
                {result.repairKeywords.map(item => {
                  const slug = resolveRepairSlug(item);
                  if (!slug) return null;
                  return <Link key={item} href={`/repair-cost/${slug}`} className="flex items-center justify-between p-3 bg-surface-0 rounded-xl border border-surface-border hover:border-primary/30 hover:bg-primary/5 transition-colors group"><span className="text-sm font-medium text-text-primary font-heading group-hover:text-primary transition-colors">{item}</span><span className="text-xs text-text-muted font-heading">View estimate →</span></Link>;
                })}
              </div>
            </div>
          )}

          <div className="bg-amber-50/30 dark:bg-amber-950/10 rounded-xl border border-amber-200 dark:border-amber-800 p-4 mb-6">
            <div className="flex items-start gap-3">
              <TriangleAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-heading font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-1">Disclaimer</p>
                <p className="text-xs text-text-secondary leading-relaxed">This AI-generated diagnosis is for informational reference only. Always consult a qualified mechanic for an in-person inspection. AutOwner is not responsible for decisions made based on this information.</p>
              </div>
            </div>
          </div>

          {resultSlug && (
            <div className="mb-4 p-4 bg-surface-0 rounded-xl border border-surface-border">
              <h3 className="text-sm font-semibold text-text-primary mb-3 font-heading">Share this diagnosis</h3>
              <ShareButtons url={`https://www.autowner.com/symptom-checker/${resultSlug}`} title={result?.title ?? "AI Car Diagnosis"} />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link href="/repair-cost" className="flex flex-col items-center gap-2 p-4 bg-surface-1 rounded-xl border border-surface-border hover:border-primary/30 hover:shadow-sm transition-all group"><CircleAlert className="w-5 h-5 text-primary"/><span className="text-xs font-heading font-semibold text-text-primary group-hover:text-primary transition-colors">Browse Repair Costs</span></Link>
            <Link href="/recall-check" className="flex flex-col items-center gap-2 p-4 bg-surface-1 rounded-xl border border-surface-border hover:border-primary/30 hover:shadow-sm transition-all group"><TriangleAlert className="w-5 h-5 text-primary"/><span className="text-xs font-heading font-semibold text-text-primary group-hover:text-primary transition-colors">Check Safety Recalls</span></Link>
            <Link href="/quote-checker" className="flex flex-col items-center gap-2 p-4 bg-surface-1 rounded-xl border border-surface-border hover:border-primary/30 hover:shadow-sm transition-all group"><Gauge className="w-5 h-5 text-primary"/><span className="text-xs font-heading font-semibold text-text-primary group-hover:text-primary transition-colors">Verify a Mechanic Quote</span></Link>
          </div>

          {makeName && (
            <div className="mt-4 p-4 bg-surface-1 rounded-xl border border-surface-border">
              <h3 className="text-xs font-heading font-bold text-text-primary uppercase tracking-wider mb-2">More for Your {makeName} {modelName}</h3>
              <div className="flex flex-wrap gap-2">
                <Link href={`/vehicles/${makeSlug}/${modelName.toLowerCase().replace(/\s+/g, "-")}`} className="text-xs font-heading font-semibold text-primary hover:text-primary-glow transition-colors">All Repair Costs →</Link>
                <span className="text-text-muted">·</span>
                <Link href={`/recall-check?make=${encodeURIComponent(makeName)}&model=${encodeURIComponent(modelName)}&year=2020`} className="text-xs font-heading font-semibold text-primary hover:text-primary-glow transition-colors">Safety Recalls →</Link>
                <span className="text-text-muted">·</span>
                <Link href={`/quote-checker?make=${encodeURIComponent(makeName)}&model=${encodeURIComponent(modelName)}`} className="text-xs font-heading font-semibold text-primary hover:text-primary-glow transition-colors">Check a Quote →</Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SelectedPath({ items }: { items: (Option | null)[] }) {
  const filtered = items.filter(Boolean) as Option[];
  if (filtered.length === 0) return null;
  return (
    <div className="flex items-center gap-2 text-xs text-text-muted font-heading">
      <span>Selected:</span>
      {filtered.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <span className="text-text-muted">→</span>}
          <span className="text-text-secondary">{item.label}</span>
        </span>
      ))}
    </div>
  );
}
