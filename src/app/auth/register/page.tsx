"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/data/browser";
import Link from "next/link";

const STORAGE_KEY = "autowner_my_vehicle";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const result = await signUp(email, password, username);

    if (result.error) {
      setError(result.error.message);
      setLoading(false);
      return;
    }

    // Check localStorage for anonymous vehicle selection
    let storedEngineId: string | null = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        storedEngineId = parsed?.engineId || null;
      }
    } catch {
      // ignore
    }

    setLoading(false);

    if (result.data?.session) {
      // User is signed in immediately (email confirmation disabled or auto-confirm)
      if (storedEngineId) {
        router.push(`/?my_vehicle=1&engine_id=${storedEngineId}`);
      } else {
        router.push("/?welcome=1");
      }
    } else {
      // Email confirmation required
      if (storedEngineId) {
        setMessage("Check your email for a confirmation link. We'll redirect you to your personalized feed once confirmed.");
      } else {
        setMessage("Check your email for a confirmation link.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-surface-0 flex items-center justify-center px-4 relative">
      <Link href="/" className="absolute top-6 left-6 text-display text-lg text-text-primary hover:text-primary transition-colors">
        AUTO<span className="text-primary">WNER</span>
      </Link>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text-primary font-heading">Join the garage</h1>
          <p className="text-sm text-text-muted mt-1.5">Create your AutOwner account</p>
        </div>
        {error && <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium">{error}</div>}
        {message && <div className="mb-5 p-3.5 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm font-medium">{message}</div>}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5 font-heading">Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full px-4 py-2.5 bg-surface-2 text-text-primary text-sm rounded-xl border border-surface-border focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-all placeholder:text-text-muted" placeholder="gearhead99" required minLength={3} />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5 font-heading">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2.5 bg-surface-2 text-text-primary text-sm rounded-xl border border-surface-border focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-all placeholder:text-text-muted" placeholder="you@example.com" required />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5 font-heading">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2.5 bg-surface-2 text-text-primary text-sm rounded-xl border border-surface-border focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-all placeholder:text-text-muted" placeholder="Min. 6 characters" required minLength={6} />
          </div>
          <button type="submit" disabled={loading} className="w-full py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-glow hover:-translate-y-px transition-all duration-150 disabled:opacity-50 disabled:hover:translate-y-0 font-heading shadow-sm shadow-primary/20">
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>
        <p className="mt-6 text-sm text-text-muted text-center">
          Already registered? <Link href="/auth/login" className="text-primary hover:text-primary-glow font-semibold transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
