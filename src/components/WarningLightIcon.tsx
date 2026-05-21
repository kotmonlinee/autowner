import {
  AlertTriangle, AlertCircle, CircleAlert, Circle, CircleDashed,
  Car, CarFront, Gauge,
  Droplets,
  BatteryFull, BatteryMedium, BatteryLow, BatteryWarning, BatteryCharging,
  Thermometer, ThermometerSun, Flame,
  Zap, ZapOff, Bolt, Power, PowerOff,
  Wrench, Settings, Cog,
  Lock, Key, Shield, ShieldAlert, ShieldCheck,
  Leaf, Sun, Moon, Snowflake,
  DoorOpen,
  Lightbulb, LightbulbOff,
  Truck,
  ArrowBigDown, ArrowBigUp,
  ScanEye, Wifi, WifiOff,
  Bell, BellOff, BellRing,
  Activity, HeartPulse,
  type LucideIcon,
} from "lucide-react";

// Two icons not in Lucide — simple inline
import type { SVGProps } from "react";
function EngineIcon(p: SVGProps<SVGSVGElement>) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 18v2h10v-2M7 6V4h10v2M12 12v-2M12 12v2"/></svg>; }
function OilIcon(p: SVGProps<SVGSVGElement>) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M10 4h4l2 4h4a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2v-8a2 2 0 012-2h4l2-4z"/><path d="M8 14v2h8v-2"/></svg>; }

const ICON_MAP: Record<string, LucideIcon | typeof EngineIcon> = {
  // Critical — Red
  "check-engine": EngineIcon,
  "oil-pressure": OilIcon,
  "battery-charging": BatteryWarning,
  "brake-system": CircleAlert,
  "coolant-temperature": ThermometerSun,
  "reduced-power": ZapOff,
  "transmission-temp": Flame,
  "timing-belt": Cog,
  "awd": Gauge,
  "hood-open": Car,

  // Caution — Yellow
  "tpms": Gauge,
  "abs": CircleAlert,
  "airbag": AlertCircle,
  "traction-control": Car,
  "power-steering": CircleDashed,
  "security": Lock,
  "emissions": AlertTriangle,
  "dpf": AlertTriangle,
  "adblue": Droplets,
  "fuel-filter-water": Droplets,
  "brake-pad-wear": CircleDashed,
  "catalytic-converter": AlertTriangle,
  "suspension": Settings,
  "low-fuel": BatteryLow,
  "air-suspension": Settings,
  "electric-parking": CircleAlert,
  "regenerative-braking": Leaf,
  "forward-collision": ShieldAlert,
  "headlight-leveling": Lightbulb,
  "trailer": Truck,
  "exterior-light": LightbulbOff,
  "hill-descent": ArrowBigDown,
  "rear-spoiler": CarFront,

  // Informational — Green/Blue
  "glow-plug": Zap,
  "service-vehicle": Wrench,
  "oil-change": Droplets,
  "washer-fluid": Droplets,
  "door-ajar": DoorOpen,
  "seat-belt": ShieldCheck,
  "cruise-control": Gauge,
  "lane-departure": ScanEye,
  "auto-high-beam": Lightbulb,
  "ev-system": Bolt,
  "start-stop": PowerOff,
  "blind-spot": ScanEye,
  "key-fob": Key,
  "parking-brake": CircleAlert,
  "esp-off": Car,
  "airbag-off": AlertCircle,
  "night-vision": Moon,
};

export default function WarningLightIcon({ slug, size = 48 }: { slug: string; size?: number }) {
  const IconComponent = ICON_MAP[slug];
  if (!IconComponent) return <AlertTriangle size={size} className="text-text-muted" />;
  // Lucide icons use size; custom SVGs use width/height
  const isCustom = typeof IconComponent === "function" && !(IconComponent as any).displayName?.startsWith("Lucide");
  if (isCustom) return <IconComponent width={size} height={size} />;
  return <IconComponent size={size} />;
}
