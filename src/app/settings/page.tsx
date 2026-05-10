"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AvatarUploader from "@/components/AvatarUploader";
import VehicleSelector from "@/components/VehicleSelector";
import type { VehicleSelectedInfo } from "@/components/VehicleSelector";
import {
  getSessionUser,
  onAuthChange,
  fetchProfile,
  updateUsername,
  updateBio,
  updateAvatarUrl,
  fetchUserVehicles,
  addUserVehicle,
  removeUserVehicle,
  setPrimaryVehicle,
} from "@/lib/data/browser";

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

function saveStoredVehicle(info: VehicleSelectedInfo) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(info));
  } catch {
    // ignore
  }
}

function clearStoredVehicle() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [profile, setProfile] = useState<{
    id: string;
    username: string;
    avatar_url?: string | null;
    bio?: string | null;
    created_at: string;
  } | null>(null);
  const [newUsername, setNewUsername] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [savingBio, setSavingBio] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [bioMessage, setBioMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // Vehicle garage state (logged-in)
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [garageLoading, setGarageLoading] = useState(false);
  const [showVehicleSelector, setShowVehicleSelector] = useState(false);
  const [vehicleYear, setVehicleYear] = useState(new Date().getFullYear());
  const [vehicleNickname, setVehicleNickname] = useState("");
  const [selectedEngineId, setSelectedEngineId] = useState<string>("");
  const [addingVehicle, setAddingVehicle] = useState(false);
  const [addedVehicleName, setAddedVehicleName] = useState<string | null>(null);

  // Anonymous garage state
  const [anonVehicle, setAnonVehicle] = useState<VehicleSelectedInfo | null>(null);
  const [anonSelectorOpen, setAnonSelectorOpen] = useState(false);

  useEffect(() => {
    getSessionUser().then((u) => {
      setUser(u);
      setAuthLoading(false);
      if (u) {
        Promise.all([
          fetchProfile(u.id).then((p) => {
            setProfile(p);
            if (p) {
              setNewUsername(p.username);
              setBio(p.bio ?? "");
            }
          }),
          fetchUserVehicles(u.id).then((v) => setVehicles(v ?? [])),
        ]).finally(() => setLoading(false));
      } else {
        // Anonymous: load from localStorage
        setAnonVehicle(getStoredVehicle());
        setLoading(false);
      }
    });
    const sub = onAuthChange((u) => {
      setUser(u);
      if (u) {
        Promise.all([
          fetchProfile(u.id).then((p) => {
            setProfile(p);
            if (p) {
              setNewUsername(p.username);
              setBio(p.bio ?? "");
            }
          }),
          fetchUserVehicles(u.id).then((v) => setVehicles(v ?? [])),
        ]);
      } else {
        setProfile(null);
        setVehicles([]);
        setAnonVehicle(getStoredVehicle());
      }
    });
    return () => sub.unsubscribe();
  }, [router]);

  const handleUpdateUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newUsername.trim();
    if (!trimmed) {
      setMessage({ type: "error", text: "Username cannot be empty." });
      return;
    }
    if (trimmed === profile?.username) {
      setMessage({ type: "error", text: "Username is already unchanged." });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      await updateUsername(trimmed);
      setProfile((prev) => (prev ? { ...prev, username: trimmed } : prev));
      setMessage({ type: "success", text: "Username updated." });
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err?.message ?? "Failed to update username.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateBio = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = bio.trim();
    if (trimmed === (profile?.bio ?? "")) {
      setBioMessage({ type: "error", text: "Bio is already unchanged." });
      return;
    }
    setSavingBio(true);
    setBioMessage(null);
    try {
      await updateBio(trimmed);
      setProfile((prev) => (prev ? { ...prev, bio: trimmed } : prev));
      setBioMessage({ type: "success", text: "Bio updated." });
    } catch (err: any) {
      setBioMessage({
        type: "error",
        text: err?.message ?? "Failed to update bio.",
      });
    } finally {
      setSavingBio(false);
    }
  };

  const handleAvatarChange = async (url: string) => {
    await updateAvatarUrl(url);
    setProfile((prev) => (prev ? { ...prev, avatar_url: url } : prev));
  };

  // ── Logged-in garage handlers ──────────────────────────────

  const handleAddVehicle = async () => {
    if (!user || !selectedEngineId) return;
    setAddingVehicle(true);
    try {
      await addUserVehicle(
        user.id,
        selectedEngineId,
        vehicleYear,
        vehicleNickname.trim() || null,
      );
      const updated = (await fetchUserVehicles(user.id)) ?? [];
      setVehicles(updated);
      setShowVehicleSelector(false);
      setSelectedEngineId("");
      setVehicleNickname("");
      setVehicleYear(new Date().getFullYear());

      const added = updated.find((v) => v.engine_id === selectedEngineId);
      if (added) {
        const eng = added.vehicle_engines;
        const gen = eng?.vehicle_generations;
        const model = gen?.vehicle_models;
        const make = model?.vehicle_makes;
        const parts = [make?.name as string, model?.name as string].filter(Boolean);
        if (added.year) parts.push(`(${added.year})`);
        const name = parts.join(" ") || eng?.name || eng?.code || "your vehicle";
        setAddedVehicleName(name);
      }
    } catch {
      // silently fail
    } finally {
      setAddingVehicle(false);
    }
  };

  const handleRemoveVehicle = async (vehicleId: string) => {
    if (!user) return;
    await removeUserVehicle(vehicleId, user.id);
    setVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
  };

  const handleSetPrimary = async (vehicleId: string) => {
    if (!user) return;
    await setPrimaryVehicle(vehicleId, user.id);
    setVehicles((prev) =>
      prev.map((v) => ({
        ...v,
        is_primary: v.id === vehicleId,
      }))
    );
  };

  // ── Anonymous garage handlers ──────────────────────────────

  const handleAnonVehicleSelected = (info: VehicleSelectedInfo) => {
    saveStoredVehicle(info);
    setAnonVehicle(info);
    setAnonSelectorOpen(false);
  };

  const handleRemoveAnonVehicle = () => {
    clearStoredVehicle();
    setAnonVehicle(null);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-surface-0 flex flex-col">
        <Navbar />
        <main id="main-content" className="flex-1 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-surface-border border-t-primary rounded-full animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  // ── Anonymous view ──────────────────────────────────────────
  if (!user) {
    return (
      <div className="min-h-screen bg-surface-0 flex flex-col">
        <Navbar />

        <main id="main-content" className="flex-1 max-w-2xl mx-auto px-5 py-10 w-full">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-text-primary font-heading">
              My Garage
            </h1>
            <p className="text-sm text-text-muted mt-1">
              Save your vehicle to personalize your AutOwner experience.
            </p>
          </div>

          {/* Sign in to save banner */}
          <div className="mb-6 p-4 bg-amber-400/5 border border-amber-400/20 rounded-xl flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-400/15 flex items-center justify-center shrink-0 mt-0.5">
              <svg
                className="w-5 h-5 text-amber-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-amber-400 font-heading mb-0.5">
                Sign in to save your vehicles permanently
              </p>
              <p className="text-xs text-amber-400/70 mb-3">
                Your vehicle is currently saved in this browser only. Sign in to
                keep it across devices and unlock personalized features.
              </p>
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="px-4 py-1.5 bg-amber-400 text-black text-xs font-bold rounded-lg hover:bg-amber-300 transition-colors font-heading"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-1.5 text-xs font-semibold text-amber-400 border border-amber-400/20 rounded-lg hover:bg-amber-400/10 transition-colors font-heading"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </div>

          {/* Anonymous garage: show stored vehicle or selector */}
          <div className="bg-surface-1 border border-surface-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-text-muted font-heading">
                Your Vehicle
              </h2>
              {anonVehicle && !anonSelectorOpen && (
                <button
                  type="button"
                  onClick={() => setAnonSelectorOpen(true)}
                  className="px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-glow transition-colors font-heading shadow-sm shadow-primary/20"
                >
                  Change
                </button>
              )}
            </div>

            {anonSelectorOpen ? (
              <div className="space-y-2">
                <VehicleSelector
                  onChange={() => {}}
                  onVehicleSelected={handleAnonVehicleSelected}
                  saveToLocalStorage
                />
                <button
                  type="button"
                  onClick={() => setAnonSelectorOpen(false)}
                  className="w-full text-xs text-text-muted hover:text-text-secondary transition-colors font-medium py-1"
                >
                  Cancel
                </button>
              </div>
            ) : anonVehicle ? (
              <div className="flex items-center gap-3 bg-surface-2 rounded-xl p-3 border border-surface-border">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <svg
                    className="w-4.5 h-4.5 text-primary"
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
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary font-heading truncate">
                    {anonVehicle.makeName} {anonVehicle.modelName}
                  </p>
                  <p className="text-xs text-text-muted truncate mt-0.5">
                    {anonVehicle.generationName} ({anonVehicle.yearStart}&ndash;
                    {anonVehicle.yearEnd ?? "Pres"}) &middot;{" "}
                    {anonVehicle.engineCode} {anonVehicle.engineName}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveAnonVehicle}
                  className="px-2 py-1 text-[10px] font-semibold rounded-md text-text-muted hover:text-red-400 hover:bg-red-500/5 transition-colors font-heading shrink-0"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-text-muted mb-3">
                  No vehicle selected yet. Choose your car to get started.
                </p>
                <button
                  type="button"
                  onClick={() => setAnonSelectorOpen(true)}
                  className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-glow hover:-translate-y-px transition-all duration-150 font-heading shadow-sm shadow-primary/20"
                >
                  Choose your car
                </button>
              </div>
            )}
          </div>

          {/* See content button when vehicle is selected */}
          {anonVehicle && (
            <div className="mt-4 text-center">
              <Link
                href={`/?my_vehicle=1&engine_id=${anonVehicle.engineId}`}
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
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
                See related content
              </Link>
            </div>
          )}
        </main>

        <Footer />
      </div>
    );
  }

  // ── Logged-in view (existing behavior) ──────────────────────

  const joinDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown";

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <Navbar />

      <main id="main-content" className="flex-1 max-w-2xl mx-auto px-5 py-10 w-full">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text-primary font-heading">
            Settings
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Manage your account details.
          </p>
        </div>

        {/* Avatar upload section */}
        <div className="bg-surface-1 border border-surface-border rounded-2xl p-6 mb-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-4 font-heading">
            Avatar
          </h2>

          <AvatarUploader
            currentAvatarUrl={profile?.avatar_url}
            username={profile?.username ?? "?"}
            onAvatarChange={handleAvatarChange}
          />
        </div>

        {/* Profile card */}
        <div className="bg-surface-1 border border-surface-border rounded-2xl p-6 mb-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-4 font-heading">
            Profile
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-muted">Email</span>
              <span className="text-sm text-text-primary font-medium">
                {user?.email ?? "—"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-text-muted">Username</span>
              <span className="text-sm text-text-primary font-medium">
                {profile?.username ?? "—"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-text-muted">Member since</span>
              <span className="text-sm text-text-primary font-medium">
                {joinDate}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-text-muted">User ID</span>
              <span className="text-xs text-text-muted font-mono">
                {user?.id?.slice(0, 12) ?? "—"}…
              </span>
            </div>
          </div>
        </div>

        {/* Update username form */}
        <div className="bg-surface-1 border border-surface-border rounded-2xl p-6 mb-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-4 font-heading">
            Update Display Name
          </h2>

          {message && (
            <div
              className={`mb-4 p-3 rounded-xl text-sm font-medium ${
                message.type === "success"
                  ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                  : "bg-red-500/10 border border-red-500/20 text-red-400"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleUpdateUsername} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5 font-heading"
              >
                Display Name
              </label>
              <input
                id="username"
                type="text"
                value={newUsername}
                onChange={(e) => {
                  setNewUsername(e.target.value);
                  setMessage(null);
                }}
                required
                minLength={2}
                maxLength={32}
                placeholder="Enter your display name"
                className="w-full px-4 py-2.5 bg-surface-2 text-text-primary text-sm rounded-xl border border-surface-border focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-all placeholder:text-text-muted"
              />
              <p className="text-xs text-text-muted mt-1.5">
                This is the name shown to the community on your posts and
                comments. 2–32 characters.
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-glow hover:-translate-y-px transition-all duration-150 disabled:opacity-50 disabled:hover:translate-y-0 font-heading shadow-sm shadow-primary/20"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </form>
        </div>

        {/* Bio form */}
        <div className="bg-surface-1 border border-surface-border rounded-2xl p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-4 font-heading">
            Bio
          </h2>

          {bioMessage && (
            <div
              className={`mb-4 p-3 rounded-xl text-sm font-medium ${
                bioMessage.type === "success"
                  ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                  : "bg-red-500/10 border border-red-500/20 text-red-400"
              }`}
            >
              {bioMessage.text}
            </div>
          )}

          <form onSubmit={handleUpdateBio} className="space-y-4">
            <div>
              <label
                htmlFor="bio"
                className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5 font-heading"
              >
                About You
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => {
                  setBio(e.target.value);
                  setBioMessage(null);
                }}
                rows={4}
                maxLength={500}
                placeholder="Tell the community a little about yourself..."
                className="w-full px-4 py-2.5 bg-surface-2 text-text-primary text-sm rounded-xl border border-surface-border focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-all placeholder:text-text-muted resize-none"
              />
              <p className="text-xs text-text-muted mt-1.5">
                {bio.length}/500 characters. Shown on your public profile.
              </p>
            </div>

            <button
              type="submit"
              disabled={savingBio}
              className="px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-glow hover:-translate-y-px transition-all duration-150 disabled:opacity-50 disabled:hover:translate-y-0 font-heading shadow-sm shadow-primary/20"
            >
              {savingBio ? "Saving…" : "Save Bio"}
            </button>
          </form>
        </div>

        {/* My Garage */}
        <div className="bg-surface-1 border border-surface-border rounded-2xl p-6 mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-text-muted font-heading">
              My Garage
            </h2>
            <button
              type="button"
              onClick={() => setShowVehicleSelector(!showVehicleSelector)}
              className="px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-glow transition-colors font-heading shadow-sm shadow-primary/20"
            >
              {showVehicleSelector ? "Cancel" : "Add Vehicle"}
            </button>
          </div>

          {/* Success banner after adding vehicle */}
          {addedVehicleName && (
            <div className="mb-4 p-4 bg-emerald-500/5 border border-emerald-400/20 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-400/15 flex items-center justify-center shrink-0 mt-0.5">
                  <svg
                    className="w-5 h-5 text-emerald-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                    <path d="M22 4L12 14.01l-3-3" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-emerald-400 font-heading mb-0.5">
                    Added to Your Garage
                  </p>
                  <p className="text-sm text-emerald-300/80 leading-relaxed">
                    Your {addedVehicleName} has been added to your garage!
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      type="button"
                      onClick={() => router.push("/?my_vehicle=1")}
                      className="px-4 py-2 bg-emerald-500/15 text-emerald-400 text-xs font-bold rounded-lg hover:bg-emerald-500/25 transition-colors font-heading border border-emerald-400/20"
                    >
                      See related content
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddedVehicleName(null)}
                      className="px-4 py-2 text-xs font-medium text-text-muted hover:text-text-secondary transition-colors font-heading"
                    >
                      Continue editing
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Vehicle list */}
          {vehicles.length === 0 && !showVehicleSelector && (
            <p className="text-sm text-text-muted py-4 text-center">
              No vehicles in your garage yet. Add your first car to connect with
              specific models and engines.
            </p>
          )}

          <div className="space-y-2.5">
            {vehicles.map((v) => {
              const eng = v.vehicle_engines;
              const gen = eng?.vehicle_generations;
              const model = gen?.vehicle_models;
              const make = model?.vehicle_makes;
              return (
                <div
                  key={v.id}
                  className="flex items-center gap-3 bg-surface-2 rounded-xl p-3 border border-surface-border"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <svg
                      className="w-4.5 h-4.5 text-primary"
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
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-text-primary font-heading truncate">
                        {make?.name ?? "Unknown make"}{" "}
                        {model?.name ?? "Unknown model"}
                      </p>
                      {v.is_primary && (
                        <span className="shrink-0 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-primary/10 text-primary border border-primary/20 font-heading">
                          Primary
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-text-muted truncate mt-0.5">
                      {gen?.name ?? ""} ({gen?.year_start}&ndash;
                      {gen?.year_end ?? "Pres"}) &middot; {eng?.code ?? ""}{" "}
                      {eng?.name ?? ""}
                      {v.year && ` · ${v.year}`}
                      {v.nickname && ` · "${v.nickname}"`}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {!v.is_primary && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(v.id)}
                        className="px-2 py-1 text-[10px] font-semibold rounded-md text-text-muted hover:text-primary hover:bg-primary/5 transition-colors font-heading"
                        title="Set as primary vehicle"
                      >
                        Primary
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveVehicle(v.id)}
                      className="px-2 py-1 text-[10px] font-semibold rounded-md text-text-muted hover:text-red-400 hover:bg-red-500/5 transition-colors font-heading"
                      title="Remove vehicle"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add vehicle form */}
          {showVehicleSelector && (
            <div className="mt-4 space-y-3">
              <div className="border-t border-surface-border pt-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5 font-heading">
                  Select Vehicle
                </label>
                <VehicleSelector
                  onChange={(engineId) => setSelectedEngineId(engineId)}
                />
              </div>

              {selectedEngineId && (
                <div className="space-y-3 pt-2">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-text-secondary font-heading mb-1">
                        Year
                      </label>
                      <input
                        type="number"
                        value={vehicleYear}
                        onChange={(e) =>
                          setVehicleYear(Number(e.target.value))
                        }
                        min={1950}
                        max={2030}
                        className="w-full px-3 py-2 bg-surface-0 text-text-primary text-sm rounded-lg border border-surface-border focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-all"
                      />
                    </div>
                    <div className="flex-[2]">
                      <label className="block text-xs font-semibold text-text-secondary font-heading mb-1">
                        Nickname{" "}
                        <span className="font-normal text-text-muted">
                          (optional)
                        </span>
                      </label>
                      <input
                        type="text"
                        value={vehicleNickname}
                        onChange={(e) => setVehicleNickname(e.target.value)}
                        placeholder="e.g. My daily driver"
                        maxLength={32}
                        className="w-full px-3 py-2 bg-surface-0 text-text-primary text-sm rounded-lg border border-surface-border focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-all placeholder:text-text-muted"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddVehicle}
                    disabled={addingVehicle}
                    className="w-full px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-glow hover:-translate-y-px transition-all duration-150 disabled:opacity-50 disabled:hover:translate-y-0 font-heading shadow-sm shadow-primary/20"
                  >
                    {addingVehicle ? "Adding..." : "Add to Garage"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
