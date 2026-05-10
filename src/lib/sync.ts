"use client";

import { createClient } from "@/lib/supabase";
import { addUserVehicle, fetchUserVehicles } from "@/lib/data/browser";

const BOOKMARKS_KEY = "autowner_bookmarks";
const MY_VEHICLE_KEY = "autowner_my_vehicle";
const FOLLOWED_VEHICLES_KEY = "autowner_followed_vehicles";

function readJsonFromStorage<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/**
 * Sync anonymous localStorage data (bookmarks, vehicle, followed vehicles)
 * to the logged-in user's account. Called after successful login or registration.
 *
 * Best-effort: if any individual sync fails, that data stays in localStorage
 * for the next login attempt. Only cleared from localStorage on success.
 */
export async function syncOnLogin(): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  // ── 1. Sync bookmarks ──────────────────────────────────────
  const bookmarkIds = readJsonFromStorage<string[]>(BOOKMARKS_KEY);
  if (bookmarkIds && bookmarkIds.length > 0) {
    let allSynced = true;
    for (const postId of bookmarkIds) {
      try {
        await fetch("/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postId }),
        });
      } catch {
        allSynced = false;
      }
    }
    if (allSynced) {
      try {
        localStorage.removeItem(BOOKMARKS_KEY);
      } catch {
        // ignore
      }
    }
  }

  // ── 2. Sync my vehicle ─────────────────────────────────────
  const myVehicle = readJsonFromStorage<{ engineId: string }>(MY_VEHICLE_KEY);
  if (myVehicle?.engineId) {
    try {
      await addUserVehicle(user.id, myVehicle.engineId, new Date().getFullYear());
      try {
        localStorage.removeItem(MY_VEHICLE_KEY);
      } catch {
        // ignore
      }
    } catch {
      // Best-effort: leave in localStorage for next attempt
    }
  }

  // ── 3. Sync followed vehicles ──────────────────────────────
  const followedIds = readJsonFromStorage<string[]>(FOLLOWED_VEHICLES_KEY);
  if (followedIds && followedIds.length > 0) {
    // Fetch existing vehicles to avoid duplicates
    let existingEngineIds: string[] = [];
    try {
      const vehicles = await fetchUserVehicles(user.id);
      existingEngineIds = (vehicles ?? []).map((v: { engine_id: string }) => v.engine_id);
    } catch {
      // If we can't fetch existing vehicles, proceed anyway
    }

    const toSync = followedIds.filter(
      (id) => !existingEngineIds.includes(id),
    );

    let allSynced = true;
    for (const engineId of toSync) {
      try {
        await addUserVehicle(user.id, engineId, new Date().getFullYear());
      } catch {
        allSynced = false;
      }
    }
    if (allSynced) {
      try {
        localStorage.removeItem(FOLLOWED_VEHICLES_KEY);
      } catch {
        // ignore
      }
    }
  }
}
