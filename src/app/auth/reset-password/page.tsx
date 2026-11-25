"use client";

import { useState } from "react";
import { resetPasswordForEmail } from "@/lib/data/browser";
import Link from "next/link";
import AuthBrand from "@/components/auth/AuthBrand";

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
      <div className="absolute left-6 top-6"><AuthBrand /></div>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-semibold tracking-[-0.03em] text-text-primary">
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
          <form onSubmit={handleReset} className="space-y-4 border border-surface-border border-l-4 border-l-primary bg-surface-1 p-5 sm:p-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5 font-heading">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full border border-surface-border bg-surface-0 px-4 py-2.5 text-sm text-text-primary transition-colors placeholder:text-text-muted focus:border-primary focus:outline-none"
                placeholder="you@example.com"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-dark disabled:opacity-50 font-heading"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        <p className="mt-6 text-sm text-text-muted text-center">
          Remember your password?{" "}
          <Link prefetch={false}
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
