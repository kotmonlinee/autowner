// Publish 3 more 老李 articles (batch 6)
// Run: npx tsx scripts/lao-li-articles-6.ts
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
    category_slug: "detailing",
    title: "DIY Dent Repair: Paintless Dent Removal Techniques That Actually Work",
    body: `I've pulled hundreds of dents out of customer cars over the years. Paintless Dent Removal — PDR — is one of those things that looks like absolute magic when a pro does it. A tech with a few metal rods and a heat gun makes a golf-ball-sized dent disappear in 20 minutes, and you can't tell anything was ever there. The good news for you: a lot of PDR techniques are accessible to a careful DIYer with the right tools and a realistic understanding of what can and can't be fixed at home.

But I want to be straight with you up front: PDR has limits. Knowing what you CAN fix and what you CAN'T is the difference between a satisfying repair and a ruined panel. Let me walk you through exactly what works, what doesn't, and how to do the techniques that are DIY-friendly.

---

## When PDR Works (And When It Doesn't)

Before you buy any tools or touch your car, evaluate the dent against these criteria. If it checks all four boxes, PDR — DIY or pro — will work. If it fails any one of them, stop and reassess.

**The four requirements for PDR:**

1. **Shallow dent — no creased metal.** The dent should be a smooth depression, like someone leaned against the panel or a shopping cart bumped it. The metal is stretched but not folded. If the metal has a sharp crease (like someone hit it with the edge of a door), the metal is permanently deformed. PDR can improve a crease but will rarely make it invisible. Creased panels usually need traditional bodywork: fill, sand, paint.

2. **No paint damage.** PDR works because the paint flexes with the metal. Modern automotive paint — especially factory paint — is remarkably flexible. It can stretch and return without cracking. But if the paint is scratched through, chipped, or cracked at the dent site, pushing the metal back will expose the damaged paint. You'll need a paint touch-up at minimum, which means you're out of "paintless" territory. Check the dent carefully under good light. Run your fingernail across it. If your nail catches on a scratch, the paint is compromised.

3. **Panel access from behind.** You need to get a tool behind the dent to push it out. On doors, you can usually go in through the window channel, a wiring harness grommet, or by removing the interior door panel. On quarter panels, you might need to remove the trunk liner. On hoods and roofs, you may or may not have access — many have double-wall construction with structural bracing that blocks tool access. Roofs with sunroofs are the worst: the sunroof cassette takes up all the space. If you can't get behind the dent, you can't push it out from behind — you're limited to glue pulling.

4. **Not on a panel edge.** Dents on the edge of a door, hood, or fender — where the metal wraps around and is folded over — are extremely difficult. The metal is work-hardened from the factory fold, and there's usually seam sealer and folded layers that prevent access. Edge dents are professional territory. Don't try them as your first PDR attempt.

**The acid test:** If the dent is on a flat or gently curved surface (door skin, fender, quarter panel, hood center), is shallow (no crease), has intact paint, and you can access the back side — you have a strong candidate for DIY PDR.

---

## Technique 1: Heat Gun + Compressed Air (For Plastic Bumpers Only)

This is the one everyone's seen on YouTube: you heat up a dented plastic bumper with a heat gun, then spray it with canned air (held upside down so the liquid propellant comes out freezing cold), and *pop* — the dent jumps back out. It looks like sorcery. Here's the reality: this works on plastic bumpers, not on metal panels.

**Why it works:** Plastic bumpers have "memory." The polymer chains want to return to their original shape. The heat softens the plastic, reducing its rigidity. The rapid cooling from the compressed air creates thermal contraction — the plastic shrinks quickly and snaps back to its molded shape. The temperature shock is what triggers the pop.

**How to do it:**
1. Heat the dented area with a heat gun on medium (not high — you can bubble the paint) held about 6 inches away. Keep the gun moving in circles. Heat for 30-60 seconds until the bumper is warm to the touch but not too hot to hold your hand on.
2. Turn the can of compressed air upside down and spray the dented area. The liquid propellant will come out and instantly freeze on contact. The dent should pop out — sometimes instantly, sometimes it takes 2-3 heat-cool cycles.
3. If it doesn't pop on the first try, reheat and try again. Some stubborn dents take 4-5 cycles.
4. Once the dent pops, you may have a slight wave or unevenness. This is normal — plastic has memory but not perfect memory. Often the remaining imperfection is barely visible.

**What this does NOT work on:** Metal panels. Steel and aluminum don't have the same thermal memory as plastic. Heating a metal door dent and spraying it with cold air does nothing useful. The metal expands when heated and contracts when cooled, but it doesn't "remember" its pre-dent shape the way plastic does. Don't waste your time trying this on a metal door ding.

**Cost:** Heat gun ($20 at Harbor Freight), canned air ($5 at any office supply store). Basically free if you already own a heat gun.

---

## Technique 2: Glue Pull Kit ($25, Works on Door Dings)

Glue pulling is the most accessible DIY PDR method because it doesn't require behind-panel access. You glue a pulling tab to the outside of the dent and pull the dent outward. No disassembly, no climbing inside panels.

**The principle:** Hot glue bonds a plastic pulling tab to the paint surface. You attach a slide hammer or puller to the tab and give it a series of firm tugs. Each tug lifts the dent slightly. You repeat the process — glue a tab, pull, release the tab with alcohol — until the dent is flush. The glue releases cleanly from the clear coat with isopropyl alcohol.

**What you need:**
- A glue pull kit ($25-40 on Amazon — look for one with a bridge-style puller, not just a slide hammer; the bridge gives you more control)
- Hot glue sticks (the yellow PDR-specific sticks that come with the kit — don't use craft glue sticks, they're too weak)
- Isopropyl alcohol (91% or higher) in a spray bottle
- A plastic scraper or old credit card (for releasing tabs)

**Success rate:** About 70% on shallow door dings. The technique works best on smooth, shallow depressions in the middle of a panel. It struggles with deep dings (more than about 1/8 inch deep), dings on body lines (the crease fights back), and dings near panel edges (the metal is stiffer there).

**How to do it:**
1. Clean the dent area thoroughly with isopropyl alcohol. The surface must be perfectly clean for the glue to bond. Any wax, sealant, or dirt will cause the tab to pop off mid-pull.
2. Choose the right size pulling tab. Use a smaller tab for small dings, larger tab for larger dents. The tab should be slightly smaller than the dent.
3. Heat your glue gun. Apply a generous blob of glue to the tab and press it firmly onto the center of the dent. Hold it in place for 30-60 seconds until the glue sets (turns from clear to cloudy).
4. Attach the bridge puller over the tab. Thread the puller's screw into the tab. Slowly tighten the screw to apply pulling force. You're looking to pull the dent slightly PAST flush — about 1mm higher than the surrounding metal. The metal has memory and will relax back slightly when you release.
5. While the tab is under tension, use the tip of your finger (or a plastic knockdown tool if your kit has one) to tap lightly around the high spot created by the pull. This "relaxes" the stretched metal and helps it settle evenly.
6. Release the tension. Spray the tab with isopropyl alcohol to weaken the glue bond. Twist the tab gently to remove it. The glue should release cleanly.
7. Inspect your progress. You'll rarely get it perfect on the first pull. Glue a new tab to any remaining low spot and pull again. It often takes 3-5 pulls to level a ding.
8. When the dent is flush or nearly flush (within 0.5mm), stop. The last little bit of imperfection will often be invisible once you're not staring at it from 6 inches away.

**The big mistake:** Pulling too hard. If you reef on the tab with maximum force, you can pull the dent INTO a high spot — a pimple instead of a dimple. A pulled-too-high spot is harder to fix than the original dent because now you need to push it back down. Gentle, incremental pulls. This is not a contest of strength.

**Pro costs for comparison:** A PDR tech charges $75-200 per dent depending on size, location, and accessibility. Door dings are on the low end. Large hood dents are on the high end. A quarter-sized door ding that a PDR tech fixes in 15 minutes costs you $75-100. Your $25 glue pull kit potentially pays for itself on the first dent.

---

## Technique 3: Behind-Panel Access with Pry Tools (Best Results, More Work)

This is how the pros do it: they go in behind the panel with specialized metal rods and pry bars, applying precise pressure to push the dent out from the inside. The results are dramatically better than glue pulling — a skilled PDR tech can remove a dent so perfectly you literally cannot find where it was. But it requires panel disassembly and a level of feel that takes practice.

**What you need:**
- A PDR rod set ($40-80 on Amazon — you want rods with different bends and tips for different access angles)
- A PDR light board or reflection board ($30-50 — this is NOT optional; you can't see what you're doing without one)
- Interior panel removal tools ($10-15)
- Patience. Lots of patience.

**The reflection board is critical.** A PDR tech doesn't look at the dent directly — they look at the reflection of a lined board in the paint. The lines in the reflection distort around the dent, showing you exactly where the low and high spots are. Without a reflection board, you're working blind. Even with the board, learning to read the reflection takes practice. Start on an inconspicuous area or a practice panel if you have one.

**How to do it:**
1. Remove whatever interior trim, liner, or panel is blocking access. On a door: remove the interior door panel, peel back the moisture barrier (the plastic sheet glued to the door — you can re-glue it later with butyl tape). On a quarter panel: remove the trunk side liner. On a hood: you may need to remove the under-hood insulation pad.
2. Find the back side of the dent. Use a flashlight to confirm you're in the right spot. You should be able to feel the low spot with your finger through the access hole.
3. Select a PDR rod with a tip that matches the dent size and an angle that reaches the dent through your access point. The tip should contact the center of the dent.
4. Position your reflection board so the dent is visible in the reflection.
5. Apply GENTLE pressure from behind. You're not trying to push the dent out in one shove. You're working the metal back incrementally — push, check the reflection, push a little more, check again. The goal is to bring the dent up slightly past flush (about 0.5mm high), then use a knockdown tool from the front to tap the high spot back down to level.
6. Work from the outside of the dent inward — push up the edges first, then the center. If you push the center first, you create a high spot in the middle with a ring of low metal around it, which is harder to fix.
7. Alternate between pushing from behind and tapping from the front with a knockdown tool. The tapping relieves stress in the stretched metal and helps it settle flat.

**The learning curve is real.** Your first dent will not look perfect. Your fifth dent will look better. Your twentieth dent will start to look professional. This is a skill, not a hack. If you have a very visible dent on a car you care about, either practice on a junkyard panel first or pay the pro $75-200. The tools cost $70-130 for a decent starter setup, which is roughly the cost of having one professional dent removed. If you plan to do this more than once, the tools pay for themselves.

---

## When to Pay the Pro (And When Not To)

**Pay the pro when:**
- The dent is on a crease or body line (PDR on creases is expert-level)
- The paint is cracked or chipped (you need traditional bodywork anyway)
- The dent is on a panel edge (hood edge, door edge, fender arch)
- The dent is larger than a golf ball (large dents require metal shrinking, which is advanced)
- The car is a lease return and you need it perfect (the pro's work is backed by a guarantee)
- The dent is on the roof and there's no access (headliner removal is a major job)

**Try DIY when:**
- It's a shallow door ding (shopping cart, other car door) with intact paint and the dent is smooth
- The dent is on a plastic bumper (heat gun + compressed air trick is free to try)
- You have behind-panel access (door panels are easy to remove; most take 10 minutes)
- You're willing to accept "much better but not absolutely perfect" as the outcome
- You own multiple cars or have dents that happen regularly (the tools pay for themselves quickly)

---

## Cost Summary

| Method | Tool Cost | Learning Curve | Success Rate (Door Dings) | Best For |
|---|---|---|---|---|
| Heat gun + compressed air | $20-25 | Minimal | ~80% on plastic bumpers | Plastic bumper dents only |
| Glue pull kit | $25-40 | Low | ~70% on shallow dings | Shallow door dings, no access needed |
| PDR rods + reflection board | $70-130 | High | ~90% with practice | Any accessible dent, best results |
| Pro PDR tech | $75-200/dent | None needed | ~99% | Anything you want perfect |

---

## The Bottom Line

PDR is not magic — it's physics and patience. The metal wants to return to its original shape, and your job is to help it get there without making things worse. For shallow door dings on accessible panels, a $25 glue pull kit will fix about 70% of what you encounter. For plastic bumper dents, try the heat gun and compressed air trick — it's free if you have the tools and it works surprisingly well. For everything else, either invest in the full PDR rod setup and practice on something you don't care about, or pay the pro $75-200 and get it perfect.

One last thing: if you try a technique and the dent isn't improving after 15 minutes, STOP. You're not going to magically figure it out on minute 16. You're more likely to overwork the metal and make it worse. Set the tools down, watch some more YouTube videos on your specific dent type, and try again tomorrow with fresh eyes.

Got a dent you're trying to decide what to do about? Post your car's year, make, model, a photo of the dent, and tell me if the paint is damaged. I'll tell you whether PDR will work and which approach to take.

*— 老李 (Li), ASE Certified Master Technician, 15 years in dealerships and independent shops*`,
  },
  {
    category_slug: "diy-guides",
    title: "CV Boot Replacement: The $15 Fix That Saves You a $500 Axle",
    body: `There's a $15 rubber boot on your car that, if you catch it early enough, will save you $500 in parts and labor. It's called the CV boot — Constant Velocity boot — and when it tears, it's a ticking clock. Literally.

I want to explain what a CV boot does, how to spot a torn one before it takes out your axle, and walk you through replacing just the boot instead of the entire half-shaft. This is one of the highest-leverage DIY repairs in terms of money saved versus difficulty. Two to three hours of work saves you $300-500 at a shop. The part is $15.

---

## What a CV Boot Does (And Why It Matters)

A CV joint — Constant Velocity joint — is what allows your front wheels (or all four on AWD) to receive power from the transmission while turning and moving up and down with the suspension. Unlike a universal joint (which binds and vibrates at angles), a CV joint transmits power smoothly at any steering angle and any suspension position. It's a brilliant piece of engineering: a set of ball bearings running in precision-ground grooves inside a housing, packed with special high-pressure grease.

The CV boot is a rubber (or sometimes thermoplastic) accordion-like cover that seals the joint. Its job is simple but critical: keep the CV grease IN and keep dirt, water, and road grit OUT. That grease is not regular bearing grease — it's molybdenum disulfide grease, a black, sticky, high-pressure lubricant specifically formulated for the extreme pressures inside a CV joint. If the grease stays in and the dirt stays out, a CV joint will last the life of the car. If the boot tears and dirt gets in, the joint is doomed.

---

## Symptoms of a Torn CV Boot

**Visible grease splatter.** This is the number one sign and it's easy to spot. Look at the inner side of each front wheel, the suspension components, the brake caliper, and the inside of the wheel well. If you see black or dark gray grease splattered in a radial pattern — like someone spun a paintbrush loaded with grease — you have a torn CV boot. The grease is flung outward by centrifugal force as the axle spins.

The location of the grease tells you which boot is torn:
- Grease on the wheel, brake caliper, and suspension near the wheel = outer CV boot is torn (the one at the wheel end of the axle).
- Grease on the transmission case, subframe, or inner fender near the transmission = inner CV boot is torn (the one at the transmission end of the axle).

Outer boots tear more often than inner boots because they're subjected to more movement (steering angle + suspension movement) and they're closer to road debris. But inner boots tear too, especially if the car has high miles or the boots are aged.

**Grease on the ground?** If you see a puddle of thick black grease under your car near a wheel, the boot is completely torn wide open and most of the grease has already been flung out. Don't drive the car until you inspect it. A dry CV joint will destroy itself in a few hundred miles.

---

## The Sound That Means You're Too Late

Here's the sound you never want to hear: a rhythmic clicking, ticking, or popping noise when you turn the steering wheel and accelerate. It's most obvious in a tight turn at low speed — pulling out of a parking space, making a U-turn, going around a corner from a stop. Click-click-click-click that speeds up as the wheel turns faster.

That sound is the CV joint crying for help. Specifically, it's the balls inside the outer CV joint skipping across worn grooves in the housing. When the boot tears and dirt gets in, the precision-ground surfaces inside the joint are abraded. The grooves that the ball bearings travel in become pitted and rough. Instead of rolling smoothly, the balls skip, and you hear a click each time one skips.

**If you hear this clicking, replacing just the boot is too late.** The joint is already damaged. The clicking will get progressively louder over the next few hundred to few thousand miles, and eventually the joint will fail catastrophically — meaning the axle will stop transmitting power and the car won't move. You don't want that to happen on a highway.

If you hear the clicking, replace the entire half-shaft (axle assembly). A remanufactured half-shaft is $80-200 (depending on the car) and the labor is essentially the same as replacing just the boot. Don't spend 2-3 hours putting a new boot on a damaged joint — the clicking will remain and the joint will fail.

**If there's no clicking but you see grease**, the joint may still be healthy. Replace the boot NOW, before dirt contamination progresses to the point of joint damage. This is the window of opportunity. Catch it in this window and the $15 boot saves you the $80-200 axle plus the same labor.

---

## Replace Just the Boot or the Whole Axle?

| Scenario | Fix | Part Cost | Labor |
|---|---|---|---|
| Torn boot, no clicking, clean grease still visible in the joint | Replace the boot | $15-30 (boot kit) | 2-3 hours |
| Torn boot, no clicking, but joint is dry (all grease flung out) | Replace the axle (joint may already have dirt damage) | $80-200 (reman axle) | 2-3 hours |
| Torn boot, clicking when turning | Replace the axle (joint is damaged beyond saving) | $80-200 (reman axle) | 2-3 hours |
| No torn boot, but clicking when turning | CV joint wear from high mileage — replace axle | $80-200 (reman axle) | 2-3 hours |

**The key insight:** The labor is the same whether you replace just the boot or the whole axle. The decision is purely about the condition of the joint. If the joint is good, the boot is $15. If the joint is bad, don't waste your time on the boot.

---

## Step-by-Step: CV Boot Replacement

Here's the process for a typical front-wheel-drive car with an outer CV boot torn. I'll note where different cars vary.

**Tools you'll need:**
- Axle nut socket — usually 32mm or 36mm, 12-point (check your car's spec before buying)
- 1/2-inch breaker bar, at least 24 inches long (the axle nut is torqued to 180-240 lb-ft — a regular ratchet won't cut it)
- Torque wrench capable of 200+ lb-ft
- Jack and jack stands (safety first — see my jack and jack stands guide)
- Basic metric socket set (10mm-19mm)
- Ball joint separator or pickle fork ($15 at any auto parts store)
- CV boot clamp pliers ($15 on Amazon — regular pliers won't crimp CV boot clamps properly)
- Snap ring pliers (for the snap ring that holds the CV joint on the axle shaft)
- Dead blow hammer or rubber mallet
- Brass drift or punch (for tapping the CV joint off the axle shaft without damaging it)
- New CV boot kit — includes the rubber boot, two new clamps, and a packet of CV grease
- Brake cleaner (for cleaning the joint)
- Shop rags (you'll use a lot)
- Nitrile gloves (CV grease is messy and stains everything it touches)

**Estimated time:** 2-3 hours for one outer boot (first time). 1-1.5 hours once you've done it before.

---

### Step 1: Break the Axle Nut Loose (Do This FIRST, With the Car on the Ground)

This is the most important step and the one that trips up beginners. The axle nut is torqued to 180-240 lb-ft from the factory. You cannot break it loose with the car in the air because the wheel will just spin. You need the weight of the car on the tire to hold everything still.

1. With the car on the ground, remove the center cap from the wheel (or the entire wheel if necessary to access the nut). On some cars, the center cap pops out with a flathead screwdriver. On others, you need to remove the wheel first (in which case, break the lug nuts loose with the car on the ground, jack it up, remove the wheel, put the car back on the ground on the brake rotor — but DON'T do this if the rotor will touch the ground and get damaged; put a wood block under it or just skip to using the breaker bar with the wheel on).
2. Un-stake the axle nut. Most axle nuts have a staked (crimped) portion that locks into a groove on the axle to prevent the nut from loosening. Use a punch or flathead screwdriver to pry this staked section out of the groove.
3. Put your 32mm or 36mm socket on the nut. Attach the breaker bar. If you have a pipe that fits over the breaker bar handle, use it for extra leverage. A 24-inch breaker bar with a 3-foot pipe extension gives you enormous torque. Put your weight into it. The nut WILL break loose — it just takes force.
4. Once it's broken loose, thread it off by hand and set it aside. Do NOT lose the washer behind the nut if your car uses one.

If the nut absolutely won't budge (rusted, seized, 15 years of northeast winters), heat the nut with a torch for 30-60 seconds. The thermal expansion will break the rust bond. Wear eye protection. Don't set the car on fire.

---

### Step 2: Jack Up the Car and Remove the Wheel

Standard procedure: jack up the corner, place a jack stand, remove the wheel. If you haven't read my jack and jack stands guide yet, go read it before you put this car in the air. I'll wait.

---

### Step 3: Separate the Ball Joint

To get the axle out, you need to free the steering knuckle from the lower control arm. The exact method varies by car:

**Most common:** Remove the nut and bolt that pinches the lower ball joint into the steering knuckle. The ball joint stud passes through the knuckle and is clamped by a pinch bolt. Remove the bolt, spread the knuckle's pinch gap slightly with a pry bar or chisel, and the ball joint stud will pop free.

**Press-fit ball joint:** Some cars (many Hondas) use a ball joint pressed into the control arm with the stud passing through the knuckle and secured by a castle nut. Remove the cotter pin, remove the castle nut, and use a ball joint separator (pickle fork) to pop the tapered stud out of the knuckle. A pickle fork will destroy the ball joint boot, so if you're using a pickle fork, plan on replacing the ball joint too ($30-50).

**Two-bolt ball joint:** Some cars have a ball joint that bolts to the control arm with two or three bolts. Remove the bolts, and the ball joint comes free with the knuckle.

Once the ball joint is separated, you can swing the steering knuckle outward, which gives you enough room to pull the axle out of the wheel hub.

---

### Step 4: Remove the Axle

1. Push the axle inward through the hub. If it's stuck (common on cars with rust), thread the axle nut back on a few turns (to protect the threads) and tap it with a dead blow hammer. Don't wail on it — gentle taps. If it's really stuck, use a hub puller tool (rentable from AutoZone for free with their loan-a-tool program).
2. Once the axle is free from the hub, pull it outward. On the transmission side, the inner CV joint is held in by a circlip. A firm pull on the axle should pop it out of the transmission. If it's stuck, use a pry bar between the inner CV joint housing and the transmission case — but be gentle; the transmission case is aluminum and you can crack it.
3. Once both ends are free, remove the axle from the car. Be careful not to let the inner CV joint over-extend and come apart. Some axles can be set on the ground with the inner joint at a steep angle and they'll separate. Hold the axle horizontally or set it on a clean surface.

---

### Step 5: Remove the Old Boot and Inspect the Joint

1. Cut off the old boot clamps with diagonal cutters. Peel the old boot back or cut it off.
2. Wipe away as much old grease as you can with shop rags. It's going to be messy. The grease gets everywhere. Embrace it.
3. Remove the outer CV joint from the axle shaft. There's a snap ring (circlip) on the end of the axle shaft that retains the joint. Use snap ring pliers to remove it. Then the joint should slide off the shaft. Sometimes it needs a few taps with a brass drift and hammer — hit the INNER race of the joint (the part that slides over the shaft), not the outer housing.
4. Clean the joint thoroughly with brake cleaner. Spray inside every groove. Flush out all the old grease and any dirt that may have entered. Let it dry completely.
5. Inspect the grooves and the ball bearings. The surfaces should be smooth and shiny, with no pitting, roughness, or discoloration. Run your fingernail over the grooves — if it catches on any roughness, the joint has begun to wear. At this point, you need to decide: is the joint good enough to re-boot, or should you replace the axle?

If the joint surfaces are smooth and clean, you're in the clear. Re-grease and re-boot.

---

### Step 6: Install the New Boot and Grease

1. Slide the new small clamp onto the axle shaft first (the end closest to the transmission). Then slide the new boot onto the shaft — narrow end toward the transmission, wide end toward the wheel. Push it far enough down the shaft that it's out of the way.
2. Reinstall the CV joint onto the axle shaft. Make sure the snap ring is fully seated in its groove. Give it a tug to confirm it's locked on.
3. Pack the joint with the new CV grease. The kit will include a packet of molybdenum disulfide grease — use ALL of it. Don't be stingy. The joint needs to be completely filled. Work the grease into the joint by rotating and articulating it.
4. Pull the boot over the joint housing. The wide end of the boot seats in a groove on the CV joint housing. Make sure the boot lip is fully seated.
5. Before crimping the clamps, push a small flathead screwdriver under the boot lip to "burp" any trapped air. A sealed boot with trapped air will balloon when it heats up during driving, which can pull the boot off the housing. Release the air, then seat the boot lip.
6. Crimp the new clamps using CV boot clamp pliers. Regular pliers will not work — the clamp needs to be crimped evenly and tightly. The CV boot clamp pliers have a special jaw that crimps the clamp correctly. Tighten the clamp until it's snug in its groove — it should not be able to rotate or slide.
7. Repeat for the small clamp on the inner end of the boot.

---

### Step 7: Reinstall the Axle

1. Clean the splines on both ends of the axle with a wire brush. Apply a thin film of grease or anti-seize to the splines (this prevents future rust-seizure and makes the next removal easier).
2. Insert the inner CV joint into the transmission. Line up the splines and push firmly until you feel the circlip click into place. Give it a tug outward — it should be locked in. If it slides back out, the circlip didn't seat. Wiggle and push again.
3. Guide the outer CV joint through the wheel hub. Pull the steering knuckle into position.
4. Reattach the ball joint to the steering knuckle. Install the pinch bolt or castle nut (use a new cotter pin if it's a castle nut). Torque to spec — usually 40-60 lb-ft for the pinch bolt, higher for a castle nut (check your car).
5. Install the new axle nut. Thread it on by hand first to make sure you're not cross-threading. Torque to spec — usually 180-240 lb-ft depending on the car. Do NOT use an impact gun for final torque. Use a torque wrench.
6. Stake the new axle nut. Most axle nuts have a portion designed to be staked into the axle groove. Use a punch to deform the nut lip into the groove. This is a safety-critical step — an unstaked axle nut can back off, and then your wheel falls off.
7. Reinstall the wheel and torque the lug nuts to spec in a star pattern.
8. Lower the car to the ground.

---

### Step 8: Check Transmission Fluid

When you remove the axle, some transmission fluid may leak out (especially on the driver's side where the axle is often shorter and the transmission fluid level is higher). Check your transmission fluid level after the job. If your car has an automatic transmission with a dipstick, check it warm, engine running, in Park. If it's a manual transmission, there's usually a fill plug on the side of the transmission — fluid should be level with the bottom of the fill hole.

Top off as needed. The amount lost is usually small — a few ounces — but check anyway.

---

## Cost Breakdown

| Item | Cost |
|---|---|
| CV boot kit (includes grease, clamps, boot) | $15-30 |
| CV boot clamp pliers | $15-20 |
| Axle nut socket (32mm or 36mm) | $10-15 |
| Ball joint separator (if needed) | $15-25 |
| Brake cleaner | $5 |
| **DIY Total (first time with tools)** | **$60-95** |
| **DIY Total (have the tools already)** | **$20-35** |
| **Shop cost (outer boot only)** | **$250-400** |
| **Shop cost (full axle replacement)** | **$400-800** |

The CV boot clamp pliers and axle nut socket are tools you'll use again. Every FWD car needs this repair at some point. The tools pay for themselves on the first job.

---

## Common Mistakes

**Not breaking the axle nut loose with the car on the ground.** If you jack the car up first, the wheel spins freely and you can't get the nut off. You'll fight it for 20 minutes, then put the car back on the ground and break it loose in 20 seconds.

**Using the wrong clamp pliers.** Regular pliers don't produce tight, even clamping force on a CV boot clamp. You'll get a loose clamp that leaks grease. The $15 clamp pliers are not optional.

**Not burping the boot.** Trapped air expands when hot and can push the boot off the housing. You'll have grease everywhere within a week and be doing the job again.

**Re-booting a clicking joint.** If the joint was clicking, the damage is done. Replace the axle. The $150 for a reman axle is cheaper than doing the boot job twice.

**Not staking the axle nut.** An un-staked nut can back off. The consequences are... severe. Stake the nut.

---

## The Bottom Line

A torn CV boot is the best kind of problem to catch early: it's cheap to fix ($15 part), the joint is still healthy, and you avoid the much more expensive axle replacement down the road. The repair takes 2-3 hours the first time, and 90% of the difficulty is just getting the axle nut off and the ball joint apart. The actual boot replacement — cutting off the old one, cleaning, regreasing, clamping the new one — takes 20 minutes.

Check your CV boots every time you have the wheels off for a brake job or tire rotation. Look for grease splatter on the inside of the wheel and suspension. If you see it, act fast. The $15 fix window is open, but it won't stay open forever.

Got a CV boot question for your specific car? Post your year, make, model, and whether you're hearing clicking when you turn. I'll tell you whether you need a boot or a whole axle, and what to expect for your car.

*— 老李 (Li), ASE Certified Master Technician, 15 years in dealerships and independent shops*`,
  },
  {
    category_slug: "maintenance",
    title: "How to Read Your Tire Sidewall: Decoding the Numbers and Letters",
    body: `Walk up to any car and look at the tires. You'll see something like "P215/55R17 93V" followed by a bunch of other numbers and codes. Most people ignore them. That's a mistake. Every piece of information on your tire's sidewall is there for a reason, and understanding it tells you what the tire is capable of, when it was made, and whether it's the right tire for your car.

I've seen people mix incompatible tire types on the same axle, run tires that were 8 years old and dangerously dry-rotted, and mount tires with the wrong load rating for their truck. All of these are safety risks. Reading a sidewall takes 30 seconds and prevents all of them.

Let me decode every marking on a modern passenger tire sidewall, from the basic size to the DOT date code to the UTQG ratings that the tire companies don't really want you to understand.

---

## The Size: P215/55R17 93V

This is the most prominent marking on the tire and the one you need to match when buying replacements. Let's go character by character.

**P = Passenger (P-Metric)**
The "P" designates a P-Metric tire, which means it's designed for passenger vehicles (cars, minivans, small SUVs, light-duty pickups). P-Metric is the North American standard.

Other letters you might see:
- **LT** = Light Truck. These tires have stiffer sidewalls, higher load ratings, and heavier construction for trucks and full-size SUVs that carry heavy loads or tow. LT tires run at higher pressures (50-80 PSI) than P-Metric tires (typically 30-44 PSI). Never mix P-Metric and LT tires on the same vehicle.
- **ST** = Special Trailer. Tires designed specifically for trailers. They have stiffer sidewalls to resist swaying. Never use ST tires on a passenger vehicle — they're not designed for driven axles or steering.
- **T** = Temporary Spare. The donut spare in your trunk. Speed-rated for 50 mph max.
- **No letter** = Euro-Metric. Common on European cars. The sizing is essentially the same as P-Metric but the load rating is calculated slightly differently. For most practical purposes, a Euro-Metric and P-Metric of the same size are interchangeable — but match what your car came with.

**215 = Section Width (millimeters)**
This is the tire's width from sidewall to sidewall, measured in millimeters. 215 means the tire is 215mm wide, which is about 8.5 inches. Note that this is the SECTION width (the widest point of the tire, typically at the middle of the sidewall), not the tread width. The tread width is slightly narrower — usually about 70-80% of the section width.

A wider tire (larger first number) puts more rubber on the road, which generally improves dry grip and cornering but increases rolling resistance (lower MPG), adds weight, and can be worse in snow and rain (wider tires "float" on snow and hydroplane more easily on water). There's a sweet spot for every car. Stick with the OEM size unless you know why you're changing.

**55 = Aspect Ratio (percentage)**
This is the tire's profile — the height of the sidewall expressed as a percentage of the section width. A 55-series tire has a sidewall height equal to 55% of its width. For a 215mm wide tire, the sidewall height is 215 × 0.55 = 118.25mm (about 4.7 inches).

Lower aspect ratios (40, 45, 50) = shorter sidewalls = sharper steering response, better cornering, harsher ride, more vulnerable to pothole damage. Sporty cars and modern sedans typically run 40-55 series tires.
Higher aspect ratios (60, 65, 70, 75) = taller sidewalls = more ride comfort, better pothole protection, softer steering response. Trucks, SUVs, and older cars typically run 65-75 series tires.

**R = Radial Construction**
This means the tire's internal cord plies run radially — perpendicular to the direction of travel across the tread, then parallel to each other along the sidewall. Radial tires have been standard on all passenger vehicles since the 1980s. A "D" or "-" instead of "R" means diagonal (bias-ply) construction, which you'll only see on vintage cars, some trailer tires, and agricultural equipment. If your car has "D" tires, someone put the wrong tires on it.

Radial tires run cooler, last longer, and provide better fuel economy than bias-ply. They also have more flexible sidewalls, which is why radial tires look slightly "bulged" at the bottom where they contact the ground — that's normal and designed.

**17 = Wheel Diameter (inches)**
The diameter of the wheel the tire is designed to fit, measured in inches. A 17-inch tire fits a 17-inch wheel. This is non-negotiable — a 17-inch tire will not fit on a 16-inch or 18-inch wheel, period. The tire and wheel diameters must match exactly.

**93 = Load Index**
This is a numerical code that corresponds to the maximum weight the tire can support when inflated to its maximum pressure. 93 corresponds to 1,433 pounds (650 kg) per tire. A set of four tires with load index 93 can support a vehicle weighing up to about 5,732 pounds (assuming even weight distribution — which is never the case, but it's the rating).

Common load index values:
- 87 = 1,201 lbs (compact cars)
- 91 = 1,356 lbs (mid-size sedans)
- 93 = 1,433 lbs (full-size sedans, small crossovers)
- 97 = 1,609 lbs (minivans, crossovers)
- 103 = 1,929 lbs (half-ton trucks)
- 111 = 2,403 lbs (3/4-ton trucks)
- 121 = 3,197 lbs (1-ton trucks, heavy trailers)

**Never replace a tire with one that has a LOWER load index than the vehicle manufacturer specifies.** The load index is on the tire placard in your driver's door jamb. If the placard says 93, don't buy a 91 — even if the size is the same. The tire won't safely support the vehicle's weight when loaded. Going higher is fine (a 97 on a car that requires 93) — the tire is stronger than needed, which is safe.

**V = Speed Rating**
The maximum sustained speed the tire is designed to handle. V rating = 149 mph (240 km/h).

Common speed ratings:
- Q = 99 mph (winter tires, some truck tires)
- S = 112 mph (economy car tires, some all-seasons)
- T = 118 mph (standard passenger car all-seasons)
- H = 130 mph (performance all-seasons, many OEM fitments)
- V = 149 mph (performance tires, many sport sedans)
- W = 168 mph (high-performance summer tires)
- Y = 186 mph (extreme performance tires)
- (Y) = 186+ mph (exotic car tires)

**You can always use a tire with a HIGHER speed rating than the vehicle manufacturer requires.** A V-rated tire on a car that came with H-rated tires is perfectly fine — it's a better tire, not a mismatch. Never use a lower speed rating than specified. The speed rating is on the door jamb placard.

Speed rating also correlates with handling performance: higher speed-rated tires generally have stiffer sidewalls, higher-grip tread compounds, and better heat resistance. They also tend to wear faster (softer compounds) and ride harsher (stiffer sidewalls).

---

## The DOT Code: When Was This Tire Actually Made?

Every tire sold in the US has a Department of Transportation (DOT) code molded into the sidewall. It's a string like "DOT U2LL LMLR 2524." The important part is the last four digits.

**First two characters** = Plant code. Identifies the specific factory where the tire was manufactured. Interesting but not relevant to you as a consumer.

**Various middle characters** = Manufacturer's internal size and construction codes.

**Last four digits** = The date of manufacture. This is the most important piece of information on the tire after the size. "2524" means the tire was manufactured in the 25th week of 2024 — roughly late June 2024.

Before 2000, the date code was three digits (e.g., "259" = 25th week of 1999). If you see a three-digit date code, those tires are at least 26 years old and should not be on a road-going vehicle.

**Why the date matters — the 6-year rule:** Tires age even when they're not being driven. The rubber compounds oxidize, the oils that keep the rubber flexible evaporate, and the tire gradually hardens and loses grip. Most tire manufacturers and safety organizations (NHTSA, AAA, Tire Rack) recommend replacing tires when they reach 6-10 years of age, regardless of tread depth.

A 6-year-old tire with full tread depth may LOOK fine but will have reduced wet grip, reduced snow grip, and increased risk of tread separation — especially in hot weather and at highway speeds. The rubber hardens, which reduces its ability to conform to the road surface.

**When buying "new" tires, check the date code.** I've seen tires sold as "new" that were 3-4 years old — they'd been sitting in a warehouse. You're paying for a tire that has already lost a third of its service life to aging. Most tire shops will honor a request for tires manufactured within the last 12 months. Ask before they mount them.

---

## UTQG Ratings: Treadwear, Traction, Temperature

The Uniform Tire Quality Grading (UTQG) system is a US government-mandated rating system. The ratings are molded into the sidewall: "TREADWEAR 500 TRACTION AA TEMPERATURE A." Here's what they actually mean:

**Treadwear — A relative number, NOT a mileage guarantee**
The treadwear rating is a number like 200, 360, 500, or 720. It's a RELATIVE measure of how long the tire's tread should last compared to a control tire rated at 100. A tire rated at 300 should theoretically last about three times as long as the control tire.

**But here's the catch:** UTQG treadwear ratings are assigned by the tire manufacturer, not by an independent lab. Each manufacturer sets their own baseline. A "500" treadwear Michelin does not necessarily last the same distance as a "500" treadwear Goodyear. The ratings are only useful for comparing tires WITHIN THE SAME BRAND.

General guidelines:
- 100-200: Ultra-high-performance summer tires. Soft compound, maximum grip, short life (15,000-30,000 miles).
- 300-400: Performance all-seasons. Good grip, reasonable life (30,000-50,000 miles).
- 500-600: Standard all-seasons. Medium-soft compound, long life (50,000-70,000 miles).
- 700+: Long-life touring tires. Hard compound, maximum life (70,000-90,000 miles), reduced grip.

**The tradeoff:** Higher treadwear number = harder rubber compound = longer life but less grip. A 700 treadwear tire will last 80,000 miles but won't grip nearly as well in wet or dry as a 300 treadwear tire. For a commuter car, prioritize life. For a car you drive enthusiastically, prioritize grip. There's no free lunch — the compound formulation determines both grip and wear rate.

**Traction — AA, A, B, or C**
This measures the tire's ability to stop on WET pavement (specifically wet asphalt and wet concrete in a straight-line braking test). It does NOT measure dry traction, cornering grip, or snow/ice performance.

- AA = Best wet braking performance
- A = Good wet braking
- B = Adequate wet braking
- C = Marginal wet braking (rare on modern passenger tires)

The difference between AA and A is meaningful — AA tires stop several feet shorter from highway speeds in wet conditions. For a car driven in rain, AA traction is worth seeking out.

**Temperature — A, B, or C**
This measures the tire's ability to dissipate heat at high speeds. Heat buildup is what causes tire failure at speed — the tire gets hot, the internal bonds weaken, and a tread separation or blowout occurs. Higher temperature ratings mean the tire can sustain higher speeds for longer periods without overheating.

- A = Best heat resistance. Required for any tire with an H or higher speed rating.
- B = Adequate for normal highway driving.
- C = Minimum legal standard. Essentially obsolete for modern passenger tires.

For any highway-driven car, you want A or B. If you see a C rating on a tire for your daily driver, find a different tire.

---

## Additional Sidewall Markings

**Max Pressure — "MAX PRESS 44 PSI" or "MAX INFLATION 51 PSI"**
This is the MAXIMUM pressure the tire can safely contain when cold — it's NOT the recommended pressure for your car. Your recommended tire pressure is on the door jamb placard, usually 30-35 PSI for most passenger cars. Inflating to the max pressure on the sidewall will give you a harsh ride, reduced grip, and uneven center tread wear. Use the door jamb number.

**Max Load — "MAX LOAD 1433 LBS"**
The maximum weight the tire can support at its maximum inflation pressure. This corresponds to the load index (93 in our example). Don't exceed it.

**M+S — "Mud and Snow"**
A tire marked M+S (or M/S, or MS) meets a very basic standard for snow traction. The standard is simply that the tread has at least 25% open void area (gaps between tread blocks). It's a geometric requirement, not a performance test. An M+S tire may be okay in light snow but is NOT necessarily a true winter tire.

**3PMSF — Three-Peak Mountain Snowflake symbol (mountain with a snowflake inside)**
This IS a performance-based rating. A tire with the 3PMSF symbol has passed an actual snow traction test and meets a minimum threshold for acceleration on packed snow. This marking is required on true winter tires and is increasingly found on all-weather tires. A 3PMSF tire is significantly better in snow than an M+S-only tire.

**Rotation Arrows**
If the tire has "ROTATION →" with a directional arrow, it's a directional tire designed to rotate in only one direction. The tread pattern is optimized for water evacuation in that specific direction. Mounting a directional tire backwards will dramatically reduce wet grip and increase hydroplaning risk. Directional tires can't be cross-rotated in an X pattern — only front-to-rear on the same side.

**"OUTSIDE" or "INSIDE"**
Asymmetric tires have different tread patterns on the inner and outer edges of the tread. The outer edge is optimized for dry cornering, the inner edge for water evacuation. The tire MUST be mounted with the "OUTSIDE" marking facing outward. If you see "INSIDE" facing you, the tire is mounted wrong and needs to be remounted.

---

## Why Mixing Tire Types on the Same Axle Is Dangerous

This is one of those things that gets people hurt and they don't understand why. Having different tire constructions, sizes, or significantly different tread depths on the left and right sides of the same axle creates a traction imbalance.

Here's what happens: in an emergency lane change or hard braking in the rain, the two tires on the same axle have different grip levels. One side grips while the other slips. The car rotates unpredictably. ABS and stability control can compensate somewhat, but there's a limit — if one tire has good tread and the other is nearly bald, the difference exceeds what the stability control can manage. The car spins.

**The rules:**
- Same size, same construction (both radial), same type (both all-season or both winter) on each axle. Not just same size — same MODEL of tire. A Michelin Pilot Sport and a Goodyear Eagle of the same size have different grip characteristics.
- Tread depth difference between left and right on the same axle should ideally be zero (replace in pairs), and absolutely no more than 2/32" difference.
- Never mix P-Metric and LT tires on the same vehicle. Different load ratings, different inflation pressures, different handling.
- Never mix run-flat and non-run-flat tires. The sidewall stiffness difference creates a handling imbalance.
- You CAN have different tires front vs rear (e.g., winter tires on the front axle, all-seasons on the rear) but it's not recommended — the car will have more grip in front than rear, which increases the risk of oversteer (the rear slides out). If you can only afford two winter tires, put them on the REAR, not the front. The rear axle is what keeps the car pointed straight.

---

## Quick Reference: What You Need to Match When Buying Tires

When you're buying replacement tires (one or a full set), here's what must match your vehicle's specifications:

1. **Size** — Must match exactly: P215/55R17. No substitutions on the numbers.
2. **Load Index** — Must meet or exceed the vehicle manufacturer's spec (door jamb placard). Higher is safe; lower is not.
3. **Speed Rating** — Must meet or exceed the vehicle manufacturer's spec. Higher is fine.
4. **Construction** — Radial (R). Radial tires on a modern vehicle, always.
5. **Type** — Match the tire type to your needs: all-season, summer, winter, all-weather. All four should be the same type.
6. **Same axle** — Tires on the same axle should be the SAME MODEL with similar tread depth (within 2/32").

---

## The Bottom Line

The numbers on your tire sidewall are not random. The size tells you what fits. The load index and speed rating tell you what's safe. The DOT date code tells you how old the tire is. The UTQG ratings tell you roughly how long it'll last and how well it'll grip. The M+S and 3PMSF symbols tell you whether it's actually a winter tire.

Take 30 seconds to read your sidewalls next time you're near your car. Check the date code — if it's been 6+ years since those tires were manufactured, start budgeting for replacements regardless of tread depth. Check that the load index and speed rating match what's on your door jamb placard. Make sure you don't have mismatched tires on the same axle.

Rubber is the only thing connecting your car to the road. Four contact patches, each about the size of your hand. Understanding your tires might be the most important automotive knowledge you never learned.

Got questions about your specific tires? Post what you see on the sidewall and what's on your door jamb placard. I'll tell you if everything checks out.

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
