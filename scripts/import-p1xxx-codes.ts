// Generate manufacturer-specific P1xxx OBD2 codes
// Run: npx tsx scripts/import-p1xxx-codes.ts
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf-8")
    .split("\n").filter(l => l && !l.startsWith("#"))
    .map(l => l.split("=").map(s => s.trim()))
);

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!);

// Standard OBD2 manufacturer-specific code ranges (30+ brands)
const manufacturerCodes: { codes: string; brand: string }[] = [
  { codes: "P1000-P1099", brand: "Generic manufacturer-specific (all brands)" },
  { codes: "P1100-P1199", brand: "Fuel/Air metering — manufacturer-specific" },
  { codes: "P1200-P1299", brand: "Fuel/Air metering — manufacturer-specific" },
  { codes: "P1300-P1399", brand: "Ignition/Misfire — manufacturer-specific" },
  { codes: "P1400-P1499", brand: "Emissions — manufacturer-specific" },
  { codes: "P1500-P1599", brand: "Idle/Auxiliary — manufacturer-specific" },
  { codes: "P1600-P1699", brand: "Computer/ECU — manufacturer-specific" },
  { codes: "P1700-P1799", brand: "Transmission — manufacturer-specific" },
  { codes: "P1800-P1899", brand: "Transmission — manufacturer-specific" },
  { codes: "P1900-P1999", brand: "Transmission — manufacturer-specific" },
  { codes: "P2000-P2099", brand: "Fuel/Air/Injector — manufacturer-specific" },
  { codes: "P2100-P2199", brand: "Throttle actuator — manufacturer-specific" },
  { codes: "P2200-P2299", brand: "O2 Sensor — manufacturer-specific" },
  { codes: "P2300-P2399", brand: "Ignition coil — manufacturer-specific" },
  { codes: "P2400-P2499", brand: "Evaporative emissions — manufacturer-specific" },
  { codes: "P2500-P2599", brand: "Auxiliary — manufacturer-specific" },
  { codes: "P2600-P2699", brand: "ECM/PCM — manufacturer-specific" },
  { codes: "P2700-P2799", brand: "Transmission — manufacturer-specific" },
  { codes: "P2800-P2899", brand: "Transmission sensors — manufacturer-specific" },
  { codes: "P2900-P2999", brand: "Transmission — manufacturer-specific" },
  { codes: "P3400-P3499", brand: "Cylinder deactivation — Honda VCM" },
  { codes: "C0000-C0999", brand: "Chassis — ABS/TCS/VDC" },
  { codes: "C1000-C1999", brand: "Chassis — ABS manufacturer-specific" },
  { codes: "C2000-C2999", brand: "Chassis — Steering/Suspension" },
  { codes: "B0000-B0999", brand: "Body — Airbags/SRS" },
  { codes: "B1000-B1999", brand: "Body — Instrument cluster" },
  { codes: "B2000-B2999", brand: "Body — Climate control" },
  { codes: "B3000-B3999", brand: "Body — Power accessories" },
  { codes: "U0000-U0999", brand: "Network — CAN bus communication" },
  { codes: "U1000-U1999", brand: "Network — Lost communication" },
  { codes: "U2000-U2999", brand: "Network — Invalid data" },
];

const sampleCodes: { code: string; title: string; severity: number; min?: number; max?: number }[] = [
  { code:"P1128",title:"Fuel System Too Lean (Manufacturer-Specific)",severity:4,min:200,max:800},
  { code:"P1133",title:"HO2S Insufficient Switching (Bank 1 Sensor 1)",severity:3,min:150,max:400},
  { code:"P1141",title:"HO2S Heater Circuit (Bank 1 Sensor 2)",severity:3,min:100,max:300},
  { code:"P1157",title:"HO2S Rich Shift (Bank 2 Sensor 1)",severity:3,min:150,max:400},
  { code:"P1170",title:"Fuel Trim Adaptation (Manufacturer-Specific)",severity:3,min:150,max:600},
  { code:"P1250",title:"Fuel Level Too Low (Manufacturer-Specific)",severity:1,min:0,max:50},
  { code:"P1270",title:"Engine RPM Limiter Reached (Manufacturer-Specific)",severity:2,min:0,max:0},
  { code:"P1288",title:"Thermostat Rationality (Manufacturer-Specific)",severity:3,min:150,max:400},
  { code:"P1297",title:"Turbo Underboost (Manufacturer-Specific)",severity:4,min:400,max:1500},
  { code:"P1312",title:"Ignition Coil Primary Circuit (Manufacturer-Specific)",severity:4,min:200,max:500},
  { code:"P1320",title:"Ignition Signal Primary (Manufacturer-Specific)",severity:4,min:200,max:600},
  { code:"P1336",title:"Crankshaft Position Sensor Variation Not Learned",severity:4,min:200,max:500},
  { code:"P1345",title:"Camshaft Position Correlation (Manufacturer-Specific)",severity:4,min:300,max:1200},
  { code:"P1380",title:"Misfire Detected — Rough Road Data Unavailable",severity:3,min:100,max:400},
  { code:"P1391",title:"Glow Plug Circuit (Manufacturer-Specific)",severity:2,min:80,max:300},
  { code:"P1404",title:"EGR Valve Position (Manufacturer-Specific)",severity:3,min:200,max:500},
  { code:"P1410",title:"Secondary Air Injection System (Manufacturer-Specific)",severity:3,min:150,max:500},
  { code:"P1420",title:"Secondary Air Injection Valve (Manufacturer-Specific)",severity:3,min:150,max:500},
  { code:"P1440",title:"EVAP Purge Valve Stuck Open (Manufacturer-Specific)",severity:3,min:100,max:300},
  { code:"P1450",title:"EVAP System — Unable to Bleed Up Fuel Tank Vacuum",severity:3,min:100,max:350},
  { code:"P1457",title:"EVAP System Leak Detected (Manufacturer-Specific)",severity:3,min:50,max:250},
  { code:"P1460",title:"Cooling Fan Control System (Manufacturer-Specific)",severity:3,min:150,max:400},
  { code:"P1480",title:"Cooling Fan Speed Signal (Manufacturer-Specific)",severity:3,min:100,max:350},
  { code:"P1500",title:"Idle Speed Control System (Manufacturer-Specific)",severity:3,min:150,max:500},
  { code:"P1510",title:"Idle Air Control Valve (Manufacturer-Specific)",severity:3,min:100,max:350},
  { code:"P1520",title:"Intake Manifold Runner Control (Manufacturer-Specific)",severity:3,min:200,max:600},
  { code:"P1530",title:"A/C Compressor Clutch Circuit (Manufacturer-Specific)",severity:2,min:100,max:800},
  { code:"P1550",title:"Battery Current Sensor (Manufacturer-Specific)",severity:2,min:100,max:300},
  { code:"P1560",title:"System Voltage (Manufacturer-Specific)",severity:2,min:50,max:300},
  { code:"P1580",title:"Throttle Actuator Mechanical (Manufacturer-Specific)",severity:4,min:300,max:900},
  { code:"P1600",title:"ECM/PCM Internal Error (Manufacturer-Specific)",severity:5,min:500,max:2000},
  { code:"P1620",title:"ECM/PCM Processor Fault (Manufacturer-Specific)",severity:5,min:600,max:2500},
  { code:"P1630",title:"ECM/PCM Fault — Anti-Theft System (Manufacturer-Specific)",severity:5,min:200,max:1200},
  { code:"P1640",title:"ECM/PCM Internal Circuit (Manufacturer-Specific)",severity:5,min:500,max:2000},
  { code:"P1650",title:"ECM/PCM Power Relay Control (Manufacturer-Specific)",severity:4,min:150,max:500},
  { code:"P1660",title:"ECM/PCM Output Circuit (Manufacturer-Specific)",severity:4,min:200,max:600},
  { code:"P1670",title:"ECM/PCM Relay (Manufacturer-Specific)",severity:4,min:100,max:400},
  { code:"P1680",title:"ECM/PCM Processor (Manufacturer-Specific)",severity:5,min:500,max:2000},
  { code:"P1700",title:"Transmission Control System (Manufacturer-Specific)",severity:4,min:300,max:1500},
  { code:"P1710",title:"Transmission Fluid Pressure (Manufacturer-Specific)",severity:4,min:200,max:1200},
  { code:"P1720",title:"Vehicle Speed Sensor (VSS) Circuit — Manufacturer-Specific",severity:3,min:150,max:500},
  { code:"P1730",title:"Transmission Gear Ratio Error (Manufacturer-Specific)",severity:5,min:800,max:4000},
  { code:"P1740",title:"Torque Converter Clutch (Manufacturer-Specific)",severity:4,min:400,max:1500},
  { code:"P1750",title:"Transmission Solenoid (Manufacturer-Specific)",severity:4,min:200,max:800},
  { code:"P1770",title:"Transmission Fluid Temperature Sensor (Manufacturer-Specific)",severity:3,min:150,max:500},
  { code:"P1780",title:"Transmission Control Switch (Manufacturer-Specific)",severity:3,min:100,max:400},
  { code:"P1800",title:"Transmission 4WD Transfer Case (Manufacturer-Specific)",severity:4,min:300,max:1500},
  { code:"P1900",title:"Transmission Output Speed Sensor (Manufacturer-Specific)",severity:3,min:150,max:500},
  { code:"P2100",title:"Throttle Actuator Control Motor Circuit (Manufacturer-Specific)",severity:5,min:400,max:1200},
  { code:"P2135",title:"Throttle/Pedal Position Sensor Voltage Correlation",severity:5,min:300,max:900},
  { code:"P2509",title:"ECM/PCM Power Input Signal Intermittent (Manufacturer-Specific)",severity:4,min:150,max:500},
  { code:"P2600",title:"Coolant Pump Control Circuit (Manufacturer-Specific)",severity:3,min:200,max:600},
  { code:"P2700",title:"Transmission Friction Element A (Manufacturer-Specific)",severity:5,min:800,max:3500},
  { code:"P2800",title:"Transmission Range Sensor (Manufacturer-Specific)",severity:3,min:150,max:500},
];

async function main() {
  const { data: existing } = await supabase.from("obd_codes").select("code");
  const existingSet = new Set((existing ?? []).map((r: any) => r.code));

  const toInsert: any[] = [];
  for (const sc of sampleCodes) {
    if (existingSet.has(sc.code)) continue;
    const prefix = sc.code.toUpperCase();
    let symptoms = ["Diagnostic trouble code stored", "Check engine light may illuminate"];
    if (sc.severity >= 4) symptoms.push("Reduced engine performance", "Vehicle may enter limp mode");
    if (sc.code.startsWith("P17") || sc.code.startsWith("P18") || sc.code.startsWith("P19") || sc.code.startsWith("P27") || sc.code.startsWith("P28"))
      symptoms = ["Transmission warning light", "Harsh shifting or slipping", "Diagnostic trouble code stored"];

    let causes = ["Fault in related component or circuit", "Manufacturer-specific condition — consult vehicle service manual"];
    let fixes = ["Diagnose with professional OBD2 scan tool", "Inspect related components per manufacturer service manual"];

    toInsert.push({
      code: sc.code,
      title: sc.title,
      severity: sc.severity,
      symptoms_json: symptoms,
      causes_json: causes,
      fixes_json: fixes,
      min_cost: sc.min ?? null,
      max_cost: sc.max ?? null,
    });
  }

  console.log(`Upserting ${toInsert.length} manufacturer-specific codes...`);
  const { error } = await supabase.from("obd_codes").upsert(toInsert, { onConflict: "code" });
  if (error) console.log("Error:", error.message);
  else console.log("Done!");

  const { count } = await supabase.from("obd_codes").select("code", { count: "exact", head: true });
  console.log(`Total codes in DB: ${count}`);
}

main().catch(console.error);
