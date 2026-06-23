"use client";

import { useState, useEffect } from "react";
import ContentError from "@/components/ContentError";

export default function TimeoutBoundary({
  children,
  timeoutMs = 15000,
}: {
  children: React.ReactNode;
  timeoutMs?: number;
}) {
  const [timedOut, setTimedOut] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setTimedOut(true), timeoutMs);
    return () => clearTimeout(t);
  }, [timeoutMs, key]);

  if (timedOut) {
    return (
      <ContentError
        error={new Error("Page load timed out")}
        reset={() => { setTimedOut(false); setKey((k) => k + 1); }}
      />
    );
  }

  return <>{children}</>;
}
