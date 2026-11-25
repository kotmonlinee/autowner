"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/data/browser";
import { syncOnLogin } from "@/lib/sync";
import Link from "next/link";
import AuthBrand from "@/components/auth/AuthBrand";

const STORAGE_KEY = "autowner_my_vehicle";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    const result = await signUp(email, password, username);

    if (result.error) {
      setError(result.error.message);
      setLoading(false);
      return;
    }

    // Sync any anonymous data (bookmarks, vehicle) to the new account
    await syncOnLogin();

    // Check localStorage for anonymous vehicle selection
    let storedEngineId: string | null = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        storedEngineId = parsed?.engineId || null;
      }
    } catch { /* ignore */ }

    if (storedEngineId) {
      router.push(`/?my_vehicle=1&engine_id=${storedEngineId}`);
    } else {
      router.push("/?welcome=1");
    }
  };

  return (
    <div className="min-h-screen bg-surface-0 flex items-center justify-center px-4 relative">
      <div className="absolute left-6 top-6"><AuthBrand /></div>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-semibold tracking-[-0.03em] text-text-primary">Join the garage</h1>
          <p className="text-sm text-text-muted mt-1.5">Create your AutOwner account</p>
          <p className="text-xs text-text-muted mt-3">AI diagnosis, repair estimates, OBD lookup — free.</p>
        </div>
        {error && <div className="mb-5 p-3.5 bg-severity-critical-bg border border-severity-critical-border rounded-xl text-severity-critical text-sm font-medium">{error}</div>}
        <form onSubmit={handleRegister} className="space-y-4 border border-surface-border border-l-4 border-l-primary bg-surface-1 p-5 sm:p-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5 font-heading">Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} autoComplete="username" className="w-full px-4 py-2.5 bg-surface-2 text-text-primary text-sm rounded-xl border border-surface-border focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-all placeholder:text-text-muted" placeholder="gearhead99" required minLength={3} />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5 font-heading">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" className="w-full px-4 py-2.5 bg-surface-2 text-text-primary text-sm rounded-xl border border-surface-border focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-all placeholder:text-text-muted" placeholder="you@example.com" required />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5 font-heading">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" className="w-full px-4 py-2.5 bg-surface-2 text-text-primary text-sm rounded-xl border border-surface-border focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-all placeholder:text-text-muted" placeholder="Min. 6 characters" required minLength={6} />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5 font-heading">Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} autoComplete="new-password" className="w-full px-4 py-2.5 bg-surface-2 text-text-primary text-sm rounded-xl border border-surface-border focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-all placeholder:text-text-muted" placeholder="Re-enter your password" required minLength={6} />
          </div>
          <button type="submit" disabled={loading} className="w-full py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-glow hover:-translate-y-px transition-all duration-150 disabled:opacity-50 disabled:hover:translate-y-0 font-heading shadow-sm shadow-primary/20">
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>
        <p className="mt-6 text-sm text-text-muted text-center">
          Already registered? <Link prefetch={false} href="/auth/login" className="text-primary hover:text-primary-glow font-semibold transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
