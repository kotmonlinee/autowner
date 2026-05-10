"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  fetchUserVehicles,
  addUserVehicle,
} from "@/lib/data/browser";

interface FollowVehicleButtonProps {
  engineId: string;
  userId: string | null;
}

export function FollowVehicleButton({
  engineId,
  userId,
}: FollowVehicleButtonProps) {
  const router = useRouter();
  const [hasVehicle, setHasVehicle] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    fetchUserVehicles(userId)
      .then((vehicles) => {
        const exists = vehicles?.some(
          (v: { engine_id: string }) => v.engine_id === engineId,
        );
        setHasVehicle(!!exists);
      })
      .finally(() => setLoading(false));
  }, [userId, engineId]);

  const handleAddToGarage = async () => {
    if (!userId) {
      router.push("/auth/login");
      return;
    }
    setAdding(true);
    try {
      await addUserVehicle(userId, engineId, new Date().getFullYear());
      setHasVehicle(true);
    } catch {
      // silently fail
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface-2 rounded-lg border border-surface-border">
        <div className="w-3.5 h-3.5 border-2 border-surface-border border-t-primary rounded-full animate-spin" />
        <span className="text-xs text-text-muted font-heading">Loading...</span>
      </div>
    );
  }

  if (hasVehicle) {
    return (
      <button
        type="button"
        disabled
        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-bold font-heading cursor-default"
      >
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
        In Your Garage
      </button>
    );
  }

  if (!userId) {
    return (
      <button
        type="button"
        onClick={() => router.push("/auth/login")}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-glow hover:-translate-y-px transition-all duration-150 font-heading shadow-sm shadow-primary/20"
      >
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 17h14v2H5zM6 10l3-3 3 3 3-3 3 3v5H3v-5l3-3z" />
          <line x1="12" y1="3" x2="12" y2="10" />
        </svg>
        Login to Add to Garage
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleAddToGarage}
      disabled={adding}
      className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-glow hover:-translate-y-px transition-all duration-150 disabled:opacity-50 disabled:hover:translate-y-0 font-heading shadow-sm shadow-primary/20"
    >
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 17h14v2H5zM6 10l3-3 3 3 3-3 3 3v5H3v-5l3-3z" />
        <line x1="12" y1="3" x2="12" y2="10" />
      </svg>
      {adding ? "Adding..." : "Add to My Garage"}
    </button>
  );
}
