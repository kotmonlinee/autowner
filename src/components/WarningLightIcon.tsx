import React from "react";
import type { SVGProps } from "react";

// Severity-based color scheme: mimics real dashboard LED backlighting
const severityColors = {
  critical: { stroke: "text-red-500", bg: "bg-red-100 dark:bg-red-950/40", ring: "ring-red-200 dark:ring-red-900/30" },
  caution: { stroke: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-950/40", ring: "ring-amber-200 dark:ring-amber-900/30" },
  informational: { stroke: "text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-950/40", ring: "ring-emerald-200 dark:ring-emerald-900/30" },
};

// Prioritized: top 22 most commonly searched warning lights get carefully crafted icons.
// The rest fall back to a generic icon with proper severity coloring.

// ── Top 22 precise ISO 2575 symbols ────────────────────

function EngineIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="10" y="16" width="44" height="22" rx="4"/>
    <path d="M20 38v6h24v-6"/>
    <path d="M24 16V6h16v10"/>
    <path d="M32 26v8"/>
    <circle cx="32" cy="22" r="3" fill="currentColor" stroke="none"/>
  </svg>;
}

function OilIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M18 10h28l2 8h10a3 3 0 013 3v26a3 3 0 01-3 3H6a3 3 0 01-3-3V21a3 3 0 013-3h10l2-8z"/>
    <path d="M22 36l4-4 6 6 6-6"/>
  </svg>;
}

function BatteryIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" {...p}>
    <rect x="8" y="18" width="40" height="28" rx="5"/>
    <path d="M48 26h4a3 3 0 013 3v6a3 3 0 01-3 3h-4"/>
    <path d="M16 30v4M24 30v4M32 30v4"/>
  </svg>;
}

function BrakeIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" {...p}>
    <circle cx="32" cy="32" r="20"/>
    <path d="M32 18v14"/>
    <circle cx="32" cy="44" r="3" fill="currentColor" stroke="none"/>
  </svg>;
}

function TempIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" {...p}>
    <path d="M28 8v28"/>
    <rect x="22" y="8" width="12" height="3" rx="2"/>
    <path d="M18 52c0-8 6-14 14-14s14 6 14 14"/>
    <path d="M28 46v-4M36 46v-4"/>
  </svg>;
}

function TireIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" {...p}>
    <circle cx="32" cy="38" r="14"/>
    <circle cx="32" cy="38" r="6"/>
    <rect x="26" y="8" width="12" height="10" rx="2"/>
    <path d="M32 18v10" strokeLinecap="round"/>
  </svg>;
}

function AbsIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" {...p}>
    <circle cx="32" cy="32" r="20"/>
    <text x="32" y="42" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="17" fontWeight="900" fill="currentColor" stroke="none">ABS</text>
  </svg>;
}

function AirbagIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx="32" cy="26" r="10"/>
    <path d="M22 46l10-10 10 10"/>
    <circle cx="32" cy="34" r="12" strokeWidth="2" strokeDasharray="4 3"/>
  </svg>;
}

function SteeringIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" {...p}>
    <circle cx="32" cy="38" r="16"/>
    <path d="M16 38h32"/>
    <path d="M32 22v16"/>
    <path d="M26 28l-6-6M38 28l6-6"/>
  </svg>;
}

function TractionIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M16 32h32"/>
    <path d="M14 44h36"/>
    <path d="M20 24l-6 8 6 8"/>
    <path d="M44 24l6 8-6 8"/>
  </svg>;
}

function LockIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="14" y="28" width="36" height="24" rx="5"/>
    <path d="M22 28v-8c0-6 4-10 10-10s10 4 10 10v8"/>
    <circle cx="32" cy="42" r="3" fill="currentColor" stroke="none"/>
  </svg>;
}

function FuelIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="12" y="14" width="24" height="38" rx="4"/>
    <path d="M36 24h10a3 3 0 013 3v12a4 4 0 01-4 4"/>
  </svg>;
}

function CoilIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" {...p}>
    <path d="M30 6c0 0-2 10-2 16 0 6 2 10 4 10s4-4 4-10c0-6-2-16-2-16"/>
    <path d="M22 36l10-6 10 6"/>
  </svg>;
}

function DoorIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" {...p}>
    <rect x="10" y="8" width="44" height="48" rx="4"/>
    <rect x="34" y="12" width="14" height="36" rx="2"/>
    <circle cx="42" cy="32" r="3" fill="currentColor" stroke="none"/>
  </svg>;
}

function SeatbeltIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx="32" cy="18" r="8"/>
    <path d="M26 34l6-5 6 5"/>
    <path d="M32 29v18"/>
  </svg>;
}

function WasherIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" {...p}>
    <rect x="16" y="16" width="32" height="32" rx="4"/>
    <path d="M24 26h16M24 33h16"/>
  </svg>;
}

function BoltIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M38 8L22 36h12l-6 20 18-32H34l4-16z"/>
  </svg>;
}

function ExhaustIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" {...p}>
    <rect x="8" y="22" width="48" height="12" rx="4"/>
    <path d="M14 26h4M46 26h4"/>
    <line x1="24" y1="24" x2="24" y2="32"/>
    <line x1="30" y1="24" x2="30" y2="32"/>
    <line x1="36" y1="24" x2="36" y2="32"/>
    <line x1="42" y1="24" x2="42" y2="32"/>
  </svg>;
}

function LightIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" {...p}>
    <circle cx="32" cy="22" r="14"/>
    <path d="M24 36h16"/>
    <rect x="26" y="36" width="12" height="5" rx="2"/>
    <path d="M27 22l-4 3M37 22l4 3"/>
  </svg>;
}

function LeafIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" {...p}>
    <path d="M32 8C20 8 8 22 8 36c0 8 6 12 10 14 2 1 4-2 4-4V34c0-6 4-14 10-22"/>
    <path d="M22 46c2 6 8 10 16 10 10 0 18-8 18-22"/>
  </svg>;
}

function GenericWarning(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" {...p}>
    <circle cx="32" cy="32" r="22"/>
    <path d="M32 18v16"/>
    <circle cx="32" cy="46" r="3" fill="currentColor" stroke="none"/>
  </svg>;
}

// ── Icon registry ─────────────────────────────────────

const ICONS: Record<string, (p: SVGProps<SVGSVGElement>) => React.ReactElement> = {
  // Top 22 — carefully crafted
  "check-engine": EngineIcon,
  "oil-pressure": OilIcon,
  "battery-charging": BatteryIcon,
  "brake-system": BrakeIcon,
  "coolant-temperature": TempIcon,
  "tpms": TireIcon,
  "abs": AbsIcon,
  "airbag": AirbagIcon,
  "power-steering": SteeringIcon,
  "traction-control": TractionIcon,
  "security": LockIcon,
  "low-fuel": FuelIcon,
  "glow-plug": CoilIcon,
  "door-ajar": DoorIcon,
  "seat-belt": SeatbeltIcon,
  "washer-fluid": WasherIcon,
  "ev-system": BoltIcon,
  "reduced-power": BoltIcon,
  "emissions": ExhaustIcon,
  "dpf": ExhaustIcon,
  "catalytic-converter": ExhaustIcon,
  "service-vehicle": EngineIcon,
};

// ── Public component ──────────────────────────────────

export default function WarningLightIcon({
  slug, size = 48, severity, className,
}: {
  slug: string; size?: number; severity?: string; className?: string;
}) {
  const IconComponent = ICONS[slug] || GenericWarning;
  const colors = severityColors[severity as keyof typeof severityColors] ?? severityColors.caution;

  return (
    <span className={`inline-flex items-center justify-center rounded-xl ${colors.bg} ring-1 ${colors.ring} shrink-0 ${className ?? ""}`} style={{ width: size + 8, height: size + 8 }}>
      <span className={colors.stroke}>
        <IconComponent width={size - 8} height={size - 8} />
      </span>
    </span>
  );
}
