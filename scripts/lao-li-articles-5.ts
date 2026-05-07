// Publish 5 more 老李 articles (batch 5)
// Run: npx tsx scripts/lao-li-articles-5.ts
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
    title: "How to Diagnose a No-Start Condition: From Battery to Starter to Fuel",
    body: `I've diagnosed more no-start conditions than I can count. When a customer calls the shop and says "my car won't start," I run through the same mental checklist I've used for 15 years. An engine needs exactly three things to run: spark, fuel, and compression. If you have all three, it runs. If one is missing, it doesn't. The key is figuring out which one is missing without firing the parts cannon at the problem.

I'm going to walk you through exactly how I diagnose a no-start, in the order I actually do it. You don't need a $5,000 scan tool. A $20 multimeter will handle 90% of this.

---

## Step 1: Listen to the Car (It's Telling You What's Wrong)

Before you touch a single tool, turn the key to START and listen. The sound the car makes — or doesn't make — eliminates half the possibilities right there.

**Single loud CLICK, then nothing:** This is the starter solenoid engaging but the starter motor not turning. Classic bad starter solenoid or seized starter. The solenoid is getting power and throwing the gear into the flywheel, but the motor itself is dead. If you tap the starter body firmly with a hammer or a breaker bar while someone holds the key in START, and it suddenly cranks — you've confirmed a bad starter. The impact temporarily frees up the seized brushes inside the motor. This is an emergency trick to get you home or to the shop, not a fix. Replace the starter.

**Rapid clicking (machine-gun sound):** Dead battery, full stop. What you're hearing is the starter solenoid engaging and disengaging rapidly because there's enough power to throw the solenoid but not enough to hold it engaged and crank the engine. The voltage is probably somewhere around 9-10V at the battery. Jump start it. Then figure out WHY the battery died — was it old (4-5 years), did you leave a light on, or is there a parasitic draw? If the battery tests good after charging and the car was just sitting too long, you're fine. If the battery tests bad (below 12.2V after a full charge and rest), replace it.

**Cranks normally but won't fire:** Engine turns over at normal speed, you can hear the compression rhythm, but it won't catch. This is a fuel or spark problem. The battery and starter are fine. Now we diagnose.

**Cranks slowly (groaning sound), then stops:** Weak battery. Voltage is probably 11.5-11.8V — enough to move the starter but not enough to turn the engine at the speed it needs to build compression and fire. Charge the battery and test it. If the battery tests good but the car still cranks slow, check the battery cable connections (corrosion at the terminals causes voltage drop) and the starter itself (worn brushes draw excessive current).

**Nothing at all (no click, no crank, dash lights on):** Could be a bad ignition switch, a starter relay failure, or a neutral safety switch preventing the starter circuit from energizing (try starting in Neutral instead of Park if it's an automatic). Could also be a blown main fuse or fusible link. Less common: bad ECU ground or broken wire to the starter solenoid.

**Nothing at all (no dash lights either):** Battery is completely dead or disconnected. Check the battery terminals first — a loose or corroded terminal can kill all power. If the terminals are clean and tight, the battery is fully discharged (below 10V) and needs charging and testing. A battery that drops to zero randomly may have an internal short (broken plate inside).

---

## Step 2: Check Battery Voltage (30 Seconds, $20 Tool)

Set your multimeter to DC volts. Touch the red probe to the positive terminal, black probe to the negative terminal. Here's what the numbers mean:

**12.6V or higher:** Battery is fully charged. Healthy.
**12.4V:** About 75% charged. Still fine.
**12.2V:** About 50% charged. Borderline. Charge it.
**12.0V:** About 25% charged. Insufficient. Charge and test.
**Below 11.8V:** Effectively dead. Charge it fully, then have it load-tested at a parts store.

Voltage should be measured after the battery has rested for at least an hour (no charging, no driving, no load). If you just drove the car or charged the battery, the voltage will read higher from "surface charge" — this is misleading. Turn the headlights on for 30 seconds, turn them off, wait a minute, then measure.

While cranking, the voltage at the battery should not drop below 9.6V. If it drops below 9.6V during cranking, the battery is weak or the starter is drawing excessive current. A healthy starter on a healthy battery will pull voltage down to about 10.0-10.5V while cranking.

---

## Step 3: Listen for the Fuel Pump (5 Seconds, Free)

Turn the key to the ON position (not START). You should hear a quiet hum or whir from the rear of the car for about 2-3 seconds. That's the fuel pump priming — it's building pressure in the fuel rail so the injectors have fuel ready when you crank. The sound comes from the fuel tank area (under the rear seat or in the trunk floor on most cars).

If you don't hear it: The fuel pump, fuel pump relay, or fuel pump fuse may be bad. Try cycling the key OFF then ON a few times — sometimes the fuel pump will wake up on the second or third attempt if it's starting to fail. If you still hear nothing, check the fuel pump fuse and relay first (cheap and easy). If those are good, the pump itself is likely dead.

On some cars (Toyota, Lexus, newer vehicles), the fuel pump priming cycle is very quiet or doesn't run every single time. If you don't hear it, don't panic — it might be a design quirk. Move on to the spark test.

---

## Step 4: Check for Spark (5 Minutes, Basic Tools)

This is easier than people think. Pull one spark plug wire or coil-on-plug assembly. Remove the spark plug. Plug the spark plug back into the wire or coil boot. Hold the threaded metal body of the plug firmly against a bare metal surface on the engine (the valve cover, a bracket, a bolt head — anything grounded). Have someone crank the engine for 2-3 seconds. You should see a bright blue spark jumping across the plug gap.

Blue spark = good. Orange/yellow spark = weak ignition coil. No spark = the ignition system isn't working — could be a bad crank position sensor, bad ignition coil, bad ignition control module, or a broken wire in the ignition circuit.

Safety note: Don't hold the plug by the wire — the current will find a path to ground through you. Hold the rubber boot. And don't do this test anywhere near a fuel leak. If you smell raw fuel, stop and find the leak first.

---

## Step 5: Quick Compression Sanity Check

If you have spark and fuel (you can hear the pump and smell fuel at the exhaust after cranking) but the engine still won't start, compression is suspect. A timing belt that snapped or jumped teeth will give you zero compression on multiple cylinders. The engine will crank faster than normal (no compression resistance) and sound "wrong" — like it's spinning freely rather than building pressure.

You need a compression tester ($25 at Harbor Freight) to test properly, but if the engine cranks normally and sounds like it's building compression rhythm (chug-chug-chug sound), compression is probably not your problem. A broken timing belt is dramatic — you'll usually know because the engine suddenly died while driving, not just "wouldn't start this morning."

---

## Common No-Start Causes by Symptom

| Symptom | Most Likely Cause | Rough Cost (Shop) |
|---|---|---|
| Single click, no crank | Bad starter solenoid | $300-500 |
| Rapid clicking | Dead battery | $100-200 (battery) |
| Cranks, no start | Fuel pump or crank sensor | $400-800 (fuel pump) |
| Nothing at all (dash on) | Ignition switch or neutral safety switch | $150-400 |
| Slow crank, then stops | Weak battery or bad connection | $0-200 |
| Cranks, sputters, dies | Fuel delivery (filter, pump) | $100-800 |

---

## The Parts Cannon Warning

I see this all the time: a DIYer throws a starter at a car that had a dead battery. Then a battery. Then an alternator. Three parts later, $600 spent, and the problem was a corroded battery terminal the whole time.

Diagnose first. Confirm the failure. Then buy the part. The multimeter does not lie. The $20 multimeter is your shield against the $500 guess.

---

## Cost by Component

- Battery: $100-200 (standard lead-acid), $180-300 (AGM). Installation is usually free at the parts store.
- Starter: $200-500 (shop, including labor). DIY: $80-200 for a remanufactured starter, 1-3 hours.
- Alternator: $300-700 (shop). DIY: $120-300 for a reman alternator, 1-3 hours.
- Fuel pump: $400-800 (shop, including dropping the tank). DIY: $80-250 for the pump assembly, 2-5 hours depending on whether you drop the tank or access through the floor panel.
- Crankshaft position sensor: $150-300 (shop). DIY: $40-80 for the sensor, 30-60 minutes on most cars — but some are buried behind the timing cover.
- Battery terminals/cables: $20-50 (DIY, 15 minutes).

---

## The Bottom Line

A no-start is a logic problem, not a mystery. Battery voltage tells you about the battery. The starter sound tells you about the starter. The fuel pump hum tells you about the fuel system. The spark test tells you about the ignition. Check them in that order. 80% of no-starts are the battery or the starter. Most of the rest are the fuel pump. Diagnose before you spend money, and don't let anyone sell you a starter when your battery terminals are corroded.

Got a no-start you're trying to figure out? Post your year, make, model, and exactly what happens when you turn the key. I'll tell you where to start.

*— 老李 (Li), ASE Certified Master Technician, 15 years in dealerships and independent shops*`,
  },
  {
    category_slug: "detailing",
    title: "Headlight Restoration: Make Your Cloudy Headlights Crystal Clear for $20",
    body: `Yellowed, hazy, cloudy headlights aren't just ugly — they're dangerous. The National Highway Traffic Safety Administration found that degraded headlight lenses can reduce light output by up to 80%. That means on a dark road at 60 mph, you're losing 80% of your forward visibility because of plastic oxidation. Eighty percent.

The good news: you can fix this yourself in about an hour for $20, and the results will look professional. You don't need a $200 kit. You don't need a shop. You need sandpaper, compound, and a UV coating. I'll show you exactly how.

---

## Why Headlights Yellow (It's Not Dirt)

Headlight lenses made after the mid-1990s are polycarbonate plastic, not glass. Polycarbonate is impact-resistant (good for rocks at highway speed), lightweight, and can be molded into complex shapes for aerodynamics. But it has one weakness: UV radiation from sunlight.

Polycarbonate naturally oxidizes under UV exposure — it turns yellow and develops a chalky, cloudy surface layer. To prevent this, manufacturers apply a factory UV protective coating during production — essentially a clear coat specifically formulated for plastic. This coating works great for 4-7 years, depending on how much sun the car sees. A car parked outside in Phoenix will have cloudier headlights at year 5 than a garaged car in Seattle at year 10.

When the factory UV coating fails, two things happen: the coating itself oxidizes and turns yellow, and then the unprotected polycarbonate underneath begins to oxidize. The result is that hazy, yellow, ugly lens surface. Simply washing the headlight does nothing — the defect is in the material itself.

---

## The Complete DIY Restoration Process

You need:
- 800, 1000, 2000, and 3000 grit wet/dry sandpaper (about $5 per pack at any auto parts store; one pack of each grit is enough for a dozen cars)
- A spray bottle with water (for wet sanding)
- Blue painter's tape (to protect paint around headlights)
- Meguiar's Ultimate Compound ($12) or any medium-cut polishing compound
- Microfiber towels (at least 3-4 clean ones)
- UV protective clear coat — either a 2K clear coat ($15 for a can of SprayMax 2K) or Cerakote Ceramic Headlight Restoration wipes ($17 for the kit)
- Optional but helpful: a drill attachment foam pad ($8) for faster compounding

**Estimated time:** 1 hour for both headlights (first time). 30 minutes once you've done it before.

---

### Step 1: Tape Off the Surrounding Paint

Use blue painter's tape to mask off the painted body panels around each headlight. Go a good 2-3 inches around the lens. You WILL accidentally sand the edge of the tape, and if there's no tape there, you'll sand your paint. Paint is softer than you think and 800 grit goes through clear coat surprisingly fast. Don't ask how I know this.

Also tape off any rubber trim, plastic bumper sections, and chrome trim near the headlight. Sandpaper doesn't discriminate between headlight and grille.

---

### Step 2: Wet Sand — 800 Grit

Fill your spray bottle with water. Wet the headlight lens and the 800 grit sandpaper. Start sanding with even, overlapping strokes — horizontal, then vertical, then horizontal again. Keep the surface and paper constantly wet. Dry sanding creates heat (which melts the plastic) and clogs the paper (which stops cutting).

You're sanding through the failed UV coating and the oxidized layer of polycarbonate. The water running off the headlight will be milky white at first — that's the oxidized plastic coming off. When the runoff turns clear, you've cut through the bad layer. The lens will look uniformly cloudy (from the 800 grit scratches) — this is correct. You should not see any shiny spots, which would indicate high spots where the sandpaper hasn't reached yet.

This step takes the longest — 5-10 minutes per headlight depending on how bad the oxidation is. Don't rush it. If you don't remove all the failed coating here, the headlight will look patchy at the end.

---

### Step 3: Wet Sand — Progressively Finer Grits

Rinse the headlight and your hands. Now move to 1000 grit. Wet sand for 3-5 minutes. The scratches from 800 grit are being replaced with finer 1000 grit scratches. The lens will still look cloudy but with a finer haze.

Rinse. Move to 2000 grit. Wet sand for 3-5 minutes. The lens surface will start to look less hazy and more translucent. You're getting closer.

Rinse. Move to 3000 grit. Wet sand for 3-5 minutes. At this point, the lens will have a uniform, fine satin finish — like frosted glass. It should be completely even with no patches of different texture. If you see any spots that look different, go back one grit and re-work that area.

The rule: each progressively finer grit should completely remove the scratches from the previous grit. If you skip a grit or don't spend enough time, the deeper scratches won't compound out later.

---

### Step 4: Compound and Polish

Apply Meguiar's Ultimate Compound (or your compound of choice) to a microfiber towel or a foam pad. Rub the headlight vigorously in circles with firm pressure. If you have a drill with a foam polishing pad, this takes about 2 minutes per light. By hand, it takes 5-10 minutes — your arm will get tired, but the results are the same.

The compound contains micro-abrasives that refine the 3000 grit sanding scratches down to a polished surface. You should see the headlight clearing up as you work. When it looks clear, wipe off the compound residue and inspect under good light. If you see any remaining haze or sanding marks, repeat the compounding step. Don't be tempted to move on with a "good enough" surface — the UV coating will lock in whatever finish you have underneath.

After compounding, if you want to go the extra mile, follow with a finishing polish (Meguiar's Ultimate Polish, $10). This gives a slightly higher gloss. Not required, but nice if you're picky.

At this stage, the headlight will look crystal clear and brand new. And if you stopped here... it would be yellow again in 2-4 weeks. Why? Because you've completely removed the UV protective coating, and bare polycarbonate exposed to sunlight oxidizes rapidly. This is where most people fail.

---

### Step 5: Apply UV Protective Clear Coat (THE MOST IMPORTANT STEP)

The UV coating is what determines whether your headlights look clear for 2 years or 2 weeks. You have two good options:

**Option A: 2K Clear Coat ($15/can — enough for 10+ cars)**

SprayMax 2K clear coat is a two-part urethane clear in a spray can. You activate it by pressing a button on the bottom of the can (which releases the hardener into the paint), shake for 2 minutes, and you have pot life of about 24 hours before the can hardens. This is professional-grade clear coat — the same chemistry as automotive paint clear coat.

Apply 2-3 light coats, 5-10 minutes between coats. Hold the can 8-10 inches away. Don't lay it on heavy — you want coverage without runs. A light mist coat first (just to tack the surface), then a medium coat, then a final medium coat. The result is a hard, UV-resistant, optically clear coating that will last years.

The 2K SprayMax is the best DIY solution I've found. It's what I use on my own cars. One can costs about $15 on Amazon and will do a lifetime of headlight restorations.

**Option B: Cerakote Ceramic Headlight Restoration Kit ($17)**

Cerakote's kit includes everything: sandpaper, compound, and their ceramic coating wipes. The ceramic coating is the star — it's a wipe-on UV coating that chemically bonds to the polycarbonate. Application is simpler than spraying: just wipe it on evenly and let it cure. The ceramic chemistry resists UV degradation extremely well. I've seen Cerakote-treated headlights look great after 18+ months in the California sun.

The kit is $17 on Amazon and does one or two sets of headlights. It's the most comprehensive single-box solution.

---

## The Cheap Kit Trap

You've seen the $10 headlight restoration kits at Walmart or AutoZone. They come with a little packet of compound and a "UV sealer wipe." Here's the problem: the UV sealer in cheap kits is essentially a wax or silicone-based protectant. It sits on top of the plastic. It washes off after a few car washes. When it's gone, the bare polycarbonate underneath — which you've now sanded completely clean — oxidizes faster than ever.

These kits deliver headlights that look great for about two weeks. Then they yellow again, worse than before, because you removed whatever was left of the original UV coating. You end up doing the job twice. Buy the 2K clear or the Cerakote kit and do it once.

---

## Professional Restoration vs DIY

| | DIY (2K Clear) | Professional Shop |
|---|---|---|
| Cost | $20-30 (materials, reusable) | $75-150 per headlight |
| Time | 1 hour total | Drop off, pick up later |
| Longevity | 2-4 years (2K clear) | 2-4 years (similar process) |
| Quality | Excellent (if you take your time) | Excellent |

The "professional" restoration at a detail shop is essentially the same process — wet sand, compound, polish, UV clear coat. They might use a rotary polisher instead of a drill, and they've done it a hundred times, but the chemistry is identical. The $250 you'd pay at a shop for both headlights buys you the same result you can get with $20 and an hour of your Saturday morning.

Shops charge $75-150 per headlight because of labor, not because they're using magic materials. The materials cost them about $2 per car.

---

## Common Mistakes

**Skipping the UV coating.** I cannot stress this enough. Sanded, polished, bare polycarbonate will oxidize within weeks. The UV coating is not optional.

**Not spending enough time on each grit.** If you half-ass the 800 grit step and leave oxidized plastic, the headlight will look good until the compound residue dries — then you'll see the yellow patches underneath. Do it right the first time.

**Sanding without keeping the surface wet.** Dry sanding melts the polycarbonate and the sandpaper clogs instantly. You make almost no progress and you generate heat that can deform the lens. Keep it wet.

**Sanding the paint.** Use enough tape. Triple-check that the paint is covered. One slip with 800 grit and you'll be learning how to polish clear coat scratches out of your fender.

**Using a cheap kit.** The $10 kits work for about two weeks. Then you're back where you started, minus $10 and an hour of your life.

---

## The Bottom Line

Clear headlights are a safety issue, not a cosmetic one. Eighty percent light output loss from cloudy lenses means you're essentially driving with your headlights at 20% of their designed brightness. For $20 and an hour of your time, you can restore them to like-new clarity and protect them for years.

The sanding is easy. The compounding is satisfying. The UV coating is the step that makes it last. Do all three, and your headlights will be clear, bright, and safe for the next 2-4 years.

Questions about your specific headlight restoration? Post your car's year, make, and model in the comments. Different cars have different headlight shapes and access — I'll tell you if there are any gotchas for your specific vehicle.

*— 老李 (Li), ASE Certified Master Technician, 15 years in dealerships and independent shops*`,
  },
  {
    category_slug: "buying-advice",
    title: "Best Car Jack and Jack Stands for Home Mechanics (Safety First)",
    body: `Let me start with the most important thing I'm going to say in this entire article: NEVER work under a car supported only by a jack. Not the factory scissor jack. Not a floor jack. Not a bottle jack. Not for 30 seconds, not for "just a quick look." Never.

I've been turning wrenches for 15 years. I've personally known two mechanics who were injured by cars falling off lifts or jacks — one broken arm, one crushed hand. I've heard of worse. A 3-ton vehicle falling on a human body is not survived. The jack is for lifting. The stands are for holding. If you remember nothing else from this article, remember that.

Now let's talk about what to buy.

---

## The Jack: What Actually Matters

A floor jack is a hydraulic ram on wheels with a long handle. You pump the handle, hydraulic fluid pushes the ram up, the lifting arm raises the car. When you're done, you release a valve and the car comes down. Simple machine. But the difference between a good jack and a bad one matters.

Here's the jack I recommend for most home mechanics, plus alternatives for specific use cases.

---

### Best Overall: Harbor Freight Daytona 3-Ton Floor Jack ($129 on sale, $189 regular)

I know what you're thinking. "Harbor Freight? Really?" Yes, really. The Daytona 3-ton is the exception to every Harbor Freight joke. This jack is manufactured in the same factory as the Snap-On FJ300 — and Snap-On sued Harbor Freight over it (they settled). Same castings. Same seals. Same hydraulic unit. Different paint color. Different price tag: Snap-On wants $600+. Harbor Freight sells it for $129 when it's on sale.

The Daytona 3-ton has a minimum height of 3.75 inches (fits under lowered cars and sports cars), a maximum lift of 23.125 inches (high enough for trucks and SUVs on tall stands), and the long-reach version (Daytona Super Duty) gives you even more reach for trucks. The pump is smooth. The release valve has good modulation — you can lower the car slowly and precisely instead of the sudden drop that cheap jacks do.

I've had the same Daytona 3-ton in my home garage for about 5 years. It's lifted everything from a Miata to a Silverado 2500HD. The welds are clean. The seals don't leak. The wheels roll smoothly. For $129, it's the best value in automotive tools, period.

What's not great: It's heavy — about 75 pounds. If you need to carry it up and down stairs or load it in and out of a trunk for track days, look at the aluminum options. The handle is steel and will chip paint if you're not careful with it. And the included saddle pad (the rubber pad on the lifting cup) is thin — I swapped mine for a thicker polyurethane one ($8 on Amazon) to protect frame rails and pinch welds better.

**Bottom line:** If you have a garage or a driveway and you're serious about DIY work, buy the Daytona 3-ton. It's the only floor jack you'll ever need.

---

### Best Lightweight: Arcan XL2T 2-Ton Aluminum Floor Jack ($199)

If you're doing track days, autocross, or you just don't want to drag 75 pounds of steel across your garage floor, the Arcan XL2T is the answer. It's aluminum, so it weighs about 42 pounds — light enough to pick up with one hand, easy to throw in a trunk or carry to a friend's house.

The 2-ton rating (4,000 pounds) is enough for any passenger car and most crossovers. It won't handle a full-size truck or SUV — stick to the Daytona 3-ton for those. The minimum height is 3.5 inches (lower than the Daytona, good for lowered cars). Maximum lift is 18 inches (enough for jack stands under a car, not high enough for a truck on tall stands).

The quality is good — the welds are clean, the pump is smooth, the release valve is controllable. Arcan is a lesser-known brand but they've been making jacks for industrial markets for decades. This is their consumer product and it's well-executed.

**Bottom line:** If weight matters more than lift height, get the Arcan. Track day guys, apartment dwellers with storage constraints, people who work on lowered cars — this is your jack.

---

## Jack Stands: Your Life Literally Depends on Them

The jack lifts. The stands hold. If the stands fail, the car falls on you. Do not cheap out on jack stands.

---

### Best Budget: Pro-Lift 3-Ton Jack Stands ($45/pair)

These are the standard recommendation for beginners and I stand by it. The Pro-Lift stands use a traditional ratchet design — a cast iron post with teeth that a pawl engages. You lift the post to the desired height and the pawl clicks into the teeth. To lower, you lift the handle to release the pawl and slide the post down.

These have been the default recommendation for years for a reason: they're affordable, they're widely available (Amazon, Walmart, AutoZone), and they work. The 3-ton rating (6,000 pounds per pair, 3 tons each stand) is overkill for the corner of a passenger car (which weighs about 800-1,200 pounds per corner) — which is exactly how you want safety equipment. Overkill.

The ratchet mechanism is simple and reliable. The base is wide enough for stability on concrete. The saddle at the top has a decent rubber pad.

What's not great: The ratchet design means there's a small part (the pawl) that can fail. In theory, if the pawl somehow disengages (debris in the teeth, improper engagement), the stand can collapse. In practice, this is extremely rare if you check engagement before you get under the car. Always verify the pawl is fully seated in the teeth on both stands. Give the car a shake before you get under it. If it's solid, it's solid.

---

### Best Safety: ESCO 3-Ton Pin-Style Jack Stands ($75/pair)

If the Pro-Lift ratchet stands are good, the ESCO stands are better — specifically in the one place that matters: the locking mechanism.

ESCO stands use a pin-style design instead of a ratchet. The post has holes at specific height intervals. You insert a solid steel pin through the post and the column. The pin carries the load. There is no pawl. There are no ratchet teeth. There is a single solid steel pin that cannot "accidentally release" because it's physically impossible for it to release — it has to be pulled out, and the car's weight on the pin means the pin is under load and cannot be removed without lifting the car back up.

This is the design used in professional shops and by safety-obsessed home mechanics. The pin-style stand has exactly one failure mode: the pin shears. The ESCO pin is rated for a load far, far beyond the stand's rating. For it to shear, you'd need to exceed the 3-ton rating by a significant margin — meaning you'd have a much larger problem than the stand failing.

The ESCO stands also have a flat-top saddle design (a flat rubber pad rather than a saddle that cradles the frame), which is excellent for cars with flat jacking points (most unibody cars) and for using a jack stand adapter on BMWs, Audis, and Porsches that use specific jack pad blocks.

**Bottom line:** Spend the extra $30 for ESCO pin-style stands if safety is your priority. Which it should be. I use ESCO stands in my home garage.

---

### Best for Trucks/SUVs: Torin Big Red 6-Ton Jack Stands ($60/pair)

If you work on full-size trucks, SUVs, or anything that sits high and heavy, get 6-ton stands. The Torin Big Red 6-ton stands are tall (15.75" to 23.5" range) and rated for 12,000 pounds per pair. They use the ratchet design (not pin-style), which at this capacity is more common — you won't find affordable pin-style 6-ton stands.

The double-locking design adds a safety pin through the ratchet post as a secondary lock. It's not quite the same as a true pin-style stand (the ratchet pawl is still the primary load carrier), but the secondary pin provides insurance against pawl disengagement. Good enough safety margin for the weight class.

These are heavy — about 20 pounds each. The base is wide. The steel is thick. They feel substantial because they are.

**Bottom line:** If you own a truck or large SUV, buy 6-ton stands. The height range and capacity of 3-ton stands aren't adequate for a vehicle that sits this high and heavy.

---

## Ramps vs Stands: When to Use Which

A question I get all the time: "Should I get jack stands or ramps?"

**Ramps (RhinoRamps, $50/pair):**
- Drive the car onto them. Quick, easy, no lifting required.
- SAFER than jack stands for the specific tasks they work for — the load is spread across the entire tire contact patch and the ramp structure is inherently stable.
- Perfect for: oil changes, transmission fluid changes, coolant flushes, anything under the front or rear of the car that doesn't require removing wheels.
- Useless for: brakes, suspension, wheel bearings, tire rotations, anything requiring wheel removal.
- RhinoRamps 16,000-pound capacity rated is the standard recommendation. They're plastic but the honeycomb internal structure is rated for far more than any passenger vehicle.

**Jack Stands:**
- Required for anything involving wheel removal (brakes, suspension, bearings, tire rotations).
- Also necessary for anything where the car needs to be level on four stands (transmission work, driveshaft, exhaust, some fluid services).

**My setup:** I own both. Ramps for quick oil changes. ESCO stands for brake jobs and suspension work. If you can only buy one, buy jack stands — they do everything ramps can do (lifting one corner at a time for an oil change) plus everything ramps can't. But ramps are $50 and the convenience is real.

---

## Safety Rules: Read These Before You Jack Up a Car

**1. Jack stands every single time.** The jack is for lifting. The stands are for holding. Never spend even 30 seconds under a car that's only on a jack. The hydraulic seal in a floor jack can fail without warning. It takes less than a second for the car to drop.

**2. Level concrete only.** Never jack up a car on an incline, on dirt, on gravel, on asphalt on a hot day (asphalt softens, the jack stand can sink). Level concrete driveway or garage floor. If the surface isn't perfectly level, the car can shift and the stands can tip.

**3. Jack from the correct lift points.** Your car has specific reinforced areas designed for jacking — usually pinch welds behind the front wheels and ahead of the rear wheels, or specific subframe points. Using the wrong point can puncture the floor pan, bend an oil pan, crush a brake line, or slip off and drop the car. Your owner's manual shows the correct points. Google "jack points [your car]" if you're unsure.

**4. Place stands under the correct support points.** The factory jack points for the scissor jack may not be the same as the support points for jack stands. Usually, the stands go under the subframe, the frame rails, or reinforced unibody points. Never put a stand under the floor pan, oil pan, transmission pan, or any sheet metal that's not reinforced.

**5. Use wheel chocks.** Before you lift, chock the wheels on the opposite end of the car (chock the rear wheels if you're lifting the front, front wheels if you're lifting the rear). Chocks are $10 on Amazon or you can use a block of wood. The parking brake only works on the rear wheels — if you're lifting the rear, chock the front.

**6. Give it a shake test.** After lowering the car onto the stands, before you get under it, grab the car and shake it firmly in multiple directions. The car should feel solid as a rock. If there's any movement, rocking, or instability, reset the stands. Do not assume it'll be fine.

**7. Keep the jack in place as backup.** After the car is on stands, leave the floor jack in position under the lift point (fully engaged, just touching the load). This is a belt-and-suspenders approach — if a stand somehow fails, the jack catches the car. It won't hold the car perfectly, but it might prevent a full drop.

**8. Remove your watch, rings, and jewelry.** This is less about the jack and more about general safety, but caught jewelry is a quick way to lose a finger.

---

## What I Actually Use

My home garage setup:
- Harbor Freight Daytona 3-ton Super Duty long-reach floor jack ($289 — I upgraded from the standard after 4 years because the long reach makes lifting trucks much easier)
- ESCO 3-ton pin-style stands ($75/pair, two pairs)
- RhinoRamps ($50, for quick oil changes)
- Pro-Lift wheel chocks ($10/pair)

Total: about $500 for everything. That's roughly the cost of two professional oil changes and one brake job at a shop. I've done hundreds of oil changes and dozens of brake jobs on this setup. It's paid for itself many times over, and more importantly, I've never felt unsafe under a car on these stands.

---

## The Bottom Line

1. **Floor jack:** Harbor Freight Daytona 3-ton ($129). Best value in automotive tools. Same factory as Snap-On, 1/4 the price.

2. **Jack stands:** ESCO 3-ton pin-style ($75/pair) if you value safety above cost. Pro-Lift 3-ton ($45/pair) if budget is tight. Never, ever, ever work under a car without stands.

3. **Ramps:** RhinoRamps ($50/pair) if you do frequent oil changes and don't need to remove wheels. Convenience is real.

4. **Safety:** Level concrete. Correct jack points. Shake test. Stands every time. No exceptions.

Questions about your specific car's jack points or which setup is right for your garage? Post your year, make, model, and what kind of work you plan to do. I'll tell you exactly what you need.

*— 老李 (Li), ASE Certified Master Technician, 15 years in dealerships and independent shops*`,
  },
  {
    category_slug: "repair",
    title: "Why Your Car Shakes When Braking (And What to Do About It)",
    body: `A customer came in last month with a 2021 Toyota Camry. "The steering wheel shakes when I brake on the highway," she said. "I just had the tires balanced, and it didn't help." The tire shop had sold her a balance and rotation, which is fine maintenance, but it didn't fix the problem because the problem wasn't the tires. It was the front brake rotors. Two front rotors and a set of pads later, the shake was gone entirely. She'd spent $80 on a balance and rotation she didn't need. The actual fix was $120 in parts and an hour of my time.

Brake-related vibrations are one of the most common diagnostic mistakes I see. People guess. The tire shop guesses. The mechanic at the chain store guesses. Nobody takes the 5 minutes to figure out what's actually causing the shake. Let me walk you through exactly how to tell what's wrong, what needs to be replaced, and how much it should cost.

---

## Step 1: Identify WHERE and WHEN the Shake Happens

This is the single most important diagnostic step. The location and timing of the vibration tells you which end of the car has the problem and eliminates non-brake causes. Here's the diagnostic cheat sheet I use:

---

### Steering Wheel Shakes When You Brake = Front Rotors

If the steering wheel shakes, vibrates, or pulses in your hands while braking, the problem is in the front brakes. Specifically, the front rotors have thickness variation — commonly called "warped rotors." The rotor surface is no longer flat and parallel. As the pads clamp onto the uneven rotor, the variation in thickness pushes back through the caliper piston, through the brake fluid, up to the brake pedal. You feel it in the steering wheel because the front suspension and steering system are directly connected.

This is the most common brake vibration and it's almost always the front rotors. Front brakes do about 70% of the stopping work so they wear faster and generate more heat.

---

### Shake Felt in the Seat or Floor When Braking = Rear Rotors (or Drums)

If your steering wheel is steady but you feel a vibration through the seat or the floor pan when braking, the problem is in the rear brakes. On cars with rear disc brakes, it's the rear rotors. On cars with rear drum brakes (still common on economy cars, especially the rear axle), a warped drum or unevenly worn drum can produce the same sensation.

Seat vibration is harder to notice at low speeds. It's most apparent during moderate braking from highway speeds — 55 to 35 mph deceleration.

---

### Shake at Highway Speed WITHOUT Braking = Wheel Balance, NOT Brakes

If the car vibrates at highway speeds (60-70 mph) even when you're not touching the brake pedal, the problem is wheel balance or a bent wheel. Brake-related vibrations only happen when you press the brake pedal. No braking = no brake vibration. This is the number one misdiagnosis I see — people assume a highway shake is "warped rotors" when the car shakes cruising at 70 mph. That's wheel balance. Get your tires balanced.

A bent wheel will produce a similar vibration, usually more pronounced and sometimes with a visual wobble if you follow someone driving your car.

---

### Shake When Braking FROM HIGH SPEED (60+ MPH Down to 40) = Heat-Spotted Rotors

If the brakes are smooth at low speeds but start shaking noticeably when you brake from highway speeds, the rotors likely have heat spots — localized areas where the rotor surface reached extreme temperatures and the metal underwent a structural change. The heat spot is harder than the surrounding metal, creating a localized high spot that you feel as a pulsation.

Heat spots are often visible as blue or purple discoloration on the rotor surface. The color comes from the metal reaching 800-900 degrees Fahrenheit and forming an oxide layer. If you see a rotor with a blue-purple patch, it's heat-damaged. Replace it.

What causes heat spots: hard braking from high speed (panic stops, aggressive driving), riding the brakes down a long mountain descent, or a sticking caliper that keeps the pads in constant light contact with the rotor, generating constant heat.

---

### Shake + Pulling to One Side When Braking = Sticking Caliper

If the car shakes AND pulls to one side when you brake, you likely have a sticking caliper. The caliper piston isn't retracting properly, so the pads stay in contact with the rotor on that side. The constant friction heats up the rotor, causing thermal warping. You feel the shake from the warped rotor and the pull from the brake force imbalance (the good side retracts, the sticky side drags).

Diagnose: After a drive, carefully touch (or better, use an infrared thermometer) the wheel near the center. If one wheel is significantly hotter than the others, the caliper is sticking.

---

### Pulsating Brake Pedal (But Steering Wheel Is Steady) = Rear Rotors or General Rotor Warpage

If the brake pedal itself pulses under your foot — you can feel it pumping up and down — but the steering wheel doesn't shake, the thickness variation is on the rear rotors or is a very subtle front rotor issue that's being dampened by the power steering system. The hydraulic pulsation from the uneven rotor travels through the brake fluid to the pedal. A significant pedal pulsation is never normal. It's always rotors.

---

## What Actually Causes "Warped" Rotors

Here's something most people don't know: rotors rarely actually "warp" in the sense of physically bending. What really happens is thickness variation.

The rotor surface develops uneven wear — some spots are thinner, some are thicker. When the pads clamp on, the varying thickness pushes the pads apart and together as the rotor turns. That push-pull is what you feel as a vibration.

The two main causes:

1. **Uneven pad material transfer.** Brake pads deposit a thin layer of friction material onto the rotor surface. This is normal and desirable — it's how brakes work. But if the rotor gets extremely hot (hard braking, track driving) and then you come to a complete stop with the pads clamped onto the hot rotor, the pad material in that one spot bakes into the rotor surface unevenly. Now the rotor has a high-friction spot and a low-friction spot, and the wear becomes unequal from that point forward.

2. **Runout.** If the rotor isn't perfectly perpendicular to the wheel hub — even by a few thousandths of an inch — it wobbles as it turns. The high spots wear faster. Over thousands of miles, the thickness variation becomes noticeable as a pulsation. Runout can come from rust or debris between the rotor and hub (clean the hub face when installing rotors!), a worn wheel bearing (allows the hub to wobble), or a rotor that wasn't machined perfectly flat.

---

## Can You Machine It, or Do You Need to Replace It?

Twenty years ago, every brake job included machining the rotors on a brake lathe. The shop would cut a thin layer off the rotor surface to make it perfectly flat and parallel again. Today, machining is less common for two reasons:

1. **Rotors are thinner than they used to be.** Modern cars use thinner rotors to reduce unsprung weight (for fuel economy and handling). There's less material to machine off before you hit the minimum thickness spec. By the time a rotor is warped, there often isn't enough material left to safely machine it.

2. **Rotors are cheaper than they used to be.** A front rotor for a Camry costs $40-60. A rear rotor costs $30-50. A shop charges about $25-40 per rotor to machine them. At that price, you might as well replace them — new rotors are perfectly flat, have the full service life, and come with a clean, rust-free surface.

**The rule:** If the rotor is above its minimum thickness spec (stamped on the rotor casting) and you're doing the work yourself, you can have a machine shop cut them for $25-40 each. If you're paying a shop to do the brakes, just have them install new rotors. The labor is the same. The parts cost difference ($40 vs $25 machining) is trivial.

**Never just replace pads on warped rotors.** If the rotor has thickness variation, putting new pads on it doesn't fix the rotor. The new pads will wear unevenly from day one, conforming to the uneven rotor, and within a few thousand miles you'll have the same vibration again — plus a wasted set of pads. Replace or machine the rotors. Every time.

---

## Cost Breakdown

| Service | DIY Cost | Shop Cost |
|---|---|---|
| Front rotors + pads | $80-200 | $300-500 |
| Rear rotors + pads | $70-150 | $280-450 |
| All 4 rotors + pads | $150-350 | $500-900 |
| Rotor machining (per rotor) | $25-40 (machine shop) | $25-40 (flat rate) |
| Caliper replacement (per side) | $50-120 (reman) | $250-450 |
| Wheel balance (all 4) | — | $40-80 |

---

## How to Prevent It (So You Don't Have to Fix It Again)

1. **Don't come to a hard stop after heavy braking and hold the pedal down.** If you've been braking hard (long downhill descent, track driving, stop-and-go traffic), don't clamp the hot pads onto the hot rotor at a red light. Creep forward slightly if you can, or shift to neutral and use the parking brake instead of the foot brake. The goal is to not bake pad material into one spot.

2. **Torque your lug nuts.** Improperly torqued lugs can cause rotor runout. The uneven clamping force bends the rotor slightly. Always use a torque wrench. The spec is usually 80-100 ft-lbs for most passenger cars. Look up your car's spec. Tighten in a star pattern. Never just blast them on with an impact gun and call it good.

3. **Clean the hub face when replacing rotors.** Rust and debris between the rotor and the hub cause runout. Wire-brush the hub until it's clean metal. A little anti-seize on the hub face prevents future rust.

4. **Break in new pads and rotors properly.** Most pad manufacturers recommend a break-in (bedding) procedure: several moderate stops from 30-40 mph, then several harder stops from 50-60 mph without coming to a complete stop — you want to lay down an even transfer layer of pad material across the entire rotor surface. Read the instructions that come with your pads. Different pad compounds have different bedding requirements.

---

## The Bottom Line

If your steering wheel shakes when braking: front rotors. If your seat shakes when braking: rear rotors. If it shakes at highway speed without braking: wheel balance. If it shakes from high-speed braking specifically: heat-damaged rotors. If it shakes AND pulls to one side: sticking caliper.

Don't guess. Don't throw parts at it. Don't let a tire shop sell you a balance when your rotors are warped. Use the diagnostic flow above, figure out which end of the car has the problem, and fix it once.

Got a brake shake you're trying to diagnose? Post your year, make, model, and exactly when/where you feel the vibration. I'll point you toward the right fix.

*— 老李 (Li), ASE Certified Master Technician, 15 years in dealerships and independent shops*`,
  },
  {
    category_slug: "maintenance",
    title: "Suspension 101: Shocks vs Struts vs Springs — What Each Does and When to Replace",
    body: `I had a customer last year with a 2016 Honda Accord that handled like a boat. The front end would dive under hard braking like it was trying to sniff the pavement. Over bumps, it bounced three or four times before settling. The rear tires had a weird wear pattern that looked like someone had taken a bite out of the tread every few inches — classic cupping. He asked me to check the alignment. The alignment was fine. The struts were completely blown.

Four new quick-strut assemblies, an alignment, and $700 later, the car drove like it just rolled off the showroom floor. The cupped tires had to be replaced too (you can't un-cup a tire), so add another $400. That's $1,100 because the struts weren't replaced when they should have been.

Suspension is one of those things that wears out so gradually you don't notice it happening. Then you drive a car with fresh shocks and realize you've been driving a worn-out suspension for 20,000 miles. Let me walk you through what each component does, how to tell when it's worn out, and what it should cost to fix.

---

## Springs: The Foundation (Rarely Fail)

Springs are what actually hold the car up. Without springs, your car would sit on the bump stops with zero suspension travel. Springs support the vehicle weight and determine ride height. There are three types on modern cars:

**Coil springs:** The classic spiral spring, used on the front of most cars (with struts) and the rear of many cars. Coil springs are a steel alloy wound into a helix. They compress under load and return to their original height when unloaded. Coil springs are remarkably durable — they rarely "wear out" in the traditional sense. They can sag after 200,000+ miles, losing maybe half an inch of ride height. But they don't generally fail unless they break (which is rare and usually happens from corrosion in salt-belt states).

**Leaf springs:** Used on trucks, SUVs, and older solid-axle cars (like a Fox-body Mustang). Leaf springs are multiple layers of curved steel (leaves) stacked together. As they compress, the leaves slide against each other, providing both spring action and some inherent damping. Leaf springs can sag with age and heavy use, especially on trucks that haul and tow. A sagged leaf spring drops the rear ride height and reduces load capacity. Replacement leaf springs are $150-300 per side. Adding an "add-a-leaf" kit ($80-120) restores height without replacing the entire spring pack.

**Torsion bars:** Used on some trucks (older Toyota, Nissan, GM) and older Chryslers. A torsion bar is a straight steel bar that twists instead of compressing. One end is fixed to the control arm, the other to the frame. As the suspension moves, the bar twists. Torsion bars can be adjusted to change ride height — turn the adjustment bolt to increase or decrease preload. Torsion bars can fatigue over very high mileage (300,000+) and lose their spring rate, but they rarely fail outright.

**Spring failure signs:** Sagging ride height (one corner visibly lower than the others — a sagged spring, not a bad shock), a broken coil (you'll hear a loud bang when hitting a pothole and the car will drop), or uneven ride height side to side.

**Spring replacement cost:** $80-200 per spring for the part. Labor depends on whether you're using a spring compressor (risky — see safety note below) or replacing the entire strut assembly.

---

## Shocks: The Dampeners (Replace Every 50,000-80,000 Miles)

Shocks don't hold the car up — springs do. Shocks control how fast the spring compresses and rebounds. A shock is a hydraulic cylinder filled with oil (or pressurized gas). When the suspension moves, a piston forces oil through small valves inside the shock. The resistance of the oil flowing through those valves is what dampens the spring's oscillation.

Without shocks, hitting a bump would make the spring bounce up and down repeatedly until friction eventually stopped it. The car would be undrivable — every bump would send it into a bouncing frenzy. The shock converts kinetic energy (motion) into heat (through fluid friction), which is dissipated through the shock body. That's why shocks get warm during driving.

**Gas vs hydraulic:** Gas-charged shocks use pressurized nitrogen gas to prevent the oil from foaming (aeration). When oil foams, the shock loses damping ability because foam compresses differently than liquid. Gas shocks resist fade better during hard driving and large bumps — the gas keeps the oil from aerating. Hydraulic-only shocks (no gas charge) work fine for normal driving but can fade when worked hard (washboard roads, track use). For most drivers, the difference is minor. Gas shocks cost $5-15 more per unit and are the better choice.

**Shock replacement cost:** $30-100 per shock (part only). Labor: $150-400 for a pair installed (1-2 hours for rears, 2-3 hours for fronts if they're separate from the spring).

**Shock location:** On cars with struts in front, the rear suspension often uses separate shocks. On cars with double-wishbone suspension (many Hondas, some luxury cars), all four corners use separate shocks and springs. A shock is always a standalone cylinder with mounts at each end — it doesn't have a spring seat, a steering pivot, or any structural function.

---

## Struts: The All-in-One (Structural + Dampening + Steering)

A strut is a shock absorber that's ALSO a structural suspension component. It combines three functions:

1. **Damping** (like a shock — controls spring oscillation through hydraulic resistance)
2. **Structural support** (the strut is a locating member of the suspension — it positions the wheel relative to the body and carries side loads that a shock would never see)
3. **Steering pivot** (the top of the strut usually incorporates a bearing plate that allows the strut to rotate when you turn the steering wheel)

The spring is mounted ON the strut, around the strut body. The top of the strut bolts to the strut tower in the engine bay or trunk. The bottom bolts to the steering knuckle. When you turn the steering wheel, the entire strut rotates via the upper bearing plate.

**Strut replacement cost:** $80-200 per strut (part only, for a "quick-strut" or loaded strut assembly). $50-120 for a bare strut cartridge (reuse your spring and mount — not recommended for DIY). Labor: $400-800 for a pair installed (3-4 hours for fronts, which require realignment; 2-3 hours for rears).

MacPherson strut suspension is the most common front suspension design on modern cars (virtually all FWD economy cars, most crossovers, many sports cars). If your car is a Honda Civic, Toyota Corolla, Ford Focus, VW Golf, etc., you have struts in front.

---

## Signs of Worn Shocks and Struts

Here's what I look for:

**1. Bouncing after bumps (>2 oscillations).** This is the classic test: push down firmly on each corner of the car and release. The car should come up, go down slightly, and settle. One and a half oscillations. If it bounces more than twice, the shock or strut on that corner is worn. This is called the "bounce test." However, on modern cars with stiff suspension and low-profile tires, the bounce test is less reliable than it used to be. You can't always compress the suspension enough by hand to see the bounce. Don't rely on the bounce test alone for modern cars.

**2. Nose-diving under braking.** When the front of the car dives dramatically when you brake, the front struts are worn. Normal braking causes some forward weight transfer and a slight nose dip. Excessive diving — the nose dropping noticeably and the rear rising — means the front struts aren't controlling spring compression.

**3. Squatting under acceleration.** When the rear of the car squats excessively when you accelerate (more noticeable in RWD cars), the rear shocks or struts are worn. The weight transfer to the rear under acceleration compresses the rear springs too far and too fast because the dampening is gone.

**4. Body roll in corners.** Some body roll is normal. Excessive body roll — the car leaning hard in a turn and feeling like it's going to keep leaning — means worn shocks or struts. Worn dampeners can't control the weight transfer during cornering.

**5. Uneven tire wear (cupping/scalloping).** This is the most definitive sign. Take your hand and run it across the tread surface of the tire (along the circumference, not across). If the tread feels like waves — high spots and low spots — that's cupping. The tire is literally bouncing against the road surface because the shock or strut isn't controlling wheel motion. Each bounce wears a small depression in the tread. Over thousands of miles, you get a scalloped pattern.

Cupping is almost always caused by worn shocks or struts. It is NOT an alignment issue (alignment causes feathering or camber wear, which are different patterns). If your tires are cupped, your shocks or struts are shot AND your tires are ruined. Replace both.

**6. Fluid leaks on the shock or strut body.** Look at the shock or strut body. If there's oil residue, wetness, or a visible drip coming from the seal at the top of the body (where the piston rod enters), the seal has failed. Fluid is escaping. The shock or strut has lost some of its damping ability and will continue to degrade. A light film of oil residue is a sign of early failure (replace soon). A wet, dripping seal means it's already failed (replace now).

**7. Clunking over bumps.** A metallic clunk when you hit a bump could be a completely failed shock or strut (the internal bump stop is being hit because there's no damping), or more commonly, a worn strut mount. The strut mount is the rubber and bearing assembly at the top of the strut that bolts to the body. When it wears, you hear a clunk from the strut tower area when going over bumps. Replace the mount when you replace the strut — it's already apart and the mount has the same mileage.

---

## The Bounce Test: Not Reliable on Modern Cars

I mentioned the bounce test above. Let me be clear: on a 2020+ car with stiff suspension, low-profile tires, and a heavy unibody, you probably can't bounce the corner hard enough by hand to see a meaningful oscillation. This doesn't mean the struts are good. It means the bounce test doesn't work on your car.

Focus on fluid leaks and tire cupping instead. These are objective — either there's oil on the strut body or there isn't. Either the tires are cupped or they're not.

---

## Complete Strut Assemblies (Quick-Struts): Worth the Extra $30

When replacing struts, you have two options:

**Option A: Bare strut cartridge ($50-120).** You reuse the spring, the upper mount, the bearing plate, the boot, and the bump stop. You need a spring compressor to remove the spring from the old strut and install it on the new strut. Spring compressors are dangerous — the spring is under hundreds of pounds of force and if the compressor slips, that spring becomes a projectile at lethal velocity. I've done it dozens of times with a wall-mounted spring compressor in a shop. I won't do it with the rental screw-type compressors from AutoZone in my driveway. Just don't.

**Option B: Complete strut assembly / quick-strut ($80-200).** Everything is pre-assembled — new spring, new strut, new mount, new bearing, new boot, new bump stop. You unbolt the old assembly and bolt in the new one. No spring compressor needed. No risk of a spring taking your face off. The extra $30-60 per strut buys you not just safety but also new springs, new mounts, and new bearings — all of which have the same mileage as the old strut and are probably worn too. It's faster, safer, and gives you a better result.

I recommend quick-struts for every DIYer. The $30 savings isn't worth the risk or the extra time. For shop customers, I recommend them too — the labor time is less (assembly is already done), so the total cost difference is minimal despite the higher part price.

---

## Alignment Required After Strut Replacement

When you replace a strut, the mounting position of the suspension changes slightly. The new strut is positioned slightly differently from the old one (manufacturing tolerances), and the old strut's wear had already settled into a particular alignment angle. After replacement, a wheel alignment is mandatory. Not optional. If you skip the alignment:
- The car may pull to one side.
- The steering wheel may be off-center.
- The tires will wear unevenly and rapidly (feathering on the edges).
- Any warranty on the new struts is voided.

Alignment costs $80-120 at a shop. Factor this into your budget before you start the job. Don't replace struts on a Saturday afternoon and then drive around for two weeks with a crooked steering wheel "until I can get it aligned." Get it aligned immediately.

---

## Cost Summary

| Component | Part Cost (Each) | Labor (Pair) | When to Replace |
|---|---|---|---|
| Shock (rear) | $30-100 | $150-400 | 50,000-80,000 miles |
| Bare strut cartridge | $50-120 | — | 60,000-100,000 miles |
| Quick-strut assembly | $80-200 | $400-800 | 60,000-100,000 miles |
| Strut mount (if reusing strut) | $40-80 | Included with strut labor | Replace WITH strut |
| Coil spring | $80-200 | Included with strut labor | Only if broken or sagged |
| Leaf spring | $150-300 (per side) | $300-600 | Only if sagged or broken |
| Alignment | $80-120 (flat rate) | — | After any strut replacement |

---

## The Bottom Line

Springs hold the car up. They rarely fail. Shocks dampen spring movement. They wear out every 50,000-80,000 miles. Struts are structural members that combine spring, shock, and steering pivot. They wear out every 60,000-100,000 miles.

Signs of failure: bouncing after bumps, nose-diving under braking, cupped tires (the definitive sign), and fluid leaks on the strut/shock body. Don't rely on the bounce test for modern cars. Look for fluid leaks and tire wear.

If you're replacing struts, buy complete quick-strut assemblies. The extra $30 is worth avoiding the spring compressor — which can kill you. And get an alignment immediately after. No exceptions.

Got suspension questions for your specific car? Post your year, make, model, mileage, and what symptoms you're experiencing. I'll tell you what's likely worn and what it should cost.

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
