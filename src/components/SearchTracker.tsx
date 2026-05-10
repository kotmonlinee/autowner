"use client";

import { useEffect, useRef } from "react";

/**
 * SearchTracker fires a search event when a user performs a search.
 * Uses a ref to ensure it only fires once per query.
 */
export default function SearchTracker({ query }: { query: string }) {
  const lastQueryRef = useRef<string | null>(null);

  useEffect(() => {
    if (!query || query === lastQueryRef.current) return;
    lastQueryRef.current = query;

    const anonymousId = (() => {
      try {
        return localStorage.getItem("autowner_anonymous_id");
      } catch {
        return null;
      }
    })();

    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType: "search",
        metadata: { query },
        anonymousId,
      }),
    }).catch(() => {
      // Silently ignore — analytics is best-effort
    });
  }, [query]);

  return null;
}
