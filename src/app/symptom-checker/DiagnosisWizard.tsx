"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ChevronRight } from "lucide-react";
import { fetchVehicleMakes, fetchVehicleModels } from "@/lib/data/browser";
import { STEP1, STEP2, type Step2Option, type Option } from "@/lib/diagnosis-tree";

const YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 30 }, (_, i) => String(YEAR - i));

export default function DiagnosisWizard({ prefilledSymptom }: { prefilledSymptom?: string | null }) {
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
    if (!makeSlug) return;
    let cancelled = false;
    fetchVehicleModels(makeSlug)
      .then(data => {
        if (cancelled) return;
        setModels(data.map((model: { name: string; slug: string }) => ({ name: model.name, slug: model.slug })));
        setModelsLoading(false);
      })
      .catch(() => {
        if (!cancelled) setModelsLoading(false);
      });
    return () => { cancelled = true; };
  }, [makeSlug]);

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
    const symptomRef = prefilledSymptom ? ` Known symptom from lookup: ${prefilledSymptom}.` : "";
    const q = `Vehicle: ${v}. Symptom: ${s1.label}. Location: ${s2.label}. When: ${s3.label}.${symptomRef}${contextStr}`;
    try {
      const r = await fetch("/api/diagnosis", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ symptoms: q, make: makeName || undefined, model: modelName || undefined, year: year || undefined }) });
      const d = await r.json();
      if (d.error) { setError(d.error); return; }
      router.push(`/symptom-checker/${d.slug}`);
    } catch { setError("AI service unavailable. Please try again."); }
    finally { setLoading(false); }
  };

  const stepLabels = [
    s1?.label ?? "What you notice",
    s2?.label ?? "Where it happens",
    s3?.label ?? "When it happens",
    makeName || "Vehicle & context",
  ];

  return (
    <section className="relative overflow-hidden border-y border-surface-border bg-surface-1" aria-label="Guided symptom diagnosis">
      {loading && (
        <div className="absolute inset-0 z-50 flex min-h-[430px] items-start justify-center bg-surface-0/85 p-5 backdrop-blur-sm">
          <div className="mt-20 w-full max-w-md border border-surface-border border-l-4 border-l-primary bg-text-primary p-7 text-center text-surface-1">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center border border-primary/40 bg-primary/10">
              <Sparkles className="h-7 w-7 animate-pulse text-primary" />
            </div>
            <h3 className="font-display text-3xl font-semibold tracking-[-0.025em] text-white">Building the diagnostic path</h3>
            <p className="mt-3 text-sm leading-6 text-white/65">
              Reviewing your symptom path{makeName ? ` against ${makeName} ${modelName} data` : ""} for likely causes, checks, and repair ranges.
            </p>
            <div className="mt-5 flex justify-center gap-1.5" aria-hidden="true">
              {[0, 1, 2].map(i => (
                <span key={i} className="h-2 w-2 animate-bounce bg-primary" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="border-b border-white/10 bg-text-primary text-surface-1">
        <div className="flex items-end justify-between gap-5 border-b border-white/10 px-5 py-4 sm:px-7">
          <div>
            <p className="text-[9px] font-heading font-bold uppercase tracking-[0.16em] text-primary">Guided diagnosis</p>
            <p className="mt-1 font-display text-2xl font-semibold tracking-[-0.025em] text-white">
              {step === 3 ? "Add context, then run the diagnosis" : "Narrow the problem one answer at a time"}
            </p>
          </div>
          <p className="shrink-0 font-mono text-xs text-white/55" aria-live="polite">
            {String(step + 1).padStart(2, "0")} / 04
          </p>
        </div>

        <ol className="grid grid-cols-4" aria-label="Diagnosis progress">
          {WIZARD_STEPS.map((wizardStep, index) => {
            const isCurrent = step === index;
            const isComplete = step > index;
            return (
              <li
                key={wizardStep.label}
                aria-current={isCurrent ? "step" : undefined}
                className={`min-w-0 border-r border-white/10 px-2.5 py-3 last:border-r-0 sm:px-4 ${
                  isCurrent ? "bg-primary text-white" : isComplete ? "bg-white/5" : ""
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className={`font-mono text-[10px] font-bold ${isCurrent ? "text-white" : "text-primary"}`}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className={`text-[9px] font-heading font-bold uppercase tracking-[0.08em] ${
                    isCurrent ? "text-white/70" : isComplete ? "text-primary" : "text-white/35"
                  }`}>
                    {isComplete ? "Set" : isCurrent ? "Now" : "Next"}
                  </span>
                </div>
                <p className={`mt-2 text-[10px] font-heading font-bold uppercase tracking-[0.08em] sm:text-[11px] ${
                  isCurrent ? "text-white" : isComplete ? "text-white/85" : "text-white/45"
                }`}>
                  {wizardStep.label}
                </p>
                <p className={`mt-1 truncate text-[9px] sm:text-[10px] ${isCurrent ? "text-white/75" : "text-white/40"}`}>
                  {stepLabels[index]}
                </p>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="p-5 sm:p-7">
        {prefilledSymptom && step === 0 && (
          <div className="mb-6 flex items-start gap-3 border-l-4 border-primary bg-primary/5 p-4">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p className="text-sm leading-6 text-text-secondary">
              <span className="font-heading font-bold text-text-primary">Starting from your lookup:</span>{" "}
              {prefilledSymptom}
            </p>
          </div>
        )}

        {step === 0 && (
          <div>
            <QuestionHeading
              step={1}
              title="What do you notice?"
              intro="Choose the closest observation. The next screen will narrow where it happens and when it occurs."
            />
            <div className="grid border-l border-t border-surface-border sm:grid-cols-2">
              {STEP1.map((o, i) => (
                <button
                  key={o.key}
                  type="button"
                  onClick={() => { setS1(o); setStep(1); }}
                  className="group flex min-h-28 items-start gap-4 border-b border-r border-surface-border bg-surface-0 p-4 text-left transition-colors hover:bg-primary/5 sm:p-5"
                >
                  <span className="font-mono text-xs font-bold text-primary">{String(i + 1).padStart(2, "0")}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-heading text-base font-bold text-text-primary transition-colors group-hover:text-primary">{o.label}</span>
                    <span className="mt-1.5 block text-xs leading-5 text-text-muted">{STEP1_DESCRIPTIONS[i]}</span>
                  </span>
                  <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </button>
              ))}
            </div>
            <p className="mt-4 text-xs leading-5 text-text-muted">Not sure which one fits? Choose the closest match. Vehicle details can be added before the final diagnosis.</p>
          </div>
        )}

        {step === 1 && s1 && (
          <div className="mx-auto max-w-2xl">
            <BackButton label="Change symptom" onClick={() => { setStep(0); setS2(null); }} />
            <QuestionHeading
              step={2}
              title="Where is it coming from?"
              intro="Choose the area that best matches what you see, hear, smell, or feel."
              context={`Symptom: ${s1.label}`}
            />
            <div className="divide-y divide-surface-border border-y border-surface-border">
              {(STEP2[s1.key] ?? []).map((o, i) => (
                <ChoiceRow
                  key={o.key}
                  index={i}
                  label={o.label}
                  onClick={() => { setS2(o); setStep(2); }}
                />
              ))}
            </div>
          </div>
        )}

        {step === 2 && s1 && s2 && (
          <div className="mx-auto max-w-2xl">
            <BackButton label="Change location" onClick={() => { setStep(1); setS3(null); }} />
            <QuestionHeading
              step={3}
              title="When does it happen?"
              intro="The conditions help distinguish mechanical, electrical, temperature, and driving-related causes."
              context={`${s1.label} / ${s2.label}`}
            />
            <div className="divide-y divide-surface-border border-y border-surface-border">
              {s2.step3s.map((o, i) => (
                <ChoiceRow
                  key={o.key}
                  index={i}
                  label={o.label}
                  onClick={() => { setS3(o); setStep(3); }}
                />
              ))}
            </div>
          </div>
        )}

        {step === 3 && s1 && s2 && s3 && (
          <div>
            <BackButton label="Change conditions" onClick={() => setStep(2)} />
            <QuestionHeading
              step={4}
              title="Add vehicle and context"
              intro="These details are optional, but they let the diagnosis account for model-specific failures and conditions."
            />

            <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
              <div className="space-y-6">
                <div className="bg-text-primary p-5 text-surface-1">
                  <p className="text-[9px] font-heading font-bold uppercase tracking-[0.14em] text-primary">Your diagnostic path</p>
                  <ol className="mt-4 divide-y divide-white/10 border-y border-white/10">
                    {[s1, s2, s3].map((item, i) => (
                      <li key={i} className="grid grid-cols-[22px_1fr] gap-3 py-3">
                        <span className="font-mono text-[10px] font-bold text-primary">{String(i + 1).padStart(2, "0")}</span>
                        <span className="text-xs leading-5 text-white/85">{item.label}</span>
                      </li>
                    ))}
                  </ol>
                  <p className="mt-4 text-[10px] leading-4 text-white/45">Vehicle details below are not required to run the diagnosis.</p>
                </div>

                <div className="border-l-4 border-primary bg-primary/5 p-5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <h3 className="font-heading text-sm font-bold text-text-primary">Vehicle details</h3>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-text-secondary">Adding the exact make, model, and year improves model-specific guidance.</p>
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
                    <select value={makeName} onChange={e => {
                      const m = makes.find(x => x.name === e.target.value);
                      setMakeName(e.target.value);
                      setMakeSlug(m?.slug ?? "");
                      setModelName("");
                      setModels([]);
                      setModelsLoading(Boolean(m?.slug));
                    }} aria-label="Vehicle make" className="h-11 w-full appearance-none border border-surface-border bg-surface-0 px-3 font-heading text-sm text-text-primary focus:border-primary focus:outline-none">
                      <option value="">Select make</option>
                      {makes.map(m => <option key={m.slug} value={m.name}>{m.name}</option>)}
                    </select>
                    <select value={modelName} onChange={e => setModelName(e.target.value)} disabled={!models.length || modelsLoading} aria-label="Vehicle model" className="h-11 w-full appearance-none border border-surface-border bg-surface-0 px-3 font-heading text-sm text-text-primary focus:border-primary focus:outline-none disabled:opacity-50">
                      <option value="">{modelsLoading ? "Loading models..." : makeName ? "Select model" : "Select make first"}</option>
                      {models.map(m => <option key={m.slug} value={m.name}>{m.name}</option>)}
                    </select>
                    <select value={year} onChange={e => setYear(e.target.value)} aria-label="Vehicle year" className="h-11 w-full appearance-none border border-surface-border bg-surface-0 px-3 font-heading text-sm text-text-primary focus:border-primary focus:outline-none">
                      <option value="">Select year</option>
                      {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <ContextGroup
                  label="Check engine light"
                  options={[{ v: "off", l: "Off" }, { v: "on", l: "On" }, { v: "flashing", l: "Flashing" }]}
                  value={celStatus}
                  onChange={(value) => setCelStatus(celStatus === value ? "" : value)}
                />
                <ContextGroup
                  label="How long has this been happening?"
                  options={[{ v: "just_started", l: "Just started" }, { v: "days", l: "Days" }, { v: "weeks", l: "Weeks+" }]}
                  value={duration}
                  onChange={(value) => setDuration(duration === value ? "" : value)}
                />
                <ContextGroup
                  label="Recent repair work?"
                  options={[{ v: "none", l: "None" }, { v: "yes", l: "Yes" }]}
                  value={recentWork}
                  onChange={(value) => setRecentWork(recentWork === value ? "" : value)}
                />

                <div className="border-b border-surface-border py-4">
                  <label htmlFor="diagnosis-mileage" className="mb-2 block text-[10px] font-heading font-bold uppercase tracking-[0.12em] text-text-muted">Odometer reading</label>
                  <input id="diagnosis-mileage" type="number" value={mileage} onChange={e => setMileage(e.target.value)}
                    className="h-11 w-full border border-surface-border bg-surface-0 px-3 font-heading text-sm text-text-primary transition-colors placeholder:text-text-muted focus:border-primary focus:outline-none"
                    placeholder="e.g., 85000" inputMode="numeric" />
                </div>

                <div className="border-b border-surface-border py-4">
                  <label htmlFor="diagnosis-notes" className="mb-2 block text-[10px] font-heading font-bold uppercase tracking-[0.12em] text-text-muted">Anything else? Optional</label>
                  <textarea id="diagnosis-notes" value={extraNotes} onChange={e => setExtraNotes(e.target.value)}
                    className="w-full resize-none border border-surface-border bg-surface-0 px-3 py-3 font-heading text-sm leading-6 text-text-primary transition-colors placeholder:text-text-muted focus:border-primary focus:outline-none"
                    rows={3}
                    placeholder={recentWork === "yes" ? "Describe what was done recently, or add any other notes..." : "e.g., The noise started after the brakes were replaced, or only happens when the engine is warm."}/>
                </div>

                <div className="mt-5 flex flex-col gap-4 border-l-4 border-primary bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-heading text-sm font-bold text-text-primary">Ready to run the diagnosis</p>
                    <p className="mt-1 text-xs leading-5 text-text-muted">AI will return likely causes, checks, and repair guidance.</p>
                  </div>
                  <button type="button" onClick={handleDiagnose} disabled={loading}
                    className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 bg-primary px-6 py-3 font-heading text-sm font-bold text-white transition-colors hover:bg-primary-dark disabled:opacity-50">
                    <Sparkles className="h-4 w-4" />
                    {loading ? "Building diagnosis..." : "Run diagnosis"}
                  </button>
                </div>
                {error && <p role="alert" className="mt-3 border-l-4 border-severity-critical bg-severity-critical-bg p-3 text-sm text-severity-critical">{error}</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

const WIZARD_STEPS = [
  { label: "Symptom" },
  { label: "Location" },
  { label: "Conditions" },
  { label: "Vehicle" },
];

const STEP1_DESCRIPTIONS = [
  "Clicking, squealing, grinding, or rattling",
  "Sweet, burning, fuel, or musty smells",
  "White, blue, or black smoke from the exhaust",
  "Shaking steering wheel, body, or seats",
  "Hard to start, no crank, or repeated clicking",
  "Stalling, rough idle, or loss of power",
  "Check engine, ABS, battery, or oil light",
  "Overheating, high gauge, or no heater",
  "Oil, coolant, or water under the car",
  "Soft brakes, pulling, or heavy steering",
  "Battery dead, dim lights, or flickering",
  "Weak airflow, warm AC, or HVAC smell",
  "Slipping, jerky shifts, or delayed engagement",
];

function QuestionHeading({ step, title, intro, context }: { step: number; title: string; intro: string; context?: string }) {
  return (
    <header className="mb-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className="border border-primary/30 bg-primary/10 px-2.5 py-1 font-mono text-[10px] font-bold text-primary">
          Question {step} / 4
        </span>
        {context && <span className="text-[10px] font-heading font-bold uppercase tracking-[0.08em] text-text-muted">{context}</span>}
      </div>
      <h2 className="mt-4 font-display text-4xl font-semibold leading-none tracking-[-0.04em] text-text-primary sm:text-5xl">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary">{intro}</p>
    </header>
  );
}

function BackButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="mb-5 inline-flex min-h-11 items-center gap-2 border-b border-surface-border text-xs font-heading font-bold text-text-muted transition-colors hover:border-primary hover:text-primary">
      <span aria-hidden="true">←</span>
      {label}
    </button>
  );
}

function ChoiceRow({ index, label, onClick }: { index: number; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="group flex min-h-14 w-full items-center gap-4 bg-surface-1 py-3 text-left transition-colors hover:bg-primary/5">
      <span className="font-mono text-[10px] font-bold text-primary">{String(index + 1).padStart(2, "0")}</span>
      <span className="min-w-0 flex-1 font-heading text-sm font-bold text-text-primary transition-colors group-hover:text-primary">{label}</span>
      <ChevronRight className="h-4 w-4 shrink-0 text-text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
    </button>
  );
}

function ContextGroup({ label, options, value, onChange }: {
  label: string;
  options: { v: string; l: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="border-b border-surface-border py-4">
      <p className="mb-2 text-[10px] font-heading font-bold uppercase tracking-[0.12em] text-text-muted">{label}</p>
      <div className="grid grid-flow-col auto-cols-fr gap-px bg-surface-border">
        {options.map((option) => (
          <button
            key={option.v}
            type="button"
            onClick={() => onChange(option.v)}
            aria-pressed={value === option.v}
            className={`min-h-10 px-2 text-xs font-heading font-bold transition-colors ${
              value === option.v ? "bg-primary text-white" : "bg-surface-0 text-text-secondary hover:bg-primary/5 hover:text-primary"
            }`}
          >
            {option.l}
          </button>
        ))}
      </div>
    </div>
  );
}
