// Usage: npx ts-node scripts/generate-symptom-content.ts
// Generates AI content for all symptom pages and stores in DB

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions";
const DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY ?? "";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

if (!DEEPSEEK_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing env vars: DEEPSEEK_API_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

interface Symptom { id: string; name: string; slug: string; category: string; severity: string; driving_risk: string; }
interface Cause { cause_name: string; probability: number; repair_slug: string | null; }

async function callDeepSeek(prompt: string): Promise<string> {
  const res = await fetch(DEEPSEEK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${DEEPSEEK_KEY}` },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7, max_tokens: 2000,
    }),
  });
  const data = await res.json() as any;
  return data.choices?.[0]?.message?.content ?? "";
}

function buildOverviewPrompt(s: Symptom, causes: Cause[]): string {
  const causeList = causes.slice(0, 5).map((c, i) => `${i+1}. ${c.cause_name} (${c.probability}% probability)`).join("\n");
  return `Write a concise explanation of the automotive symptom: "${s.name}".

System: ${s.category === "vibration" ? "engine, drivetrain, or suspension" : s.category}
Severity: ${s.severity} (critical=stop driving, high=serious, medium=schedule soon, low=monitor)

Top causes:
${causeList}

Requirements:
- Explain what this symptom means in plain English
- Mention why these causes commonly produce this symptom
- Do NOT diagnose a specific repair
- Write for non-mechanics with no technical knowledge
- 120-180 words
- US English
- Return as plain text, no markdown, no bullet points`;
}

function buildDiagnosisPrompt(s: Symptom, causes: Cause[]): string {
  const causeNames = causes.slice(0, 5).map(c => c.cause_name).join(", ");
  return `Write a step-by-step diagnostic guide for the automotive symptom: "${s.name}".

Category: ${s.category}
Severity: ${s.severity}
Top causes: ${causeNames}

Requirements:
- Start with the easiest/cheapest checks first
- Include visual inspection guidance
- Include OBD-II scanner recommendations
- Include road test / behavior observation where relevant
- Use numbered steps
- Write for non-mechanics (simple language)
- 250-400 words
- US English
- Return as HTML: <ol><li><strong>Step title.</strong> Description...</li>...</ol>`;
}

function buildDrivingAdvicePrompt(s: Symptom): string {
  return `Write driving safety advice for someone experiencing: "${s.name}".

Severity: ${s.severity}
Driving risk: ${s.driving_risk} (unsafe=do not drive, limited=short distances only, safe=ok to drive)

Requirements:
- Start with a clear verdict: Safe / Limited / Unsafe
- Explain the risks of continuing to drive
- Mention potential cascading damage if ignored
- Recommend when to tow vs drive to a shop
- 150-250 words
- US English
- Return as plain text, no markdown`;
}

function buildFaqPrompt(s: Symptom, causes: Cause[]): string {
  const causeNames = causes.slice(0, 3).map(c => c.cause_name).join(", ");
  return `Generate 8 FAQ questions and answers about the automotive symptom: "${s.name}".

Severity: ${s.severity}
Driving risk: ${s.driving_risk}
Top causes: ${causeNames}

Requirements:
- Real questions car owners actually ask
- Include: what causes it, cost, safety, DIY possibility, diagnosis steps, repair time, consequences of ignoring, how to prevent
- Short direct answers
- US English
- Return as JSON array: [{"q": "...", "a": "..."}, ...]
- Only the JSON, no other text`;
}

async function main() {
  // Fetch all symptoms
  const { data: symptoms } = await supabase.from("symptoms").select("*").order("name");
  if (!symptoms) { console.error("No symptoms found"); return; }

  const total = symptoms.length;
  let done = 0;

  for (const s of symptoms as Symptom[]) {
    console.log(`[${++done}/${total}] ${s.name}...`);

    // Fetch causes
    const { data: causes } = await supabase.from("symptom_causes").select("cause_name, probability, repair_slug").eq("symptom_id", s.id).order("probability", { ascending: false });
    const causeList = (causes ?? []) as Cause[];

    // Generate content
    const [overview, diagnosisSteps, drivingAdvice, faqJson] = await Promise.all([
      callDeepSeek(buildOverviewPrompt(s, causeList)),
      callDeepSeek(buildDiagnosisPrompt(s, causeList)),
      callDeepSeek(buildDrivingAdvicePrompt(s)),
      callDeepSeek(buildFaqPrompt(s, causeList)),
    ]);

    // Store in DB
    await supabase.from("symptoms").update({
      overview: overview.trim(),
      diagnosis_steps: diagnosisSteps.trim(),
      driving_advice: drivingAdvice.trim(),
      faq_items: faqJson.trim(),
    }).eq("id", s.id);

    console.log(`  ✓ stored (overview: ${overview.length}c, diagnosis: ${diagnosisSteps.length}c, advice: ${drivingAdvice.length}c)`);

    // Rate limit: 1 second between requests
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log(`\nDone! ${total} symptoms processed.`);
}

main().catch(console.error);
