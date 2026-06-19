"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchVehicleMakes, fetchVehicleModels, fetchVehicleGenerations } from "@/lib/data/browser";

interface AssessmentResult {
  assessment: "Fair" | "Slightly High" | "Overpriced" | "Below Average" | "Insufficient Data";
  quoteAmount: number;
  minCost: number | null;
  maxCost: number | null;
  avgCost: number | null;
  tier: string;
  disclaimer: string;
  relatedObdCodes?: { code: string; title: string; severity: number }[];
}

interface RepairSuggestion {
  display: string;
  raw: string;
}

const FALLBACK_REPAIRS = [
  "ABS Module Replacement",
  "ABS Module/HCU Replacement",
  "ABS Sensor Replacement",
  "AC Compressor Replacement",
  "Airbag / SRS Replacement",
  "Alternator Replacement",
  "Ball Joints Replacement",
  "Battery Replacement",
  "Battery Terminal & Ground Connection Service",
  "Blend Door Actuator Replacement",
  "Blower Motor Replacement",
  "Body Control Module (BCM) Replacement",
  "Brake Caliper Replacement",
  "Brake Fluid Flush",
  "Brake Hose Replacement",
  "Brake Line Replacement",
  "Brake Pads Replacement - Front",
  "Brake Pads Replacement - Rear",
  "Cabin Air Filter Replacement",
  "Camshaft Position Sensor Replacement",
  "Catalytic Converter Replacement",
  "Clutch Replacement",
  "Control Arms Replacement",
  "Coolant Flush",
  "Cooling Fan Replacement",
  "Crankshaft Position Sensor Replacement",
  "CV Axle Replacement",
  "Differential Fluid Change",
  "Door Lock Actuator Replacement",
  "Drive Belt Replacement",
  "Driveshaft Replacement",
  "ECM/PCM Replacement & Programming",
  "ECM/PCM Software Update / Reprogramming",
  "EGR Valve Replacement",
  "Engine Air Filter Replacement",
  "Engine Mount Replacement",
  "EVAP System Diagnosis & Repair",
  "Evaporator Core Replacement",
  "Fuel Filter Replacement",
  "Fuel Injector Replacement",
  "Fuel Pump Replacement",
  "Fuse or Relay Replacement",
  "Gas Cap Replacement",
  "Head Gasket Replacement",
  "Heat Shield Repair",
  "Heater Core Replacement",
  "Heater Hose Replacement",
  "Idle Air Control Valve Replacement",
  "Ignition Coil Replacement",
  "Ignition Switch Replacement",
  "Intake Manifold Gasket Replacement",
  "Lifter Replacement",
  "Mass Air Flow Sensor Replacement",
  "Master Cylinder Replacement",
  "Muffler Replacement",
  "Neutral Safety Switch Replacement",
  "Oil Change - Full Synthetic",
  "Oil Pan Gasket Replacement",
  "Oil Pressure Sensor Replacement",
  "Oil Pump Replacement",
  "Oxygen Sensor Replacement",
  "PCV Valve Replacement",
  "Piston Ring Replacement",
  "Power Steering Fluid Flush",
  "Power Steering Hose Replacement",
  "Power Steering Pump Replacement",
  "Radiator Replacement",
  "Rear Main Seal Replacement",
  "Rod Bearing Replacement",
  "Rotor Replacement - Front",
  "Rotor Replacement - Rear",
  "Sensor Replacement (Generic)",
  "Serpentine Belt Replacement",
  "Shocks Replacement - Rear",
  "Smoke Test & Vacuum Leak Diagnosis",
  "Spark Plugs Replacement",
  "Starter Replacement",
  "Steering Angle Sensor Replacement",
  "Steering Rack Replacement",
  "Struts Replacement - Front",
  "Sway Bar Link Replacement",
  "Thermostat Replacement",
  "Throttle Body Cleaning / Replacement",
  "Throttle Body Replacement",
  "Throttle Position Sensor Replacement",
  "Tie Rod Ends Replacement",
  "Timing Belt Replacement",
  "Tire Balance",
  "Tire Replacement",
  "Transfer Case Fluid Change",
  "Transmission Fluid Change",
  "Transmission Fluid Flush & Refill",
  "Transmission Mount Replacement",
  "Transmission Pan Gasket Replacement",
  "Transmission Seal Replacement",
  "Turbocharger Replacement",
  "Vacuum Leak Diagnosis & Repair",
  "Valve Adjustment",
  "Valve Cover Gasket Replacement",
  "Valve Seal Replacement",
  "Water Pump Replacement",
  "Wheel Alignment",
  "Wheel Bearing Replacement",
  "Wheel Speed Sensor Replacement",
  "Window Regulator Replacement",
  "Windshield Replacement",
  "Wiring Harness / Connector Repair",
];

const ASSESSMENT_COLORS: Record<AssessmentResult["assessment"], { bg: string; text: string; border: string; label: string }> = {
  Fair: {
    bg: "bg-severity-info-bg",
    text: "text-severity-info",
    border: "border-severity-info-border",
    label: "Fair Price",
  },
  "Slightly High": {
    bg: "bg-severity-caution-bg",
    text: "text-severity-caution",
    border: "border-severity-caution-border",
    label: "Slightly High",
  },
  Overpriced: {
    bg: "bg-severity-critical-bg",
    text: "text-severity-critical",
    border: "border-severity-critical-border",
    label: "Overpriced",
  },
  "Below Average": {
    bg: "bg-blue-50 dark:bg-blue-950/20",
    text: "text-blue-700 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
    label: "Below Average",
  },
  "Insufficient Data": {
    bg: "bg-slate-50 dark:bg-slate-950/20",
    text: "text-slate-700 dark:text-slate-400",
    border: "border-slate-200 dark:border-slate-800",
    label: "Insufficient Data",
  },
};

const ASSESSMENT_DOT: Record<AssessmentResult["assessment"], string> = {
  Fair: "bg-emerald-500",
  "Slightly High": "bg-amber-500",
  Overpriced: "bg-red-500",
  "Below Average": "bg-blue-500",
  "Insufficient Data": "bg-slate-400",
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function buildShareText(
  result: AssessmentResult | null,
  repairType: string,
  make: string,
  model: string,
  year: string,
): string {
  const vehicleInfo = make ? ` for ${make} ${model} ${year}` : "";

  if (result) {
    const quoteStr = formatCurrency(result.quoteAmount);
    const rangeStr =
      result.minCost != null && result.maxCost != null
        ? `${formatCurrency(result.minCost)}-${formatCurrency(result.maxCost)}`
        : "typical range";

    let assessmentText = "";
    switch (result.assessment) {
      case "Fair":
        assessmentText = "is fair";
        break;
      case "Slightly High":
        assessmentText = "is slightly high";
        break;
      case "Overpriced":
        assessmentText = "is overpriced";
        break;
      case "Below Average":
        assessmentText = "is below average";
        break;
      case "Insufficient Data":
        assessmentText = "was checked";
        break;
    }

    return `AutOwner says my ${quoteStr} ${repairType.toLowerCase()} quote${vehicleInfo} ${assessmentText}. Typical range: ${rangeStr}.`;
  }

  return `I just checked my ${repairType} quote${vehicleInfo} on AutOwner. See if your mechanic is charging you fairly.`;
}

// ── Inner component (uses useSearchParams — must be inside Suspense) ──

function QuoteCheckerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Parse initial values from URL search params
  const initialRepair = searchParams.get("repair") ?? "";
  const initialMake = searchParams.get("make") ?? "";
  const initialModel = searchParams.get("model") ?? "";
  const initialYear = searchParams.get("year") ?? "";
  const initialQuote = searchParams.get("quote") ?? "";
  const initialState = searchParams.get("state") ?? "";

  const [make, setMake] = useState(initialMake);
  const [model, setModel] = useState(initialModel);
  const [year, setYear] = useState(initialYear);
  const [repairType, setRepairType] = useState(initialRepair);
  const [quoteAmount, setQuoteAmount] = useState(initialQuote);
  const [state, setState] = useState(initialState);
  const [makes, setMakes] = useState<{ name: string; slug: string }[]>([]);
  const [selectedMakeSlug, setSelectedMakeSlug] = useState("");
  const [availableModels, setAvailableModels] = useState<{ name: string; slug: string }[]>([]);
  const [selectedModelSlug, setSelectedModelSlug] = useState("");
  const [generationYears, setGenerationYears] = useState<{ start: number; end: number | null }[]>([]);
  const [showRepairDropdown, setShowRepairDropdown] = useState(false);
  const [repairSuggestions, setRepairSuggestions] = useState<RepairSuggestion[]>([]);
  const [repairLoading, setRepairLoading] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [formHighlight, setFormHighlight] = useState(false);

  const repairInputRef = useRef<HTMLInputElement>(null);
  const repairDropdownRef = useRef<HTMLDivElement>(null);
  const autoSubmittedRef = useRef(false);

  // Load vehicle makes for dropdown
  useEffect(() => {
    fetchVehicleMakes().then((data) => {
      setMakes(data);
      // If URL had make param, find matching slug and set it
      if (initialMake) {
        const match = data.find((m) => m.name.toLowerCase() === initialMake.toLowerCase());
        if (match) setSelectedMakeSlug(match.slug);
      }
    });
  }, [initialMake]);

  // Cascade: when make changes, load models from our DB
  useEffect(() => {
    if (!selectedMakeSlug) {
      setAvailableModels([]);
      return;
    }
    fetchVehicleModels(selectedMakeSlug).then((data) => {
      const models = data.map((m) => ({ name: m.name, slug: m.slug }));
      setAvailableModels(models);
      // If URL had model param, find matching slug
      if (initialModel) {
        const match = models.find((m) => m.name.toLowerCase() === initialModel.toLowerCase());
        if (match) setSelectedModelSlug(match.slug);
      }
    });
  }, [selectedMakeSlug]);


  // Sync URL params to state when navigating with share links
  useEffect(() => {
    setMake(initialMake);
    setModel(initialModel);
    setYear(initialYear);
    setRepairType(initialRepair);
    setQuoteAmount(initialQuote);
    setState(initialState);
  }, [initialMake, initialModel, initialYear, initialRepair, initialQuote, initialState]);

  // Cascade: when model changes, load generations for year range
  useEffect(() => {
    if (!selectedMakeSlug || !selectedModelSlug) {
      setGenerationYears([]);
      return;
    }
    fetchVehicleGenerations(selectedModelSlug, selectedMakeSlug).then((data) => {
      setGenerationYears(
        data.map((g) => ({ start: g.year_start, end: g.year_end })),
      );
    });
  }, [selectedModelSlug, selectedMakeSlug]);

  // Close repair dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        repairDropdownRef.current &&
        !repairDropdownRef.current.contains(e.target as Node) &&
        repairInputRef.current &&
        !repairInputRef.current.contains(e.target as Node)
      ) {
        setShowRepairDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Debounced fetch for repair type suggestions from the database
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 2) {
      setRepairSuggestions([]);
      setRepairLoading(false);
      return;
    }
    setRepairLoading(true);
    try {
      const res = await fetch(`/api/repair-suggestions?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setRepairSuggestions((data.suggestions as RepairSuggestion[]) ?? []);
        if (data.suggestions?.length > 0) {
          setShowRepairDropdown(true);
        }
      }
    } catch {
      // Silently fail — fallback to static list
    } finally {
      setRepairLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    if (repairType.length >= 3) {
      debounceRef.current = setTimeout(() => {
        fetchSuggestions(repairType);
      }, 250);
    } else {
      setRepairSuggestions([]);
    }
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [repairType, fetchSuggestions]);

  // Compute dropdown items: API results when available, fallback to static list
  const dropdownItems: string[] = (() => {
    if (repairSuggestions.length > 0) {
      return repairSuggestions.map((s) => s.display);
    }
    if (repairType.length > 0) {
      return FALLBACK_REPAIRS.filter((r) =>
        r.toLowerCase().includes(repairType.toLowerCase())
      );
    }
    return FALLBACK_REPAIRS;
  })();

  // ── Core: perform the quote check (shared by manual + auto submit) ──

  async function performCheck(
    m: string,
    mod: string,
    y: string,
    repair: string,
    quote: number,
    st: string,
  ) {
    setError("");
    setResult(null);
    setLoading(true);

    const yearNum = parseInt(y, 10);

    try {
      const res = await fetch("/api/quote-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repairType: repair,
          make: m,
          model: mod,
          year: yearNum,
          quoteAmount: quote,
          state: st || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to check quote");
      }

      const data: AssessmentResult = await res.json();
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ── Auto-submit when URL has all required params ──

  useEffect(() => {
    if (autoSubmittedRef.current) return;

    const hasAllParams =
      initialRepair && initialMake && initialModel && initialYear && initialQuote;
    if (!hasAllParams) return;

    const quote = parseFloat(initialQuote);
    if (isNaN(quote) || quote <= 0) return;

    const yearNum = parseInt(initialYear, 10);
    if (isNaN(yearNum) || yearNum < 1900 || yearNum > new Date().getFullYear() + 2) return;

    autoSubmittedRef.current = true;
    performCheck(initialMake, initialModel, initialYear, initialRepair, quote, initialState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Manual submit ──

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);

    const quote = parseFloat(quoteAmount);
    if (!make || !model || !year || !repairType || isNaN(quote) || quote <= 0) {
      setError("Please fill in all required fields with valid values.");
      return;
    }

    const yearNum = parseInt(year, 10);
    if (isNaN(yearNum) || yearNum < 1900 || yearNum > new Date().getFullYear() + 2) {
      setError("Please enter a valid year.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/quote-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repairType,
          make,
          model,
          year: yearNum,
          quoteAmount: quote,
          state: state || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to check quote");
      }

      const data: AssessmentResult = await res.json();
      setResult(data);

      // Update URL with current form params so user can share
      updateUrlParams();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ── URL management ──

  function updateUrlParams() {
    const params = new URLSearchParams();
    if (repairType) params.set("repair", repairType);
    if (make) params.set("make", make);
    if (model) params.set("model", model);
    if (year) params.set("year", year);
    if (quoteAmount) params.set("quote", quoteAmount);
    if (state) params.set("state", state);

    const newUrl = `${pathname}?${params.toString()}`;
    router.replace(newUrl, { scroll: false });
  }

  function getShareableUrl(): string {
    const params = new URLSearchParams();
    if (repairType) params.set("repair", repairType);
    if (make) params.set("make", make);
    if (model) params.set("model", model);
    if (year) params.set("year", year);
    if (quoteAmount) params.set("quote", quoteAmount);
    if (state) params.set("state", state);
    return `https://www.autowner.com${pathname}?${params.toString()}`;
  }

  // ── Copy link ──

  async function handleCopyLink() {
    const url = getShareableUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  // ── Social share URLs ──

  const shareText = buildShareText(result, repairType, make, model, year);
  const encodedShareText = encodeURIComponent(shareText);
  const encodedShareUrl = encodeURIComponent(getShareableUrl());
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodedShareText}&url=${encodedShareUrl}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}&quote=${encodedShareText}`;

  const assessmentStyle = result ? ASSESSMENT_COLORS[result.assessment] : null;

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <Navbar />

      <main id="main-content" className="max-w-4xl mx-auto px-5 py-6 w-full flex-1">
        <nav className="mb-4 flex items-center gap-2 text-sm text-text-muted font-heading" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <svg className="w-3 h-3 text-surface-border" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span className="text-text-secondary">Quote Checker</span>
        </nav>
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary font-heading mb-3">
            Quote Checker
          </h1>
          <p className="text-text-muted text-sm sm:text-base leading-relaxed">
            Enter a mechanic&apos;s quote and compare it against typical repair costs
            for your vehicle. No login required.
          </p>
        </div>

        {/* How It Works */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          {[
            { step: "1", title: "Enter vehicle", desc: "Select your make, model, and year.", target: "field-make" },
            { step: "2", title: "Add repair & price", desc: "Choose the repair type and the quote amount.", target: "field-repair" },
            { step: "3", title: "Get assessment", desc: "See if your quote is fair, high, or a ripoff.", target: "field-quote" },
          ].map((s) => (
            <button key={s.step} type="button"
              onClick={() => {
                const el = document.getElementById(s.target);
                el?.scrollIntoView({ behavior: "smooth", block: "center" });
                el?.focus();
              }}
              className="flex gap-3 p-4 bg-surface-1 rounded-xl border border-surface-border hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer text-left w-full">
              <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-bold font-heading shrink-0">{s.step}</span>
              <div>
                <h3 className="text-sm font-heading font-semibold text-text-primary">{s.title}</h3>
                <p className="text-xs text-text-muted mt-0.5">{s.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Form */}
        <form
          id="quote-form"
          onSubmit={handleSubmit}
          className={`bg-surface-1 border rounded-2xl p-6 sm:p-8 space-y-5 transition-shadow duration-700 ${formHighlight ? "border-primary shadow-lg shadow-primary/20" : "border-surface-border"}`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Make — dropdown from vehicle database */}
            <div>
              <label
                htmlFor="field-make"
                className="block text-sm font-semibold text-text-primary mb-1.5 font-heading"
              >
                Vehicle Make <span className="text-red-500">*</span>
              </label>
              <select
                id="field-make"
                value={selectedMakeSlug}
                onChange={(e) => {
                  const slug = e.target.value;
                  setSelectedMakeSlug(slug);
                  const m = makes.find((x) => x.slug === slug);
                  setMake(m?.name ?? "");
                  setSelectedModelSlug("");
                  setModel("");
                }}
                className="w-full h-12 px-4 bg-surface-0 border border-surface-border rounded-xl text-text-primary text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none font-heading"
              >
                <option value="">Select make</option>
                {makes.map((m) => (
                  <option key={m.slug} value={m.slug}>{m.name}</option>
                ))}
              </select>
            </div>

            {/* Model — cascading dropdown */}
            <div>
              <label
                htmlFor="model"
                className="block text-sm font-semibold text-text-primary mb-1.5 font-heading"
              >
                Vehicle Model <span className="text-red-500">*</span>
              </label>
              <select
                id="model"
                value={selectedModelSlug}
                onChange={(e) => {
                  const slug = e.target.value;
                  setSelectedModelSlug(slug);
                  const m = availableModels.find((x) => x.slug === slug);
                  setModel(m?.name ?? "");
                }}
                disabled={!selectedMakeSlug}
                className="w-full h-12 px-4 bg-surface-0 border border-surface-border rounded-xl text-text-primary text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none font-heading disabled:opacity-50"
              >
                <option value="">{selectedMakeSlug ? "Select model" : "Select make first"}</option>
                {availableModels.map((m) => (
                  <option key={m.slug} value={m.slug}>{m.name}</option>
                ))}
              </select>
              {generationYears.length > 0 && (
                <p className="text-xs text-text-muted mt-1 font-heading">
                  {generationYears.map((g) => g.end ? `${g.start}–${g.end}` : `${g.start}+`).join(", ")}
                </p>
              )}
            </div>

            {/* Year */}
            <div>
              <label
                htmlFor="year"
                className="block text-sm font-semibold text-text-primary mb-1.5 font-heading"
              >
                Year <span className="text-red-500">*</span>
              </label>
              <input
                id="year"
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="e.g. 2020"
                min={1900}
                max={new Date().getFullYear() + 2}
                className="w-full h-12 px-4 bg-surface-0 border border-surface-border rounded-xl text-text-primary placeholder:text-text-muted text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            {/* State (optional) */}
            <div>
              <label
                htmlFor="state"
                className="block text-sm font-semibold text-text-primary mb-1.5 font-heading"
              >
                State <span className="text-text-muted font-normal">(optional)</span>
              </label>
              <input
                id="state"
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="e.g. CA, TX, NY"
                maxLength={2}
                className="w-full h-12 px-4 bg-surface-0 border border-surface-border rounded-xl text-text-primary placeholder:text-text-muted text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          {/* Repair type — with suggestions */}
          <div className="relative">
            <label
              htmlFor="field-repair"
              className="block text-sm font-semibold text-text-primary mb-1.5 font-heading"
            >
              Repair Type <span className="text-red-500">*</span>
            </label>
            <input
              ref={repairInputRef}
              id="field-repair"
              type="text"
              value={repairType}
              onChange={(e) => {
                setRepairType(e.target.value);
                setShowRepairDropdown(true);
              }}
              onFocus={() => setShowRepairDropdown(true)}
              placeholder="e.g. Brake pad replacement"
              className="w-full h-12 px-4 bg-surface-0 border border-surface-border rounded-xl text-text-primary placeholder:text-text-muted text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              autoComplete="off"
            />
            {showRepairDropdown && (
              <div
                ref={repairDropdownRef}
                className="absolute z-20 left-0 right-0 mt-1 bg-surface-0 border border-surface-border rounded-xl shadow-lg overflow-hidden max-h-64 overflow-y-auto"
              >
                {repairLoading ? (
                  <div className="px-4 py-3 text-sm text-text-muted flex items-center gap-2">
                    <svg
                      className="animate-spin w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Searching...
                  </div>
                ) : dropdownItems.length > 0 ? (
                  dropdownItems.map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => {
                        setRepairType(name);
                        setShowRepairDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-text-primary hover:bg-surface-1 transition-colors text-sm"
                    >
                      {name}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-text-muted">
                    No matching repairs found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quote amount */}
          <div>
            <label
              htmlFor="quoteAmount"
              className="block text-sm font-semibold text-text-primary mb-1.5 font-heading"
            >
              Quote Amount ($) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted font-medium">
                $
              </span>
              <input
                id="field-quote"
                type="number"
                value={quoteAmount}
                onChange={(e) => setQuoteAmount(e.target.value)}
                placeholder="0"
                min={1}
                step="0.01"
                className="w-full h-12 pl-8 pr-4 bg-surface-0 border border-surface-border rounded-xl text-text-primary placeholder:text-text-muted text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 bg-severity-critical-bg border border-severity-critical-border rounded-xl">
              <p className="text-sm text-severity-critical">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-primary text-white font-semibold font-heading rounded-xl hover:bg-primary-glow hover:-translate-y-px transition-all duration-150 shadow-sm shadow-primary/25 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Checking...
              </span>
            ) : (
              "Check My Quote"
            )}
          </button>
        </form>

        {/* Results */}
        {result && (
          <section
            className="mt-8 bg-surface-1 border border-surface-border rounded-2xl p-6 sm:p-8"
            aria-label="Quote assessment result"
          >
            {/* Top: badge + quote */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <p className="text-sm font-medium text-text-muted uppercase tracking-wide mb-1 font-heading">
                  Your Quote
                </p>
                <p className="text-3xl font-bold text-text-primary font-heading">
                  {formatCurrency(result.quoteAmount)}
                </p>
              </div>

              {assessmentStyle && (
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${assessmentStyle.bg} ${assessmentStyle.border} ${assessmentStyle.text} font-semibold text-sm font-heading`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${ASSESSMENT_DOT[result.assessment]}`} />
                  {assessmentStyle.label}
                </div>
              )}
            </div>

            {/* Cost comparison */}
            {result.minCost !== null && result.maxCost !== null ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-surface-0 rounded-xl border border-surface-border">
                  <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-1 font-heading">
                    Typical Range
                  </p>
                  <p className="text-lg font-bold text-text-primary font-heading">
                    {formatCurrency(result.minCost)} &ndash; {formatCurrency(result.maxCost)}
                  </p>
                  {result.avgCost && (
                    <p className="text-xs text-text-muted mt-1">
                      Average: {formatCurrency(result.avgCost)}
                    </p>
                  )}
                </div>
                <div className="p-4 bg-surface-0 rounded-xl border border-surface-border">
                  <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-1 font-heading">
                    Vehicle Tier
                  </p>
                  <p className="text-lg font-bold text-text-primary font-heading capitalize">
                    {result.tier}
                  </p>
                  <p className="text-xs text-text-muted mt-1">
                    Costs calibrated for {result.tier} vehicles
                  </p>
                </div>
              </div>
            ) : result.assessment === "Insufficient Data" ? (
              <div className="p-4 bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl mb-6">
                <p className="text-sm text-text-secondary">
                  We don&apos;t have enough cost data for this specific repair and vehicle
                  combination yet. The assessment is based on general market analysis.
                  Check back as we continue building our database.
                </p>
              </div>
            ) : null}

            {/* ── Share & Copy Section ── */}
            <div className="mb-4 p-4 bg-surface-0 rounded-xl border border-surface-border">
              <h3 className="text-sm font-semibold text-text-primary mb-3 font-heading">
                Share this result
              </h3>
              <div className="flex flex-wrap items-center gap-2">
                {/* Copy link button */}
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-surface-border bg-surface-1 text-sm font-medium text-text-secondary hover:border-primary/30 hover:text-primary transition-colors font-heading"
                >
                  {copied ? (
                    <>
                      <svg
                        className="w-4 h-4 text-emerald-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                      Copy link
                    </>
                  )}
                </button>

                {/* Twitter/X share */}
                <a
                  href={twitterShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-surface-border bg-surface-1 text-sm font-medium text-text-secondary hover:border-[#1DA1F2]/30 hover:text-[#1DA1F2] transition-colors font-heading"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  Share on X
                </a>

                {/* Facebook share */}
                <a
                  href={facebookShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-surface-border bg-surface-1 text-sm font-medium text-text-secondary hover:border-[#1877F2]/30 hover:text-[#1877F2] transition-colors font-heading"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Share on Facebook
                </a>
              </div>
              <p className="text-xs text-text-muted mt-2">
                Anyone with this link will see the same assessment.
              </p>
            </div>

            {/* Explainer */}
            <div className="p-4 bg-surface-0 rounded-xl border border-surface-border mb-4">
              <h3 className="text-sm font-semibold text-text-primary mb-2 font-heading">
                What could affect this price?
              </h3>
              <ul className="text-sm text-text-secondary space-y-1.5 list-disc pl-5">
                <li>
                  <strong>Location:</strong> Labor rates vary significantly by region
                  (urban vs. rural, coastal vs. inland).
                </li>
                <li>
                  <strong>Shop type:</strong> Dealerships typically charge 30-50% more
                  than independent shops.
                </li>
                <li>
                  <strong>Vehicle condition:</strong> Rust, previous damage, or custom
                  modifications can increase labor time.
                </li>
                <li>
                  <strong>Parts quality:</strong> OEM parts cost more than aftermarket;
                  some repairs require OEM for proper fit.
                </li>
                <li>
                  <strong>Additional services:</strong> Some quotes bundle related
                  services (e.g., alignment with strut replacement).
                </li>
              </ul>
            </div>

            {/* Recommended next step */}
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/20 mb-4">
              <h3 className="text-sm font-semibold text-text-primary mb-2 font-heading">
                Recommended next step
              </h3>
              {result.assessment === "Fair" && (
                <p className="text-sm text-text-secondary">
                  This quote falls within the typical range. It&apos;s reasonable to
                  proceed, but getting a second opinion is always a good practice.
                </p>
              )}
              {result.assessment === "Slightly High" && (
                <p className="text-sm text-text-secondary">
                  This quote is a bit above the typical range. Consider getting
                  1&ndash;2 more quotes from independent shops before committing. Ask
                  for an itemized breakdown of parts and labor.
                </p>
              )}
              {result.assessment === "Overpriced" && (
                <p className="text-sm text-text-secondary">
                  This quote is significantly above the typical range. We strongly recommend
                  getting multiple quotes from independent shops. Show them this estimate
                  and ask why their price differs.
                </p>
              )}
              {result.assessment === "Below Average" && (
                <p className="text-sm text-text-secondary">
                  This quote is below the typical range. While a good deal is great, make
                  sure the shop is using quality parts and has good reviews. Unusually low
                  prices can sometimes mean corner-cutting.
                </p>
              )}
              {result.assessment === "Insufficient Data" && (
                <p className="text-sm text-text-secondary">
                  Without complete cost data, we recommend getting at least 3 quotes from
                  different shops to establish a baseline. Compare not just price, but also
                  warranty, parts quality, and shop reputation.
                </p>
              )}
            </div>

            {/* Related OBD Codes */}
            {result.relatedObdCodes && result.relatedObdCodes.length > 0 && (
              <div className="p-4 bg-surface-0 rounded-xl border border-surface-border mb-4">
                <h3 className="text-sm font-semibold text-text-primary mb-3 font-heading">
                  Related OBD-II Codes
                </h3>
                <div className="space-y-2">
                  {result.relatedObdCodes.map((obd) => (
                    <Link
                      key={obd.code}
                      href={`/obd/${obd.code.toLowerCase()}`}
                      className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-surface-1 transition-colors group"
                    >
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-bold bg-primary/10 text-primary shrink-0">
                        {obd.code}
                      </span>
                      <span className="text-sm text-text-secondary flex-1 min-w-0 truncate">
                        {obd.title}
                      </span>
                      <svg className="w-4 h-4 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                    </Link>
                  ))}
                </div>
                <p className="text-xs text-text-muted mt-2">
                  These OBD codes may be related to the repair type you searched. Click any code to see symptoms, causes, and estimated repair costs.
                </p>
              </div>
            )}

            {/* Disclaimer */}
            <p className="text-xs text-text-muted italic text-center">
              {result.disclaimer}
            </p>
          </section>
        )}

        {/* Most Checked Repairs */}
        <div className="mt-8 p-5 sm:p-6 bg-surface-1 rounded-2xl border border-surface-border">
          <h2 className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider mb-3">Most Checked Repairs</h2>
          <p className="text-xs text-text-muted mb-4">Click to pre-fill the form with vehicle + repair. Just enter your quoted price.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { make: "Toyota", makeSlug: "toyota", model: "Camry", modelSlug: "camry", year: "2020", repair: "Brake Pad Replacement", cost: "$200–500" },
              { make: "Honda", makeSlug: "honda", model: "Civic", modelSlug: "civic", year: "2019", repair: "Alternator Replacement", cost: "$400–800" },
              { make: "Ford", makeSlug: "ford", model: "F-150", modelSlug: "f-150", year: "2020", repair: "Water Pump Replacement", cost: "$350–700" },
              { make: "Toyota", makeSlug: "toyota", model: "RAV4", modelSlug: "rav4", year: "2021", repair: "Starter Replacement", cost: "$300–600" },
              { make: "Honda", makeSlug: "honda", model: "Accord", modelSlug: "accord", year: "2019", repair: "Spark Plug Replacement", cost: "$150–350" },
              { make: "Chevrolet", makeSlug: "chevrolet", model: "Silverado 1500", modelSlug: "silverado-1500", year: "2020", repair: "Fuel Pump Replacement", cost: "$400–900" },
            ].map((r) => (
              <button key={`${r.make}-${r.model}-${r.repair}`} type="button"
                onClick={() => {
                  setResult(null);
                  setError("");
                  setSelectedMakeSlug(r.makeSlug);
                  setMake(r.make);
                  setSelectedModelSlug(r.modelSlug);
                  setModel(r.model);
                  setYear(r.year);
                  setRepairType(r.repair);
                  setShowRepairDropdown(false);
                  setFormHighlight(true);
                  setTimeout(() => setFormHighlight(false), 2000);
                  // Scroll to form
                  document.getElementById("quote-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="group flex items-center gap-3 p-2 rounded-xl bg-surface-0 border border-surface-border hover:border-primary/30 hover:bg-primary/5 transition-colors cursor-pointer text-left overflow-hidden">
                <div className="w-14 h-11 sm:w-16 sm:h-12 rounded-lg overflow-hidden shrink-0 bg-surface-2 flex items-center justify-center">
                  <img src={`/vehicles/${r.makeSlug}-${r.modelSlug}.jpg`} alt={`${r.make} ${r.model}`} className="w-full h-full object-cover" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  <svg className="w-6 h-6 text-text-muted absolute" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="3" width="15" height="13" rx="2"/><polygon points="16 8 20 14 23 9 23 23 1 23 1 16"/><circle cx="5.5" cy="8.5" r="1.5"/></svg>
                </div>
                <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-sm font-medium text-text-primary font-heading block truncate">{r.make} {r.model} ({r.year})</span>
                    <span className="text-xs text-text-muted font-heading">{r.repair}</span>
                  </div>
                  <span className="text-xs font-bold text-text-muted font-heading shrink-0">{r.cost}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Empty state when no results */}
        {!result && !loading && (
          <div className="mt-8 text-center py-10">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-surface-1 border border-surface-border flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-8 h-8 text-text-muted"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <line x1="9" y1="15" x2="15" y2="15" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-text-primary mb-1 font-heading">
              Check if your quote is fair
            </h3>
            <p className="text-sm text-text-muted max-w-md mx-auto">
              Enter your vehicle details and the repair quote you received. We&apos;ll
              compare it against real repair cost data and tell you if it&apos;s a fair
              price.
            </p>
          </div>
        )}

        {/* FAQ */}
        <section className="mt-12 pt-10 border-t border-surface-border" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-xl font-heading font-bold text-text-primary mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q: "How accurate is the repair cost data?", a: "Our repair cost data is sourced from a combination of NHTSA vehicle data, industry labor rate guides, and aggregated repair shop pricing. Estimates are broken down by vehicle tier (Economy, Mid-Range, Luxury, Truck/SUV, European) to reflect different labor and parts costs." },
              { q: "What's considered a fair mechanic quote?", a: "A fair quote falls within the typical cost range for your vehicle type and includes reasonable labor rates. If your quote is within 10-15% of our estimated range, it's generally fair. Quotes 20%+ above our estimates may be overpriced." },
              { q: "How much does labor vs parts cost?", a: "Labor typically accounts for 50-70% of most repair costs. Parts costs vary by vehicle tier — economy cars use more affordable aftermarket parts, while luxury and European vehicles require more expensive OEM or specialty parts." },
              { q: "Should I get multiple quotes?", a: "Yes. We recommend getting at least 2-3 quotes for any repair over $500. Different shops have different labor rates and may use different quality parts. Use our tool to benchmark each quote." },
              { q: "Can I use this for insurance estimates?", a: "Yes, our repair cost data can help you validate insurance repair estimates. However, insurance adjusters use their own labor rate guides and may include additional factors like rental car coverage and diminished value." },
            ].map((faq, i) => (
              <details key={i} className="group bg-surface-1 rounded-xl border border-surface-border">
                <summary className="flex items-center gap-2 cursor-pointer list-none px-4 py-3 min-h-[44px] font-heading font-semibold text-sm text-text-primary hover:text-primary transition-colors">
                  <svg className="w-4 h-4 shrink-0 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
                  {faq.q}
                </summary>
                <p className="px-4 pb-4 ml-6 text-sm text-text-secondary leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// ── Suspense fallback skeleton ──

function QuoteCheckerFallback() {
  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <Navbar />
      <main className="max-w-4xl mx-auto px-5 py-6 w-full flex-1">
        <div className="animate-pulse">
          <div className="h-4 bg-surface-1 rounded w-32 mb-4" />
          <div className="h-8 bg-surface-1 rounded w-48 mb-3" />
          <div className="h-4 bg-surface-1 rounded w-96 mb-8" />
          <div className="bg-surface-1 border border-surface-border rounded-2xl p-6 sm:p-8 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-surface-0 rounded-xl" />
              ))}
            </div>
            <div className="h-12 bg-surface-0 rounded-xl" />
            <div className="h-12 bg-surface-0 rounded-xl" />
            <div className="h-12 bg-primary/40 rounded-xl" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// ── Default export with Suspense boundary (required for useSearchParams) ──

export default function QuoteCheckerPage() {
  return (
    <Suspense fallback={<QuoteCheckerFallback />}>
      <QuoteCheckerContent />
    </Suspense>
  );
}
