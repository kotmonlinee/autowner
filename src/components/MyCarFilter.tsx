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
    if (parsed?.engineId) return parsed as VehicleSelectedInfo;
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
    if (!vehicle) setStoredVehicle(getStoredVehicle());
  }, [vehicle]);

  const displayVehicle = vehicle || storedVehicle;

  if (!mounted) {
    return <div className="px-2 pb-3 mb-3 border-b border-surface-border" />;
  }

  // No vehicle — show elegant prompt
  if (!displayVehicle) {
    return (
      <div className="px-2 pb-3 mb-3 border-b border-surface-border">
        <div className="bg-surface-1 border border-surface-border rounded-xl p-4 text-center">
          <div className="w-12 h-12 mx-auto mb-3 bg-surface-3 rounded-2xl flex items-center justify-center">
            <svg className="w-6 h-6 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 17h14v2H5zM6 10l3-3 3 3 3-3 3 3v5H3v-5l3-3z" />
              <circle cx="9" cy="17" r="1.5" />
              <circle cx="15" cy="17" r="1.5" />
              <path d="M16 6l-2-3h-4L8 6" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-text-primary font-heading mb-1">
            Your Garage
          </p>
          <p className="text-xs text-text-muted leading-relaxed mb-3">
            Add your car to get personalized content, repair guides, and community discussions
          </p>
          {!showSelector ? (
            <button
              type="button"
              onClick={() => setShowSelector(true)}
              className="w-full px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-glow hover:-translate-y-px transition-all duration-150 font-heading shadow-sm shadow-primary/20"
            >
              + Add Your Vehicle
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
                className="w-full text-xs text-text-muted hover:text-text-secondary transition-colors font-medium py-1.5 mt-1"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Vehicle exists
  const isActive = searchParams.get("my_vehicle") === "1";

  const toggle = () => {
    if (isActive) {
      router.push("/");
    } else {
      const engineParam = storedVehicle ? `&engine_id=${storedVehicle.engineId}` : "";
      router.push(`/?my_vehicle=1${engineParam}`);
    }
  };

  const titleParts = [displayVehicle.makeName, displayVehicle.modelName].filter(Boolean);

  const detailParts: string[] = [];
  if (vehicle) {
    if (vehicle.generationName) detailParts.push(vehicle.generationName);
    if (vehicle.engineCode) detailParts.push(vehicle.engineCode);
    if (vehicle.year) detailParts.push(String(vehicle.year));
  } else if (storedVehicle) {
    if (storedVehicle.generationName) detailParts.push(storedVehicle.generationName);
    if (storedVehicle.engineCode) detailParts.push(storedVehicle.engineCode);
    if (storedVehicle.yearStart) {
      detailParts.push(`${storedVehicle.yearStart}${storedVehicle.yearEnd ? `–${storedVehicle.yearEnd}` : ""}`);
    }
  }

  return (
    <div className="px-2 pb-3 mb-3 border-b border-surface-border">
      <div className="bg-surface-1 border border-surface-border rounded-xl overflow-hidden">
        {/* Vehicle identity */}
        <div className="p-3.5 pb-2">
          <div className="flex items-start gap-3">
            {/* Car icon */}
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 17h14v2H5zM6 10l3-3 3 3 3-3 3 3v5H3v-5l3-3z" />
                <circle cx="9" cy="17" r="1.5" />
                <circle cx="15" cy="17" r="1.5" />
                <path d="M16 6l-2-3h-4L8 6" />
              </svg>
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-text-primary font-heading truncate">
                {titleParts.join(" ") || "My Vehicle"}
              </p>
              {detailParts.length > 0 && (
                <p className="text-[11px] text-text-muted truncate mt-0.5 leading-relaxed">
                  {detailParts.join(" · ")}
                </p>
              )}
              {/* Active indicator */}
              {isActive && (
                <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full font-heading">
                  <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                  Filtering
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Actions bar */}
        <div className="flex items-center border-t border-surface-border">
          {/* Toggle */}
          <button
            onClick={toggle}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold transition-colors font-heading ${
              isActive
                ? "bg-primary/10 text-primary hover:bg-primary/15"
                : "text-text-muted hover:text-text-secondary hover:bg-surface-2"
            }`}
          >
            <svg className="w-3.5 h-3.5" fill={isActive ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            {isActive ? "Showing" : "My Car"}
          </button>

          {/* Divider */}
          <div className="w-px h-5 bg-surface-border" />

          {/* Change */}
          {!vehicle && (
            <button
              onClick={() => setShowSelector(!showSelector)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-text-muted hover:text-text-secondary hover:bg-surface-2 transition-colors font-heading"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Change
            </button>
          )}
        </div>

        {/* Change selector */}
        {showSelector && !vehicle && (
          <div className="px-3.5 pb-3.5 border-t border-surface-border pt-3">
            <VehicleSelector
              onChange={() => {}}
              onVehicleSelected={(info) => {
                setStoredVehicle(info);
                setShowSelector(false);
              }}
              saveToLocalStorage
              compact
            />
          </div>
        )}
      </div>
    </div>
  );
}
