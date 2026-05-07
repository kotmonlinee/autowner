// Publish 3 more 老李 articles (batch 2)
// Run: npx tsx scripts/lao-li-articles-2.ts
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
    title: "How Much Does a Transmission Fluid Change Cost? (And Why You Shouldn't Skip It)",
    body: `I had a customer come in last week with a 2017 Nissan Altima. 98,000 miles on the original CVT fluid. The transmission was shuddering at highway speeds like a washing machine with a brick in it. He asked me, "But the manual says it's lifetime fluid, right?"

That "lifetime fluid" cost him $4,200 for a remanufactured CVT. Let me tell you what he could have done instead.

---

## What a Transmission Fluid Change Actually Costs

Let me give you real numbers — not the "call for a quote" numbers you see on shop websites.

**Dealership: $250 - $400**

The dealer uses OEM fluid and OEM filters. On a traditional automatic like a Toyota Camry or Honda Accord, expect $250-300 for a drain-and-fill (not a flush — more on that in a minute). On an 8-speed or 10-speed transmission like the ZF 8HP in BMWs and Rams, you're looking at $350-400 because the fluid alone (ZF Lifeguard 8) runs $25-30 per liter and you need 6-7 liters.

Dealers charge this much because they bill book time — usually 1.0-1.5 hours at $150-200/hour labor — plus the parts markup on fluid. A drain-and-fill on a Toyota with WS fluid might be $89 in fluid and $180 in labor. You do the math.

**Independent Shop: $150 - $250**

An independent shop with a good reputation will charge you 0.8-1.2 hours at $100-130/hour, and they won't mark up the fluid 300% like the dealer does. I charged $179 flat for most 4-cylinder and V6 cars when I had my bay at an independent shop. That included up to 5 quarts of Dexron VI or compatible fluid, a new filter (if serviceable), and a new pan gasket.

For CVTs, the independent price is higher — usually $200-280 — because CVT fluid is expensive (Nissan NS-3 is $18-22/quart, Honda HCF-2 is $15-18/quart) and some CVTs don't have a serviceable filter, so you're paying for labor to drop the pan and clean the magnets plus the fluid itself.

**DIY: $50 - $80**

If you can turn a wrench and don't mind getting a little dirty, a drain-and-fill is absolutely a driveway job. Here's what you need:

- 4-6 quarts of the correct fluid: $35-60 (Toyota WS is about $8/qt on Amazon, Honda DW-1 about $9/qt, Valvoline MaxLife full synthetic multi-vehicle is $6/qt at Walmart and compatible with most Dexron VI/Mercon LV/LV SP specs)
- New drain plug crush washer: $2-3 from the dealer
- Fluid pump (the kind that screws onto the quart bottle): $8 on Amazon
- Drain pan: you already have one
- Jack and jack stands: you already have these too, right?

If your car has a serviceable transmission filter (most traditional automatics do, most CVTs don't), add $15-25 for the filter and $10 for the pan gasket. So figure $70-100 total with filter.

A note on "flushes": I do NOT recommend transmission flushes for high-mileage cars that have never had the fluid changed. A flush machine pushes fluid through the transmission under pressure, and on a transmission with 100,000+ miles of varnish and clutch material buildup, that pressure can dislodge debris and clog valve body passages. I've seen perfectly working transmissions die within two weeks of a flush. Drain-and-fill only, especially on higher-mileage cars. If you want to get more of the old fluid out, do a drain-and-fill, drive 500 miles, and do another one.

---

## CVT vs Traditional Automatic vs DCT: Why the Cost Is Different

Not all transmissions are the same, and the fluid change process varies significantly. Here's what you need to know for your car:

**Traditional Torque-Converter Automatic (Most Cars):** This is what's in 80% of cars on the road. Uses Dexron VI, Mercon LV, Toyota WS, Honda DW-1, or similar ATF. Drain plug on the pan, drop the pan to replace the filter if it has one, refill through the dipstick tube or fill plug. Service every 50,000-60,000 miles under normal driving, every 30,000 if you tow or drive in stop-and-go traffic. Cost: $150-250 shop, $50-80 DIY. Every shop knows how to do this. It's not complicated.

**CVT (Continuously Variable Transmission):** Nissan, Honda, Subaru, Toyota hybrids, and a growing number of other cars use these. CVT fluid is NOT the same as ATF — do not put Dexron VI in a CVT or you will destroy it. Nissan uses NS-2 or NS-3, Honda uses HCF-2, Subaru uses their own CVT fluid, Toyota uses Toyota CVT FE. These fluids are designed for the steel-belt-on-pulley friction characteristics of a CVT, which are completely different from the clutch-pack engagement of a traditional automatic. Service interval is CRITICAL on CVTs — every 30,000 miles, no exceptions. Nissan CVTs are notorious for failure, and in almost every case I've seen, the fluid had never been changed. CVTs also tend to have cartridge-style filters that are more expensive ($30-60) and sometimes harder to access than traditional pan filters.

**DCT (Dual-Clutch Transmission):** Ford PowerShift (the bad one), VW DSG, Hyundai/Kia DCT, Porsche PDK. These are essentially manual transmissions with computer-controlled clutches. Some use a specific DCT fluid (VW DSG fluid, Ford DCT fluid), and the service requires a specific fill procedure — often a top-fill through the filter housing or a bottom-fill with a pump because there's no dipstick. DSG service on a VW costs $350-500 at a dealer, $250-350 at an independent shop that knows what they're doing, and about $120-150 DIY (fluid plus the special filter and drain tool if needed). DCTs also have a separate gear oil section on some designs, so there may be two fluids to change. Service interval: every 40,000 miles for VW DSG, consult your manual for others.

---

## The "Lifetime Fluid" Lie

Let me be blunt: there is no such thing as lifetime transmission fluid. None. Zero. What "lifetime" means to the manufacturer is "the fluid will last the lifetime of the transmission, and the transmission's lifetime ends when the fluid fails."

Here's what's actually happening: automakers have figured out that "total cost of ownership" is a number that shows up in Consumer Reports and car-buying websites. Every recommended service adds to that number. So BMW, Audi, Nissan, and even Toyota on some models started calling their transmission fluid "lifetime fill" — not because the fluid has magical properties, but because omitting the service from the maintenance schedule makes their ownership cost numbers look lower next to Honda and Toyota on the spreadsheet.

The fluid still breaks down. It still picks up clutch material. It still oxidizes from heat cycles. It still loses its friction modifiers. ZF, the company that actually MAKES the 8-speed transmission in BMWs, recommends fluid changes every 50,000-75,000 miles. BMW, who buys the transmission from ZF, calls it "lifetime." Who do you think knows more about the transmission — the company that designed and built it, or the company that bolts it into the car?

I've drained "lifetime" fluid from a BMW with 100,000 miles that came out black and smelled like burnt electrical components. The owner had been told "it never needs changing." The transmission was slipping in 3rd and 4th gear. A $400 fluid change might have prevented a $6,000 transmission replacement.

Change your transmission fluid every 50,000-60,000 miles for normal driving, every 30,000 for severe service (towing, mountains, city traffic, hot climate). Every 30,000 for CVTs regardless of how you drive. This is not a theoretical recommendation. This is what I do on my own cars, and I've never had a transmission fail.

---

## How to Know Your Fluid Is Overdue (Warning Signs)

You don't need to be a mechanic to spot transmission trouble. Here's what to look for:

**1. Delayed engagement.** You shift from Park to Drive, and there's a noticeable pause — one second or more — before the transmission engages. Normal engagement is almost immediate. A delay means low fluid, degraded fluid, or worn clutch packs.

**2. Rough or hard shifting.** If your transmission slams into gear instead of gliding in, or if you feel a thud on the 2-3 upshift, the fluid has lost its friction modifiers and isn't doing its job anymore.

**3. Check the fluid on the dipstick.** Not all cars have a transmission dipstick anymore (many modern cars are "sealed" — you need to get under the car and check at the fill plug), but if yours has one, pull it. Transmission fluid on a warm engine should be pink or light red and smell slightly sweet or oily. If it's brown, dark red, or black, and it smells burnt — like overheated electrical tape or burnt toast — your fluid is cooked and needs changing immediately.

**4. Transmission fluid on your driveway.** Red or brown puddles under the middle of the car. Could be a pan gasket leak, a cooler line leak, or a failing axle seal. ATF leaks don't fix themselves, and running low on fluid will destroy a transmission faster than anything else.

**5. Whining or humming from the transmission.** A whine that changes pitch with engine RPM (not road speed) can indicate a clogged filter or a failing pump. Either way, get it checked.

---

## The Bottom Line

A transmission fluid change costs $150-400 depending on where you go and what you drive. A replacement transmission costs $2,500-$7,000. It's not complicated math.

Change your fluid on schedule. Use the correct fluid for your transmission — don't let a quick-lube place put Dexron VI in your Nissan CVT because "it's all the same stuff." It isn't. Toyota WS is not the same as Dexron VI. Honda DW-1 is not the same as Mercon V. Put the right fluid in or pay someone who will.

And if anyone tells you your transmission fluid is "lifetime," ask them if they'll put that in writing and cover your transmission replacement when it fails at 120,000 miles. They won't.

Got questions about your specific car's transmission? Post the year, make, model, and mileage in the comments. I'll tell you what fluid it takes and when to change it.

*— 老李 (Li), ASE Certified Master Technician, 15 years in dealerships and independent shops*`,
  },
  {
    category_slug: "diy-guides",
    title: "5 Signs Your Brake Pads Need Replacement (Before They Fail)",
    body: `Last month a guy rolled into the shop with a 2019 Ford Escape. He said the brakes "started making a little noise a few weeks ago but it wasn't that bad." By the time he came in, the pad backing plate had been grinding against the rotor for who-knows-how-long.

The pads? Gone. The rotors? Gouged to hell on both sides. One caliper piston was extended so far past the seal that it was leaking brake fluid.

What would have been a $180 pad-slap turned into pads, two rotors, and one caliper — $680 out the door. All because he ignored the signs.

Here are the five signs that tell you your pads are done. Learn them. Your wallet will thank you.

---

## Sign 1: Squealing or Screeching When You Brake

Most brake pads have a small metal tab called a wear indicator. When the pad material wears down to about 2-3mm (roughly 2/32 inch), this tab makes contact with the rotor and produces a high-pitched squeal. It's designed to be annoying on purpose. It's your car screaming at you to change the pads.

Not every squeal means worn pads, though. If you just had new pads installed and they're squealing, it could be:
- Cheap semi-metallic pads (spend the extra $20 for ceramics next time)
- Missing or improperly applied brake grease on the pad ears and backing plate
- Glazed pads from aggressive bedding-in

But if your pads have 30,000+ miles on them and they start squealing? That's the wear indicator. Schedule the brake job this weekend, not next month.

One caveat: some European cars use a brake pad wear sensor instead of a mechanical tab, which triggers a dashboard warning light. Same message, different messenger. Don't ignore the light just because the brakes "feel fine." The sensor wire breaks when the pad gets thin, and that dash light means you're at 3mm or less.

---

## Sign 2: Less Than 1/4 Inch (6mm) of Friction Material

This is the one you can check yourself without even taking the wheel off. Grab a flashlight and look through the spokes of your wheel at the brake caliper. You're looking at the pad where it contacts the rotor. The pad has two layers: the metal backing plate (about 5mm thick) and the friction material on top.

A new pad starts with 10-12mm of friction material. If what you see is thinner than the backing plate — or roughly the thickness of two stacked quarters — you're due for replacement.

Most shops recommend replacing pads at 3-4mm. Some state inspections fail at 2/32 inch (about 1.6mm). By the time you're at 2mm, you're dangerously close to metal-on-metal.

Learn to do this check. It takes 30 seconds. I check my pads every oil change — it's the best habit you can develop for catching brake wear before it becomes brake damage.

One note: the inner pad usually wears faster than the outer pad because the caliper piston pushes directly on it. If the outer pad looks okay but you can barely see the inner pad, the inner pad might be nearly gone. If your pads are wearing unevenly (inner much faster than outer), you might have sticking caliper slide pins — a $5 packet of brake grease and 15 minutes of cleaning can fix that before it destroys your pads and rotors.

---

## Sign 3: Grinding Noise — Metal on Metal

If you hear grinding when you brake, you are already too late. What you're hearing is the steel backing plate of the brake pad grinding directly against the cast iron rotor. At this point, the pad material is completely gone.

This is bad for three reasons:
1. Your rotor is being destroyed. A rotor that could have been reused or machined now has deep grooves and needs replacement ($60-100 per rotor just for the part).
2. The backing plate isn't designed to be a friction surface. Your stopping distance is significantly increased.
3. The caliper piston may be overextending to take up the space where the pad used to be, putting the piston seal at risk.

If you hear grinding, stop driving the car and get it to a shop. Every mile you drive is adding cost to the repair.

---

## Sign 4: Brake Pedal Pulsation or Steering Wheel Vibration When Braking

You're coming down an off-ramp at 60 mph, you press the brake pedal, and the pedal pulses under your foot. Or the steering wheel shimmies. That's not normal.

What you're feeling is a warped rotor, and it's almost always caused by overheated brake pads. Here's what happens: pads that are worn thin don't dissipate heat as well as thick pads. The extra heat transfers into the rotor, causing uneven expansion and creating high and low spots. Those high spots push back against the pads with every rotation, and you feel it as a pulse in the pedal.

Sometimes a rotor can be machined flat again if there's enough thickness left, but on most modern cars the rotors are designed close to their minimum thickness from the factory. Machining them takes them below spec. So a pulsating pedal almost always means new rotors — and the pads get replaced at the same time.

Worn pads cause warped rotors. Preventable with a $40 set of pads. Unpreventable once you've ignored them for 5,000 miles too long.

---

## Sign 5: The Car Pulls to One Side When Braking

If your car pulls left or right under braking — especially moderate to hard braking — you have a brake imbalance. One side is grabbing harder than the other.

The most common cause? Uneven pad wear. One side's pads are worn down more than the other, or one caliper isn't releasing fully and has worn the pad prematurely. This can also be caused by a collapsed brake hose (the inner liner separates and acts like a check valve, holding pressure on one caliper) or a sticking caliper piston.

Whatever the cause, a pull under braking is a safety issue. If you need to brake hard in an emergency and one side grabs before the other, the car can rotate before the stability control has time to react. Fix it now.

---

## What Brake Pads Actually Cost (With Real Numbers)

I want you to understand the real cost difference between doing this on time and doing it late.

**Shop Prices (per axle — front OR rear):**
- Pad replacement only (rotors are fine): $150-250 including labor. OEM-quality pads like Akebono ProACT ceramics run $60-90 for the set, plus 1.0-1.5 hours of labor at $100-130/hour.
- Pads AND rotors: $300-500 per axle. Rotors add $60-120 each for mid-grade parts.
- Pads, rotors, AND one caliper: $500-700 per axle. A remanufactured caliper is $60-120 plus the extra labor to bleed the brake system.

**DIY Prices (per axle):**
- Pads only: $40-70 (Akebono ProACT ceramics are $45 on RockAuto, Bosch QuietCast are $38, Power Stop Z23 Evolution Sport carbon-fiber ceramic are $55). You need basic hand tools and about 1-2 hours for a first-timer.
- Pads and rotors: $100-180 total for both sides. Centric Premium rotors are $35-50 each, coated rotors (worth the extra to prevent rust in the rust belt) are $50-65 each.
- Pads, rotors, caliper: $170-280 total.

The difference between replacing pads on time ($40-70 DIY, $150-250 shop) and replacing pads + rotors + caliper ($170-280 DIY, $500-700 shop) is real money. I've done this math for customers more times than I can count, and they always wish they'd come in sooner.

---

## How to Check Your Pad Thickness Without Removing the Wheel

Grab a flashlight. Crouch down next to your front wheel. Shine the light through one of the spoke openings in your wheel and look at the brake caliper. Find the pad — it's the flat piece of metal with the dark gray/black friction material facing the shiny rotor.

The friction material should be obviously thicker than the metal backing plate behind it. If the pad material is thinner than the backing plate, you're due. If you can't see any pad material at all, you're metal-on-metal.

The rear wheels are sometimes harder to see because the caliper is smaller and the wheel design might not have big spoke openings. If you can't get a good look, it's worth pulling one wheel off just to check — especially if you're hearing any noise.

Check all four wheels, not just the fronts. Front pads wear about twice as fast as rears on most cars because of weight transfer under braking, but plenty of modern cars with electronic brake-force distribution show more even wear. My 2019 Civic's rear pads actually wore faster than the fronts because Honda's EBD biases rear brake pressure at low speeds to reduce nose dive.

---

## The Bottom Line

Brake pads are a wear item, like tires. They WILL need to be replaced. The only question is whether you replace them before or after they destroy your rotors and calipers.

Listen for the squeal. Check the thickness every oil change. Don't ignore a pulsating pedal or a pull to one side. And if you hear metal grinding, stop driving.

$40-70 in parts and a Saturday morning in the driveway, or $500+ at a shop because you waited — your choice.

Questions about your specific brakes? Drop your year, make, model, and mileage in the comments. I'll tell you what pads I'd run and whether the rotors need to be done too.

*— 老李 (Li), ASE Certified Master Technician, 15 years in dealerships and independent shops*`,
  },
  {
    category_slug: "buying-advice",
    title: "Winter vs All-Season vs Summer Tires: What You Actually Need for Your Climate",
    body: `Here's a conversation I have every November in my shop:

Customer: "Hey Li, my wife's Civic needs new tires. I was thinking some all-seasons — we have AWD so we should be fine for winter, right?"

Me: "AWD helps you go. It does absolutely nothing to help you stop."

That pause you just heard? That's the moment they realize they've been driving with a false sense of security for years.

Let me walk you through the three types of tires, what they're designed for, and which one actually belongs on your car based on where you live and how you drive.

---

## The Rubber Compound Temperature Range (The Part Nobody Explains)

Tires aren't just rubber. They're a carefully engineered compound that's designed to work within a specific temperature window. Outside that window, the rubber either gets too hard (and loses grip) or too soft (and wears out fast / feels greasy).

Here's the breakdown with actual temperature ranges:

**Summer Tires:** Designed to work best above 45°F (7°C). The rubber compound is formulated for maximum grip on warm, dry pavement. Below 45°F, the rubber hardens significantly — think of a pencil eraser that's been left in the freezer. Stopping distances increase dramatically. Below freezing, summer tires can actually crack if driven, because the compound becomes brittle. If you live somewhere where it never drops below 45°F (Southern California, South Florida, Arizona low desert, South Texas), summer tires are a legitimate year-round option and will give you the best dry braking and cornering performance.

**Winter/Snow Tires:** Designed to work from about -20°F up to 45°F. The rubber stays pliable well below freezing because of higher silica content and specialized polymers. They also have thousands of small sipes (tiny slits in the tread blocks) that act like hundreds of biting edges on snow and ice. The tread compound is also designed to grip snow — snow sticks to snow, so winter tire treads are designed to pack snow into the grooves, which then grips the snow on the road. Winter tires wear very fast above 50-55°F because the compound gets too soft. You cannot run winter tires year-round — you'll burn through a set in one summer.

**All-Season Tires:** The compromise. Designed to work acceptably from about 20°F to 90°F. They use a compound that balances cold-weather flexibility with warm-weather durability, and a tread pattern that provides some snow traction without the road noise and rapid wear of winter tires. "Acceptably" is the key word — an all-season tire at 20°F has less grip than a winter tire, and an all-season tire at 95°F has less dry grip than a summer tire. You are always sacrificing something.

---

## The AWD Myth: "I Don't Need Winter Tires Because I Have All-Wheel Drive"

I need you to read this next sentence twice: All-wheel drive helps you accelerate. It does not help you steer, and it does not help you stop.

AWD sends power to all four wheels, which means when you're trying to get moving on a slippery surface, you have four contact patches working for you instead of two. That's great for getting out of an unplowed driveway. It does absolutely nothing for you when you're braking — every car on the road has four-wheel brakes, and the limiting factor in stopping on snow and ice is the friction between your tires and the road.

Here are the stopping distance numbers that matter. These are from TireRack's instrumented testing, and I've seen similar results in real-world conditions:

- From 25 mph on packed snow, a front-wheel-drive car on winter tires stopped in 59 feet. The same car on all-season tires needed 86 feet. That's 27 feet farther — about one and a half car lengths. At 35 mph, the gap was over 40 feet. Think about what that means approaching an intersection where a light just turned red.

A Subaru with AWD on all-season tires will sail right past a Honda Civic on winter tires when it comes time to stop. I've seen it. The Subaru's AWD got it moving, but the Civic's winter tires got it stopped. Which one matters more when a kid runs into the street?

If you live somewhere with regular snow and ice — Minnesota, Colorado, New England, Upstate New York, the Mountain West — you need winter tires, AWD or not. Period.

---

## Real Cost Breakdown

Here's what you're actually spending, with real tire models and prices (prices are for a set of 4, mounted and balanced, before tax, as of spring 2026):

**Budget All-Seasons (Set of 4: $350-500)**
- Examples: Kumho Solus TA31 ($85-100/tire), General Altimax RT45 ($95-110/tire), Cooper Endeavor ($100-115/tire)
- Fine for a commuter car in mild climates. These are what I recommend for "I just need safe transportation and don't care about performance."
- Expect 40,000-60,000 miles of tread life.
- These are NOT good in snow. They meet the legal definition of "all-season" but that's a low bar.

**Premium All-Seasons (Set of 4: $550-800)**
- Examples: Michelin CrossClimate 2 ($160-200/tire), Continental PureContact LS ($150-180/tire), Pirelli P7 AS Plus 3 ($155-175/tire)
- The CrossClimate 2 is unique — it's technically an all-weather tire (a newer category) with a winter-biased compound and tread pattern. It's the closest thing to a true year-round tire for someone who sees occasional snow but doesn't want to store a second set.
- Expect 50,000-70,000 miles of tread life on premium all-seasons.

**Winter Tires (Set of 4: $500-1,000)**
- Examples: Bridgestone Blizzak WS90 ($130-170/tire), Michelin X-Ice Snow ($150-190/tire), Nokian Hakkapeliitta R5 ($160-200/tire), Continental VikingContact 7 ($140-170/tire)
- The Blizzak is the benchmark. I've run them on my personal cars for 10 winters. The X-Ice Snow lasts longer (Michelin claims 40,000 miles vs. Blizzak's 30,000), but the Blizzak has slightly better ice traction.
- Studded winter tires (Nokian Hakkapeliitta 10, etc.) add about $20-30/tire but are only legal in certain states. Check your local laws. If you live in rural Vermont or on an unplowed road in the Rockies, studs might make sense. For most people, studless winter tires are better — they're quieter, don't damage roads, and actually outperform studs on cold dry pavement.

**Summer / Performance Tires (Set of 4: $500-1,200+)**
- Examples: Michelin Pilot Sport 4S ($200-280/tire), Continental ExtremeContact Sport 02 ($160-220/tire), Firestone Firehawk Indy 500 ($130-160/tire)
- Premium summer tires are expensive but transformative on a sports car or sport sedan. If you bought something with 300+ horsepower, put real summer tires on it. All-seasons will just light up at half throttle.

---

## Which Tire Setup Actually Belongs on Your Car (By Climate)

Here's my honest recommendation based on 15 years of seeing what works and what doesn't:

**Climate: Always Warm (Never Below 45°F)**
Southern California coast, South Florida, Hawaii, South Texas, Phoenix/Tucson
- Recommendation: Summer tires year-round, or premium all-seasons if you want more tread life and don't push the car hard.
- You don't need winter tires. You don't need all-weather tires. Save your money.
- Tire cost: $500-1,200 one-time, replaced every 3-5 years depending on miles.

**Climate: Four Distinct Seasons, Mild Winter (Occasional Light Snow, Temps 15-45°F)**
Mid-Atlantic, Pacific Northwest, Kentucky/Tennessee, Oklahoma, Central Plains
- Recommendation: Premium all-seasons like the Michelin CrossClimate 2, or a dedicated summer set + a dedicated winter set if you have the storage space and budget.
- If you go the all-season route, the CrossClimate 2 or similar "all-weather" tire with the Three-Peak Mountain Snowflake (3PMSF) rating is your best bet. It's not as good as a dedicated winter tire, but it's far better than a standard all-season in snow.
- Tire cost: $550-800 one-time with all-seasons, or $1,000-1,800 for two sets (summer + winter) that will last 4-6 years each.

**Climate: Regular Snow and Ice (Temps 0-30°F, Frequent Snowfall)**
Minnesota, Wisconsin, Michigan, Upstate NY, New England, Colorado, Utah
- Recommendation: Dedicated winter tires + a separate set of all-seasons or summer tires for the warm months.
- Buy a second set of wheels (steelies are $50-70 each, used OEM alloys from Craigslist or Facebook Marketplace are $100-200/set). Mount the winter tires on the second set and swap the wheels yourself in October and April. Yes, it's a $200-400 upfront cost for the extra wheels, but it pays for itself in two seasons — shops charge $80-120 to mount and balance a tire swap twice a year. With a dedicated set of wheels, you can swap them in your driveway in an hour with a jack and a torque wrench.
- Tire cost: $1,000-2,000 for the two sets of tires, plus $200-400 for the extra wheels. Spread over 4-6 years, that's about $300-500/year. Worth every penny when you're the only car that can stop on an icy off-ramp.

**Climate: Extreme Cold and Heavy Snow (Temps Below 0°F, Deep Snow, Unplowed Roads)**
Northern Maine, Upper Peninsula Michigan, North Dakota, Alaska, Canadian border regions
- Recommendation: Studded winter tires (where legal) or top-tier studless winter tires (Nokian Hakkapeliitta R5, Bridgestone Blizzak WS90). Winter tires only from October through April. Summer or all-season for the rest of the year.
- Tire cost: $1,200-2,200 for two sets. This is not the place to cheap out. I've driven in -30°F in northern Minnesota, and the difference between a Blizzak and a cheap winter tire at those temperatures is the difference between stopping and sliding into a ditch.

---

## Tire Storage Costs and Logistics

If you're running two sets of tires, you need somewhere to store the off-season set. Your options:

- **Your own garage/basement/shed:** Free. Stack the tires horizontally (don't stand them on the tread — it can cause flat-spotting over long periods), cover them with tire totes ($25-40 on Amazon for a set of 4), and keep them away from direct sunlight and electric motors (ozone from motors degrades rubber).
- **Tire hotel/storage at a shop:** $50-100 per year. Many tire shops and dealers offer seasonal tire storage. They'll tag your tires and store them in a climate-controlled warehouse. Call around — prices vary wildly.
- **Rent a small storage unit:** Overkill for just tires, but if you have no space at all and no shop offers storage, this runs $50-80/month for a 5x5 unit, which holds 4-8 tires easily.

If you can't swing the storage, the all-weather tire category (CrossClimate 2, Firestone WeatherGrip, Goodyear Assurance WeatherReady) is your best compromise. They carry the 3PMSF rating and will get you through moderate winter conditions without needing a swap.

---

## The Bottom Line

The right tires for your climate are cheaper than one accident. A set of winter tires is $500-1,000. An insurance deductible is $500-1,000. Your rates going up for three years is another $1,500+. And none of that accounts for the possibility of injury.

If you live somewhere with real winter, get winter tires. If you live somewhere warm year-round, get summer tires and enjoy the grip. If you live somewhere in between, get the best all-weather or all-season tires you can afford and drive carefully when it's cold or wet.

And the next time someone says "I have AWD so I don't need winter tires," ask them: "Does your AWD help you stop?"

It doesn't.

What climate are you in, and what are you currently running? Post below and I'll give you a straight recommendation.

*— 老李 (Li), ASE Certified Master Technician, 15 years in dealerships and independent shops*`,
  },
];

async function main() {
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

    if (error) { console.log("Error:", error.message); }
    else { console.log("Created:", post.id, "—", a.title.slice(0, 65)); }
  }
  console.log("Done.");
}

main().catch(console.error);
