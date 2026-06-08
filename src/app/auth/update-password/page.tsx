"use client";

import { useState, useEffect } from "react";
import { updatePassword, getBrowserSupabase } from "@/lib/data/browser";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
        <Link href="/" className="absolute top-6 left-6" aria-label="AutOwner">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 80" width="168" height="32" className="h-[32px] w-auto">
            <defs>
              <linearGradient id="auth-logo-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#2563eb"/>
                <stop offset="100%" stopColor="#60a5fa"/>
              </linearGradient>
            </defs>
            <g transform="translate(14, 12) scale(2.333)">
              <path fill="none" stroke="url(#auth-logo-grad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z"/>
            </g>
            <text x="76" y="54" fontFamily="'Russo One','Arial Black',sans-serif" fontSize="40" fill="var(--color-text-primary)">
              AUT<tspan fill="url(#auth-logo-grad)">O</tspan>WNER
            </text>
          </svg>
        </Link>
        <div className="w-full max-w-sm text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-severity-critical-bg rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8 text-severity-critical" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-text-primary font-heading mb-2">
            Invalid or expired link
          </h1>
          <p className="text-sm text-text-muted mb-6">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <Link
            href="/auth/reset-password"
            className="inline-block px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-glow transition-all font-heading"
          >
            Request new reset link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-0 flex items-center justify-center px-4 relative">
      <Link href="/" className="absolute top-6 left-6" aria-label="AutOwner">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 80" width="168" height="32" className="h-[32px] w-auto">
          <defs>
            <linearGradient id="auth-logo-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2563eb"/>
              <stop offset="100%" stopColor="#60a5fa"/>
            </linearGradient>
          </defs>
          <g transform="translate(14, 12) scale(2.333)">
            <path fill="none" stroke="url(#auth-logo-grad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z"/>
          </g>
          <text x="76" y="54" fontFamily="'Russo One','Arial Black',sans-serif" fontSize="40" fill="var(--color-text-primary)">
            AUT<tspan fill="url(#auth-logo-grad)">O</tspan>WNER
          </text>
        </svg>
      </Link>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text-primary font-heading">
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

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5 font-heading">
              New password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className="w-full px-4 py-2.5 bg-surface-2 text-text-primary text-sm rounded-xl border border-surface-border focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-all placeholder:text-text-muted"
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
              className="w-full px-4 py-2.5 bg-surface-2 text-text-primary text-sm rounded-xl border border-surface-border focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-all placeholder:text-text-muted"
              placeholder="Re-enter your password"
              required
              minLength={6}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-glow hover:-translate-y-px transition-all duration-150 disabled:opacity-50 disabled:hover:translate-y-0 font-heading shadow-sm shadow-primary/20"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>

        <p className="mt-6 text-sm text-text-muted text-center">
          <Link
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
