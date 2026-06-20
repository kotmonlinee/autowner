"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, ChevronRight } from "lucide-react";
import { fetchVehicleMakes, fetchVehicleModels } from "@/lib/data/browser";
import { STEP1, STEP2, type Step2Option, type Option } from "@/lib/diagnosis-tree";

const YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 30 }, (_, i) => String(YEAR - i));

export default function DiagnosisWizard() {
  const router = useRouter();
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
  const [celStatus, setCelStatus] = useState("");     // off | on | flashing
  const [duration, setDuration] = useState("");       // just_started | days | weeks
  const [mileage, setMileage] = useState("");
  const [recentWork, setRecentWork] = useState("");   // none | yes
  const [extraNotes, setExtraNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { fetchVehicleMakes().then(setMakes); }, []);
  useEffect(() => {
    if (!makeSlug) { setModels([]); return; }
    setModelsLoading(true);
    fetchVehicleModels(makeSlug).then(d => {
      setModels(d.map((m: any) => ({ name: m.name, slug: m.slug })));
      setModelsLoading(false);
    });
  }, [makeSlug]);

  const reset = () => { setStep(0); setS1(null); setS2(null); setS3(null); setError(""); setCelStatus(""); setDuration(""); setMileage(""); setRecentWork(""); setExtraNotes(""); };

  const handleDiagnose = async () => {
    if (!s1 || !s2 || !s3) return;
    setLoading(true); setError("");
    const v = makeName ? `${[makeName, modelName, year].filter(Boolean).join(" ")}` : "unknown vehicle";
    const context: string[] = [];
    if (celStatus) context.push(`Check engine light: ${celStatus}`);
    if (duration) context.push(`Problem duration: ${duration === "just_started" ? "just started" : duration}`);
    if (mileage) context.push(`Odometer: ${mileage} miles`);
    if (recentWork === "yes") context.push("Recent work: yes");
    if (extraNotes.trim()) context.push(`Additional notes: ${extraNotes.trim()}`);
    const contextStr = context.length > 0 ? ` Context: ${context.join(". ")}.` : "";
    const q = `Vehicle: ${v}. Symptom: ${s1.label}. Location: ${s2.label}. When: ${s3.label}.${contextStr}`;
    try {
      const r = await fetch("/api/diagnosis", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ symptoms: q, make: makeName || undefined, model: modelName || undefined, year: year || undefined }) });
      const d = await r.json();
      if (d.error) { setError(d.error); return; }
      router.push(`/symptom-checker/${d.slug}`);
    } catch { setError("AI service unavailable. Please try again."); }
    finally { setLoading(false); }
  };

  const selectedPath = [s1, s2, s3].filter(Boolean);
  const StepIndicator = () => (
    <div className="flex items-center gap-2 mb-6 text-xs font-heading text-text-muted">
      <span className="text-primary font-bold">Step {step + 1}/4</span>
      <span className="text-text-muted">·</span>
      <span>{step === 0 ? "What" : step === 1 ? "Where" : step === 2 ? "When" : "Vehicle & Diagnosis"}</span>
    </div>
  );

  return (
    <div className="relative">
      {/* Loading overlay — masks the entire wizard while AI is working */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-start justify-center pt-20">
          <div className="absolute inset-0 bg-surface-0/80 backdrop-blur-sm rounded-2xl" />
          <div className="relative bg-surface-1 border border-surface-border rounded-2xl p-8 shadow-2xl max-w-sm w-full mx-4 text-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-primary animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-heading font-bold text-text-primary mb-2">Analyzing your symptoms...</h3>
            <p className="text-sm text-text-muted mb-4">Our AI is reviewing your symptoms{makeName ? ` and ${makeName} ${modelName} repair data` : ""} to find the most likely cause. This usually takes 5–10 seconds.</p>
            <div className="flex gap-1.5 justify-center">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 1: Symptom type */}
      {step === 0 && (
        <div>
          <StepIndicator />
          <h2 className="text-xl font-heading font-bold text-text-primary mb-1">What do you notice?</h2>
          <p className="text-sm text-text-muted mb-5">Pick the symptom that best describes what's happening</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {STEP1.map((o, i) => {
              const emojis = ["🔊","👃","💨","📳","🔑","🐌","💡","🌡️","💧","🛞","🔋","❄️","⚙️"];
              const accents = ["border-l-blue-500","border-l-purple-500","border-l-gray-500","border-l-orange-500","border-l-emerald-500","border-l-amber-500","border-l-red-500","border-l-rose-500","border-l-cyan-500","border-l-pink-500","border-l-yellow-500","border-l-teal-500","border-l-indigo-500"];
              return (
                <button key={o.key} onClick={() => { setS1(o); setStep(1); }}
                  className={`flex items-center gap-4 p-5 bg-surface-1 rounded-xl border border-l-4 border-surface-border hover:shadow-md hover:-translate-y-0.5 transition-all text-left group ${accents[i] ?? "border-l-primary"} hover:bg-surface-2/50`}>
                  <span className="text-3xl shrink-0">{emojis[i]}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-heading font-bold text-text-primary group-hover:text-primary transition-colors">{o.label}</div>
                    <div className="text-xs text-text-muted mt-1">
                      {["Clicking, squealing, grinding, or rattling","Sweet, burning, fuel, or musty smells","White, blue, or black smoke from exhaust","Shaking steering wheel, body, or seats","Hard to start, won't crank, clicks","Stalling, rough idle, or power loss","Check engine, ABS, battery, or oil light","Overheating, gauge high, or heater cold","Oil, coolant, or water under the car","Brakes feel soft, steering is heavy","Battery dead, dim lights, flickering","AC blows warm, weak airflow, smells","Slipping, jerky shifts, or delayed engagement"][i]}
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
                  <span className={`px-3 py-2 rounded-lg text-sm font-heading font-semibold ${i === 0 ? "bg-primary/10 text-primary" : i === 1 ? "bg-primary/5 text-primary" : "bg-surface-0 border border-surface-border text-text-primary"}`}>{item!.label}</span>
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
              <select value={modelName} onChange={e => setModelName(e.target.value)} disabled={!models.length || modelsLoading}
                className="w-full px-4 py-2.5 bg-surface-0 border border-surface-border rounded-xl text-sm text-text-primary focus:border-primary/50 transition-all appearance-none font-heading disabled:opacity-50">
                <option value="">{modelsLoading ? "Loading models..." : makeName ? "Select model" : "Select make first"}</option>
                {models.map(m => <option key={m.slug} value={m.name}>{m.name}</option>)}
              </select>
              <select value={year} onChange={e => setYear(e.target.value)}
                className="w-full px-4 py-2.5 bg-surface-0 border border-surface-border rounded-xl text-sm text-text-primary focus:border-primary/50 transition-all appearance-none font-heading">
                <option value="">Select year</option>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-heading font-bold text-text-primary uppercase tracking-wider mb-1.5">Check Engine Light</label>
            <div className="flex gap-1.5">
              {[{ v: "off", l: "Off" }, { v: "on", l: "On" }, { v: "flashing", l: "Flashing" }].map(o => (
                <button key={o.v} type="button" onClick={() => setCelStatus(celStatus === o.v ? "" : o.v)}
                  className={`flex-1 px-3 py-2.5 rounded-xl text-xs font-heading font-semibold border transition-all ${celStatus === o.v ? "bg-primary text-white border-primary" : "bg-surface-0 border-surface-border text-text-muted hover:border-primary/30"}`}>{o.l}</button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-heading font-bold text-text-primary uppercase tracking-wider mb-1.5">How long has this been happening?</label>
            <div className="flex gap-1.5">
              {[{ v: "just_started", l: "Just started" }, { v: "days", l: "Days" }, { v: "weeks", l: "Weeks+" }].map(o => (
                <button key={o.v} type="button" onClick={() => setDuration(duration === o.v ? "" : o.v)}
                  className={`flex-1 px-3 py-2.5 rounded-xl text-xs font-heading font-semibold border transition-all ${duration === o.v ? "bg-primary text-white border-primary" : "bg-surface-0 border-surface-border text-text-muted hover:border-primary/30"}`}>{o.l}</button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-heading font-bold text-text-primary uppercase tracking-wider mb-1.5">Odometer reading</label>
            <input type="number" value={mileage} onChange={e => setMileage(e.target.value)}
              className="w-full px-4 py-2.5 bg-surface-0 border border-surface-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-all font-heading"
              placeholder="e.g., 85,000 miles" inputMode="numeric" />
          </div>
          <div className="mb-4">
            <label className="block text-xs font-heading font-bold text-text-primary uppercase tracking-wider mb-1.5">Recent repair work?</label>
            <div className="flex gap-1.5">
              {[{ v: "none", l: "None" }, { v: "yes", l: "Yes" }].map(o => (
                <button key={o.v} type="button" onClick={() => setRecentWork(recentWork === o.v ? "" : o.v)}
                  className={`flex-1 px-3 py-2.5 rounded-xl text-xs font-heading font-semibold border transition-all ${recentWork === o.v ? "bg-primary text-white border-primary" : "bg-surface-0 border-surface-border text-text-muted hover:border-primary/30"}`}>{o.l}</button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-xs font-heading font-bold text-text-primary uppercase tracking-wider mb-1.5">Anything else? (Optional)</label>
            <textarea value={extraNotes} onChange={e => setExtraNotes(e.target.value)}
              className="w-full px-4 py-3 bg-surface-0 border border-surface-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-all resize-none"
              rows={2}
              placeholder={recentWork === "yes" ? "Describe what was done recently, or add any other notes..." : "e.g., The noise started after I had my brakes replaced last month, or It only happens when the engine is warm..."}/>
          </div>

          <button onClick={handleDiagnose} disabled={loading}
            className="w-full sm:w-auto px-8 py-3 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-glow transition-all duration-150 disabled:opacity-50 font-heading shadow-sm shadow-primary/20 flex items-center gap-2 justify-center">
            {loading ? <><span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"/>Analyzing with AI...</> : <><Sparkles className="w-4 h-4"/>Diagnose with AI</>}
          </button>
          {error && <p className="text-xs text-red-400 mt-3">{error}</p>}
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
