// Shared search routing logic — used by SmartSearchBar, Navbar search, 404
const OBD_CODE_RE = /^[PCBU]\d{4}$/i;
const QUOTE_KEYWORDS = ["$", "quote", "quoted", "estimate"];
const REPAIR_KEYWORDS = [
  "brake", "brakes", "oil", "engine", "transmission", "trans", "ac",
  "air conditioning", "alternator", "battery", "starter", "radiator",
  "water pump", "timing belt", "head gasket", "muffler", "exhaust",
  "catalytic converter", "spark plug", "fuel pump", "struts", "shocks",
  "ball joint", "tie rod", "wheel bearing", "clutch", "differential",
  "power steering", "compressor", "evaporator", "heater core", "thermostat",
  "serpentine belt", "ignition coil", "oxygen sensor", "o2 sensor",
  "mass air flow", "maf sensor", "egr valve", "pcv valve",
  "crankshaft", "camshaft", "cv joint", "cv axle", "control arm",
  "sway bar", "rack and pinion", "fuel filter", "cabin filter",
  "air filter", "tires", "tire", "alignment", "overheating", "overheat",
  "recall", "recalls",
];

export function resolveSearchRoute(query: string): string {
  const trimmed = query.trim();
  if (!trimmed) return "";

  if (OBD_CODE_RE.test(trimmed)) return `/obd/${trimmed.toLowerCase()}`;
  const lower = trimmed.toLowerCase();
  if (QUOTE_KEYWORDS.some((kw) => lower.includes(kw))) return "/quote-checker";
  if (REPAIR_KEYWORDS.some((kw) => lower.includes(kw))) return `/repair-cost?q=${encodeURIComponent(trimmed)}`;
  return `/community?q=${encodeURIComponent(trimmed)}`;
}
