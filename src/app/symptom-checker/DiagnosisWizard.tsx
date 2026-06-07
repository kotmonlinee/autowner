"use client";

import { useState } from "react";
import Link from "next/link";

interface Option { key: string; label: string; desc: string; icon?: string; }

interface Step0 { title: string; options: Option[]; }
interface Step1 { title: string; [category: string]: Option[] | string; }

interface DiagnosisResult {
  title: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  possibleCodes: { code: string; title: string }[];
  repairs: { name: string; slug: string; cost: string }[];
}

const DIAGNOSIS_DB: Record<string, DiagnosisResult> = {
  "brakes-squealing": { title: "Brake Squealing/Squeaking", severity: "medium", description: "Brake squealing is typically caused by worn brake pads, glazed rotors, or lack of lubrication on the backing plates. In most cases, this does not affect braking performance but should be inspected.", possibleCodes: [{ code: "C1221", title: "ABS Wheel Speed Sensor" }], repairs: [{ name: "Brake Pads Front", slug: "brake-pads-front", cost: "$200–500" }, { name: "Brake Rotors Front", slug: "rotor-front", cost: "$300–600" }, { name: "Brake Caliper", slug: "brake-caliper", cost: "$300–700" }] },
  "brakes-grinding": { title: "Brake Grinding Noise", severity: "high", description: "Grinding noise when braking usually means the brake pads are completely worn down and metal is contacting metal. Stop driving and have brakes inspected immediately.", possibleCodes: [{ code: "C1221", title: "ABS Wheel Speed Sensor" }], repairs: [{ name: "Brake Pads Front", slug: "brake-pads-front", cost: "$200–500" }, { name: "Brake Rotors Front", slug: "rotor-front", cost: "$300–600" }] },
  "engine-knocking": { title: "Engine Knocking/Pinging", severity: "high", description: "Engine knock or ping indicates improper fuel combustion. Can cause serious engine damage if ignored.", possibleCodes: [{ code: "P0325", title: "Knock Sensor 1 Circuit" }, { code: "P0300", title: "Random Misfire" }], repairs: [{ name: "Spark Plugs", slug: "spark-plugs", cost: "$150–350" }, { name: "Ignition Coil", slug: "ignition-coil", cost: "$200–500" }] },
  "engine-ticking": { title: "Engine Ticking Noise", severity: "medium", description: "Ticking noise can be caused by low oil levels, exhaust leaks, or valve train issues. Check oil level first.", possibleCodes: [{ code: "P0300", title: "Random Misfire" }], repairs: [{ name: "Oil Change Synthetic", slug: "oil-change-synthetic", cost: "$60–120" }] },
  "starting-click": { title: "Car Won't Start — Clicking Sound", severity: "high", description: "Rapid clicking when starting indicates a dead or weak battery, corroded terminals, or a failing starter motor.", possibleCodes: [{ code: "P0562", title: "System Voltage Low" }], repairs: [{ name: "Battery", slug: "battery", cost: "$150–350" }, { name: "Starter", slug: "starter", cost: "$300–600" }, { name: "Alternator", slug: "alternator", cost: "$400–800" }] },
  "starting-slow-crank": { title: "Engine Cranks Slowly", severity: "high", description: "Slow cranking is often a battery or starter issue. Check battery terminals and voltage.", possibleCodes: [{ code: "P0562", title: "System Voltage Low" }], repairs: [{ name: "Battery", slug: "battery", cost: "$150–350" }, { name: "Starter", slug: "starter", cost: "$300–600" }] },
  "ac-smell-musty": { title: "AC Smells Musty/Moldy", severity: "low", description: "Musty AC smell is caused by mold or mildew in the evaporator core or cabin filter.", possibleCodes: [], repairs: [{ name: "Cabin Air Filter", slug: "cabin-air-filter", cost: "$40–100" }] },
  "ac-smell-chemical": { title: "Chemical Smell from AC", severity: "medium", description: "Sweet/chemical smell from AC could indicate a refrigerant or heater core leak.", possibleCodes: [{ code: "P0530", title: "A/C Refrigerant Pressure Sensor" }], repairs: [{ name: "AC Compressor", slug: "ac-compressor", cost: "$500–1,200" }] },
  "power-sluggish": { title: "Loss of Power / Sluggish Acceleration", severity: "medium", description: "Sluggish acceleration can be caused by clogged filters, failing fuel pump, or transmission issues.", possibleCodes: [{ code: "P0171", title: "System Too Lean" }, { code: "P0420", title: "Catalyst Efficiency" }], repairs: [{ name: "Engine Air Filter", slug: "engine-air-filter", cost: "$30–80" }, { name: "Fuel Pump", slug: "fuel-pump", cost: "$400–900" }] },
  "power-stalling": { title: "Engine Stalling", severity: "high", description: "Engine stalling while driving is serious. Common causes: failing fuel pump, dirty idle air control valve, vacuum leaks.", possibleCodes: [{ code: "P0171", title: "System Too Lean" }, { code: "P0300", title: "Random Misfire" }], repairs: [{ name: "Fuel Pump", slug: "fuel-pump", cost: "$400–900" }, { name: "Mass Air Flow Sensor", slug: "mass-air-flow-sensor", cost: "$200–500" }] },
  "light-check-engine": { title: "Check Engine Light On", severity: "medium", description: "Can indicate anything from a loose gas cap to a serious engine problem. Use an OBD-II scanner or search our database.", possibleCodes: [{ code: "P0420", title: "Catalyst Efficiency" }, { code: "P0300", title: "Random Misfire" }, { code: "P0171", title: "System Too Lean" }], repairs: [{ name: "Spark Plugs", slug: "spark-plugs", cost: "$150–350" }, { name: "Oxygen Sensor", slug: "oxygen-sensor", cost: "$200–400" }] },
};

const STEP1 = { title: "What's happening?", options: [
  { key: "brakes", label: "Brake Issue", desc: "Noise, vibration, or weak braking", icon: "🛑" },
  { key: "engine", label: "Engine Issue", desc: "Noise, vibration, or performance", icon: "🔊" },
  { key: "starting", label: "Won't Start", desc: "Clicking, cranking, or no response", icon: "🔋" },
  { key: "ac", label: "AC / Climate", desc: "Smells, weak airflow, or no cooling", icon: "❄️" },
  { key: "power", label: "Power Loss", desc: "Sluggish, stalling, or hesitation", icon: "⚡" },
  { key: "light", label: "Warning Light", desc: "Dashboard light is on", icon: "⚠️" },
  { key: "suspension", label: "Suspension/Handling", desc: "Bumpy ride, pulling, or vibration", icon: "🔧" },
  { key: "leak", label: "Fluid Leak", desc: "Puddles or spots under car", icon: "💧" },
]};

const STEP2: Record<string, Option[]> = {
  brakes: [
    { key: "squealing", label: "Squealing/Squeaking", desc: "High-pitched noise when braking" },
    { key: "grinding", label: "Grinding", desc: "Metal-on-metal sound" },
  ],
  engine: [
    { key: "knocking", label: "Knocking/Pinging", desc: "Metallic knocking sound" },
    { key: "ticking", label: "Ticking", desc: "Rapid ticking noise from engine" },
  ],
  starting: [
    { key: "click", label: "Clicking Sound", desc: "Rapid clicking, won't crank" },
    { key: "slow-crank", label: "Slow Crank", desc: "Cranks slowly" },
  ],
  ac: [
    { key: "smell-musty", label: "Musty/Moldy Smell", desc: "Damp or mildew odor" },
    { key: "smell-chemical", label: "Chemical/Sweet Smell", desc: "Refrigerant or coolant odor" },
  ],
  power: [
    { key: "sluggish", label: "Sluggish Acceleration", desc: "Car feels slow to respond" },
    { key: "stalling", label: "Stalling", desc: "Engine shuts off while driving" },
  ],
  light: [
    { key: "check-engine", label: "Check Engine Light", desc: "Yellow engine symbol" },
  ],
  suspension: [
    { key: "bumpy", label: "Bumpy Ride", desc: "Feels every bump" },
    { key: "vibration", label: "Vibration", desc: "Steering wheel shakes" },
  ],
  leak: [
    { key: "oil", label: "Oil Leak", desc: "Brown/black fluid" },
    { key: "coolant", label: "Coolant Leak", desc: "Green/orange/pink fluid" },
  ],
};

export default function DiagnosisWizard() {
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [freeText, setFreeText] = useState("");

  const handleCategory = (key: string) => { setCategory(key); setStep(1); };
  const handleSubcategory = (key: string) => {
    setSubcategory(key);
    setResult(DIAGNOSIS_DB[`${category}-${key}`] ?? null);
    setStep(2);
  };
  const handleReset = () => { setStep(0); setCategory(""); setSubcategory(""); setResult(null); setFreeText(""); };

  const severityBadge = (s: string) => {
    const m: Record<string, string> = { critical: "bg-red-50 text-red-700 border-red-200", high: "bg-orange-50 text-orange-700 border-orange-200", medium: "bg-amber-50 text-amber-700 border-amber-200", low: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    return `inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold border ${m[s] ?? m.medium} font-heading`;
  };

  const catIcon = (key: string) => STEP1.options.find((o) => o.key === key)?.icon ?? "";

  return (
    <div>
      {step === 0 && (
        <div>
          <h2 className="text-lg font-heading font-bold text-text-primary mb-4">{STEP1.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {STEP1.options.map((opt) => (
              <button key={opt.key} onClick={() => handleCategory(opt.key)}
                className="flex flex-col items-start gap-2 p-4 bg-surface-1 rounded-xl border border-surface-border hover:border-primary/30 hover:bg-primary/5 transition-all text-left group">
                <span className="text-2xl">{opt.icon}</span>
                <div><div className="text-sm font-heading font-semibold text-text-primary group-hover:text-primary transition-colors">{opt.label}</div><div className="text-xs text-text-muted mt-0.5">{opt.desc}</div></div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <div>
          <button onClick={handleReset} className="text-xs text-text-muted hover:text-primary transition-colors font-heading mb-4 inline-flex items-center gap-1">← Back</button>
          <h2 className="text-lg font-heading font-bold text-text-primary mb-4">What specifically?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(STEP2[category] ?? []).map((opt) => (
              <button key={opt.key} onClick={() => handleSubcategory(opt.key)}
                className="flex flex-col items-start gap-1 p-4 bg-surface-1 rounded-xl border border-surface-border hover:border-primary/30 hover:bg-primary/5 transition-all text-left group">
                <div className="text-sm font-heading font-semibold text-text-primary group-hover:text-primary transition-colors">{opt.label}</div>
                <div className="text-xs text-text-muted">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <button onClick={handleReset} className="text-xs text-text-muted hover:text-primary transition-colors font-heading mb-6 inline-flex items-center gap-1">← Start over</button>

          {result ? (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">{catIcon(category)}</span>
                <div>
                  <h2 className="text-xl font-heading font-bold text-text-primary">{result.title}</h2>
                  <span className={severityBadge(result.severity)}>
                    {result.severity === "critical" ? "Critical" : result.severity === "high" ? "Serious" : result.severity === "medium" ? "Moderate" : "Low Concern"}
                  </span>
                </div>
              </div>

              <p className="text-sm text-text-secondary leading-relaxed mb-6">{result.description}</p>

              {result.possibleCodes.length > 0 && (
                <div className="bg-surface-1 rounded-2xl border border-surface-border p-5 mb-4">
                  <h3 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-3">Possible OBD-II Codes</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.possibleCodes.map((c) => (
                      <Link key={c.code} href={`/obd/${c.code.toLowerCase()}`} className="inline-flex items-center px-3 py-1.5 rounded-lg bg-surface-0 border border-surface-border text-xs font-mono font-bold text-primary hover:border-primary/30 hover:bg-primary/5 transition-colors" title={c.title}>{c.code}</Link>
                    ))}
                  </div>
                </div>
              )}

              {result.repairs.length > 0 && (
                <div className="bg-surface-1 rounded-2xl border border-surface-border p-5 mb-4">
                  <h3 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-3">Recommended Repairs</h3>
                  <div className="space-y-2">
                    {result.repairs.map((r) => (
                      <Link key={r.slug} href={`/repair-cost/${r.slug}`} className="flex items-center justify-between p-3 bg-surface-0 rounded-xl border border-surface-border hover:border-primary/30 hover:bg-primary/5 transition-colors group">
                        <span className="text-sm font-medium text-text-primary font-heading group-hover:text-primary transition-colors">{r.name}</span>
                        <span className="text-sm font-bold text-primary font-heading">{r.cost}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-surface-1 rounded-2xl border border-surface-border p-5">
                <h3 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-3">Next Steps</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Link href="/quote-checker" className="p-3 bg-surface-0 rounded-xl border border-surface-border hover:border-primary/30 transition-colors text-xs font-heading font-semibold text-text-primary text-center">Got a quote? Verify it →</Link>
                  <Link href="/recall-check" className="p-3 bg-surface-0 rounded-xl border border-surface-border hover:border-primary/30 transition-colors text-xs font-heading font-semibold text-text-primary text-center">Check for recalls →</Link>
                  <Link href="/repair-cost" className="p-3 bg-surface-0 rounded-xl border border-surface-border hover:border-primary/30 transition-colors text-xs font-heading font-semibold text-text-primary text-center">See all repair costs →</Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-surface-1 rounded-2xl border border-surface-border">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-heading font-bold text-text-primary mb-2">No exact diagnosis found</h3>
              <p className="text-sm text-text-muted max-w-md mx-auto">We're building our diagnosis database. Try describing your issue in more detail or ask the community.</p>
              <Link href="/community" className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-glow transition-colors font-heading">
                Ask the Community →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
