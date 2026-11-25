"use client";

import { useState } from "react";
import { signIn } from "@/lib/data/browser";
import { syncOnLogin } from "@/lib/sync";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import AuthBrand from "@/components/auth/AuthBrand";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";
  const resetSuccess = searchParams.get("reset") === "success";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await signIn(email, password);
    if (error) { setError(error.message); setLoading(false); }
    else {
      await syncOnLogin();
      router.push(next);
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-surface-0 flex items-center justify-center px-4 relative">
      <div className="absolute left-6 top-6"><AuthBrand /></div>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-semibold tracking-[-0.03em] text-text-primary">Welcome back</h1>
          <p className="text-sm text-text-muted mt-1.5">Sign in to your account</p>
          <p className="text-xs text-text-muted mt-3">AI diagnosis, repair estimates, OBD lookup — free.</p>
        </div>
        {resetSuccess && <div className="mb-5 p-3.5 bg-severity-info-bg border border-severity-info-border rounded-xl text-severity-info text-sm font-medium">Password updated successfully. Sign in with your new password.</div>}
        {error && <div className="mb-5 p-3.5 bg-severity-critical-bg border border-severity-critical-border rounded-xl text-severity-critical text-sm font-medium">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4 border border-surface-border border-l-4 border-l-primary bg-surface-1 p-5 sm:p-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5 font-heading">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" className="w-full border border-surface-border bg-surface-0 px-4 py-2.5 text-sm text-text-primary transition-colors placeholder:text-text-muted focus:border-primary focus:outline-none" placeholder="you@example.com" required />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5 font-heading">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" className="w-full border border-surface-border bg-surface-0 px-4 py-2.5 text-sm text-text-primary transition-colors placeholder:text-text-muted focus:border-primary focus:outline-none" placeholder="••••••••" required />
            <div className="mt-1.5 text-right">
              <Link prefetch={false} href="/auth/reset-password" className="text-xs text-text-muted hover:text-primary transition-colors">Forgot password?</Link>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-primary py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-dark disabled:opacity-50 font-heading">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p className="mt-6 text-sm text-text-muted text-center">
          Don&apos;t have an account? <Link prefetch={false} href="/auth/register" className="text-primary hover:text-primary-glow font-semibold transition-colors">Create one</Link>
        </p>
      </div>
    </div>
  );
}
