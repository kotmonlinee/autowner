// Usage: node scripts/generate-symptom-content.mjs
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
    body: JSON.stringify({ model: "deepseek-chat", messages: [{ role: "user", content: prompt }], temperature: 0.7, max_tokens: 2000 }),
  });
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

async function main() {
  const { data: symptoms } = await supabase.from("symptoms").select("*").order("name");
  if (!symptoms) { console.error("No symptoms found"); return; }

  const total = symptoms.length;
  for (let idx = 0; idx < total; idx++) {
    const s = symptoms[idx];
    console.log(`[${idx + 1}/${total}] ${s.name}...`);

    const { data: causes } = await supabase.from("symptom_causes").select("cause_name, probability").eq("symptom_id", s.id).order("probability", { ascending: false });
    const causeList = (causes ?? []).slice(0, 5).map((c, i) => `${i + 1}. ${c.cause_name} (${c.probability}%)`).join("\n");

    const overviewPrompt = `Write a concise explanation of the automotive symptom: "${s.name}". System affected: ${s.category}. Severity: ${s.severity}. Top causes:\n${causeList}\n\nRequirements: Explain what this symptom means in plain English. Mention why these causes commonly produce this symptom. Do NOT diagnose a specific repair. Write for non-mechanics. 120-180 words. US English. Return as plain text, no markdown.`;

    const diagPrompt = `Write step-by-step diagnostic guide for: "${s.name}". Category: ${s.category}. Severity: ${s.severity}. Top causes: ${((causes ?? []).slice(0, 3).map(c => c.cause_name)).join(", ")}.\n\nRequirements: Start with easiest checks. Include OBD-II scan. Include visual inspection. Use numbered steps. Write for non-mechanics. 250-400 words. Return as HTML: <ol><li><strong>Title.</strong> Desc...</li></ol>.`;

    const drivingPrompt = `Write driving safety advice for: "${s.name}". Severity: ${s.severity}. Driving risk: ${s.driving_risk} (unsafe=do not drive, limited=short distances, safe=ok).\n\nRequirements: Start with verdict (Safe/Limited/Unsafe). Explain risks. Mention cascading damage. 150-250 words. US English. Plain text.`;

    const faqPrompt = `Generate 8 FAQ Q&A about: "${s.name}". Severity: ${s.severity}. Top causes: ${((causes ?? []).slice(0, 3).map(c => c.cause_name)).join(", ")}.\n\nRequirements: Real questions car owners ask. Include what causes it, cost, safety, DIY possibility, diagnosis steps, repair time, consequences of ignoring. Short answers. US English. Return JSON array: [{"q": "...", "a": "..."}]. Only JSON.`;

    const [overview, diagnosis, driving, faq] = await Promise.all([
      callDeepSeek(overviewPrompt),
      callDeepSeek(diagPrompt),
      callDeepSeek(drivingPrompt),
      callDeepSeek(faqPrompt),
    ]);

    await supabase.from("symptoms").update({
      overview: overview.trim(),
      diagnosis_steps: diagnosis.trim(),
      driving_advice: driving.trim(),
      faq_items: faq.trim(),
    }).eq("id", s.id);

    console.log(`  ✓ overview:${overview.length}c diag:${diagnosis.length}c drive:${driving.length}c faq:${faq.length}c`);
    await new Promise(r => setTimeout(r, 1000));
  }
  console.log(`\nDone! ${total} symptoms processed.`);
}

main().catch(console.error);
