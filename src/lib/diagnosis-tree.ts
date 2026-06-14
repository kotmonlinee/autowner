// ── 3-Level Diagnosis Tree ───────────────────────────────
// Step 1: What do you notice? (13 categories, aligned with symptoms hub)
// Step 2: Where/What specifically?
// Step 3: When does it happen?
// → AI Diagnosis

export interface Option {
  key: string;
  label: string;
}

export interface Step2Option extends Option {
  step3s: Option[];
}

export const STEP1: Option[] = [
  { key: "noise", label: "Unusual noise or sound" },
  { key: "smell", label: "Strange smell or odor" },
  { key: "smoke", label: "Smoke or steam from the car" },
  { key: "vibration", label: "Vibration or shaking" },
  { key: "starting", label: "Hard to start or won't start" },
  { key: "performance", label: "Power loss, stalling, or hesitation" },
  { key: "warning-lights", label: "Dashboard warning light is on" },
  { key: "temperature", label: "Engine overheating or temperature issue" },
  { key: "fluid", label: "Fluid leaking under the car" },
  { key: "brakes", label: "Brake or steering issue" },
  { key: "electrical", label: "Electrical problem (lights, windows, battery)" },
  { key: "hvac", label: "AC or heater not working properly" },
  { key: "transmission", label: "Transmission or gear shifting problem" },
];

export const STEP2: Record<string, Step2Option[]> = {
  noise: [
    { key: "engine-bay", label: "From the engine compartment", step3s: [
      { key: "cold-start", label: "On cold start" },
      { key: "accelerating", label: "When accelerating" },
      { key: "idle", label: "At idle / stopped" },
      { key: "always", label: "All the time" },
    ]},
    { key: "wheels-brakes", label: "From the wheels or brakes", step3s: [
      { key: "braking", label: "When braking" },
      { key: "driving", label: "While driving" },
      { key: "bumps", label: "Over bumps" },
    ]},
    { key: "under-car", label: "From under the car", step3s: [
      { key: "bumps", label: "Over bumps" },
      { key: "turning", label: "When turning" },
      { key: "always", label: "All the time" },
    ]},
    { key: "inside", label: "Inside the cabin", step3s: [
      { key: "driving", label: "While driving" },
      { key: "ac-on", label: "When AC or heat is on" },
    ]},
    { key: "exhaust", label: "From the exhaust", step3s: [
      { key: "accelerating", label: "When accelerating" },
      { key: "idle", label: "At idle" },
    ]},
    { key: "belt-area", label: "Squealing from belt area (front of engine)", step3s: [
      { key: "cold-start", label: "On cold start, goes away" },
      { key: "accelerating", label: "When accelerating" },
      { key: "ac-on", label: "When AC turns on" },
    ]},
    { key: "unsure", label: "Not sure where it's from", step3s: [
      { key: "always", label: "All the time" },
      { key: "sometimes", label: "Occasionally" },
    ]},
  ],
  smell: [
    { key: "sweet", label: "Sweet / maple syrup smell", step3s: [
      { key: "driving", label: "While driving or after parking" },
      { key: "ac-on", label: "When AC or heat is on" },
    ]},
    { key: "burning-rubber", label: "Burning rubber smell", step3s: [
      { key: "after-driving", label: "After driving or high speed" },
    ]},
    { key: "burning-oil", label: "Burning oil smell", step3s: [
      { key: "engine-bay", label: "From the engine bay" },
      { key: "exhaust", label: "From the exhaust" },
    ]},
    { key: "gasoline", label: "Gasoline / fuel smell", step3s: [
      { key: "cold-start", label: "On cold start" },
      { key: "driving", label: "While driving or after refueling" },
      { key: "always", label: "All the time" },
    ]},
    { key: "musty", label: "Musty / moldy smell", step3s: [
      { key: "ac-on", label: "When AC is on" },
      { key: "after-rain", label: "After rain or car wash" },
    ]},
    { key: "rotten-egg", label: "Rotten egg / sulfur smell", step3s: [
      { key: "accelerating", label: "When accelerating or after high speed" },
      { key: "idle", label: "At idle" },
    ]},
    { key: "exhaust-fumes", label: "Exhaust fumes inside car", step3s: [
      { key: "idle", label: "At idle or stopped" },
      { key: "driving", label: "While driving" },
    ]},
    { key: "burning-electrical", label: "Burning plastic / electrical smell", step3s: [
      { key: "driving", label: "While driving" },
      { key: "after-using", label: "After using power accessories" },
    ]},
  ],
  smoke: [
    { key: "white-smoke", label: "White smoke from exhaust", step3s: [
      { key: "cold-start", label: "On cold start (goes away)" },
      { key: "always", label: "All the time (thick white)" },
    ]},
    { key: "blue-smoke", label: "Blue or gray smoke from exhaust", step3s: [
      { key: "cold-start", label: "On cold start" },
      { key: "accelerating", label: "When accelerating" },
      { key: "always", label: "All the time" },
    ]},
    { key: "black-smoke", label: "Black smoke from exhaust", step3s: [
      { key: "accelerating", label: "When accelerating hard" },
      { key: "always", label: "All the time" },
    ]},
    { key: "engine-bay-smoke", label: "Smoke or steam from engine bay", step3s: [
      { key: "overheating", label: "With overheating or temp gauge high" },
      { key: "burning-smell", label: "With burning smell" },
      { key: "after-parking", label: "After parking" },
    ]},
  ],
  vibration: [
    { key: "steering-wheel", label: "Steering wheel shakes", step3s: [
      { key: "highway", label: "At highway speed (50-75 mph)" },
      { key: "braking", label: "When braking" },
      { key: "always", label: "All the time" },
    ]},
    { key: "body-shake", label: "Whole car shakes or vibrates", step3s: [
      { key: "idle", label: "At idle / stopped" },
      { key: "accelerating", label: "When accelerating" },
      { key: "highway", label: "At highway speeds" },
      { key: "driving", label: "While driving at any speed" },
    ]},
    { key: "seat-floor", label: "Seat or floor vibrates", step3s: [
      { key: "idle", label: "At idle / stopped" },
      { key: "driving", label: "While driving" },
    ]},
    { key: "pedal-pulse", label: "Brake pedal pulses or vibrates", step3s: [
      { key: "braking", label: "When braking" },
      { key: "high-speed", label: "At highway speed braking" },
    ]},
  ],
  performance: [
    { key: "stalling", label: "Engine stalls or dies", step3s: [
      { key: "idle", label: "At idle or when stopping" },
      { key: "driving", label: "While driving" },
      { key: "cold", label: "When engine is cold" },
    ]},
    { key: "rough-idle", label: "Rough or uneven idle", step3s: [
      { key: "cold-start", label: "On cold start" },
      { key: "always", label: "All the time" },
      { key: "ac-on", label: "Worse with AC on" },
    ]},
    { key: "loss-of-power", label: "Loss of power or weak acceleration", step3s: [
      { key: "always", label: "All the time" },
      { key: "uphill", label: "Going uphill or under load" },
      { key: "hot", label: "Worse when engine is hot" },
    ]},
    { key: "hesitation", label: "Jerking or hesitation when accelerating", step3s: [
      { key: "hard-accel", label: "During hard acceleration" },
      { key: "low-speed", label: "At low speed / in traffic" },
    ]},
    { key: "misfire", label: "Engine misfire or running rough", step3s: [
      { key: "always", label: "All the time" },
      { key: "wet", label: "After rain or car wash" },
    ]},
    { key: "surging", label: "Engine surges or RPM fluctuates while cruising", step3s: [
      { key: "steady-throttle", label: "At steady throttle" },
      { key: "uphill", label: "Going uphill" },
    ]},
    { key: "poor-economy", label: "Sudden drop in fuel economy", step3s: [
      { key: "recent", label: "Recently started" },
      { key: "winter", label: "During winter" },
    ]},
  ],
  "warning-lights": [
    { key: "check-engine-solid", label: "Check Engine light (solid)", step3s: [
      { key: "no-symptoms", label: "No other symptoms" },
      { key: "shaking", label: "With shaking or power loss" },
      { key: "recent-fuel", label: "After refueling" },
    ]},
    { key: "check-engine-flash", label: "Check Engine light (flashing)", step3s: [
      { key: "shaking", label: "With shaking or rough running" },
    ]},
    { key: "oil-pressure", label: "Oil pressure warning (red)", step3s: [
      { key: "driving", label: "Came on while driving" },
      { key: "idle", label: "At idle, goes away with RPM" },
    ]},
    { key: "battery", label: "Battery / Charging warning (red)", step3s: [
      { key: "driving", label: "Came on while driving" },
      { key: "dim-lights", label: "With dimming headlights" },
    ]},
    { key: "abs", label: "ABS warning light", step3s: [
      { key: "always-on", label: "Always on" },
      { key: "intermittent", label: "Comes and goes" },
    ]},
    { key: "airbag", label: "Airbag / SRS warning light", step3s: [
      { key: "always-on", label: "Always on" },
    ]},
    { key: "traction", label: "Traction control light", step3s: [
      { key: "always-on", label: "Always on" },
      { key: "when-slipping", label: "Flashes when wheels slip" },
    ]},
    { key: "tpms", label: "Tire pressure warning (TPMS)", step3s: [
      { key: "always-on", label: "Always on" },
      { key: "cold-weather", label: "Only in cold weather" },
    ]},
    { key: "brake-warning", label: "Brake warning light (red)", step3s: [
      { key: "always-on", label: "Always on" },
      { key: "soft-pedal", label: "With soft brake pedal" },
    ]},
    { key: "coolant-temp-light", label: "Coolant temperature warning (red/blue)", step3s: [
      { key: "red", label: "Red — engine overheating" },
      { key: "blue", label: "Blue — engine cold (normal)" },
    ]},
  ],
  temperature: [
    { key: "overheating", label: "Engine overheating", step3s: [
      { key: "driving", label: "While driving" },
      { key: "idle", label: "At idle or in traffic" },
      { key: "ac-on", label: "Worse with AC on" },
    ]},
    { key: "gauge-high", label: "Temperature gauge reads high", step3s: [
      { key: "driving", label: "While driving" },
      { key: "slowly-rising", label: "Slowly rising over time" },
    ]},
    { key: "coolant-loss", label: "Coolant boiling or overflowing", step3s: [
      { key: "after-shutdown", label: "After engine shutdown" },
      { key: "driving", label: "While driving" },
    ]},
    { key: "heater-cold", label: "Heater blows cold air", step3s: [
      { key: "always", label: "All the time" },
      { key: "idle-only", label: "Only at idle, warm when driving" },
    ]},
    { key: "fan-not-running", label: "Cooling fan not running", step3s: [
      { key: "overheating", label: "Engine overheating at idle" },
      { key: "ac-on", label: "When AC is turned on" },
    ]},
    { key: "temp-fluctuates", label: "Temperature gauge fluctuates rapidly", step3s: [
      { key: "driving", label: "While driving" },
      { key: "idle", label: "At idle after driving" },
    ]},
  ],
  starting: [
    { key: "clicking", label: "Clicking sound, won't crank", step3s: [
      { key: "always", label: "Every time" },
      { key: "sometimes", label: "Occasionally" },
    ]},
    { key: "no-sound", label: "No sound at all when turning key", step3s: [
      { key: "always", label: "Every time" },
      { key: "sometimes", label: "Occasionally" },
    ]},
    { key: "cranks-no-start", label: "Engine cranks but won't start", step3s: [
      { key: "cold", label: "When engine is cold" },
      { key: "hot", label: "After engine is warm" },
    ]},
    { key: "slow-crank", label: "Engine cranks slowly", step3s: [
      { key: "cold", label: "Worse in cold weather" },
      { key: "always", label: "All the time" },
    ]},
    { key: "starts-dies", label: "Starts then immediately dies", step3s: [
      { key: "cold", label: "When engine is cold" },
      { key: "always", label: "Every time" },
    ]},
    { key: "normal-crank-no-start", label: "Cranks normally but won't start", step3s: [
      { key: "cold", label: "When engine is cold" },
      { key: "hot", label: "After engine is warm" },
      { key: "after-sitting", label: "After sitting for days" },
    ]},
    { key: "long-crank", label: "Takes longer to start than usual", step3s: [
      { key: "worsening", label: "Getting worse over time" },
      { key: "cold", label: "Worse when cold" },
    ]},
  ],
  fluid: [
    { key: "oil", label: "Brown or black fluid under engine", step3s: [
      { key: "few-drops", label: "Just a few drops" },
      { key: "puddle", label: "Noticeable puddle" },
      { key: "burning-smell", label: "With burning smell from engine" },
    ]},
    { key: "coolant", label: "Green, orange or pink fluid under front", step3s: [
      { key: "parked", label: "After parking" },
      { key: "overheating", label: "Car runs hot or overheats" },
    ]},
    { key: "transmission", label: "Red fluid under middle of car", step3s: [
      { key: "parked", label: "After parking" },
      { key: "shifting-issue", label: "With shifting problems" },
    ]},
    { key: "brake-fluid", label: "Clear or yellowish fluid near wheels", step3s: [
      { key: "soft-pedal", label: "Brake pedal feels soft" },
      { key: "parked", label: "After parking" },
    ]},
    { key: "power-steering", label: "Red or pink fluid near front of car", step3s: [
      { key: "steering-heavy", label: "Steering feels heavy or stiff" },
      { key: "parked", label: "After parking" },
    ]},
    { key: "clear-water", label: "Clear water under car", step3s: [
      { key: "ac-on", label: "When AC was running (normal)" },
      { key: "not-ac", label: "AC wasn't on" },
    ]},
  ],
  brakes: [
    { key: "soft-pedal", label: "Brake pedal feels soft or spongy", step3s: [
      { key: "always", label: "All the time" },
      { key: "hard-stop", label: "During hard braking" },
    ]},
    { key: "pedal-floor", label: "Brake pedal goes to the floor", step3s: [
      { key: "always", label: "Every time" },
      { key: "fluid-loss", label: "Brake fluid level is dropping" },
    ]},
    { key: "grinding", label: "Grinding or squealing when braking", step3s: [
      { key: "always", label: "Every time I brake" },
      { key: "first-brake", label: "First few stops then goes away" },
    ]},
    { key: "pulling", label: "Car pulls to one side when braking", step3s: [
      { key: "always", label: "Every time I brake" },
      { key: "hard-braking", label: "Only during hard braking" },
    ]},
    { key: "steering-pull", label: "Car pulls to one side while driving", step3s: [
      { key: "always", label: "All the time" },
      { key: "highway", label: "Mostly at highway speed" },
    ]},
    { key: "steering-heavy", label: "Steering feels heavy or stiff", step3s: [
      { key: "always", label: "All the time" },
      { key: "low-speed", label: "At low speed or parking" },
    ]},
    { key: "steering-loose", label: "Steering feels loose or wanders", step3s: [
      { key: "highway", label: "At highway speed" },
      { key: "bumps", label: "Over bumps" },
    ]},
    { key: "parking-brake", label: "Parking brake won't hold or won't release", step3s: [
      { key: "wont-hold", label: "Won't hold on hills" },
      { key: "stuck", label: "Won't release / light stays on" },
    ]},
  ],
  electrical: [
    { key: "battery-dead", label: "Battery keeps dying or won't hold charge", step3s: [
      { key: "overnight", label: "Overnight or after sitting" },
      { key: "while-driving", label: "While driving (alternator)" },
    ]},
    { key: "dim-lights", label: "Headlights or interior lights dimming", step3s: [
      { key: "idle", label: "At idle" },
      { key: "always", label: "All the time" },
    ]},
    { key: "flickering", label: "Dashboard or lights flickering", step3s: [
      { key: "driving", label: "While driving" },
      { key: "always", label: "All the time" },
    ]},
    { key: "window", label: "Power window not working", step3s: [
      { key: "one-window", label: "Just one window" },
      { key: "all-windows", label: "All windows" },
    ]},
    { key: "radio", label: "Radio or infotainment not working", step3s: [
      { key: "no-power", label: "No power at all" },
      { key: "intermittent", label: "Works sometimes" },
    ]},
    { key: "blown-fuse", label: "Fuse keeps blowing repeatedly", step3s: [
      { key: "same-circuit", label: "Same fuse every time" },
      { key: "after-rain", label: "After rain or car wash" },
    ]},
    { key: "accessories", label: "Wipers, locks, or horn not working", step3s: [
      { key: "one-item", label: "Just one accessory" },
      { key: "multiple", label: "Multiple accessories" },
      { key: "intermittent", label: "Works sometimes" },
    ]},
  ],
  hvac: [
    { key: "not-cold", label: "AC not blowing cold air", step3s: [
      { key: "always", label: "All the time" },
      { key: "highway-only", label: "Cold on highway, warm in traffic" },
      { key: "gradual", label: "Gradually got worse over time" },
    ]},
    { key: "weak-airflow", label: "Very weak airflow from vents", step3s: [
      { key: "all-speeds", label: "On all fan speeds" },
      { key: "some-speeds", label: "Only on certain speeds" },
    ]},
    { key: "musty-smell", label: "Musty or moldy smell from vents", step3s: [
      { key: "ac-on", label: "When AC is on" },
      { key: "always", label: "All the time" },
    ]},
    { key: "no-heat", label: "Heater not blowing hot air", step3s: [
      { key: "always", label: "All the time" },
      { key: "after-warmup", label: "Even after engine warms up" },
    ]},
    { key: "no-power", label: "AC system won't turn on at all", step3s: [
      { key: "always", label: "Doesn't work" },
      { key: "intermittent", label: "Works sometimes" },
    ]},
  ],
  transmission: [
    { key: "slipping", label: "Transmission slipping or revving without moving", step3s: [
      { key: "cold", label: "When cold" },
      { key: "hot", label: "After warming up" },
      { key: "uphill", label: "Going uphill" },
    ]},
    { key: "hard-shift", label: "Harsh or jerky gear shifts", step3s: [
      { key: "every-shift", label: "Every shift" },
      { key: "cold", label: "Only when cold" },
      { key: "specific-gear", label: "Only between certain gears" },
    ]},
    { key: "delayed-engage", label: "Delay when shifting into Drive or Reverse", step3s: [
      { key: "cold", label: "When cold" },
      { key: "always", label: "All the time" },
    ]},
    { key: "wont-move", label: "Car in gear but won't move", step3s: [
      { key: "cold", label: "When engine is cold" },
      { key: "hot", label: "After warming up" },
    ]},
    { key: "whining", label: "Whining or humming noise from transmission", step3s: [
      { key: "accelerating", label: "When accelerating" },
      { key: "all-speeds", label: "At all speeds" },
    ]},
    { key: "shuddering", label: "Shuddering or shaking at low speed", step3s: [
      { key: "light-throttle", label: "Under light acceleration (30–50 mph)" },
      { key: "uphill", label: "Going uphill at low speed" },
    ]},
  ],
};
