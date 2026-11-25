"use client";

import { useState } from "react";

export default function VehicleImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    <img
      src={src}
      alt={alt}
      className="aspect-[4/3] h-full w-full border border-surface-border bg-surface-1 object-cover"
      loading="lazy"
      onError={() => setFailed(true)}
     width={288} height={192} />
  );
}
