// Publish 4 more 老李 articles (batch 9) — tire rotation, battery, wheel bearing, brake pads
// Run: npx tsx scripts/lao-li-articles-9.ts
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
    title: "How Often Should You REALLY Rotate Your Tires? (And How to Do It)",
    body: `Let's be honest — tire rotation is the most skipped maintenance item on the entire car. Oil changes? People do those because there's a sticker on the windshield with a date and mileage. Tire rotation? There's no sticker, no warning light, no dramatic consequence if you skip it once. Until you're driving on the highway with cupped tires that sound like you're being chased by a helicopter.

So let's talk about WHY you need to rotate, HOW often, and HOW to actually do it yourself in your driveway with tools you probably already own.

---

## Why Tire Rotation Actually Matters

Your car's four tires don't wear evenly. On a front-wheel-drive car (which is most cars on the road), the front tires do the steering, about 70% of the braking, and 100% of the driving force. The rear tires? They mostly just roll along for the ride. The fronts wear 2-3 times faster than the rears.

If you never rotate, your front tires wear down to the wear bars while your rears still have 50% tread. Now you're buying two front tires before you need rears. Next cycle: the new tires go on the back (because tire shops always mount new tires on the rear — more on that later), the old rears move forward, and they wear down fast. You end up replacing in pairs every 15,000-20,000 miles instead of a full set every 40,000-50,000 miles.

Rotating spreads the wear evenly across all four tires. When all four reach the wear bars at roughly the same time, you can shop for a full set, take advantage of "buy 3 get 1 free" deals, and your car handles consistently because all four tires have similar grip characteristics.

There's also a safety argument: uneven tire wear creates uneven grip. In wet conditions, the tires with less tread hydroplane sooner. In an emergency lane change, one axle breaking loose before the other means oversteer or understeer in a moment when you need neutral handling. Even tires keep even grip.

---

## How Often Should You Rotate?

The industry consensus: every 5,000 to 7,500 miles. This lines up nicely with the old-school "every other oil change" rule (assuming 3,000-3,750 mile oil change intervals). With modern synthetic oil and 5,000-7,500 mile oil change intervals, just rotate every oil change. It's the easiest way to remember — when the oil gets changed, the tires get rotated.

Check your owner's manual. Most manufacturers specify 5,000-7,500 miles. Toyota says 5,000 for most vehicles. Honda says "when the Maintenance Minder tells you" (typically 5,000-7,500). Subaru is more aggressive at every oil change because AWD systems are sensitive to tire circumference differences — a topic worth its own article but the short version is: mismatched tire sizes on AWD can cook your center differential.

If you tow, carry heavy loads, or drive aggressively on winding roads, rotate at 5,000 miles or sooner. The extra load and cornering forces accelerate wear patterns.

If you have staggered wheels (different widths front and rear — common on BMW M cars, Corvettes, some Mercedes AMG models), you can't rotate front-to-rear. Directional staggered setups? You're basically stuck. Accept that you'll replace in pairs and budget accordingly.

---

## The Rotation Patterns

Which pattern you use depends on your tires and your drivetrain.

**Front-to-Rear (Directional Tires)**

Directional tires have a specific rotation direction indicated by an arrow on the sidewall. They're designed to channel water in one direction for optimal wet grip. You CANNOT cross them side-to-side or they'll be running backward. The rotation pattern: front-left goes to rear-left, front-right goes to rear-right (straight front-to-back, same side). This is the simplest pattern but the least effective at evening out wear because each tire stays on the same side of the car.

**Cross-Pattern (Non-Directional Tires)**

This is the classic X-pattern rotation: front-left goes to rear-right, front-right goes to rear-left. The rears move straight forward (rear-left to front-left, rear-right to front-right). This pattern crosses the fronts to the opposite rear positions, which helps even out the wear from road crown (roads are crowned in the center for drainage, so the left side of each tire wears slightly differently than the right). For most FWD cars with non-directional tires, this is the recommended pattern.

**Rearward Cross (RWD/4WD vehicles)**

Reverse of the above: rears cross to the front (rear-left to front-right, rear-right to front-left), fronts move straight back. This is common for RWD trucks and 4WD vehicles because the rear tires are the drive tires and wear faster.

**5-Tire Rotation (Full-Size Spare)**

If your vehicle has a full-size spare tire (same wheel, same tire size — not a donut), and you're diligent, you can do a 5-tire rotation. The spare goes to the right-rear, the right-rear goes to the left-front, the left-front goes to the left-rear, the left-rear goes to the right-front, and the right-front becomes the new spare. This pattern extends tire life by 20% (5 tires instead of 4) and ensures your spare isn't a decade-old, dry-rotted relic when you actually need it. The downside: it's more work, and you need to keep track of which tire is which. Mark them with chalk or tire crayon: LF, RF, LR, RR, SP.

Most people skip the 5-tire rotation because it's a hassle. I get it. But if you bought a full-size matching spare, use it in the rotation. Otherwise, after 6-7 years, that spare has never touched pavement but the rubber compound has hardened. A 7-year-old "new" tire has less grip than a 4-year-old worn tire.

---

## Tools You Need (It's Minimal)

This is one of the few DIY jobs where you probably already have the tools:

1. **Floor jack** — The scissor jack in your trunk technically works, but it's slow, unstable, and slightly dangerous for anything beyond an emergency roadside tire change. A $40-60 hydraulic floor jack from Harbor Freight or any auto parts store makes this a 20-minute job instead of a 45-minute wrestling match.

2. **Jack stands (2)** — NEVER work under a car supported only by a jack. For tire rotation, you don't need to go underneath, but if you're rotating all four tires one at a time with one jack, you need to lower the car onto a jack stand before moving the jack to the next corner. $30-40 for a pair.

3. **Torque wrench** — This is the tool that separates "I did the job right" from "my wheel fell off on the highway." Lug nuts have a specific torque spec. Most passenger cars: 80-100 lb-ft. Trucks and SUVs: 100-140 lb-ft. Small cars (Honda Fit, Mazda Miata): 75-85 lb-ft. Check your owner's manual for the exact number.

4. **Socket set** — You need a deep-well socket that fits your lug nuts. Common sizes: 17mm, 19mm, 21mm, or 3/4" (22mm). A 1/2" drive socket with a breaker bar makes initial loosening much easier.

5. **Wheel chocks** — A block of wood, a brick, or a purpose-made chock ($8 at Harbor Freight). Place behind the wheel opposite the corner you're lifting. Parking brake on, car in Park (or in gear for manual).

---

## The Step-by-Step Process

**1. Loosen lug nuts BEFORE lifting the car.** This is the step everyone forgets the first time. If you lift the car first, the wheel spins freely and you can't break the lug nuts loose. Just crack each lug nut about 1/4 to 1/2 turn — don't remove them yet.

**2. Lift one corner.** Place the floor jack under the designated jack point (check your owner's manual — it's usually a reinforced section of the pinch weld or a specific subframe point). Lift until the tire is about 1-2 inches off the ground.

**3. Remove the wheel.** Finish removing the lug nuts. Pull the wheel straight off the hub. If it's stuck (rust between the wheel and hub), strike the tire sidewall (not the wheel) with a rubber mallet or your foot.

**4. Inspect while it's off.** Look at the tread wear pattern. Even wear across the tread = good. Excessive wear on the inside or outside shoulder = alignment issue. Wear in the center only = overinflation. Wear on both shoulders = underinflation. Cupping or scalloping (uneven high and low spots around the tread) = worn shocks/struts or unbalanced tire.

**5. Install at the new position.** Follow your rotation pattern. Thread the lug nuts by hand (don't use the impact/ratchet yet) to avoid cross-threading. Snug them down in a star pattern — not in a circle. A star pattern (e.g., top, bottom-left, bottom-right, top-left, top-right for a 5-lug) seats the wheel evenly against the hub.

**6. Lower the car and torque.** Lower the car so the tire just touches the ground (not full weight). Torque all lug nuts to spec in the star pattern. Then lower fully and do a final torque check. Drive 25-50 miles, then re-check torque. Seriously. Heat cycling can loosen lug nuts slightly. I've seen wheels walk loose because someone skipped the re-torque.

---

## What About TPMS?

If your car has direct TPMS (sensors inside each wheel that measure actual pressure), the car needs to "relearn" which sensor is at which corner after a rotation. Some cars do this automatically after driving a few miles. Others require a TPMS relearn tool ($15-30) that triggers each sensor in sequence. Some cars (looking at you, older Toyotas) require a dealer scan tool or a specific button-press sequence (ignition on, press TPMS button, wait for blinking light, etc.).

Check your owner's manual for the TPMS relearn procedure for your specific vehicle. If you have indirect TPMS (uses ABS wheel speed sensors to detect pressure differences), no relearn is needed — the system doesn't care which wheel is where.

---

## Tire Shop vs DIY

A tire rotation at a shop typically costs $20-40. It takes them 15-20 minutes. For a lot of people, that's money well spent. You don't get dirty, you don't need tools, and they'll usually do a quick visual inspection of your brakes and suspension while the wheels are off.

DIY costs nothing but your time (20-45 minutes once you've done it a couple times). The advantage: you get to inspect your own brakes, check for leaks, look at suspension bushings, and underSTAND your car. You'll catch problems before they strand you. A shop tech doing a $20 rotation is trying to get the car out of the bay in 15 minutes — they're not going to spend five minutes per corner inspecting your ball joints.

**One last word on where new tires go:** If you're only replacing two tires, the NEW tires always go on the REAR axle. This is counterintuitive — most people want new tires on the front because "that's where the steering is." But in wet conditions, worn rear tires lose grip first. When the rear loses grip before the front, the car oversteers (spins). Oversteer is much harder for the average driver to catch than understeer. Every tire manufacturer and the NHTSA recommend new tires on the rear, regardless of which wheels drive the car.

Rotate regularly, buy all four at once, and your tires will wear evenly enough that you're never making this two-at-a-time decision in the first place.

Got a specific vehicle and not sure which rotation pattern to use? Check your owner's manual. Still not sure? Drop your year, make, model, and whether the tires are directional or not. I'll tell you the right pattern.

*— 老李 (Li), ASE Certified Master Technician, 15 years in dealerships and independent shops*`,
  },
  {
    category_slug: "diy-guides",
    title: "How to Test and Replace a Car Battery (With the Right Tools)",
    body: `Your battery is the most predictable failure point on your car. Unlike a transmission that might give you months of warning signs, or an alternator that fails intermittently, a battery typically gives you clear signs before it dies completely: slow cranking, dim headlights at idle, a "check charging system" warning, or needing a jump start on a cold morning.

The good news: testing a battery takes 30 seconds with a $10 tool, and replacing one is a 15-minute job that requires exactly one wrench. The bad news: a lot of people wait until they're stranded in a parking lot at 10pm, then pay a premium for whatever battery the tow truck carries.

Let's walk through testing, understanding what battery you need, and doing the replacement yourself.

---

## Testing Your Battery (The Right Way)

**Voltage Test with a Multimeter**

Set your multimeter to DC voltage (the V with a straight line, not the wavy one — that's AC). Touch red probe to the positive terminal (+), black probe to the negative terminal (-).

- **12.6V or higher:** Battery is fully charged. Health unknown (a fully charged battery can still have low cranking amps).
- **12.4V:** About 75% charge. Still functional.
- **12.2V:** About 50% charge. Needs charging. Might be a weak battery or a charging system problem.
- **12.0V or below:** Battery is discharged or failing. Charge it and retest.
- **Below 11.8V:** Battery is severely discharged or has a dead cell. A battery with a dead cell will show about 10.5V (each of the 6 cells produces ~2.1V; one dead cell drops you to ~10.5V).

Important: test voltage with the engine OFF and all accessories OFF. Surface charge can give you a false high reading — turn the headlights on for 30 seconds, then turn them off and wait a minute before testing.

**Voltage Test Under Load (Cranking Test)**

Set your multimeter to min/max mode if it has it. Connect to the battery terminals. Have someone crank the engine while you watch the meter. The voltage should stay above 9.6V during cranking. Below 9.6V while cranking = weak battery or high resistance in the starter circuit. Below 8V = battery is done.

**Free Load Test at Auto Parts Store**

Every major auto parts chain (AutoZone, Advance, O'Reilly, NAPA) will test your battery for free with a carbon-pile or conductance tester. This is better than a multimeter voltage test because it actually measures cranking amps under load. The tester puts a calibrated load on the battery for 15 seconds and measures voltage drop — much more accurate than a simple voltage reading. They'll give you a printout with the measured CCA (cold cranking amps) vs the rated CCA.

If the measured CCA is below 70% of rated CCA, the battery is considered failed. A 600 CCA battery measuring 350 CCA will still start your car on a warm day, but the first 20-degree morning will leave you stranded.

**Alternator Quick Check**

With the engine running and accessories off, measure voltage at the battery terminals. You should see 13.8-14.7V. This is the alternator's charging voltage. Below 13.5V = alternator might not be charging adequately. Above 15V = voltage regulator is overcharging, which will boil the battery dry. Turn on headlights, blower fan on high, rear defroster — voltage should stay above 13.2V under load.

If your battery keeps dying, the battery might be fine and your alternator might be weak. Don't throw a $200 battery at a $400 alternator problem. Test both.

---

## Understanding Battery Group Sizes

This is where people get lost at the parts store. The "group size" is the physical dimensions and terminal layout of the battery. The wrong group size won't fit in the tray, or the terminals will be in the wrong position, or the hold-down clamp won't work.

**Common Group Sizes:**

- **Group 24F:** Honda, Toyota, and many Asian imports. Top-post terminals, typically 500-650 CCA. The "F" means the positive terminal is on the right (from the perspective of looking at the battery from the front of the car, terminals toward you). A regular Group 24 has reversed polarity — if you force it in, the cables won't reach and you might short things.

- **Group 35:** Nissan, Subaru, some Mitsubishi. Slightly narrower than 24F. Top-post, typically 500-600 CCA. Common on the Nissan Altima, Sentra, and Subaru Outback/Forester.

- **Group 48 / H6:** European cars — BMW, Mercedes, Audi, VW. These are "Euro" form factor: longer and lower profile than Asian batteries. Typically 600-760 CCA. Often AGM (absorbed glass mat) in newer European cars because the battery is mounted in the trunk or under the rear seat, where venting a flooded battery would be dangerous.

- **Group 65:** Ford trucks and SUVs (F-150, Expedition). Big rectangular battery, top-post, 650-850 CCA. Ford vehicles use Group 65 almost exclusively.

- **Group 34/78:** GM vehicles, especially trucks and SUVs. Dual terminal (both top-post and side-post on the same battery). GM has used side-post terminals on many vehicles since the 1970s.

**Top-Post vs Side-Post Terminals:**

Top-post: the classic lead cone you clamp a cable onto. Easy to access, easy to jump-start. Used by Asian and European manufacturers.

Side-post: a threaded hole on the side of the battery that the cable bolts into. Harder to access for jump-starting (you need a special adapter or a lot of patience), but the connection is protected from corrosion and the battery fits in tighter spaces. GM's thing.

If your car has side-post terminals from the factory, you MUST use a side-post battery. The cables are too short to reach top-post terminals, and vice versa.

---

## What's the Deal with AGM vs Flooded?

**Flooded (Traditional Lead-Acid):** The liquid electrolyte sloshes around inside. Vented (produces hydrogen gas when charging, so it MUST be in a ventilated area — never install one inside the passenger cabin). Cheapest option ($100-180). 3-5 year lifespan. Fine for most cars.

**AGM (Absorbed Glass Mat):** The electrolyte is absorbed into fiberglass mats between the lead plates. Spill-proof, can be mounted at any angle (even on its side), no venting required, handles deep cycling better. More expensive ($180-300). Longer lifespan (4-7 years). Required for cars with auto start-stop systems because the battery needs to handle frequent engine restarts without voltage sag.

**EFB (Enhanced Flooded Battery):** A middle ground. Basically a flooded battery with reinforced plates and a bit more acid reserve. Used on some entry-level start-stop vehicles. $130-200.

**The rule:** Replace with what the car came with. If your BMW came with an AGM, replace it with an AGM. The charging system is programmed for AGM charge curves, and putting a flooded battery in an AGM-programmed car will overcharge and boil it. If your 2005 Camry came with a flooded battery, an AGM is an upgrade that will last longer — but it's not required.

---

## Replacing the Battery (Step by Step)

**Tools you need:**
- 10mm wrench or socket (most battery terminals)
- Wire brush or battery terminal cleaner ($5 at any parts store)
- Baking soda + water (corrosion cleaner)
- Memory saver tool ($10-15, optional but recommended)
- Safety glasses (battery acid is no joke)
- Nitrile gloves

**Step 1: Memory Saver (Optional)**

A memory saver is a small 9V battery-powered device that plugs into your OBD-II port (under the dash, driver's side). It supplies just enough power to keep your radio presets, clock, seat memory, idle relearn, and window auto-up/down calibration alive while the main battery is disconnected. Without it, you'll have to reprogram all those things. For some cars (late-model BMWs, some Nissans), a dead battery or battery disconnect can put the throttle body into limp mode requiring a dealer reset. A $10 memory saver prevents all of this.

**Step 2: REMOVE NEGATIVE FIRST**

This is THE most important safety rule of battery work. Remove the NEGATIVE (black, -) terminal FIRST. Here's why:

If you're loosening the positive terminal first and your wrench touches any metal part of the car (fender, bracket, engine), you've created a direct short from positive to ground through your wrench. The wrench instantly becomes a heating element — it will glow red, weld itself to whatever it's touching, and possibly explode the battery from the hydrogen gas around the vent caps. I've seen it happen. A mechanic at the shop next to mine welded a Snap-On wrench to a strut tower and the battery exploded. He was lucky he was wearing safety glasses.

By removing negative first, you break the ground path. Once negative is disconnected, the car is no longer grounded. If your wrench touches metal while loosening the positive terminal now, nothing happens because there's no complete circuit.

**Step 3: Remove the Positive Terminal**

After negative is off and tucked safely away from the battery (wrap it in a rag), remove the positive (red, +) terminal. Same caution applies, but now the risk is minimal because no ground path exists.

**Step 4: Remove the Hold-Down**

Most batteries have a clamp, strap, or bracket at the base. It's usually a 10mm or 13mm bolt. Some imports (Honda, Toyota) use J-bolts with nuts at the top. Remove the hold-down, then lift the battery straight out. A Group 65 truck battery weighs 45-50 lbs — lift with your legs.

**Step 5: Clean Everything**

Before installing the new battery, clean the terminal connectors. Green/white crusty corrosion on the terminals? Mix a tablespoon of baking soda with a cup of water (about a 1:10 ratio). Dip a wire brush in the solution and scrub the terminals and cable connectors until they're shiny. The baking soda neutralizes the battery acid. Rinse with clean water and dry thoroughly.

Corrosion on terminals increases resistance. Resistance = voltage drop. Voltage drop = slower cranking, harder starts, more strain on the alternator. Clean terminals are essential.

**Step 6: Install the New Battery**

Drop the new battery into the tray. Secure the hold-down — a loose battery will bounce around, crack the case, and leak acid onto everything below it. The battery tray is directly above the subframe or transmission on many cars; acid dripping there is a multi-thousand-dollar repair.

**Step 7: INSTALL POSITIVE FIRST, THEN NEGATIVE**

The reverse of removal. Connect and tighten the positive (+) terminal first. Connect the negative (-) terminal last. Same reason as before: if you connect negative first and the positive cable touches metal while you're attaching it, the circuit completes through the car body. By connecting positive first and negative last, you avoid accidental shorts during installation.

**Step 8: Start and Test**

Start the car. It should crank faster than before. Measure voltage at the battery terminals with the engine running: 13.8-14.7V confirms the alternator is charging. Turn on all accessories — voltage should stay above 13.2V.

---

## Battery Registration (European Cars)

If you're replacing the battery on a late-model BMW, Audi, Mercedes, or Mini, there's one more step: battery registration. These cars have intelligent battery sensors (IBS) that track battery state of charge and adjust alternator output accordingly. When you install a new battery, you need to tell the car's computer: "Hey, there's a new battery here. Reset your charging algorithm."

For BMW/Mini: requires a scan tool with BMW-specific software (ISTA, Carly, BimmerLink, or a high-end universal scanner like Autel/Snap-on). The registration process resets the battery capacity and type (AGM vs flooded) and tells the alternator to stop overcharging (which it was doing to compensate for the old, weak battery).

Skipping registration doesn't cause immediate failure, but the alternator will continue charging at the old battery's rate, which overcharges the new battery and shortens its life. A new AGM battery that should last 6 years might die in 2-3 if it's constantly overcharged because the car thinks it's still the old failing battery.

---

## Costs

- Battery: $120-250 (flooded), $180-350 (AGM)
- Wire brush / terminal cleaner: $5
- Memory saver tool: $10-15
- DIY labor: free (15-30 minutes)
- Shop labor for install: $20-40 (parts store install is often free with battery purchase)
- Dealer battery replacement (European with registration): $300-600

The parts store will often install the battery for free if you buy from them. It takes them 5 minutes. There's no shame in this — but at least you now know how to do it if you ever need to in a parking lot.

If your battery is more than 3 years old, test it today. The multimeter test takes 30 seconds and costs nothing. Finding out your battery is weak on a Tuesday afternoon in your driveway is infinitely better than finding out on a Monday morning when you're already late for work.

*— 老李 (Li), ASE Certified Master Technician, 15 years in dealerships and independent shops*`,
  },
  {
    category_slug: "repair",
    title: "Wheel Bearing Noise: How to Diagnose a Bad Bearing vs Tire Noise",
    body: `There's a noise coming from your car. It's a low hum, or maybe a growl. It starts quiet at low speeds and gets louder as you go faster. It's not the engine — the pitch doesn't change when you shift gears or rev in neutral. It's speed-dependent: the faster the wheels turn, the louder and higher-pitched it gets.

You might be driving on a bad wheel bearing. Or it might just be tire noise. Getting this diagnosis right matters because a wheel bearing failure at highway speed can lock that wheel up, and the repair costs anywhere from $150 to $500 per wheel depending on the design. Let's figure out which it is before you spend money on the wrong fix.

---

## What Is a Wheel Bearing and What Does It Do?

Every wheel on your car spins on a bearing — a set of precision-ground steel balls or rollers encased in hardened races, packed with high-temperature grease, sealed against water and dirt. The bearing allows the wheel hub to spin freely with minimal friction while supporting the entire weight of that corner of the car plus the lateral loads from cornering.

A healthy wheel bearing is essentially silent. You might hear a faint whir at high speeds, but it doesn't call attention to itself. A failing bearing makes noise because one or more of the balls/rollers has developed a pit, a flat spot, or rust — instead of rolling smoothly, that damaged element is now skidding, hammering, or vibrating in its race.

The classic description: a humming, growling, or rumbling noise that increases in pitch and volume with vehicle speed. Not engine speed — vehicle speed. If the noise stays the same whether you're in 3rd gear or 5th gear at the same road speed, it's downstream of the transmission: wheel bearing, CV joint, tire, or differential.

---

## The Definitive Diagnostic Test: The Swerve Test

This is the single most reliable test for isolating a bad wheel bearing from other noises. Here's how to do it:

Find an empty road (industrial park on a Sunday, empty highway, long straight country road). Get to 40-50 mph — fast enough that the noise is clearly audible, not so fast that you're in danger.

**Swerve gently to the left**, then straighten, then **swerve gently to the right**. You're not doing an emergency lane change — you're making a smooth, gradual swerve that loads and unloads each side of the car. Think of it as a gentle slalom.

What happens: when you turn left, the car's weight transfers to the RIGHT side. The right-side suspension compresses, and the right-side wheel bearings take more load. If the noise gets LOUDER when you swerve left (loading the right side), the bad bearing is on the RIGHT side. If it gets louder when you swerve right (loading the left side), the bad bearing is on the LEFT.

Why this works: a damaged bearing produces more noise under load. When you transfer weight onto the bearing, you're pressing the damaged ball or roller harder into the pitted race, amplifying the noise. When you unload that side, the noise quiets down.

If the noise volume doesn't change during swerving, it's more likely tire noise — tire noise is constant regardless of side loading because the tire contact patch isn't changing dramatically during gentle swerves (unlike aggressive cornering).

---

## Bearing Noise vs Tire Noise: How to Tell Them Apart

This is the most common diagnostic challenge because new and inexperienced mechanics get it wrong all the time. A dealership tried to sell my neighbor four new wheel bearings ($2,800) when his actual problem was a set of cupped all-terrain tires.

**Tire Noise Characteristics:**
- More of a roar, drone, or "mud tire hum"
- Constant — doesn't change significantly with steering input during gentle swerves
- Changes when you drive on different road surfaces (smooth asphalt vs grooved concrete vs chip-seal — the noise will vary dramatically as the surface changes)
- Often has a rhythmic pattern that matches tire rotation speed
- More pronounced at specific speed ranges (some tires "sing" loudest at 55-65 mph then quiet down above 70)

**Wheel Bearing Noise Characteristics:**
- Hum, growl, rumble — not a roar
- Changes significantly with steering input (side loading)
- Does NOT change with road surface changes — a bearing hums the same on smooth asphalt and grooved concrete
- Steadily increases in pitch and volume with speed
- Sometimes accompanied by a cyclical "wub-wub-wub-wub" at low speeds that smooths into a steady hum above 30 mph

The road surface test is the fastest differentiator: drive on a freshly paved asphalt section, then a grooved concrete highway section. Tire noise changes dramatically. Bearing noise is the same on both surfaces.

---

## Bearing vs CV Joint: Another Common Misdiagnosis

CV (constant velocity) joints and wheel bearings are in roughly the same area of the car, and both make rotational noise. But they sound completely different.

**CV Joint Noise:**
- Clicking or popping when turning at LOW speeds — parking lot maneuvers, U-turns
- The classic "click-click-click-click" when you turn the steering wheel to full lock and accelerate gently
- No noise at all when driving straight at highway speeds (or minimal)
- Outer CV joint: clicks when turning
- Inner CV joint: vibration under acceleration (less common failure)

**Wheel Bearing Noise:**
- Hum/growl at HIGHWAY speeds — 40+ mph
- No clicking or popping at low speeds
- Steering input changes volume, not character

**The simple rule:** if it clicks at parking lot speeds, it's CV. If it hums on the highway, it's bearing. If it does both at once, you have both problems (unlikely but possible on high-mileage cars).

---

## Which Bearing Is Bad? Front vs Rear

The swerve test tells you left vs right. But what about front vs rear? Sometimes the noise location isn't obvious from the driver's seat.

**Test 1: The Passenger Test**
Have someone ride in different seats and report where the noise is loudest. A passenger in the rear seat can often localize a rear bearing that the driver can't distinguish from front noise.

**Test 2: The Jack-and-Spin Test**
Jack up one corner at a time so the wheel is off the ground. Secure with a jack stand. Spin the wheel by hand as fast as you can. Put your hand on the strut or control arm and feel for vibration while the wheel spins. A bad bearing transmits roughness through the suspension that you can feel. Also listen — a grinding or rumbling sound while hand-spinning is a bad sign.

**Test 3: The Rock Test**
With the wheel off the ground, grab the tire at 12 o'clock and 6 o'clock. Try to rock it in and out (push top, pull bottom). Any play/movement is a sign of a failing wheel bearing (or loose lug nuts, but you'd know that already). A tiny amount of movement might be normal for some vehicles — compare both sides. If the left front has noticeable play and the right front has zero, the left is bad.

Also do 3-and-9 o'clock (hands at the sides of the tire). Play here can be wheel bearing OR tie rod ends/steering rack. 12-and-6 play is more bearing-specific (though it COULD be ball joints — wiggle while watching the ball joint boot for movement).

---

## Press-In Bearing vs Bolt-On Hub Assembly

This distinction determines whether you can DIY this job or need to pay a shop.

**Press-In Bearing (Older Design)**
The bearing is a separate part pressed into the steering knuckle or trailing arm. Replacing it requires:
- Removing the knuckle from the car
- Using a hydraulic shop press to push the old bearing out and the new bearing in
- Special bearing driver tools to avoid pressing on the wrong surface (pressing on the inner race rather than the outer race will destroy the new bearing instantly)

This is typically NOT a DIY job unless you have a press or you're removing the knuckle and taking it to a shop for pressing. Many auto parts stores will press a bearing for $20-40 if you bring them the cleaned knuckle with the old bearing still in it. Total cost: bearing $40-80, press labor $40-80, total $80-160 per side plus your labor to remove and reinstall the knuckle.

Vehicles with press-in bearings: many older Hondas (rear), Toyotas (front on older models), Subarus (rear), and most cars pre-2005.

**Bolt-On Hub Assembly (Modern Design)**
The bearing is integrated into the hub assembly as a single unit. Replacing it is a bolt-on job: remove the axle nut, unbolt the old hub (3-4 bolts from behind), bolt the new hub on, torque the axle nut. No press needed. This is a DIY-friendly job if you have basic tools and a big breaker bar (axle nuts are typically torqued to 180-250 lb-ft).

Parts cost: $60-200 for the hub assembly. Labor: DIY free, shop 1-2 hours ($100-200). Total shop cost $200-500 per wheel.

Vehicles with bolt-on hubs: most cars post-2010, many trucks and SUVs, and increasingly common across all manufacturers because it's cheaper to manufacture and replace.

---

## What Happens If You Don't Fix It?

A wheel bearing doesn't fail silently. It gets progressively louder over weeks or months, then eventually starts grinding metal-on-metal. The symptoms escalate:

**Stage 1:** Faint hum at highway speeds, only audible with radio off.
**Stage 2:** Louder hum/growl, audible over radio at moderate volume.
**Stage 3:** Grinding noise at all speeds, vibration through the steering wheel, possible ABS light (the bearing's magnetic tone ring gets damaged by metal debris).
**Stage 4:** Severe grinding, wheel play in all directions, the bearing is disintegrating. At this stage, the wheel can wobble enough to cause brake pad knockback (soft brake pedal on the first press after a turn), damaged brake rotors from misalignment, and eventually — wheel lockup or separation.

A wheel bearing failure at highway speed is catastrophic. The wheel can seize, come off, or cause a sudden loss of control. I've seen a failed front bearing cause the CV axle to snap because the bearing's disintegration let the hub wobble enough to fatigue the axle.

The cost of replacing a bearing at Stage 1 or 2: $150-500. The cost of replacing everything damaged by a Stage 4 failure (bearing, hub, brake rotor, possibly CV axle, possibly steering knuckle): $800-2,000. Don't wait.

---

## Total Cost Summary

| Item | Cost Range |
|---|---|
| Bearing/hub assembly (part) | $40-200 |
| Shop press labor (press-in only) | $40-80 |
| Shop labor (1-2 hours) | $100-200 |
| Total per wheel (bolt-on hub, shop) | $200-500 |
| Total per wheel (press-in, shop) | $150-400 |
| Total per wheel (DIY bolt-on) | $60-200 |
| Alignment after replacement | $80-120 (recommended) |

Replacing a wheel bearing usually doesn't affect alignment directly, but if you had to remove suspension components to access the bearing, you might have disturbed the alignment. Budget for an alignment afterward if you removed any control arm bolts, tie rod ends, or strut bolts.

---

## Quick Diagnostic Checklist

Print or screenshot this. When you hear a rotational noise:

1. Does it change with engine RPM or vehicle speed? → If RPM, it's engine/transmission. If speed, continue.

2. At 40-50 mph, does swerving left/right change the noise? → If yes, it's a wheel bearing (louder when loaded). If no, continue.

3. Does the noise change on different road surfaces? → If yes, tire noise. If no, continue.

4. Do you hear clicking at LOW speed when turning sharply? → If yes, CV joint.

5. Jack up each wheel, spin by hand, feel for roughness. Rock at 12-and-6 and 3-and-9. Any play or grinding? → Wheel bearing.

Got a noise you can't identify? Post your year, make, model, when the noise happens, and what you've tried. Describe it as specifically as you can — "it sounds like a bad wheel bearing" isn't helpful, but "60 mph hum that gets louder when I turn right, stops when I turn left" is a diagnosis I can give you from a text description.

*— 老李 (Li), ASE Certified Master Technician, 15 years in dealerships and independent shops*`,
  },
  {
    category_slug: "buying-advice",
    title: "Ceramic Brake Pads vs Semi-Metallic vs Organic: Which Should You Buy?",
    body: `Walk into any auto parts store and stare at the brake pad aisle for 30 seconds. You'll see three or four different product lines from the same manufacturer, at three or four different price points, all claiming to fit the same car. The boxes say things like "Professional Grade," "Severe Duty," "Ceramic Formula," "Gold," "MAX," "Performance." None of these words mean anything standardized — they're marketing terms.

What actually matters is the friction material. That's the compound of fibers, metals, fillers, and binders pressed onto the steel backing plate. And brake pad friction materials fall into three real categories: organic (NAO), semi-metallic, and ceramic. Each has real trade-offs. Let's understand them so you can buy the right pads for how YOU drive, not for what the marketing department named them.

---

## The Three Real Pad Types

### Organic / NAO (Non-Asbestos Organic)

**What it is:** A blend of fibers (glass, rubber, Kevlar, carbon), fillers, and high-temperature resins. No steel fibers. Sometimes includes small amounts of non-ferrous metals like copper or brass as heat conductors, but the distinguishing feature is the absence of significant metallic content.

**What it feels like:** Soft pedal feel, very quiet, very low dust. The brake pedal has a smooth, linear feel but goes slightly deeper than with other pad types. Not grabby — predictable and easy to modulate in traffic.

**The trade-offs:** Organic pads wear faster because the friction material is softer. Under hard or repeated braking, they fade sooner than metallic or ceramic pads. They don't bite as hard when cold (first stop of the day is noticeably longer than the third stop). The friction material wears away faster, so you'll replace them more often — typically 30,000-40,000 miles vs 50,000-70,000 for ceramic.

**Where they're used:** OEM on economy cars (Toyota Corolla, Honda Civic base models, Nissan Versa, Hyundai Elantra). These cars have braking systems designed around organic pads — the caliper piston sizes, master cylinder bore, and brake booster are matched to organic friction characteristics. Putting aggressive semi-metallic pads on a car designed for organics will make the pedal feel overly sensitive and the ABS will engage differently.

**Who should buy them:** If you drive gently, mostly in town, and your #1 priority is quiet, dust-free braking with a soft pedal feel — organic is fine. You're the driver the OEM had in mind. Just accept that you'll replace pads more often.

---

### Semi-Metallic (Semi-Met)

**What it is:** 30% to 65% metal by weight — steel fibers, iron powder, copper, graphite. The metal provides heat conductivity (draws heat away from the rotor surface into the pad and caliper), high-temperature friction stability, and wear resistance. The remaining material is fillers, friction modifiers, and binders.

**What it feels like:** Firm pedal, strong initial bite, consistent feel across the temperature range. The pedal is shorter and harder compared to organic. You feel like you have more immediate stopping power, and you do — but that grip comes with noise and dust.

**The trade-offs:** Semi-metallic pads are NOISY. Not squealing-bad-pads noisy, but a low-frequency groan or grind under light braking that most drivers find annoying. They produce a LOT of brake dust — your front wheels will be gray within a week of washing. The dust is metallic and will embed in wheel clear coat if not washed off regularly, causing permanent staining on clear-coated or painted wheels. The metal content also makes them harder on rotors — you'll replace rotors more frequently because the metallic friction material is more abrasive.

The advantage is heat range. Semi-metallic pads maintain friction at much higher temperatures than organic or ceramic. Where an organic pad might fade at 500-600 degrees Fahrenheit, a quality semi-metallic pad holds its friction coefficient to 800-900 degrees. For repeated hard stops, mountain driving, towing, or track use, semi-metallic is the only choice that won't fade.

**Where they're used:** OEM on trucks (Ford F-150, Ram 1500, Silverado), SUVs, performance cars, and any vehicle rated for towing. European cars (BMW, Mercedes, Audi) typically use a low-metallic formulation (less metal than American semi-met, but more than ceramic) as their OEM pad — the characteristic German-car brake dust on the front wheels is low-metallic pad dust.

**Who should buy them:** If you tow anything, live in the mountains, drive aggressively, or track your street car — semi-metallic is your pad. Accept the dust and noise as the price of brakes that won't quit when they're hot.

---

### Ceramic

**What it is:** Ceramic fibers (silicon carbide, potassium titanate), nonferrous metal fibers (copper — though being phased out for environmental reasons), and fillers bonded with resin. Despite the name, they're not 100% ceramic — typically 15-30% ceramic fibers in a composite matrix.

**What it feels like:** Firm pedal, but less initial "bite" than semi-metallic. Once they warm up (which takes one or two stops), the friction is consistent and predictable. Very linear feel — brake torque increases proportionally to pedal pressure without surprises.

**The trade-offs:** The ADVANTAGES: very low dust (the dust that is produced is light-colored and doesn't stick to wheels the way metallic dust does), very quiet (ceramic fibers dampen vibration better than steel fibers), long pad life (50,000-70,000 miles is typical), gentle on rotors (rotor life is extended because the friction material is less abrasive).

The DISADVANTAGES: higher cost ($10-20 more per axle than semi-metallic), less heat tolerance than semi-metallic (they start fading earlier under extreme use), less cold bite than organic (first stop on a freezing morning is longer). They're NOT a performance pad — if you drive hard enough to regularly smell your brakes, get semi-metallic.

**Where they're used:** OEM on many modern cars from mid-range and up — Honda Accord, Toyota Camry (higher trims), most Lexus models, Acura, Infiniti, and as an upgrade option on many domestic vehicles. The industry has been shifting toward ceramic as the default OEM pad because they satisfy customer complaints (noise, dust) while meeting modern friction standards.

**Who should buy them:** This is the pad for 80% of drivers. If you commute, run errands, take road trips, and occasionally have fun on an onramp — get ceramic. You'll get long life, clean wheels, quiet stops, and adequate performance for any non-track driving. The $20 premium over semi-metallic pays for itself in not having to clean your wheels every weekend.

---

## Real-World Comparison

| Characteristic | Organic (NAO) | Semi-Metallic | Ceramic |
|---|---|---|---|
| Price per axle | $25-50 | $30-60 | $40-80 |
| Dust level | Low | High | Very low |
| Noise | Very quiet | Moderate (groan/grind) | Very quiet |
| Rotor wear | Moderate | High (abrasive) | Low |
| Cold bite | Good (soft) | Excellent (firm) | Adequate (needs warm-up) |
| Heat resistance | Low (fades ~500F) | High (stable to ~900F) | Moderate (fades ~650F) |
| Pad life | 30k-40k miles | 40k-60k miles | 50k-70k miles |
| Pedal feel | Soft, deep | Firm, short | Firm, linear |

---

## Recommendations by Use Case

**Daily commuter, mostly city/highway, normal driving:**
Ceramic. The Akebono ProACT, Wagner ThermoQuiet, or Bosch QuietCast lines are all solid choices. You'll get clean wheels, silent stops, and 50,000+ miles from a set. The slightly higher upfront cost is offset by longer pad and rotor life.

**Truck, SUV, or any vehicle that tows:**
Semi-metallic. When you're coming down a 6% grade with 5,000 lbs behind you, you need a pad that won't fade. Wagner SevereDuty, Raybestos Element3, or Power Stop Z36 (their truck/tow line) are all good. Accept the dust. Wash your wheels regularly.

**Track days, autocross, aggressive mountain driving:**
Semi-metallic or dedicated track pads. Hawk HP Plus, EBC Yellowstuff, or Carbotech XP series. These are track-oriented street pads that work from cold but handle repeated high-heat stops. Be aware: track pads are VERY dusty and often squeal on the street. If you're doing actual track days, consider a dedicated set of track pads and rotors that you swap at the track.

**Economy car, light use, budget-sensitive:**
Organic / NAO. If your car came with organic pads and you're happy with how it stops, stick with them. Wagner's economy line, ACDelco Professional (for GM), or the house brand at your local parts store. You'll replace them more often, but they're the cheapest option per set.

**Luxury car, quietness and refinement are everything:**
Ceramic. If you drive a Lexus LS, Mercedes S-Class, or any car where you paid extra for a quiet cabin, don't ruin it with semi-metallic groan. The OEM pads on these cars are usually ceramic or a ceramic-like composite. Stick with OEM or high-end ceramic (Akebono, ATE, Textar).

---

## Critical Rules You Must Follow

**NEVER mix pad types on the same axle.** Left-front ceramic and right-front semi-metallic = different friction coefficients left and right = the car pulls to one side under braking. At the very least, both pads on the same axle must be the same type. Ideally, all four corners are the same type, but front/rear mismatch is acceptable if the friction ratings are similar (for example, ceramic front and semi-metallic rear on a truck is fine because the rear does less braking work).

**Always replace or resurface rotors with new pads.** The old pads have worn a specific wear pattern into the rotor surface. New pads need a flat, fresh surface to bed into properly. You can have rotors resurfaced at a parts store ($10-15 per rotor) if they're above minimum thickness, but new rotors are often only $30-60 each — for the price, just install new rotors and enjoy perfect bedding.

**Bed in your pads properly.** After installation, do a series of moderate stops from 30-40 mph to progressively heat the pads and transfer an even layer of friction material onto the rotor surface. Avoid hard stops or coming to a complete stop with hot pads during the first 200 miles. Proper bedding doubles pad and rotor life.

---

## Costs at a Glance

| Service | DIY Cost | Shop Cost |
|---|---|---|
| Front pads only | $30-80 | $150-300 |
| Rear pads only | $30-80 | $150-300 |
| Front pads + rotors | $60-180 | $300-600 |
| Rear pads + rotors | $60-180 | $300-600 |
| All four corners (pads + rotors) | $120-360 | $600-1,200 |

The shop markup is mostly labor — brake jobs are 1-2 hours per axle at shop rates of $100-150/hour. If you're mechanically inclined, brake pad replacement is one of the best places to start DIY work. It requires basic hand tools, no special equipment, and the parts cost a fraction of the shop quote.

The one thing you must get right: torque the caliper bracket bolts to spec. These bolts hold your brakes on. Under-torque them and they'll back out (loss of braking). Over-torque them and they'll stretch or snap (also loss of braking, plus a nightmare extraction). Every bolt on a brake system has a torque spec. Use a torque wrench.

---

Still not sure which pads are right for your car? Tell me your year, make, model, how you drive, and what your priorities are (quiet? long life? heavy towing? budget?). I'll tell you exactly which pad compound and which specific product line to buy.

*— 老李 (Li), ASE Certified Master Technician, 15 years in dealerships and independent shops*`,
  },
];

async function main() {
  console.log("Publishing 老李 articles batch 9...\n");

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
