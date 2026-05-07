"use client";

import { useState, type FormEvent } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");

    // Simulate a brief loading state, then show success toast.
    // No backend call — this is a UI-only placeholder.
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 600);
  };

  return (
    <div className="mb-10 pb-10 border-b border-surface-border">
      <div className="flex flex-col items-center text-center gap-4">
        <div>
          <h3 className="text-lg font-bold text-text-primary font-heading">
            Stay in the know
          </h3>
          <p className="text-sm text-text-muted mt-1">
            Get the best car guides, reviews, and community picks delivered to
            your inbox.
          </p>
        </div>

        {status === "success" ? (
          <div
            role="alert"
            className="w-full max-w-md px-4 py-3 rounded-lg bg-teal-400/10 border border-teal-400/20 text-teal-400 text-sm font-medium text-center"
          >
            Thanks for subscribing!
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex w-full max-w-md gap-2"
          >
            <input
              type="email"
              required
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 min-w-0 px-4 py-2.5 bg-surface-2 border border-surface-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors duration-150"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="shrink-0 px-5 py-2.5 bg-primary hover:bg-primary-dark disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors duration-150 font-heading"
            >
              {status === "loading" ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
