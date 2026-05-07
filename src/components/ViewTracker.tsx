"use client";

import { useEffect, useRef } from "react";

export default function ViewTracker({ postId }: { postId: string }) {
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId }),
    }).catch(() => {
      // Silently ignore — view tracking is best-effort
    });
  }, [postId]);

  return null;
}
