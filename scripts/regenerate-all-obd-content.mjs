/**
 * Regenerate ALL OBD code content in one pass.
 *
 * For each code: calls DeepSeek to generate symptoms, causes, fixes,
 * severity, cost, and diagnostic verification steps. Upserts to both
 * obd_codes and obd_diagnostic_steps tables.
 *
 * Features:
 *   - Single code per API call (maximum quality)
 *   - 30 concurrent workers (adaptive: backs off on 429)
 *   - Checkpoint/resume (safe to interrupt and restart)
 *   - Failed codes logged to failed_codes.json
 *   - Repair matching against diy_difficulty catalog
 *
 * Usage: node scripts/regenerate-all-obd-content.mjs
 */

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { writeFileSync, existsSync, readFileSync } from "fs";

dotenv.config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions";
const DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY || !DEEPSEEK_KEY) {
  console.error("Missing env vars. Need: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, DEEPSEEK_API_KEY");
  process.exit(1);
}

const CONCURRENCY = 500;
const MAX_RETRIES = 2;
const CHECKPOINT_FILE = "regenerate_checkpoint.json";
const FAILED_FILE = "regenerate_failed.json";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  db: { schema: "public" },
});

// ── Repair Catalog ───────────────────────────────────────────────
let repairCatalog = []; // { repair_slug, repair_name, difficulty_label, est_time, diy_friendly }

async function loadRepairCatalog() {
  const { data } = await supabase
    .from("diy_difficulty")
    .select("repair_slug, repair_name, difficulty_label, est_time, diy_friendly")
    .order("repair_name");
  repairCatalog = data || [];
  console.log(`Loaded ${repairCatalog.length} repairs from catalog`);
}

// ── Prompt ───────────────────────────────────────────────────────
function buildSystemPrompt() {
  const catalogLines = repairCatalog.map(r =>
    `  - ${r.repair_slug} | ${r.repair_name} | ${r.difficulty_label} | ${r.est_time}`
  ).join("\n");

  return `You are an ASE-certified master technician with 25 years of diagnostic experience.

Generate a complete diagnostic data package for an OBD-II trouble code. Output ONLY valid JSON (no markdown, no explanation).

## Repair Catalog (match causes to these repairs by slug):
${catalogLines}

## Output Schema:
{
  "severity": <1-5: 1=cosmetic/info, 2=minor, 3=moderate, 4=serious, 5=critical—stop driving>,
  "symptoms": ["<driver-noticeable symptom>", ...],  // 3-5 specific symptoms
  "causes": ["<cause description with probability context>", ...],  // 3-6 causes, ordered by likelihood
  "fixes": ["<specific repair action with typical cost range>", ...],  // 3-5 fixes
  "min_cost": <integer USD, lowest realistic repair cost>,
  "max_cost": <integer USD, highest realistic repair cost>,
  "diagnostic_causes": [
    {
      "cause_index": 0,
      "cause_description": "<detailed cause>",
      "probability": 45,
      "symptom_keywords": ["<keyword1>", "<keyword2>"],
      "repair_slug": "<exact slug from catalog above, or null>",
      "verification_steps": [
        {
          "level": "no_tools|basic_tools|obd_scanner|shop",
          "method": "<specific actionable step, written for DIY car owner>",
          "verdict": "If <observation> → <what it means>"
        }
      ]
    }
  ]
}

## Rules:
- Each cause: 3-5 verification steps, covering >=2 tool levels, ordered easiest→hardest
- symptom_keywords: words the driver would use to describe their experience (e.g., "rough idle", "shaking", "no start")
- repair_slug: pick the CLOSEST match from catalog. If nothing matches, use null.
- Probabilities across diagnostic_causes MUST sum to 100
- Symptoms, causes, fixes must be SPECIFIC to this exact code — not generic
- Method descriptions: actionable ("Remove the 2 screws holding the sensor...") not vague ("Check the sensor")
- Verdict: "If X → Y" format
- Costs: realistic USD including parts + labor for a typical independent shop
- Write for DIY car owner, not a mechanic`;
}

function buildUserMessage(code, title) {
  return `OBD Code: ${code}\nTitle: ${title}`;
}

// ── JSON Parsing ─────────────────────────────────────────────────
function extractJSON(text) {
  if (!text) return null;

  // Remove markdown code fences
  let cleaned = text.replace(/```json\s*/gi, "").replace(/```/g, "").trim();

  // Try direct parse
  try { return JSON.parse(cleaned); } catch {}

  // Try to find JSON object boundaries
  const start = cleaned.indexOf("{");
  if (start === -1) return null;

  let depth = 0, end = -1;
  for (let i = start; i < cleaned.length; i++) {
    if (cleaned[i] === "{") depth++;
    else if (cleaned[i] === "}") { depth--; if (depth === 0) { end = i; break; } }
  }

  if (end === -1) {
    // Unclosed braces — try to fix
    const openBraces = (cleaned.match(/\{/g) || []).length;
    const closeBraces = (cleaned.match(/\}/g) || []).length;
    cleaned += "}".repeat(openBraces - closeBraces);
  } else {
    cleaned = cleaned.substring(start, end + 1);
  }

  // Fix trailing commas
  cleaned = cleaned.replace(/,\s*}/g, "}").replace(/,\s*]/g, "]");

  try { return JSON.parse(cleaned); } catch (e) {
    console.error(`  JSON parse failed: ${e.message.substring(0, 80)}`);
    return null;
  }
}

// ── Repair Matching ──────────────────────────────────────────────
function matchRepair(repairSlug) {
  if (!repairSlug) return null;
  const match = repairCatalog.find(r => r.repair_slug === repairSlug);
  if (match) return match;

  // Fuzzy match: try lowercase comparison
  const lower = repairSlug.toLowerCase();
  const fuzzy = repairCatalog.find(r => r.repair_slug.toLowerCase() === lower);
  if (fuzzy) return fuzzy;

  // Try partial match
  for (const r of repairCatalog) {
    if (r.repair_slug.includes(lower) || lower.includes(r.repair_slug)) return r;
  }

  return null;
}

// ── Validation ───────────────────────────────────────────────────
function validateOutput(parsed, code) {
  const errors = [];
  if (!parsed.severity || parsed.severity < 1 || parsed.severity > 5) errors.push("severity invalid");
  if (!Array.isArray(parsed.symptoms) || parsed.symptoms.length < 3) errors.push("symptoms < 3");
  if (!Array.isArray(parsed.causes) || parsed.causes.length < 2) errors.push("causes < 2");
  if (!Array.isArray(parsed.fixes) || parsed.fixes.length < 2) errors.push("fixes < 2");
  if (typeof parsed.min_cost !== "number" || parsed.min_cost < 0) errors.push("min_cost invalid");
  if (typeof parsed.max_cost !== "number" || parsed.max_cost < parsed.min_cost) errors.push("max_cost invalid");
  if (!Array.isArray(parsed.diagnostic_causes) || parsed.diagnostic_causes.length < 2) errors.push("diagnostic_causes < 2");

  for (const dc of (parsed.diagnostic_causes || [])) {
    if (!Array.isArray(dc.verification_steps) || dc.verification_steps.length < 2) {
      errors.push(`cause ${dc.cause_index}: verification_steps < 2`);
    }
    for (const vs of (dc.verification_steps || [])) {
      if (!vs.method || !vs.verdict) errors.push(`cause ${dc.cause_index}: step missing method/verdict`);
    }
  }

  if (errors.length > 0) {
    console.error(`  [${code}] Validation: ${errors.join("; ")}`);
    return false;
  }
  return true;
}

// ── Rate Limiter ─────────────────────────────────────────────────
let lastCallTime = 0;
const MIN_GAP_MS = 0; // minimum gap between calls (0 = no limit, DeepSeek supports 500 concurrent)

async function rateLimit() {
  const now = Date.now();
  const elapsed = now - lastCallTime;
  if (elapsed < MIN_GAP_MS) {
    await new Promise(r => setTimeout(r, MIN_GAP_MS - elapsed));
  }
  lastCallTime = Date.now();
}

// ── DeepSeek API Call ────────────────────────────────────────────
let apiCallCount = 0;

async function callDeepSeek(systemPrompt, userMessage) {
  await rateLimit();

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(DEEPSEEK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DEEPSEEK_KEY}`,
        },
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

      if (res.status === 429) {
        const waitMs = Math.min(1000 * Math.pow(2, attempt), 8000);
        console.warn(`  Rate limited (429), waiting ${waitMs}ms...`);
        await new Promise(r => setTimeout(r, waitMs));
        continue;
      }

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status}: ${text.substring(0, 100)}`);
      }

      const data = await res.json();
      apiCallCount++;
      return data.choices?.[0]?.message?.content || null;
    } catch (err) {
      if (attempt === MAX_RETRIES) throw err;
      await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
    }
  }
  return null;
}

// ── Process Single Code ──────────────────────────────────────────
async function processCode(code, title, systemPrompt) {
  const userMessage = buildUserMessage(code, title);
  const content = await callDeepSeek(systemPrompt, userMessage);

  if (!content) return { code, error: "empty_response" };

  const parsed = extractJSON(content);
  if (!parsed) return { code, error: "parse_failed" };

  if (!validateOutput(parsed, code)) return { code, error: "validation_failed" };

  // ── Upsert obd_codes ──
  const { error: codeErr } = await supabase.from("obd_codes").upsert({
    code,
    title,
    severity: parsed.severity,
    symptoms_json: parsed.symptoms,
    causes_json: parsed.causes,
    fixes_json: parsed.fixes,
    min_cost: parsed.min_cost,
    max_cost: parsed.max_cost,
  }, { onConflict: "code" });

  if (codeErr) return { code, error: `obd_codes_upsert: ${codeErr.message}` };

  // ── Build diagnostic steps with repair matching ──
  const diagCauses = (parsed.diagnostic_causes || []).map(dc => {
    const repair = matchRepair(dc.repair_slug);
    return {
      cause_index: dc.cause_index || 0,
      cause_description: dc.cause_description || "",
      probability: dc.probability || 0,
      symptom_keywords: dc.symptom_keywords || [],
      repair_slug: repair?.repair_slug || null,
      repair_name: repair?.repair_name || null,
      difficulty_label: repair?.difficulty_label || null,
      diy_friendly: repair?.diy_friendly || null,
      est_time: repair?.est_time || null,
      verification_steps: (dc.verification_steps || []).map(vs => ({
        level: vs.level || "basic_tools",
        method: vs.method || "",
        verdict: vs.verdict || "",
      })),
    };
  });

  // ── Upsert obd_diagnostic_steps ──
  const { error: diagErr } = await supabase.from("obd_diagnostic_steps").upsert({
    obd_code: code,
    causes: diagCauses,
    generated_at: new Date().toISOString(),
  }, { onConflict: "obd_code" });

  if (diagErr) return { code, error: `diagnostic_steps_upsert: ${diagErr.message}` };

  return { code, ok: true };
}

// ── Checkpoint ───────────────────────────────────────────────────
function loadCheckpoint() {
  try {
    if (existsSync(CHECKPOINT_FILE)) {
      return new Set(JSON.parse(readFileSync(CHECKPOINT_FILE, "utf-8")));
    }
  } catch {}
  return new Set();
}

function saveCheckpoint(completed) {
  writeFileSync(CHECKPOINT_FILE, JSON.stringify([...completed]));
}

function saveFailed(failed) {
  writeFileSync(FAILED_FILE, JSON.stringify(failed, null, 2));
}

// ── Main ─────────────────────────────────────────────────────────
async function main() {
  console.log("=== OBD Content Full Regeneration ===\n");

  // 1. Load repair catalog
  await loadRepairCatalog();
  const systemPrompt = buildSystemPrompt();

  // 2. Fetch all OBD codes
  console.log("Fetching OBD codes...");
  let allCodes = [];
  let page = 0;
  while (true) {
    const { data } = await supabase
      .from("obd_codes")
      .select("code, title")
      .order("code")
      .range(page * 1000, (page + 1) * 1000 - 1);
    if (!data || data.length === 0) break;
    allCodes = allCodes.concat(data);
    page++;
  }
  console.log(`  ${allCodes.length} codes total\n`);

  // 3. Load checkpoint
  const completed = loadCheckpoint();
  const remaining = allCodes.filter(c => !completed.has(c.code));
  console.log(`  Already completed: ${completed.size}`);
  console.log(`  Remaining: ${remaining.length}\n`);

  if (remaining.length === 0) {
    console.log("All codes already processed. Done.");
    return;
  }

  // 4. Process with concurrent workers
  const failed = [];
  const queue = [...remaining];
  let done = 0;
  let success = 0;
  let failCount = 0;
  const startTime = Date.now();
  let lastCheckpointSave = 0;

  async function worker(id) {
    while (queue.length > 0) {
      const item = queue.shift();
      if (!item) break;

      const result = await processCode(item.code, item.title, systemPrompt);
      done++;
      completed.add(item.code);

      if (result.ok) {
        success++;
      } else {
        failCount++;
        failed.push({ code: result.code, error: result.error });
        saveFailed(failed);
      }

      // Progress log
      const total = remaining.length;
      if (done % 100 === 0 || done === total) {
        const elapsed = ((Date.now() - startTime) / 60000).toFixed(1);
        const rate = (done / ((Date.now() - startTime) / 60000)).toFixed(1);
        const pct = ((done / total) * 100).toFixed(1);
        const eta = failCount > 0
          ? `${((total - done) / (done / ((Date.now() - startTime) / 60000))).toFixed(0)}m remaining`
          : "calculating...";
        console.log(`[${done}/${total} ${pct}% | ${elapsed}m | ~${rate}/min | ${success}✓ ${failCount}✗ | ${eta}]`);
      }

      // Save checkpoint every 200 codes or 30 seconds
      const now = Date.now();
      if (done % 200 === 0 || now - lastCheckpointSave > 30000) {
        saveCheckpoint(completed);
        lastCheckpointSave = now;
      }
    }
  }

  console.log(`Starting ${CONCURRENCY} concurrent workers...\n`);
  const workers = Array.from({ length: CONCURRENCY }, (_, i) => worker(i));
  await Promise.all(workers);

  // 5. Final save
  saveCheckpoint(completed);
  saveFailed(failed);

  const elapsed = ((Date.now() - startTime) / 60000).toFixed(1);
  console.log(`\n=== Complete in ${elapsed}m ===`);
  console.log(`  Success: ${success}`);
  console.log(`  Failed:  ${failCount}`);
  console.log(`  Total API calls: ${apiCallCount}`);
  if (failed.length > 0) {
    console.log(`  Failed codes written to ${FAILED_FILE}`);
  }
}

main().catch(err => {
  console.error("Fatal:", err);
  process.exit(1);
});
