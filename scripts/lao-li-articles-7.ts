// Publish 3 more 老李 articles (batch 7)
// Run: npx tsx scripts/lao-li-articles-7.ts
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
    category_slug: "maintenance",
    title: "How to Flush Your Cooling System at Home (And Why You Should Every 5 Years)",
    body: `Most people never think about their coolant until the temperature gauge starts climbing into the red. By then, it's often too late — or at least a lot more expensive than it needed to be. Coolant is not a "fill it and forget it" fluid. It degrades over time, and degraded coolant does real damage to your engine.

I've replaced head gaskets on engines that had perfectly good oil change records but coolant that hadn't been touched in 8 years. The head gasket didn't fail because of a manufacturing defect — it failed because old, acidic coolant ate through it from the inside. A $50 DIY coolant flush every 5 years would have prevented a $2,000 head gasket job.

Let me explain what happens to coolant as it ages, how to know when yours is due, and how to flush your cooling system at home with basic tools.

---

## What Happens to Coolant Over Time

Fresh coolant is a 50/50 mix of ethylene glycol (or propylene glycol) and water, plus a carefully formulated additive package. The glycol prevents freezing and raises the boiling point. The additives — called the inhibitor package — do several critical jobs:

**Corrosion inhibition.** The inside of your engine has multiple metals in contact with coolant: cast iron (block), aluminum (heads, water pump housing, radiator), brass (heater core, thermostat), copper (some heater cores), and steel (freeze plugs). When dissimilar metals sit in an electrically conductive liquid, you get galvanic corrosion — one metal corrodes to protect the other. The inhibitors form a protective film on all metal surfaces to stop this.

**Cavitation protection.** The water pump impeller spins at thousands of RPM and creates low-pressure zones where bubbles form and collapse against metal surfaces. These collapsing bubbles create microscopic shockwaves that erode metal — a process called cavitation corrosion. The additive package includes chemicals that reduce surface tension and minimize cavitation damage. This is especially critical on diesel engines with wet cylinder liners, where cavitation can actually eat holes through the cylinder walls.

**pH buffering.** Fresh coolant is slightly alkaline (pH 8-10). As the inhibitors are consumed, the coolant becomes acidic. Acidic coolant etches metal surfaces — especially aluminum. Aluminum engine parts (heads, timing covers, water pump housings) are particularly vulnerable.

Over time — typically 5 years or 100,000 miles for conventional coolant, longer for extended-life formulations — the inhibitor package is depleted. The coolant loses its ability to prevent corrosion. It becomes acidic. And that's when problems start.

---

## Signs Your Coolant Needs Changing

**Rust-colored or murky coolant.** Pop the radiator cap when the engine is COLD (never open a hot radiator — the system is pressurized and will spray boiling coolant). Use a flashlight to look inside. Fresh coolant should be bright green, orange, yellow, pink, or blue depending on the formulation. If it looks rusty brown, muddy, or has visible particles floating in it, it's overdue.

**Sweet smell inside the cabin.** Coolant has a distinctly sweet smell. If you smell it inside the car when the heater is running, you likely have a leaking heater core. The heater core is a small radiator buried inside the dashboard. Replacing it is a major job — 6-10 hours of labor on most cars because the entire dashboard has to come out. Catching coolant degradation early prevents heater core corrosion.

**Fluctuating temperature gauge.** If your temperature gauge moves up and down during normal driving — especially creeping up at stops and coming back down at speed — you may have restricted coolant passages from rust and scale buildup, or a failing water pump from cavitation damage.

**Low coolant in the reservoir.** If you're topping off coolant regularly and there's no visible external leak, old coolant can cause internal leaks. Degraded coolant can seep past head gasket sealing rings, or the water pump seal can fail due to cavitation pitting on the pump shaft.

---

## Coolant Types: Don't Mix Them

Before buying coolant, you need to know which type your car uses. Mixing incompatible coolants can cause gelling — the additives react and form a sludge that clogs radiators and heater cores.

**IAT (Inorganic Acid Technology) — "Green coolant."** The original coolant formulation. Contains silicates and phosphates as corrosion inhibitors. Service life: 2-3 years or 30,000-50,000 miles. Common in older cars (pre-mid-1990s). The silicates provide fast-acting corrosion protection but deplete relatively quickly.

**OAT (Organic Acid Technology) — Typically orange, red, or dark green.** Uses organic acids (sebacate, 2-ethylhexanoic acid) instead of silicates. Longer service life: 5 years or 100,000-150,000 miles. Common in GM vehicles (Dex-Cool orange), some European cars. OAT coolants protect aluminum well but can be aggressive to certain solder and gasket materials in older cars.

**HOAT (Hybrid Organic Acid Technology) — Yellow, pink, turquoise, or blue.** Combines silicates with organic acids. Service life: 5 years or 100,000-150,000 miles. Used by many European (G11/G12/G13, blue/pink/violet), Asian (Toyota pink, Honda blue, Subaru blue), and newer American vehicles (Chrysler Mopar HOAT). HOAT is essentially the best of both worlds — fast silicate protection plus long-lasting organic acid protection.

**Si-OAT (Silicate-enhanced OAT) — Purple, violet.** A newer formulation used in some late-model European cars. Combines OAT base with advanced silicates for aluminum protection.

**The golden rule:** Read your owner's manual. Use the coolant type specified. If you're unsure, go to the dealership parts counter and buy the OEM coolant. The extra $5-10 per gallon is cheap insurance against compatibility issues. Never mix colors unless you've verified they're chemically compatible.

---

## Step-by-Step: DIY Coolant Flush

**Tools and supplies:**
- Drain pan (at least 3-gallon capacity)
- New coolant — 1-2 gallons of concentrate (you'll mix 50/50 with distilled water) OR 2-4 gallons of pre-mixed 50/50
- Distilled water (4-6 gallons — do NOT use tap water; the minerals cause scale)
- Funnel
- Pliers (for hose clamps)
- Socket set (for drain petcock if applicable)
- Safety glasses and nitrile gloves
- Flashlight

**Estimated time:** 1-2 hours
**Cost:** $30-50 for coolant and distilled water vs $120-200 at a shop

---

### Step 1: Safety First — Let the Engine Cool Completely

The cooling system operates at 190-220°F and 13-16 PSI of pressure. Removing the radiator cap on a hot engine will spray boiling coolant everywhere. Serious burns. Let the car sit for at least 2 hours after driving. The upper radiator hose should be cool to the touch, not warm.

If you must work on a warm engine, place a thick rag over the radiator cap and SLOWLY turn it to the first detent (the safety stop) to vent pressure. Wait until hissing stops completely, then push down and turn to remove. Still — just wait for it to cool.

---

### Step 2: Drain the Old Coolant

Position your drain pan under the radiator. Most radiators have a drain petcock (a plastic plug or wing nut) at the bottom corner on either the driver or passenger side. Look for it — sometimes it's hidden behind the splash shield. If your radiator doesn't have a petcock (some aftermarket radiators don't), you'll drain by removing the lower radiator hose.

**If you have a petcock:**
1. Remove the radiator cap (to vent the system and allow drainage).
2. Open the petcock by turning it counterclockwise. Some petcocks require a quarter turn and pull, others unscrew completely. Coolant will flow out of the petcock — often a small nipple you can attach a hose to for cleaner draining. If there's a nipple, slip a length of 3/8" clear vinyl hose over it and route it to your drain pan.
3. Let it drain completely. This removes about 40-50% of the coolant — the rest is trapped in the engine block.

**If you're removing the lower radiator hose:**
1. Position the drain pan under the lower hose connection.
2. Use pliers to release the spring clamp on the radiator end of the lower hose.
3. Slide the clamp up the hose (away from the radiator).
4. Twist and pull the hose off the radiator neck. Expect a rush of coolant — the drain pan needs to be positioned correctly.

---

### Step 3: Drain the Engine Block (Optional but Recommended)

To get a thorough flush, drain the engine block as well. Most engines have a block drain plug — typically a brass or steel plug on the side of the block, near the freeze plugs. It's often hard to reach (behind the exhaust manifold, usually). On many modern cars, accessing the block drain is impractical without a lift. If you can reach it safely with the car on jack stands, remove the plug and let the block drain. If you can't reach it, don't worry — the distilled water flush in the next step will dilute and remove most of the old coolant.

---

### Step 4: Flush with Distilled Water

1. Close the drain petcock or reattach the lower radiator hose.
2. Fill the radiator (or expansion tank, depending on your car) with distilled water until it reaches the top of the filler neck or the "Full" mark on the tank.
3. Replace the radiator cap. Start the engine and turn the heater to MAX HEAT, fan on high. This opens the heater control valve and circulates water through the heater core, flushing it too.
4. Let the engine idle until the upper radiator hose gets hot — this means the thermostat has opened and coolant is circulating through the entire system. Usually takes 10-15 minutes.
5. Shut off the engine. Let it cool for 45-60 minutes (the water is now near boiling temperature).
6. Drain the water the same way you drained the coolant.
7. Repeat steps 1-6 until the water drains clear. Typically takes 2-3 cycles. The first drain will be brownish — old coolant residue. The second will be lighter. The third should run mostly clear.
8. If your water is still dirty after 3 cycles, consider using a commercial cooling system flush chemical (Prestone or similar). Follow the chemical's instructions — typically you add it with water, run the engine for 10-15 minutes, then drain and flush with water again.

---

### Step 5: Refill with Fresh Coolant

1. Close all drain points.
2. Check your owner's manual for the cooling system capacity. A typical passenger car holds 1.5-3 gallons (6-12 quarts) total.
3. If you bought CONCENTRATE coolant: Mix 50/50 with distilled water in a clean container before pouring. Do not pour concentrate and water separately into the radiator — they mix poorly and you'll get stratification. A 50/50 mix gives freeze protection to -34°F and boil protection to 265°F with a 15 PSI cap.
4. If you bought PRE-MIXED 50/50: Pour directly from the jug. No mixing needed. Pre-mix is more expensive per gallon of coolant but more convenient.
5. Fill the radiator to the top of the filler neck (or the expansion tank to the Full mark).
6. Start the engine with the radiator cap OFF and let it warm up. As the thermostat opens, you'll see the coolant level in the radiator drop as it circulates through the engine and expels air. Top off as the level drops. You'll also see bubbles surfacing — this is trapped air being purged. Keep adding coolant until the level stabilizes at the top and no more bubbles appear.
7. Once the level is stable, replace the radiator cap. Fill the expansion/overflow tank to the "Full" or "MAX" line.
8. Go for a 10-15 minute drive. Return home and let the engine cool completely (several hours or overnight).
9. Check the coolant level in the expansion tank. It will likely have dropped as remaining air pockets worked their way out. Top off to the Full line.

---

### Step 6: Proper Disposal of Old Coolant

This is critically important. Used coolant contains ethylene glycol and dissolved heavy metals (lead, copper, zinc) from the engine's internal surfaces. Ethylene glycol is extremely toxic. It tastes sweet — animals and children are attracted to it. A single teaspoon can kill a cat. A few ounces can kill a dog or a child.

**NEVER:**
- Pour coolant on the ground
- Pour coolant down a storm drain
- Pour coolant into a septic system
- Leave open pans of coolant where animals can drink them

**ALWAYS:**
- Capture all drained coolant in a clean drain pan
- Transfer to sealed containers (old coolant jugs work perfectly)
- Take to AutoZone, O'Reilly, Advance Auto Parts, or your local auto parts store — virtually all of them accept used coolant for FREE recycling
- Most municipal household hazardous waste facilities also accept coolant
- Wipe up any spills immediately with kitty litter or rags

---

## Cost Comparison

| Item | DIY Cost | Shop Cost |
|---|---|---|
| Coolant (2 gallons concentrate) | $30-40 | Included in service |
| Distilled water (4 gallons) | $5-8 | Included |
| Drain pan | $10-15 (reusable) | — |
| **Total** | **$45-63 first time, $30-40 subsequent** | **$120-200** |

---

## Common Mistakes

**Using tap water.** Tap water contains calcium, magnesium, and other minerals that form scale inside the radiator and engine passages. Scale reduces heat transfer and can clog the narrow tubes in modern radiators. Use distilled water only — it's $1 per gallon at any grocery store.

**Forgetting to turn on the heater.** If you don't run the heater during the flush, the heater core doesn't get flushed — you leave 1-2 quarts of old coolant trapped inside. Turn the heat to max during every flush cycle.

**Not burping the system.** Trapped air pockets cause hot spots, erratic temperature readings, and poor heater output. The "radiator cap off, run until thermostat opens" method works for most cars. Some cars (especially European) have specific bleed procedures — check your manual or forums for your specific model.

**Mixing coolant types.** Orange OAT + green IAT = brown sludge. Don't do it. If you're switching coolant types (which requires a very thorough flush with chemical cleaner), do it completely.

---

## The Bottom Line

Coolant is a wear item, just like brake pads and oil. It degrades chemically over time even if the car sits. A $50 DIY flush every 5 years protects your head gaskets, heater core, water pump, radiator, and every metal surface inside your engine. The alternative — waiting until the coolant is so degraded it causes a failure — costs $500 for a radiator replacement or $2,000+ for a head gasket.

Check your service records. If it's been more than 5 years or 100,000 miles since your last coolant change, add it to your list. The flush is straightforward, the tools are minimal, and the peace of mind is real.

Got questions about your car's specific coolant type or flushing procedure? Post your year, make, and model. I'll tell you exactly what coolant it takes and any model-specific tricks you should know.

*— 老李 (Li), ASE Certified Master Technician, 15 years in dealerships and independent shops*`,
  },
  {
    category_slug: "repair",
    title: "How to Pass Emissions Testing When Your Check Engine Light Is On",
    body: `There are few feelings more stressful than pulling into the emissions testing lane with a check engine light on, hoping for a miracle. The inspector plugs in the OBD2 scanner, the screen flashes for a few seconds, and then — fail. Not because your car is actually polluting, but because the computer says it MIGHT be.

That's the thing most people don't understand about modern emissions testing. Since 1996, the test isn't about what's coming out of your tailpipe (at least not directly). For OBD2 vehicles, the test reads your car's computer and checks whether the self-diagnostic systems are complete and whether any trouble codes are present. If the computer says something's not right — even if it's an intermittent issue that hasn't recurred in months — you fail.

I've helped dozens of people navigate the emissions system over the years. Let me explain how readiness monitors work, why clearing codes at the last minute makes things WORSE, and how to give your car the best chance of passing — including the specific drive cycle that completes the monitors.

---

## How OBD2 Emissions Testing Actually Works

When the inspector plugs into your OBD2 port, they're not measuring tailpipe emissions. They're reading your car's computer for three things:

**1. Check Engine Light (MIL) status.** Key on, engine off: the check engine light must illuminate (proving the bulb works). Engine running: the light must be OFF. If the light is on, you fail. Period.

**2. Diagnostic Trouble Codes (DTCs).** The computer stores codes for any system faults it detects. If there are any active codes, you fail. Even a code for something that sounds unrelated — like an EVAP system leak (P0442) — will fail you. All codes matter.

**3. Readiness Monitors.** This is the one that catches people who clear codes. Your car continuously runs self-tests on its emissions systems — catalyst efficiency, oxygen sensors, EGR, EVAP, fuel system, etc. These tests are called readiness monitors. After you clear codes or disconnect the battery, all monitors reset to "incomplete." The monitors stay incomplete until you drive the car through specific conditions that trigger each test.

Depending on your vehicle's model year, the standard allows:

- **1996-2000 vehicles:** Up to 2 monitors may be "incomplete" and you can still pass.
- **2001 and newer vehicles:** Only 1 monitor may be "incomplete" and you can still pass.
- **The EVAP monitor is the exception.** Many states allow EVAP to be incomplete because it's the hardest monitor to run (requires specific fuel level, ambient temperature, and an extended cold-soak period).

So if you cleared codes in the parking lot 10 minutes before your test, ALL your monitors are incomplete — and you'll fail. Guaranteed.

---

## Checking Your Monitors Before You Go

The best $30 you can spend before an emissions test is a basic OBD2 scanner. Even the cheapest ones (Ancel AD310, $30 on Amazon) can display readiness monitor status. It's an emissions-test insurance policy.

**How to check:**
1. Plug the scanner into your OBD2 port (under the dashboard, driver's side, near the steering column).
2. Turn the key to ON (engine can be off).
3. Navigate to "I/M Readiness" or "Readiness Monitors" on the scanner's menu.
4. The display will show each monitor and its status: Complete (ready) or Incomplete (not ready).

You want to see all monitors "complete" before you go to the test station. If any are incomplete, you need to drive the specific drive cycle to trigger them.

---

## The Universal Drive Cycle (How to Complete Your Monitors)

Every manufacturer has their own specific drive cycle, but there's a universal pattern that works for most OBD2 vehicles. If you need the exact drive cycle for your car, search "[your car] OBD2 drive cycle" — some cars have quirks (Toyotas need to decelerate for 7 seconds without touching the brakes, for example).

Here's the universal drive cycle that triggers most monitors on most cars:

**Preconditions (do these first):**
- Fuel tank between 1/4 and 3/4 full. The EVAP monitor won't run with a full tank (no vapor space) or near-empty tank (risk of fuel starvation during testing). This is one of the most common reasons for an incomplete EVAP monitor — people show up with a full tank.
- Engine cold — the car has been sitting overnight (at least 8 hours). The coolant temperature must be below 100°F for the cold-start monitors to trigger.
- Ambient temperature between 40°F and 95°F. Extreme cold prevents some monitors from running.

**The drive cycle — do this exactly:**

1. **Cold start.** Start the engine from a genuine cold start (overnight soak). Immediately after starting, the idle may be elevated (1,200+ RPM). This is normal — the engine is in open-loop mode, ignoring the oxygen sensors and running on a preset fuel map for warmup.

2. **Idle for 2-3 minutes.** Let the engine warm up at idle. Leave the transmission in Park or Neutral. This allows the oxygen sensor heaters to bring the sensors to operating temperature and the upstream O2 sensor monitor to complete. You'll know the engine is warming up when the idle drops to normal (usually 600-800 RPM) and the coolant temperature gauge starts moving.

3. **Accelerate smoothly to 55 mph.** Use light to moderate throttle — about 1/4 to 1/3 pedal. No wide-open throttle, no aggressive acceleration. You're trying to create steady-state conditions, not race. The car should shift through the gears normally. During this acceleration, the fuel system monitor and oxygen sensor response monitors run.

4. **Steady cruise at 55 mph for 3-5 minutes.** Find a highway or long straight road. Hold a constant speed with minimal throttle changes. Use cruise control if you have it — it's better at holding steady state than a human foot. During this phase, the catalyst monitor runs (comparing upstream and downstream O2 sensor readings), the EGR monitor runs (if equipped), and the fuel system learns its long-term fuel trims.

5. **Decelerate gradually.** Take your foot off the gas and coast — do NOT brake. Let the car slow down naturally to about 20 mph. This closed-throttle deceleration triggers the fuel cut-off monitor and the secondary air injection monitor (if equipped). The engine is in deceleration fuel cut-off mode (DFCO) — the injectors stop firing, and the oxygen sensors verify this.

6. **Repeat if needed.** If some monitors are still incomplete after one cycle, repeat steps 3-5. Some cars require 2-3 drive cycles to complete all monitors, especially the catalyst and EVAP monitors.

7. **For the EVAP monitor specifically:** The EVAP monitor only runs under specific conditions:
   - Fuel level between 1/4 and 3/4 (this is the most common issue — people drive to the test station with a full tank and can't figure out why EVAP is incomplete)
   - Cold start (engine and ambient within 15°F of each other)
   - Steady cruise at 45-65 mph for at least 3-5 minutes
   - The EVAP test often runs AFTER you shut the engine off — it runs a vacuum decay test on the fuel tank. If you check your scanner immediately after the drive cycle and EVAP shows incomplete, check again after the car has been shut off for 15-30 minutes. Sometimes it completes during the post-drive soak.

---

## Common Monitor Failures and What They Mean

**Catalyst Monitor incomplete + P0420 code.** This is the most common emissions failure. P0420 means "Catalyst System Efficiency Below Threshold (Bank 1)." The downstream oxygen sensor detects that the catalytic converter isn't cleaning the exhaust properly.

Possible causes:
- **Bad O2 sensor** — the rear O2 sensor is slow or biased. Replace it first ($50-100). It's the cheaper and easier fix.
- **Exhaust leak** — a leak between the engine and the catalytic converter lets oxygen into the exhaust, which confuses the O2 sensors. Check for soot marks at exhaust joints, listen for a "ticking" sound that speeds up with RPM.
- **Failing catalytic converter** — the catalyst substrate is depleted. Replacement is $300-1,000 depending on the car. Before replacing the cat, rule out the O2 sensor and exhaust leak first — I've seen too many cats replaced for a simple sensor issue.

**EVAP Monitor incomplete.** EVAP is the evaporation emissions system — the system that captures fuel vapors from the tank and routes them to the engine to be burned instead of released into the atmosphere. It's the hardest monitor to complete because it requires very specific conditions.

Common causes of EVAP monitor not completing:
- **Fuel level outside 1/4 to 3/4 range.** Drive the car until the tank is in this range, then do the drive cycle.
- **Ambient temperature too cold or too hot.** The EVAP test requires moderate temperatures. If it's below freezing or above 95°F, some cars won't run the EVAP monitor.
- **Gas cap loose or leaking.** Check that your gas cap clicks when you tighten it. A loose gas cap is the #1 cause of EVAP codes (P0455 - large leak, P0457 - loose gas cap).
- **Purge valve stuck open.** The purge valve (under the hood, on or near the intake manifold) can stick open, preventing the system from holding vacuum. A stuck-open purge valve often causes hard-start after refueling (the engine gets flooded with fuel vapors).

---

## The "Clear Codes in the Parking Lot" Myth

Let me kill this one definitively: clearing your codes in the emissions testing parking lot will NOT help you pass. It will guarantee you FAIL.

Here's what happens: you pull up to the test station with the check engine light on. You panic, grab your OBD2 scanner, and clear the codes. You feel clever for a moment. The check engine light is off! You pull into the testing lane.

Then the inspector tells you: "Your readiness monitors are incomplete." Fail.

Why? Because clearing codes also resets ALL readiness monitors. Every single one shows "incomplete." On a 2001+ vehicle, you're allowed only 1 incomplete monitor — but you have 5-8 incomplete monitors. The computer knows you just cleared the codes. It's not subtle.

And on some cars, clearing codes also resets the ECU's learned fuel trims and idle adaptation. The engine might run rough at idle for the first few minutes after clearing codes. If the inspector notices rough running, they might flag it for a visual inspection fail as well.

Clearing codes is only useful if you've FIXED the underlying problem and you need to turn off the light so the monitors can run from scratch. Clear codes at home, then immediately drive the drive cycle. Then check your monitors. Then go to the test station.

---

## If You Have a Persistent P0420 (Catalyst Efficiency)

If you've replaced the O2 sensors, fixed any exhaust leaks, and still have P0420, these options exist (with varying levels of ethical acceptability):

**Option A: Replace the catalytic converter.** The honest and permanent fix. A quality aftermarket catalytic converter is $200-500 plus installation. A factory cat is $800-1,500. Shop labor adds $100-300. This is the right thing to do.

**Option B: O2 sensor spacer (also called a "spark plug non-fouler").** A mechanical spacer that pulls the downstream O2 sensor out of the direct exhaust stream. This reduces the amount of exhaust the sensor sees and can trick the ECU into thinking the cat is working. Cost: $10-15 at any auto parts store. Effectiveness: about 70% on mild P0420 cases. HOWEVER — in states with a visual inspection component to their emissions test, the inspector may spot the spacer and fail you for tampering. This is also illegal under federal law (tampering with emissions controls), though enforcement varies by location.

**Option C: Tune the rear O2 sensor out of the ECU.** Requires aftermarket tuning software or a mail-order tune. This permanently disables the catalyst monitor in the ECU's programming so it never runs. Cost: $300-500 for a tune. Legal? No — it's emissions tampering, and the tune will fail a readiness check (the catalyst monitor will permanently show "not supported" or "incomplete," which is a fail in many states).

My recommendation: Fix the problem. The catalytic converter cleans your exhaust of hydrocarbons, carbon monoxide, and nitrogen oxides. Driving with a failed cat means you're putting those pollutants directly into the air you and your neighbors breathe. There's a reason emissions controls exist.

---

## Pre-Test Checklist

1. **Check all monitors with a scanner.** All should be complete except possibly EVAP (which is commonly allowed as the one incomplete monitor).
2. **Check for pending codes.** Even if the check engine light is off, your car may have "pending" codes — faults that have been detected but haven't yet illuminated the light (takes 2 drive cycles). A basic scanner shows pending codes separately from stored codes. If you have pending codes, address the issue before testing.
3. **Warm up the car before the test.** Drive for at least 20-30 minutes before arriving. A fully warmed-up engine runs cleaner, and a recently driven drive cycle ensures monitors don't reset due to a long period of sitting.
4. **Don't turn the engine off in line.** Once you've driven the warmup cycle, keep the engine running while waiting in the testing line. Turning it off and restarting resets some monitor "recent completion" flags on some cars.
5. **Check your gas cap.** Tighten it until it clicks at least 3 times. A loose gas cap triggers EVAP codes and is one of the easiest things to fix.

---

## The Bottom Line

Passing emissions with a check engine light on requires fixing the underlying problem first, then completing the drive cycle to set the readiness monitors. You cannot cheat the system by clearing codes at the last minute — the computer is smarter than that, and it's been that way since OBD2 was introduced in 1996.

Spend $30 on a basic scanner so you can check your own monitors before you go. Drive the universal drive cycle. Fix what's broken. Only then will you pass.

And if you're dealing with a persistent P0420? Replace the downstream O2 sensor first (it's cheaper and often the real culprit). Fix exhaust leaks. And if the cat truly is dead, replace it — for your car's performance, your fuel economy, and the air you breathe.

Got a specific emissions problem? Post your year, make, model, the exact code(s) you're seeing, and which monitors are incomplete. I'll help you figure out the fix and the drive cycle for your car.

*— 老李 (Li), ASE Certified Master Technician, 15 years in dealerships and independent shops*`,
  },
  {
    category_slug: "buying-advice",
    title: "Best Tools for a Beginner Home Mechanic: The $200 Starter Kit",
    body: `Everyone starts somewhere. When I was 16, my tool collection was a mismatched set of my dad's castoffs — 12-point sockets, a broken ratchet, and a rusty adjustable wrench that rounded off more bolts than it turned. I still managed to do my first brake job with those tools, but it took twice as long as it should have and I stripped two bleeder screws in the process.

Good tools don't make you a good mechanic. But bad tools will absolutely make you a frustrated one. Rounded bolt heads, broken sockets, stripped adjusters — these are all consequences of the wrong tools, and they turn a 2-hour job into an all-day ordeal.

If you're starting from scratch and want to work on your own car, here's the $200-250 starter kit that will handle 90% of the jobs you'll encounter: oil changes, brake jobs, battery replacements, serpentine belts, alternators, starters, spark plugs, suspension work, and most basic maintenance. I'll also tell you what NOT to buy — because the auto parts store will happily sell you things you don't need.

---

## The Core Kit: Harbor Freight 301-Piece Mechanic's Tool Set ($199, Wait for the Sale)

I know what you're thinking: "Harbor Freight? Really?" Twenty years ago, I would have agreed with the skepticism — Harbor Freight tools were genuinely questionable quality. But their Pittsburgh and Pittsburgh Pro lines have improved dramatically. For a DIYer working on their own car, Harbor Freight sockets and wrenches are perfectly adequate. I use some of them myself for non-critical applications.

That said, the 301-piece set is NOT always $199. The regular price is closer to $259-289. Harbor Freight runs sales on this set several times per year — usually around holidays (Memorial Day, July 4th, Labor Day, Black Friday). You can often stack a 20% off coupon on top of the sale price to get it for $170-180. Sign up for their email list, wait for the coupon, and be patient. It's worth waiting for the sale — the $60-80 savings buys you the torque wrench.

**What's actually in the 301-piece set:**
- 1/4", 3/8", and 1/2" drive ratchets (72-tooth mechanism, reasonable quality)
- SAE and metric sockets in all three drive sizes (shallow and deep, 6-point — this is important; 6-point sockets are FAR less likely to round bolt heads than 12-point)
- Combination wrenches in SAE and metric (8mm-22mm and 1/4"-7/8")
- Hex keys (Allen wrenches)
- Screwdriver bits and driver handle
- A few extensions and a universal joint adapter
- A blow-molded case that keeps everything organized

**Is it everything you'll ever need?** No. The wrench set only goes up to 22mm/7/8" — you'll need a 24mm for axle nuts on some cars, a 32mm or 36mm for axle nuts on most cars. The 3/8" drive sockets only go up to 19mm — you might need 21mm or 22mm for some brake caliper bracket bolts. You'll eventually supplement this set with individual larger sockets. But the 301-piece set gives you the foundation — 95% of the fasteners on your car are covered.

---

## What to Add: The Essential $50-75 in Supplements

**3-Ton Jack Stands — Pittsburgh ($45)**

If you're getting under a car, jack stands are NON-NEGOTIABLE. Never get under a car supported only by a jack. A hydraulic jack holds the car with a rubber O-ring seal inside the cylinder. O-rings fail. It happens. When it does, the car comes down — and if you're under it, the results are catastrophic. Jack stands are mechanical — a ratcheting pawl that physically cannot release under load. They lock into position and stay there.

The Pittsburgh 3-ton stands are overkill for most passenger cars (which weigh 3,000-4,000 lbs divided by 2 stands = 1,500-2,000 lbs per stand, well under 6,000-lb rating). But the 3-ton version has a wider base and higher maximum height than the 2-ton version, which makes them more stable and more useful. If you have a truck or SUV, get the 6-ton version.

Harbor Freight had a recall on certain jack stands in 2020 (the pawl could disengage under certain conditions). The current production has been redesigned and is safe. If you're buying new, you're fine. But check the lot number on used stands.

**1/2" Torque Wrench — Tekton 24335 ($45)**

A torque wrench is the single most important tool you can own that most beginners skip. It's not a luxury — it's essential for safety. Wheel lug nuts must be torqued evenly and to spec. An under-torqued lug nut can back off. An over-torqued lug nut can stretch the stud or warp the brake rotor. Both are dangerous.

The Tekton 24335 is a 1/2" drive click-type torque wrench with a range of 10-150 lb-ft. This covers:
- Lug nuts (typically 80-120 lb-ft depending on car)
- Brake caliper bracket bolts (typically 60-80 lb-ft)
- Oil drain plug (typically 25-30 lb-ft — at the low end of its range, but accurate enough)
- Spark plugs (10-20 lb-ft — use a 3/8" drive adapter, be gentle at the low end)

Critical: always store your torque wrench at its lowest setting (not zero — just at the bottom of its range). Storing it at a high torque value keeps the spring under tension, which causes it to lose calibration over time. A click-type torque wrench should be recalibrated every 1-2 years if used regularly, or every 5 years for occasional use.

Never use a torque wrench to loosen bolts. It's a precision instrument, not a breaker bar.

**Oil Filter Socket Set — Lisle ($25)**

The days of just grabbing your oil filter and twisting it off by hand are over. Most modern cars bury the oil filter behind the exhaust manifold (Honda K-series), under the intake manifold (Subaru), or inside a housing that requires a specific socket (many BMWs, Toyotas, and new GM vehicles with cartridge-style filters).

The Lisle set includes a range of cup-style sockets and an adjustable 3-jaw filter wrench. The cup sockets fit specific-size filter canisters, while the 3-jaw wrench handles odd sizes and stubborn filters. Between these two tools, you can remove 99% of automotive oil filters.

An alternative is the Lisle 63600 Oil Filter Tool for Toyota/Lexus cartridge housings — the plastic housing on many Toyotas requires a specific 64mm socket with 14 flutes. The Lisle tool is $18 and saves you from cracking the plastic housing with a generic strap wrench.

**OBD2 Scanner — Ancel AD310 ($30)**

A code reader that shows trouble codes, pending codes, freeze frame data, and readiness monitor status. The AD310 is basic — it reads powertrain codes only (no airbag, ABS, or transmission codes). But for emissions testing and basic diagnosis, it does everything you need. It's the difference between blindly throwing parts at a check engine light and knowing exactly which sensor or system is at fault.

The AD310 also displays live data: coolant temperature, oxygen sensor voltages, short and long-term fuel trims, RPM, vehicle speed, etc. Understanding live data is a whole separate skill, but even basic code-reading pays for itself on the first avoided misdiagnosis.

**1/2" Breaker Bar, 25" — Pittsburgh ($25)**

A breaker bar is a long, non-ratcheting handle for a socket. It's the "persuasion stick" — when a bolt won't budge with a normal ratchet, the breaker bar gives you 2-3x the leverage. Lug nuts that were overtightened by a shop's impact gun, axle nuts torqued to 200+ lb-ft, caliper bracket bolts that haven't moved in 10 years — the breaker bar breaks them loose without damaging your ratchet (ratchet mechanisms can be damaged by extreme torque).

The 25-inch length is the sweet spot for most automotive work. Shorter (18") is harder to get enough leverage. Longer (36"+), and you struggle to fit it in the wheel well and risk breaking studs. Harbor Freight's Pittsburgh 25" 1/2" breaker bar is $25 and has a lifetime warranty. If you ever manage to break it, they'll hand you a new one.

---

## Safety Gear: The $25 You Can't Skip

**Nitrile Gloves ($10/box at Harbor Freight, 100-count)**

Working on cars is dirty. Oil, grease, brake dust, coolant, transmission fluid — these are not things you want absorbed through your skin. Brake dust contains heavy metals (copper, antimony) and is classified as a possible carcinogen. Used oil contains polycyclic aromatic hydrocarbons (PAHs) which are known carcinogens. Nitrile gloves are a cheap, simple barrier.

Get the 7-mil or thicker gloves. The 3-mil ones tear instantly on sharp brackets. Black nitrile hides the dirt better than blue. Buy a box of 100 and keep it in your garage.

**Safety Glasses ($5 at any hardware store)**

One tiny flake of rust in your eye from a bolt you're wire-brushing underneath the car and you're in the ER for 3 hours getting your eye numbed and scraped. Ask me how I know. Wear safety glasses whenever you're under a car (gravity is not your friend when it comes to debris) or wire-brushing anything. The $5 pair works as well as the $20 pair.

**Wheel Chocks ($10 for a pair at Harbor Freight)**

Before you jack up any corner of the car, chock the opposite end. If you're lifting the front, chock the rear wheels. If you're lifting the rear, chock the front. A wheel chock is a $10 insurance policy against the car rolling off the jack while you're under it. A 2x4 cut at a 45-degree angle works too, but the rubber chocks grip concrete better.

---

## The Complete $200-250 Starter Kit Summary

| Item | Price | Where |
|---|---|---|
| 301-piece mechanic's tool set | $199 (sale) | Harbor Freight |
| 3-ton jack stands | $45 | Harbor Freight |
| Tekton 1/2" torque wrench | $45 | Amazon |
| Lisle oil filter socket set | $25 | Amazon |
| Ancel AD310 OBD2 scanner | $30 | Amazon |
| 25" 1/2" breaker bar | $25 | Harbor Freight |
| Nitrile gloves (100-ct) | $10 | Harbor Freight |
| Safety glasses | $5 | Any hardware store |
| Wheel chocks (pair) | $10 | Harbor Freight |
| **Total** | **~$394** | |

Now, I know that total is closer to $400 than $200. Here's the priority ordering: if your budget is truly $200, buy the 301-piece set ($199 on sale) plus safety glasses ($5) and a box of gloves ($10). That gives you the core hand tools to do 90% of jobs, and you're protected. Add the jack stands ($45) when you need to get under the car for the first time — you cannot do brake or suspension work without them. Add the torque wrench ($45) before your first wheel removal. Add the breaker bar ($25) when you encounter your first stuck bolt. Add the OBD2 scanner ($30) when the check engine light comes on — which it will.

You don't need everything on day one. Build as you go.

---

## What NOT to Buy (Things That Seem Like a Good Deal but Aren't)

**Cheap "Mechanic's Sets" from Walmart with 12-Point Sockets.** Most "200-piece set for $49!" deals at Walmart and discount stores use 12-point sockets. A 12-point socket contacts the bolt head across 12 narrow points instead of 6 broad flats. This concentrates the force on small contact areas, which rounds off bolt heads — especially on rusted or overtightened fasteners that are already partially damaged. Good 6-point sockets cost more to manufacture but are vastly superior for automotive work. If a set says "12-point," walk away.

**Anything from the Dollar Store.** Dollar Store screwdrivers, pliers, and wrenches are made from unhardened steel. The tips deform the first time you use them. A screwdriver tip that cams out of a Phillips head because the metal is too soft to grip will strip the screw head — and now you have a stripped screw to deal with on top of the original problem. Spend at least $5-10 per tool from a known brand.

**Used Power Tools Without a Warranty.** An old impact wrench at a garage sale for $20 seems like a steal until the battery dies after 3 lug nuts and you can't buy a replacement because the model was discontinued 8 years ago. Power tool batteries degrade over time and lose capacity. A used tool with an old battery is a gamble. If you want power tools, buy new from a current product line (Milwaukee M18, DeWalt 20V Max, Ryobi One+) so batteries are available.

**Cheap Torque Wrenches from No-Name Amazon Brands.** A torque wrench that's inaccurate is worse than no torque wrench at all because you THINK you're torquing correctly but you're not. I've tested some of the $20-25 Amazon torque wrenches against a calibrated torque analyzer and found errors of 15-25% — meaning a 100 lb-ft setting might actually deliver 75 or 125 lb-ft. That's the difference between a wheel staying on and a wheel coming off. Tekton, Craftsman, and Pittsburgh Pro torque wrenches are all within 4% accuracy and cost $40-60. Don't cheap out on the calibration.

**Plastic Oil Filter Wrenches.** Those $5 plastic cup wrenches that snap onto a 3/8" ratchet? They crack on the first use if the filter is even slightly over-tightened. Buy the Lisle metal set or at minimum a steel band-style filter wrench. Plastic filter wrenches are emergency-only tools — throw it in your trunk but don't rely on it in the garage.

---

## The Bottom Line

You don't need a $5,000 Snap-On toolbox to work on your car. A $200-250 starter kit built around the Harbor Freight 301-piece set (on sale), supplemented with a torque wrench, jack stands, and a breaker bar, will handle the vast majority of what a DIYer needs to do. Add safety gear — it's $25 you'll never regret spending. And avoid the cheap sets with 12-point sockets, the no-name torque wrenches, and the $5 plastic filter cups.

The best thing about building a tool collection is that it's incremental. Buy the core socket and wrench set first. Add the safety gear immediately. Then add specialized tools one at a time as you need them for specific jobs. Before you know it, you'll have a full garage setup — and you'll have paid for it many times over in labor you didn't pay a shop.

Got a specific car and wondering which tools you need for the first few jobs you're planning? Post your year, make, model, and what work you want to do. I'll tell you exactly which tools you'll need — and which ones you can skip.

*— 老李 (Li), ASE Certified Master Technician, 15 years in dealerships and independent shops*`,
  },
];

async function main() {
  let published = 0;

  for (const a of articles) {
    const { data: cat } = await supabase.from("categories").select("id").eq("slug", a.category_slug).single();
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
      console.log(`[${published}] Created: ${post.id} — ${a.title}`);
    }
  }
  console.log(`\nDone. Published ${published} of ${articles.length} articles.`);
}

main().catch(console.error);
