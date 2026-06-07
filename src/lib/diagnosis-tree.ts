// Decision tree: symptom category → subcategory → diagnosis
// Each diagnosis links to real OBD codes and repair slugs in our database

export interface DiagnosisNode {
  key: string;
  label: string;
  desc: string;
  icon: string; // Lucide icon name
}

export interface DiagnosisEntry {
  title: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  possibleCodes: string[]; // OBD codes in our database
  repairSlugs: string[]; // repair cost slugs in our database
  confidence: number; // 0-100
}

export const CATEGORIES: DiagnosisNode[] = [
  { key: "brakes", label: "Brake Issues", desc: "Noise, vibration, weak or spongy braking", icon: "CircleAlert" },
  { key: "engine", label: "Engine Problems", desc: "Noise, knocking, vibration, performance loss", icon: "Gauge" },
  { key: "starting", label: "Starting Issues", desc: "Won't start, slow crank, clicking, no response", icon: "Power" },
  { key: "climate", label: "AC & Climate", desc: "No cooling, smells, weak airflow, noise", icon: "Wind" },
  { key: "driving", label: "Driving Issues", desc: "Stalling, hesitation, power loss, surging", icon: "Car" },
  { key: "dashboard", label: "Warning Lights", desc: "Check engine, ABS, battery, and other lights", icon: "TriangleAlert" },
  { key: "steering", label: "Steering & Suspension", desc: "Pulling, vibration, rough ride, noise", icon: "SteeringWheel" },
  { key: "leaks", label: "Fluid Leaks", desc: "Oil, coolant, transmission, brake fluid", icon: "Droplets" },
  { key: "transmission", label: "Transmission", desc: "Slipping, hard shifts, delayed engagement", icon: "Cog" },
  { key: "electrical", label: "Electrical", desc: "Lights dimming, battery drains, accessories fail", icon: "Zap" },
];

export const SUBCATEGORIES: Record<string, DiagnosisNode[]> = {
  brakes: [
    { key: "squealing", label: "Squealing or Squeaking", desc: "High-pitched noise when braking, especially at low speeds", icon: "AudioLines" },
    { key: "grinding", label: "Grinding Noise", desc: "Metal-on-metal scraping sound when braking", icon: "Cog" },
    { key: "soft-pedal", label: "Soft or Spongy Pedal", desc: "Brake pedal sinks to floor or feels mushy", icon: "ArrowDown" },
    { key: "vibration", label: "Vibration When Braking", desc: "Steering wheel or pedal shakes during braking", icon: "Vibrate" },
    { key: "pulling", label: "Pulling to One Side", desc: "Car pulls left or right when braking", icon: "ArrowLeftRight" },
  ],
  engine: [
    { key: "knocking", label: "Knocking or Pinging", desc: "Metallic knocking sound, especially under acceleration", icon: "Hammer" },
    { key: "ticking", label: "Ticking Noise", desc: "Rapid ticking from the engine bay", icon: "Timer" },
    { key: "rattling", label: "Rattling", desc: "Loose metal sound from engine compartment", icon: "AudioLines" },
    { key: "whining", label: "Whining or Whirring", desc: "High-pitched whine that changes with RPM", icon: "Ear" },
    { key: "rough-idle", label: "Rough Idle", desc: "Engine shakes or vibrates at idle, may stall", icon: "Vibrate" },
    { key: "misfire", label: "Misfiring", desc: "Engine stumbles, jerks, or loses power briefly", icon: "Zap" },
  ],
  starting: [
    { key: "clicking", label: "Clicking Sound, Won't Crank", desc: "Rapid clicking, engine doesn't turn over", icon: "MousePointerClick" },
    { key: "slow-crank", label: "Slow Cranking", desc: "Engine cranks very slowly, may or may not start", icon: "BatteryWarning" },
    { key: "no-crank", label: "No Sound at All", desc: "Turn key, nothing happens. No click, no crank.", icon: "Ban" },
    { key: "intermittent", label: "Starts Sometimes", desc: "Starts fine then randomly won't start later", icon: "Shuffle" },
  ],
  climate: [
    { key: "no-cold", label: "AC Not Blowing Cold", desc: "Fan works but air is warm or barely cool", icon: "Thermometer" },
    { key: "musty-smell", label: "Musty or Moldy Smell", desc: "Damp, mildew smell when AC is on", icon: "Wind" },
    { key: "weak-airflow", label: "Weak Airflow", desc: "Fan runs but very little air comes out", icon: "Fan" },
  ],
  driving: [
    { key: "stalling", label: "Engine Stalls While Driving", desc: "Engine shuts off unexpectedly while moving", icon: "Car" },
    { key: "hesitation", label: "Hesitation on Acceleration", desc: "Engine bogs down or stumbles when pressing gas", icon: "TrendingUp" },
    { key: "surging", label: "Surging or Jerking", desc: "Car accelerates and decelerates on its own", icon: "WaveSine" },
    { key: "power-loss", label: "Loss of Power", desc: "Engine feels weak, won't accelerate normally", icon: "TrendingDown" },
  ],
  dashboard: [
    { key: "check-engine", label: "Check Engine Light On", desc: "Yellow engine symbol illuminated", icon: "TriangleAlert" },
    { key: "abs-light", label: "ABS Warning Light", desc: "Anti-lock brake system warning on", icon: "CircleAlert" },
    { key: "battery-light", label: "Battery/Charging Light", desc: "Red battery symbol on dashboard", icon: "BatteryWarning" },
    { key: "oil-light", label: "Oil Pressure Light", desc: "Red oil can symbol illuminated", icon: "Droplets" },
  ],
  steering: [
    { key: "wheel-vibration", label: "Steering Wheel Vibration", desc: "Steering wheel shakes, especially at highway speed", icon: "Vibrate" },
    { key: "pulling", label: "Car Pulls to One Side", desc: "Vehicle drifts left or right on straight road", icon: "ArrowLeftRight" },
    { key: "clunking", label: "Clunking Over Bumps", desc: "Loud clunk or knock when going over bumps", icon: "Hammer" },
    { key: "loose-steering", label: "Loose or Wandering Steering", desc: "Steering feels vague, car wanders on highway", icon: "Move3d" },
  ],
  leaks: [
    { key: "oil-leak", label: "Oil Leak", desc: "Brown or black fluid under engine", icon: "Droplets" },
    { key: "coolant-leak", label: "Coolant Leak", desc: "Green, orange, or pink fluid under front of car", icon: "Droplets" },
    { key: "transmission-leak", label: "Transmission Fluid Leak", desc: "Reddish fluid under middle of car", icon: "Droplets" },
  ],
  transmission: [
    { key: "slipping", label: "Transmission Slipping", desc: "Engine revs but car doesn't accelerate proportionally", icon: "Cog" },
    { key: "hard-shift", label: "Hard or Jerky Shifts", desc: "Transmission bangs or jerks between gears", icon: "ArrowUpDown" },
    { key: "delayed", label: "Delayed Engagement", desc: "Pause before car moves when shifting to Drive or Reverse", icon: "Timer" },
  ],
  electrical: [
    { key: "dimming-lights", label: "Lights Dimming or Flickering", desc: "Headlights or interior lights dim, especially at idle", icon: "SunDim" },
    { key: "battery-drain", label: "Battery Keeps Dying", desc: "Battery goes dead overnight or after sitting", icon: "BatteryWarning" },
    { key: "power-window", label: "Power Window Failure", desc: "Window won't go up or down", icon: "ArrowUpDown" },
  ],
};

export const DIAGNOSES: Record<string, DiagnosisEntry> = {
  "brakes-squealing": { title: "Worn Brake Pads", severity: "medium", description: "Squealing or squeaking when braking is most commonly caused by worn brake pads. Modern brake pads have a built-in wear indicator — a small metal tab that contacts the rotor when pads are thin, producing a high-pitched squeal. In most cases this is not immediately dangerous but the pads should be replaced soon to avoid rotor damage.", possibleCodes: ["C1221"], repairSlugs: ["brake-pads-front", "brake-pads-rear", "rotor-front"], confidence: 92 },
  "brakes-grinding": { title: "Brake Pads Worn to Metal", severity: "critical", description: "A grinding or scraping noise when braking means the brake pads are completely worn down and the metal backing plate is contacting the rotor. This is dangerous — the vehicle's stopping distance is significantly increased. Stop driving and have the brakes inspected immediately. Continued driving will destroy the rotors, turning a $300 brake pad job into a $800+ rotor replacement.", possibleCodes: ["C1221"], repairSlugs: ["brake-pads-front", "rotor-front", "brake-caliper"], confidence: 98 },
  "brakes-soft-pedal": { title: "Brake Fluid Issue or Master Cylinder Failure", severity: "critical", description: "A soft or spongy brake pedal that sinks to the floor usually indicates air in the brake lines (needs bleeding), a brake fluid leak, or a failing master cylinder. This is extremely dangerous — you may lose braking ability. Do not drive the vehicle. Have it towed to a shop.", possibleCodes: ["C0265"], repairSlugs: ["brake-fluid-flush", "brake-caliper"], confidence: 88 },
  "brakes-vibration": { title: "Warped Brake Rotors", severity: "medium", description: "Steering wheel or brake pedal vibration during braking is typically caused by warped or unevenly worn brake rotors. This happens when rotors overheat and deform, creating high and low spots. Rotors usually need to be resurfaced or replaced, along with new brake pads.", possibleCodes: [], repairSlugs: ["rotor-front", "brake-pads-front"], confidence: 90 },
  "brakes-pulling": { title: "Sticking Brake Caliper", severity: "high", description: "When the car pulls to one side during braking, the most common cause is a sticking or seized brake caliper on the opposite side. The caliper piston doesn't retract properly, causing uneven braking force. Other possible causes include collapsed brake hose or contaminated brake pads.", possibleCodes: ["C0267"], repairSlugs: ["brake-caliper", "brake-fluid-flush"], confidence: 85 },
  "engine-knocking": { title: "Engine Knock / Detonation", severity: "high", description: "Engine knocking or pinging under acceleration typically indicates fuel detonation — the air/fuel mixture is igniting unevenly in the cylinders. Common causes include low-octane fuel, carbon buildup in combustion chambers, faulty knock sensor, or timing issues. Continued driving with engine knock can cause piston or cylinder wall damage.", possibleCodes: ["P0325", "P0326", "P0300"], repairSlugs: ["spark-plugs", "ignition-coil", "fuel-injector"], confidence: 80 },
  "engine-ticking": { title: "Low Oil or Valve Train Noise", severity: "medium", description: "A ticking noise from the engine, especially on cold starts, is often caused by low oil level or a valve train issue (lifters, rocker arms, or camshaft wear). Check your oil level first. If the noise persists after topping up, the valve train may need inspection.", possibleCodes: ["P0300"], repairSlugs: ["oil-change-synthetic"], confidence: 75 },
  "engine-rattling": { title: "Timing Chain or Exhaust Heat Shield", severity: "high", description: "A rattling noise from the engine can indicate a loose timing chain (especially on cold start), a failing timing chain tensioner, or a loose exhaust heat shield. Timing chain issues should be addressed urgently as failure can destroy the engine.", possibleCodes: ["P0016", "P0017"], repairSlugs: ["timing-belt", "drive-belt"], confidence: 72 },
  "engine-whining": { title: "Failing Alternator or Power Steering Pump", severity: "medium", description: "A whining noise that changes with engine RPM often comes from a failing alternator bearing, power steering pump, or a slipping serpentine belt. Check if the noise changes when turning the steering wheel — if it does, it's likely the power steering pump.", possibleCodes: ["P0562"], repairSlugs: ["alternator", "power-steering-pump", "drive-belt"], confidence: 82 },
  "engine-rough-idle": { title: "Vacuum Leak or Dirty Idle Air Control", severity: "medium", description: "A rough or surging idle is commonly caused by a vacuum leak, dirty or failing idle air control valve, clogged EGR valve, or faulty mass airflow sensor. The engine computer is struggling to maintain the correct air/fuel mixture at idle.", possibleCodes: ["P0171", "P0505", "P0401"], repairSlugs: ["mass-air-flow-sensor", "egr-valve", "throttle-body"], confidence: 78 },
  "engine-misfire": { title: "Engine Misfire", severity: "high", description: "An engine misfire feels like a stumble or jerk during acceleration. It's caused by incomplete combustion in one or more cylinders. Common causes include worn spark plugs, faulty ignition coils, clogged fuel injectors, or vacuum leaks. A flashing check engine light during a misfire means stop driving immediately.", possibleCodes: ["P0300", "P0301", "P0302", "P0303", "P0304"], repairSlugs: ["spark-plugs", "ignition-coil", "fuel-injector"], confidence: 90 },
  "starting-clicking": { title: "Dead or Weak Battery", severity: "medium", description: "A rapid clicking sound when turning the key means the battery doesn't have enough charge to engage the starter motor. Most commonly this is a dead or weak battery. Try jump-starting. If it starts with a jump, the battery or alternator may need replacement.", possibleCodes: ["P0562"], repairSlugs: ["battery", "alternator"], confidence: 95 },
  "starting-slow-crank": { title: "Weak Battery or Failing Starter", severity: "medium", description: "An engine that cranks very slowly may have a weak battery, corroded battery terminals, or a failing starter motor drawing too much current. Test the battery first — many auto parts stores do this for free.", possibleCodes: ["P0562"], repairSlugs: ["battery", "starter"], confidence: 88 },
  "starting-no-crank": { title: "Dead Battery or Starter Failure", severity: "medium", description: "No sound at all when turning the key usually means the battery is completely dead, the starter solenoid has failed, or there's a problem with the ignition switch or security system. Check battery connections first.", possibleCodes: [], repairSlugs: ["battery", "starter"], confidence: 85 },
  "starting-intermittent": { title: "Loose Connection or Failing Starter", severity: "medium", description: "A car that starts fine sometimes but not others often has a loose or corroded battery connection, a failing starter motor, or a neutral safety switch issue. Check and clean battery terminals first.", possibleCodes: [], repairSlugs: ["battery", "starter"], confidence: 72 },
  "climate-no-cold": { title: "Low Refrigerant or AC Compressor Failure", severity: "low", description: "AC blowing warm air is most commonly caused by low refrigerant (R-134a or R-1234yf) due to a slow leak. Other causes include a failing AC compressor, clogged expansion valve, or bad compressor clutch. A professional AC service can diagnose and recharge the system.", possibleCodes: ["P0530"], repairSlugs: ["ac-compressor"], confidence: 88 },
  "climate-musty-smell": { title: "Mold in AC Evaporator or Cabin Filter", severity: "low", description: "A musty or mildew smell from the AC vents is caused by mold or bacteria growing on the evaporator core or in a dirty cabin air filter. This is common in humid climates. Replace the cabin air filter first, then use an AC evaporator cleaner spray.", possibleCodes: [], repairSlugs: ["cabin-air-filter"], confidence: 95 },
  "climate-weak-airflow": { title: "Clogged Cabin Air Filter or Blower Motor Issue", severity: "low", description: "Weak airflow from the vents with the fan on high is usually a severely clogged cabin air filter, or less commonly a failing blower motor or blower motor resistor. Replace the cabin filter first — it's a $20 fix.", possibleCodes: [], repairSlugs: ["cabin-air-filter", "blower-motor"], confidence: 92 },
  "driving-stalling": { title: "Fuel System or Sensor Failure", severity: "high", description: "Engine stalling while driving is dangerous. Common causes include a failing fuel pump, dirty mass airflow sensor, faulty crankshaft position sensor, or vacuum leak. If the engine restarts immediately, it's likely a sensor issue. If it needs to sit before restarting, suspect the fuel pump.", possibleCodes: ["P0171", "P0300", "P0335"], repairSlugs: ["fuel-pump", "mass-air-flow-sensor", "crankshaft-position-sensor"], confidence: 80 },
  "driving-hesitation": { title: "Fuel Delivery or Ignition Problem", severity: "medium", description: "Engine hesitation when pressing the gas pedal is often caused by a clogged fuel filter, dirty mass airflow sensor, or worn spark plugs. Try basic maintenance items first before investigating more complex issues.", possibleCodes: ["P0171", "P0174", "P0300"], repairSlugs: ["fuel-filter", "mass-air-flow-sensor", "spark-plugs"], confidence: 78 },
  "driving-surging": { title: "Vacuum Leak or Fuel System Issue", severity: "medium", description: "Surging or jerking during steady-speed driving often points to a vacuum leak, dirty throttle body, or intermittent fuel delivery problem. The engine computer is constantly adjusting to compensate for an unstable air/fuel mixture.", possibleCodes: ["P0171", "P0507"], repairSlugs: ["throttle-body", "mass-air-flow-sensor"], confidence: 74 },
  "driving-power-loss": { title: "Clogged Catalytic Converter or Fuel System", severity: "high", description: "Significant loss of power, especially at highway speeds, can indicate a clogged catalytic converter, failing fuel pump, or severely restricted air filter. If accompanied by a sulfur/rotten egg smell, it's almost certainly the catalytic converter.", possibleCodes: ["P0420", "P0430"], repairSlugs: ["catalytic-converter", "fuel-pump", "engine-air-filter"], confidence: 82 },
  "dashboard-check-engine": { title: "Diagnostic Trouble Code Stored", severity: "medium", description: "The check engine light means the vehicle's computer has detected a problem. It could be anything from a loose gas cap to a serious engine issue. The only way to know is to read the diagnostic trouble code with an OBD-II scanner, then look up the code to understand the issue and repair costs.", possibleCodes: ["P0420", "P0300", "P0171", "P0455", "P0442"], repairSlugs: ["spark-plugs", "oxygen-sensor"], confidence: 60 },
  "dashboard-abs-light": { title: "ABS Sensor or Module Issue", severity: "medium", description: "The ABS light indicates a problem with the anti-lock braking system. Common causes include a faulty wheel speed sensor, damaged sensor wiring, or a failing ABS module. Your regular brakes will still work, but the ABS safety feature is disabled.", possibleCodes: ["C0035", "C0040", "C1221", "C1225"], repairSlugs: ["brake-pads-front"], confidence: 85 },
  "dashboard-battery-light": { title: "Charging System Failure", severity: "high", description: "The battery/charging light while driving means the alternator is not charging the battery. The car is running on battery power alone and will die when the battery is depleted — typically within 30-60 minutes. Drive directly to a shop or safe location.", possibleCodes: ["P0562", "P0563"], repairSlugs: ["alternator", "battery"], confidence: 95 },
  "dashboard-oil-light": { title: "Low Oil Pressure — Stop Immediately", severity: "critical", description: "The oil pressure warning light means the engine has dangerously low oil pressure. This can be caused by very low oil level, a failing oil pump, or a major internal engine problem. Stop the engine immediately and check the oil level. Driving even a short distance can destroy the engine.", possibleCodes: ["P0520", "P0521"], repairSlugs: ["oil-change-synthetic", "oil-pan-gasket"], confidence: 98 },
  "steering-wheel-vibration": { title: "Wheel Balance or Suspension Issue", severity: "medium", description: "Steering wheel vibration, especially at highway speeds (55-70 mph), is most commonly caused by unbalanced wheels or tires. Other causes include worn tie rod ends, bad wheel bearings, or warped brake rotors (if vibration occurs during braking).", possibleCodes: [], repairSlugs: ["wheel-alignment", "wheel-bearing", "tie-rod-ends"], confidence: 88 },
  "steering-pulling": { title: "Wheel Alignment or Tire Issue", severity: "medium", description: "A car that pulls to one side on a flat, straight road usually needs a wheel alignment. It can also be caused by uneven tire pressure, a dragging brake caliper, or worn suspension components. Check tire pressures first — it's the simplest fix.", possibleCodes: [], repairSlugs: ["wheel-alignment", "control-arms"], confidence: 90 },
  "steering-clunking": { title: "Worn Suspension Bushing or Ball Joint", severity: "medium", description: "A clunking noise when going over bumps typically indicates worn suspension bushings, a bad ball joint, or worn sway bar links. The noise is caused by metal components hitting each other when the worn rubber bushing fails to cushion the impact.", possibleCodes: [], repairSlugs: ["ball-joints", "control-arms", "shocks-struts"], confidence: 85 },
  "steering-loose-steering": { title: "Worn Tie Rod Ends or Steering Rack", severity: "high", description: "Loose or wandering steering that requires constant correction is often caused by worn tie rod ends, a failing steering rack, or severely worn suspension bushings. This is a safety issue — the vehicle may not respond correctly to steering inputs in an emergency.", possibleCodes: [], repairSlugs: ["tie-rod-ends", "power-steering-pump"], confidence: 82 },
  "leaks-oil-leak": { title: "Oil Leak — Valve Cover or Oil Pan Gasket", severity: "medium", description: "Brown or black fluid leaking from under the engine is engine oil. Common leak points include the valve cover gasket, oil pan gasket, or rear main seal. Small leaks can be monitored, but larger leaks should be repaired to prevent engine damage from low oil.", possibleCodes: [], repairSlugs: ["oil-change-synthetic", "oil-pan-gasket", "valve-cover-gasket"], confidence: 85 },
  "leaks-coolant-leak": { title: "Coolant Leak — Radiator, Hoses, or Water Pump", severity: "high", description: "Green, orange, or pink fluid leaking from under the front of the car is engine coolant. Common sources include a cracked radiator, leaking radiator hose, failing water pump, or blown head gasket. Coolant is toxic to pets — clean spills immediately. Monitor temperature gauge closely.", possibleCodes: ["P0128"], repairSlugs: ["radiator", "water-pump", "thermostat"], confidence: 85 },
  "leaks-transmission-leak": { title: "Transmission Fluid Leak", severity: "medium", description: "Reddish fluid under the middle of the car is transmission fluid. Common leak points include the transmission pan gasket, axle seals, or cooler lines. Low transmission fluid can cause slipping and serious damage. Check fluid level and top off if needed.", possibleCodes: ["P0700"], repairSlugs: ["transmission-fluid"], confidence: 88 },
  "transmission-slipping": { title: "Low Fluid or Worn Transmission", severity: "high", description: "Transmission slipping — engine revs but the car doesn't accelerate — is often caused by low or burnt transmission fluid, worn clutch packs, or a failing torque converter. Check fluid level and condition first. Dark, burnt-smelling fluid indicates internal damage.", possibleCodes: ["P0700", "P0730"], repairSlugs: ["transmission-fluid", "clutch"], confidence: 80 },
  "transmission-hard-shift": { title: "Transmission Fluid or Solenoid Issue", severity: "medium", description: "Hard or jerky shifts can be caused by low or dirty transmission fluid, a faulty shift solenoid, or transmission control module issues. A transmission fluid change often resolves this if caught early.", possibleCodes: ["P0700", "P0750"], repairSlugs: ["transmission-fluid"], confidence: 78 },
  "transmission-delayed": { title: "Low Fluid or Worn Seals", severity: "medium", description: "A delay between shifting to Drive or Reverse and the car actually moving suggests low transmission fluid, worn internal seals, or a failing torque converter. Check fluid level first — it's the most common cause.", possibleCodes: ["P0700"], repairSlugs: ["transmission-fluid"], confidence: 82 },
  "electrical-dimming-lights": { title: "Failing Alternator or Loose Belt", severity: "medium", description: "Lights that dim or flicker, especially at idle or when using multiple electrical accessories, usually indicate a failing alternator that can't keep up with electrical demand, or a loose/slipping serpentine belt.", possibleCodes: ["P0562"], repairSlugs: ["alternator", "battery", "drive-belt"], confidence: 90 },
  "electrical-battery-drain": { title: "Parasitic Battery Drain", severity: "medium", description: "A battery that keeps dying overnight is caused by a parasitic drain — something is drawing power when the car is off. Common culprits include aftermarket alarms, stereo systems, glove box lights that stay on, or a faulty door switch. A mechanic can perform a parasitic draw test to identify the source.", possibleCodes: [], repairSlugs: ["battery", "alternator"], confidence: 80 },
  "electrical-power-window": { title: "Window Regulator or Motor Failure", severity: "low", description: "A power window that won't move is most commonly caused by a failed window regulator (the cable mechanism that lifts the glass) or a burnt-out window motor. If you hear the motor running but the window doesn't move, it's the regulator. If there's no sound, it's the motor or switch.", possibleCodes: [], repairSlugs: ["window-regulator"], confidence: 92 },
};
