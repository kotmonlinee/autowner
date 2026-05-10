// Publish 3 more 老李 articles (batch 10) — alternator vs battery diagnosis, synthetic vs conventional oil, 7 car fluids
// Run: npx tsx scripts/lao-li-articles-10.ts
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf-8")
    .split("\n")
    .filter(l => l && !l.startsWith("#"))
    .map(l => l.split("=").map(s => s.trim()))
);

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!);

const articles = [
  {
    category_slug: "repair",
    title: "How to Diagnose Alternator vs Battery Problems: The $0 Test",
    body: `Your dashboard battery light comes on while you're driving. Or your car cranks slowly this morning. Or it won't start at all and you need a jump. The question every car owner faces at this moment: is it the battery or the alternator?

The answer matters because the costs are very different. An alternator replacement runs $200-500 at a shop, plus labor. A battery is $120-250 and you can install it yourself in 15 minutes in the parking lot. Getting this diagnosis wrong means you spend $300 on a battery when you needed a $400 alternator — and the new battery dies within a week because a bad alternator wasn't charging it.

The good news: you can diagnose this yourself with a $10 multimeter in about 2 minutes. Or, if you don't even have a multimeter, there's a test you can do with zero tools that has been used by mechanics for decades. Let me walk you through both.

---

## First: Understand What That Battery Light Actually Means

The red battery icon on your dashboard does NOT mean "your battery is bad." Read that again. It means "your charging system has a problem." The light is wired into the alternator circuit. When the alternator stops producing sufficient voltage, the light comes on.

This is the single most misunderstood warning light on any car. People see a battery icon and naturally assume the battery is the problem. But a battery light that comes on WHILE you're driving almost always means the alternator has failed or is failing. If the battery were bad, the light wouldn't come on — the battery would just be weak and the car wouldn't start. The light means the alternator isn't charging.

The one exception: the light flickering at idle and going out when you rev the engine. That usually means a loose or worn serpentine belt (the belt that drives the alternator). The belt slips at low RPM and the alternator slows down just enough to drop below charging voltage. A $30 belt and 30 minutes of work vs a $400 alternator — this distinction saves you money.

---

## The $0 Test: Disconnect the Negative Terminal While Running

This is the old-school mechanic's test. I'm going to describe it, but with a modern-car warning first.

**WARNING:** On cars made after roughly 2005, disconnecting the battery while the engine is running can cause voltage spikes that damage sensitive electronics (ECU, alternator voltage regulator, body control modules). Modern alternators rely on the battery as a voltage stabilizer. Removing the battery while the alternator is charging creates a "load dump" — a sudden voltage spike that can hit 40-60 volts for a fraction of a second. On an older car with simple electronics, no problem. On a modern car with dozens of computer modules, you can cause hundreds or thousands of dollars in damage.

So here's the safe version of this test: **use a multimeter instead.** It's more accurate, safer, and a multimeter costs $10 at Harbor Freight or any auto parts store. I'm telling you about the disconnect test because it's part of automotive history and you'll see it recommended on forums — but I'm also telling you NOT to do it on any car made in the last 20 years.

The test works like this: start the engine, disconnect the negative battery terminal. If the engine dies immediately, the alternator is dead — the engine was running entirely on battery power, and removing the battery removed the only source of electricity. If the engine keeps running, the alternator is producing at least some power.

Again: don't do this on a modern car. Just buy the multimeter.

---

## The Multimeter Test (The Right Way)

A digital multimeter costs $10-20 at any auto parts store, hardware store, or Harbor Freight. Set it to DC voltage (the V with a straight line over it, not the wavy line — that's AC voltage, for your house, not your car). Touch the red probe to the positive battery terminal (+), black probe to the negative (-).

**Test 1: Static Voltage (Engine Off)**

With the engine OFF and all accessories OFF (headlights, radio, interior lights, everything), measure the voltage across the battery terminals.

- **12.6V or higher:** Battery is fully charged. Good.
- **12.4V:** About 75% charged. Still functional but worth investigating why it's not fully charged.
- **12.2V:** About 50% charged. The battery is either failing or something is draining it.
- **12.0V or below:** Battery is discharged. Could be a bad battery or a charging system problem.
- **Below 11.8V:** Severely discharged or a dead cell. A 12V battery has 6 cells at ~2.1V each. One dead cell drops you to ~10.5V. If you see 10.5V, the battery is dead — replace it.

If the static voltage is low (below 12.2V), charge the battery with a battery charger and retest before concluding the battery is bad. A good battery that's simply discharged will recover to 12.6V+ after charging. A bad battery won't hold a charge.

**Test 2: Cranking Voltage**

Set your multimeter to min/max mode if it has it (it records the lowest reading). Have someone crank the engine while you watch the meter. The voltage will drop during cranking — that's normal. The starter motor draws 100-200 amps, which pulls the voltage down.

- **Above 10.0V during cranking:** Good battery, strong cranking circuit.
- **9.6V to 10.0V:** Acceptable but the battery is aging.
- **9.0V to 9.6V:** Weak. The battery is near the end of its life, or there's high resistance in the starter circuit (corroded cables, loose connections).
- **Below 9.0V:** Battery is failing or severely discharged. Needs replacement.

The cranking test puts a real-world load on the battery. A battery can show 12.6V static but drop to 7V under load because it has high internal resistance (sulfated plates). The static voltage test tells you charge state. The cranking test tells you health.

**Test 3: Charging Voltage (Engine Running)**

Start the engine. Let it idle. Measure across the battery terminals again.

- **13.8V to 14.7V:** Alternator is working correctly. This is the normal charging range for a 12V system.
- **13.2V to 13.7V:** Alternator is charging but weakly. Could be a failing voltage regulator, worn brushes, or a slipping belt.
- **Below 13.0V:** Alternator is NOT charging adequately. The battery is not being recharged while you drive. You're running on battery power alone.
- **Above 15.0V:** Alternator is OVERCHARGING. The voltage regulator has failed. This will boil the battery dry (literally — the electrolyte will boil off as hydrogen and oxygen gas) and can damage electronics. Fix this immediately.

**Test 4: Charging Under Load**

Turn on as many electrical accessories as possible: headlights on high beam, blower fan on maximum, rear defroster, radio, seat heaters. At idle with everything on, the voltage should stay above 13.2V. If it drops below 13.0V, the alternator can't keep up with the electrical demand — it needs replacement.

---

## The Serpentine Belt: Don't Skip This Check

Before condemning the alternator, check the serpentine belt. A loose, glazed, or worn belt will slip on the alternator pulley, reducing alternator RPM and therefore output. Symptoms: battery light flickers at idle, goes out when you rev. Squealing noise on startup or when turning the steering wheel (the power steering pump is on the same belt). Visual inspection: cracks across the ribs, missing chunks, glazed (shiny) appearance on the ribbed side.

A serpentine belt is $20-40 and takes 30 minutes to replace with basic hand tools (a ratchet or breaker bar to release the tensioner). If your alternator "failure" is actually a belt slipping, you just saved $400.

---

## Parasitic Draw: The Hidden Battery Killer

Here's a scenario: you replace your battery with a brand-new one. Two weeks later, the car won't start again. The alternator tests fine. What gives?

You have a parasitic draw — something in the car is consuming power with the key off. Common culprits: glove box light stuck on (you'd never notice because the glove box is closed), trunk light stuck on, aftermarket alarm system, aftermarket stereo that doesn't fully power down, phone charger left plugged into a 12V socket that's always hot, a relay that's stuck closed, or — on older cars — a diode in the alternator that's failed and is slowly draining the battery through the alternator itself.

Testing for parasitic draw requires a multimeter with an amps setting. Disconnect the negative battery cable. Set the multimeter to DC amps (10A range). Connect one probe to the negative battery terminal and the other to the negative cable. With everything off and doors closed (so the dome light is off), the draw should be under 50 milliamps (0.050 amps). Above 100mA is a problem. Above 500mA will kill a battery overnight.

To find the source: pull fuses one at a time while watching the meter. When the current drops, you've found the circuit with the draw. Then check everything on that circuit.

---

## The Alternator Diode Test

A failing diode in the alternator can cause a parasitic draw AND reduced charging output. Set your multimeter to AC voltage (the wavy line). With the engine running, measure across the battery terminals. You should see less than 0.5V AC. If you see 0.5V AC or higher, one or more diodes in the alternator's rectifier bridge have failed. The alternator is producing AC ripple that the battery and electronics are being exposed to. Replace the alternator.

---

## Common Misdiagnosis Patterns I See

**Pattern 1: "I keep needing jump starts, so I bought a new battery, and now the new one is dead too."**
Diagnosis: Alternator. The old battery might have been fine — it was just never being recharged. Now the new battery is dying for the same reason.

**Pattern 2: "Car starts fine every morning, but if I stop for gas after work, it won't restart."**
Diagnosis: This can be either. If the alternator is weak, a short drive (like from home to the gas station) isn't enough to recharge what the starter used. A long drive (home from work) is. Or, the battery has high internal resistance and can't accept a charge quickly. Test both. A battery with high internal resistance will show normal static voltage but drop severely under load.

**Pattern 3: "Battery light came on, then went off, now the car won't start."**
Diagnosis: The alternator failed intermittently (the battery light came on), then failed completely. You drove on battery power until the battery was depleted (the light went off because the battery was too dead to even illuminate the warning light). Now nothing works. You probably need both an alternator AND a battery — the alternator failed, and the deep discharge damaged the battery.

---

## Cost Summary

| Item | Part Cost | Shop Labor | Total Shop Cost |
|---|---|---|---|
| Battery (flooded) | $120-180 | Free with purchase | $120-180 |
| Battery (AGM) | $180-250 | Free with purchase | $180-250 |
| Alternator (remanufactured) | $120-300 | 1-2 hours | $250-500 |
| Alternator (new OEM) | $300-600 | 1-2 hours | $450-800 |
| Serpentine belt | $20-40 | 0.5 hours | $70-120 |
| Multimeter | $10-20 | N/A | The best $10 you'll ever spend |
| DIY diagnosis | $0 | 2 minutes | Free |

---

## The Bottom Line

If you take away three things from this article:

1. **Battery light while driving = alternator problem, not battery problem.** Don't buy a battery first.
2. **Buy a multimeter.** The voltage tests take 2 minutes and give you a definitive answer. A $10 tool saves you from a $300 misdiagnosis.
3. **12.6V off, 13.8-14.7V running = both are good.** If your numbers are outside these ranges, you know where the problem is.

Got specific voltage readings and not sure what they mean? Drop your year, make, model, and the numbers from all three tests (static, cranking, running). I'll tell you exactly what's wrong.

*— 老李 (Li), ASE Certified Master Technician, 15 years in dealerships and independent shops*`,
  },
  {
    category_slug: "maintenance",
    title: "Synthetic vs Conventional Oil: The Truth No One Tells You",
    body: `The oil aisle at any auto parts store is a monument to marketing. "Full Synthetic." "Synthetic Blend." "High Mileage." "Advanced Full Synthetic." "Extended Performance." "Ultra Platinum." "European Formula." The bottles are gold, platinum, silver, and royal purple. They promise cleaner engines, better protection, longer life, more horsepower, and — in one particularly ambitious claim I saw — "DNA-level protection." Your engine does not have DNA.

Behind the labels, there are only three real categories of engine oil. Let's strip away the marketing and talk about what's actually in the bottle, what it means for your engine, and whether you're wasting money.

---

## The Three Real Types of Engine Oil

### Conventional Oil (Group II Base Oil)

This starts as crude oil pumped out of the ground. It's refined through a process called hydrocracking, which removes impurities and rearranges some of the hydrocarbon molecules. The result is a base oil with molecules of many different sizes and shapes — some long chains, some short, some ring structures. It's like a jar of mixed nuts: peanuts, almonds, cashews, all different sizes and shapes.

Conventional oil contains naturally occurring waxes, sulfur compounds, and unstable molecules that break down at high temperatures. The additive package (detergents, dispersants, anti-wear agents, viscosity modifiers, antioxidants) has to compensate for the base oil's weaknesses. Over time, the additives deplete and the base oil itself oxidizes (reacts with oxygen) and thickens into sludge.

Typical conventional oil: $20-30 per 5-quart jug.

### Full Synthetic Oil (Group III, IV, or V Base Oils)

**Group III** ("Synthetic" by legal definition in the US): Highly refined mineral oil that has been so heavily processed that its molecules are uniform in size and shape. The waxes and unstable compounds have been removed or converted. The performance is close to true synthetics, but it starts as crude oil. Most "full synthetic" oils on the shelf today are Group III. Brands like Pennzoil Platinum, Mobil 1 (some grades), Castrol EDGE, and Valvoline Advanced are primarily Group III.

**Group IV (PAO - Polyalphaolefins):** True synthetic oil. PAO molecules are built from scratch in a chemical reactor from ethylene gas. Every molecule is identical. No wax, no sulfur, no unstable compounds. PAO flows better at extreme cold (-40F or below), resists oxidation better at extreme heat, and maintains its viscosity longer than Group III. The downside: PAO is expensive, and on its own it doesn't dissolve additives well, so it's usually blended with a small amount of Group V (ester) base oil. Mobil 1 originally was mostly PAO; today's formulations vary by grade.

**Group V (Esters and others):** Ester-based oils are the highest-performance synthetics. They're polar molecules — they electrostatically cling to metal surfaces, providing a protective film even when the engine is off. They handle extreme heat better than anything else. Used in jet engines, racing oils, and as "carrier oil" mixed with PAO to dissolve additives. Red Line, Motul 300V, and some boutique oils are ester-based. These cost $12-20 per quart.

Full synthetic price range: $25-55 per 5-quart jug, with Group V formulations at the high end.

### Synthetic Blend (Warning: Marketing Term)

"Synthetic blend" is unregulated. It can mean anywhere from 5% to 30% synthetic base oil mixed with conventional. Most blends are at the low end — 10-15% synthetic. You're getting a conventional oil with a small amount of synthetic to boost the cold-flow and high-temperature performance slightly above straight conventional.

Synthetic blend is a compromise. It costs more than conventional ($25-40 per jug) and performs marginally better. For a car that calls for conventional, it's an upgrade, albeit a modest one. For a car that requires full synthetic, it's not enough — use the real thing.

---

## What Synthetic Actually Does Better (And What It Doesn't)

Let's talk about the properties that actually matter, not the marketing claims.

**Cold Flow (Pour Point)**

Synthetic oil flows at much lower temperatures. Conventional 5W-30 might start getting thick and syrupy around -20F. A Group IV PAO 5W-30 is still flowing freely at -50F. This matters most in the first 30 seconds after a cold start, when the oil pump is trying to push oil through tight bearing clearances. With synthetic, oil pressure builds faster, and bearings get lubrication sooner.

This is especially important for turbocharged engines. The turbocharger spins at up to 150,000 RPM on a thin film of oil. A turbo bearing starved for oil at startup — even for a few seconds — wears rapidly. If you have a turbo engine, synthetic oil's cold-flow advantage is significant.

**High-Temperature Stability (Oxidation Resistance)**

At high temperatures — inside the ring lands of the pistons, around the turbo bearing housing, in the cylinder head near the exhaust valves — conventional oil oxidizes. It reacts with oxygen, thickens, and eventually turns into sludge. Synthetic base oils (especially PAO and esters) resist oxidation at much higher temperatures.

For a commuter car driven gently, oil temperatures rarely exceed 220-240F, and conventional oil handles this fine if changed on schedule. For a turbocharged engine, an engine that tows, or an engine driven hard enough to push oil temps above 250F, synthetic's oxidation resistance becomes genuinely protective.

**Cleaning Ability**

Synthetic oil is better at keeping engines clean. The uniform molecules in synthetic base oil don't leave behind the varnish and deposits that conventional oil's varied molecules can. If you've ever opened an engine that ran conventional oil for 150,000 miles, you know what I mean — brown varnish on everything, carbon deposits in the ring grooves, sludge in the valve cover. Engines run on full synthetic with regular changes look remarkably clean inside.

**Volatility (Oil Consumption)**

Conventional oil contains lighter hydrocarbon fractions that evaporate at high temperatures. This is called "volatility" — the oil literally boils off. Synthetic oil has much lower volatility. In practical terms: an engine that burns a quart of conventional oil every 3,000 miles might burn only half a quart of synthetic in the same interval. Less oil consumption means fewer top-offs and less oil in the combustion chamber (where it contributes to carbon deposits).

**Viscosity Stability (Shear Resistance)**

Engine oil is squeezed between moving parts at thousands of PSI. The long polymer chains that give oil its viscosity (the "viscosity index improvers") get physically sheared — chopped into shorter pieces — over time. When this happens, a 5W-30 oil effectively becomes a 5W-20. Synthetic oil uses more shear-stable VIIs and the base oil itself is more resistant to viscosity breakdown. A synthetic oil stays closer to its rated viscosity for its entire service life.

---

## The Uncomfortable Truth: For Many Drivers, Conventional Is Fine

Here's the part the oil companies don't want me to tell you: If you drive a 2005 Toyota Camry — a naturally aspirated four-cylinder, gently driven, in a moderate climate — and you change your conventional oil every 5,000 miles, your engine will outlast the rest of the car. The body will rust, the transmission will fail, the suspension will wear out, and the engine will still be running fine on conventional oil changed on schedule.

I've seen Camrys with 250,000 miles on nothing but conventional oil and 5,000-mile changes. The engines are clean, compression is good, oil consumption is minimal. The "you MUST use synthetic" messaging from quick-lube chains and oil company ads is marketing, not engineering necessity, for most naturally aspirated commuter engines.

The key variable is NOT synthetic vs conventional — it's change interval. A conventional oil changed every 5,000 miles is better for your engine than a synthetic oil changed every 15,000 miles. Fresh oil removes contaminants. Old oil — even the most expensive synthetic — accumulates fuel dilution, water, acids, and abrasive particles. The best oil in the world can't protect your engine when it's loaded with contaminants.

---

## When Synthetic Is Worth the Money

That said, there are engines where synthetic is genuinely worth the extra $15-25 per oil change:

**Turbocharged engines (all of them):** The turbo runs on engine oil. It's cooled by engine oil. The bearing housing sees extreme heat. After you shut off the engine, the oil sitting in the turbo bearing bakes — this is called "heat soak." Conventional oil will coke (turn to carbon) in the turbo bearing over time. Synthetic resists coking much better. If your car has a turbo, use full synthetic.

**Direct-injection engines:** These run higher compression ratios and produce more heat in the piston ring area. They're also prone to fuel dilution (fuel washing past the rings into the oil) which thins the oil. Synthetic handles both heat and dilution better.

**High-performance engines:** Any engine that revs high, makes high specific output (horsepower per liter), or is driven aggressively. The oil temperatures are higher, the shear forces are higher, and the consequences of oil breakdown are a blown engine, not just excessive wear.

**Extreme cold climates:** If you regularly start your car at -20F or below, synthetic oil's cold-flow advantage is significant. The oil pump has to push cold oil through tight bearing clearances — thinner cold oil reaches bearings faster.

**Extended oil change intervals:** If you're running 7,500-10,000 mile oil change intervals (as many modern cars specify), you need synthetic. Conventional oil can't reliably last that long without significant degradation.

**Vehicles with auto start-stop systems:** The engine restarts dozens of times per trip. Each restart is a wear event because oil pressure hasn't fully built. Synthetic builds pressure faster and maintains a better boundary layer between metal surfaces.

---

## The Oil Change Interval Debate

Modern oil life monitors (the percentage display on your dash) track engine revolutions, temperature, trip length, and driving conditions. They're quite accurate. If your car's oil life monitor says 15% at 7,500 miles and you're using full synthetic, you're fine.

But the 10,000-15,000 mile oil changes that some manufacturers advertise? I'm skeptical. Not because the oil can't last that long — a good synthetic can. But because other things happen in 10,000-15,000 miles that need attention: the oil filter might be due, a small leak might have started, the air filter might need replacement, the tires should be rotated. The oil change interval has historically been the interval at which someone actually looks at the car. Stretching it to once a year means problems are caught later.

My personal recommendation for most cars: 5,000 miles on conventional, 7,500 miles on full synthetic. Adjust based on your driving: severe service (frequent short trips, dusty conditions, towing, idling) means change sooner. Highway commuting is easy on oil — you could probably stretch synthetic to 10,000 miles on a highway commuter.

---

## The Additive Package: What Matters and What's Marketing

The additive package is the 15-25% of the oil that isn't base oil. It contains:

**Detergents and dispersants** (calcium, magnesium compounds): Keep contaminants suspended in the oil so they don't form deposits. Detergents clean existing deposits. Dispersants keep new contaminants from sticking. These deplete over time — when they're gone, sludge starts forming.

**Anti-wear agents** (Zinc Dialkyl Dithiophosphate, or ZDDP): The most important anti-wear compound. ZDDP forms a sacrificial film on metal surfaces that wears away instead of the metal. ZDDP levels have been reduced in modern oils (to protect catalytic converters), which is why older flat-tappet cam engines need special high-ZDDP oils.

**Viscosity index improvers** (polymers): Long-chain molecules that expand when hot and contract when cold, giving the oil multi-grade properties so a 5W-30 behaves like 5-weight when cold and 30-weight when hot. These shear over time.

**Antioxidants:** Slow the rate at which the oil oxidizes (reacts with oxygen and thickens). Critical for extended drain intervals.

**Friction modifiers:** Reduce friction between moving parts for better fuel economy. These are what make "Energy Conserving" oil different.

The additive package is what separates a good oil from a great oil. But here's the thing: every major oil brand (Mobil 1, Pennzoil, Castrol, Valvoline, Shell Rotella) has a good additive package that meets API SP and ILSAC GF-6 standards. The differences between name-brand oils at the same price point are small. The difference between ANY name-brand oil and the cheapest off-brand is significant.

---

## Cost Reality

| Oil Type | Cost per 5 qt | Change Interval | Annual Cost (15k mi/yr) |
|---|---|---|---|
| Conventional (Havoline, Pennzoil yellow) | $20-30 | 5,000 mi | $60-90 |
| Synthetic Blend (Valvoline, Castrol) | $25-40 | 5,000-7,500 mi | $50-120 |
| Full Synthetic Group III (Mobil 1, Pennzoil Plat, Castrol EDGE) | $30-45 | 7,500 mi | $60-90 |
| Full Synthetic Group IV/V (Amsoil, Red Line) | $40-55 | 10,000+ mi | $60-82 |

Add $5-12 for an oil filter and $30-50 for labor if you're paying a shop. DIY oil change with full synthetic and a good filter: $40-60. Quick-lube synthetic change: $70-100. Dealer synthetic change: $80-120.

---

## My Verdict

If your owner's manual says "conventional oil is fine" and you're not in any of the "synthetic is worth it" categories above, buy conventional and change it every 5,000 miles. Your engine will outlast the car.

If you're in any of those categories — turbo, direct injection, performance, extreme cold, extended intervals — buy full synthetic (any major brand is fine) and change it every 7,500 miles. The extra $15-20 per oil change is cheap insurance.

If you're running a high-performance engine hard, or tracking your car, step up to a PAO/ester synthetic (Red Line, Motul, Amsoil Signature) with elevated ZDDP. These are not API-certified for street use (because the ZDDP levels exceed the catalytic-converter-safe limit), but they protect engines under conditions that would destroy street oil.

One thing is certain: the brand and marketing claims matter far less than the change interval. Fresh oil of ANY type is better than the best oil in the world that's been in the engine for 15,000 miles. Change your oil.

Got a specific car and not sure what oil to run? Post your year, make, model, engine, mileage, and how you drive (commute, tow, track, short trips, etc.). I'll tell you exactly what to buy.

*— 老李 (Li), ASE Certified Master Technician, 15 years in dealerships and independent shops*`,
  },
  {
    category_slug: "maintenance",
    title: "7 Car Fluids You Should Check Monthly (Not Just Oil)",
    body: `Most car owners check one fluid: oil. And only when the dashboard tells them to. The other fluids under the hood? They get ignored until there's a symptom — a burning smell, a grinding noise, a transmission that doesn't shift, an overheating engine. By then, the damage is done.

Your car runs on seven different fluids, each with a specific job, a specific lifespan, and specific warning signs when something is wrong. Checking all seven takes 10 minutes once a month. It costs nothing. And it catches problems before they become repairs.

Let's walk through each one: what it does, how to check it properly, what it should look like, and when to worry.

---

## 1. Engine Oil

**What it does:** Lubricates every moving part inside your engine — pistons, rings, bearings, camshaft, valves, timing chain — while also cooling (oil carries away about 40% of the engine's heat), cleaning (detergents suspend contaminants), and protecting against corrosion.

**How to check it:** Park on level ground. If the engine has been running, wait 5 minutes after shutting it off — this gives the oil time to drain back into the oil pan so you get an accurate reading. Pull the dipstick (usually yellow handle), wipe it clean with a rag or paper towel, reinsert it fully, then pull it again and read the level.

The dipstick has two marks — minimum and maximum, or two holes, or a crosshatched area. The oil level should be between them, ideally at or near the top mark. If it's at or below the bottom mark, add half a quart and recheck. The distance between the min and max marks typically represents one quart of oil.

**What it should look like:**
- **New oil:** Amber to light brown, translucent.
- **Normal used oil:** Dark brown to black (this is normal — the oil is holding contaminants in suspension, which is its job). Black oil doesn't mean bad oil.
- **Milky or foamy:** Coolant in the oil. This is a blown head gasket or worse. Stop driving immediately. You'll also notice a mayonnaise-like residue on the oil cap — that's water emulsifying with oil. A tiny bit on the cap (common in winter from condensation) is okay. Significant amounts on the dipstick are not.
- **Gritty texture:** If you rub the oil between your fingers and feel grit, there's metal in the oil. Bad. The oil filter should catch this, so if you're feeling metal, the filter is bypassing or the wear is happening too fast for the filter to handle.

**When to worry:** Oil level drops more than 1 quart per 1,000 miles (excessive consumption); milky appearance; gritty texture; strong fuel smell (oil dilution from a rich fuel mixture or excessive short trips where the engine never warms up).

---

## 2. Coolant (Antifreeze + Water)

**What it does:** Transfers heat from the engine to the radiator, prevents freezing in winter, prevents boiling in summer, and contains corrosion inhibitors that protect the entire cooling system (radiator, heater core, water pump, engine block, cylinder head) from rust and electrolysis.

**How to check it:** **CRITICAL SAFETY RULE: NEVER open a hot radiator cap.** The cooling system is pressurized. At operating temperature, the coolant is 200-230F and under 13-16 PSI of pressure. Opening the cap releases the pressure instantly, and the superheated coolant will flash-boil into steam. This is a guaranteed trip to the burn unit. I've seen it happen. A mechanic at a shop I worked at spent three weeks in the hospital from one moment of inattention.

Check coolant at the RESERVOIR — the translucent plastic tank connected to the radiator by a hose, marked with "MIN" and "MAX" or "FULL" and "LOW" lines. Check when the engine is COLD (before starting in the morning, or after sitting for at least 2 hours). The level should be between the marks. If it's low, add a 50/50 mix of coolant and DISTILLED water (not tap water — minerals in tap water cause scaling and corrosion inside the engine).

If you must open the radiator cap to check or add coolant (because the reservoir is empty), wait until the engine is completely cold. Even then, use a rag over the cap and open it slowly, in stages, to release any residual pressure.

**What it should look like:**
- **Every green/yellow coolant:** Bright green, yellow-green, or gold (depending on formulation). Translucent.
- **Orange/red/pink coolant (Dex-Cool / OAT):** Bright orange or pink. Translucent.
- **Blue coolant (Asian vehicles):** Bright blue.
- **Dirty, rusty, or brown coolant:** Corrosion inhibitors are depleted, and there's rust in the system. Needs a coolant flush.
- **Milky or oily coolant:** Oil in the coolant — blown head gasket or oil cooler failure.
- **Debris floating in the reservoir:** Deteriorating hoses, rust flakes, or someone added "stop leak" product. Any of these are bad.

**When to worry:** Level drops consistently (you have a leak — find it); dirty/rusty appearance; oil in coolant; sweet smell from the exhaust (burning coolant — head gasket); sweet smell inside the car (heater core leak).

---

## 3. Brake Fluid

**What it does:** Transmits the force from your foot on the brake pedal through the master cylinder, through the brake lines, to the calipers (or wheel cylinders), which clamp the pads against the rotors. Brake fluid is hydraulic fluid — it's incompressible, which is how it transmits force so effectively.

**How to check it:** The brake fluid reservoir is on top of the master cylinder, which is bolted to the brake booster on the firewall (driver's side, behind the engine). The reservoir is translucent with "MIN" and "MAX" marks. Check the level without opening the cap (opening exposes the fluid to moisture in the air, which it absorbs).

The brake fluid level naturally drops as brake pads wear. This is normal. As the pads get thinner, the caliper pistons extend further, and more fluid sits in the calipers. When you install new pads and push the pistons back, the fluid level rises back to full. If the fluid level is at MIN and your brake pads are worn, the level is fine — the pads need replacement, not a fluid top-off. If the level is low and the pads are new, you have a leak. Find it before driving.

**What it should look like:**
- **New brake fluid:** Clear with a slight amber/yellow tint. Looks like light vegetable oil.
- **Aged brake fluid (1-2 years):** Darker amber, like tea.
- **Bad brake fluid (3+ years):** Dark brown, like coffee or cola. This means the fluid has absorbed significant moisture (brake fluid is hygroscopic — it absorbs water from the air). Moisture in brake fluid lowers its boiling point. Under hard braking, the fluid can boil in the calipers, creating compressible gas bubbles in a system that relies on incompressible liquid. The pedal goes to the floor, and you have no brakes. This is called brake fade, and it's terrifying.
- **Black or contains particles:** The seals in the master cylinder or calipers are deteriorating. Needs immediate attention.

**When to worry:** Dark brown/black color (flush the system — brake fluid should be flushed every 2-3 years regardless of mileage); low level when pads are not worn (leak); soft or spongy brake pedal (air or moisture in the system).

---

## 4. Transmission Fluid

**What it does:** Lubricates the gears, bearings, and clutches inside the transmission; provides hydraulic pressure that operates the shift circuits; cools the transmission; and (in automatic transmissions) transmits engine torque through the torque converter. Transmission fluid is the most complex fluid in the car, with a demanding set of simultaneous responsibilities.

**How to check it:** This depends on your car.

**If you have a transmission dipstick:** Most older cars (pre-2010) and many trucks/SUVs have one. It's usually further back in the engine bay than the oil dipstick, with a red or yellow handle. The procedure is DIFFERENT from checking oil: the engine should be WARM and RUNNING, transmission in Park or Neutral (check your owner's manual). With engine running, pull the dipstick, wipe it, reinsert, pull and read. The level should be in the crosshatched area. The reason you check with the engine running: the transmission pump is circulating fluid. When the engine is off, fluid drains back into the pan, giving you a falsely high reading.

**If you have a "sealed" transmission (no dipstick):** Most modern cars (post-2010 or so — BMW, Audi, many Toyotas, most Fords) have no dipstick. Checking the fluid requires lifting the car, removing the fill plug (NOT the drain plug), and checking for fluid at the fill hole with the transmission at a specific temperature — a procedure that's typically not DIY-friendly. If you have a sealed transmission and there's no evidence of a leak, check the fluid when the manufacturer's specified interval comes up (often 60,000-100,000 miles) and have a shop do it. If you notice shifting problems, have it checked immediately.

**What it should look like:**
- **New ATF (automatic transmission fluid):** Bright red, translucent, slightly sweet-smelling.
- **Normal used ATF:** Darker red, still translucent. No burnt smell.
- **Bad ATF:** Brown or black, opaque, smells burnt. Burnt smell = the clutches inside the transmission have been slipping and the fluid has overheated. This is the most reliable warning sign of transmission trouble.
- **Milky or foamy:** Coolant has mixed with the transmission fluid (usually from a failed transmission cooler in the radiator). The transmission will fail very soon if this isn't addressed.
- **CVT fluid:** Typically green, blue, or amber (not red). CVT fluids are vehicle-specific. Don't substitute regular ATF in a CVT — it will destroy the belt/chain.

**When to worry:** Fluid is brown and smells burnt; level is consistently low (transmission leak — find it); fluid has metal flakes (shine a flashlight on the dipstick); delayed engagement when shifting into Drive or Reverse; slipping, hard shifts, or flaring (RPM rising between shifts).

---

## 5. Power Steering Fluid

**What it does:** Provides hydraulic assist to the steering rack, making the steering wheel light and easy to turn. The power steering pump — driven by the engine's serpentine belt — pressurizes the fluid, which acts on a piston in the steering rack to multiply your steering input.

**Note:** Many modern cars (especially 2015+) have ELECTRIC power steering — there's no fluid to check. If your car has an electric motor on the steering column or rack instead of a belt-driven pump on the engine, you don't have power steering fluid. Check your owner's manual if you're unsure.

**How to check it:** The power steering fluid reservoir is on or near the power steering pump, which is driven by the serpentine belt (usually on the front of the engine, passenger side on transverse engines). The cap may have a small dipstick attached to the underside. Some reservoirs are translucent with MIN/MAX marks on the outside. Check with the engine OFF. Wipe the dipstick or check the marks on the reservoir. Top off if low, using the correct fluid type (see below).

**What it should look like:**
- **New power steering fluid:** Clear, amber, or red — depending on the type.
- **Normal used fluid:** Slightly darker but still translucent.
- **Bad fluid:** Dark brown or black, burnt smell, contains visible particles. The pump is grinding itself up, or the steering rack seals are disintegrating.

**Critical: Use the correct fluid.** This is NOT a "whatever is on the shelf" situation. Power steering systems use different fluids:
- Many Asian cars (Honda, Toyota, Nissan): Use HONDA/Acura-specific power steering fluid. Do NOT use generic power steering fluid or ATF in a Honda — it will destroy the seals in days.
- Many European cars (BMW, Mercedes, VW/Audi): Use CHF 11S or CHF 202 (a green mineral hydraulic fluid). Do NOT use anything else.
- Many domestic cars (Ford, GM, Chrysler): Use power steering fluid or, in some cases, ATF. Check the cap or owner's manual.

Putting the wrong fluid in the power steering system causes seal swelling or shrinking, leaks, and expensive pump and rack replacement. The fluid costs $10-15. A power steering rack replacement costs $600-1,200.

**When to worry:** Whining noise when turning (pump is low on fluid or failing); stiff steering (belt slipping, pump failing, or low fluid); fluid is black/has metal particles; you see red puddles under the front of the car (power steering fluid leaking).

---

## 6. Windshield Washer Fluid

**What it does:** Cleans your windshield. Sprayed through nozzles onto the glass, wiped away by the wipers. The simplest system in the car.

**How to check it:** The reservoir is a translucent tank (usually blue cap) that you can see through. Look at the level. When it's low, fill it. That's it.

**What it should look like:** Blue or orange, depending on the brand. Free of debris.

**Important:** Use windshield washer fluid, not water. Washer fluid contains:
- Methanol or ethanol to prevent freezing (water will freeze and crack the reservoir and lines in winter)
- Detergents to clean bug splatter and road grime
- Surfactants that help the fluid sheet across the glass

Water in your washer system: freezes in winter, doesn't clean as well, can grow algae/bacteria (that musty smell from your vents when you spray), and the minerals in tap water can clog the spray nozzles over time.

**When to worry:** Washer fluid disappearing rapidly (leak in the reservoir or lines — the reservoir is often in the fender well, where it can be damaged by road debris); spray nozzles are clogged (use a pin or needle to clean them out, or replace them — $5 each); the washer pump doesn't make noise when you activate it (pump is dead — $20-40 replacement).

---

## 7. Differential Fluid (Gear Oil)

**What it does:** Lubricates the ring and pinion gears inside the differential. The differential is the assembly between your drive wheels that allows them to spin at different speeds when turning (the outside wheel travels further than the inside wheel, so it must spin faster). Differential fluid is thick, heavy gear oil (typically 75W-90 or 80W-90) that contains extreme-pressure additives to protect the meshing gear teeth under high load.

**How to check it:** This is the least convenient fluid to check. Most differentials don't have a dipstick. To check the level, you crawl under the car, remove the fill plug (typically a 3/8" or 1/2" square drive plug on the side of the differential cover or housing), and stick your finger in. The fluid should be right at the bottom of the fill hole — if you can touch it with your fingertip, the level is good. If you can't feel fluid, add gear oil until it drips out of the fill hole.

For most people, the practical monthly check is different: LOOK FOR LEAKS. The differential has three places that leak: the cover gasket, the pinion seal (where the driveshaft enters the differential), and the axle seals (where the axles exit each side). If you see wetness or drips at any of these points, you have a leak. A differential that leaks will eventually run dry, and a differential that runs dry destroys its ring and pinion gears ($1,500-3,000 replacement).

Checking for leaks: look under the rear of the car (rear-wheel-drive) or both ends (all-wheel-drive). The differential is the pumpkin-shaped metal housing in the center of the axle. Check for wet spots, drips, or a film of oil and dirt on the housing.

**What it should look like:**
- **New gear oil:** Thick, honey-colored to dark amber. Strong sulfur smell (this is normal — the extreme-pressure additives contain sulfur compounds).
- **Normal used gear oil:** Darker amber to brown. Still smells like sulfur.
- **Bad gear oil:** Black, watery (viscosity breakdown), metallic swirl (gear teeth are wearing), or milky (water contamination — usually from a vent tube that got submerged).

**When to worry:** Visible leaks at the cover, pinion seal, or axle seals; metallic particles in the drained fluid; howling or whining noise from the differential that changes with speed (worn gears or bearings); vibration at highway speeds that comes from the rear of the car.

**Service interval:** Differential fluid should be changed every 30,000-60,000 miles, more frequently if you tow or drive in water/mud. This is one of the most neglected fluid changes. Most differential failures are due to old, dirty, low, or empty fluid.

---

## The 10-Minute Monthly Check Routine

Here's the routine I teach at the shop. Do this once a month, on the first Saturday morning, for example. It takes 10 minutes once you know where everything is:

1. Hood up, engine COLD. Check coolant reservoir level and appearance. Check brake fluid level and color (look, don't open). Check power steering fluid. Check windshield washer fluid.
2. Pull the oil dipstick. Wipe, reinsert, check level and appearance.
3. If you have a transmission dipstick: start engine, let warm up. Shift through all gears (P-R-N-D and back), then check transmission fluid with engine RUNNING. Check color and smell.
4. Look under the car with a flashlight. Check for drips or wet spots under the engine (oil), transmission (red fluid), power steering (red or amber), coolant (green/orange), differential (thick honey-colored), and brake system (amber — check at each wheel for wetness around the calipers and rubber brake lines).
5. Tire pressure check (while you're looking at each wheel).

---

## Fluid Change Interval Cheat Sheet

| Fluid | Check | Change Interval |
|---|---|---|
| Engine Oil | Monthly | 5,000-7,500 mi (conventional/synthetic) |
| Coolant | Monthly | 30,000-100,000 mi (varies by type; check manual) |
| Brake Fluid | Monthly (level), every 6 months (color) | Every 2-3 years regardless of miles |
| Transmission Fluid | Monthly if dipstick; check for leaks if sealed | 30,000-100,000 mi (varies widely; check manual) |
| Power Steering Fluid | Monthly | 50,000-75,000 mi or when dirty |
| Washer Fluid | Monthly | Top off as needed |
| Differential Fluid | Monthly for leaks | 30,000-60,000 mi |

---

## Costs at a Glance

| Fluid | DIY Cost | Shop Cost |
|---|---|---|
| Oil + filter change | $30-55 | $50-120 |
| Coolant drain & fill | $20-40 | $80-150 |
| Coolant flush (full system) | $40-70 | $120-200 |
| Brake fluid flush | $15-25 | $80-130 |
| Transmission drain & fill | $30-60 | $100-200 |
| Transmission flush (full) | $60-100 | $150-300 |
| Power steering flush | $15-25 | $80-150 |
| Differential fluid change | $20-40 | $80-150 |

---

The most expensive fluid change you'll ever do is the one you skip. Low coolant? Blown head gasket — $1,500-3,000. Low transmission fluid? Transmission rebuild — $2,500-5,000. Old brake fluid? Boiled fluid on a mountain descent — the cost of whatever you hit. Low differential fluid? Rebuild — $1,500-3,000.

Ten minutes a month. Park the car on level ground, pop the hood, follow the checklist. It's free, it's easy, and it's the difference between a car that makes it to 200,000 miles and a car that needs a new engine at 120,000.

Got a question about a specific fluid, a noise, a leak, or what to buy? Post your details and I'll help you figure it out.

*— 老李 (Li), ASE Certified Master Technician, 15 years in dealerships and independent shops*`,
  },
];

async function main() {
  console.log("Publishing 老李 articles batch 10...\n");

  let published = 0;
  const byCategory: Record<string, number> = {};

  for (const a of articles) {
    const { data: cat } = await supabase.from("categories").select("id, name").eq("slug", a.category_slug).single();
    if (!cat) { console.log("Category not found:", a.category_slug); continue; }

    const { data: post, error } = await supabase
      .from("posts")
      .insert({
        title: a.title,
        body: a.body,
        category_id: cat.id,
        source: "user",
        status: "approved",
        content_type: "guide",
      })
      .select("id, title")
      .single();

    if (error) {
      console.log("Error:", error.message);
    } else {
      published++;
      byCategory[cat.name] = (byCategory[cat.name] ?? 0) + 1;
      console.log(`[${published}] ${cat.name} — ${a.title}`);
    }
  }

  console.log(`\nDone. Published ${published} of ${articles.length} articles.`);
  console.log("\nPublished by category:");
  for (const [cat, count] of Object.entries(byCategory).sort(([,a],[,b]) => b - a)) {
    console.log(`  ${cat}: ${count}`);
  }
}

main().catch(console.error);
