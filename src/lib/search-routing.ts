// Shared search routing logic — used by SmartSearchBar, Navbar search, 404
const OBD_CODE_RE = /^[PCBU]\d{4}$/i;
const QUOTE_KEYWORDS = ["$", "quote", "quoted", "estimate"];

// Keyword → exact repair slug mapping for direct routing
const REPAIR_SLUG_MAP: { keywords: string[]; slug: string }[] = [
  { keywords: ["oil change", "oil service", "oil"], slug: "oil-change-synthetic" },
  { keywords: ["brake pad", "brake pads", "brakes", "brake job"], slug: "brake-pads-front" },
  { keywords: ["brake rotor", "rotors", "brake disc"], slug: "rotor-front" },
  { keywords: ["brake caliper", "caliper", "calipers"], slug: "brake-caliper" },
  { keywords: ["alternator", "alternator replacement"], slug: "alternator" },
  { keywords: ["battery", "car battery"], slug: "battery" },
  { keywords: ["starter", "starter motor"], slug: "starter" },
  { keywords: ["radiator", "radiator replacement", "cooling"], slug: "radiator" },
  { keywords: ["water pump", "waterpump"], slug: "water-pump" },
  { keywords: ["timing belt", "timing belt replacement"], slug: "timing-belt" },
  { keywords: ["timing chain"], slug: "timing-chain" },
  { keywords: ["head gasket", "headgasket"], slug: "head-gasket" },
  { keywords: ["muffler", "exhaust system"], slug: "muffler" },
  { keywords: ["catalytic converter", "catalyst"], slug: "catalytic-converter" },
  { keywords: ["spark plug", "spark plugs", "tune up", "tune-up"], slug: "spark-plugs" },
  { keywords: ["fuel pump", "fuel pump replacement"], slug: "fuel-pump" },
  { keywords: ["fuel injector", "fuel injectors", "injector"], slug: "fuel-injector" },
  { keywords: ["struts", "shocks", "suspension"], slug: "shocks-struts" },
  { keywords: ["ball joint", "ball joints"], slug: "ball-joints" },
  { keywords: ["tie rod", "tie rods", "tie rod ends"], slug: "tie-rod-ends" },
  { keywords: ["wheel bearing", "wheel bearings"], slug: "wheel-bearing" },
  { keywords: ["clutch", "clutch replacement"], slug: "clutch" },
  { keywords: ["power steering", "power steering pump"], slug: "power-steering-pump" },
  { keywords: ["ac compressor", "a/c compressor", "air conditioning"], slug: "ac-compressor" },
  { keywords: ["thermostat", "thermostat replacement"], slug: "thermostat" },
  { keywords: ["serpentine belt", "drive belt", "serpentine"], slug: "drive-belt" },
  { keywords: ["ignition coil", "ignition coils", "coil pack"], slug: "ignition-coil" },
  { keywords: ["oxygen sensor", "o2 sensor", "lambda sensor"], slug: "oxygen-sensor" },
  { keywords: ["mass air flow", "maf sensor", "maf"], slug: "mass-air-flow-sensor" },
  { keywords: ["egr valve", "egr"], slug: "egr-valve" },
  { keywords: ["cv axle", "cv joint", "cv joints", "cv axles"], slug: "cv-axle" },
  { keywords: ["control arm", "control arms"], slug: "control-arms" },
  { keywords: ["fuel filter"], slug: "fuel-filter" },
  { keywords: ["cabin air filter", "cabin filter"], slug: "cabin-air-filter" },
  { keywords: ["engine air filter", "air filter"], slug: "engine-air-filter" },
  { keywords: ["transmission fluid", "transmission flush", "transmission"], slug: "transmission-fluid" },
  { keywords: ["wheel alignment", "alignment"], slug: "wheel-alignment" },
  { keywords: ["windshield", "windshield replacement"], slug: "windshield" },
  { keywords: ["window regulator", "power window"], slug: "window-regulator" },
  { keywords: ["blower motor", "blower"], slug: "blower-motor" },
  { keywords: ["heater core"], slug: "heater-core" },
  { keywords: ["engine mount", "motor mount"], slug: "engine-mount" },
  { keywords: ["differential fluid", "differential"], slug: "differential-fluid" },
  { keywords: ["transfer case", "transfer case fluid"], slug: "transfer-case-fluid" },
  { keywords: ["valve cover gasket", "valve cover"], slug: "valve-cover-gasket" },
  { keywords: ["throttle body"], slug: "throttle-body" },
  { keywords: ["turbocharger", "turbo"], slug: "turbocharger" },
  { keywords: ["door lock actuator", "door lock"], slug: "door-lock-actuator" },
  { keywords: ["evaporator core"], slug: "evaporator-core" },
  { keywords: ["pcv valve", "pcv"], slug: "pcv-valve" },
];

export function resolveSearchRoute(query: string): string {
  const trimmed = query.trim();
  if (!trimmed) return "";

  // OBD code → exact page
  if (OBD_CODE_RE.test(trimmed)) return `/obd/${trimmed.toLowerCase()}`;

  const lower = trimmed.toLowerCase();

  // Quote-related → Quote Checker
  if (QUOTE_KEYWORDS.some((kw) => lower.includes(kw))) return "/quote-checker";

  // Repair keyword → exact repair page
  for (const entry of REPAIR_SLUG_MAP) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return `/repair-cost/${entry.slug}`;
    }
  }

  // Fallback: community search
  return `/community?q=${encodeURIComponent(trimmed)}`;
}
