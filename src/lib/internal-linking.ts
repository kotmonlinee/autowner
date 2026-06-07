// Keyword-based cross-linking between OBD codes, repair costs, and warning lights.
// No manual mapping needed — matches repair/job keywords against OBD title text.

interface RepairLink {
  slug: string;
  name: string;
}

interface ObdLink {
  code: string;
  title: string;
}

const REPAIR_KEYWORDS: { keywords: string[]; slug: string; name: string }[] = [
  { keywords: ["catalyst", "catalytic"], slug: "catalytic-converter", name: "Catalytic Converter" },
  { keywords: ["oxygen sensor", "o2 sensor", "lambda sensor", "ho2s"], slug: "oxygen-sensor", name: "Oxygen Sensor" },
  { keywords: ["spark plug", "misfire"], slug: "spark-plugs", name: "Spark Plugs" },
  { keywords: ["mass air", "maf", "air flow"], slug: "mass-air-flow-sensor", name: "Mass Air Flow Sensor" },
  { keywords: ["throttle", "tps", "etc"], slug: "throttle-body", name: "Throttle Body" },
  { keywords: ["egr", "exhaust gas recirculation"], slug: "egr-valve", name: "EGR Valve" },
  { keywords: ["evap", "evaporative emission", "fuel tank", "fuel cap", "purge", "vent valve"], slug: "evaporator-core", name: "EVAP System" },
  { keywords: ["fuel pump", "fuel pressure", "fuel delivery"], slug: "fuel-pump", name: "Fuel Pump" },
  { keywords: ["fuel injector", "injector circuit"], slug: "fuel-injector", name: "Fuel Injector" },
  { keywords: ["alternator", "charging system", "generator"], slug: "alternator", name: "Alternator" },
  { keywords: ["starter", "starting system"], slug: "starter", name: "Starter" },
  { keywords: ["battery", "voltage"], slug: "battery", name: "Battery" },
  { keywords: ["brake pad", "brake"], slug: "brake-pads-front", name: "Brake Pads" },
  { keywords: ["brake rotor", "brake disc"], slug: "brake-pads-rear", name: "Brake Rotors" },
  { keywords: ["caliper"], slug: "brake-caliper", name: "Brake Caliper" },
  { keywords: ["radiator", "coolant", "cooling fan", "engine coolant", "ect sensor", "overheating"], slug: "radiator", name: "Radiator" },
  { keywords: ["water pump"], slug: "water-pump", name: "Water Pump" },
  { keywords: ["thermostat"], slug: "thermostat", name: "Thermostat" },
  { keywords: ["head gasket", "cylinder head"], slug: "head-gasket", name: "Head Gasket" },
  { keywords: ["timing belt", "timing chain", "camshaft", "crankshaft"], slug: "timing-belt", name: "Timing Belt" },
  { keywords: ["oil pressure", "oil pump", "oil level", "oil pan", "oil gasket"], slug: "oil-change-synthetic", name: "Oil Service" },
  { keywords: ["a/c", "air conditioning", "refrigerant", "compressor"], slug: "ac-compressor", name: "A/C Compressor" },
  { keywords: ["transmission", "shift solenoid", "torque converter", "tcm"], slug: "transmission-fluid", name: "Transmission Fluid" },
  { keywords: ["clutch"], slug: "clutch", name: "Clutch" },
  { keywords: ["steering", "power steering"], slug: "power-steering-pump", name: "Power Steering Pump" },
  { keywords: ["suspension", "strut", "shock"], slug: "shocks-struts", name: "Shocks & Struts" },
  { keywords: ["wheel bearing", "hub"], slug: "wheel-bearing", name: "Wheel Bearing" },
  { keywords: ["tie rod"], slug: "steering-rack", name: "Steering / Tie Rod" },
  { keywords: ["control arm", "ball joint"], slug: "control-arms", name: "Control Arm / Ball Joint" },
  { keywords: ["exhaust", "muffler"], slug: "muffler", name: "Exhaust / Muffler" },
  { keywords: ["turbo", "boost", "supercharger"], slug: "turbocharger", name: "Turbocharger" },
  { keywords: ["dpf", "diesel particulate", "def", "scr", "nox"], slug: "catalytic-converter", name: "DPF / Emissions" },
  { keywords: ["airbag", "srs", "seat belt", "occupant"], slug: "clutch", name: "Airbag / SRS" },
  { keywords: ["abs module", "abs pump"], slug: "abs-module", name: "ABS Module" },
  { keywords: ["tire pressure", "tpms", "tire"], slug: "tpms-sensor", name: "TPMS Sensor" },
  { keywords: ["window", "power window", "window regulator"], slug: "window-regulator", name: "Window Regulator" },
  { keywords: ["windshield"], slug: "windshield", name: "Windshield" },
  { keywords: ["valve cover", "engine gasket"], slug: "valve-cover-gasket", name: "Valve Cover Gasket" },
  { keywords: ["intake manifold", "intake air"], slug: "intake-manifold", name: "Intake Manifold" },
  { keywords: ["ignition coil"], slug: "ignition-coil", name: "Ignition Coil" },
  { keywords: ["serpentine belt", "drive belt", "accessory belt"], slug: "drive-belt", name: "Serpentine Belt" },
  { keywords: ["blower motor", "heater", "blower"], slug: "blower-motor", name: "Blower Motor" },
  { keywords: ["heater core"], slug: "heater-core", name: "Heater Core" },
  { keywords: ["cv axle", "cv joint"], slug: "cv-axle", name: "CV Axle" },
  { keywords: ["cabin filter", "air filter"], slug: "cabin-air-filter", name: "Cabin Air Filter" },
  { keywords: ["engine filter", "air filter"], slug: "engine-air-filter", name: "Engine Air Filter" },
  { keywords: ["fuel filter"], slug: "fuel-filter", name: "Fuel Filter" },
  { keywords: ["differential", "diff fluid"], slug: "differential-fluid", name: "Differential Fluid" },
  { keywords: ["wheel alignment", "alignment"], slug: "wheel-alignment", name: "Wheel Alignment" },
  { keywords: ["engine mount", "motor mount"], slug: "engine-mount", name: "Engine Mount" },
  { keywords: ["door lock", "door actuator"], slug: "door-lock-actuator", name: "Door Lock Actuator" },
  { keywords: ["brake fluid"], slug: "brake-fluid-flush", name: "Brake Fluid Flush" },
  { keywords: ["coolant flush"], slug: "coolant-flush", name: "Coolant Flush" },
];

export function getRelatedRepairs(obdTitle: string, maxResults = 3): RepairLink[] {
  const lower = obdTitle.toLowerCase();
  const matches: RepairLink[] = [];

  for (const entry of REPAIR_KEYWORDS) {
    const matched = entry.keywords.some((kw) => lower.includes(kw));
    if (matched) {
      matches.push({ slug: entry.slug, name: entry.name });
      if (matches.length >= maxResults) break;
    }
  }

  return matches;
}

export function resolveRepairSlug(keyword: string): string | null {
  const lower = keyword.toLowerCase();
  for (const entry of REPAIR_KEYWORDS) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return entry.slug;
    }
  }
  // Fallback: try direct slugification against known slugs
  const slugified = lower.replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  for (const entry of REPAIR_KEYWORDS) {
    if (entry.slug.includes(slugified) || slugified.includes(entry.slug)) {
      return entry.slug;
    }
  }
  return null;
}

export function getRelatedObdCodes(repairName: string, maxResults = 3): string[] {
  const lower = repairName.toLowerCase();
  for (const entry of REPAIR_KEYWORDS) {
    const matched = entry.keywords.some((kw) => lower.includes(kw));
    if (matched) {
      // Return the primary keywords as searchable OBD prefixes
      return [entry.keywords[0].toUpperCase()];
    }
  }
  return [];
}

// Top OBD codes by common search volume — used for homepage quick links
export const TOP_OBD_CODES: ObdLink[] = [
  { code: "P0420", title: "Catalyst System Efficiency Below Threshold" },
  { code: "P0300", title: "Random/Multiple Cylinder Misfire Detected" },
  { code: "P0171", title: "System Too Lean (Bank 1)" },
  { code: "P0455", title: "Evaporative Emission System Leak Detected (Large Leak)" },
  { code: "P0442", title: "Evaporative Emission System Leak Detected (Small Leak)" },
  { code: "P0401", title: "Exhaust Gas Recirculation Flow Insufficient" },
  { code: "P0301", title: "Cylinder 1 Misfire Detected" },
  { code: "P0302", title: "Cylinder 2 Misfire Detected" },
  { code: "P0303", title: "Cylinder 3 Misfire Detected" },
  { code: "P0304", title: "Cylinder 4 Misfire Detected" },
  { code: "P0430", title: "Catalyst System Efficiency Below Threshold (Bank 2)" },
  { code: "P0135", title: "O2 Sensor Heater Circuit Malfunction (Bank 1 Sensor 1)" },
  { code: "P0141", title: "O2 Sensor Heater Circuit Malfunction (Bank 1 Sensor 2)" },
  { code: "P0440", title: "Evaporative Emission Control System Malfunction" },
  { code: "P0446", title: "Evaporative Emission System Vent Control Circuit" },
  { code: "P0128", title: "Coolant Thermostat (Coolant Temperature Below Thermostat Regulating Temperature)" },
  { code: "P0325", title: "Knock Sensor 1 Circuit Malfunction" },
  { code: "P0400", title: "Exhaust Gas Recirculation Flow Malfunction" },
  { code: "P0500", title: "Vehicle Speed Sensor Malfunction" },
  { code: "P0700", title: "Transmission Control System Malfunction" },
];

// Top repairs for homepage quick links
export const TOP_REPAIRS: RepairLink[] = [
  { slug: "brake-pads-front", name: "Brake Pad Replacement" },
  { slug: "oxygen-sensor", name: "Oxygen Sensor Replacement" },
  { slug: "catalytic-converter", name: "Catalytic Converter Replacement" },
  { slug: "spark-plugs", name: "Spark Plug Replacement" },
  { slug: "alternator", name: "Alternator Replacement" },
  { slug: "fuel-pump", name: "Fuel Pump Replacement" },
  { slug: "timing-belt", name: "Timing Belt Replacement" },
  { slug: "starter", name: "Starter Replacement" },
  { slug: "water-pump", name: "Water Pump Replacement" },
  { slug: "ac-compressor", name: "A/C Compressor Replacement" },
];
