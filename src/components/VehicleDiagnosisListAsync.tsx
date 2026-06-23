"use client";

import { useState, useEffect } from "react";
import VehicleDiagnosisList from "./VehicleDiagnosisList";
import type { DiagnosisItem } from "./VehicleDiagnosisList";

interface Props {
  makeName: string;
  modelName: string;
}

export default function VehicleDiagnosisListAsync({ makeName, modelName }: Props) {
  const [diagnoses, setDiagnoses] = useState<DiagnosisItem[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(
          `/api/vehicle-diagnoses?make=${encodeURIComponent(makeName)}&model=${encodeURIComponent(modelName)}`
        );
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        if (!cancelled) setDiagnoses(data.diagnoses ?? []);
      } catch {
        if (!cancelled) setError(true);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [makeName, modelName]);

  if (error) return <p className="text-sm text-text-muted text-center py-8">Failed to load diagnoses.</p>;
  if (!diagnoses) {
    return (
      <div className="bg-surface-1 rounded-2xl border border-surface-border p-6 mb-4 animate-pulse">
        <div className="h-6 w-48 rounded bg-surface-2 mb-4" />
        <div className="h-4 w-64 rounded bg-surface-2 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-11 rounded-lg bg-surface-2" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <VehicleDiagnosisList
      diagnoses={diagnoses}
      makeName={makeName}
      modelName={modelName}
    />
  );
}
