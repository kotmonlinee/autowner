/**
 * Step 1 of SEO Funnel: Fill symptoms/causes/fixes for ALL OBD codes
 *
 * Replaces generic placeholder content ("Warning light/message on dashboard",
 * "Scan with OBD2 diagnostic tool", etc.) with specific, SEO-friendly content
 * in Dave's practical mechanic voice.
 *
 * Usage: npx tsx scripts/step1-fill-obd-content.ts
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

// ── Setup ──────────────────────────────────────────────────────
const env = Object.fromEntries(
  readFileSync(".env.local", "utf-8")
    .split("\n")
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => l.split("=").map((s) => s.trim()))
);

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL!,
  env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

// ── Types ──────────────────────────────────────────────────────
interface ObdRow {
  code: string;
  title: string;
  symptoms_json: string[];
  causes_json: string[];
  fixes_json: string[];
  min_cost: number | null;
  max_cost: number | null;
}

// ── Utility ────────────────────────────────────────────────────
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function safeParseJsonArray(val: unknown): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return val.map(String);
  if (typeof val !== "string") return [];

  const s = val.trim();
  if (!s) return [];
  if (s === "[]") return [];

  // Try straight parse first
  try {
    const parsed = JSON.parse(s);
    if (Array.isArray(parsed)) return parsed.map(String);
    if (typeof parsed === "string") return [parsed];
    return [];
  } catch {
    // Malformed JSON — try to fix common issues
  }

  // Fix 1: Array opens with [ but doesn't close  → add ]
  if (s.startsWith("[") && !s.endsWith("]")) {
    try {
      return JSON.parse(s + "]").map(String);
    } catch { /* continue */ }
  }

  // Fix 2: Missing opening bracket but has closing
  if (!s.startsWith("[") && s.endsWith("]")) {
    try {
      return JSON.parse("[" + s).map(String);
    } catch { /* continue */ }
  }

  // Fix 3: Neither bracket — wrap in array
  try {
    return JSON.parse("[" + s + "]").map(String);
  } catch { /* continue */ }

  // Fallback: just use the raw string as a single entry
  return [s.replace(/^\[?"?|"?\]?$/g, "").replace(/\\"/g, '"')];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function randBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ── Title Parsers ──────────────────────────────────────────────
interface ParsedTitle {
  raw: string;
  isShortToBattery: boolean;
  isShortToGround: boolean;
  isCircuitOpen: boolean;
  isCircuitHigh: boolean;
  isCircuitLow: boolean;
  isIntermittent: boolean;
  isRangePerformance: boolean;
  isMalfunction: boolean;
  isSensor: boolean;
  isSolenoid: boolean;
  isMotor: boolean;
  isRelay: boolean;
  isSwitch: boolean;
  isValve: boolean;
  isActuator: boolean;
  isControl: boolean;
  isHeater: boolean;
  isWiring: boolean;
  isSignalInvalid: boolean;
  isNotLearned: boolean;
  isImplausible: boolean;
  isReserved: boolean;
  // System detection
  system: SystemCategory;
}

interface SystemCategory {
  name: string;          // e.g., "door lock system"
  component: string;     // e.g., "door lock actuator"
  symptomPrefix: string; // e.g., "Power door locks"
  costRange: [number, number];
  severity: number;      // 1-5
}

// ── System Category Detection ──────────────────────────────────
function detectSystem(code: string, title: string): SystemCategory {
  const t = title.toLowerCase();
  const c = code.toUpperCase();

  // Engine / Fuel / Ignition
  if (t.includes("mass air") || t.includes("maf") || t.includes("air flow")) return { name: "mass airflow (MAF) sensor", component: "MAF sensor", symptomPrefix: "Engine", costRange: [80, 400], severity: 3 };
  if (t.includes("o2 sensor") || t.includes("oxygen sensor") || t.includes("o2s")) return { name: "oxygen (O2) sensor", component: "O2 sensor", symptomPrefix: "Check engine light", costRange: [80, 400], severity: 3 };
  if (t.includes("fuel injector") || t.includes("injector circuit")) return { name: "fuel injector system", component: "fuel injector", symptomPrefix: "Engine", costRange: [80, 800], severity: 4 };
  if (t.includes("fuel pump") || t.includes("fuel pressure")) return { name: "fuel pump/fuel pressure system", component: "fuel pump", symptomPrefix: "Engine", costRange: [150, 800], severity: 4 };
  if (t.includes("fuel level") || t.includes("fuel gauge") || t.includes("fuel sender")) return { name: "fuel level sensor system", component: "fuel level sending unit", symptomPrefix: "Fuel gauge", costRange: [100, 600], severity: 2 };
  if (t.includes("fuel tank") || t.includes("fuel filler")) return { name: "fuel tank system", component: "fuel tank pressure sensor", symptomPrefix: "Fuel system", costRange: [100, 600], severity: 2 };
  if (t.includes("fuel") && (t.includes("temp") || t.includes("temperature"))) return { name: "fuel temperature sensor", component: "fuel temperature sensor", symptomPrefix: "Fuel system", costRange: [50, 250], severity: 2 };
  if (t.includes("spark plug") || t.includes("ignition coil") || t.includes("ignition system")) return { name: "ignition system", component: "ignition coil", symptomPrefix: "Engine", costRange: [50, 600], severity: 4 };
  if ((t.includes("misfire") || (t.includes("cylinder") && (t.includes("misfire") || t.includes("knock"))))) return { name: "engine misfire detection", component: "spark plug/coil", symptomPrefix: "Engine", costRange: [10, 4000], severity: 4 };
  if (t.includes("crankshaft") || t.includes("crank position")) return { name: "crankshaft position sensor", component: "crankshaft position sensor", symptomPrefix: "Engine", costRange: [80, 400], severity: 5 };
  if (t.includes("camshaft") || t.includes("cam position")) return { name: "camshaft position sensor", component: "camshaft position sensor", symptomPrefix: "Engine", costRange: [50, 350], severity: 4 };
  if (t.includes("knock sensor") || t.includes("knock control")) return { name: "knock sensor system", component: "knock sensor", symptomPrefix: "Engine", costRange: [150, 500], severity: 3 };
  if (t.includes("throttle") || t.includes("tps") || t.includes("pedal position")) return { name: "throttle position sensor / throttle body", component: "throttle position sensor", symptomPrefix: "Accelerator pedal", costRange: [50, 800], severity: 3 };
  if (t.includes("idle air") || t.includes("idle control") || t.includes("iac")) return { name: "idle air control system", component: "idle air control valve", symptomPrefix: "Engine idle", costRange: [30, 400], severity: 3 };
  if (t.includes("intake air temp") || t.includes("iat")) return { name: "intake air temperature sensor", component: "IAT sensor", symptomPrefix: "Engine", costRange: [30, 200], severity: 2 };
  if (t.includes("coolant temp") || t.includes("ect sensor") || t.includes("engine coolant")) return { name: "engine coolant temperature sensor", component: "coolant temperature sensor", symptomPrefix: "Temperature gauge", costRange: [40, 250], severity: 2 };
  if (t.includes("thermostat") || t.includes("coolant thermostat")) return { name: "cooling system thermostat", component: "thermostat", symptomPrefix: "Engine temperature", costRange: [80, 400], severity: 2 };
  if (t.includes("turbo") || t.includes("boost") || t.includes("supercharger") || t.includes("wastegate")) return { name: "turbocharger/boost system", component: "turbocharger wastegate", symptomPrefix: "Turbocharger", costRange: [200, 2500], severity: 4 };
  if (t.includes("egr") || t.includes("exhaust gas recirculation")) return { name: "EGR (exhaust gas recirculation) system", component: "EGR valve", symptomPrefix: "Check engine light", costRange: [5, 600], severity: 3 };
  if (t.includes("evap") || t.includes("evaporative") || t.includes("purge") || t.includes("vent valve") || t.includes("charcoal") || t.includes("gas cap")) return { name: "EVAP (evaporative emission) system", component: "EVAP purge valve", symptomPrefix: "Fuel vapor system", costRange: [10, 800], severity: 2 };
  if (t.includes("catalyst") || t.includes("catalytic")) return { name: "catalytic converter system", component: "catalytic converter", symptomPrefix: "Exhaust system", costRange: [80, 2500], severity: 3 };
  if (t.includes("secondary air") || t.includes("sai") || t.includes("air injection")) return { name: "secondary air injection system", component: "air injection pump", symptomPrefix: "Emissions system", costRange: [50, 1000], severity: 3 };
  if (t.includes("pcv") || t.includes("positive crankcase")) return { name: "PCV (positive crankcase ventilation) system", component: "PCV valve", symptomPrefix: "Engine", costRange: [10, 150], severity: 2 };
  if (t.includes("manifold absolute") || t.includes("map sensor") || t.includes("baro")) return { name: "MAP/barometric pressure sensor", component: "MAP sensor", symptomPrefix: "Engine", costRange: [40, 300], severity: 3 };
  if (t.includes("vvt") || t.includes("variable valve") || t.includes("cam phaser")) return { name: "VVT (variable valve timing) system", component: "VVT solenoid", symptomPrefix: "Engine", costRange: [30, 2500], severity: 4 };
  if (t.includes("alternator") || t.includes("charging system")) return { name: "charging system", component: "alternator", symptomPrefix: "Battery/charging", costRange: [200, 700], severity: 3 };
  if (t.includes("generator")) return { name: "alternator/generator system", component: "alternator", symptomPrefix: "Battery/charging", costRange: [200, 700], severity: 3 };

  // Transmission
  if (t.includes("transmission")) return { name: "transmission system", component: "transmission solenoid", symptomPrefix: "Transmission", costRange: [150, 5000], severity: 4 };
  if (t.includes("torque converter") || t.includes("tcc")) return { name: "torque converter clutch system", component: "torque converter", symptomPrefix: "Transmission", costRange: [50, 2500], severity: 4 };
  if (t.includes("shift solenoid") || t.includes("pressure control solenoid")) return { name: "transmission shift solenoid", component: "shift solenoid", symptomPrefix: "Transmission shifting", costRange: [200, 800], severity: 4 };
  if (t.includes("gear") && (t.includes("ratio") || t.includes("incorrect") || t.includes("monitor"))) return { name: "transmission gear monitoring", component: "transmission speed sensor", symptomPrefix: "Transmission", costRange: [200, 4000], severity: 4 };

  // Chassis / ABS / Brakes
  if (t.includes("abs") || t.includes("anti-lock")) return { name: "ABS (anti-lock brake) system", component: "ABS module", symptomPrefix: "ABS warning light", costRange: [100, 2000], severity: 3 };
  if (t.includes("traction control") || t.includes("tcs") || t.includes("stability")) return { name: "traction/stability control system", component: "wheel speed sensor", symptomPrefix: "Traction control", costRange: [100, 1200], severity: 3 };
  if (t.includes("wheel speed sensor") || t.includes("wheel sensor")) return { name: "wheel speed sensor", component: "wheel speed sensor", symptomPrefix: "ABS/traction control", costRange: [80, 500], severity: 3 };
  if (t.includes("steering angle") || t.includes("sas")) return { name: "steering angle sensor", component: "steering angle sensor", symptomPrefix: "Steering", costRange: [100, 600], severity: 3 };
  if (t.includes("power steering")) return { name: "power steering system", component: "power steering pressure switch", symptomPrefix: "Steering", costRange: [50, 400], severity: 2 };
  if (t.includes("brake") && (t.includes("switch") || t.includes("circuit") || t.includes("sensor"))) return { name: "brake light switch/circuit", component: "brake light switch", symptomPrefix: "Brake lights", costRange: [15, 150], severity: 2 };
  if (t.includes("park brake") || t.includes("parking brake")) return { name: "parking brake system", component: "parking brake switch", symptomPrefix: "Parking brake", costRange: [15, 300], severity: 1 };
  if (t.includes("yaw rate") || t.includes("lateral acceleration") || t.includes("deceleration")) return { name: "vehicle dynamics sensor", component: "yaw rate sensor", symptomPrefix: "Stability control", costRange: [200, 800], severity: 3 };
  if (t.includes("suspension") || t.includes("ride height") || t.includes("damp")) return { name: "suspension/ride height system", component: "ride height sensor", symptomPrefix: "Suspension", costRange: [150, 1200], severity: 2 };
  if (t.includes("tire pressure")) return { name: "TPMS (tire pressure monitoring) system", component: "TPMS sensor", symptomPrefix: "Tire pressure", costRange: [50, 400], severity: 1 };

  // Body
  if (t.includes("door")) return { name: "power door lock/latch system", component: "door lock actuator", symptomPrefix: "Power door locks", costRange: [80, 500], severity: 1 };
  if (t.includes("window") || t.includes("power window")) return { name: "power window system", component: "window motor/regulator", symptomPrefix: "Power windows", costRange: [100, 500], severity: 1 };
  if (t.includes("mirror")) return { name: "power mirror system", component: "mirror motor", symptomPrefix: "Power mirrors", costRange: [50, 400], severity: 1 };
  if (t.includes("seat") || t.includes("lumbar")) return { name: "power seat system", component: "seat motor/module", symptomPrefix: "Power seats", costRange: [100, 800], severity: 1 };
  if (t.includes("wiper") || t.includes("washer")) return { name: "wiper/washer system", component: "wiper motor", symptomPrefix: "Windshield wipers", costRange: [50, 400], severity: 2 };
  if (t.includes("horn")) return { name: "horn system", component: "horn relay", symptomPrefix: "Horn", costRange: [20, 200], severity: 1 };
  if (t.includes("headlamp") || t.includes("headlight") || t.includes("head light")) return { name: "headlight system", component: "headlight bulb/ballast", symptomPrefix: "Headlights", costRange: [20, 600], severity: 1 };
  if (t.includes("tail lamp") || t.includes("taillight") || t.includes("tail light") || t.includes("brake lamp") || t.includes("brake light")) return { name: "taillight/brake light system", component: "brake light switch/bulb", symptomPrefix: "Tail/brake lights", costRange: [5, 200], severity: 1 };
  if (t.includes("turn signal") || t.includes("turn lamp") || t.includes("hazard")) return { name: "turn signal/hazard system", component: "turn signal flasher", symptomPrefix: "Turn signals", costRange: [10, 200], severity: 1 };
  if (t.includes("interior lamp") || t.includes("interior light") || t.includes("dome lamp") || t.includes("courtesy lamp")) return { name: "interior lighting system", component: "interior light module", symptomPrefix: "Interior lights", costRange: [10, 200], severity: 1 };
  if (t.includes("sunroof") || t.includes("moonroof")) return { name: "sunroof/moonroof system", component: "sunroof motor", symptomPrefix: "Sunroof", costRange: [150, 1000], severity: 1 };
  if (t.includes("climate") || t.includes("a/c") || t.includes("air condition") || t.includes("hvac") || t.includes("blower")) return { name: "climate control / HVAC system", component: "blower motor", symptomPrefix: "Climate control", costRange: [50, 800], severity: 2 };
  if (t.includes("heater")) return { name: "heater system", component: "heater control valve", symptomPrefix: "Cabin heat", costRange: [50, 400], severity: 2 };
  if (t.includes("ambient light") || t.includes("ambient lighting")) return { name: "ambient lighting system", component: "ambient light module", symptomPrefix: "Ambient lighting", costRange: [50, 300], severity: 1 };
  if (t.includes("alarm") || t.includes("anti-theft") || t.includes("security") || t.includes("immobilizer") || t.includes("immobiliser")) return { name: "vehicle security/anti-theft system", component: "security module", symptomPrefix: "Security system", costRange: [100, 800], severity: 2 };
  if (t.includes("audio") || t.includes("radio") || t.includes("speaker") || t.includes("amplifier") || t.includes("infotainment")) return { name: "audio/infotainment system", component: "audio module", symptomPrefix: "Audio system", costRange: [100, 1500], severity: 1 };
  if (t.includes("navigation") || t.includes("gps")) return { name: "navigation system", component: "navigation module", symptomPrefix: "Navigation", costRange: [150, 1500], severity: 1 };
  if (t.includes("instrument") || t.includes("cluster") || t.includes("speedometer") || t.includes("odometer") || t.includes("tachometer") || t.includes("gauge")) return { name: "instrument cluster/gauges", component: "instrument cluster", symptomPrefix: "Dashboard gauges", costRange: [150, 1000], severity: 2 };
  if (t.includes("airbag") || t.includes("srs") || t.includes("supplemental restraint") || t.includes("seat belt") || t.includes("pretensioner") || t.includes("deployment") || t.includes("igniter") || t.includes("inflator") || t.includes("squib") || t.includes("frontal stage") || t.includes("pretension")) return { name: "airbag/SRS (supplemental restraint) system", component: "airbag module", symptomPrefix: "Airbag/SRS", costRange: [100, 2000], severity: 4 };
  if (t.includes("hood") || t.includes("trunk") || t.includes("liftgate") || t.includes("tailgate")) return { name: "hood/trunk/liftgate system", component: "latch actuator", symptomPrefix: "Hood/trunk", costRange: [50, 400], severity: 1 };
  if (t.includes("rain sensor") || t.includes("rain light")) return { name: "rain/light sensor system", component: "rain sensor", symptomPrefix: "Auto wipers", costRange: [100, 500], severity: 1 };
  if (t.includes("park assist") || t.includes("parking assist") || t.includes("park aid") || t.includes("parking aid")) return { name: "parking assist system", component: "parking sensor", symptomPrefix: "Parking sensors", costRange: [80, 600], severity: 1 };
  if (t.includes("blind spot") || t.includes("blindspot")) return { name: "blind spot monitoring system", component: "blind spot radar sensor", symptomPrefix: "Blind spot monitor", costRange: [200, 1200], severity: 2 };
  if (t.includes("lane") || t.includes("lane keep")) return { name: "lane keeping assist system", component: "lane departure camera", symptomPrefix: "Lane assist", costRange: [200, 1500], severity: 2 };
  if (t.includes("cruise control") || t.includes("adaptive cruise")) return { name: "cruise control system", component: "cruise control module", symptomPrefix: "Cruise control", costRange: [100, 1000], severity: 2 };
  if (t.includes("key") || t.includes("ignition") && (t.includes("key") || t.includes("transponder") || t.includes("antenna"))) return { name: "key/immobilizer system", component: "immobilizer antenna", symptomPrefix: "Key/ignition", costRange: [100, 800], severity: 3 };
  if (t.includes("phone") || t.includes("bluetooth") || t.includes("telematics")) return { name: "phone/Bluetooth/telematics system", component: "telematics module", symptomPrefix: "Phone/Bluetooth", costRange: [100, 800], severity: 1 };
  if (t.includes("camera")) return { name: "vehicle camera system", component: "camera module", symptomPrefix: "Camera system", costRange: [150, 1200], severity: 2 };
  if (t.includes("battery") && (t.includes("saver") || t.includes("relay") || t.includes("control"))) return { name: "battery saver/power management system", component: "battery saver relay", symptomPrefix: "Power management", costRange: [30, 300], severity: 1 };
  if (t.includes("compressor")) return { name: "A/C compressor system", component: "A/C compressor", symptomPrefix: "Air conditioning", costRange: [300, 1800], severity: 3 };
  if (t.includes("sunload") || t.includes("solar sensor")) return { name: "sunload/light sensor system", component: "sunload sensor", symptomPrefix: "Climate sensor", costRange: [50, 200], severity: 1 };

  // Network / Communication
  if (t.includes("can bus") || t.includes("can communication") || t.includes("lost communication")) return { name: "CAN bus communication network", component: "CAN bus wiring", symptomPrefix: "Multiple systems", costRange: [100, 2000], severity: 4 };
  if (t.includes("serial") && t.includes("communication")) return { name: "serial data communication link", component: "serial data wiring", symptomPrefix: "Multiple systems", costRange: [100, 2000], severity: 4 };
  if (t.includes("invalid data") || t.includes("data mismatch") || t.includes("implausible")) return { name: "control module data communication", component: "control module", symptomPrefix: "Module communication", costRange: [100, 1500], severity: 3 };
  if (t.includes("configuration") || t.includes("programming") || t.includes("calibration")) return { name: "module configuration/programming", component: "control module", symptomPrefix: "Module setup", costRange: [80, 600], severity: 2 };
  if (t.includes("nvm") || t.includes("memory") || t.includes("checksum") || t.includes("eeprom")) return { name: "control module memory system", component: "control module (PCM/BCM)", symptomPrefix: "Control module", costRange: [150, 2000], severity: 4 };

  // Generic powertrain / electrical
  if (t.includes("ecm") || t.includes("pcm") || t.includes("ecu") || t.includes("control module")) return { name: "engine/body control module", component: "control module", symptomPrefix: "Engine control", costRange: [150, 2000], severity: 4 };
  if (t.includes("battery") && (t.includes("voltage") || t.includes("circuit") || t.includes("sensor"))) return { name: "battery voltage/system voltage", component: "battery", symptomPrefix: "Electrical system", costRange: [100, 500], severity: 2 };
  if (t.includes("voltage") && (t.includes("system") || t.includes("supply"))) return { name: "system voltage supply", component: "voltage regulator", symptomPrefix: "Electrical system", costRange: [80, 400], severity: 2 };
  if (t.includes("ignition")) return { name: "ignition system", component: "ignition module/switch", symptomPrefix: "Ignition", costRange: [100, 600], severity: 3 };
  if (t.includes("tamper") || t.includes("theft")) return { name: "anti-theft/security system", component: "security module", symptomPrefix: "Security system", costRange: [100, 800], severity: 2 };

  // Fallback: analyze by code prefix and second digit
  const prefix2 = c.substring(0, 2);
  // B0xxx codes are airbag/SRS per OBD2 standard
  if (prefix2 === "B0") return { name: "airbag/SRS (supplemental restraint) system", component: "airbag module or impact sensor", symptomPrefix: "Airbag/SRS", costRange: [100, 2000], severity: 4 };
  // B1xxx codes are body electrical
  if (prefix2 === "B1") return { name: "body electrical system", component: "body control module (BCM) or sensor", symptomPrefix: "Body electronics", costRange: [50, 600], severity: 2 };
  // B2xxx codes are also body
  if (prefix2 === "B2") return { name: "body control/comfort system", component: "body control module or actuator", symptomPrefix: "Body electronics", costRange: [50, 600], severity: 2 };
  if (prefix2 === "B3") return { name: "body accessory system", component: "body control module or accessory module", symptomPrefix: "Body accessories", costRange: [50, 600], severity: 2 };

  const prefix = c.substring(0, 1);
  if (prefix === "C") return { name: "chassis/ABS system", component: "wheel speed sensor or ABS module", symptomPrefix: "ABS/traction control", costRange: [100, 1200], severity: 3 };
  if (prefix === "B") return { name: "body electrical system", component: "body control module or wiring", symptomPrefix: "Body electronics", costRange: [50, 600], severity: 2 };
  if (prefix === "U") return { name: "vehicle communication network", component: "CAN bus or control module", symptomPrefix: "Vehicle network", costRange: [100, 2000], severity: 3 };
  if (prefix === "P") return { name: "powertrain/engine system", component: "engine sensor or actuator", symptomPrefix: "Engine performance", costRange: [80, 1200], severity: 3 };

  return { name: "vehicle electrical system", component: "electrical component", symptomPrefix: "Vehicle", costRange: [50, 500], severity: 2 };
}

// ── Title Parsing ──────────────────────────────────────────────
function parseTitle(title: string, code: string): ParsedTitle {
  const t = title.toLowerCase();
  return {
    raw: title,
    isShortToBattery: t.includes("short to battery") || t.includes("short to b+"),
    isShortToGround: t.includes("short to ground") || t.includes("short to gnd"),
    isCircuitOpen: t.includes("circuit open") || t.includes("open circuit"),
    isCircuitHigh: t.includes("circuit high") || t.includes("signal high"),
    isCircuitLow: t.includes("circuit low") || t.includes("signal low"),
    isIntermittent: t.includes("intermittent") || t.includes("erratic"),
    isRangePerformance: t.includes("range/performance") || t.includes("performance problem") || t.includes("out of range"),
    isMalfunction: t.includes("malfunction") || t.includes("failure") || t.includes("defective"),
    isSensor: t.includes("sensor") || t.includes("sender"),
    isSolenoid: t.includes("solenoid"),
    isMotor: t.includes("motor"),
    isRelay: t.includes("relay"),
    isSwitch: t.includes("switch"),
    isValve: t.includes("valve"),
    isActuator: t.includes("actuator"),
    isControl: t.includes("control"),
    isHeater: t.includes("heater"),
    isWiring: t.includes("wiring") || t.includes("harness") || t.includes("connector"),
    isSignalInvalid: t.includes("invalid signal") || t.includes("implausible") || t.includes("incorrect signal"),
    isNotLearned: t.includes("not learned") || t.includes("not programmed") || t.includes("not calibrated"),
    isImplausible: t.includes("implausible") || t.includes("data mismatch"),
    isReserved: t.includes("reserved") || t.includes("iso/sae reserved"),
    system: detectSystem(code, title),
  };
}

// ── Symptom Generation ─────────────────────────────────────────
function generateSymptoms(p: ParsedTitle): string[] {
  const s = p.system;
  const driverSymptoms: string[] = [];
  const technicalSymptoms: string[] = [];

  // What the driver notices first
  if (s.severity >= 3) {
    driverSymptoms.push(`Check Engine Light illuminated${p.isReserved ? " (may be spurious)" : ""}`);
  }

  // System-specific symptoms
  const name = s.symptomPrefix;

  // Common short-to-battery symptoms
  if (p.isShortToBattery) {
    driverSymptoms.push(`${name} staying on or functioning when they shouldn't (powered continuously)`);
    driverSymptoms.push(`Battery draining overnight or when vehicle is parked`);
    driverSymptoms.push(`${name} not responding to controls — stuck in one state`);
    technicalSymptoms.push(`Excessive current draw on the ${s.name} circuit (fuse may blow repeatedly)`);
  }

  // Common short-to-ground symptoms
  if (p.isShortToGround) {
    driverSymptoms.push(`${name} not working or completely dead`);
    driverSymptoms.push(`${name} blowing fuses when activated`);
    technicalSymptoms.push(`Zero voltage on the ${s.name} circuit — short pulls signal to ground`);
  }

  // Common open circuit symptoms
  if (p.isCircuitOpen) {
    driverSymptoms.push(`${name} not working — no response when activated`);
    driverSymptoms.push(`${name} working intermittently, then stopping completely`);
    technicalSymptoms.push(`Infinite resistance in the ${s.name.replace("system", "").trim()} circuit — broken wire or disconnected connector`);
  }

  // Common signal high symptoms
  if (p.isCircuitHigh) {
    driverSymptoms.push(`${name} reading abnormally high or staying at maximum`);
    if (s.name.includes("temp")) {
      driverSymptoms.push(`Temperature gauge pegged at hot even when engine is cold`);
      driverSymptoms.push(`Cooling fans running constantly`);
    }
    if (s.name.includes("fuel level")) {
      driverSymptoms.push(`Fuel gauge reading full even when tank is nearly empty`);
    }
    driverSymptoms.push(`Engine may run rich or have poor fuel economy (PCM sees faulty signal)`);
  }

  // Common signal low symptoms
  if (p.isCircuitLow) {
    driverSymptoms.push(`${name} reading zero or abnormally low`);
    if (s.name.includes("temp")) {
      driverSymptoms.push(`Temperature gauge stays on cold — engine runs rich in extended warm-up mode`);
      driverSymptoms.push(`Poor cabin heat in winter`);
    }
    if (s.name.includes("fuel level")) {
      driverSymptoms.push(`Fuel gauge reads empty — low fuel light on even with full tank`);
    }
  }

  // Common range/performance symptoms
  if (p.isRangePerformance) {
    driverSymptoms.push(`${name} behaving erratically or inconsistently`);
    driverSymptoms.push(`${name} working sometimes, failing other times`);
    driverSymptoms.push(`System performance degrades under specific conditions (temperature, load, etc.)`);
  }

  // Common malfunction/failure symptoms
  if (p.isMalfunction) {
    driverSymptoms.push(`${name} not functioning as expected`);
    driverSymptoms.push(`Warning light or message on dashboard related to the ${s.name}`);
  }

  // Intermittent
  if (p.isIntermittent) {
    driverSymptoms.push(`${name} working fine one moment, failing the next — classic intermittent fault`);
    driverSymptoms.push(`No pattern to failure — seems random`);
    technicalSymptoms.push(`Poor electrical connection causing intermittent signal dropouts`);
  }

  // Specific system additions
  if (p.system.name.includes("door lock")) {
    driverSymptoms.push(`Power door locks not responding to key fob or interior switch`);
    driverSymptoms.push(`Door locks cycling (locking/unlocking) on their own while driving`);
  }
  if (p.system.name.includes("window")) {
    driverSymptoms.push(`Power window won't go up or down — stuck in current position`);
    driverSymptoms.push(`Window moves slowly or only works from one switch`);
  }
  if (p.system.name.includes("wiper")) {
    driverSymptoms.push(`Windshield wipers not working, stuck mid-cycle, or only working on one speed`);
    driverSymptoms.push(`Wipers won't park (return to rest position) when turned off`);
  }
  if (p.system.name.includes("seat")) {
    driverSymptoms.push(`Power seat won't move in one or more directions`);
    driverSymptoms.push(`Seat memory settings not saving or recalling correctly`);
  }
  if (p.system.name.includes("airbag")) {
    driverSymptoms.push(`Airbag/SRS warning light on — airbags may be disabled`);
    driverSymptoms.push(`Seat belt pretensioner may not deploy in a collision`);
  }
  if (p.system.name.includes("headlight")) {
    driverSymptoms.push(`Headlights flickering, not working on one side, or not switching between high/low beam`);
    driverSymptoms.push(`Headlight warning message on instrument cluster display`);
  }
  if (p.system.name.includes("climate") || p.system.name.includes("HVAC") || p.system.name.includes("A/C")) {
    driverSymptoms.push(`Blower motor not working or only working on certain speeds`);
    driverSymptoms.push(`A/C or heat output inconsistent — temperature won't adjust`);
  }
  if (p.system.name.includes("audio") || p.system.name.includes("infotainment")) {
    driverSymptoms.push(`Radio/infotainment screen blank or frozen`);
    driverSymptoms.push(`No sound from speakers — or sound cutting in and out`);
  }
  if (p.system.name.includes("instrument cluster") || p.system.name.includes("gauges")) {
    driverSymptoms.push(`Dashboard gauges flickering, reading incorrectly, or dead`);
    driverSymptoms.push(`Warning lights on the cluster may behave erratically`);
  }
  if (p.system.name.includes("ABS")) {
    driverSymptoms.push(`ABS warning light on — anti-lock braking disabled`);
    driverSymptoms.push(`Brake pedal may pulse or feel unusual under normal braking`);
  }
  if (p.system.name.includes("traction") || p.system.name.includes("stability")) {
    driverSymptoms.push(`Traction control light stays on — system may be disabled`);
    driverSymptoms.push(`Vehicle may feel less stable in wet or slippery conditions`);
  }
  if (p.system.name.includes("CAN bus") || p.system.name.includes("communication")) {
    driverSymptoms.push(`Multiple unrelated warning lights on simultaneously`);
    driverSymptoms.push(`Various electronic systems behaving strangely — gauges, lights, and modules malfunctioning together`);
    driverSymptoms.push(`Vehicle may not start or may stall unexpectedly`);
  }
  if (p.system.name.includes("security") || p.system.name.includes("immobilizer")) {
    driverSymptoms.push(`Security light flashing — vehicle may not start`);
    driverSymptoms.push(`Alarm going off randomly or not arming`);
    driverSymptoms.push(`Engine cranks but won't start — immobilizer preventing start`);
  }
  if (p.system.name.includes("mirror")) {
    driverSymptoms.push(`Power mirrors won't adjust — stuck in current position`);
    driverSymptoms.push(`Mirror defrost/heater not working`);
  }
  if (p.system.name.includes("cruise control")) {
    driverSymptoms.push(`Cruise control won't engage — set button does nothing`);
    driverSymptoms.push(`Cruise control disengages unexpectedly on highway`);
  }
  if (p.system.name.includes("park assist") || p.system.name.includes("parking")) {
    driverSymptoms.push(`Parking sensors not beeping — no warning when approaching obstacles`);
    driverSymptoms.push(`Parking assist warning message on dashboard display`);
  }
  if (p.system.name.includes("sunroof") || p.system.name.includes("moonroof")) {
    driverSymptoms.push(`Sunroof won't open or close — stuck in position`);
    driverSymptoms.push(`Sunroof motor runs but glass doesn't move`);
  }

  // If we still don't have enough, add generic but specific-sounding symptoms
  if (driverSymptoms.length < 2) {
    driverSymptoms.push(`Warning light or malfunction indicator related to the ${s.name} is illuminated`);
    driverSymptoms.push(`The ${s.name} is not operating as designed`);
  }
  if (technicalSymptoms.length < 1) {
    technicalSymptoms.push(`Diagnostic trouble code (DTC) stored in module memory`);
  }

  // Shuffle and take 4-5
  const all = shuffle(driverSymptoms);
  const result = all.slice(0, 3);
  const tech = shuffle(technicalSymptoms);
  result.push(...tech.slice(0, 2));

  // Ensure we have 4-5 unique entries
  const unique = [...new Set(result)];
  while (unique.length < 4) {
    const extras = [
      `Fault may be intermittent — code may clear itself and reappear`,
      `Reduced vehicle functionality related to the ${s.name}`,
      `Other systems that depend on ${s.name} may also show faults`,
    ];
    for (const e of extras) {
      if (!unique.includes(e) && unique.length < 5) unique.push(e);
    }
  }

  return unique.slice(0, 5);
}

// ── Cause Generation ───────────────────────────────────────────
function generateCauses(p: ParsedTitle): string[] {
  const s = p.system;
  const causes: string[] = [];

  // Determine the specific failure mode
  if (p.isShortToBattery) {
    causes.push(`Damaged wiring in the ${s.name} harness shorted to a 12V power source — wiring insulation chafed through from rubbing against metal body panels`);
    causes.push(`Water intrusion or corrosion in ${s.name} electrical connector causing internal short to battery voltage`);
    causes.push(`Failed ${s.component} — internal short to power within the component`);
    causes.push(`Aftermarket accessory installation tapped into the wrong circuit, back-feeding 12V`);
  }

  if (p.isShortToGround) {
    causes.push(`Chafed or pinched wire in the ${s.name} circuit — wire insulation worn through, copper touching vehicle chassis/ground`);
    causes.push(`Failed ${s.component} with internal short to ground — most common when the component gets wet or overheats`);
    causes.push(`Corrosion in the electrical connector allowing current to leak to the connector shell/ground`);
    causes.push(`Damaged wiring harness where it passes through a body panel grommet or near a sharp metal edge`);
  }

  if (p.isCircuitOpen) {
    causes.push(`Broken wire or connector pin in the ${s.name} harness — common at flex points like door jambs or where wiring moves`);
    causes.push(`Disconnected or loose electrical connector — may have been bumped during other repairs`);
    causes.push(`Failed ${s.component} — internal open circuit from age, heat cycling, or vibration`);
    causes.push(`Corrosion completely severing a wire or connector terminal — green crust on copper wiring`);
    causes.push(`Wiring harness damage from rodent chewing — look for nesting material near the engine or under dash`);
  }

  if (p.isCircuitHigh) {
    causes.push(`Failed ${s.component} — internal short causing abnormally high voltage signal to the control module`);
    causes.push(`Wiring shorted to a 5V reference or 12V power wire in the same harness — wires melted together or chafing at a common point`);
    causes.push(`Poor ground connection for the ${s.name} — high resistance in ground path causes voltage to read high`);
    causes.push(`Faulty voltage regulator or power supply within the ${s.component.includes("sensor") ? "sensor" : s.component.split(" ")[s.component.split(" ").length - 1]}`);
  }

  if (p.isCircuitLow) {
    causes.push(`Failed ${s.component} — internal resistance has increased, outputting a signal lower than specification`);
    causes.push(`Damaged wiring or corroded connector in the ${s.name} circuit introducing high resistance`);
    causes.push(`Short to ground in the ${s.name} signal wire — wire chafed through, signal voltage pulled low`);
    causes.push(`Loose or oxidized ground connection for the ${s.component} — clean the ground and retest before replacing parts`);
    causes.push(`Low system voltage (weak battery or failing alternator) causing sensor reference voltage to sag`);
  }

  if (p.isRangePerformance) {
    causes.push(`${capitalizeFirst(s.component)} failing — output signal drifts outside expected range, common with age (80k-120k miles)`);
    causes.push(`Wiring or connector with intermittent high resistance — causes signal to fluctuate, especially with temperature or vibration`);
    causes.push(`Mechanical issue with the ${s.name} causing the sensor/actuator to operate outside its designed range`);
    causes.push(`Contamination or debris affecting ${s.component} operation — dirt, oil, or moisture interfering with readings`);
    causes.push(`Software/calibration issue in the control module — may need reprogramming rather than parts replacement`);
  }

  // Generic but specific causes for any other failure mode
  if (!p.isShortToBattery && !p.isShortToGround && !p.isCircuitOpen && !p.isCircuitHigh && !p.isCircuitLow && !p.isRangePerformance) {
    if (p.isIntermittent) {
      causes.push(`Loose or corroded electrical connector in the ${s.name} — vibration causes intermittent contact`);
      causes.push(`Internal failure in ${s.component} — works when cold, fails when hot (thermal expansion breaks internal connection)`);
      causes.push(`Wiring harness partially broken inside the insulation — flex point in the harness causing intermittent open circuit`);
      causes.push(`Moisture in the ${s.name} electrical connector causing intermittent shorts — common after car wash or heavy rain`);
    } else if (p.isMalfunction) {
      causes.push(`Failed ${s.component} — internal fault from age, heat cycling, and vibration`);
      causes.push(`Damaged wiring or corroded connector in the ${s.name} circuit`);
      causes.push(`Blown fuse for the ${s.name} circuit — check before replacing components`);
      causes.push(`Faulty ${s.component.includes("control module") ? "control module/PCM" : "control module driving the " + s.component}`);
      causes.push(`Loose or corroded ground point shared by the ${s.name}`);
    } else if (p.isSignalInvalid || p.isImplausible) {
      causes.push(`Incorrect data being transmitted between modules — ${s.component} reporting data that doesn't match other sensor inputs`);
      causes.push(`Faulty ${s.component} sending invalid or corrupted data on the communication bus`);
      causes.push(`Wiring harness damage — twisted pair CAN bus wires shorted together or to power/ground`);
      causes.push(`Software bug or outdated calibration in the control module — check for available firmware updates`);
    } else if (p.isNotLearned) {
      causes.push(`${capitalizeFirst(s.component)} was replaced but the control module was not programmed/calibrated for the new part`);
      causes.push(`Battery was disconnected for an extended period — module lost its learned settings/adaptations`);
      causes.push(`Control module software update required — module lost configuration during update process`);
    } else {
      // Generic but specific per system
      causes.push(`Faulty ${s.component} — most common cause, test before replacing`);
      causes.push(`Damaged or corroded wiring/connector in the ${s.name} circuit`);
      causes.push(`Blown fuse or faulty relay for the ${s.name}`);
      causes.push(`Poor ground connection — check and clean all related ground points`);
      causes.push(`Control module fault — rare but possible, only consider after ruling out simpler causes`);
    }
  }

  // Add system-specific causes
  if (p.system.name.includes("door lock")) {
    causes.push(`Broken wire in the door jamb wiring boot — harness flexes every time the door opens, eventually wires break inside the rubber boot`);
  }
  if (p.system.name.includes("window")) {
    causes.push(`Window regulator mechanical failure — cable snapped or pulley broken, motor runs but glass doesn't move`);
  }
  if (p.system.name.includes("CAN bus") || p.system.name.includes("communication")) {
    causes.push(`Corroded module connector allowing moisture to short CAN bus wires — look for green/white corrosion at module pins`);
  }
  if (p.system.name.includes("ABS")) {
    causes.push(`Damaged wheel speed sensor wiring — road debris, loose harness rubbing against axle or suspension`);
  }

  // Ensure 4-6 entries
  const unique = [...new Set(causes)];
  if (unique.length < 4) {
    unique.push(`Wiring harness damage from heat, vibration, or rodent activity`);
    unique.push(`Corroded electrical connector — disconnect, clean with contact cleaner, apply dielectric grease, and reconnect`);
  }
  if (unique.length < 4) {
    unique.push(`Faulty fuse or relay in the ${s.name} power supply circuit`);
    unique.push(`Control module software issue — check for TSBs (Technical Service Bulletins) for your vehicle`);
  }

  return unique.slice(0, 6);
}

// ── Fix Generation ─────────────────────────────────────────────
function generateFixes(p: ParsedTitle, minCost: number, maxCost: number): string[] {
  const s = p.system;
  const fixes: string[] = [];

  // Basic diagnostic fix
  fixes.push(`Scan vehicle with a professional-grade OBD2 scanner to read all stored codes and freeze frame data — note the conditions when the code set ($${randBetween(0, 50)}-${randBetween(80, 150)} at shop, free at auto parts store for basic scan)`);

  // Visual inspection
  fixes.push(`Visually inspect the ${s.name} wiring harness and connectors — look for chafed wires, melted insulation, green corrosion, loose pins, or rodent damage (often free to check yourself, $${randBetween(50, 150)} diagnostic fee at shop)`);

  // Mode-specific fixes
  if (p.isShortToBattery || p.isShortToGround) {
    fixes.push(`Repair or replace damaged section of wiring harness where short is located — solder and heat-shrink all connections, don't use crimp connectors on critical circuits ($${randBetween(80, 200)}-${randBetween(200, 500)} depending on accessibility)`);
    fixes.push(`If ${s.component} is internally shorted, replace with a quality OEM or OEM-equivalent aftermarket unit ($${s.costRange[0]}-${s.costRange[1]})`);
    fixes.push(`Clean all ground points related to the ${s.name} — remove bolt, sand contact surface to bare metal, apply dielectric grease, and torque to spec ($${randBetween(30, 80)}-${randBetween(100, 200)} at shop)`);
  }

  if (p.isCircuitOpen) {
    fixes.push(`Trace the ${s.name} wiring from connector to connector with a multimeter set to continuity/resistance mode — find and repair the break in the circuit ($${randBetween(80, 150)}-${randBetween(200, 500)} labor for diagnosis and repair)`);
    fixes.push(`Check and reseat all connectors in the ${s.name} circuit — disconnect, inspect pins, clean with electrical contact cleaner, apply dielectric grease, and reconnect firmly ($${randBetween(10, 20)} DIY or $${randBetween(50, 100)} shop minimum)`);
    fixes.push(`If ${s.component} has failed internally (open circuit inside), replace it — don't try to repair sealed components ($${s.costRange[0]}-${s.costRange[1]})`);
  }

  if (p.isCircuitHigh || p.isCircuitLow) {
    fixes.push(`Test ${s.component} with a multimeter at the connector — compare readings to factory service manual specs. If out of spec, replace ${s.component} ($${s.costRange[0]}-${s.costRange[1]})`);
    fixes.push(`Check the reference voltage supply to ${s.component} — should be steady 5V (or 12V) — if low, trace back to PCM/BCM voltage regulator ($${randBetween(100, 200)}-${randBetween(300, 800)} if module repair needed)`);
    fixes.push(`Perform a voltage drop test on the ground side of the ${s.name} circuit — more than 0.1V drop means a bad ground that must be cleaned/repaired ($${randBetween(50, 100)}-${randBetween(150, 300)} at shop)`);
  }

  if (p.isRangePerformance) {
    fixes.push(`Replace ${s.component} — slow degradation over time is the most common cause of range/performance codes, especially on vehicles with 100k+ miles ($${s.costRange[0]}-${s.costRange[1]})`);
    fixes.push(`Check for vacuum leaks, exhaust leaks, or mechanical issues that could be causing the ${s.name} to see out-of-range conditions ($${randBetween(80, 150)} diagnostic smoke test + repair)`);
    fixes.push(`Update control module software/firmware — some range/performance codes are fixed by a PCM reflash from the dealer ($${randBetween(80, 200)} at dealer)`);
  }

  // System-specific fix additions
  if (p.system.name.includes("door lock") || p.system.name.includes("window") || p.system.name.includes("mirror") || p.system.name.includes("sunroof")) {
    fixes.push(`Inspect the wiring boot where it passes from the body into the door — this is the #1 failure point. Peel back the rubber boot and check for broken/cracked wires ($${randBetween(0, 0)} DIY inspection)`);
  }

  if (p.system.name.includes("airbag") || p.system.name.includes("SRS")) {
    fixes.push(`WARNING: Airbag/SRS system work should be performed by a qualified professional. Disconnect battery for 15+ minutes before any SRS work. Replace faulty component and clear SRS codes with professional tool ($${randBetween(200, 400)}-${randBetween(600, 1500)} at qualified shop)`);
  }

  if (p.system.name.includes("CAN bus") || p.system.name.includes("communication")) {
    fixes.push(`Perform CAN bus resistance test — should read 60 ohms across CAN-H and CAN-L (two 120-ohm terminating resistors in parallel). If not, find the open or shorted CAN bus wire ($${randBetween(100, 200)}-${randBetween(500, 1500)} electrical diagnosis)`);
  }

  if (p.system.name.includes("security") || p.system.name.includes("immobilizer")) {
    fixes.push(`If the engine cranks but won't start, check the security/immobilizer light — if flashing, try a different key. Key programming may be needed ($${randBetween(100, 200)}-${randBetween(300, 800)} at dealer or locksmith)`);
  }

  // General fix fallback to ensure 4-5
  while (fixes.length < 4) {
    const extras = [
      `Replace ${s.component} if testing confirms it has failed — use OEM quality, avoid the cheapest no-name aftermarket parts that fail in a year ($${s.costRange[0]}-${s.costRange[1]})`,
      `Check and replace any blown fuses in the ${s.name} fuse circuit — if fuse blows again, there's still a short that needs to be found ($${randBetween(1, 5)}-${randBetween(10, 20)} for fuses)`,
      `Perform a wiggle test on the ${s.name} wiring harness while monitoring live data — see if the fault returns when you move the harness at different points ($${randBetween(0, 0)}-${randBetween(100, 150)} diagnostic labor)`,
      `Clear the code and perform a test drive to see if it returns — some codes are one-time events from sensor glitches or low battery voltage (free with basic OBD2 scanner)`,
      `Check for Technical Service Bulletins (TSBs) for your specific vehicle — some manufacturers have extended warranties or updated parts for common failures of the ${s.name}`,
    ];
    for (const e of extras) {
      if (!fixes.includes(e) && fixes.length < 5) fixes.push(e);
    }
  }

  return fixes.slice(0, 5);
}

function capitalizeFirst(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ── Cost Estimation ────────────────────────────────────────────
function estimateCosts(p: ParsedTitle): { min: number; max: number; severity: number } {
  const s = p.system;

  // Adjust costs based on failure mode
  let multiplier = 1.0;
  if (p.isShortToBattery || p.isShortToGround) multiplier = 1.2;
  if (p.isCircuitOpen) multiplier = 1.1;
  if (p.isIntermittent) multiplier = 1.3; // harder to diagnose

  let min = Math.floor(s.costRange[0] * multiplier);
  let max = Math.floor(s.costRange[1] * multiplier);

  // Round for readability
  min = Math.round(min / 10) * 10;
  max = Math.round(max / 100) * 100;

  // Ensure reasonable ranges
  if (min < 5) min = 5;
  if (max < 50) max = 50;
  if (min >= max) max = min * 4;

  return { min, max, severity: s.severity };
}

// ── Is This Code Already Enriched? ─────────────────────────────
function isPlaceholderContent(row: ObdRow): boolean {
  const sym = Array.isArray(row.symptoms_json) ? row.symptoms_json : [];
  const causes = Array.isArray(row.causes_json) ? row.causes_json : [];
  const fixes = Array.isArray(row.fixes_json) ? row.fixes_json : [];

  // B0 codes should always be airbag/SRS — if they have "body electrical", they got the wrong category
  const allText = JSON.stringify(row).toLowerCase();
  if (row.code.match(/^B0/i) && allText.includes("body electrical")) {
    return true;
  }

  // If min_cost is set AND we have at least 3 symptoms/causes/fixes, it's been generated
  // This catches both hand-crafted content and our generated content
  if (row.min_cost !== null && sym.length >= 3 && causes.length >= 3 && fixes.length >= 3) {
    return false;
  }

  // Also recognize hand-crafted Dave content by keyword markers
  const symStr = sym.join(" ");
  if (
    symStr.includes("($") ||
    symStr.includes("MPG") ||
    symStr.includes("flashing Check Engine") ||
    symStr.includes("sulfur") ||
    symStr.includes("cruise control will not")
  ) {
    return false;
  }
  const causeStr = causes.join(" ");
  if (
    causeStr.includes("most common cause") ||
    causeStr.includes("smoke test") ||
    causeStr.includes("DIY") ||
    causeStr.includes("intake manifold gasket")
  ) {
    return false;
  }

  // True placeholder: null costs and/or just 1-2 generic symptoms
  return true;
}

// ── Main ───────────────────────────────────────────────────────
async function main() {
  console.log("╔══════════════════════════════════════════════════════╗");
  console.log("║  Step 1: Fill OBD Content - SEO Content Generation   ║");
  console.log("╚══════════════════════════════════════════════════════╝\n");

  const startTime = Date.now();

  // 1. Get total count
  const { count: totalCount } = await supabase
    .from("obd_codes")
    .select("code", { count: "exact", head: true });
  console.log(`Total OBD codes in database: ${totalCount}`);

  // 2. Find codes that need enrichment (have placeholder content)
  // Strategy: fetch all codes, filter in code for those with placeholder content
  console.log("\nFetching codes to identify which need enrichment...");

  const codesToEnrich: Array<{ code: string; title: string }> = [];
  let scanned = 0;
  let skipped = 0;
  let alreadyEnriched = 0;
  const pageSize = 1000;
  let rangeStart = 0;

  while (true) {
    const { data, error } = await supabase
      .from("obd_codes")
      .select("code, title, symptoms_json, causes_json, fixes_json, min_cost, max_cost")
      .range(rangeStart, rangeStart + pageSize - 1);

    if (error) {
      console.error(`Error fetching page at ${rangeStart}:`, error.message);
      break;
    }
    if (!data || data.length === 0) break;

    for (const row of data) {
      scanned++;
      const obdRow: ObdRow = {
        code: row.code,
        title: row.title,
        symptoms_json: safeParseJsonArray(row.symptoms_json),
        causes_json: safeParseJsonArray(row.causes_json),
        fixes_json: safeParseJsonArray(row.fixes_json),
        min_cost: row.min_cost,
        max_cost: row.max_cost,
      };

      if (isPlaceholderContent(obdRow)) {
        codesToEnrich.push({ code: row.code, title: row.title });
      } else {
        alreadyEnriched++;
      }
    }

    rangeStart += pageSize;
    if (data.length < pageSize) break;
    if (scanned % 5000 === 0) console.log(`  Scanned ${scanned} codes so far...`);
  }

  console.log(`\nResults:`);
  console.log(`  Already enriched (skipping): ${alreadyEnriched}`);
  console.log(`  Need enrichment:            ${codesToEnrich.length}`);
  console.log(`  Total scanned:              ${scanned}`);

  if (codesToEnrich.length === 0) {
    console.log("\nAll codes already enriched. Nothing to do.");
    return;
  }

  // 3. Process codes and generate content
  console.log(`\nGenerating content for ${codesToEnrich.length} codes...`);
  console.log("Processing in batches of 500...\n");

  const BATCH_SIZE = 500;
  let enriched = 0;
  let errors = 0;
  const totalBatches = Math.ceil(codesToEnrich.length / BATCH_SIZE);

  for (let batchNum = 0; batchNum < totalBatches; batchNum++) {
    const batchCodes = codesToEnrich.slice(
      batchNum * BATCH_SIZE,
      (batchNum + 1) * BATCH_SIZE
    );

    const rows = batchCodes.map(({ code, title }) => {
      const parsed = parseTitle(title, code);
      const symptoms = generateSymptoms(parsed);
      const causes = generateCauses(parsed);
      const { min, max, severity } = estimateCosts(parsed);
      const fixes = generateFixes(parsed, min, max);

      return {
        code,
        title,
        severity,
        symptoms_json: symptoms,
        causes_json: causes,
        fixes_json: fixes,
        min_cost: min,
        max_cost: max,
      };
    });

    try {
      const { error } = await supabase
        .from("obd_codes")
        .upsert(rows, { onConflict: "code" });

      if (error) {
        console.error(`  Batch ${batchNum + 1}/${totalBatches} ERROR:`, error.message);
        errors += batchCodes.length;
      } else {
        enriched += batchCodes.length;
        if ((batchNum + 1) % 10 === 0 || batchNum === totalBatches - 1) {
          const elapsed = Math.floor((Date.now() - startTime) / 1000);
          const pct = Math.round((enriched / codesToEnrich.length) * 100);
          console.log(
            `  Batch ${String(batchNum + 1).padStart(3)}/${totalBatches} | ` +
            `Enriched: ${enriched.toLocaleString()} | ` +
            `Progress: ${pct}% | ` +
            `Elapsed: ${elapsed}s`
          );
        }
      }
    } catch (e: any) {
      console.error(`  Batch ${batchNum + 1} CRASH:`, e.message);
      errors += batchCodes.length;
    }
  }

  // 4. Final report
  const elapsedSec = Math.floor((Date.now() - startTime) / 1000);
  const elapsedMin = Math.floor(elapsedSec / 60);
  const remainingSec = elapsedSec % 60;

  // Re-count
  const { count: finalEmpty } = await supabase
    .from("obd_codes")
    .select("code", { count: "exact", head: true })
    .is("min_cost", null);

  console.log("\n╔══════════════════════════════════════════════════════╗");
  console.log("║                  FINAL REPORT                        ║");
  console.log("╚══════════════════════════════════════════════════════╝");
  console.log(`  Total codes in DB:          ${totalCount?.toLocaleString() || "?"}`);
  console.log(`  Already enriched (skipped): ${alreadyEnriched.toLocaleString()}`);
  console.log(`  Newly enriched this run:    ${enriched.toLocaleString()}`);
  console.log(`  Errors:                     ${errors.toLocaleString()}`);
  console.log(`  Codes still null min_cost:  ${finalEmpty?.toLocaleString() || "?"}`);
  console.log(`  Time:                       ${elapsedMin}m ${remainingSec}s`);
  console.log("╚══════════════════════════════════════════════════════╝");
}

main().catch((err) => {
  console.error("Script failed:", err);
  process.exit(1);
});
