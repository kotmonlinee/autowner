// Usage: node scripts/generate-repair-costs.mjs
// Generates repair_costs for DIY entries without cost data
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const env = {};
readFileSync(".env.local", "utf8").split("\n").forEach(l => {
  const p = l.split("=");
  if (p.length > 1) env[p[0].trim()] = p.slice(1).join("=").trim();
});

const DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions";
const DEEPSEEK_KEY = env.DEEPSEEK_API_KEY ?? "";
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY ?? "";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function callDeepSeek(prompt) {
  const res = await fetch(DEEPSEEK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${DEEPSEEK_KEY}` },
    body: JSON.stringify({ model: "deepseek-chat", messages: [{ role: "user", content: prompt }], temperature: 0.3, max_tokens: 3000 }),
  });
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

const TIERS = [
  { key: "economy", order: 0, make: "Honda", model: "Civic" },
  { key: "mid_range", order: 1, make: "Ford", model: "F-150" },
  { key: "luxury", order: 2, make: "BMW", model: "3 Series" },
  { key: "truck_suv", order: 3, make: "Chevrolet", model: "Tahoe" },
  { key: "european", order: 4, make: "Audi", model: "A4" },
];

async function main() {
  // Find DIY entries without repair_costs
  const [{ data: diy }, { data: costs }] = await Promise.all([
    supabase.from("diy_difficulty").select("repair_slug, repair_name"),
    supabase.from("repair_costs").select("repair_slug"),
  ]);
  const costSet = new Set((costs ?? []).map(r => r.repair_slug));
  const missing = (diy ?? []).filter(r => !costSet.has(r.repair_slug));

  console.log(`${missing.length} repairs need cost data\n`);

  const BATCH_SIZE = 3;
  let generated = 0;

  for (let i = 0; i < missing.length; i += BATCH_SIZE) {
    const batch = missing.slice(i, i + BATCH_SIZE);
    const names = batch.map(r => `"${r.repair_name}" (${r.repair_slug})`).join("\n");

    const prompt = `You are a US auto repair pricing expert. Generate realistic repair cost estimates in USD for these repairs across 5 vehicle tiers. Base estimates on 2024-2025 US market data (RepairPal, AAA ranges).

Tiers:
- economy: Honda Civic
- mid_range: Ford F-150
- luxury: BMW 3 Series
- truck_suv: Chevrolet Tahoe
- european: Audi A4

For each repair and each tier, provide: min_cost, max_cost, avg_cost, labor_cost, parts_cost (all whole USD, no cents). labor + parts should roughly sum to avg_cost. confidence_level: "high" for common repairs, "medium" for variable ones.

Repairs: ${names}

Return ONLY a JSON object. Format:
{
  "repair_slug": {
    "economy":       {"min":120,"max":230,"avg":165,"labor":95,"parts":70,"confidence":"high"},
    "mid_range":     {"min":150,"max":290,"avg":210,"labor":110,"parts":100,"confidence":"high"},
    "luxury":        {"min":280,"max":480,"avg":370,"labor":180,"parts":190,"confidence":"high"},
    "truck_suv":     {"min":180,"max":340,"avg":250,"labor":130,"parts":120,"confidence":"high"},
    "european":      {"min":270,"max":460,"avg":355,"labor":175,"parts":180,"confidence":"high"}
  }
}`;

    try {
      const content = await callDeepSeek(prompt);
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) { console.log(`Batch ${i}: no JSON`); continue; }
      const data = JSON.parse(jsonMatch[0]);

      for (const r of batch) {
        const td = data[r.repair_slug];
        if (!td) { console.log(`  ⚠ ${r.repair_slug} — no data`); continue; }

        for (const t of TIERS) {
          const d = td[t.key];
          if (!d) continue;
          await supabase.from("repair_costs").insert({
            repair_slug: r.repair_slug,
            repair_name: r.repair_name,
            make: t.make,
            model: t.model,
            tier: t.key,
            tier_order: t.order,
            min_cost: d.min,
            max_cost: d.max,
            avg_cost: d.avg,
            labor_cost: d.labor,
            parts_cost: d.parts,
            confidence_level: d.confidence || "medium",
          });
        }
        generated += 5;
        const costs = Object.values(td);
        const range = `${Math.min(...costs.map(c => c.avg))}-${Math.max(...costs.map(c => c.avg))}`;
        console.log(`  ✓ ${r.repair_slug} ($${range})`);
      }
    } catch (e) {
      console.log(`  ✗ Batch error: ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 1500));
  }

  const { count } = await supabase.from("repair_costs").select("*", { count: "exact", head: true });
  console.log(`\nGenerated ${generated} rows, total repair_costs: ${count}`);
}

main().catch(console.error);
