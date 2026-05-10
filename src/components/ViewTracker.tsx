"use client";

import { useEffect, useRef } from "react";

/**
 * ViewTracker increments the post's view_count and records a view_post event
 * for user retention analytics. Sends two separate requests:
 *   1. POST /api/views      — increments post.view_count
 *   2. POST /api/events     — records view_post event for retention
 */
export default function ViewTracker({ postId }: { postId: string }) {
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
  }, [postId]);

  return null;
}
