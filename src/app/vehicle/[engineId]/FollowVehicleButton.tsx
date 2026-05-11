"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  fetchUserVehicles,
  addUserVehicle,
} from "@/lib/data/browser";

const STORAGE_KEY = "autowner_followed_vehicles";

function getFollowedVehicles(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveFollowedVehicles(ids: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // localStorage may be unavailable
  }
}

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (userId) {
      // Logged in: check database
      fetchUserVehicles(userId)
        .then((vehicles) => {
          const exists = vehicles?.some(
            (v: { engine_id: string }) => v.engine_id === engineId,
          );
          setHasVehicle(!!exists);
        })
        .finally(() => setLoading(false));
    } else {
      // Anonymous: check localStorage
      const followed = getFollowedVehicles();
      setHasVehicle(followed.includes(engineId));
      setLoading(false);
    }
  }, [userId, engineId]);

  const handleFollow = async () => {
    if (userId) {
      // Logged in: add to database
      setAdding(true);
      try {
        await addUserVehicle(userId, engineId, new Date().getFullYear());
        setHasVehicle(true);
      } catch {
        // silently fail
      } finally {
        setAdding(false);
      }
    } else {
      // Anonymous: save to localStorage
      const followed = getFollowedVehicles();
      if (!followed.includes(engineId)) {
        followed.push(engineId);
        saveFollowedVehicles(followed);
      }
      setHasVehicle(true);
    }
  };

  const handleUnfollow = () => {
    if (userId) {
      // For logged-in users, unfollow would need to remove from user_vehicles
      // For now, the DB-backed version shows "In Your Garage" as a permanent state
      return;
    }
    // Anonymous: remove from localStorage
    const followed = getFollowedVehicles().filter((id) => id !== engineId);
    saveFollowedVehicles(followed);
    setHasVehicle(false);
    router.refresh();
  };

  if (!mounted || loading) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface-2 rounded-lg border border-surface-border">
        <div className="w-3.5 h-3.5 border-2 border-surface-border border-t-primary rounded-full animate-spin" />
        <span className="text-xs text-text-muted font-heading">Loading...</span>
      </div>
    );
  }

  // Already following (DB or localStorage)
  if (hasVehicle) {
    return (
      <button
        type="button"
        onClick={userId ? undefined : handleUnfollow}
        title="Get notified when new content is posted about this vehicle"
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold font-heading transition-colors ${
          userId
            ? "bg-emerald-600/10 dark:bg-emerald-500/10 border border-emerald-600/20 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 cursor-default"
            : "bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 cursor-pointer"
        }`}
      >
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill={userId ? "none" : "currentColor"}
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {userId ? (
            <polyline points="20 6 9 17 4 12" />
          ) : (
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
          )}
        </svg>
        {userId ? "In Your Garage" : "Following"}
      </button>
    );
  }

  // Not following
  return (
    <button
      type="button"
      onClick={handleFollow}
      disabled={adding}
      title="Get notified when new content is posted about this vehicle"
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
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <line x1="12" y1="3" x2="12" y2="8" />
      </svg>
      {adding ? "Adding..." : userId ? "Add to My Garage" : "Follow this car"}
    </button>
  );
}
