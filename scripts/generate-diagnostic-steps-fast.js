/**
 * Fast OBD diagnostic steps generator with parallel processing.
 * Usage: node scripts/generate-diagnostic-steps-fast.js
 */

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });
const fs = require("fs");

const DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions";
const DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const CONCURRENCY = 5;

if (!DEEPSEEK_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing env vars");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { db: { schema: "public" } });

const SYSTEM_PROMPT = `ASE master tech. Generate diagnostic verification steps for OBD codes.

Tool levels: no_tools, basic_tools, obd_scanner, shop.

JSON format:
{
  "code": "P0171",
  "causes": [
    {
      "i": 0,
      "prob": 60,
      "kw": ["rough idle"],
      "steps": [
        {"t": "no_tools", "do": "Listen for hissing sound near intake at idle", "if": "Hissing → vacuum leak"}
      ]
    }
  ]
}

Rules: 3-5 steps/cause. 2+ tool levels. probs sum to 100. Specific actions. "if X → means Y" format.`;

let callCount = 0;
let lastCall = 0;

async function diagnose(obd) {
  const causes = obd.causes_json ?? [];
  if (!causes.length) return null;

  // Rate limit
  const now = Date.now();
  const wait = Math.max(0, 100 - (now - lastCall));
  if (wait) await new Promise(r => setTimeout(r, wait));
  lastCall = Date.now();
  callCount++;

  try {
    const res = await fetch(DEEPSEEK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${DEEPSEEK_KEY}` },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `${obd.code} | ${obd.title} | sev ${obd.severity}/5\nSymptoms: ${JSON.stringify(obd.symptoms_json ?? [])}\nCauses:\n${causes.map((c,i)=>`${i}: ${c}`).join("\n")}` }
        ],
        temperature: 0.3, max_tokens: 3000,
      }),
    });

    if (!res.ok) return { code: obd.code, error: `HTTP ${res.status}`, causes: causes.length };

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Parse JSON
    const start = content.indexOf("{");
    if (start === -1) return { code: obd.code, error: "no_json", causes: causes.length };

    let depth = 0, end = -1;
    for (let i = start; i < content.length; i++) {
      if (content[i] === "{") depth++;
      else if (content[i] === "}") { depth--; if (depth === 0) { end = i; break; } }
    }

    let slice = end > start ? content.substring(start, end + 1) : content.substring(start);
    slice = slice.replace(/,\s*}/g, "}").replace(/,\s*]/g, "]");

    if (end === -1) {
      const opens = (slice.match(/\{/g) || []).length;
      const closes = (slice.match(/\}/g) || []).length;
      slice += "}".repeat(opens - closes);
    }

    const parsed = JSON.parse(slice);
    if (!parsed.causes?.length) return { code: obd.code, error: "no_causes", causes: causes.length };

    // Normalize & map to DB schema
    const dbCauses = parsed.causes.map(c => ({
      cause_index: c.i ?? 0,
      probability: c.prob ?? 0,
      symptom_keywords: c.kw || [],
      verification_steps: (c.steps || []).map(s => ({
        level: s.t || "basic_tools",
        method: s.do || "",
        verdict: s.if || "",
      })),
    }));

    const { error: saveErr } = await supabase.from("obd_diagnostic_steps").upsert({
      obd_code: obd.code,
      causes: dbCauses,
      generated_at: new Date().toISOString(),
    }, { onConflict: "obd_code" });

    return { code: obd.code, error: saveErr?.message || null, causes: dbCauses.length };

  } catch (err) {
    return { code: obd.code, error: err.message.substring(0, 50), causes: causes.length };
  }
}

async function main() {
  console.log("=== Fast OBD Diagnostic Steps Generator ===\n");

  // Fetch ALL codes
  console.log("Fetching OBD codes...");
  let allCodes = [];
  let page = 0;
  while (true) {
    const { data: batch } = await supabase
      .from("obd_codes")
      .select("code, title, severity, symptoms_json, causes_json")
      .not("causes_json", "is", null)
      .order("code")
      .range(page * 1000, (page + 1) * 1000 - 1);
    if (!batch || batch.length === 0) break;
    allCodes = allCodes.concat(batch);
    console.log(`  Page ${page + 1}: ${batch.length} codes (total: ${allCodes.length})`);
    page++;
  }

  const total = allCodes.length;
  console.log(`\nProcessing ${total} codes with concurrency ${CONCURRENCY}\n`);

  let done = 0;
  let failed = 0;
  let success = 0;
  let totalCauses = 0;
  const startTime = Date.now();

  // Process with sliding window concurrency
  const queue = [...allCodes];
  const inFlight = new Set();

  async function worker() {
    while (queue.length > 0) {
      const obd = queue.shift();
      if (inFlight.has(obd.code)) continue;
      inFlight.add(obd.code);

      const result = await diagnose(obd);
      done++;
      totalCauses += result?.causes || 0;

      if (result?.error) {
        failed++;
        if (failed <= 20 || failed % 50 === 0) console.log(`[${done}/${total}] ${result.code} ✗ ${result.error}`);
      } else {
        success++;
      }

      inFlight.delete(obd.code);

      // Progress
      if (done % 100 === 0) {
        const elapsed = ((Date.now() - startTime) / 60000).toFixed(1);
        const rate = (done / ((Date.now() - startTime) / 60000)).toFixed(1);
        console.log(`[${done}/${total} ${(done/total*100).toFixed(1)}% | ${elapsed}m | ${rate}/min | ${failed}f]`);
        fs.writeFileSync("diag_progress.json", JSON.stringify({ done, total, failed, success, elapsed }));
      }
    }
  }

  // Launch workers
  const workers = Array.from({ length: CONCURRENCY }, () => worker());
  await Promise.all(workers);

  const elapsed = ((Date.now() - startTime) / 60000).toFixed(1);
  console.log(`\n=== Complete in ${elapsed}m ===`);
  console.log(`Success: ${success}, Failed: ${failed}, Total: ${done}`);
  console.log(`DeepSeek calls: ${callCount}`);

  try { fs.unlinkSync("diag_progress.json"); } catch {}
}

main().catch(err => { console.error("Fatal:", err); process.exit(1); });
