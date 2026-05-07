// Seed test data — run: npx tsx scripts/seed.ts
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

// Parse .env.local manually
const env = Object.fromEntries(
  readFileSync(".env.local", "utf-8")
    .split("\n")
    .filter(l => l && !l.startsWith("#"))
    .map(l => l.split("=").map(s => s.trim()))
);

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL!,
  env.SUPABASE_SERVICE_ROLE_KEY!
);

const posts = [
  {
    slug: "maintenance",
    title: "How often should you really change synthetic oil?",
    body: `I've been running Mobil 1 full synthetic in my 2019 Honda Civic. The manual says every 10,000 miles but my mechanic keeps telling me 5,000. What are you all doing?

I've heard modern synthetics can go much longer, especially with highway driving. But I also don't want to risk engine damage over a $50 oil change.

What interval do you follow and what car do you drive?`,
  },
  {
    slug: "repair",
    title: "BMW N55 valve cover gasket leak — DIY or shop?",
    body: `Just noticed oil seepage around the valve cover on my 2015 BMW 335i (N55 engine). Quoted $1,200 at the dealership. Looking at the DIY guides, it seems doable but a bit involved.

For those who've done this: how long did it take you? Any special tools needed beyond the basics? Worth the savings or should I just pay the shop?

Update: 85k miles on the clock.`,
  },
  {
    slug: "mods-tuning",
    title: "Stage 1 tune on a stock GTI — worth it?",
    body: `Thinking about getting an APR Stage 1 tune for my 2021 Mk8 GTI. Car is otherwise completely stock. Claims are 300+ hp and 330+ lb-ft on 93 octane.

Anyone running a Stage 1 tune on their daily driver? How's the reliability been? Any issues with clutch slip (6MT here)?

Would love to hear real experiences before I pull the trigger.`,
  },
  {
    slug: "detailing",
    title: "Ceramic coating after 1 year — honest review",
    body: `Had my Tesla Model 3 ceramic coated (Gtechniq Crystal Serum Ultra) about a year ago. Paid $1,400 including paint correction.

Honest thoughts after 12 months and 15,000 miles:
- Water beading is still great but not as insane as day 1
- Wash maintenance is way easier, bugs and dirt come right off
- Did get some swirl marks back despite careful washing
- The gloss is still noticeably better than uncoated cars

Is it worth it? For a daily driver parked outside, I'm on the fence. For a garage queen, absolutely.`,
  },
  {
    slug: "diy-guides",
    title: "How to replace brake pads and rotors — complete beginner guide",
    body: `Just finished my first brake job on a 2018 Mazda CX-5. Saved about $500 vs the dealership quote. Here's everything I learned:

**Tools you need:**
- Jack and jack stands (do NOT work with just a jack)
- Socket set (metric, 10mm-19mm)
- Torque wrench
- C-clamp or brake piston tool
- Brake grease
- Wire brush

**Step by step:**
1. Loosen lug nuts before jacking up
2. Jack up and place jack stands
3. Remove wheel
4. Remove caliper bolts (usually 14mm)
5. Hang caliper with a wire (don't let it dangle by the hose)
6. Remove old pads and rotor
7. Clean hub surface with wire brush
8. Install new rotor
9. Compress caliper piston with C-clamp
10. Install new pads with grease on contact points
11. Reinstall caliper and torque bolts
12. Repeat for all wheels
13. Pump brake pedal before driving!

Took me about 3 hours being very careful. Would probably take 2 hours next time.`,
  },
  {
    slug: "buying-advice",
    title: "Used Toyota 4Runner vs Honda Pilot — which is more reliable?",
    body: `Looking at 2018-2020 model years for both. Budget around $30k. Mainly need a family hauler that can handle occasional light off-roading (fire roads, beach access).

I know the 4Runner has the legendary reputation and body-on-frame construction. The Pilot has better on-road manners and fuel economy.

Specific concerns:
- 4Runner: outdated interior, poor MPG, but bulletproof 4.0L V6
- Pilot: ZF 9-speed transmission issues on early models, but more comfortable

Anyone own either of these? What should I watch out for during a PPI? Thanks!`,
  },
];

async function seed() {
  for (const p of posts) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", p.slug)
      .single();

    if (!cat) {
      console.log(`Skip ${p.slug}: category not found`);
      continue;
    }

    const { error } = await supabase.from("posts").insert({
      title: p.title,
      body: p.body,
      category_id: cat.id,
      source: "user",
      status: "approved",
    });

    if (error) console.log(`Error: ${p.slug} — ${error.message}`);
    else console.log(`Created: ${p.slug}`);
  }
  console.log("Done seeding.");
}

seed().catch(console.error);
