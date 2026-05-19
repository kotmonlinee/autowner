// Seed repair cost data — run: npx tsx scripts/seed-repair-costs.ts
// Supports importing from CSV/JSON files or using the built-in dataset.

import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";

// Parse .env.local manually
const env = Object.fromEntries(
  readFileSync(".env.local", "utf-8")
    .split("\n")
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => {
      const [key, ...rest] = l.split("=");
      return [key.trim(), rest.join("=").trim()];
    })
);

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL!,
  env.SUPABASE_SERVICE_ROLE_KEY!
);

// ============================================================================
// Types
// ============================================================================

interface RepairCostRow {
  repair_slug: string;
  repair_name: string;
  make: string;
  model: string;
  tier: string;
  tier_order: number;
  min_cost: number;
  max_cost: number;
  avg_cost: number;
  labor_cost: number;
  parts_cost: number;
  confidence_level: string;
}

type TierName = "economy" | "mid_range" | "luxury" | "truck_suv" | "european";

interface TierVehicle {
  make: string;
  model: string;
}

interface RepairJob {
  slug: string;
  name: string;
  tiers: Record<TierName, {
    min: number;
    max: number;
    avg: number;
    labor: number;
    parts: number;
  }>;
  confidence: "high" | "medium" | "low";
}

// ============================================================================
// Tier definitions — representative vehicle per tier
// ============================================================================

const TIERS: Record<TierName, { order: number; vehicles: TierVehicle[] }> = {
  economy: {
    order: 0,
    vehicles: [
      { make: "Honda", model: "Civic" },
      { make: "Toyota", model: "Corolla" },
    ],
  },
  mid_range: {
    order: 1,
    vehicles: [
      { make: "Ford", model: "F-150" },
      { make: "Honda", model: "Accord" },
    ],
  },
  luxury: {
    order: 2,
    vehicles: [
      { make: "BMW", model: "3 Series" },
      { make: "Mercedes-Benz", model: "C-Class" },
    ],
  },
  truck_suv: {
    order: 3,
    vehicles: [
      { make: "Chevrolet", model: "Tahoe" },
      { make: "Ram", model: "1500" },
    ],
  },
  european: {
    order: 4,
    vehicles: [
      { make: "Audi", model: "A4" },
      { make: "Volvo", model: "S60" },
    ],
  },
};

// ============================================================================
// Built-in repair jobs dataset (55 common repairs)
// Prices based on US market data (RepairPal, AAA, Kelley Blue Book) circa 2024-2025
// ============================================================================

const BUILT_IN_JOBS: RepairJob[] = [
  {
    slug: "brake_pads_front",
    name: "Brake Pads Replacement - Front",
    tiers: {
      economy: { min: 120, max: 230, avg: 165, labor: 95, parts: 70 },
      mid_range: { min: 150, max: 290, avg: 210, labor: 110, parts: 100 },
      luxury: { min: 280, max: 480, avg: 370, labor: 180, parts: 190 },
      truck_suv: { min: 180, max: 340, avg: 250, labor: 130, parts: 120 },
      european: { min: 270, max: 460, avg: 355, labor: 175, parts: 180 },
    },
    confidence: "high",
  },
  {
    slug: "brake_pads_rear",
    name: "Brake Pads Replacement - Rear",
    tiers: {
      economy: { min: 110, max: 220, avg: 155, labor: 90, parts: 65 },
      mid_range: { min: 140, max: 270, avg: 195, labor: 105, parts: 90 },
      luxury: { min: 260, max: 460, avg: 350, labor: 170, parts: 180 },
      truck_suv: { min: 170, max: 320, avg: 235, labor: 120, parts: 115 },
      european: { min: 250, max: 430, avg: 330, labor: 165, parts: 165 },
    },
    confidence: "high",
  },
  {
    slug: "rotor_front",
    name: "Rotor Replacement - Front",
    tiers: {
      economy: { min: 220, max: 380, avg: 290, labor: 150, parts: 140 },
      mid_range: { min: 280, max: 480, avg: 370, labor: 180, parts: 190 },
      luxury: { min: 450, max: 780, avg: 600, labor: 280, parts: 320 },
      truck_suv: { min: 320, max: 560, avg: 430, labor: 200, parts: 230 },
      european: { min: 430, max: 750, avg: 580, labor: 270, parts: 310 },
    },
    confidence: "high",
  },
  {
    slug: "rotor_rear",
    name: "Rotor Replacement - Rear",
    tiers: {
      economy: { min: 200, max: 360, avg: 270, labor: 145, parts: 125 },
      mid_range: { min: 260, max: 450, avg: 345, labor: 170, parts: 175 },
      luxury: { min: 420, max: 740, avg: 570, labor: 260, parts: 310 },
      truck_suv: { min: 300, max: 520, avg: 400, labor: 190, parts: 210 },
      european: { min: 400, max: 710, avg: 545, labor: 255, parts: 290 },
    },
    confidence: "high",
  },
  {
    slug: "oil_change_synthetic",
    name: "Oil Change - Full Synthetic",
    tiers: {
      economy: { min: 45, max: 85, avg: 65, labor: 20, parts: 45 },
      mid_range: { min: 60, max: 110, avg: 85, labor: 25, parts: 60 },
      luxury: { min: 90, max: 180, avg: 135, labor: 45, parts: 90 },
      truck_suv: { min: 70, max: 130, avg: 100, labor: 30, parts: 70 },
      european: { min: 85, max: 170, avg: 128, labor: 40, parts: 88 },
    },
    confidence: "high",
  },
  {
    slug: "transmission_fluid",
    name: "Transmission Fluid Change",
    tiers: {
      economy: { min: 130, max: 250, avg: 185, labor: 90, parts: 95 },
      mid_range: { min: 150, max: 300, avg: 220, labor: 100, parts: 120 },
      luxury: { min: 280, max: 500, avg: 385, labor: 180, parts: 205 },
      truck_suv: { min: 180, max: 350, avg: 260, labor: 120, parts: 140 },
      european: { min: 260, max: 470, avg: 360, labor: 170, parts: 190 },
    },
    confidence: "high",
  },
  {
    slug: "water_pump",
    name: "Water Pump Replacement",
    tiers: {
      economy: { min: 310, max: 560, avg: 425, labor: 280, parts: 145 },
      mid_range: { min: 380, max: 680, avg: 520, labor: 320, parts: 200 },
      luxury: { min: 620, max: 1100, avg: 850, labor: 520, parts: 330 },
      truck_suv: { min: 430, max: 800, avg: 600, labor: 360, parts: 240 },
      european: { min: 600, max: 1050, avg: 810, labor: 500, parts: 310 },
    },
    confidence: "high",
  },
  {
    slug: "alternator",
    name: "Alternator Replacement",
    tiers: {
      economy: { min: 320, max: 580, avg: 440, labor: 180, parts: 260 },
      mid_range: { min: 380, max: 700, avg: 530, labor: 220, parts: 310 },
      luxury: { min: 650, max: 1200, avg: 910, labor: 380, parts: 530 },
      truck_suv: { min: 420, max: 800, avg: 600, labor: 250, parts: 350 },
      european: { min: 620, max: 1150, avg: 870, labor: 360, parts: 510 },
    },
    confidence: "high",
  },
  {
    slug: "starter",
    name: "Starter Replacement",
    tiers: {
      economy: { min: 290, max: 520, avg: 395, labor: 170, parts: 225 },
      mid_range: { min: 350, max: 650, avg: 490, labor: 210, parts: 280 },
      luxury: { min: 580, max: 1050, avg: 800, labor: 350, parts: 450 },
      truck_suv: { min: 400, max: 740, avg: 560, labor: 240, parts: 320 },
      european: { min: 560, max: 1020, avg: 775, labor: 340, parts: 435 },
    },
    confidence: "high",
  },
  {
    slug: "ac_compressor",
    name: "AC Compressor Replacement",
    tiers: {
      economy: { min: 600, max: 950, avg: 765, labor: 350, parts: 415 },
      mid_range: { min: 700, max: 1150, avg: 910, labor: 400, parts: 510 },
      luxury: { min: 1200, max: 2100, avg: 1625, labor: 700, parts: 925 },
      truck_suv: { min: 750, max: 1300, avg: 1010, labor: 420, parts: 590 },
      european: { min: 1100, max: 1950, avg: 1500, labor: 650, parts: 850 },
    },
    confidence: "high",
  },
  {
    slug: "timing_belt",
    name: "Timing Belt Replacement",
    tiers: {
      economy: { min: 450, max: 800, avg: 610, labor: 380, parts: 230 },
      mid_range: { min: 550, max: 950, avg: 735, labor: 420, parts: 315 },
      luxury: { min: 850, max: 1600, avg: 1205, labor: 650, parts: 555 },
      truck_suv: { min: 600, max: 1050, avg: 810, labor: 460, parts: 350 },
      european: { min: 820, max: 1500, avg: 1140, labor: 620, parts: 520 },
    },
    confidence: "high",
  },
  {
    slug: "spark_plugs",
    name: "Spark Plugs Replacement",
    tiers: {
      economy: { min: 140, max: 280, avg: 205, labor: 140, parts: 65 },
      mid_range: { min: 180, max: 360, avg: 265, labor: 180, parts: 85 },
      luxury: { min: 320, max: 600, avg: 450, labor: 280, parts: 170 },
      truck_suv: { min: 200, max: 420, avg: 300, labor: 200, parts: 100 },
      european: { min: 300, max: 560, avg: 420, labor: 260, parts: 160 },
    },
    confidence: "high",
  },
  {
    slug: "oxygen_sensor",
    name: "Oxygen Sensor Replacement",
    tiers: {
      economy: { min: 160, max: 310, avg: 230, labor: 100, parts: 130 },
      mid_range: { min: 190, max: 380, avg: 280, labor: 120, parts: 160 },
      luxury: { min: 310, max: 580, avg: 435, labor: 180, parts: 255 },
      truck_suv: { min: 210, max: 420, avg: 305, labor: 135, parts: 170 },
      european: { min: 300, max: 560, avg: 420, labor: 170, parts: 250 },
    },
    confidence: "high",
  },
  {
    slug: "catalytic_converter",
    name: "Catalytic Converter Replacement",
    tiers: {
      economy: { min: 900, max: 1800, avg: 1320, labor: 300, parts: 1020 },
      mid_range: { min: 1100, max: 2200, avg: 1615, labor: 350, parts: 1265 },
      luxury: { min: 1800, max: 3500, avg: 2600, labor: 500, parts: 2100 },
      truck_suv: { min: 1200, max: 2500, avg: 1805, labor: 380, parts: 1425 },
      european: { min: 1700, max: 3300, avg: 2450, labor: 480, parts: 1970 },
    },
    confidence: "high",
  },
  {
    slug: "fuel_pump",
    name: "Fuel Pump Replacement",
    tiers: {
      economy: { min: 400, max: 720, avg: 550, labor: 280, parts: 270 },
      mid_range: { min: 480, max: 880, avg: 665, labor: 320, parts: 345 },
      luxury: { min: 750, max: 1400, avg: 1055, labor: 480, parts: 575 },
      truck_suv: { min: 530, max: 980, avg: 740, labor: 350, parts: 390 },
      european: { min: 720, max: 1350, avg: 1015, labor: 460, parts: 555 },
    },
    confidence: "high",
  },
  {
    slug: "radiator",
    name: "Radiator Replacement",
    tiers: {
      economy: { min: 350, max: 680, avg: 500, labor: 240, parts: 260 },
      mid_range: { min: 420, max: 820, avg: 605, labor: 285, parts: 320 },
      luxury: { min: 680, max: 1300, avg: 975, labor: 450, parts: 525 },
      truck_suv: { min: 470, max: 900, avg: 670, labor: 310, parts: 360 },
      european: { min: 650, max: 1250, avg: 935, labor: 430, parts: 505 },
    },
    confidence: "high",
  },
  {
    slug: "thermostat",
    name: "Thermostat Replacement",
    tiers: {
      economy: { min: 150, max: 290, avg: 215, labor: 165, parts: 50 },
      mid_range: { min: 180, max: 360, avg: 265, labor: 195, parts: 70 },
      luxury: { min: 310, max: 580, avg: 435, labor: 310, parts: 125 },
      truck_suv: { min: 200, max: 400, avg: 295, labor: 210, parts: 85 },
      european: { min: 290, max: 550, avg: 410, labor: 295, parts: 115 },
    },
    confidence: "high",
  },
  {
    slug: "battery",
    name: "Battery Replacement",
    tiers: {
      economy: { min: 90, max: 200, avg: 140, labor: 20, parts: 120 },
      mid_range: { min: 110, max: 250, avg: 175, labor: 25, parts: 150 },
      luxury: { min: 250, max: 450, avg: 340, labor: 60, parts: 280 },
      truck_suv: { min: 130, max: 300, avg: 210, labor: 30, parts: 180 },
      european: { min: 220, max: 420, avg: 315, labor: 55, parts: 260 },
    },
    confidence: "high",
  },
  {
    slug: "serpentine_belt",
    name: "Serpentine Belt Replacement",
    tiers: {
      economy: { min: 85, max: 190, avg: 135, labor: 90, parts: 45 },
      mid_range: { min: 100, max: 230, avg: 160, labor: 100, parts: 60 },
      luxury: { min: 180, max: 370, avg: 270, labor: 180, parts: 90 },
      truck_suv: { min: 115, max: 260, avg: 185, labor: 110, parts: 75 },
      european: { min: 170, max: 350, avg: 255, labor: 170, parts: 85 },
    },
    confidence: "high",
  },
  {
    slug: "valve_cover_gasket",
    name: "Valve Cover Gasket Replacement",
    tiers: {
      economy: { min: 160, max: 320, avg: 235, labor: 190, parts: 45 },
      mid_range: { min: 200, max: 400, avg: 290, labor: 230, parts: 60 },
      luxury: { min: 380, max: 700, avg: 530, labor: 400, parts: 130 },
      truck_suv: { min: 220, max: 450, avg: 325, labor: 250, parts: 75 },
      european: { min: 350, max: 650, avg: 490, labor: 370, parts: 120 },
    },
    confidence: "high",
  },
  {
    slug: "head_gasket",
    name: "Head Gasket Replacement",
    tiers: {
      economy: { min: 1500, max: 2600, avg: 2015, labor: 1550, parts: 465 },
      mid_range: { min: 1800, max: 3200, avg: 2450, labor: 1800, parts: 650 },
      luxury: { min: 3200, max: 5500, avg: 4275, labor: 3200, parts: 1075 },
      truck_suv: { min: 2100, max: 3700, avg: 2850, labor: 2050, parts: 800 },
      european: { min: 3000, max: 5200, avg: 4040, labor: 3000, parts: 1040 },
    },
    confidence: "high",
  },
  {
    slug: "power_steering_pump",
    name: "Power Steering Pump Replacement",
    tiers: {
      economy: { min: 350, max: 620, avg: 475, labor: 250, parts: 225 },
      mid_range: { min: 410, max: 750, avg: 570, labor: 290, parts: 280 },
      luxury: { min: 680, max: 1250, avg: 950, labor: 480, parts: 470 },
      truck_suv: { min: 450, max: 850, avg: 635, labor: 320, parts: 315 },
      european: { min: 650, max: 1200, avg: 910, labor: 460, parts: 450 },
    },
    confidence: "high",
  },
  {
    slug: "wheel_bearing",
    name: "Wheel Bearing Replacement",
    tiers: {
      economy: { min: 220, max: 430, avg: 315, labor: 160, parts: 155 },
      mid_range: { min: 270, max: 520, avg: 385, labor: 190, parts: 195 },
      luxury: { min: 440, max: 820, avg: 620, labor: 310, parts: 310 },
      truck_suv: { min: 300, max: 580, avg: 430, labor: 210, parts: 220 },
      european: { min: 420, max: 780, avg: 590, labor: 295, parts: 295 },
    },
    confidence: "high",
  },
  {
    slug: "struts_front",
    name: "Struts Replacement - Front",
    tiers: {
      economy: { min: 420, max: 800, avg: 595, labor: 315, parts: 280 },
      mid_range: { min: 500, max: 950, avg: 710, labor: 360, parts: 350 },
      luxury: { min: 850, max: 1600, avg: 1205, labor: 580, parts: 625 },
      truck_suv: { min: 550, max: 1050, avg: 785, labor: 390, parts: 395 },
      european: { min: 800, max: 1500, avg: 1130, labor: 550, parts: 580 },
    },
    confidence: "high",
  },
  {
    slug: "shocks_rear",
    name: "Shocks Replacement - Rear",
    tiers: {
      economy: { min: 280, max: 550, avg: 405, labor: 210, parts: 195 },
      mid_range: { min: 340, max: 660, avg: 490, labor: 245, parts: 245 },
      luxury: { min: 560, max: 1050, avg: 790, labor: 390, parts: 400 },
      truck_suv: { min: 370, max: 730, avg: 540, labor: 265, parts: 275 },
      european: { min: 530, max: 1000, avg: 750, labor: 375, parts: 375 },
    },
    confidence: "high",
  },
  {
    slug: "tie_rod_ends",
    name: "Tie Rod Ends Replacement",
    tiers: {
      economy: { min: 190, max: 370, avg: 275, labor: 145, parts: 130 },
      mid_range: { min: 230, max: 450, avg: 335, labor: 170, parts: 165 },
      luxury: { min: 380, max: 720, avg: 540, labor: 280, parts: 260 },
      truck_suv: { min: 260, max: 510, avg: 380, labor: 195, parts: 185 },
      european: { min: 360, max: 690, avg: 515, labor: 265, parts: 250 },
    },
    confidence: "high",
  },
  {
    slug: "ball_joints",
    name: "Ball Joints Replacement",
    tiers: {
      economy: { min: 250, max: 480, avg: 355, labor: 200, parts: 155 },
      mid_range: { min: 300, max: 580, avg: 430, labor: 230, parts: 200 },
      luxury: { min: 500, max: 950, avg: 710, labor: 380, parts: 330 },
      truck_suv: { min: 340, max: 660, avg: 490, labor: 260, parts: 230 },
      european: { min: 470, max: 900, avg: 670, labor: 360, parts: 310 },
    },
    confidence: "high",
  },
  {
    slug: "control_arms",
    name: "Control Arms Replacement",
    tiers: {
      economy: { min: 300, max: 580, avg: 430, labor: 240, parts: 190 },
      mid_range: { min: 360, max: 700, avg: 520, labor: 280, parts: 240 },
      luxury: { min: 600, max: 1150, avg: 855, labor: 440, parts: 415 },
      truck_suv: { min: 410, max: 800, avg: 590, labor: 310, parts: 280 },
      european: { min: 570, max: 1100, avg: 815, labor: 420, parts: 395 },
    },
    confidence: "high",
  },
  {
    slug: "cv_axle",
    name: "CV Axle Replacement",
    tiers: {
      economy: { min: 280, max: 550, avg: 405, labor: 210, parts: 195 },
      mid_range: { min: 340, max: 660, avg: 490, labor: 250, parts: 240 },
      luxury: { min: 550, max: 1050, avg: 785, labor: 400, parts: 385 },
      truck_suv: { min: 380, max: 740, avg: 550, labor: 280, parts: 270 },
      european: { min: 520, max: 1000, avg: 745, labor: 380, parts: 365 },
    },
    confidence: "high",
  },
  {
    slug: "muffler",
    name: "Muffler Replacement",
    tiers: {
      economy: { min: 180, max: 400, avg: 280, labor: 130, parts: 150 },
      mid_range: { min: 220, max: 480, avg: 340, labor: 145, parts: 195 },
      luxury: { min: 400, max: 800, avg: 590, labor: 240, parts: 350 },
      truck_suv: { min: 250, max: 550, avg: 390, labor: 160, parts: 230 },
      european: { min: 380, max: 760, avg: 560, labor: 230, parts: 330 },
    },
    confidence: "high",
  },
  {
    slug: "egr_valve",
    name: "EGR Valve Replacement",
    tiers: {
      economy: { min: 230, max: 450, avg: 335, labor: 155, parts: 180 },
      mid_range: { min: 270, max: 540, avg: 395, labor: 180, parts: 215 },
      luxury: { min: 430, max: 850, avg: 630, labor: 280, parts: 350 },
      truck_suv: { min: 300, max: 600, avg: 440, labor: 200, parts: 240 },
      european: { min: 410, max: 800, avg: 595, labor: 265, parts: 330 },
    },
    confidence: "medium",
  },
  {
    slug: "mass_air_flow_sensor",
    name: "Mass Air Flow Sensor Replacement",
    tiers: {
      economy: { min: 180, max: 360, avg: 265, labor: 80, parts: 185 },
      mid_range: { min: 210, max: 430, avg: 310, labor: 95, parts: 215 },
      luxury: { min: 350, max: 680, avg: 500, labor: 150, parts: 350 },
      truck_suv: { min: 240, max: 480, avg: 350, labor: 110, parts: 240 },
      european: { min: 330, max: 640, avg: 475, labor: 140, parts: 335 },
    },
    confidence: "high",
  },
  {
    slug: "ignition_coil",
    name: "Ignition Coil Replacement",
    tiers: {
      economy: { min: 150, max: 320, avg: 230, labor: 105, parts: 125 },
      mid_range: { min: 180, max: 390, avg: 280, labor: 125, parts: 155 },
      luxury: { min: 300, max: 600, avg: 440, labor: 200, parts: 240 },
      truck_suv: { min: 200, max: 430, avg: 305, labor: 135, parts: 170 },
      european: { min: 280, max: 560, avg: 410, labor: 190, parts: 220 },
    },
    confidence: "high",
  },
  {
    slug: "clutch",
    name: "Clutch Replacement",
    tiers: {
      economy: { min: 800, max: 1400, avg: 1080, labor: 600, parts: 480 },
      mid_range: { min: 950, max: 1700, avg: 1300, labor: 700, parts: 600 },
      luxury: { min: 1600, max: 3000, avg: 2250, labor: 1100, parts: 1150 },
      truck_suv: { min: 1100, max: 2000, avg: 1520, labor: 800, parts: 720 },
      european: { min: 1500, max: 2800, avg: 2100, labor: 1050, parts: 1050 },
    },
    confidence: "high",
  },
  {
    slug: "fuel_injector",
    name: "Fuel Injector Replacement",
    tiers: {
      economy: { min: 280, max: 550, avg: 405, labor: 210, parts: 195 },
      mid_range: { min: 340, max: 660, avg: 490, labor: 250, parts: 240 },
      luxury: { min: 550, max: 1050, avg: 785, labor: 400, parts: 385 },
      truck_suv: { min: 380, max: 740, avg: 550, labor: 280, parts: 270 },
      european: { min: 520, max: 1000, avg: 745, labor: 380, parts: 365 },
    },
    confidence: "high",
  },
  {
    slug: "brake_caliper",
    name: "Brake Caliper Replacement",
    tiers: {
      economy: { min: 230, max: 460, avg: 335, labor: 145, parts: 190 },
      mid_range: { min: 280, max: 550, avg: 405, labor: 170, parts: 235 },
      luxury: { min: 450, max: 880, avg: 650, labor: 280, parts: 370 },
      truck_suv: { min: 310, max: 620, avg: 455, labor: 195, parts: 260 },
      european: { min: 430, max: 840, avg: 620, labor: 265, parts: 355 },
    },
    confidence: "high",
  },
  {
    slug: "cabin_air_filter",
    name: "Cabin Air Filter Replacement",
    tiers: {
      economy: { min: 35, max: 80, avg: 55, labor: 25, parts: 30 },
      mid_range: { min: 40, max: 95, avg: 65, labor: 30, parts: 35 },
      luxury: { min: 70, max: 150, avg: 105, labor: 50, parts: 55 },
      truck_suv: { min: 45, max: 110, avg: 75, labor: 35, parts: 40 },
      european: { min: 65, max: 140, avg: 100, labor: 45, parts: 55 },
    },
    confidence: "high",
  },
  {
    slug: "engine_air_filter",
    name: "Engine Air Filter Replacement",
    tiers: {
      economy: { min: 30, max: 70, avg: 48, labor: 18, parts: 30 },
      mid_range: { min: 35, max: 85, avg: 58, labor: 22, parts: 36 },
      luxury: { min: 60, max: 140, avg: 98, labor: 38, parts: 60 },
      truck_suv: { min: 40, max: 100, avg: 68, labor: 25, parts: 43 },
      european: { min: 55, max: 130, avg: 90, labor: 35, parts: 55 },
    },
    confidence: "high",
  },
  {
    slug: "pcv_valve",
    name: "PCV Valve Replacement",
    tiers: {
      economy: { min: 90, max: 190, avg: 135, labor: 90, parts: 45 },
      mid_range: { min: 105, max: 230, avg: 165, labor: 105, parts: 60 },
      luxury: { min: 180, max: 380, avg: 275, labor: 170, parts: 105 },
      truck_suv: { min: 120, max: 260, avg: 185, labor: 115, parts: 70 },
      european: { min: 170, max: 360, avg: 260, labor: 160, parts: 100 },
    },
    confidence: "medium",
  },
  {
    slug: "coolant_flush",
    name: "Coolant Flush",
    tiers: {
      economy: { min: 90, max: 180, avg: 130, labor: 70, parts: 60 },
      mid_range: { min: 105, max: 220, avg: 155, labor: 85, parts: 70 },
      luxury: { min: 160, max: 330, avg: 240, labor: 130, parts: 110 },
      truck_suv: { min: 120, max: 250, avg: 180, labor: 95, parts: 85 },
      european: { min: 150, max: 310, avg: 225, labor: 120, parts: 105 },
    },
    confidence: "high",
  },
  {
    slug: "brake_fluid_flush",
    name: "Brake Fluid Flush",
    tiers: {
      economy: { min: 80, max: 160, avg: 115, labor: 85, parts: 30 },
      mid_range: { min: 90, max: 190, avg: 135, labor: 100, parts: 35 },
      luxury: { min: 150, max: 300, avg: 220, labor: 160, parts: 60 },
      truck_suv: { min: 105, max: 220, avg: 155, labor: 115, parts: 40 },
      european: { min: 140, max: 280, avg: 205, labor: 150, parts: 55 },
    },
    confidence: "high",
  },
  {
    slug: "power_steering_flush",
    name: "Power Steering Fluid Flush",
    tiers: {
      economy: { min: 90, max: 180, avg: 130, labor: 80, parts: 50 },
      mid_range: { min: 100, max: 210, avg: 150, labor: 90, parts: 60 },
      luxury: { min: 170, max: 340, avg: 250, labor: 150, parts: 100 },
      truck_suv: { min: 115, max: 240, avg: 170, labor: 100, parts: 70 },
      european: { min: 160, max: 320, avg: 235, labor: 140, parts: 95 },
    },
    confidence: "high",
  },
  {
    slug: "differential_fluid",
    name: "Differential Fluid Change",
    tiers: {
      economy: { min: 70, max: 160, avg: 110, labor: 65, parts: 45 },
      mid_range: { min: 85, max: 200, avg: 138, labor: 80, parts: 58 },
      luxury: { min: 140, max: 300, avg: 215, labor: 125, parts: 90 },
      truck_suv: { min: 95, max: 230, avg: 155, labor: 90, parts: 65 },
      european: { min: 130, max: 280, avg: 200, labor: 115, parts: 85 },
    },
    confidence: "high",
  },
  {
    slug: "transfer_case_fluid",
    name: "Transfer Case Fluid Change",
    tiers: {
      economy: { min: 70, max: 150, avg: 105, labor: 60, parts: 45 },
      mid_range: { min: 80, max: 180, avg: 125, labor: 70, parts: 55 },
      luxury: { min: 140, max: 290, avg: 210, labor: 115, parts: 95 },
      truck_suv: { min: 90, max: 200, avg: 140, labor: 80, parts: 60 },
      european: { min: 130, max: 275, avg: 198, labor: 110, parts: 88 },
    },
    confidence: "medium",
  },
  {
    slug: "drive_belt",
    name: "Drive Belt Replacement",
    tiers: {
      economy: { min: 85, max: 190, avg: 135, labor: 90, parts: 45 },
      mid_range: { min: 100, max: 230, avg: 160, labor: 100, parts: 60 },
      luxury: { min: 180, max: 370, avg: 270, labor: 180, parts: 90 },
      truck_suv: { min: 115, max: 260, avg: 185, labor: 110, parts: 75 },
      european: { min: 170, max: 350, avg: 255, labor: 170, parts: 85 },
    },
    confidence: "high",
  },
  {
    slug: "engine_mount",
    name: "Engine Mount Replacement",
    tiers: {
      economy: { min: 280, max: 540, avg: 400, labor: 260, parts: 140 },
      mid_range: { min: 340, max: 660, avg: 490, labor: 310, parts: 180 },
      luxury: { min: 550, max: 1050, avg: 785, labor: 480, parts: 305 },
      truck_suv: { min: 380, max: 740, avg: 550, labor: 340, parts: 210 },
      european: { min: 520, max: 1000, avg: 745, labor: 460, parts: 285 },
    },
    confidence: "high",
  },
  {
    slug: "transmission_mount",
    name: "Transmission Mount Replacement",
    tiers: {
      economy: { min: 200, max: 400, avg: 290, labor: 210, parts: 80 },
      mid_range: { min: 240, max: 480, avg: 350, labor: 245, parts: 105 },
      luxury: { min: 400, max: 780, avg: 580, labor: 390, parts: 190 },
      truck_suv: { min: 270, max: 540, avg: 395, labor: 270, parts: 125 },
      european: { min: 380, max: 740, avg: 550, labor: 365, parts: 185 },
    },
    confidence: "high",
  },
  {
    slug: "evaporator_core",
    name: "Evaporator Core Replacement",
    tiers: {
      economy: { min: 800, max: 1500, avg: 1125, labor: 750, parts: 375 },
      mid_range: { min: 950, max: 1800, avg: 1350, labor: 880, parts: 470 },
      luxury: { min: 1600, max: 3000, avg: 2250, labor: 1400, parts: 850 },
      truck_suv: { min: 1050, max: 2000, avg: 1500, labor: 950, parts: 550 },
      european: { min: 1500, max: 2800, avg: 2100, labor: 1300, parts: 800 },
    },
    confidence: "medium",
  },
  {
    slug: "heater_core",
    name: "Heater Core Replacement",
    tiers: {
      economy: { min: 700, max: 1300, avg: 980, labor: 650, parts: 330 },
      mid_range: { min: 850, max: 1600, avg: 1200, labor: 780, parts: 420 },
      luxury: { min: 1400, max: 2600, avg: 1950, labor: 1250, parts: 700 },
      truck_suv: { min: 950, max: 1800, avg: 1350, labor: 850, parts: 500 },
      european: { min: 1300, max: 2400, avg: 1800, labor: 1150, parts: 650 },
    },
    confidence: "medium",
  },
  {
    slug: "throttle_body",
    name: "Throttle Body Replacement",
    tiers: {
      economy: { min: 320, max: 600, avg: 450, labor: 200, parts: 250 },
      mid_range: { min: 380, max: 720, avg: 540, labor: 230, parts: 310 },
      luxury: { min: 600, max: 1150, avg: 855, labor: 370, parts: 485 },
      truck_suv: { min: 420, max: 800, avg: 600, labor: 260, parts: 340 },
      european: { min: 570, max: 1080, avg: 805, labor: 350, parts: 455 },
    },
    confidence: "high",
  },
  {
    slug: "fuel_filter",
    name: "Fuel Filter Replacement",
    tiers: {
      economy: { min: 85, max: 200, avg: 140, labor: 80, parts: 60 },
      mid_range: { min: 100, max: 240, avg: 165, labor: 90, parts: 75 },
      luxury: { min: 180, max: 400, avg: 285, labor: 145, parts: 140 },
      truck_suv: { min: 115, max: 270, avg: 190, labor: 105, parts: 85 },
      european: { min: 170, max: 380, avg: 270, labor: 135, parts: 135 },
    },
    confidence: "high",
  },
  {
    slug: "windshield",
    name: "Windshield Replacement",
    tiers: {
      economy: { min: 220, max: 420, avg: 315, labor: 115, parts: 200 },
      mid_range: { min: 250, max: 500, avg: 365, labor: 135, parts: 230 },
      luxury: { min: 450, max: 900, avg: 655, labor: 220, parts: 435 },
      truck_suv: { min: 280, max: 560, avg: 410, labor: 150, parts: 260 },
      european: { min: 420, max: 850, avg: 620, labor: 200, parts: 420 },
    },
    confidence: "high",
  },
  {
    slug: "window_regulator",
    name: "Window Regulator Replacement",
    tiers: {
      economy: { min: 220, max: 440, avg: 320, labor: 145, parts: 175 },
      mid_range: { min: 260, max: 520, avg: 380, labor: 170, parts: 210 },
      luxury: { min: 450, max: 900, avg: 660, labor: 280, parts: 380 },
      truck_suv: { min: 290, max: 580, avg: 425, labor: 190, parts: 235 },
      european: { min: 420, max: 850, avg: 620, labor: 260, parts: 360 },
    },
    confidence: "high",
  },
  {
    slug: "door_lock_actuator",
    name: "Door Lock Actuator Replacement",
    tiers: {
      economy: { min: 200, max: 400, avg: 290, labor: 145, parts: 145 },
      mid_range: { min: 240, max: 480, avg: 350, labor: 170, parts: 180 },
      luxury: { min: 380, max: 750, avg: 550, labor: 270, parts: 280 },
      truck_suv: { min: 270, max: 540, avg: 395, labor: 190, parts: 205 },
      european: { min: 360, max: 720, avg: 525, labor: 255, parts: 270 },
    },
    confidence: "high",
  },
  {
    slug: "blower_motor",
    name: "Blower Motor Replacement",
    tiers: {
      economy: { min: 230, max: 450, avg: 335, labor: 160, parts: 175 },
      mid_range: { min: 270, max: 540, avg: 395, labor: 185, parts: 210 },
      luxury: { min: 430, max: 850, avg: 630, labor: 300, parts: 330 },
      truck_suv: { min: 300, max: 600, avg: 440, labor: 205, parts: 235 },
      european: { min: 410, max: 800, avg: 595, labor: 280, parts: 315 },
    },
    confidence: "high",
  },
];

// ============================================================================
// Helper: convert RepairJob to flat RepairCostRow[]
// ============================================================================

function jobToRows(job: RepairJob): RepairCostRow[] {
  const rows: RepairCostRow[] = [];
  for (const [tierName, tierData] of Object.entries(job.tiers)) {
    const tier = tierName as TierName;
    const tierConfig = TIERS[tier];
    const vehicle = tierConfig.vehicles[0]; // Primary vehicle per tier

    rows.push({
      repair_slug: job.slug,
      repair_name: job.name,
      make: vehicle.make,
      model: vehicle.model,
      tier: tierName,
      tier_order: tierConfig.order,
      min_cost: tierData.min,
      max_cost: tierData.max,
      avg_cost: tierData.avg,
      labor_cost: tierData.labor,
      parts_cost: tierData.parts,
      confidence_level: job.confidence,
    });
  }
  return rows;
}

// ============================================================================
// CSV Import: parse a CSV file into RepairCostRow[]
// Expected columns: repair_slug, repair_name, make, model, tier, tier_order,
//   min_cost, max_cost, avg_cost, labor_cost, parts_cost, confidence_level
// ============================================================================

async function importCSV(filepath: string): Promise<RepairCostRow[]> {
  const { parse } = await import("csv-parse/sync");
  const raw = readFileSync(filepath, "utf-8");
  const records = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  return records.map((r: any) => ({
    repair_slug: r.repair_slug,
    repair_name: r.repair_name,
    make: r.make,
    model: r.model,
    tier: r.tier,
    tier_order: parseInt(r.tier_order, 10) || 0,
    min_cost: parseFloat(r.min_cost),
    max_cost: parseFloat(r.max_cost),
    avg_cost: parseFloat(r.avg_cost),
    labor_cost: parseFloat(r.labor_cost),
    parts_cost: parseFloat(r.parts_cost),
    confidence_level: r.confidence_level || "medium",
  }));
}

// ============================================================================
// JSON Import
// ============================================================================

function importJSON(filepath: string): RepairCostRow[] {
  const raw = readFileSync(filepath, "utf-8");
  const data = JSON.parse(raw);

  // Support both array of rows and { jobs: RepairJob[] } format
  if (Array.isArray(data)) {
    // Assume it's already RepairCostRow[]
    return data;
  }

  if (data.jobs && Array.isArray(data.jobs)) {
    return data.jobs.flatMap((job: RepairJob) => jobToRows(job));
  }

  throw new Error("Unrecognized JSON format. Expected array or { jobs: [...] }");
}

// ============================================================================
// Upload to Supabase
// ============================================================================

async function uploadRows(rows: RepairCostRow[]): Promise<void> {
  console.log(`Uploading ${rows.length} repair cost entries...`);

  // Upsert: on conflict (repair_slug, make, model), update the row
  const { error } = await supabase
    .from("repair_costs")
    .upsert(rows, {
      onConflict: "repair_slug, make, model",
      ignoreDuplicates: false,
    });

  if (error) {
    console.error("Upload failed:", error.message);
    process.exit(1);
  }

  console.log(`Successfully imported ${rows.length} repair cost entries.`);
}

// ============================================================================
// Verify
// ============================================================================

async function verify(): Promise<void> {
  const { count, error } = await supabase
    .from("repair_costs")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("Verification query failed:", error.message);
    return;
  }

  console.log(`Repair costs table now has ${count} total rows.`);

  // Show breakdown by tier
  const tiers = ["economy", "mid_range", "luxury", "truck_suv", "european"];
  for (const tier of tiers) {
    const { count: tierCount } = await supabase
      .from("repair_costs")
      .select("*", { count: "exact", head: true })
      .eq("tier", tier);
    console.log(`  ${tier}: ${tierCount} entries`);
  }

  // Show unique repair types
  const { data: slugs } = await supabase
    .from("repair_costs")
    .select("repair_slug");

  if (slugs) {
    const unique = new Set(slugs.map((s: any) => s.repair_slug));
    console.log(`  Unique repair types: ${unique.size}`);
  }
}

// ============================================================================
// Main
// ============================================================================

async function main() {
  const args = process.argv.slice(2);

  let rows: RepairCostRow[];

  if (args.length > 0) {
    const filepath = args[0];
    if (!existsSync(filepath)) {
      console.error(`File not found: ${filepath}`);
      process.exit(1);
    }

    console.log(`Importing from: ${filepath}`);
    if (filepath.endsWith(".json")) {
      rows = importJSON(filepath);
    } else if (filepath.endsWith(".csv")) {
      rows = await importCSV(filepath);
    } else {
      console.error("Unsupported file format. Use .json or .csv");
      process.exit(1);
    }
  } else {
    // Use built-in dataset
    console.log(`Using built-in dataset: ${BUILT_IN_JOBS.length} repair jobs across 5 tiers`);
    rows = BUILT_IN_JOBS.flatMap(jobToRows);
    console.log(`Flattened to ${rows.length} rows`);
  }

  await uploadRows(rows);
  await verify();
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
