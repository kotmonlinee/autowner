export type WarningLightSeverity = "critical" | "caution" | "informational";

export interface WarningLight {
  slug: string;
  title: string;
  severity: WarningLightSeverity;
  meaning: string;
  causes: string[];
  can_drive: string;
  min_cost: number;
  max_cost: number;
  icon: string; // emoji
  related_obd_codes: string[];
}

export const warningLights: WarningLight[] = [
  {
    slug: "check-engine",
    title: "Check Engine Light",
    severity: "caution",
    meaning:
      "The engine control unit (ECU) has detected a fault in the engine, emissions, or fuel system. This is the most common and broad warning light.",
    causes: [
      "Loose or damaged gas cap",
      "Faulty oxygen sensor",
      "Failing catalytic converter",
      "Worn spark plugs or ignition coils",
      "Mass airflow sensor failure",
      "EVAP system leak",
    ],
    can_drive:
      "If the light is steady (not flashing), you can typically drive to a repair shop. If the light is flashing, pull over immediately and shut off the engine — severe engine damage is likely occurring.",
    min_cost: 20,
    max_cost: 2500,
    icon: "🚗",
    related_obd_codes: ["P0300", "P0420", "P0171", "P0174", "P0455", "P0101"],
  },
  {
    slug: "oil-pressure",
    title: "Oil Pressure Warning",
    severity: "critical",
    meaning:
      "Engine oil pressure has dropped below safe operating levels. This means critical engine components are not receiving adequate lubrication.",
    causes: [
      "Low engine oil level",
      "Worn oil pump",
      "Clogged oil filter",
      "Oil leak (gasket, seal, or pan)",
      "Faulty oil pressure sensor",
      "Engine sludge buildup",
    ],
    can_drive:
      "No. Pull over immediately and turn off the engine. Driving with low oil pressure can cause catastrophic engine failure within minutes.",
    min_cost: 30,
    max_cost: 4000,
    icon: "🛢️",
    related_obd_codes: ["P0520", "P0521", "P0522", "P0523", "P0524"],
  },
  {
    slug: "battery-charging",
    title: "Battery / Charging System Warning",
    severity: "caution",
    meaning:
      "The vehicle's charging system (alternator) is not properly charging the battery. The car is running on battery power alone and will eventually die.",
    causes: [
      "Failing alternator",
      "Loose or broken serpentine belt",
      "Corroded battery terminals",
      "Bad voltage regulator",
      "Old or failing battery",
      "Damaged wiring or ground connection",
    ],
    can_drive:
      "You can drive a short distance (to a safe location or repair shop), but the engine may stall once the battery is fully drained — typically within 15-60 minutes.",
    min_cost: 100,
    max_cost: 800,
    icon: "🔋",
    related_obd_codes: ["P0560", "P0562", "P0563", "P0620", "P0622"],
  },
  {
    slug: "brake-system",
    title: "Brake System Warning",
    severity: "critical",
    meaning:
      "There is a fault in the brake system. This could indicate low brake fluid, worn brake pads, or a failure in the hydraulic system.",
    causes: [
      "Low brake fluid level",
      "Worn brake pads or rotors",
      "Brake fluid leak",
      "Faulty ABS pump or module",
      "Engaged parking brake",
      "Failed brake master cylinder",
    ],
    can_drive:
      "No. Do not drive the vehicle. Loss of braking ability is extremely dangerous. Tow to a repair shop.",
    min_cost: 80,
    max_cost: 1800,
    icon: "🔴",
    related_obd_codes: ["C0040", "C0045", "C0265", "C0267", "C0268"],
  },
  {
    slug: "coolant-temperature",
    title: "Coolant Temperature / Overheating",
    severity: "critical",
    meaning:
      "The engine coolant temperature has exceeded safe limits. Continued operation will cause severe engine damage, including a blown head gasket or warped cylinder head.",
    causes: [
      "Low coolant level",
      "Coolant leak (radiator, hoses, water pump)",
      "Failed thermostat",
      "Failed water pump",
      "Blown head gasket",
      "Clogged radiator",
      "Failed cooling fan or fan relay",
    ],
    can_drive:
      "No. Pull over immediately and shut off the engine. Do NOT open the radiator cap while hot. Wait for the engine to cool, then check coolant levels.",
    min_cost: 50,
    max_cost: 3500,
    icon: "🌡️",
    related_obd_codes: ["P0115", "P0116", "P0117", "P0118", "P0125", "P0128"],
  },
  {
    slug: "tpms",
    title: "Tire Pressure Monitoring (TPMS)",
    severity: "caution",
    meaning:
      "One or more tires have low air pressure, or the TPMS system itself has a fault. Underinflated tires reduce fuel economy, increase tire wear, and can cause blowouts.",
    causes: [
      "Low tire pressure (natural air loss or puncture)",
      "Punctured tire (nail, screw, or debris)",
      "Faulty TPMS sensor",
      "Dead TPMS sensor battery (sensors last 5-10 years)",
      "Seasonal temperature change causing pressure drop",
    ],
    can_drive:
      "Yes — but check and inflate tires to the recommended PSI as soon as possible. If a tire is visibly flat, do not drive on it.",
    min_cost: 0,
    max_cost: 400,
    icon: "🛞",
    related_obd_codes: ["C0710", "C0750", "C0755", "C0765", "C0775"],
  },
  {
    slug: "abs",
    title: "Anti-Lock Brake System (ABS)",
    severity: "caution",
    meaning:
      "The ABS module has detected a fault. Your standard brakes still work, but the anti-lock feature is disabled, meaning wheels can lock up during hard braking.",
    causes: [
      "Faulty wheel speed sensor",
      "Damaged ABS tone ring",
      "Failed ABS pump or module",
      "Blown ABS fuse",
      "Wiring damage near wheel hubs",
      "Low brake fluid triggering combined warning",
    ],
    can_drive:
      "Yes — normal braking is still functional. However, in emergency stops or on slick roads, wheels may lock up. Get it diagnosed promptly.",
    min_cost: 100,
    max_cost: 1200,
    icon: "🛑",
    related_obd_codes: ["C0035", "C0040", "C0045", "C0050", "C1221", "C1222"],
  },
  {
    slug: "airbag-srs",
    title: "Airbag / SRS Warning",
    severity: "critical",
    meaning:
      "The Supplemental Restraint System (SRS) has detected a fault. Airbags may not deploy in a crash, putting occupants at serious risk.",
    causes: [
      "Faulty clock spring in steering wheel",
      "Bad seat belt pretensioner",
      "Failed impact sensor",
      "Loose or corroded wiring under seats",
      "Water damage to SRS module",
      "Discharged backup battery in SRS module",
    ],
    can_drive:
      "Yes, but with caution — the airbags may not deploy in a collision. Repair as soon as possible.",
    min_cost: 150,
    max_cost: 1500,
    icon: "💥",
    related_obd_codes: ["B0001", "B0010", "B0012", "B0020", "B0028", "B0052"],
  },
  {
    slug: "traction-control",
    title: "Traction Control / Stability Control",
    severity: "informational",
    meaning:
      "The traction or stability control system is actively engaged or has a fault. When flashing, it is working; when solid, there is a system fault.",
    causes: [
      "Slippery road conditions (light flashing = normal)",
      "Faulty wheel speed sensor",
      "Steering angle sensor out of calibration",
      "ABS fault (shared components)",
      "Traction control switch accidentally turned off",
      "Failing brake light switch",
    ],
    can_drive:
      "Yes. If the light is solid, traction and stability aids are disabled but normal driving is safe. Exercise extra caution on wet or icy roads.",
    min_cost: 0,
    max_cost: 600,
    icon: "⚠️",
    related_obd_codes: ["C0035", "C0040", "C0050", "C1221", "C1233", "U0121"],
  },
  {
    slug: "power-steering",
    title: "Power Steering Warning",
    severity: "caution",
    meaning:
      "The power steering system has a fault. Steering effort will increase significantly, especially at low speeds and during parking maneuvers.",
    causes: [
      "Low power steering fluid (hydraulic systems)",
      "Leaking power steering rack or pump",
      "Electric power steering motor failure",
      "Faulty steering angle sensor",
      "Blown power steering fuse (electric systems)",
      "Failed power steering control module",
    ],
    can_drive:
      "Yes, but steering will be much heavier. Be prepared for significantly increased effort at low speeds. Avoid tight parking situations.",
    min_cost: 150,
    max_cost: 2500,
    icon: "🔄",
    related_obd_codes: ["C0545", "C0546", "C0560", "C0561", "U0428"],
  },
  {
    slug: "glow-plug",
    title: "Glow Plug Indicator (Diesel)",
    severity: "informational",
    meaning:
      "On diesel engines, this light illuminates during the glow plug warm-up cycle before starting. If flashing while driving, it indicates a fault in the glow plug system or engine management.",
    causes: [
      "Normal operation (solid light before start)",
      "Faulty glow plug(s)",
      "Failed glow plug relay or control module",
      "Engine management fault (when flashing)",
      "Worn glow plug wiring harness",
      "DPF regeneration in progress",
    ],
    can_drive:
      "If solid before starting: wait for it to go out, then start normally. If flashing while driving: drive gently to a repair shop. Performance and fuel economy may be reduced.",
    min_cost: 80,
    max_cost: 500,
    icon: "🕯️",
    related_obd_codes: ["P0380", "P0381", "P0670", "P0671", "P0674", "P0678"],
  },
  {
    slug: "fuel-filter-water",
    title: "Water in Fuel Filter (Diesel)",
    severity: "caution",
    meaning:
      "Water has been detected in the diesel fuel filter. Water in diesel fuel can cause injection system damage, corrosion, and bacterial growth (diesel bug).",
    causes: [
      "Contaminated diesel fuel from filling station",
      "Condensation in fuel tank",
      "Fuel filter reaching end of service life",
      "Damaged fuel cap seal allowing moisture ingress",
      "Extended vehicle storage with low fuel level",
    ],
    can_drive:
      "Drive gently to have the fuel filter drained or replaced. Continued driving with water in fuel can damage the high-pressure injection pump (very expensive repair).",
    min_cost: 50,
    max_cost: 300,
    icon: "💧",
    related_obd_codes: ["P2264", "P2269", "P0087"],
  },
  {
    slug: "reduced-power",
    title: "Reduced Power / Limp Mode",
    severity: "caution",
    meaning:
      "The engine computer has detected a serious fault and has limited engine power to protect the engine and transmission from damage. Acceleration will be sluggish and top speed limited.",
    causes: [
      "Throttle body failure or contamination",
      "Accelerator pedal position sensor fault",
      "Mass airflow or MAP sensor failure",
      "Turbocharger or supercharger fault",
      "Transmission fault",
      "Severe misfire or knock detected",
    ],
    can_drive:
      "Drive carefully to the nearest repair shop. Avoid highways if possible. The vehicle will have very limited acceleration and top speed (typically 30-45 mph).",
    min_cost: 100,
    max_cost: 3000,
    icon: "🐢",
    related_obd_codes: ["P2101", "P2135", "P2119", "P2138", "P0638", "P0299"],
  },
  {
    slug: "service-vehicle",
    title: "Service Vehicle Soon",
    severity: "informational",
    meaning:
      "The vehicle is due for scheduled maintenance, or a non-emissions, non-engine minor fault has been logged. This is separate from the Check Engine light.",
    causes: [
      "Scheduled maintenance interval reached (oil change, service)",
      "Minor body electrical fault (e.g., burned out bulb)",
      "Low washer fluid (on some vehicles)",
      "Transmission fluid due for change",
      "Cabin air filter replacement due",
    ],
    can_drive:
      "Yes, this is generally safe. Schedule a service appointment. Check your owner's manual for the maintenance schedule.",
    min_cost: 40,
    max_cost: 500,
    icon: "🔧",
    related_obd_codes: ["B0000", "U0001"],
  },
  {
    slug: "oil-change-reminder",
    title: "Oil Change Reminder",
    severity: "informational",
    meaning:
      "The oil life monitoring system has determined that an oil change is due based on mileage, time, and driving conditions. This is a maintenance reminder, not a fault.",
    causes: [
      "Oil change interval reached (typically 3,000-10,000 miles)",
      "Time-based reminder (e.g., 6-12 months)",
      "Severe driving conditions accelerating oil degradation",
      "Oil life monitor not reset after previous oil change",
    ],
    can_drive:
      "Yes. Schedule an oil change within the next week or two. Do not ignore indefinitely — old oil loses its lubricating and cooling properties.",
    min_cost: 35,
    max_cost: 120,
    icon: "⏰",
    related_obd_codes: [],
  },
  {
    slug: "washer-fluid",
    title: "Low Washer Fluid",
    severity: "informational",
    meaning:
      "Windshield washer fluid level is low. This is a convenience reminder — top up the reservoir to maintain clear visibility.",
    causes: [
      "Washer fluid reservoir is nearly empty",
      "Frequent use exhausting fluid",
      "Leak in washer fluid reservoir or lines",
      "Faulty fluid level sensor (if refilling does not clear it)",
    ],
    can_drive:
      "Yes. Top up the washer fluid at your earliest convenience. Important for safety if driving in rain, snow, or muddy conditions.",
    min_cost: 3,
    max_cost: 40,
    icon: "💦",
    related_obd_codes: [],
  },
  {
    slug: "door-ajar",
    title: "Door / Trunk / Hood Ajar",
    severity: "informational",
    meaning:
      "One or more doors, the trunk/hatch, or the hood is not fully latched. The interior lights may remain on, draining the battery.",
    causes: [
      "A door is not fully closed",
      "Trunk or hatch not fully latched",
      "Hood not fully closed",
      "Faulty door jamb switch",
      "Worn or misaligned door latch mechanism",
    ],
    can_drive:
      "No — ensure all doors, trunk, and hood are fully closed before driving. An unlatched hood can fly up and block your view at speed.",
    min_cost: 0,
    max_cost: 200,
    icon: "🚪",
    related_obd_codes: ["B1475", "B1480", "B3000"],
  },
  {
    slug: "seat-belt",
    title: "Seat Belt Reminder",
    severity: "informational",
    meaning:
      "The driver or a passenger has not fastened their seat belt, or a heavy object on a seat is triggering the passenger occupancy sensor.",
    causes: [
      "Seat belt not fastened",
      "Heavy object on passenger seat triggering sensor",
      "Faulty seat belt buckle sensor",
      "Damaged seat belt pretensioner wiring",
      "Passenger occupancy sensor malfunction",
    ],
    can_drive:
      "No — all occupants must fasten seat belts. It is illegal to drive without seat belts in most jurisdictions.",
    min_cost: 0,
    max_cost: 300,
    icon: "🔔",
    related_obd_codes: ["B0050", "B0052", "B0070"],
  },
  {
    slug: "security-immobilizer",
    title: "Security / Immobilizer",
    severity: "caution",
    meaning:
      "The vehicle's anti-theft system is active or has detected an issue with the key/immobilizer. The engine may not start, or may start and then stall.",
    causes: [
      "Unrecognized key or key fob",
      "Dead key fob battery",
      "Faulty immobilizer antenna ring (around ignition)",
      "Corrupted key transponder chip",
      "ECU/immobilizer module communication error",
      "Aftermarket alarm system malfunction",
    ],
    can_drive:
      "It depends. If the engine starts and runs normally, you can drive. If the light flashes after starting or the engine stalls, the immobilizer is preventing operation.",
    min_cost: 3,
    max_cost: 1200,
    icon: "🔐",
    related_obd_codes: ["B2796", "B2799", "P0513", "P1610", "U0100"],
  },
  {
    slug: "low-fuel",
    title: "Low Fuel Warning",
    severity: "informational",
    meaning:
      "The fuel level is critically low (typically 1-2 gallons / 30-50 miles remaining). Refuel as soon as possible to avoid running out of fuel.",
    causes: [
      "Fuel tank is nearly empty",
      "Faulty fuel level sender (if gauge reads incorrectly)",
      "Fuel gauge stuck or inaccurate",
    ],
    can_drive:
      "Refuel immediately. Running out of fuel can damage the fuel pump (which is cooled and lubricated by fuel) and leave you stranded.",
    min_cost: 0,
    max_cost: 300,
    icon: "⛽",
    related_obd_codes: ["P0460", "P0461", "P0462", "P0463"],
  },
  {
    slug: "cruise-control",
    title: "Cruise Control Indicator",
    severity: "informational",
    meaning:
      "The cruise control system is either engaged or has detected a fault. A green light means active; an amber or flashing light indicates a system fault.",
    causes: [
      "Cruise control is active (green = normal)",
      "Faulty brake light switch (most common fault cause)",
      "Failed cruise control switch or stalk",
      "Wheel speed sensor fault (shared with ABS)",
      "Clutch switch failure (manual transmission)",
      "Throttle body fault affecting cruise operation",
    ],
    can_drive:
      "Yes. Cruise control may not function, but normal driving is unaffected. A faulty brake light switch should be replaced promptly as it also affects brake lights.",
    min_cost: 25,
    max_cost: 350,
    icon: "⏱️",
    related_obd_codes: ["P0504", "P0571", "P0572", "P0573", "P0703"],
  },
  {
    slug: "lane-departure",
    title: "Lane Departure / Lane Keep Assist",
    severity: "informational",
    meaning:
      "The lane departure warning or lane keep assist system is active, temporarily unavailable, or has a fault. A solid green light is normal; amber or flashing means a fault.",
    causes: [
      "System is active (green = normal operation)",
      "Camera view obstructed (dirty windshield, heavy rain, snow)",
      "Faded or missing lane markings on road",
      "Windshield camera misalignment (after windshield replacement)",
      "System calibration required",
      "Faulty forward-facing camera module",
    ],
    can_drive:
      "Yes. The lane keeping aids may not function, but normal driving is unaffected. Clean the windshield and ensure cameras are unobstructed.",
    min_cost: 0,
    max_cost: 800,
    icon: "🛣️",
    related_obd_codes: ["C1001", "C1A00", "U023A", "B1D12"],
  },
  {
    slug: "auto-high-beam",
    title: "Automatic High Beam Indicator",
    severity: "informational",
    meaning:
      "The automatic high beam system is active and managing high beams automatically. A fault (amber) means the system is unavailable and high beams must be controlled manually.",
    causes: [
      "System is active (green/blue = normal)",
      "Camera or sensor obstructed (dirt, snow, fog)",
      "Windshield camera issue (shared with other ADAS systems)",
      "Headlight switch in wrong position",
      "System manually disabled in vehicle settings",
    ],
    can_drive:
      "Yes. Use high beams manually. The auto function may be unavailable, but headlights work normally.",
    min_cost: 0,
    max_cost: 400,
    icon: "💡",
    related_obd_codes: ["U023A", "B1A00"],
  },
  {
    slug: "parking-brake",
    title: "Parking Brake / Electronic Parking Brake",
    severity: "caution",
    meaning:
      "The parking brake is engaged, or the electronic parking brake (EPB) system has a fault. Driving with the parking brake engaged will damage the brake system.",
    causes: [
      "Parking brake is engaged (release before driving)",
      "EPB switch or actuator motor failure",
      "Low brake fluid triggering combined warning",
      "Worn parking brake shoes or cables",
      "EPB control module fault",
      "Battery voltage too low for EPB operation",
    ],
    can_drive:
      "If the parking brake is truly released and the light stays on: drive cautiously to a shop, but the parking brake may not hold on hills. Do NOT drive with the parking brake engaged.",
    min_cost: 100,
    max_cost: 800,
    icon: "🅿️",
    related_obd_codes: ["C100A", "C1011", "C1012", "C1031", "C1032", "C1040"],
  },
  {
    slug: "ev-system",
    title: "EV System / Hybrid System Warning",
    severity: "caution",
    meaning:
      "On electric and hybrid vehicles, this light indicates a fault in the high-voltage electrical system, battery pack, or drive motor. This is the EV equivalent of the Check Engine light.",
    causes: [
      "Battery management system (BMS) fault",
      "Cell voltage imbalance in traction battery",
      "High-voltage isolation fault",
      "Drive motor or inverter fault",
      "Charging system or onboard charger fault",
      "Cooling system fault for battery or motor",
      "12V auxiliary battery low (common issue)",
    ],
    can_drive:
      "If the vehicle still operates: drive cautiously to a dealer or EV specialist. If in reduced power mode: drive straight to a repair facility. Do not attempt to charge if a charging system fault is indicated.",
    min_cost: 100,
    max_cost: 8000,
    icon: "🔌",
    related_obd_codes: ["P0A80", "P0AA6", "P0A09", "P0AFA", "P1A00", "U0111"],
  },
];

export function getWarningLightBySlug(slug: string): WarningLight | undefined {
  return warningLights.find((w) => w.slug === slug);
}

export function getWarningLightsBySeverity(
  severity: WarningLightSeverity
): WarningLight[] {
  return warningLights.filter((w) => w.severity === severity);
}
