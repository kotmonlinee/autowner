import React from "react";
import type { SVGProps } from "react";

// ── 50 dashboard warning lights — ISO 2575:2020 standard symbols ──
// Each icon is a unique SVG matching the ISO 2575 specification.

function Icon(p: SVGProps<SVGSVGElement> & { children: React.ReactNode }) {
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...p} />;
}

const severityColors = {
  critical: { stroke: "text-red-500", bg: "bg-red-100 dark:bg-red-950/40", ring: "ring-red-200 dark:ring-red-900/30" },
  caution: { stroke: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-950/40", ring: "ring-amber-200 dark:ring-amber-900/30" },
  informational: { stroke: "text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-950/40", ring: "ring-emerald-200 dark:ring-emerald-900/30" },
};

// ── 50 unique ISO 2575 icons ─────────────────────────────

const CheckEngine = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><rect x="10" y="16" width="44" height="32" rx="4"/><path d="M18 16V8h8l6 8h8V8h-8"/><path d="M32 24v10"/><circle cx="32" cy="40" r="3" fill="currentColor" stroke="none"/></Icon>;
const OilPressure = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><path d="M22 12h20l2 8h8v24a4 4 0 01-4 4H16a4 4 0 01-4-4V20h8l2-8z"/><path d="M24 30l4-4 4 4 4-8"/></Icon>;
const Battery = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><rect x="8" y="20" width="40" height="28" rx="4"/><path d="M14 28v12M22 28v12"/><path d="M48 28v4M52 28h2v12h-2v-4"/><path d="M18 36h16"/></Icon>;
const Brake = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><circle cx="32" cy="32" r="18"/><path d="M32 22v10"/><circle cx="32" cy="42" r="3" fill="currentColor" stroke="none"/></Icon>;
const Coolant = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><path d="M28 8v24"/><rect x="22" y="8" width="12" height="4" rx="2"/><path d="M12 48c0-10 8-20 20-20s20 10 20 20"/><path d="M26 48v-6M38 48v-6"/></Icon>;
const Tpms = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><circle cx="32" cy="38" r="14"/><circle cx="32" cy="38" r="6"/><rect x="26" y="8" width="12" height="10" rx="2"/><path d="M32 18v10"/></Icon>;
const Abs = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><circle cx="32" cy="32" r="18"/><text x="32" y="42" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="18" fontWeight="900" fill="currentColor" stroke="none">ABS</text></Icon>;
const Airbag = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><circle cx="32" cy="18" r="8"/><path d="M20 40l6-12h12l6 12"/><circle cx="32" cy="40" r="12" strokeDasharray="4 3"/></Icon>;
const Steering = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><circle cx="32" cy="36" r="14"/><path d="M18 36h28"/><path d="M32 22v28"/></Icon>;
const Traction = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><path d="M14 30l4-4 8 12 8-10 6 8 4-4"/><path d="M20 18l-6 12 6 6"/></Icon>;
const Immobilizer = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><rect x="14" y="28" width="36" height="28" rx="5"/><path d="M22 28v-8c0-6 4-10 10-10s10 4 10 10v8"/><circle cx="32" cy="42" r="3" fill="currentColor" stroke="none"/></Icon>;
const Fuel = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><rect x="12" y="14" width="22" height="38" rx="4"/><path d="M34 24h8l4 6v14a4 4 0 01-4 4h-2"/><rect x="36" y="46" width="6" height="6" rx="2"/></Icon>;
const GlowPlug = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><path d="M32 8v12"/><path d="M24 16c0-6 4-12 8-12s8 6 8 12c0 10-4 18-8 24-4-6-8-14-8-24z"/><path d="M22 34h20M24 42h16"/></Icon>;
const DoorAjar = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><rect x="10" y="8" width="44" height="48" rx="4"/><path d="M34 16l-10 8v24l10 8"/><circle cx="38" cy="32" r="3" fill="currentColor" stroke="none"/></Icon>;
const Seatbelt = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><circle cx="32" cy="16" r="8"/><path d="M20 34c0 0 4-10 12-10s12 10 12 10"/><path d="M26 34l-6 18h24l-6-18"/></Icon>;
const Washer = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><path d="M8 18l48-6v26l-48-6z"/><path d="M20 24l-4 10"/><path d="M32 22v14"/><path d="M44 24l4 10"/></Icon>;
const EvSystem = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><path d="M14 18h36v20H14z"/><path d="M38 38h10l4-20H12l4 20h10"/><path d="M26 46h12v4a2 2 0 01-2 2h-8a2 2 0 01-2-2v-4z"/></Icon>;
const ReducedPower = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><path d="M20 38Q32 14 44 38"/><path d="M32 46v-10"/><circle cx="32" cy="52" r="3" fill="currentColor" stroke="none"/></Icon>;
const TransTemp = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><circle cx="32" cy="38" r="12"/><path d="M22 38h20"/><path d="M32 26v8"/><path d="M26 32l6-6 6 6"/><circle cx="30" cy="36" r="2" fill="currentColor" stroke="none"/><circle cx="34" cy="36" r="2" fill="currentColor" stroke="none"/></Icon>;
const TimingBelt = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><circle cx="22" cy="24" r="10"/><circle cx="42" cy="24" r="10"/><circle cx="22" cy="24" r="4" fill="currentColor" stroke="none"/><circle cx="42" cy="24" r="4" fill="currentColor" stroke="none"/><path d="M22 34v10l20-10v10"/></Icon>;
const AWD = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><circle cx="16" cy="20" r="6"/><circle cx="48" cy="20" r="6"/><circle cx="16" cy="44" r="6"/><circle cx="48" cy="44" r="6"/><path d="M16 26v12M48 26v12M10 20v24M22 20v24M42 20v24M54 20v24"/></Icon>;
const Emissions = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><rect x="10" y="20" width="44" height="24" rx="4"/><path d="M22 28h20M26 34h12"/><path d="M38 14l4-6M32 14l-2-6M44 14l2-6"/></Icon>;
const Dpf = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><rect x="8" y="22" width="48" height="12" rx="3"/><path d="M48 28h4a4 4 0 014 4v2a4 4 0 01-4 4h-4"/><rect x="30" y="28" width="4" height="6" rx="1"/><rect x="24" y="28" width="4" height="6" rx="1"/><rect x="36" y="28" width="4" height="6" rx="1"/></Icon>;
const FuelFilter = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><rect x="16" y="14" width="32" height="40" rx="4"/><path d="M22 28h20M26 34h12"/><path d="M28 20h8"/><circle cx="28" cy="10" r="3" fill="currentColor" stroke="none"/><circle cx="36" cy="10" r="3" fill="currentColor" stroke="none"/></Icon>;
const BrakeWear = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><circle cx="32" cy="32" r="18" strokeDasharray="8 4"/><path d="M32 22v10"/><circle cx="32" cy="42" r="3" fill="currentColor" stroke="none"/></Icon>;
const SuspensionIcon = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><path d="M18 12v52M46 12v52"/><path d="M18 28l8-4-8-4"/><path d="M46 28l-8-4 8-4"/><circle cx="32" cy="32" r="14"/></Icon>;
const AirSusp = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><path d="M18 20v40M46 20v40"/><path d="M18 28l6-4-6-4"/><path d="M46 28l-6-4 6-4"/><rect x="24" y="24" width="16" height="28" rx="4"/></Icon>;
const ElecParking = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><circle cx="32" cy="28" r="14"/><text x="32" y="36" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="16" fontWeight="900" fill="currentColor" stroke="none">P</text><rect x="28" y="44" width="8" height="12" rx="2"/><path d="M32 42v2"/></Icon>;
const RegenBrake = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><rect x="10" y="18" width="28" height="28" rx="4"/><path d="M38 28h10v8h-10"/><path d="M22 28l4-6 4 6"/><path d="M22 36l4 6 4-6"/></Icon>;
const ForwardCollision = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><path d="M12 38h16l4-8h12l4 8h4"/><circle cx="20" cy="46" r="4"/><circle cx="44" cy="46" r="4"/><path d="M18 38v-6a2 2 0 012-2h24a2 2 0 012 2v6"/></Icon>;
const HeadlightLevel = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><circle cx="16" cy="32" r="8"/><circle cx="48" cy="32" r="8"/><path d="M10 42h44"/><path d="M16 24l-4 8M48 24l4 8"/><path d="M26 42l6-10 6 10"/></Icon>;
const Trailer = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><rect x="6" y="20" width="24" height="20" rx="3"/><rect x="14" y="12" width="12" height="14" rx="2"/><circle cx="12" cy="40" r="5"/><circle cx="24" cy="40" r="5"/><rect x="34" y="24" width="22" height="14" rx="3"/><circle cx="44" cy="38" r="5"/></Icon>;
const ExteriorLight = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><circle cx="32" cy="26" r="14"/><path d="M24 40h16"/><rect x="26" y="40" width="12" height="6" rx="2"/><path d="M20 22l-4 4M44 22l4 4"/></Icon>;
const HillDescent = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><path d="M8 46l24-30 24 30"/><rect x="26" y="8" width="12" height="20" rx="3"/><circle cx="20" cy="46" r="4"/><circle cx="44" cy="46" r="4"/></Icon>;
const HoodOpen = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><path d="M10 32h44v-8a4 4 0 00-4-4H14a4 4 0 00-4 4v8z"/><path d="M14 32v6a2 2 0 002 2h8a2 2 0 002-2v-4M38 32v6a2 2 0 002 2h8a2 2 0 002-2v-4"/><path d="M26 24v-8M38 24v-8"/><circle cx="18" cy="42" r="4"/><circle cx="46" cy="42" r="4"/></Icon>;
const ServiceVehicle = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><path d="M26 28L14 42l16 6 10-14 10 14 8-16L42 26l-16-6z"/><circle cx="28" cy="22" r="4" fill="currentColor" stroke="none"/></Icon>;
const OilChange = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><path d="M24 10h16l3 10h8v22a3 3 0 01-3 3H16a3 3 0 01-3-3V20h8l3-10z"/><path d="M26 34l4-4 4 4 4-6"/><path d="M32 22l-6 10"/></Icon>;
const CruiseControl = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><path d="M8 42a24 24 0 0148 0"/><path d="M32 20v16"/><path d="M52 34l-16-3"/><circle cx="32" cy="46" r="3" fill="currentColor" stroke="none"/></Icon>;
const LaneDeparture = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><path d="M10 16v32M54 16v32"/><path d="M24 28l8-4v16l8 4"/><path d="M20 22l4-6M44 22l-4-6"/></Icon>;
const AutoHighBeam = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><circle cx="20" cy="28" r="8"/><circle cx="44" cy="28" r="8"/><path d="M12 40h40"/><path d="M20 20l-4 8"/><text x="32" y="54" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="18" fontWeight="900" fill="currentColor" stroke="none">A</text></Icon>;
const StartStop = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><circle cx="32" cy="32" r="18"/><path d="M38 18a14 14 0 010 28"/><polygon points="36,18 44,32 36,46"/><line x1="26" y1="18" x2="26" y2="46"/></Icon>;
const BlindSpot = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><path d="M10 24l4-6h36l4 6"/><path d="M14 30v-6a2 2 0 012-2h32a2 2 0 012 2v6"/><circle cx="22" cy="38" r="4"/><circle cx="42" cy="38" r="4"/><path d="M50 18c2 4 4 8 4 12"/></Icon>;
const AdBlue = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><rect x="14" y="14" width="28" height="38" rx="4"/><path d="M42 24h8l4 10v8"/><path d="M24 26v-2M24 32v-2M32 26v-2M32 32v-2"/></Icon>;
const KeyFob = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><circle cx="22" cy="32" r="16"/><path d="M34 22l16 26M46 44H36l6-16"/></Icon>;
const ParkingBrake = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><circle cx="32" cy="28" r="18"/><text x="32" y="36" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="20" fontWeight="900" fill="currentColor" stroke="none">P</text></Icon>;
const EspOff = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><path d="M14 32l6-6 8 12 8-8 8 10 6-4"/><text x="46" y="28" fontFamily="Arial,sans-serif" fontSize="16" fontWeight="900" fill="currentColor" stroke="none">OFF</text></Icon>;
const AirbagOff = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><circle cx="32" cy="18" r="8"/><path d="M20 40l6-12h12l6 12"/><circle cx="32" cy="40" r="12" strokeDasharray="4 3"/><text x="46" y="28" fontFamily="Arial,sans-serif" fontSize="16" fontWeight="900" fill="currentColor" stroke="none">OFF</text></Icon>;
const NightVision = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><path d="M10 34a22 22 0 0144 0"/><circle cx="32" cy="32" r="12"/><circle cx="32" cy="32" r="4" fill="currentColor" stroke="none"/><path d="M32 18v-4M38 20l-4 2M26 20l4 2"/></Icon>;
const RearSpoiler = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><path d="M8 28h48v-6a4 4 0 00-4-4H12a4 4 0 00-4 4v6z"/><path d="M8 28v6a2 2 0 002 2h44a2 2 0 002-2v-6"/><path d="M22 22h20l-6-4h-8l-6 4z"/><circle cx="14" cy="36" r="4"/><circle cx="50" cy="36" r="4"/></Icon>;

// ── Mapping ──────────────────────────────────────────────

const ICONS: Record<string, (p: SVGProps<SVGSVGElement>) => React.ReactElement> = {
  "check-engine": CheckEngine,
  "oil-pressure": OilPressure,
  "battery-charging": Battery,
  "brake-system": Brake,
  "coolant-temperature": Coolant,
  "tpms": Tpms,
  "abs": Abs,
  "airbag": Airbag,
  "power-steering": Steering,
  "traction-control": Traction,
  "security": Immobilizer,
  "low-fuel": Fuel,
  "glow-plug": GlowPlug,
  "door-ajar": DoorAjar,
  "seat-belt": Seatbelt,
  "washer-fluid": Washer,
  "ev-system": EvSystem,
  "reduced-power": ReducedPower,
  "transmission-temp": TransTemp,
  "timing-belt": TimingBelt,
  "awd": AWD,
  "emissions": Emissions,
  "dpf": Dpf,
  "fuel-filter-water": FuelFilter,
  "brake-pad-wear": BrakeWear,
  "catalytic-converter": Emissions,
  "suspension": SuspensionIcon,
  "air-suspension": AirSusp,
  "electric-parking": ElecParking,
  "regenerative-braking": RegenBrake,
  "forward-collision": ForwardCollision,
  "headlight-leveling": HeadlightLevel,
  "trailer": Trailer,
  "exterior-light": ExteriorLight,
  "hill-descent": HillDescent,
  "rear-spoiler": RearSpoiler,
  "hood-open": HoodOpen,
  "service-vehicle": ServiceVehicle,
  "oil-change": OilChange,
  "cruise-control": CruiseControl,
  "lane-departure": LaneDeparture,
  "auto-high-beam": AutoHighBeam,
  "start-stop": StartStop,
  "blind-spot": BlindSpot,
  "adblue": AdBlue,
  "key-fob": KeyFob,
  "parking-brake": ParkingBrake,
  "esp-off": EspOff,
  "airbag-off": AirbagOff,
  "night-vision": NightVision,
};

// ── Public component ──────────────────────────────────────

export default function WarningLightIcon({ slug, size = 48, severity, className }: {
  slug: string; size?: number; severity?: string; className?: string;
}) {
  const IconComponent = ICONS[slug] || CheckEngine;
  const colors = severityColors[severity as keyof typeof severityColors] ?? severityColors.caution;
  return (
    <span className={`inline-flex items-center justify-center rounded-xl ${colors.bg} ring-1 ${colors.ring} shrink-0 ${className ?? ""}`} style={{ width: size + 8, height: size + 8 }}>
      <span className={colors.stroke}>
        <IconComponent width={size - 8} height={size - 8} />
      </span>
    </span>
  );
}
