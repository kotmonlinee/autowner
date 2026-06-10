"use client";

import { useRef, useEffect, useState } from "react";
import { Zap, Moon, RefreshCw, Timer } from "lucide-react";
import { IMAGE_CACHE_VERSION } from "@/lib/constants";

const severityColors = {
  critical: { stroke: "text-severity-critical", bg: "bg-severity-critical-bg", ring: "ring-severity-critical-border" },
  caution: { stroke: "text-severity-caution", bg: "bg-severity-caution-bg", ring: "ring-severity-caution-border" },
  informational: { stroke: "text-severity-info", bg: "bg-severity-info-bg", ring: "ring-severity-info-border" },
};

const LUCIDE_FALLBACKS: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number }>> = {
  "ev-system": Zap,
  "night-vision": Moon,
  "regenerative-braking": RefreshCw,
  "timing-belt": Timer,
};

export default function WarningLightIcon({ slug, size = 48, severity, className }: {
  slug: string; size?: number; severity?: string; className?: string;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [failed, setFailed] = useState(false);
  const colors = severityColors[severity as keyof typeof severityColors] ?? severityColors.caution;
  const iconSize = size - 8;
  const LucideIcon = LUCIDE_FALLBACKS[slug];

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    const handleError = () => setFailed(true);
    img.addEventListener("error", handleError);
    if (!img.complete) return;
    // Check if already failed (naturalWidth === 0 for broken images)
    if (img.naturalWidth === 0) setFailed(true);
    return () => img.removeEventListener("error", handleError);
  }, [slug]);

  return (
    <span className={`inline-flex items-center justify-center rounded-xl overflow-hidden ${colors.bg} ring-1 ${colors.ring} shrink-0 ${className ?? ""}`} style={{ width: size + 8, height: size + 8 }}>
      {LucideIcon ? (
        <span className={colors.stroke}>
          <LucideIcon size={iconSize} strokeWidth={2} />
        </span>
      ) : (
        <span className="relative" style={{ width: iconSize, height: iconSize }}>
          <img
            ref={imgRef}
            src={`/warning-lights/${slug}.jpg?v=${IMAGE_CACHE_VERSION}`}
            alt=""
            width={iconSize}
            height={iconSize}
            className="rounded-lg"
            style={{ display: failed ? "none" : "block" }}
          />
          {!failed && (
            <span className={`absolute bottom-0 right-0 w-[18px] h-[14px] rounded-bl-lg ${colors.bg}`} aria-hidden="true" />
          )}
          {failed && (
            <span className={colors.stroke}>
              <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" width={iconSize} height={iconSize}>
                <path d="M32 8L6 56h52L32 8z"/>
                <path d="M32 28v12"/>
                <circle cx="32" cy="46" r="3" fill="currentColor" stroke="none"/>
              </svg>
            </span>
          )}
        </span>
      )}
    </span>
  );
}
