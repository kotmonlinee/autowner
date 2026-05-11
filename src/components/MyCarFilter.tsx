"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchVehicleMakes, fetchVehicleModels, fetchVehicleGenerations } from "@/lib/data/browser";

type Step = "make" | "model" | "engine";
type Make = { id: string; name: string; slug: string };
type Model = { id: string; name: string; slug: string };
type Generation = { id: string; name: string; year_start: number; year_end: number | null };
type Engine = { id: string; code: string; name: string; displacement?: string; fuel_type?: string; horsepower?: number };

type StoredVehicle = {
  engineId: string;
  makeName: string;
  makeId: string;
  modelName: string;
  modelId: string;
  engineCode: string;
  engineName: string;
  generationName: string;
  yearStart: number;
  yearEnd: number | null;
};

const STORAGE_KEY = "autowner_my_vehicle";

function getStored(): StoredVehicle | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw);
    if (v?.engineId) return v;
    return null;
  } catch { return null; }
}

function saveStored(v: StoredVehicle) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(v)); } catch {}
}

export type PrimaryVehicleInfo = {
  engineId: string;
  makeName: string;
  modelName: string;
  year: number | null;
  engineCode: string;
  generationName?: string;
};

export default function MyCarFilter({ vehicle }: { vehicle: PrimaryVehicleInfo | null }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [stored, setStored] = useState<StoredVehicle | null>(null);

  // Selector state
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("make");
  const [makes, setMakes] = useState<Make[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [engines, setEngines] = useState<Engine[]>([]);
  const [selectedMake, setSelectedMake] = useState<Make | null>(null);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [selectedGeneration, setSelectedGeneration] = useState<Generation | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!vehicle) setStored(getStored());
  }, [vehicle]);

  const display = vehicle || stored;
  const isActive = searchParams.get("my_vehicle") === "1";

  const toggle = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (isActive) {
      params.delete("my_vehicle");
      params.delete("engine_id");
      const qs = params.toString();
      router.push(qs ? `/?${qs}` : "/");
    } else {
      const eid = stored?.engineId || "";
      params.set("my_vehicle", "1");
      if (eid) params.set("engine_id", eid);
      router.push(`/?${params.toString()}`);
    }
  };

  const startSelector = () => {
    setStep("make");
    setSelectedMake(null);
    setSelectedModel(null);
    setSelectedGeneration(null);
    setModels([]);
    setGenerations([]);
    setEngines([]);
    setOpen(true);
    fetchVehicleMakes().then(setMakes);
  };

  const selectMake = async (m: Make) => {
    setSelectedMake(m);
    setSelectedModel(null);
    setSelectedGeneration(null);
    setModels([]);
    setGenerations([]);
    setEngines([]);
    setLoading(true);
    setStep("model");
    const data = await fetchVehicleModels(m.slug);
    setModels((data as Model[]) ?? []);
    setLoading(false);
  };

  const selectModel = async (m: Model) => {
    setSelectedModel(m);
    setSelectedGeneration(null);
    setEngines([]);
    setLoading(true);
    const data = await fetchVehicleGenerations(m.slug, selectedMake!.slug);
    const gens = (data ?? []) as any[];
    setGenerations(gens);
    if (gens.length > 0) {
      setSelectedGeneration(gens[0]);
      setEngines((gens[0].vehicle_engines ?? []) as Engine[]);
    }
    setStep("engine");
    setLoading(false);
  };

  const selectGeneration = (g: Generation) => {
    setSelectedGeneration(g);
    const gens = generations as any[];
    const gen = gens.find((x: any) => x.id === g.id);
    setEngines((gen?.vehicle_engines ?? []) as Engine[]);
  };

  const selectEngine = (e: Engine) => {
    const sv: StoredVehicle = {
      engineId: e.id,
      makeName: selectedMake!.name,
      makeId: selectedMake!.id,
      modelName: selectedModel!.name,
      modelId: selectedModel!.id,
      engineCode: e.code,
      engineName: e.name,
      generationName: selectedGeneration?.name ?? "",
      yearStart: selectedGeneration?.year_start ?? 0,
      yearEnd: selectedGeneration?.year_end ?? null,
    };
    saveStored(sv);
    setStored(sv);
    setOpen(false);
    router.push(`/?my_vehicle=1&engine_id=${e.id}`);
  };

  const backToModels = () => {
    if (step === "engine") { setStep("model"); return; }
    if (step === "model") { setStep("make"); setSelectedMake(null); setModels([]); return; }
  };

  const close = () => {
    setOpen(false);
    setStep("make");
  };

  // --- SSR skeleton ---
  if (!mounted) {
    return (
      <div className="px-2 pb-3 mb-3 border-b border-surface-border">
        <div className="bg-surface-1 border border-surface-border rounded-xl p-4 text-center animate-pulse">
          <div className="w-10 h-10 mx-auto mb-2 bg-surface-3 rounded-xl" />
          <div className="h-4 w-20 bg-surface-3 rounded mx-auto mb-1" />
          <div className="h-3 w-36 bg-surface-3 rounded mx-auto mb-2.5" />
          <div className="h-9 w-full bg-surface-3 rounded-lg" />
        </div>
      </div>
    );
  }

  // --- Empty: no vehicle at all ---
  if (!display && !open) {
    return (
      <div className="px-2 pb-3 mb-3 border-b border-surface-border">
        <div className="bg-surface-1 border border-surface-border rounded-xl p-4 text-center">
          <div className="w-10 h-10 mx-auto mb-2 bg-surface-3 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 17h14v2H5zM6 10l3-3 3 3 3-3 3 3v5H3v-5l3-3z" />
              <circle cx="9" cy="17" r="1.5" /><circle cx="15" cy="17" r="1.5" />
            </svg>
          </div>
          <p className="text-xs font-semibold text-text-primary font-heading mb-0.5">Your Garage</p>
          <p className="text-[11px] text-text-muted mb-2.5">Add your car for personalized content</p>
          <button onClick={startSelector} className="w-full py-2 text-xs font-bold text-white bg-primary rounded-lg hover:bg-primary-glow transition-colors font-heading">
            + Add Your Vehicle
          </button>
        </div>
      </div>
    );
  }

  // --- Selector open ---
  if (open) {
    return (
      <div className="px-2 pb-3 mb-3 border-b border-surface-border">
        <div className="bg-surface-1 border border-surface-border rounded-xl">
          {/* Header */}
          <div className="flex items-center justify-between px-3.5 py-3 border-b border-surface-border">
            <div className="flex items-center gap-2">
              {step !== "make" && (
                <button onClick={backToModels} className="p-0.5 text-text-muted hover:text-text-primary transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                </button>
              )}
              <span className="text-xs font-bold text-text-primary font-heading">
                {step === "make" ? "Select Brand" : step === "model" ? "Select Model" : "Select Engine"}
              </span>
            </div>
            <button onClick={close} className="text-text-muted hover:text-text-primary transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Selected breadcrumb */}
          <div className="flex items-center gap-1 px-3.5 py-2 text-[10px] text-text-muted font-heading border-b border-surface-border">
            <span className={selectedMake ? "text-text-primary font-semibold" : ""}>{selectedMake?.name || "?"}</span>
            {selectedModel && <><span>›</span><span className="text-text-primary font-semibold">{selectedModel.name}</span></>}
            {selectedGeneration && <><span>›</span><span className="text-text-muted">{selectedGeneration.name}</span></>}
          </div>

          {/* Content */}
          <div className="p-3 max-h-64 overflow-y-auto">
            {loading ? (
              <div className="space-y-1.5">
                {[1,2,3,4].map(i => <div key={i} className="h-9 bg-surface-3 animate-pulse rounded-lg" />)}
              </div>
            ) : step === "make" ? (
              <div className="space-y-1">
                {makes.map(m => (
                  <button key={m.id} onClick={() => selectMake(m)} className="w-full px-3 py-2 text-left text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-2 rounded-lg transition-colors font-heading">
                    {m.name}
                  </button>
                ))}
              </div>
            ) : step === "model" ? (
              <div className="space-y-1">
                {models.length === 0 ? (
                  <p className="text-xs text-text-muted py-4 text-center">No models found</p>
                ) : models.map(m => (
                  <button key={m.id} onClick={() => selectModel(m)} className="w-full px-3 py-2 text-left text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-2 rounded-lg transition-colors font-heading">
                    {m.name}
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {generations.length > 1 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {generations.map(g => (
                      <button key={g.id} onClick={() => selectGeneration(g)}
                        className={`px-2 py-1 text-[10px] font-medium rounded-md transition-colors font-heading ${
                          selectedGeneration?.id === g.id ? "bg-primary/10 text-primary" : "bg-surface-2 text-text-muted hover:text-text-secondary"
                        }`}
                      >
                        {g.name} ({g.year_start}{g.year_end ? `–${g.year_end}` : "–"})
                      </button>
                    ))}
                  </div>
                )}
                {engines.length === 0 ? (
                  <p className="text-xs text-text-muted py-4 text-center">No engines found</p>
                ) : engines.map(e => (
                  <button key={e.id} onClick={() => selectEngine(e)} className="w-full px-3 py-2.5 text-left rounded-lg border border-surface-border hover:border-surface-4 hover:bg-surface-2 transition-all">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-text-primary font-heading">{e.name}</p>
                        <p className="text-[10px] text-text-muted mt-0.5">
                          {e.code} {e.displacement && `· ${e.displacement}`} {e.fuel_type && `· ${e.fuel_type}`} {e.horsepower && `· ${e.horsepower}hp`}
                        </p>
                      </div>
                      <svg className="w-4 h-4 text-text-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- Vehicle selected ---
  const title = [display!.makeName, display!.modelName].filter(Boolean).join(" ");
  const sub = [
    display && "generationName" in display ? (display as any).generationName : null,
    display!.engineCode,
  ].filter(Boolean).join(" · ");

  return (
    <div className="px-2 pb-3 mb-3 border-b border-surface-border">
      <div className="bg-surface-1 border border-surface-border rounded-xl overflow-hidden">
        <div className="p-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <svg className="w-4.5 h-4.5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 17h14v2H5zM6 10l3-3 3 3 3-3 3 3v5H3v-5l3-3z" />
                <circle cx="9" cy="17" r="1.5" /><circle cx="15" cy="17" r="1.5" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-text-primary font-heading truncate">{title}</p>
              {sub && <p className="text-[10px] text-text-muted truncate mt-0.5">{sub}</p>}
              {isActive && (
                <span className="inline-flex items-center gap-1 mt-1.5 px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full font-heading">
                  <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                  Filtering
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex border-t border-surface-border">
          <button onClick={toggle} className={`flex-1 py-2.5 text-xs font-semibold font-heading transition-colors ${isActive ? "bg-primary/10 text-primary" : "text-text-muted hover:text-text-secondary hover:bg-surface-2"}`}>
            {isActive ? "Show All" : "My Car Only"}
          </button>
          <div className="w-px bg-surface-border" />
          <button onClick={startSelector} className="flex-1 py-2.5 text-xs font-semibold text-text-muted hover:text-text-secondary hover:bg-surface-2 transition-colors font-heading">
            Change
          </button>
        </div>
      </div>
    </div>
  );
}
