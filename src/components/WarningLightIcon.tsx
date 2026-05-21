import { Icon } from "@iconify/react";

// Map warning light slugs to best-matching standard icons from Tabler/MDI Iconify sets
const ICON_MAP: Record<string, string> = {
  // Critical — Red warning lights
  "check-engine": "tabler:engine",
  "oil-pressure": "mdi:oil",
  "battery-charging": "tabler:battery-3",
  "brake-system": "tabler:exclamation-circle",
  "coolant-temperature": "tabler:thermometer",
  "reduced-power": "tabler:zap-off",
  "transmission-temp": "tabler:temperature-sun",
  "timing-belt": "mdi:engine-off-outline",
  "awd": "tabler:car-4wd",
  "hood-open": "tabler:car",

  // Caution — Yellow/Amber warning lights
  "tpms": "tabler:tire",
  "abs": "tabler:circle-letter-a",
  "airbag": "mdi:airbag",
  "traction-control": "tabler:car-crane",
  "power-steering": "tabler:steering-wheel",
  "security": "tabler:lock",
  "emissions": "mdi:engine-outline",
  "dpf": "tabler:filter",
  "adblue": "tabler:droplet-down",
  "fuel-filter-water": "tabler:droplet-exclamation",
  "brake-pad-wear": "tabler:circle-dashed",
  "catalytic-converter": "mdi:car-exhaust",
  "suspension": "tabler:car",
  "low-fuel": "tabler:gas-station",
  "air-suspension": "tabler:car",
  "electric-parking": "mdi:car-brake-parking",
  "regenerative-braking": "tabler:leaf",
  "forward-collision": "tabler:car",
  "headlight-leveling": "tabler:headlights",
  "trailer": "tabler:caravan",
  "exterior-light": "tabler:bulb",
  "hill-descent": "mdi:slope-downhill",
  "rear-spoiler": "mdi:car-sports",

  // Informational — Green/Blue indicator lights
  "glow-plug": "tabler:coil",
  "service-vehicle": "tabler:wrench",
  "oil-change": "tabler:droplet-filled",
  "washer-fluid": "tabler:car",
  "door-ajar": "tabler:door",
  "seat-belt": "mdi:seatbelt",
  "cruise-control": "tabler:arrow-bar-to-down",
  "lane-departure": "tabler:road-sign",
  "auto-high-beam": "tabler:bulb",
  "ev-system": "tabler:bolt",
  "start-stop": "tabler:power",
  "blind-spot": "tabler:car",
  "key-fob": "tabler:key",
  "parking-brake": "mdi:car-brake-parking",
  "esp-off": "tabler:car",
  "airbag-off": "mdi:airbag",
  "night-vision": "tabler:moon",
};

export default function WarningLightIcon({ slug, size = 48 }: { slug: string; size?: number }) {
  const icon = ICON_MAP[slug];
  if (!icon) return null;
  return <Icon icon={icon} width={size} height={size} />;
}
