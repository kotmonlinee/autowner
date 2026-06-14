// Usage: node scripts/backfill-repair-slugs.mjs
// Uses DeepSeek to match causes without repair_slug to existing DIY catalog
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

if (!DEEPSEEK_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing env vars");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function callDeepSeek(prompt) {
  const res = await fetch(DEEPSEEK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${DEEPSEEK_KEY}` },
    body: JSON.stringify({ model: "deepseek-chat", messages: [{ role: "user", content: prompt }], temperature: 0.1, max_tokens: 200 }),
  });
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

async function main() {
  const [{ data: causes }, { data: diyList }] = await Promise.all([
    supabase.from("symptom_causes").select("*"),
    supabase.from("diy_difficulty").select("repair_slug, repair_name"),
  ]);
  const diyItems = (diyList ?? []);
  const repairList = diyItems.map(r => `${r.repair_slug} (${r.repair_name})`).join("\n");

  const causesWithoutSlug = (causes ?? []).filter(c => !c.repair_slug);
  // Group by unique cause name
  const uniqueCauses = new Map();
  for (const c of causesWithoutSlug) {
    if (!uniqueCauses.has(c.cause_name)) uniqueCauses.set(c.cause_name, []);
    uniqueCauses.get(c.cause_name).push(c);
  }

  console.log(`${causesWithoutSlug.length} rows, ${uniqueCauses.size} unique cause names\n`);

  let backfilled = 0;
  const batchSize = 5;
  const names = [...uniqueCauses.keys()];

  for (let i = 0; i < names.length; i += batchSize) {
    const batch = names.slice(i, i + batchSize);
    const prompt = `You are matching automotive failure causes to available repair types. For each cause below, pick the best matching repair_slug from the catalog, or return "none" if nothing matches. Return ONLY a JSON object mapping cause name to slug (or "none").\n\nAvailable repairs:\n${repairList}\n\nCauses to match:\n${batch.join("\n")}\n\nReturn: {"Cause Name": "repair_slug"}`;

    try {
      const content = await callDeepSeek(prompt);
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) { console.log(`Batch ${i}: no JSON`); continue; }
      const mapping = JSON.parse(jsonMatch[0]);

      for (const [causeName, slug] of Object.entries(mapping)) {
        if (slug === "none" || !slug) continue;
        const rows = uniqueCauses.get(causeName);
        if (!rows) continue;
        // Verify slug exists in catalog
        const valid = diyItems.find(r => r.repair_slug === slug);
        if (!valid) { console.log(`  ⚠ ${causeName} → ${slug} (invalid slug)`); continue; }
        for (const row of rows) {
          await supabase.from("symptom_causes").update({ repair_slug: slug }).eq("id", row.id);
          backfilled++;
        }
        console.log(`  ✓ ${causeName} → ${slug}`);
      }
    } catch (e) {
      console.log(`  ✗ Batch error: ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 1500));
  }

  console.log(`\nBackfilled: ${backfilled}/${causesWithoutSlug.length}`);
}

main().catch(console.error);
