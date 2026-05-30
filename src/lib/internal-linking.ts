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
  { keywords: ["catalyst", "catalytic"], slug: "catalytic-converter-replacement", name: "Catalytic Converter" },
  { keywords: ["oxygen sensor", "o2 sensor", "lambda sensor", "ho2s"], slug: "oxygen-sensor-replacement", name: "Oxygen Sensor" },
  { keywords: ["spark plug", "ignition coil", "misfire"], slug: "spark-plug-replacement", name: "Spark Plugs" },
  { keywords: ["mass air", "maf", "air flow"], slug: "mass-airflow-sensor-replacement", name: "Mass Airflow Sensor" },
  { keywords: ["throttle", "tps", "etc"], slug: "throttle-body-replacement", name: "Throttle Body" },
  { keywords: ["egr", "exhaust gas recirculation"], slug: "egr-valve-replacement", name: "EGR Valve" },
  { keywords: ["evap", "evaporative emission", "fuel tank", "fuel cap", "purge", "vent valve"], slug: "evap-system-repair", name: "EVAP System" },
  { keywords: ["fuel pump", "fuel pressure", "fuel delivery"], slug: "fuel-pump-replacement", name: "Fuel Pump" },
  { keywords: ["fuel injector", "injector circuit"], slug: "fuel-injector-replacement", name: "Fuel Injectors" },
  { keywords: ["alternator", "charging system", "generator"], slug: "alternator-replacement", name: "Alternator" },
  { keywords: ["starter", "starting system"], slug: "starter-replacement", name: "Starter" },
  { keywords: ["battery", "voltage"], slug: "battery-replacement", name: "Battery" },
  { keywords: ["brake", "abs", "anti-lock"], slug: "brake-pad-replacement", name: "Brake Pads" },
  { keywords: ["brake rotor", "brake disc"], slug: "brake-rotor-replacement", name: "Brake Rotors" },
  { keywords: ["caliper"], slug: "brake-caliper-replacement", name: "Brake Calipers" },
  { keywords: ["radiator", "coolant", "cooling fan", "thermostat", "engine coolant", "ect sensor", "overheating"], slug: "radiator-replacement", name: "Radiator" },
  { keywords: ["water pump"], slug: "water-pump-replacement", name: "Water Pump" },
  { keywords: ["thermostat"], slug: "thermostat-replacement", name: "Thermostat" },
  { keywords: ["head gasket", "cylinder head"], slug: "head-gasket-replacement", name: "Head Gasket" },
  { keywords: ["timing belt", "timing chain", "camshaft", "crankshaft"], slug: "timing-belt-replacement", name: "Timing Belt" },
  { keywords: ["oil pressure", "oil pump", "oil level"], slug: "oil-change", name: "Oil Service" },
  { keywords: ["a/c", "air conditioning", "refrigerant", "compressor"], slug: "ac-compressor-replacement", name: "A/C Compressor" },
  { keywords: ["transmission", "shift solenoid", "torque converter", "tcm"], slug: "transmission-fluid-change", name: "Transmission Service" },
  { keywords: ["clutch"], slug: "clutch-replacement", name: "Clutch" },
  { keywords: ["steering", "power steering", "rack"], slug: "power-steering-pump-replacement", name: "Power Steering Pump" },
  { keywords: ["suspension", "strut", "shock"], slug: "shock-and-strut-replacement", name: "Shocks & Struts" },
  { keywords: ["wheel bearing", "hub"], slug: "wheel-bearing-replacement", name: "Wheel Bearing" },
  { keywords: ["tie rod"], slug: "tie-rod-end-replacement", name: "Tie Rod Ends" },
  { keywords: ["control arm", "ball joint"], slug: "control-arm-replacement", name: "Control Arm" },
  { keywords: ["exhaust", "muffler"], slug: "exhaust-system-repair", name: "Exhaust System" },
  { keywords: ["turbo", "boost", "supercharger"], slug: "turbocharger-replacement", name: "Turbocharger" },
  { keywords: ["dpf", "diesel particulate", "def", "scr", "nox"], slug: "dpf-replacement", name: "DPF Filter" },
  { keywords: ["airbag", "srs", "seat belt", "occupant"], slug: "airbag-module-replacement", name: "Airbag Module" },
  { keywords: ["abs module", "abs pump"], slug: "abs-module-replacement", name: "ABS Module" },
  { keywords: ["tire pressure", "tpms", "tire"], slug: "tpms-sensor-replacement", name: "TPMS Sensor" },
  { keywords: ["window", "power window", "window regulator"], slug: "window-regulator-replacement", name: "Window Regulator" },
  { keywords: ["windshield"], slug: "windshield-replacement", name: "Windshield" },
  { keywords: ["head gasket", "engine gasket", "valve cover"], slug: "valve-cover-gasket-replacement", name: "Valve Cover Gasket" },
  { keywords: ["intake manifold", "intake air"], slug: "intake-manifold-gasket-replacement", name: "Intake Manifold Gasket" },
  { keywords: ["serpentine belt", "drive belt", "accessory belt"], slug: "serpentine-belt-replacement", name: "Serpentine Belt" },
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
  { slug: "brake-pad-replacement", name: "Brake Pad Replacement" },
  { slug: "oxygen-sensor-replacement", name: "Oxygen Sensor Replacement" },
  { slug: "catalytic-converter-replacement", name: "Catalytic Converter Replacement" },
  { slug: "spark-plug-replacement", name: "Spark Plug Replacement" },
  { slug: "alternator-replacement", name: "Alternator Replacement" },
  { slug: "fuel-pump-replacement", name: "Fuel Pump Replacement" },
  { slug: "timing-belt-replacement", name: "Timing Belt Replacement" },
  { slug: "starter-replacement", name: "Starter Replacement" },
  { slug: "water-pump-replacement", name: "Water Pump Replacement" },
  { slug: "ac-compressor-replacement", name: "A/C Compressor Replacement" },
];
