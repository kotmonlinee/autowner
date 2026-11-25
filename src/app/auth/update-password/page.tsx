"use client";

import { useState, useEffect } from "react";
import { updatePassword, getBrowserSupabase } from "@/lib/data/browser";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthBrand from "@/components/auth/AuthBrand";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getBrowserSupabase()
      .auth.getSession()
      .then(({ data }) => {
        setHasSession(!!data.session);
        setCheckingSession(false);
      });
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    const { error } = await updatePassword(password);
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/auth/login?reset=success");
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-surface-0 flex items-center justify-center px-4">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!hasSession) {
    return (
      <div className="min-h-screen bg-surface-0 flex items-center justify-center px-4 relative">
        <div className="absolute left-6 top-6"><AuthBrand /></div>
        <div className="w-full max-w-sm text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-severity-critical-bg rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8 text-severity-critical" fill="none" stroke="currentColor" viewBox="0 0 24 24" width={32} height={32}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-[-0.03em] text-text-primary mb-2">
            Invalid or expired link
          </h1>
          <p className="text-sm text-text-muted mb-6">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <Link prefetch={false}
            href="/auth/reset-password"
            className="inline-block bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary-dark font-heading"
          >
            Request new reset link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-0 flex items-center justify-center px-4 relative">
      <div className="absolute left-6 top-6"><AuthBrand /></div>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-semibold tracking-[-0.03em] text-text-primary">
            Set new password
          </h1>
          <p className="text-sm text-text-muted mt-1.5">
            Choose a new password for your account
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-severity-critical-bg border border-severity-critical-border rounded-xl text-severity-critical text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-4 border border-surface-border border-l-4 border-l-primary bg-surface-1 p-5 sm:p-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5 font-heading">
              New password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className="w-full border border-surface-border bg-surface-0 px-4 py-2.5 text-sm text-text-primary transition-colors placeholder:text-text-muted focus:border-primary focus:outline-none"
              placeholder="Min. 6 characters"
              required
              minLength={6}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5 font-heading">
              Confirm password
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full border border-surface-border bg-surface-0 px-4 py-2.5 text-sm text-text-primary transition-colors placeholder:text-text-muted focus:border-primary focus:outline-none"
              placeholder="Re-enter your password"
              required
              minLength={6}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-dark disabled:opacity-50 font-heading"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>

        <p className="mt-6 text-sm text-text-muted text-center">
          <Link prefetch={false}
            href="/auth/login"
            className="text-primary hover:text-primary-glow font-semibold transition-colors"
          >
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
