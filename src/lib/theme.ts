export type Theme = "dark" | "light";

export function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

export function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  try {
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || stored === "light") return stored;
  } catch {
    // localStorage may be unavailable
  }
  return getSystemTheme();
}

export function setStoredTheme(theme: Theme): void {
  try {
    localStorage.setItem("theme", theme);
  } catch {
    // localStorage may be unavailable
  }
}
