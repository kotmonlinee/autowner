"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AvatarUploader from "@/components/AvatarUploader";
import {
  getSessionUser,
  onAuthChange,
  fetchProfile,
  updateUsername,
  updateBio,
  updateAvatarUrl,
} from "@/lib/data/browser";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
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

  useEffect(() => {
    getSessionUser().then((u) => {
      if (!u) {
        router.replace("/auth/login");
        return;
      }
      setUser(u);
      fetchProfile(u.id).then((p) => {
        setProfile(p);
        if (p) {
          setNewUsername(p.username);
          setBio(p.bio ?? "");
        }
        setLoading(false);
      });
    });
    const sub = onAuthChange((u) => {
      if (!u) router.replace("/auth/login");
      setUser(u);
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

  if (loading) {
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
      </main>

      <Footer />
    </div>
  );
}
