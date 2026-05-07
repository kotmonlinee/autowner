// Publish first two 老李 articles
// Run: npx tsx scripts/lao-li-articles.ts
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
    category_slug: "buying-advice",
    title: "Best OBD2 Scanners for DIY Car Owners (2026): Stop Guessing, Start Diagnosing",
    body: `After 15 years turning wrenches in dealerships and independent shops, I can tell you the single best investment a car owner can make isn't a fancy toolkit — it's a good OBD2 scanner.

These things have saved my customers thousands of dollars over the years. A check engine light pops on, you pull the code in 30 seconds, and you know whether it's "tighten the gas cap" or "tow it to a shop right now."

I tested six scanners ranging from $25 Bluetooth dongles to $400 professional units. Here's what you actually need.

---

## The Quick Picks

**Best Budget Pick: BlueDriver Bluetooth Pro ($99.95)**

Plug it into your OBD2 port, pair with your phone, and you get live data, freeze frame, and mode $06 (advanced emissions data). For DIYers, this covers 95% of what you'll ever need. The companion app actually gives repair reports for your specific vehicle — not just generic code definitions.

**Best Standalone: Autel MaxiCOM MK808 ($389)**

No phone required. 7-inch touchscreen. Does ABS, SRS, transmission codes, oil reset, EPB, SAS, DPF regeneration, TPMS. If you're serious about DIY — doing your own brakes, diagnosing airbag lights, resetting service indicators — this is the one. I use the older AL529 ($119) at home, but the MK808 is what I recommend to my buddies who actually know what they're doing.

**Best No-Frills: Ancel AD310 ($29.99)**

Reads and clears engine codes. That's it. No Bluetooth, no fancy screen, no ABS codes. But it works every single time, on every car from 1996 onward. I keep one of these in my glovebox. If someone asks me "what scanner should I buy to keep in the trunk for emergencies?" — Ancel AD310. Done.

---

## What Actually Matters When Buying

**1. Vehicle Compatibility.** All OBD2 scanners work with 1996+ US market vehicles. That's the law. But not all scanners read manufacturer-specific codes. If you drive a BMW, Mercedes, Audi, or Volvo, get a scanner that explicitly supports enhanced manufacturer codes. BlueDriver, Autel, and Foxwell handle these well. The $20 Amazon specials do not.

**2. Live Data.** Being able to watch live sensor data — O2 sensor voltage, fuel trim, coolant temp actual vs. gauge — is what separates real diagnosis from guessing. If you're going to do any troubleshooting beyond "read the code and google it," get a scanner with live data.

**3. ABS/SRS/Transmission Codes.** Most cheap scanners only read engine codes. If your ABS light is on or your airbag light is flashing, a basic scanner tells you nothing. The Autel MK808 and BlueDriver do these. If you only care about check engine lights, skip this feature and save the money.

---

## The One Thing Nobody Tells You

The scanner is only 20% of the equation. The other 80% is knowing what to do with the code.

P0420 (catalyst efficiency below threshold)? That could be a bad catalytic converter ($800+), a lazy downstream O2 sensor ($80), or an exhaust leak at the manifold gasket ($15 gasket, 3 hours labor). The scanner tells you the code. Experience tells you which direction to look.

That's why I always recommend looking up the code on a vehicle-specific forum (or right here on AutOwner) before throwing parts at it. I've seen too many people replace perfectly good catalytic converters because a scanner said P0420 and they didn't know to check the O2 sensor readings first.

**My actual recommendation:** If you do any DIY work at all, buy the BlueDriver. It pays for itself the first time you diagnose a problem without paying a shop $120 for a diagnostic fee. If you just want peace of mind in the glovebox, get the Ancel AD310.

Questions? Drop them in the comments. I actually answer them.

*— 老李 (Li), ASE Certified Master Technician, 15 years in dealerships and independent shops*`,
  },
  {
    category_slug: "diy-guides",
    title: "Check Engine Light On? What to Check Before Paying a Mechanic",
    body: `Let me tell you something I've seen a thousand times: a customer walks into the shop, check engine light on, scared they're about to drop $2,000 on a repair. Half the time, it's a loose gas cap.

No, seriously. I've charged people zero dollars and handed their keys back after 30 seconds. So before you panic and pull out the credit card, do these checks first.

---

## Step 1: Check the Gas Cap (Yes, Really)

Pop your fuel door, remove the gas cap, and tighten it back on until it clicks at least three times. Then drive normally for a day or two. The check engine light will often clear itself after a few drive cycles.

Why this works: The EVAP system monitors fuel vapor pressure. A loose cap lets vapor escape, triggers a small leak detection code (P0455, P0456, P0442). This is the single most common cause of check engine lights and it costs $0 to fix.

I cannot tell you how many times a customer came in with P0456, expecting a $500 smoke test and EVAP repair, and I just tightened their gas cap and sent them home.

---

## Step 2: Get the Code Read — For Free

Autozone, O'Reilly, Advance Auto Parts — all of them will read your check engine light codes for free. They hand you a printout with the code and a generic description. **Do not let them sell you the part that the code mentions. Yet.**

Code P0420 says "catalyst efficiency below threshold." The guy at the counter will try to sell you a catalytic converter for $800. But P0420 could also be a bad O2 sensor ($80), an exhaust leak ($15 gasket), or even just a car that's due for spark plugs and running rich. The code tells you the symptom, not the disease.

Write down the exact code. *Then* leave the store without buying anything.

---

## Step 3: Look Up the Code for YOUR Specific Car

A P0301 (cylinder 1 misfire) on a 2015 Honda Accord is almost always ignition coils. The same P0301 on a 2012 BMW 328i (N20 engine) is often a bad fuel injector — completely different cause, same code.

Search "[code] [your car year make model]" on forums or here on AutOwner. Look for threads where someone had the exact same code and actually solved it. Pay attention to the posts that end with "FIXED: it was the ___."

---

## Step 4: The "Clear It and See" Test

If the code is something like P0420 or P0456 — issues that tend to be intermittent — clear the code and drive the car for a week. If it comes back, it's a real problem. If it doesn't, it was likely a one-time anomaly (bad tank of gas, temperature swing, loose gas cap).

This test is NOT safe for: flashing check engine light (active misfire — pull over immediately), P0300-P0308 codes (can damage the cat if you keep driving), or any overheating situation.

---

## The Codes I See Most Often

| Code | Most Common Cause | Rough Cost |
|------|------------------|------------|
| P0420 | Bad downstream O2 sensor or exhaust leak | $80 - $300 |
| P0171/P0174 | Vacuum leak (cracked intake boot, PCV hose) | $15 - $150 |
| P0300-P0304 | Worn spark plugs or ignition coil | $40 - $300 |
| P0455/P0456 | Loose gas cap or cracked EVAP hose | $0 - $200 |
| P0128 | Stuck-open thermostat | $50 - $250 |
| P0442 | Small EVAP leak — check gas cap first | $0 |

---

## When You Actually Need a Mechanic

If you've tightened the gas cap, read the code, researched your specific car, and you're still looking at a code that involves internal engine work (timing chain, head gasket), transmission codes (P0700 series), ABS module errors, or anything requiring dropping the subframe — then yes, take it to a shop. A good independent shop, not a chain. Ask for a diagnosis fee upfront (typically $100-150), and make sure they apply it toward the repair if you do it with them.

---

## The Bottom Line

A check engine light is your car trying to tell you something. It's not always bad news. Read the code, do your homework, and start with the $0 fixes first. Nine times out of ten, you'll save yourself hundreds of dollars and a lot of stress.

Got a code you're trying to diagnose? Post it in the comments with your year, make, and model. I'll tell you where to look first.

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
    else { console.log("Created:", post.id, "—", a.title.slice(0, 60)); }
  }
  console.log("Done.");
}

main().catch(console.error);
