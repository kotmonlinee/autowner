import React from "react";
import type { SVGProps } from "react";

// ISO 2575 standard dashboard warning light symbols
// Each symbol accurately represents real dashboard indicators

function CheckEngineIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 64 64" fill="none" {...p}><rect x="7" y="12" width="50" height="30" rx="4" stroke="currentColor" strokeWidth="3"/><path d="M20 42v5h24v-5" stroke="currentColor" strokeWidth="3"/><path d="M26 12V6h12v6" stroke="currentColor" strokeWidth="3"/><path d="M32 28v10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/><circle cx="32" cy="24" r="2.5" fill="currentColor"/></svg>;
}

function OilPressureIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 64 64" fill="none" {...p}><path d="M20 8h24l3 10h8a3 3 0 013 3v28a3 3 0 01-3 3H9a3 3 0 01-3-3V21a3 3 0 013-3h8l3-10z" stroke="currentColor" strokeWidth="3"/><path d="M18 36l4-4 6 6 8-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

function BatteryChargingIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 64 64" fill="none" {...p}><rect x="8" y="16" width="40" height="32" rx="5" stroke="currentColor" strokeWidth="3"/><path d="M48 24h4a3 3 0 013 3v10a3 3 0 01-3 3h-4" stroke="currentColor" strokeWidth="3"/><path d="M16 26v12M24 26v12M32 26v12" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>;
}

function BrakeSystemIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 64 64" fill="none" {...p}><circle cx="32" cy="32" r="20" stroke="currentColor" strokeWidth="3"/><path d="M32 18v14" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/><circle cx="32" cy="42" r="3" fill="currentColor"/></svg>;
}

function CoolantTempIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 64 64" fill="none" {...p}><path d="M28 8v30" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/><rect x="22" y="8" width="12" height="3" rx="1.5"/><path d="M16 52c0-8.8 7.2-16 16-16s16 7.2 16 16" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/><path d="M28 44v-4M36 44v-4" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>;
}

function TPMSIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 64 64" fill="none" {...p}><circle cx="32" cy="40" r="14" stroke="currentColor" strokeWidth="3"/><circle cx="32" cy="40" r="7" stroke="currentColor" strokeWidth="3"/><rect x="26" y="8" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="3"/><path d="M32 20v10" stroke="currentColor" strokeWidth="3"/></svg>;
}

function ABSIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 64 64" fill="none" {...p}><circle cx="32" cy="32" r="20" stroke="currentColor" strokeWidth="3"/><text x="32" y="42" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="18" fontWeight="900" fill="currentColor" stroke="none">ABS</text></svg>;
}

function AirbagIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 64 64" fill="none" {...p}><circle cx="32" cy="26" r="10" stroke="currentColor" strokeWidth="3"/><path d="M22 46l10-12 10 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><circle cx="32" cy="34" r="12" stroke="currentColor" strokeWidth="2" strokeDasharray="4 3"/></svg>;
}

function SteeringIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 64 64" fill="none" {...p}><circle cx="32" cy="38" r="18" stroke="currentColor" strokeWidth="3"/><path d="M14 38h36M32 20v18M32 20l-10-8M32 20l10-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>;
}

function TractionIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 64 64" fill="none" {...p}><path d="M12 26h40M12 38h40" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/><path d="M18 16l-8 10 8 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

function LockIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 64 64" fill="none" {...p}><rect x="12" y="28" width="40" height="26" rx="4" stroke="currentColor" strokeWidth="3"/><path d="M20 28v-8a12 12 0 0124 0v8" stroke="currentColor" strokeWidth="3"/><circle cx="32" cy="42" r="3" fill="currentColor"/></svg>;
}

function FuelIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 64 64" fill="none" {...p}><rect x="10" y="14" width="26" height="36" rx="4" stroke="currentColor" strokeWidth="3"/><path d="M36 26h12a3 3 0 013 3v12a4 4 0 01-4 4" stroke="currentColor" strokeWidth="3"/></svg>;
}

function GlowPlugIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 64 64" fill="none" {...p}><path d="M28 6c0 0-2 12-2 20 0 6 2 10 6 10s6-4 6-10c0-8-2-20-2-20" stroke="currentColor" strokeWidth="3"/><path d="M20 40l12-8 12 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>;
}

function DoorIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 64 64" fill="none" {...p}><rect x="8" y="6" width="48" height="52" rx="4" stroke="currentColor" strokeWidth="3"/><rect x="36" y="10" width="14" height="40" rx="2" stroke="currentColor" strokeWidth="3"/><circle cx="44" cy="32" r="2.5" fill="currentColor"/></svg>;
}

function SeatbeltIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 64 64" fill="none" {...p}><circle cx="32" cy="18" r="7" stroke="currentColor" strokeWidth="3"/><path d="M26 36l6-6 6 6M32 30v20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

function WasherIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 64 64" fill="none" {...p}><rect x="16" y="12" width="32" height="40" rx="4" stroke="currentColor" strokeWidth="3"/><path d="M24 22h16M24 30h16M26 38h4" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>;
}

function BoltIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 64 64" fill="none" {...p}><path d="M36 6L20 38h12l-6 20 18-34H32l6-18z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/></svg>;
}

function ExhaustIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 64 64" fill="none" {...p}><rect x="4" y="20" width="56" height="16" rx="3" stroke="currentColor" strokeWidth="3"/><path d="M4 26h6M54 26h6" stroke="currentColor" strokeWidth="3"/><circle cx="22" cy="28" r="4" stroke="currentColor" strokeWidth="3"/><circle cx="42" cy="28" r="4" stroke="currentColor" strokeWidth="3"/></svg>;
}

function AWDIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 64 64" fill="none" {...p}><circle cx="20" cy="22" r="5" stroke="currentColor" strokeWidth="3"/><circle cx="44" cy="22" r="5" stroke="currentColor" strokeWidth="3"/><circle cx="20" cy="42" r="5" stroke="currentColor" strokeWidth="3"/><circle cx="44" cy="42" r="5" stroke="currentColor" strokeWidth="3"/><path d="M20 27v10M44 27v10M15 22v20M24 22v20M15 22h9M15 42h9M39 22h9" stroke="currentColor" strokeWidth="2"/></svg>;
}

function LightBulbIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 64 64" fill="none" {...p}><circle cx="32" cy="22" r="14" stroke="currentColor" strokeWidth="3"/><path d="M24 36h16M26 22l-4 4M38 22l4 4" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/><rect x="26" y="36" width="12" height="6" rx="2" stroke="currentColor" strokeWidth="3"/></svg>;
}

function WarningGenericIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 64 64" fill="none" {...p}><circle cx="32" cy="32" r="22" stroke="currentColor" strokeWidth="3"/><path d="M32 18v16" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/><circle cx="32" cy="46" r="3" fill="currentColor"/></svg>;
}

function KeyFobIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 64 64" fill="none" {...p}><circle cx="26" cy="22" r="12" stroke="currentColor" strokeWidth="3"/><path d="M34 32l16 16M50 36v14H36" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

function DPFIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 64 64" fill="none" {...p}><rect x="6" y="20" width="52" height="16" rx="4" stroke="currentColor" strokeWidth="3"/><path d="M10 26h8M46 26h8" stroke="currentColor" strokeWidth="3"/><line x1="22" y1="24" x2="22" y2="32" stroke="currentColor" strokeWidth="3"/><line x1="28" y1="24" x2="28" y2="32" stroke="currentColor" strokeWidth="3"/><line x1="34" y1="24" x2="34" y2="32" stroke="currentColor" strokeWidth="3"/><line x1="40" y1="24" x2="40" y2="32" stroke="currentColor" strokeWidth="3"/></svg>;
}

function LeafIcon(p: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 64 64" fill="none" {...p}><path d="M32 8C32 8 8 20 8 36c0 10 8 18 18 20 4 1 6-2 6-6V36c0-8 6-20 18-28" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/><path d="M26 48c0 0 4 8 12 8 10 0 18-10 18-24" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>;
}

const ICONS: Record<string, (p: SVGProps<SVGSVGElement>) => React.ReactElement> = {
  // Critical — Red
  "check-engine": CheckEngineIcon,
  "oil-pressure": OilPressureIcon,
  "battery-charging": BatteryChargingIcon,
  "brake-system": BrakeSystemIcon,
  "coolant-temperature": CoolantTempIcon,
  "reduced-power": BoltIcon,
  "transmission-temp": CoolantTempIcon,
  "timing-belt": CheckEngineIcon,
  "awd": AWDIcon,
  "hood-open": DoorIcon,

  // Caution — Yellow
  "tpms": TPMSIcon,
  "abs": ABSIcon,
  "airbag": AirbagIcon,
  "traction-control": TractionIcon,
  "power-steering": SteeringIcon,
  "security": LockIcon,
  "emissions": WarningGenericIcon,
  "dpf": DPFIcon,
  "adblue": WasherIcon,
  "fuel-filter-water": WarningGenericIcon,
  "brake-pad-wear": BrakeSystemIcon,
  "catalytic-converter": ExhaustIcon,
  "suspension": SteeringIcon,
  "low-fuel": FuelIcon,
  "air-suspension": SteeringIcon,
  "electric-parking": BrakeSystemIcon,
  "regenerative-braking": LeafIcon,
  "forward-collision": WarningGenericIcon,
  "headlight-leveling": LightBulbIcon,
  "trailer": AWDIcon,
  "exterior-light": LightBulbIcon,
  "hill-descent": TractionIcon,
  "rear-spoiler": CheckEngineIcon,

  // Informational — Green/Blue
  "glow-plug": GlowPlugIcon,
  "service-vehicle": CheckEngineIcon,
  "oil-change": OilPressureIcon,
  "washer-fluid": WasherIcon,
  "door-ajar": DoorIcon,
  "seat-belt": SeatbeltIcon,
  "cruise-control": TractionIcon,
  "lane-departure": SteeringIcon,
  "auto-high-beam": LightBulbIcon,
  "ev-system": BoltIcon,
  "start-stop": CheckEngineIcon,
  "blind-spot": WarningGenericIcon,
  "key-fob": KeyFobIcon,
  "parking-brake": BrakeSystemIcon,
  "esp-off": TractionIcon,
  "airbag-off": AirbagIcon,
  "night-vision": LightBulbIcon,
};

export default function WarningLightIcon({ slug, size = 48, className }: { slug: string; size?: number; className?: string }) {
  const IconComponent = ICONS[slug];
  if (!IconComponent) return <WarningGenericIcon width={size} height={size} className={className} />;
  return <IconComponent width={size} height={size} className={className} />;
}
