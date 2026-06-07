"use client";

import { useState } from "react";
import { Zap, Moon, RefreshCw, Timer } from "lucide-react";

const severityColors = {
  critical: { stroke: "text-red-500", bg: "bg-red-100 dark:bg-red-950/40", ring: "ring-red-200 dark:ring-red-900/30" },
  caution: { stroke: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-950/40", ring: "ring-amber-200 dark:ring-amber-900/30" },
  informational: { stroke: "text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-950/40", ring: "ring-emerald-200 dark:ring-emerald-900/30" },
};

const LUCIDE_FALLBACKS: Record<string, React.ComponentType<{ className?: string }>> = {
  "ev-system": Zap,
  "night-vision": Moon,
  "regenerative-braking": RefreshCw,
  "timing-belt": Timer,
};

export default function WarningLightIcon({ slug, size = 48, severity, className }: {
  slug: string; size?: number; severity?: string; className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const colors = severityColors[severity as keyof typeof severityColors] ?? severityColors.caution;
  const iconSize = size - 8;

  // Use Lucide icon for the 4 missing warning lights
  const LucideIcon = LUCIDE_FALLBACKS[slug];

  return (
    <span className={`inline-flex items-center justify-center rounded-xl ${colors.bg} ring-1 ${colors.ring} shrink-0 ${className ?? ""}`} style={{ width: size + 8, height: size + 8 }}>
      {LucideIcon ? (
        <span className={colors.stroke}>
          <LucideIcon size={iconSize} strokeWidth={2} />
        </span>
      ) : failed ? (
        <span className={colors.stroke}>
          <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width={iconSize} height={iconSize}>
            <path d="M32 8L6 56h52L32 8z"/>
            <path d="M32 28v12"/>
            <circle cx="32" cy="46" r="3" fill="currentColor" stroke="none"/>
          </svg>
        </span>
      ) : (
        <img
          src={`/warning-lights/${slug}.jpg`}
          alt=""
          width={iconSize}
          height={iconSize}
          onError={() => setFailed(true)}
        />
      )}
    </span>
  );
}
