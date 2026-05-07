"use client";

import { useEffect, useState } from "react";
import { type Theme, getStoredTheme, getSystemTheme, setStoredTheme } from "@/lib/theme";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initial = getStoredTheme();
    setTheme(initial);
    applyTheme(initial);
    setMounted(true);

    // Listen for system theme changes
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const handler = (e: MediaQueryListEvent) => {
      // Only react to system changes if user hasn't set a stored preference
      if (!localStorage.getItem("theme")) {
        const newTheme = e.matches ? "light" : "dark";
        setTheme(newTheme);
        applyTheme(newTheme);
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
    setStoredTheme(next);
  };

  // Avoid hydration mismatch by rendering a placeholder until mounted
  if (!mounted) {
    return (
      <button
        className="p-1.5 rounded-lg text-text-muted hover:bg-surface-2 transition-colors"
        title="Toggle theme"
        aria-label="Toggle theme"
      >
        <span className="w-4.5 h-4.5 block" />
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      className="p-1.5 rounded-lg text-text-muted hover:text-text-secondary hover:bg-surface-2 transition-colors"
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}

function applyTheme(theme: Theme) {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

function SunIcon() {
  return (
    <svg
      className="w-4.5 h-4.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      className="w-4.5 h-4.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
