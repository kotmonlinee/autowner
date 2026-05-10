"use client";

import { useEffect, useRef } from "react";

/**
 * ViewTracker increments the post's view_count and records a view_post event
 * for user retention analytics. Sends two separate requests:
 *   1. POST /api/views      — increments post.view_count
 *   2. POST /api/events     — records view_post event for retention
 *
 * When `title` is provided, also saves to localStorage under
 * `autowner_view_history` for anonymous reading history (Feature 2).
 */
export default function ViewTracker({ postId, title }: { postId: string; title?: string }) {
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    // Increment the view counter
    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId }),
    }).catch(() => {
      // Silently ignore — view tracking is best-effort
    });

    // Record the view_post event for retention analytics
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
        eventType: "view_post",
        targetType: "post",
        targetId: postId,
        anonymousId,
      }),
    }).catch(() => {
      // Silently ignore — analytics is best-effort
    });

    // Save to anonymous reading history in localStorage (Feature 2)
    if (title) {
      try {
        const raw = localStorage.getItem("autowner_view_history");
        const history: { postId: string; title: string; viewedAt: string }[] =
          raw ? JSON.parse(raw) : [];

        // Remove duplicate if exists
        const filtered = history.filter((item) => item.postId !== postId);

        // Add current post to front
        filtered.unshift({
          postId,
          title,
          viewedAt: new Date().toISOString(),
        });

        // Keep max 50
        localStorage.setItem(
          "autowner_view_history",
          JSON.stringify(filtered.slice(0, 50)),
        );
      } catch {
        // Silently ignore — history is best-effort
      }
    }
  }, [postId, title]);

  return null;
}
