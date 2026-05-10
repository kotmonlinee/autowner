"use client";

import { useState, useEffect, useCallback } from "react";
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
  const [selectedMake, setSelectedMake] = useState<string>("");
  const [selectedMakeSlug, setSelectedMakeSlug] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedModelSlug, setSelectedModelSlug] = useState<string>("");
  const [selectedEngineId, setSelectedEngineId] = useState<string>("");
  const [selectedVehicle, setSelectedVehicle] = useState<SelectedVehicle | null>(null);

  // UI state
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  // Load initial vehicle if engineId provided
  useEffect(() => {
    if (initialEngineId) {
      loadInitialVehicle(initialEngineId);
    }
  }, [initialEngineId]);

  const loadInitialVehicle = async (engineId: string) => {
    const engine = await fetchEngineById(engineId) as Record<string, unknown> | null;
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
    fetchVehicleModels(selectedMakeSlug).then((data) => setModels(data as unknown as SimpleModel[]));
    // Reset downstream selections
    setSelectedModel("");
    setSelectedModelSlug("");
    setGenerations([]);
    setSelectedEngineId("");
  }, [selectedMakeSlug]);

  // Load generations when model changes
  useEffect(() => {
    if (!selectedModelSlug || !selectedMakeSlug) {
      setGenerations([]);
      return;
    }
    fetchVehicleGenerations(selectedModelSlug, selectedMakeSlug).then(
      (data) => setGenerations(data as unknown as GenerationWithEngines[])
    );
    setSelectedEngineId("");
  }, [selectedModelSlug, selectedMakeSlug]);

  const handleMakeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const slug = e.target.value;
    setSelectedMake(slug ? e.target.options[e.target.selectedIndex].text : "");
    setSelectedMakeSlug(slug);
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const slug = e.target.value;
    setSelectedModel(slug ? e.target.options[e.target.selectedIndex].text : "");
    setSelectedModelSlug(slug);
  };

  const handleEngineSelect = (engineId: string, generation: GenerationWithEngines, engine: GenerationWithEngines["vehicle_engines"][0]) => {
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

    // Build full vehicle info for callbacks
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

    // Save to localStorage if requested (anonymous flow)
    if (saveToLocalStorage) {
      try {
        localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(vehicleInfo));
      } catch {
        // localStorage may be unavailable
      }
    }

    // Notify parent of full vehicle selection
    if (onVehicleSelected) {
      onVehicleSelected(vehicleInfo);
    }

    // Collapse the selector after selection
    setEditing(false);
    setLoading(false);
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
  };

  // Compact card view (after selection or with initial)
  if (selectedVehicle && !editing) {
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
                {selectedVehicle.display}
              </p>
              <p className="text-xs text-text-muted mt-0.5">
                {selectedVehicle.make} {selectedVehicle.model} &middot;{" "}
                {selectedVehicle.generation} &middot; {selectedVehicle.engine}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleEdit}
            className="shrink-0 px-3 py-1.5 text-xs font-semibold rounded-lg border border-surface-border text-text-secondary hover:text-text-primary hover:border-surface-4 transition-colors font-heading"
          >
            Change
          </button>
        </div>
      </div>
    );
  }

  // Collapsed "Add Vehicle" button when compact and no selection
  if (compact && !editing && !selectedVehicle) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="w-full px-4 py-3 bg-surface-2 border border-surface-border rounded-xl text-sm text-text-muted hover:text-text-secondary hover:border-surface-4 transition-colors text-left font-medium"
      >
        <span className="flex items-center gap-2">
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 17h14v2H5zM6 10l3-3 3 3 3-3 3 3v5H3v-5l3-3z" />
            <line x1="12" y1="7" x2="12" y2="12" />
          </svg>
          Add vehicle to your garage...
        </span>
      </button>
    );
  }

  // Full selector form
  return (
    <div className="bg-surface-2 border border-surface-border rounded-xl p-4 space-y-3">
      {/* Step 1: Brand */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5 font-heading">
          Brand
        </label>
        <select
          value={selectedMakeSlug}
          onChange={handleMakeChange}
          className="w-full px-3 py-2 bg-surface-0 text-text-primary text-sm rounded-lg border border-surface-border focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-all appearance-none"
        >
          <option value="">Select a brand...</option>
          {makes.map((m) => (
            <option key={m.id} value={m.slug}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      {/* Step 2: Model */}
      {selectedMakeSlug && (
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5 font-heading">
            Model
          </label>
          <select
            value={selectedModelSlug}
            onChange={handleModelChange}
            className="w-full px-3 py-2 bg-surface-0 text-text-primary text-sm rounded-lg border border-surface-border focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-all appearance-none"
          >
            <option value="">Select a model...</option>
            {models.map((m) => (
              <option key={m.id} value={m.slug}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Step 3: Generation + Engine */}
      {selectedModelSlug && generations.length > 0 && (
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5 font-heading">
            Generation / Engine
          </label>
          <div className="space-y-1.5 max-h-64 overflow-y-auto">
            {generations.map((gen) =>
              gen.vehicle_engines.map((engine) => (
                <button
                  key={engine.id}
                  type="button"
                  onClick={() => handleEngineSelect(engine.id, gen, engine)}
                  className={`w-full px-3 py-2.5 text-left rounded-lg border transition-all text-sm ${
                    selectedEngineId === engine.id
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : "bg-surface-0 border-surface-border text-text-secondary hover:border-primary/20 hover:text-text-primary"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold font-heading">
                      {gen.year_start}&ndash;{gen.year_end ?? "Pres"}
                    </span>
                    <span className="text-xs font-mono text-text-muted bg-surface-2 px-1.5 py-0.5 rounded">
                      {engine.code}
                    </span>
                  </div>
                  <div className="text-xs text-text-muted mt-0.5">
                    {engine.name}
                    {engine.displacement && ` · ${engine.displacement}`}
                    {engine.fuel_type && ` · ${engine.fuel_type}`}
                    {engine.horsepower && ` · ${engine.horsepower} hp`}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Loading state */}
      {selectedModelSlug && generations.length === 0 && (
        <div className="py-3 text-center">
          <div className="w-4 h-4 border-2 border-surface-border border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-xs text-text-muted mt-2">Loading engines...</p>
        </div>
      )}

      {/* Cancel button */}
      {(selectedMakeSlug || editing) && (
        <button
          type="button"
          onClick={() => {
            setEditing(false);
            if (!selectedVehicle) {
              setSelectedMake("");
              setSelectedMakeSlug("");
            }
          }}
          className="w-full text-xs text-text-muted hover:text-text-secondary transition-colors font-medium py-1"
        >
          Cancel
        </button>
      )}
    </div>
  );
}
