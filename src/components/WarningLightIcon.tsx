import { Icon } from "@iconify/react";

// Map warning light slugs to standard dashboard icons from open-source sets
const ICON_MAP: Record<string, string> = {
  // Critical / Engine
  "check-engine": "tabler:engine",
  "oil-pressure": "tabler:droplet-exclamation",
  "battery-charging": "tabler:battery-4",
  "brake-system": "tabler:exclamation-circle",
  "coolant-temperature": "mdi:thermometer-alert",
  "reduced-power": "tabler:zap-off",
  "transmission-temp": "mdi:car-cog",
  "timing-belt": "mdi:engine-off-outline",
  "awd": "mdi:car-select",

  // Caution
  "tpms": "mdi:tire-alert",
  "abs": "mdi:car-brake-abs",
  "airbag": "mdi:airbag",
  "traction-control": "tabler:car",
  "power-steering": "tabler:steering-wheel",
  "security": "tabler:lock-access",
  "emissions": "tabler:exclamation-mark",
  "dpf": "mdi:smoke-detector-variant-alert",
  "adblue": "tabler:droplet",
  "fuel-filter-water": "tabler:droplet-exclamation",
  "brake-pad-wear": "tabler:circle-dashed-check",
  "catalytic-converter": "mdi:car-exhaust",
  "suspension": "mdi:car-suspension",
  "low-fuel": "tabler:gas-station-off",
  "air-suspension": "mdi:car-suspension",
  "electric-parking": "mdi:car-brake-parking",
  "regenerative-braking": "mdi:leaf",
  "forward-collision": "mdi:car-emergency",
  "headlight-leveling": "tabler:headlights",
  "trailer": "mdi:truck-trailer",
  "exterior-light": "tabler:bulb-off",
  "hill-descent": "mdi:slope-downhill",
  "rear-spoiler": "mdi:car-sports",
  "hood-open": "tabler:car",

  // Informational
  "glow-plug": "tabler:coil",
  "service-vehicle": "tabler:tool",
  "oil-change": "tabler:droplet",
  "washer-fluid": "tabler:car-wash",
  "door-ajar": "tabler:door-open",
  "seat-belt": "mdi:seatbelt",
  "cruise-control": "tabler:speedboat",
  "lane-departure": "tabler:road",
  "auto-high-beam": "tabler:brightness-up",
  "ev-system": "tabler:bolt",
  "start-stop": "mdi:engine-off",
  "blind-spot": "mdi:car-side",
  "key-fob": "tabler:key",
  "parking-brake": "mdi:car-brake-parking",
  "esp-off": "tabler:car",
  "airbag-off": "mdi:airbag",
  "night-vision": "mdi:weather-night",
};

export default function WarningLightIcon({ slug, size = 48 }: { slug: string; size?: number }) {
  const icon = ICON_MAP[slug] || "tabler:alert-triangle";
  return <Icon icon={icon} width={size} height={size} />;
}
