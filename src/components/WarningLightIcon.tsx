import React from "react";
import type { SVGProps } from "react";

// Each icon is an accurate representation of the ISO 2575 dashboard warning symbol
// All use 64x64 viewBox with 3px strokes for consistency

function EngineIcon(p: SVGProps<SVGSVGElement>) {
  // ISO K.2 — Engine block with fan
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="10" y="16" width="44" height="24" rx="4"/>
    <path d="M20 40v6h24v-6"/>
    <path d="M24 16V6h16v10"/>
    <path d="M32 28v10"/>
    <circle cx="32" cy="24" r="3" fill="currentColor" stroke="none"/>
  </svg>;
}

function OilIcon(p: SVGProps<SVGSVGElement>) {
  // ISO K.3 — Oil can with drop
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M18 10h28l2 8h10a3 3 0 013 3v26a3 3 0 01-3 3H6a3 3 0 01-3-3V21a3 3 0 013-3h10l2-8z"/>
    <path d="M22 36l6-6 6 6 6-8"/>
  </svg>;
}

function BatteryIcon(p: SVGProps<SVGSVGElement>) {
  // ISO K.6 — Battery with charge indicator
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" {...p}>
    <rect x="8" y="18" width="40" height="28" rx="5"/>
    <path d="M48 26h4a3 3 0 013 3v6a3 3 0 01-3 3h-4"/>
    <path d="M16 30v4"/>
    <path d="M24 30v4"/>
    <path d="M32 30v4"/>
  </svg>;
}

function BrakeIcon(p: SVGProps<SVGSVGElement>) {
  // ISO K.9 — Circle with exclamation
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" {...p}>
    <circle cx="32" cy="32" r="20"/>
    <path d="M32 18v14"/>
    <circle cx="32" cy="44" r="3" fill="currentColor" stroke="none"/>
  </svg>;
}

function TempIcon(p: SVGProps<SVGSVGElement>) {
  // ISO K.7 — Thermometer in liquid
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M28 8v30"/>
    <rect x="22" y="8" width="12" height="3" rx="2"/>
    <path d="M16 52c0-9 7-16 16-16s16 7 16 16"/>
    <path d="M26 48v-4M38 48v-4"/>
  </svg>;
}

function TireIcon(p: SVGProps<SVGSVGElement>) {
  // ISO L.3 — Tire cross-section with exclamation
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" {...p}>
    <circle cx="32" cy="40" r="14"/>
    <circle cx="32" cy="40" r="7"/>
    <rect x="26" y="8" width="12" height="12" rx="2"/>
    <path d="M32 20v10" strokeLinecap="round"/>
  </svg>;
}

function AbsIcon(p: SVGProps<SVGSVGElement>) {
  // ISO K.12 — Circle with text ABS
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" {...p}>
    <circle cx="32" cy="32" r="20"/>
    <text x="32" y="42" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="18" fontWeight="900" fill="currentColor" stroke="none">ABS</text>
  </svg>;
}

function AirbagIcon(p: SVGProps<SVGSVGElement>) {
  // ISO K.17 — Seated figure with deployed airbag
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx="32" cy="24" r="10"/>
    <path d="M22 42l10-10 10 10"/>
    <circle cx="32" cy="32" r="12" strokeWidth="2" strokeDasharray="5 3"/>
  </svg>;
}

function SteeringIcon(p: SVGProps<SVGSVGElement>) {
  // ISO L.7 — Steering wheel
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" {...p}>
    <circle cx="32" cy="38" r="18"/>
    <path d="M14 38h36"/>
    <path d="M32 20v18"/>
    <path d="M26 26l-8-8"/>
    <path d="M38 26l8-8"/>
  </svg>;
}

function TractionIcon(p: SVGProps<SVGSVGElement>) {
  // ISO L.1 — Car with squiggly tire marks
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M16 32h32"/>
    <path d="M12 42h40"/>
    <path d="M20 22l-6 10 6 10"/>
    <path d="M44 22l6 10-6 10"/>
    <circle cx="22" cy="48" r="3"/>
    <circle cx="42" cy="48" r="3"/>
  </svg>;
}

function LockIcon(p: SVGProps<SVGSVGElement>) {
  // ISO K.18 — Padlock
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="12" y="28" width="40" height="26" rx="5"/>
    <path d="M20 28v-8c0-7 5-12 12-12s12 5 12 12v8"/>
    <circle cx="32" cy="42" r="3" fill="currentColor" stroke="none"/>
  </svg>;
}

function FuelIcon(p: SVGProps<SVGSVGElement>) {
  // ISO K.16 — Fuel pump
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="10" y="14" width="26" height="36" rx="4"/>
    <path d="M36 24h12a3 3 0 013 3v14a4 4 0 01-4 4"/>
  </svg>;
}

function CoilIcon(p: SVGProps<SVGSVGElement>) {
  // ISO K.14 — Glow plug / heating coil
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" {...p}>
    <path d="M28 8c0 0-1 6-1 12 0 8 2 14 5 14s5-6 5-14c0-6-1-12-1-12"/>
    <path d="M20 36l12-6 12 6"/>
  </svg>;
}

function DoorIcon(p: SVGProps<SVGSVGElement>) {
  // ISO K.19 — Open door
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" {...p}>
    <rect x="8" y="6" width="48" height="52" rx="4"/>
    <rect x="34" y="10" width="16" height="40" rx="2"/>
    <circle cx="42" cy="32" r="3" fill="currentColor" stroke="none"/>
  </svg>;
}

function SeatbeltIcon(p: SVGProps<SVGSVGElement>) {
  // ISO K.15 — Seated figure with belt
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx="32" cy="16" r="8"/>
    <path d="M26 32l6-5 6 5"/>
    <path d="M32 27v20"/>
  </svg>;
}

function WasherIcon(p: SVGProps<SVGSVGElement>) {
  // ISO K.20 — Windshield with spray
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" {...p}>
    <rect x="16" y="14" width="32" height="36" rx="4"/>
    <path d="M24 24h16"/>
    <path d="M24 32h16"/>
    <path d="M28 38h4"/>
  </svg>;
}

function BoltIcon(p: SVGProps<SVGSVGElement>) {
  // Lightning bolt — EV/power warning
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M38 6L22 36h12l-6 22 18-32H34l4-20z"/>
  </svg>;
}

function ExhaustIcon(p: SVGProps<SVGSVGElement>) {
  // ISO L.5 — Exhaust/DPF/emissions
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" {...p}>
    <rect x="6" y="22" width="52" height="12" rx="4"/>
    <path d="M10 26h6"/>
    <path d="M48 26h6"/>
    <line x1="22" y1="24" x2="22" y2="32"/>
    <line x1="28" y1="24" x2="28" y2="32"/>
    <line x1="34" y1="24" x2="34" y2="32"/>
    <line x1="40" y1="24" x2="40" y2="32"/>
  </svg>;
}

function LightIcon(p: SVGProps<SVGSVGElement>) {
  // Light bulb — headlight/exterior light
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" {...p}>
    <circle cx="32" cy="22" r="14"/>
    <path d="M24 36h16"/>
    <rect x="26" y="36" width="12" height="6" rx="2"/>
    <path d="M26 22l-4 4"/>
    <path d="M38 22l4 4"/>
  </svg>;
}

function GenericWarning(p: SVGProps<SVGSVGElement>) {
  // Generic warning — circle with !
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" {...p}>
    <circle cx="32" cy="32" r="22"/>
    <path d="M32 18v16"/>
    <circle cx="32" cy="46" r="3" fill="currentColor" stroke="none"/>
  </svg>;
}

function LeafIcon(p: SVGProps<SVGSVGElement>) {
  // Eco/regenerative
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" {...p}>
    <path d="M32 8C20 8 6 22 6 36c0 8 6 12 10 14 2 1 4-2 4-4V34c0-8 4-16 12-24"/>
    <path d="M20 46c2 6 8 12 18 12 10 0 20-8 20-24"/>
  </svg>;
}

function KeyIcon(p: SVGProps<SVGSVGElement>) {
  // Key fob
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx="24" cy="22" r="12"/>
    <path d="M32 34l18 18M50 38v14H36"/>
  </svg>;
}

function MoonIcon(p: SVGProps<SVGSVGElement>) {
  // Night vision
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M28 8C18 14 14 30 22 42c8 12 26 16 38 10-10 4-22 0-28-10-6-10-4-24 4-32"/>
  </svg>;
}

function AWDIcon(p: SVGProps<SVGSVGElement>) {
  // AWD/4WD — all 4 wheels driven
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" {...p}>
    <circle cx="18" cy="22" r="6"/>
    <circle cx="46" cy="22" r="6"/>
    <circle cx="18" cy="42" r="6"/>
    <circle cx="46" cy="42" r="6"/>
    <path d="M18 28v8M46 28v8"/>
    <path d="M12 22v20M24 22v20"/>
    <path d="M12 22h12M12 42h12"/>
    <path d="M40 22h12"/>
  </svg>;
}

const ICONS: Record<string, (p: SVGProps<SVGSVGElement>) => React.ReactElement> = {
  "check-engine": EngineIcon,
  "oil-pressure": OilIcon,
  "battery-charging": BatteryIcon,
  "brake-system": BrakeIcon,
  "coolant-temperature": TempIcon,
  "reduced-power": BoltIcon,
  "transmission-temp": TempIcon,
  "timing-belt": EngineIcon,
  "awd": AWDIcon,
  "hood-open": DoorIcon,

  "tpms": TireIcon,
  "abs": AbsIcon,
  "airbag": AirbagIcon,
  "traction-control": TractionIcon,
  "power-steering": SteeringIcon,
  "security": LockIcon,
  "emissions": ExhaustIcon,
  "dpf": ExhaustIcon,
  "adblue": WasherIcon,
  "fuel-filter-water": GenericWarning,
  "brake-pad-wear": BrakeIcon,
  "catalytic-converter": ExhaustIcon,
  "suspension": SteeringIcon,
  "low-fuel": FuelIcon,
  "air-suspension": SteeringIcon,
  "electric-parking": BrakeIcon,
  "regenerative-braking": LeafIcon,
  "forward-collision": GenericWarning,
  "headlight-leveling": LightIcon,
  "trailer": AWDIcon,
  "exterior-light": LightIcon,
  "hill-descent": TractionIcon,
  "rear-spoiler": EngineIcon,

  "glow-plug": CoilIcon,
  "service-vehicle": EngineIcon,
  "oil-change": OilIcon,
  "washer-fluid": WasherIcon,
  "door-ajar": DoorIcon,
  "seat-belt": SeatbeltIcon,
  "cruise-control": TractionIcon,
  "lane-departure": SteeringIcon,
  "auto-high-beam": LightIcon,
  "ev-system": BoltIcon,
  "start-stop": EngineIcon,
  "blind-spot": GenericWarning,
  "key-fob": KeyIcon,
  "parking-brake": BrakeIcon,
  "esp-off": TractionIcon,
  "airbag-off": AirbagIcon,
  "night-vision": MoonIcon,
};

export default function WarningLightIcon({ slug, size = 48, className }: { slug: string; size?: number; className?: string }) {
  const IconComponent = ICONS[slug];
  if (!IconComponent) return <GenericWarning width={size} height={size} className={className} />;
  return <IconComponent width={size} height={size} className={className} />;
}
