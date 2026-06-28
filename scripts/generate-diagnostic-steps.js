/**
 * Generate OBD diagnostic steps (verification steps + repair matching) for all OBD codes.
 *
 * Two-pass per code:
 *   Call 1: verification_steps + repair_slug matching against catalog
 *   Call 2: (only if unmatched) generate new repair for diy_difficulty
 *
 * Usage: node scripts/generate-diagnostic-steps.js
 */

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });
const fs = require("fs");

const DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions";
const DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!DEEPSEEK_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing env vars");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { db: { schema: "public" } });

// ── Progress tracking ──────────────────────────────────────
const PROGRESS_FILE = "diagnostic_steps_progress.json";
const RESULTS_FILE = "diagnostic_steps_results.json";

// ── Rate limiter ───────────────────────────────────────────
let lastCall = 0;
const MIN_INTERVAL = 100; // ~10 req/sec
const PARALLEL = 3;       // Process codes in parallel

async function rateLimit() {
  const now = Date.now();
  const elapsed = now - lastCall;
  if (elapsed < MIN_INTERVAL) {
    await new Promise((r) => setTimeout(r, MIN_INTERVAL - elapsed));
  }
  lastCall = Date.now();
}

// ── DeepSeek helpers ──────────────────────────────────────
let callCount = 0;

async function callDeepSeek(systemPrompt, userMessage) {
  await rateLimit();
  callCount++;
  try {
    const res = await fetch(DEEPSEEK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${DEEPSEEK_KEY}` },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        temperature: 0.3,
        max_tokens: 4000,
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`DeepSeek ${res.status}: ${text.substring(0, 200)}`);
    }
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? "";
  } catch (err) {
    console.error(`  DeepSeek error (call #${callCount}): ${err.message}`);
    return null;
  }
}

function parseJSON(content) {
  if (!content) return null;

  // Find JSON boundaries by tracking brace depth
  const start = content.indexOf("{");
  if (start === -1) return null;

  let depth = 0;
  let end = -1;
  for (let i = start; i < content.length; i++) {
    if (content[i] === "{") depth++;
    else if (content[i] === "}") { depth--; if (depth === 0) { end = i; break; } }
  }

  let slice = end > start ? content.substring(start, end + 1) : content.substring(start);

  // Fix common LLM JSON issues
  slice = slice
    .replace(/,\s*}/g, "}")       // trailing comma before }
    .replace(/,\s*]/g, "]");      // trailing comma before ]

  if (end === -1) {
    // JSON is truncated — try to recover by closing open structures
    slice += "]".repeat((slice.match(/([^\\]|^)\[/g) || []).length - (slice.match(/([^\\]|^)\]/g) || []).length);
    slice += "}".repeat(depth);
  }

  try {
    return JSON.parse(slice);
  } catch (e1) {
    // Try removing last incomplete array item
    try {
      const fixed = slice.replace(/,\s*\{[^}]*$/g, "]");
      return JSON.parse(fixed);
    } catch (e2) {
      return null;
    }
  }
}

// ── Prompt: Verification Steps + Repair Matching ──────────
function buildCall1SystemPrompt() {
  return `You are an ASE-certified master technician with 25 years of diagnostic experience. Help car owners diagnose the specific cause behind their OBD-II trouble code.

For each known cause, provide:
1. symptom_keywords — which symptoms from the code's symptom list match
2. probability — how likely this cause is (all must sum to 100)
3. verification_steps — how to check if THIS cause is their problem

Tool levels: "no_tools" (eyes/ears/nose), "basic_tools" (screwdriver/multimeter/WD-40), "obd_scanner" (Bluetooth scanner), "shop" (smoke machine/lift)

Return ONLY valid JSON, no markdown:
{
  "obd_code": "P0171",
  "causes": [
    {
      "cause_index": 0,
      "probability": 60,
      "symptom_keywords": ["rough idle", "hesitation"],
      "verification_steps": [
        { "level": "no_tools", "method": "Open hood and listen for hissing sound at idle near intake", "verdict": "Hissing sound → vacuum leak confirmed" }
      ]
    }
  ]
}

RULES:
- 3-5 verification steps per cause, spanning at least 2 tool levels
- symptom_keywords from the code's symptom list
- Probabilities sum to 100 across all causes
- Methods: SPECIFIC and ACTIONABLE. "Locate the MAF sensor, remove 2 screws, inspect element for dirt" not "check sensor"
- Verdict: "If X observed → this means Y"
- For DIY owners. Order steps easiest to hardest`;
}

function buildCall1UserMessage(code, title, severity, symptoms, causes) {
  return `OBD Code: ${code}
Title: ${title}
Severity: ${severity}/5
Known Symptoms: ${JSON.stringify(symptoms)}
Known Causes:
${causes.map((c, i) => `${i}: ${c}`).join("\n")}`;
}

// ── Prompt: New Repair Generation ─────────────────────────
function buildCall2SystemPrompt() {
  return `You are an ASE-certified master technician. Generate accurate repair data for a new repair missing from our catalog.

Return ONLY valid JSON, no markdown:
{
  "repair_slug": "exhaust_manifold_leak",
  "repair_name": "Exhaust Manifold Leak Repair",
  "difficulty_label": "Intermediate",
  "difficulty_level": 3,
  "diy_friendly": "Yes",
  "est_time": "1-3 hours",
  "risk_level": "Medium",
  "tools": "Socket set, Torque wrench, Penetrating oil, Gasket scraper, Safety glasses",
  "safety": "Work on a cold engine only. Disconnect battery negative terminal before starting."
}

Rules:
- repair_slug: lowercase_underscores, no special chars, under 40 chars
- repair_name: title case, clear, descriptive
- difficulty_label: "Beginner", "Intermediate", or "Advanced"
- difficulty_level: 1-5 (1=beginner, 3=intermediate, 5=expert)
- diy_friendly: "Yes" or "No"
- est_time: realistic time including diagnosis
- risk_level: "Low", "Medium", or "High"
- tools: comma-separated string of commonly needed tools
- safety: 1-2 sentences of key safety precautions`;
}

function buildCall2UserMessage(repairName, obdCode, obdTitle) {
  return `Generate repair data for a new repair item:
Suggested name: ${repairName}
Needed for OBD Code: ${obdCode} (${obdTitle})
Provide realistic difficulty, time, tools, steps, and cost range.`;
}

// ── Save progress ─────────────────────────────────────────
function saveProgress(completed, total, results) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify({ completed, total, lastUpdated: new Date().toISOString() }));
  fs.writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 2));
}

// ── Main ───────────────────────────────────────────────────
async function main() {
  console.log("=== OBD Diagnostic Steps Generator ===\n");

  // 1. Fetch repair catalog
  console.log("Fetching repair catalog...");
  const { data: repairCatalog, error: catErr } = await supabase.from("diy_difficulty").select("repair_slug, repair_name").order("repair_name");
  if (catErr) { console.error("Failed to fetch catalog:", catErr.message); process.exit(1); }
const catalogText = (repairCatalog ?? []).map((r) => `- ${r.repair_slug} (${r.repair_name})`).join("\n");
  console.log(`  ${repairCatalog.length} repairs in catalog\n`);

  // 2. Fetch ALL OBD codes with causes (paginate to bypass 1000-row limit)
  console.log("Fetching OBD codes with causes...");
  let allCodes = [];
  let page = 0;
  const pageSize = 1000;
  while (true) {
    const { data: batch, error: batchErr } = await supabase
      .from("obd_codes")
      .select("code, title, severity, symptoms_json, causes_json")
      .not("causes_json", "is", null)
      .order("code")
      .range(page * pageSize, (page + 1) * pageSize - 1);
    if (batchErr) { console.error("Fetch error:", batchErr.message); process.exit(1); }
    if (!batch || batch.length === 0) break;
    allCodes = allCodes.concat(batch);
    console.log(`  Page ${page + 1}: fetched ${batch.length} codes (total: ${allCodes.length})`);
    page++;
  }
  const count = allCodes.length;

  // 3. Process codes
  const results = [];
  let totalCauses = 0;
  let matchedCauses = 0;
  let skipped = 0;
  let failed = 0;

  const startTime = Date.now();

  for (let i = 0; i < allCodes.length; i++) {
    const obd = allCodes[i];
    const symptoms = obd.symptoms_json ?? [];
    const causes = obd.causes_json ?? [];

    if (causes.length === 0) continue;
    totalCauses += causes.length;

    const pct = ((i / allCodes.length) * 100).toFixed(1);
    const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
    console.log(`[${i + 1}/${allCodes.length} ${pct}% | ${elapsed}m] ${obd.code} (${causes.length} causes, sev ${obd.severity})`);

    // ── Call 1: Verification steps + repair matching ──────
    const content1 = await callDeepSeek(
      buildCall1SystemPrompt(),
      buildCall1UserMessage(obd.code, obd.title, obd.severity, symptoms, causes)
    );

    if (!content1) { failed++; console.log("  ✗ Call 1 failed"); continue; }

    const parsed = parseJSON(content1);
    if (!parsed || !parsed.causes || !Array.isArray(parsed.causes)) {
      console.log(`  ✗ Failed to parse causes array`);
      failed++;
      continue;
    }

    // ── Repair matching stats (Call 2 skipped — run separately) ──
    for (const cause of parsed.causes) {
      cause.symptom_keywords = cause.symptom_keywords || [];
      cause.verification_steps = cause.verification_steps || [];
      if (cause.repair_matched) matchedCauses++;
    }

    // ── Save to database ──────────────────────────────────
    const { error: upsertErr } = await supabase
      .from("obd_diagnostic_steps")
      .upsert({
        obd_code: obd.code,
        causes: parsed.causes,
        generated_at: new Date().toISOString(),
      }, { onConflict: "obd_code" });

    if (upsertErr) {
      console.log(`  ✗ Save error: ${upsertErr.message}`);
      failed++;
    } else {
      results.push({ obd_code: obd.code, severity: obd.severity, causes: causes.length, matched: parsed.causes.filter((c) => c.repair_matched).length });
    }

    // Periodic progress save
    if (i % 100 === 0 && i > 0) {
      saveProgress(i + 1, allCodes.length, results);
    }
  }

  // 5. Final summary
  saveProgress(allCodes.length, allCodes.length, results);
  const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
  console.log(`\n=== Complete in ${elapsed}m ===`);
  console.log(`Total processed: ${results.length}`);
  console.log(`Total causes: ${totalCauses}`);
  console.log(`Matched repairs: ${matchedCauses} (${totalCauses > 0 ? ((matchedCauses / totalCauses) * 100).toFixed(1) : "0"}%)`);
  console.log(`Failed: ${failed}`);
  console.log(`DeepSeek calls: ${callCount}`);

  try { fs.unlinkSync(PROGRESS_FILE); } catch {}
}

main().catch((err) => { console.error("Fatal:", err); process.exit(1); });
