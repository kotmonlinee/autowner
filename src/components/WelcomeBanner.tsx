"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import VehicleSelector, { type VehicleSelectedInfo } from "./VehicleSelector";

export default function WelcomeBanner() {
  const router = useRouter();
  const [showSelector, setShowSelector] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleSelectedInfo | null>(null);

  const handleVehicleSelected = (info: VehicleSelectedInfo) => {
    // Already saved to localStorage by VehicleSelector (saveToLocalStorage=true)
    setSelectedVehicle(info);
    setShowSelector(false);
    // Redirect to personalized feed
    router.push(`/?my_vehicle=1&engine_id=${info.engineId}`);
  };

  return (
    <div className="mb-6 p-5 bg-primary/5 border border-primary/20 rounded-xl">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
          <svg
            className="w-6 h-6 text-primary"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
           width={24} height={24}>
            <path d="M5 17h14v2H5zM6 10l3-3 3 3 3-3 3 3v5H3v-5l3-3z" />
            <circle cx="9" cy="17" r="1" />
            <circle cx="15" cy="17" r="1" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-text-primary font-heading mb-1">
            Welcome to AutOwner!
          </h2>
          <p className="text-sm text-text-muted mb-4">
            Select your car to personalize your experience.
          </p>

          {!showSelector && !selectedVehicle ? (
            <button
              type="button"
              onClick={() => setShowSelector(true)}
              className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-glow hover:-translate-y-px transition-all duration-150 font-heading shadow-sm shadow-primary/20"
            >
              Choose your car
            </button>
          ) : showSelector ? (
            <div className="max-w-md">
              <VehicleSelector
                onChange={() => {}}
                onVehicleSelected={handleVehicleSelected}
                saveToLocalStorage
              />
              <button
                type="button"
                onClick={() => setShowSelector(false)}
                className="mt-2 text-xs text-text-muted hover:text-text-secondary transition-colors font-medium"
              >
                Maybe later
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
