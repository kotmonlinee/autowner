"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const STORAGE_KEY = "cookie-consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // Delay slightly so the slide-up animation triggers after mount
      requestAnimationFrame(() => {
        setVisible(true);
        requestAnimationFrame(() => setAnimate(true));
      });
    }
  }, []);

  const accept = (choice: "all" | "essential") => {
    localStorage.setItem(STORAGE_KEY, choice);
    setAnimate(false);
    // Wait for slide-down animation before removing from DOM
    setTimeout(() => setVisible(false), 300);
  };

  if (!visible) return null;

  return (
    <div
      role="alertdialog"
      aria-label="Cookie consent"
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-out ${
        animate ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="bg-surface-1 border-t border-surface-border px-5 py-4 shadow-[0_-4px_24px_rgba(0,0,0,0.4)]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <p className="text-sm text-text-secondary leading-relaxed flex-1">
            This site uses cookies for authentication and analytics. By continuing, you agree to our{" "}
            <Link
              href="/privacy"
              className="text-primary hover:text-primary-glow underline underline-offset-2 transition-colors"
            >
              Privacy Policy
            </Link>
            .
          </p>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => accept("essential")}
              aria-label="Accept only essential cookies"
              className="px-4 py-2 text-sm font-medium text-text-secondary border border-surface-border rounded-lg hover:border-surface-4 hover:text-text-primary transition-all font-heading"
            >
              Essential Only
            </button>
            <button
              onClick={() => accept("all")}
              aria-label="Accept all cookies"
              className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary-glow hover:-translate-y-px transition-all duration-150 font-heading shadow-sm shadow-primary/20"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
