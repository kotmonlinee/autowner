"use client";

import { useState } from "react";
import { resetPasswordForEmail } from "@/lib/data/browser";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const { error } = await resetPasswordForEmail(email);
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setMessage("Check your email for a password reset link");
      setLoading(false);
    }
  };

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
            Reset your password
          </h1>
          <p className="text-sm text-text-muted mt-1.5">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-severity-critical-bg border border-severity-critical-border rounded-xl text-severity-critical text-sm font-medium">
            {error}
          </div>
        )}

        {message ? (
          <div className="p-3.5 bg-severity-info-bg border border-severity-info-border rounded-xl text-severity-info text-sm font-medium text-center">
            {message}
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5 font-heading">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full px-4 py-2.5 bg-surface-2 text-text-primary text-sm rounded-xl border border-surface-border focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-all placeholder:text-text-muted"
                placeholder="you@example.com"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-glow hover:-translate-y-px transition-all duration-150 disabled:opacity-50 disabled:hover:translate-y-0 font-heading shadow-sm shadow-primary/20"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        <p className="mt-6 text-sm text-text-muted text-center">
          Remember your password?{" "}
          <Link
            href="/auth/login"
            className="text-primary hover:text-primary-glow font-semibold transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
