"use client";

import { useState, useEffect } from "react";
import {
  fetchVehicleMakes,
  fetchVehicleModels,
  fetchVehicleGenerations,
  fetchEngineById,
} from "@/lib/data/browser";

type SimpleMake = { id: string; name: string; slug: string };
type SimpleModel = { id: string; name: string; slug: string; make_id: string };
type GenerationWithEngines = {
  id: string;
  name: string;
  year_start: number;
  year_end: number | null;
  vehicle_engines: {
    id: string;
    code: string;
    name: string;
    displacement: string | null;
    fuel_type: string | null;
    horsepower: number | null;
  }[];
  model_name?: string;
  make_name?: string;
};

type SelectedVehicle = {
  engineId: string;
  display: string;
  make: string;
  model: string;
  generation: string;
  engine: string;
};

export interface VehicleSelectedInfo {
  engineId: string;
  display: string;
  makeName: string;
  modelName: string;
  generationName: string;
  engineCode: string;
  engineName: string;
  yearStart: number;
  yearEnd: number | null;
}

interface VehicleSelectorProps {
  onChange: (engineId: string) => void;
  onVehicleSelected?: (info: VehicleSelectedInfo) => void;
  initialEngineId?: string | null;
  compact?: boolean;
  saveToLocalStorage?: boolean;
}

const LOCALSTORAGE_KEY = "autowner_my_vehicle";

type Step = "make" | "model" | "engine";

export default function VehicleSelector({
  onChange,
  onVehicleSelected,
  initialEngineId,
  compact = false,
  saveToLocalStorage = false,
}: VehicleSelectorProps) {
  // Lists
  const [makes, setMakes] = useState<SimpleMake[]>([]);
  const [models, setModels] = useState<SimpleModel[]>([]);
  const [generations, setGenerations] = useState<GenerationWithEngines[]>([]);

  // Selection state
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedMakeSlug, setSelectedMakeSlug] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedModelSlug, setSelectedModelSlug] = useState("");
  const [selectedEngineId, setSelectedEngineId] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState<SelectedVehicle | null>(null);

  // UI state
  const [step, setStep] = useState<Step>("make");
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingEngines, setLoadingEngines] = useState(false);
  const [editing, setEditing] = useState(false);
  const [compactModalOpen, setCompactModalOpen] = useState(false);

  // Load initial vehicle if engineId provided
  useEffect(() => {
    if (initialEngineId) {
      loadInitialVehicle(initialEngineId);
    }
  }, [initialEngineId]);

  const loadInitialVehicle = async (engineId: string) => {
    const engine = (await fetchEngineById(engineId)) as Record<string, unknown> | null;
    if (engine) {
      const gen = engine.vehicle_generations as Record<string, unknown> | null;
      const model = gen?.vehicle_models as Record<string, unknown> | null;
      const make = model?.vehicle_makes as Record<string, unknown> | null;
      setSelectedVehicle({
        engineId: engineId,
        display: `${make?.name ?? ""} ${model?.name ?? ""} (${gen?.name ?? ""}) — ${engine.code} ${engine.name}`,
        make: (make?.name as string) ?? "",
        model: (model?.name as string) ?? "",
        generation: (gen?.name as string) ?? "",
        engine: `${engine.code} ${engine.name}`,
      });
      setSelectedEngineId(engineId);
    }
  };

  // Load makes on mount
  useEffect(() => {
    fetchVehicleMakes().then((data) => setMakes(data as unknown as SimpleMake[]));
  }, []);

  // Load models when make changes
  useEffect(() => {
    if (!selectedMakeSlug) {
      setModels([]);
      return;
    }
    setLoadingModels(true);
    fetchVehicleModels(selectedMakeSlug)
      .then((data) => setModels(data as unknown as SimpleModel[]))
      .finally(() => setLoadingModels(false));
  }, [selectedMakeSlug]);

  // Load generations when model changes
  useEffect(() => {
    if (!selectedModelSlug || !selectedMakeSlug) {
      setGenerations([]);
      return;
    }
    setLoadingEngines(true);
    fetchVehicleGenerations(selectedModelSlug, selectedMakeSlug)
      .then((data) => setGenerations(data as unknown as GenerationWithEngines[]))
      .finally(() => setLoadingEngines(false));
  }, [selectedModelSlug, selectedMakeSlug]);

  const handleMakeSelect = (slug: string, name: string) => {
    setSelectedMake(name);
    setSelectedMakeSlug(slug);
    setSelectedModel("");
    setSelectedModelSlug("");
    setGenerations([]);
    setSelectedEngineId("");
    setStep("model");
  };

  const handleModelSelect = (slug: string, name: string) => {
    setSelectedModel(name);
    setSelectedModelSlug(slug);
    setSelectedEngineId("");
    setStep("engine");
  };

  const handleBackToMakes = () => {
    setSelectedMake("");
    setSelectedMakeSlug("");
    setSelectedModel("");
    setSelectedModelSlug("");
    setGenerations([]);
    setSelectedEngineId("");
    setModels([]);
    setStep("make");
  };

  const handleBackToModels = () => {
    setSelectedModel("");
    setSelectedModelSlug("");
    setGenerations([]);
    setSelectedEngineId("");
    setStep("model");
  };

  const handleEngineSelect = (
    engineId: string,
    generation: GenerationWithEngines,
    engine: GenerationWithEngines["vehicle_engines"][0]
  ) => {
    setSelectedEngineId(engineId);
    const display = `${selectedMake} ${selectedModel} (${generation.name}) — ${engine.code} ${engine.name}`;
    setSelectedVehicle({
      engineId,
      display,
      make: selectedMake,
      model: selectedModel,
      generation: generation.name,
      engine: `${engine.code} ${engine.name}`,
    });
    onChange(engineId);

    const vehicleInfo: VehicleSelectedInfo = {
      engineId,
      display,
      makeName: selectedMake,
      modelName: selectedModel,
      generationName: generation.name,
      engineCode: engine.code,
      engineName: engine.name,
      yearStart: generation.year_start,
      yearEnd: generation.year_end,
    };

    if (saveToLocalStorage) {
      try {
        localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(vehicleInfo));
      } catch {
        // localStorage may be unavailable
      }
    }

    if (onVehicleSelected) {
      onVehicleSelected(vehicleInfo);
    }

    setEditing(false);
    setCompactModalOpen(false);
  };

  const handleEdit = () => {
    setEditing(true);
    setSelectedVehicle(null);
    setSelectedMake("");
    setSelectedMakeSlug("");
    setSelectedModel("");
    setSelectedModelSlug("");
    setSelectedEngineId("");
    setModels([]);
    setGenerations([]);
    setStep("make");
  };

  const handleCancel = () => {
    setEditing(false);
    setCompactModalOpen(false);
    if (!selectedVehicle) {
      setSelectedMake("");
      setSelectedMakeSlug("");
      setSelectedModel("");
      setSelectedModelSlug("");
      setSelectedEngineId("");
      setModels([]);
      setGenerations([]);
      setStep("make");
    }
  };

  // ── Selected vehicle card (shown after selection, when not editing) ──
  if (selectedVehicle && !editing) {
    return <SelectedVehicleCard vehicle={selectedVehicle} onChange={handleEdit} />;
  }

  // ── Compact mode trigger (no vehicle selected, not editing) ──
  if (compact && !editing && !selectedVehicle) {
    return (
      <>
        <button
          type="button"
          onClick={() => setCompactModalOpen(true)}
          className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-glow hover:-translate-y-px transition-all duration-150 font-heading shadow-sm shadow-primary/20"
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add Your Vehicle
          </span>
        </button>

        {/* Modal overlay */}
        {compactModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={handleCancel}
            />

            {/* Modal panel */}
            <div className="relative z-10 w-full max-w-lg max-h-[85vh] overflow-y-auto bg-surface-1 border border-surface-border rounded-2xl shadow-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-text-primary font-heading">
                  Select your vehicle
                </h3>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="text-text-muted hover:text-text-primary transition-colors"
                  aria-label="Close"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <StepSelector
                makes={makes}
                models={models}
                generations={generations}
                selectedMake={selectedMake}
                selectedMakeSlug={selectedMakeSlug}
                selectedModel={selectedModel}
                selectedModelSlug={selectedModelSlug}
                selectedEngineId={selectedEngineId}
                step={step}
                loadingModels={loadingModels}
                loadingEngines={loadingEngines}
                onMakeSelect={handleMakeSelect}
                onModelSelect={handleModelSelect}
                onEngineSelect={handleEngineSelect}
                onBackToMakes={handleBackToMakes}
                onBackToModels={handleBackToModels}
                onCancel={handleCancel}
                isCompactModal
              />
            </div>
          </div>
        )}
      </>
    );
  }

  // ── Full selector ──
  return (
    <StepSelector
      makes={makes}
      models={models}
      generations={generations}
      selectedMake={selectedMake}
      selectedMakeSlug={selectedMakeSlug}
      selectedModel={selectedModel}
      selectedModelSlug={selectedModelSlug}
      selectedEngineId={selectedEngineId}
      step={step}
      loadingModels={loadingModels}
      loadingEngines={loadingEngines}
      onMakeSelect={handleMakeSelect}
      onModelSelect={handleModelSelect}
      onEngineSelect={handleEngineSelect}
      onBackToMakes={handleBackToMakes}
      onBackToModels={handleBackToModels}
      onCancel={handleCancel}
    />
  );
}

/* ──────────────────────────────────────────
   Selected Vehicle Card
   ────────────────────────────────────────── */

function SelectedVehicleCard({
  vehicle,
  onChange,
}: {
  vehicle: SelectedVehicle;
  onChange: () => void;
}) {
  return (
    <div className="bg-surface-2 border border-surface-border rounded-xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <svg
              className="w-5 h-5 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 17h14v2H5zM6 10l3-3 3 3 3-3 3 3v5H3v-5l3-3z" />
              <circle cx="9" cy="17" r="1" />
              <circle cx="15" cy="17" r="1" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text-primary font-heading truncate">
              {vehicle.make} {vehicle.model}
            </p>
            <p className="text-xs text-text-muted mt-0.5 truncate">
              {vehicle.generation} &middot; {vehicle.engine}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onChange}
          className="shrink-0 px-3 py-1.5 text-xs font-semibold rounded-lg text-text-muted hover:text-primary hover:bg-primary/5 transition-all duration-150 font-heading"
        >
          Change
        </button>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────
   Step Indicator
   ────────────────────────────────────────── */

function StepIndicator({
  currentStep,
  completedSteps,
}: {
  currentStep: Step;
  completedSteps: Step[];
}) {
  const steps: { key: Step; label: string }[] = [
    { key: "make", label: "Brand" },
    { key: "model", label: "Model" },
    { key: "engine", label: "Engine" },
  ];

  return (
    <div className="flex items-center gap-1.5 mb-4">
      {steps.map((s, i) => {
        const isActive = currentStep === s.key;
        const isDone = completedSteps.includes(s.key);

        return (
          <div key={s.key} className="flex items-center gap-1.5">
            {/* Step dot + label */}
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider font-heading transition-all duration-150 ${
                isActive
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : isDone
                    ? "bg-surface-3 text-text-primary border border-surface-border"
                    : "text-text-muted"
              }`}
            >
              <span
                className={`w-3.5 h-3.5 rounded-full inline-flex items-center justify-center text-[8px] shrink-0 ${
                  isActive
                    ? "bg-primary text-white"
                    : isDone
                      ? "bg-primary/30 text-primary"
                      : "bg-surface-4 text-text-muted"
                }`}
              >
                {isDone ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-2 h-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </span>
              {s.label}
            </span>

            {/* Connector line (hidden after last step) */}
            {i < steps.length - 1 && (
              <span
                className={`w-4 h-px shrink-0 transition-colors duration-150 ${
                  completedSteps.includes(s.key) || isActive
                    ? "bg-primary/30"
                    : "bg-surface-border"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ──────────────────────────────────────────
   Loading Skeletons
   ────────────────────────────────────────── */

function PillSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="flex flex-wrap gap-1.5 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-8 rounded-full bg-surface-3"
          style={{ width: `${70 + (i * 17) % 50}px` }}
        />
      ))}
    </div>
  );
}

function EngineCardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-3 rounded-xl border border-surface-border bg-surface-2 space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 rounded bg-surface-3" />
            <div className="h-5 w-16 rounded bg-surface-3" />
          </div>
          <div className="h-3 w-48 rounded bg-surface-3" />
        </div>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────
   Step Selector (main form content)
   ────────────────────────────────────────── */

function StepSelector({
  makes,
  models,
  generations,
  selectedMake,
  selectedMakeSlug,
  selectedModel,
  selectedModelSlug,
  selectedEngineId,
  step,
  loadingModels,
  loadingEngines,
  onMakeSelect,
  onModelSelect,
  onEngineSelect,
  onBackToMakes,
  onBackToModels,
  onCancel,
  isCompactModal = false,
}: {
  makes: SimpleMake[];
  models: SimpleModel[];
  generations: GenerationWithEngines[];
  selectedMake: string;
  selectedMakeSlug: string;
  selectedModel: string;
  selectedModelSlug: string;
  selectedEngineId: string;
  step: Step;
  loadingModels: boolean;
  loadingEngines: boolean;
  onMakeSelect: (slug: string, name: string) => void;
  onModelSelect: (slug: string, name: string) => void;
  onEngineSelect: (
    engineId: string,
    generation: GenerationWithEngines,
    engine: GenerationWithEngines["vehicle_engines"][0]
  ) => void;
  onBackToMakes: () => void;
  onBackToModels: () => void;
  onCancel: () => void;
  isCompactModal?: boolean;
}) {
  const completedSteps: Step[] = [];
  if (step === "model" || step === "engine") completedSteps.push("make");
  if (step === "engine") completedSteps.push("model");

  return (
    <div className="bg-surface-2 border border-surface-border rounded-xl p-4 space-y-3">
      {/* Step indicator */}
      <StepIndicator currentStep={step} completedSteps={completedSteps} />

      {/* ── Step 1: Brand ── */}
      <div>
        <StepHeader
          label="Brand"
          selection={selectedMake || undefined}
          isDone={completedSteps.includes("make")}
          onBack={undefined}
        />

        {step === "make" ? (
          makes.length > 0 ? (
            <PillGrid>
              {makes.map((m) => (
                <PillButton
                  key={m.id}
                  active={selectedMakeSlug === m.slug}
                  onClick={() => onMakeSelect(m.slug, m.name)}
                >
                  {m.name}
                </PillButton>
              ))}
            </PillGrid>
          ) : (
            <div className="py-3 text-center text-xs text-text-muted">
              Loading brands...
            </div>
          )
        ) : (
          /* Collapsed: show selected make as a single pill */
          selectedMake && (
            <div className="flex flex-wrap gap-1.5">
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium font-heading bg-primary/10 text-primary border border-primary/20">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {selectedMake}
              </span>
            </div>
          )
        )}
      </div>

      {/* ── Step 2: Model ── */}
      {selectedMakeSlug && (
        <div>
          <StepHeader
            label="Model"
            selection={selectedModel || undefined}
            isDone={completedSteps.includes("model")}
            onBack={step === "engine" ? onBackToModels : step === "model" ? onBackToMakes : undefined}
          />

          {step === "model" ? (
            loadingModels ? (
              <PillSkeleton />
            ) : models.length > 0 ? (
              <PillGrid>
                {models.map((m) => (
                  <PillButton
                    key={m.id}
                    active={selectedModelSlug === m.slug}
                    onClick={() => onModelSelect(m.slug, m.name)}
                  >
                    {m.name}
                  </PillButton>
                ))}
              </PillGrid>
            ) : (
              <EmptyState message="No models available for this brand" />
            )
          ) : selectedModel ? (
            /* Collapsed: show selected model */
            <div className="flex flex-wrap gap-1.5">
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium font-heading bg-primary/10 text-primary border border-primary/20">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {selectedModel}
              </span>
            </div>
          ) : null}
        </div>
      )}

      {/* ── Step 3: Engine ── */}
      {selectedModelSlug && (
        <div>
          <StepHeader
            label="Engine"
            isDone={false}
            onBack={step === "engine" ? onBackToModels : undefined}
          />

          {step === "engine" ? (
            loadingEngines ? (
              <EngineCardSkeleton />
            ) : generations.length > 0 ? (
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {generations.map((gen) =>
                  gen.vehicle_engines.map((engine) => (
                    <button
                      key={engine.id}
                      type="button"
                      onClick={() => onEngineSelect(engine.id, gen, engine)}
                      className={`w-full p-3 text-left rounded-xl border transition-all duration-150 ${
                        selectedEngineId === engine.id
                          ? "bg-primary/10 border-primary text-primary"
                          : "bg-surface-1 border-surface-border text-text-secondary hover:bg-surface-2 hover:border-surface-4"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-text-primary font-heading text-sm">
                          {gen.year_start}&ndash;{gen.year_end ?? "Pres"} &middot; {gen.name}
                        </span>
                        <span className="text-[10px] font-mono text-text-muted bg-surface-3 px-1.5 py-0.5 rounded">
                          {engine.code}
                        </span>
                      </div>
                      <div className="text-xs text-text-muted mt-1">
                        {engine.name}
                        {engine.displacement && ` · ${engine.displacement}L`}
                        {engine.fuel_type && ` · ${engine.fuel_type}`}
                        {engine.horsepower && ` · ${engine.horsepower} hp`}
                      </div>
                    </button>
                  ))
                )}
              </div>
            ) : (
              <EmptyState message="No engine options available for this model" />
            )
          ) : null}
        </div>
      )}

      {/* Cancel button (not shown in modal since modal has its own X) */}
      {!isCompactModal && (selectedMakeSlug || step !== "make") && (
        <button
          type="button"
          onClick={onCancel}
          className="w-full text-xs text-text-muted hover:text-text-secondary transition-colors font-medium py-1"
        >
          Cancel
        </button>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────
   Sub-components
   ────────────────────────────────────────── */

function StepHeader({
  label,
  selection,
  isDone,
  onBack,
}: {
  label: string;
  selection?: string;
  isDone?: boolean;
  onBack?: () => void;
}) {
  return (
    <div className="flex items-center gap-2 mb-2">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="shrink-0 text-text-muted hover:text-text-primary transition-colors p-0.5 -ml-0.5"
          aria-label={`Back to ${label === "Model" ? "brand" : "model"} selection`}
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}
      <span className="text-xs font-bold uppercase tracking-wider text-text-muted font-heading">
        {label}
      </span>
      {isDone && selection && (
        <span className="text-xs text-primary font-medium font-heading truncate">
          {selection}
        </span>
      )}
    </div>
  );
}

function PillGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap gap-1.5">{children}</div>
  );
}

function PillButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium font-heading transition-all duration-150 whitespace-nowrap ${
        active
          ? "bg-primary/10 border-primary text-primary"
          : "bg-surface-1 text-text-secondary border border-surface-border hover:bg-surface-2 hover:text-text-primary hover:border-surface-4"
      }`}
    >
      {children}
    </button>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-3 text-center">
      <p className="text-xs text-text-muted">{message}</p>
    </div>
  );
}
