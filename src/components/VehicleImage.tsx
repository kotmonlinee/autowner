"use client";

import { useState } from "react";

export default function VehicleImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    <img
      src={src}
      alt={alt}
      className="w-full md:w-72 h-48 object-cover rounded-2xl border border-surface-border bg-surface-1 shrink-0"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
