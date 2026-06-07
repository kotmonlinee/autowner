// ── 3-Level Diagnosis Tree ───────────────────────────────
// Step 1: What do you notice? (symptom type)
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
  { key: "vibration", label: "Vibration or shaking" },
  { key: "power", label: "Power loss or weak acceleration" },
  { key: "dash-light", label: "Dashboard warning light is on" },
  { key: "starting", label: "Hard to start or won't start" },
  { key: "fluid", label: "Fluid leaking under the car" },
  { key: "climate", label: "AC not cold or smells bad" },
  { key: "other", label: "Something else is wrong" },
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
      { key: "ac-on", label: "When AC is on" },
    ]},
    { key: "exhaust", label: "From the exhaust", step3s: [
      { key: "accelerating", label: "When accelerating" },
      { key: "idle", label: "At idle" },
    ]},
    { key: "unsure", label: "Not sure where it's from", step3s: [
      { key: "always", label: "All the time" },
    ]},
  ],
  smell: [
    { key: "sweet", label: "Sweet smell", step3s: [
      { key: "driving", label: "While driving or after parking" },
      { key: "ac-on", label: "When AC is on" },
    ]},
    { key: "burning-rubber", label: "Burning rubber smell", step3s: [
      { key: "after-driving", label: "After driving or high speed" },
    ]},
    { key: "burning-oil", label: "Burning oil smell", step3s: [
      { key: "engine-bay", label: "From the engine bay" },
    ]},
    { key: "gasoline", label: "Gasoline / fuel smell", step3s: [
      { key: "cold-start", label: "On cold start" },
      { key: "driving", label: "While driving or after refueling" },
      { key: "always", label: "All the time" },
    ]},
    { key: "musty", label: "Musty / moldy smell", step3s: [
      { key: "ac-on", label: "When AC is on" },
      { key: "after-rain", label: "After rain" },
    ]},
    { key: "chemical", label: "Sharp chemical smell", step3s: [
      { key: "always", label: "All the time" },
    ]},
    { key: "rotten-egg", label: "Rotten egg / sulfur smell", step3s: [
      { key: "accelerating", label: "When accelerating or after high speed" },
    ]},
  ],
  vibration: [
    { key: "steering-wheel", label: "Steering wheel shakes", step3s: [
      { key: "highway", label: "At highway speed (50-75 mph)" },
      { key: "braking", label: "When braking" },
      { key: "always", label: "All the time" },
    ]},
    { key: "body-shake", label: "Whole car shakes", step3s: [
      { key: "idle", label: "At idle / stopped" },
      { key: "accelerating", label: "When accelerating" },
      { key: "bumps", label: "Over bumps" },
      { key: "driving", label: "While driving" },
    ]},
    { key: "seat-floor", label: "Seat or floor vibrates", step3s: [
      { key: "idle", label: "At idle / stopped" },
    ]},
  ],
  power: [
    { key: "slow-response", label: "Slow throttle response", step3s: [
      { key: "always", label: "All the time" },
      { key: "hot", label: "Worse when engine is hot" },
    ]},
    { key: "jerking", label: "Jerking or hesitation", step3s: [
      { key: "hard-accel", label: "During hard acceleration" },
      { key: "low-speed", label: "At low speed / in traffic" },
    ]},
    { key: "no-power-uphill", label: "No power uphill or under load", step3s: [
      { key: "uphill", label: "Going uphill or heavy load" },
      { key: "always", label: "All the time" },
    ]},
    { key: "rpm-up-no-go", label: "Engine revs but car won't move", step3s: [
      { key: "always", label: "All the time" },
      { key: "sometimes", label: "Occasionally" },
    ]},
  ],
  "dash-light": [
    { key: "check-engine-yellow", label: "Check Engine light (yellow)", step3s: [
      { key: "no-symptoms", label: "No other symptoms" },
      { key: "shaking", label: "With shaking or power loss" },
      { key: "flashing", label: "Flashing when accelerating" },
    ]},
    { key: "oil-red", label: "Oil pressure light (red)", step3s: [
      { key: "driving", label: "Came on while driving" },
    ]},
    { key: "battery-red", label: "Battery / Charging light (red)", step3s: [
      { key: "driving", label: "Came on while driving" },
    ]},
    { key: "abs-yellow", label: "ABS light (yellow)", step3s: [
      { key: "always-on", label: "Always on" },
    ]},
    { key: "airbag-yellow", label: "Airbag / SRS light (yellow)", step3s: [
      { key: "always-on", label: "Always on" },
    ]},
    { key: "tpms-yellow", label: "Tire pressure light (yellow)", step3s: [
      { key: "always-on", label: "Always on" },
    ]},
  ],
  starting: [
    { key: "clicking", label: "Clicking sound, won't crank", step3s: [
      { key: "always", label: "Every time" },
      { key: "sometimes", label: "Occasionally" },
    ]},
    { key: "no-sound", label: "No sound at all", step3s: [
      { key: "always", label: "Every time" },
      { key: "sometimes", label: "Occasionally" },
    ]},
    { key: "cranks-no-start", label: "Engine cranks but won't start", step3s: [
      { key: "cold", label: "When engine is cold" },
      { key: "hot", label: "After engine is warm" },
    ]},
    { key: "long-crank", label: "Takes longer to start than usual", step3s: [
      { key: "worsening", label: "Getting worse over time" },
    ]},
    { key: "starts-dies", label: "Starts then immediately dies", step3s: [
      { key: "cold", label: "When engine is cold" },
      { key: "always", label: "Every time" },
    ]},
  ],
  fluid: [
    { key: "oil", label: "Brown or black fluid under engine", step3s: [
      { key: "few-drops", label: "Just a few drops" },
      { key: "puddle", label: "Noticeable puddle" },
    ]},
    { key: "coolant", label: "Green, orange or pink fluid under front", step3s: [
      { key: "parked", label: "After parking" },
      { key: "overheating", label: "Car runs hot or overheats" },
    ]},
    { key: "transmission", label: "Red fluid under middle of car", step3s: [
      { key: "parked", label: "After parking" },
    ]},
    { key: "clear-water", label: "Clear water under car", step3s: [
      { key: "ac-on", label: "When AC was running" },
      { key: "not-ac", label: "AC wasn't on" },
    ]},
  ],
  climate: [
    { key: "not-cold", label: "Air not cold (fan works)", step3s: [
      { key: "always", label: "All the time" },
      { key: "highway-only", label: "Cold on highway, warm in traffic" },
      { key: "starts-cold", label: "Cold at first then warm" },
    ]},
    { key: "weak-airflow", label: "Very weak airflow", step3s: [
      { key: "always", label: "All the time" },
      { key: "intermittent", label: "Comes and goes" },
    ]},
    { key: "musty-smell", label: "Musty or moldy smell", step3s: [
      { key: "ac-on", label: "When AC is on" },
    ]},
    { key: "no-power", label: "AC won't turn on at all", step3s: [
      { key: "always", label: "Doesn't work" },
    ]},
  ],
  other: [
    { key: "high-fuel", label: "Sudden drop in fuel economy", step3s: [
      { key: "recent", label: "Recently started" },
      { key: "winter", label: "During winter" },
    ]},
    { key: "heavy-steering", label: "Steering feels heavy", step3s: [
      { key: "always", label: "All the time" },
      { key: "low-speed", label: "At low speed" },
    ]},
    { key: "soft-brakes", label: "Brakes feel soft or weak", step3s: [
      { key: "always", label: "All the time" },
      { key: "hard-stop", label: "During hard braking" },
    ]},
    { key: "hard-brakes", label: "Brake pedal is very hard", step3s: [
      { key: "always", label: "All the time" },
    ]},
    { key: "wont-move", label: "Car in gear but won't move", step3s: [
      { key: "cold", label: "When engine is cold" },
      { key: "hot", label: "After warming up" },
    ]},
    { key: "hard-shift", label: "Harsh or jerky gear shifts", step3s: [
      { key: "every-shift", label: "Every shift" },
    ]},
  ],
};
