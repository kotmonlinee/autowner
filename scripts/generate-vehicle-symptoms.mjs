// Usage: node scripts/generate-vehicle-symptoms.mjs
// Generates 1,276 vehicle-specific symptom articles via DeepSeek
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

// Category templates (mirrors src/lib/symptom-vehicle-templates.ts)
const TEMPLATES = {
  noise: {
    title: "{vehicle} {symptom}: What It Means & Repair Cost",
    h1: "What's Causing {symptom} in My {vehicle}?",
    meta: "Hearing {symptom} in your {vehicle}? Learn the most common causes, expected repair costs, and whether it's safe to keep driving. Expert diagnosis tips included.",
  },
  smells: {
    title: "{vehicle} {symptom}: Causes, Repair Cost & Is It Dangerous?",
    h1: "Why Does My {vehicle} Have {symptom}?",
    meta: "Smelling {symptom} in your {vehicle}? Learn what causes it, how much repairs cost, and whether it indicates a serious safety issue. Diagnosis guide included.",
  },
  smoke: {
    title: "{vehicle} {symptom}: Causes, Repair Cost & Is It Dangerous?",
    h1: "Why Is My {vehicle} Blowing {symptom}?",
    meta: "Seeing {symptom} from your {vehicle}? Learn the common causes, expected repair costs, and whether it's safe to continue driving. Expert diagnosis guide included.",
  },
  vibration: {
    title: "{vehicle} {symptom}: Causes, Repair Cost & Is It Safe to Drive?",
    h1: "Why Is My {vehicle} {symptom}?",
    meta: "Experiencing {symptom} in your {vehicle}? Learn the most common causes, expected repair costs, and whether it's safe to continue driving. Diagnosis tips included.",
  },
  starting: {
    title: "{vehicle} {symptom}: Most Common Causes & What to Check First",
    h1: "Why Is My {vehicle} {symptom}?",
    meta: "{symptom} with your {vehicle}? Learn the most common causes, diagnostic steps, and expected repair costs to get back on the road quickly.",
  },
  performance: {
    title: "{vehicle} {symptom}: Causes, Repair Cost & What to Do",
    h1: "Why Is My {vehicle} {symptom}?",
    meta: "Experiencing {symptom} in your {vehicle}? Learn the common causes, expected repair costs, and what to do next. Expert diagnosis guide included.",
  },
  warning_lights: {
    title: "{vehicle} {symptom}: Causes, Repair Cost & Warning Signs",
    h1: "Why Is My {vehicle} {symptom}?",
    meta: "The {symptom} is on in your {vehicle}. Learn what it means, common causes, expected repair costs, and whether it's safe to keep driving.",
  },
  temperature: {
    title: "{vehicle} {symptom}: Common Causes & When to Stop Driving",
    h1: "Why Is My {vehicle} {symptom}?",
    meta: "Your {vehicle} is {symptom}. Learn the common causes, expected repair costs, and when to stop driving. Expert diagnosis tips included.",
  },
  leaks: {
    title: "{vehicle} {symptom}: Common Causes, Repair Cost & How to Identify",
    h1: "Why Is My {vehicle} Leaking Fluid? {symptom}",
    meta: "Noticed {symptom} under your {vehicle}? Learn how to identify the fluid, common causes, expected repair costs, and whether it's safe to drive.",
  },
  brakes: {
    title: "{vehicle} {symptom}: Causes, Repair Cost & Safety Warning",
    h1: "Why Is My {vehicle} {symptom}?",
    meta: "Experiencing {symptom} in your {vehicle}? Learn the common causes, expected repair costs, and why brake issues should never be ignored. Safety-first diagnosis guide.",
  },
  steering: {
    title: "{vehicle} {symptom}: Causes, Repair Cost & Is It Safe to Drive?",
    h1: "Why Does My {vehicle} {symptom}?",
    meta: "Your {vehicle} is {symptom}. Learn the common causes, expected repair costs, and whether it's safe to continue driving. Expert alignment and suspension diagnosis tips.",
  },
};

function fill(template, vehicle, symptom) {
  return template.replace(/\{vehicle\}/g, vehicle).replace(/\{symptom\}/g, symptom);
}

async function callDeepSeek(prompt) {
  const res = await fetch(DEEPSEEK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${DEEPSEEK_KEY}` },
    body: JSON.stringify({ model: "deepseek-chat", messages: [{ role: "user", content: prompt }], temperature: 0.5, max_tokens: 2500 }),
  });
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

async function main() {
  // Load vehicles from diagnoses
  const { data: diagVehicles } = await supabase.from("diagnoses")
    .select("vehicle_make, vehicle_model")
    .not("vehicle_make", "is", null).not("vehicle_model", "is", null);
  const vehiclePairs = [...new Set((diagVehicles ?? []).map(d => d.vehicle_make + "|" + d.vehicle_model))];
  console.log(`${vehiclePairs.length} vehicles`);

  // Load all symptoms
  const { data: symptoms } = await supabase.from("symptoms").select("slug, name, category").order("category").order("name");
  if (!symptoms) { console.error("No symptoms"); return; }
  console.log(`${symptoms.length} symptoms`);

  // Check existing to avoid duplicates
  const { data: existing } = await supabase.from("vehicle_symptoms").select("slug");
  const existingSet = new Set((existing ?? []).map(r => r.slug));

  const TOTAL = vehiclePairs.length * symptoms.length;
  let generated = 0, skipped = 0;

  for (const vp of vehiclePairs) {
    const [make, model] = vp.split("|");
    const vehicle = `${make} ${model}`;
    const makeSlug = make.toLowerCase().replace(/\s+/g, "-");
    const modelSlug = model.toLowerCase().replace(/\s+/g, "-");

    console.log(`\n=== ${vehicle} ===`);

    const BATCH_SIZE = 8;
    for (let i = 0; i < symptoms.length; i += BATCH_SIZE) {
      const batch = symptoms.slice(i, i + BATCH_SIZE);
      const batchDesc = batch.map(s => `"${s.name}" (${s.slug}, category: ${s.category})`).join("\n");

      const prompt = `You are an ASE-certified master technician writing for car owners. For each symptom below, write a vehicle-specific overview and common causes for a ${vehicle}.

For each symptom:
- overview: 2-3 sentences explaining what this symptom typically means on a ${vehicle}. Mention model-specific quirks if applicable (common failure points, known issues for this make/model).
- causes: Array of 2-3 most common causes for this symptom specifically on a ${vehicle}. Each cause: {cause: "Cause Name", probability: 85, cost: "$200–$400"}
- cost should reflect typical US shop prices for this vehicle.

Return ONLY valid JSON:
{
  "symptom_slug": {"overview": "...", "causes": [{"cause":"...","probability":85,"cost":"$200–$400"}]}
}

Symptoms for ${vehicle}:
${batchDesc}`;

      try {
        const content = await callDeepSeek(prompt);
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) { console.log(`  Batch ${i}: no JSON`); continue; }
        const data = JSON.parse(jsonMatch[0]);

        for (const s of batch) {
          const slug = `${makeSlug}-${modelSlug}-${s.slug}`;
          if (existingSet.has(slug)) { skipped++; continue; }

          const article = data[s.slug];
          if (!article) { console.log(`  ⚠ ${s.slug} — no data`); continue; }

          const tpl = TEMPLATES[s.category] ?? TEMPLATES.starting;

          const { error } = await supabase.from("vehicle_symptoms").insert({
            slug,
            vehicle_make: make,
            vehicle_model: model,
            make_slug: makeSlug,
            model_slug: modelSlug,
            symptom_slug: s.slug,
            symptom_name: s.name,
            category: s.category,
            title: fill(tpl.title, vehicle, s.name),
            h1: fill(tpl.h1, vehicle, s.name),
            meta_description: fill(tpl.meta, vehicle, s.name),
            overview: article.overview,
            causes: article.causes || [],
          });

          if (error) {
            console.log(`  ✗ ${s.slug}: ${error.message}`);
          } else {
            generated++;
            existingSet.add(slug);
          }
        }
        const pct = Math.round((generated + skipped) / TOTAL * 100);
        console.log(`  [${pct}%] ${vehicle}: ${generated}/${TOTAL} generated, ${skipped} skipped`);
      } catch (e) {
        console.log(`  Batch error: ${e.message}`);
      }
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  console.log(`\nDone! ${generated} generated, ${skipped} skipped, ${TOTAL} total`);
}

main().catch(console.error);
