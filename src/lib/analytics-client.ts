// Client-side analytics helper — runs in browser ("use client").
// Generates and persists an anonymous ID in localStorage, then sends events
// to POST /api/events.

const ANONYMOUS_ID_KEY = "autowner_anonymous_id";

function generateUUID(): string {
  // crypto.randomUUID is available in all modern browsers
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for very old browsers
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Generate and store an anonymous ID in localStorage if one does not already
 * exist. Returns the ID.
 *
 * Call this once on app load (e.g. in layout or a root client component).
 */
export function initAnonymousId(): string {
  try {
    let id = localStorage.getItem(ANONYMOUS_ID_KEY);
    if (!id) {
      id = generateUUID();
      localStorage.setItem(ANONYMOUS_ID_KEY, id);
    }
    return id;
  } catch {
    // localStorage may be unavailable (e.g. in incognito with strict settings)
    return generateUUID();
  }
}

/**
 * Get the current anonymous ID without generating a new one.
 * Returns null if not yet initialized.
 */
export function getAnonymousId(): string | null {
  try {
    return localStorage.getItem(ANONYMOUS_ID_KEY);
  } catch {
    return null;
  }
}

/**
 * Track a user event from the browser. Sends a POST to /api/events with the
 * event data and the anonymous ID from localStorage.
 *
 * Fires best-effort — failures are silently ignored.
 */
export function track(
  eventType: string,
  targetType?: string,
  targetId?: string,
  metadata?: Record<string, unknown>,
): void {
  const anonymousId = getAnonymousId() ?? initAnonymousId();

  fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventType,
      targetType,
      targetId,
      metadata,
      anonymousId,
    }),
  }).catch(() => {
    // Silently ignore — analytics is best-effort
  });
}
