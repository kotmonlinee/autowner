"use client";

import { useSearchParams, useRouter } from "next/navigation";

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

  if (!vehicle) return null;

  const isActive = searchParams.get("my_vehicle") === "1";

  const toggle = () => {
    if (isActive) {
      router.push("/");
    } else {
      router.push("/?my_vehicle=1");
    }
  };

  const vehicleDisplay = [vehicle.makeName, vehicle.modelName].filter(Boolean).join(" ");
  const vehicleSub = [
    vehicle.engineCode,
    vehicle.generationName,
    vehicle.year ? String(vehicle.year) : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="px-2 pb-3 mb-2 border-b border-amber-400/15">
      <div className="bg-amber-400/5 border border-amber-400/15 rounded-xl p-3 space-y-2.5">
        {/* Compact vehicle card */}
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
            <p className="text-xs font-semibold text-amber-400 font-heading truncate leading-tight">
              {vehicleDisplay || "My Vehicle"}
            </p>
            {vehicleSub && (
              <p className="text-[10px] text-amber-400/60 truncate leading-tight mt-0.5">
                {vehicleSub}
              </p>
            )}
          </div>
        </div>

        {/* Toggle */}
        <button
          onClick={toggle}
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
      </div>
    </div>
  );
}
