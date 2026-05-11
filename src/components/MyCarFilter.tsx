"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import VehicleSelector, { type VehicleSelectedInfo } from "./VehicleSelector";

export type PrimaryVehicleInfo = {
  engineId: string;
  makeName: string;
  modelName: string;
  year: number | null;
  engineCode: string;
  generationName?: string;
};

const STORAGE_KEY = "autowner_my_vehicle";

function getStoredVehicle(): VehicleSelectedInfo | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.engineId) return parsed as VehicleSelectedInfo;
    return null;
  } catch {
    return null;
  }
}

export default function MyCarFilter({ vehicle }: { vehicle: PrimaryVehicleInfo | null }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showSelector, setShowSelector] = useState(false);
  const [storedVehicle, setStoredVehicle] = useState<VehicleSelectedInfo | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!vehicle) {
      setStoredVehicle(getStoredVehicle());
    }
  }, [vehicle]);

  // Determine which vehicle to display (DB takes precedence)
  const displayVehicle = vehicle || storedVehicle;
  const isFromDB = !!vehicle;

  // Avoid hydration mismatch: don't render localStorage content until mounted
  if (!mounted) {
    // If DB vehicle exists, render skeleton during SSR
    if (vehicle) {
      const vehicleDisplay = [vehicle.makeName, vehicle.modelName].filter(Boolean).join(" ");
      const vehicleSub = [vehicle.engineCode, vehicle.generationName, vehicle.year ? String(vehicle.year) : null]
        .filter(Boolean)
        .join(" · ");

      return (
        <div className="px-2 pb-3 mb-2 border-b border-amber-400/15">
          <div className="bg-amber-400/5 border border-amber-400/15 rounded-xl p-3 space-y-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-400/15 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 17h14v2H5zM6 10l3-3 3 3 3-3 3 3v5H3v-5l3-3z" />
                  <circle cx="9" cy="17" r="1" />
                  <circle cx="15" cy="17" r="1" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 font-heading truncate leading-tight">
                  {vehicleDisplay || "My Vehicle"}
                </p>
                {vehicleSub && (
                  <p className="text-[10px] text-amber-700/60 dark:text-amber-400/60 truncate leading-tight mt-0.5">{vehicleSub}</p>
                )}
              </div>
            </div>
            <ToggleButton isActive={searchParams.get("my_vehicle") === "1"} onToggle={() => {
              if (searchParams.get("my_vehicle") === "1") {
                router.push("/");
              } else {
                router.push("/?my_vehicle=1");
              }
            }} />
          </div>
        </div>
      );
    }
    // Anonymous: render empty placeholder during SSR
    return <div className="px-2 pb-3 mb-2 border-b border-amber-400/15" />;
  }

  // No vehicle at all — show prompt to choose one
  if (!displayVehicle) {
    return (
      <div className="px-2 pb-3 mb-2 border-b border-amber-400/15">
        <div className="bg-amber-400/5 border border-amber-400/15 rounded-xl p-3 space-y-2.5">
          <p className="text-xs text-amber-700/70 dark:text-amber-400/70 font-heading text-center">
            Select your car to personalize your feed
          </p>
          {!showSelector ? (
            <button
              type="button"
              onClick={() => setShowSelector(true)}
              className="w-full px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 border border-amber-700/20 dark:border-amber-400/20 rounded-lg hover:bg-amber-700/10 dark:hover:bg-amber-400/10 transition-colors font-heading"
            >
              Choose your car
            </button>
          ) : (
            <div>
              <VehicleSelector
                onChange={() => {}}
                onVehicleSelected={(info) => {
                  setStoredVehicle(info);
                  setShowSelector(false);
                }}
                saveToLocalStorage
                compact
              />
              <button
                type="button"
                onClick={() => setShowSelector(false)}
                className="w-full text-xs text-text-muted hover:text-text-secondary transition-colors font-medium py-1 mt-1"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Vehicle exists (from DB or localStorage)
  const isActive = searchParams.get("my_vehicle") === "1";

  const toggle = () => {
    if (isActive) {
      router.push("/");
    } else {
      if (isFromDB) {
        router.push("/?my_vehicle=1");
      } else {
        router.push(`/?my_vehicle=1&engine_id=${displayVehicle.engineId}`);
      }
    }
  };

  const vehicleDisplay = [displayVehicle.makeName, displayVehicle.modelName].filter(Boolean).join(" ");

  // Build subtitle from whichever fields are available
  const subParts: string[] = [];
  if (vehicle) {
    if (vehicle.engineCode) subParts.push(vehicle.engineCode);
    if (vehicle.generationName) subParts.push(vehicle.generationName);
    if (vehicle.year) subParts.push(String(vehicle.year));
  } else if (storedVehicle) {
    if (storedVehicle.engineCode) subParts.push(storedVehicle.engineCode);
    if (storedVehicle.generationName) subParts.push(storedVehicle.generationName);
    if (storedVehicle.yearStart) {
      subParts.push(`${storedVehicle.yearStart}${storedVehicle.yearEnd ? `–${storedVehicle.yearEnd}` : ""}`);
    }
  }
  const vehicleSub = subParts.join(" · ");

  const handleVehicleSelected = (info: VehicleSelectedInfo) => {
    setStoredVehicle(info);
    setShowSelector(false);
  };

  return (
    <div className="px-2 pb-3 mb-2 border-b border-amber-400/15">
      <div className="bg-amber-400/5 border border-amber-400/15 rounded-xl p-3 space-y-2.5">
        {/* Vehicle card */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-400/15 flex items-center justify-center shrink-0">
            <svg
              className="w-4 h-4 text-amber-400"
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
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 font-heading truncate leading-tight">
              {vehicleDisplay || "My Vehicle"}
            </p>
            {vehicleSub && (
              <p className="text-[10px] text-amber-700/60 dark:text-amber-400/60 truncate leading-tight mt-0.5">
                {vehicleSub}
              </p>
            )}
          </div>
        </div>

        {/* Change button (for non-DB / anonymous vehicles) */}
        {!isFromDB && (
          <>
            {!showSelector ? (
              <button
                type="button"
                onClick={() => setShowSelector(true)}
                className="w-full text-center text-xs text-amber-700/60 dark:text-amber-400/60 hover:text-amber-700 dark:hover:text-amber-400 transition-colors font-medium"
              >
                Change
              </button>
            ) : (
              <div>
                <VehicleSelector
                  onChange={() => {}}
                  onVehicleSelected={handleVehicleSelected}
                  saveToLocalStorage
                  compact
                />
                <button
                  type="button"
                  onClick={() => setShowSelector(false)}
                  className="w-full text-xs text-text-muted hover:text-text-secondary transition-colors font-medium py-1 mt-1"
                >
                  Cancel
                </button>
              </div>
            )}
          </>
        )}

        {/* Toggle */}
        <ToggleButton isActive={isActive} onToggle={toggle} />
      </div>
    </div>
  );
}

/** Extracted toggle button to reduce duplication between SSR and mounted renders */
function ToggleButton({ isActive, onToggle }: { isActive: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between text-xs font-medium text-amber-300/80 hover:text-amber-300 transition-colors font-heading group"
    >
      <span>Show only my car</span>
      <span
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border transition-colors duration-200 ${
          isActive
            ? "bg-amber-500/30 border-amber-400/40"
            : "bg-surface-3 border-surface-border group-hover:border-surface-4"
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
            isActive ? "translate-x-[18px]" : "translate-x-[2px]"
          } mt-[2px]`}
        />
      </span>
    </button>
  );
}
