/**
 * Generate OBD diagnostic steps (verification steps + repair matching) for all OBD codes.
 *
 * Two-pass per code:
 *   Call 1: verification_steps + repair_slug matching against catalog
 *   Call 2: (only if unmatched) generate new repair for diy_difficulty
 *
 * Usage: npx dotenv -- node scripts/generate-diagnostic-steps.mjs
 */

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config({ path: ".env.local" });

const DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions";
const DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!DEEPSEEK_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing env vars: DEEPSEEK_API_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { db: { schema: "public" } });

// ── Progress tracking ──────────────────────────────────────
const PROGRESS_FILE = "diagnostic_steps_progress.json";
const RESULTS_FILE = "diagnostic_steps_results.json";

// ── Rate limiter ───────────────────────────────────────────
let lastCall = 0;
const MIN_INTERVAL = 350; // ~3 req/sec

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
        max_tokens: 2000,
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
  const match = content.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}

// ── Prompt: Verification Steps + Repair Matching ──────────
function buildCall1SystemPrompt(repairCatalog) {
  return `You are an ASE-certified master technician with 25 years of diagnostic experience. Your job is to help car owners diagnose the specific cause behind their OBD-II trouble code.

For each known cause of a trouble code, you will provide:
1. Symptom keywords — which symptoms from the code's symptom list match this cause
2. Verification steps — how the owner can check if THIS cause is their problem
3. Repair matching — map each cause to the closest repair in our catalog

## Tool levels for verification steps:
- "no_tools": Done with eyes, ears, nose, and hands only. Zero tools required.
- "basic_tools": Needs common household/shop items (screwdriver, wrench, multimeter, WD-40, flashlight)
- "obd_scanner": Needs a Bluetooth OBD-II dongle or professional scan tool to read live data
- "shop": Needs professional equipment (smoke machine, lift, compression tester, oscilloscope)

## Repair catalog (you MUST pick from this list, or leave repair_slug as null):
${repairCatalog}

## Output format — return ONLY valid JSON, no markdown, no explanation:
{
  "obd_code": "P0171",
  "causes": [
    {
      "cause_index": 0,
      "cause_description": "Vacuum leak — cracked intake boot...",
      "probability": 60,
      "symptom_keywords": ["rough idle", "hesitation", "surging"],
      "verification_steps": [
        {
          "level": "no_tools",
          "method": "Open the hood and listen near the intake manifold for a hissing sound at idle",
          "verdict": "Hear hissing → vacuum leak confirmed"
        }
      ],
      "repair_slug": "vacuum_leak",
      "repair_name": "Vacuum Leak Diagnosis & Repair",
      "repair_matched": true
    },
    {
      "cause_index": 5,
      "cause_description": "Exhaust leak before O2 sensor",
      "probability": 5,
      "symptom_keywords": ["lack of power"],
      "verification_steps": [...],
      "repair_slug": null,
      "repair_name": "Exhaust Manifold Leak Repair",
      "repair_matched": false
    }
  ]
}

## Critical rules:
- Each cause must have 3-5 verification steps, covering at least 2 different tool levels
- symptom_keywords must be drawn from or closely related to the code's known symptoms
- Probabilities across all causes for one code MUST sum to 100
- repair_slug: pick the CLOSEST match from the catalog above. If nothing matches, set to null and set repair_matched to false with a suggested repair_name
- Method descriptions must be SPECIFIC and ACTIONABLE. Never "check the sensor" — instead "Locate the MAF sensor between the air filter box and intake tube. Remove the 2 Phillips screws, unplug the electrical connector, and inspect the sensing elements for dirt or oil."
- Verdict statements: "If X is observed → this means Y"
- Write for a DIY car owner, not a mechanic. No jargon unless explained.
- Order verification steps from easiest (no_tools) to hardest (shop)`;
}

function buildCall1UserMessage(code, title, severity, symptoms, causes) {
  return `OBD Code: ${code}
Title: ${title}
Severity: ${severity}/5
Known Symptoms: ${JSON.stringify(symptoms)}
Known Causes: ${causes.map((c, i) => `${i}: ${c}`).join("\n")}`;
}

// ── Prompt: New Repair Generation ─────────────────────────
function buildCall2SystemPrompt() {
  return `You are an ASE-certified master technician. Generate accurate repair data for a new repair that was missing from our catalog.

Return ONLY valid JSON, no markdown:
{
  "repair_slug": "exhaust_manifold_leak",
  "repair_name": "Exhaust Manifold Leak Repair",
  "difficulty_label": "Intermediate",
  "est_time": "1-3 hours",
  "description": "Diagnose and repair exhaust manifold leaks. Includes gasket replacement, resurfacing if needed, and verification of proper seal.",
  "tools": ["Socket set", "Torque wrench", "Penetrating oil", "Gasket scraper"],
  "steps": [
    "Inspect exhaust manifold for visible cracks, black soot marks, or missing bolts",
    "Remove heat shield if equipped",
    "Remove manifold bolts and old gasket",
    "Clean mounting surfaces thoroughly",
    "Install new gasket and torque bolts to factory spec"
  ],
  "cost_range_low": 150,
  "cost_range_high": 400
}

Rules:
- repair_slug: lowercase, underscores, no special characters
- repair_name: human-readable, title case
- difficulty_label: one of "Beginner", "Intermediate", "Advanced"
- cost_range_low and cost_range_high: realistic USD estimates including parts + labor
- steps: 4-6 concrete numbered steps`;
}

function buildCall2UserMessage(repairName, obdCode, obdTitle) {
  return `Generate repair data for a new repair that does not exist in our catalog.

Suggested repair name: ${repairName}
Context — this repair is needed for OBD Code ${obdCode} (${obdTitle}).

Generate a realistic repair_slug, difficulty, estimated time, tools, steps, and cost range.`;
}

// ── Save progress ─────────────────────────────────────────
function saveProgress(completed, total, results) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify({ completed, total, lastUpdated: new Date().toISOString() }));
  fs.writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 2));
}

function loadProgress() {
  try { return JSON.parse(fs.readFileSync(PROGRESS_FILE, "utf-8")); } catch { return { completed: 0 }; }
}

// ── Main ───────────────────────────────────────────────────
async function main() {
  console.log("=== OBD Diagnostic Steps Generator ===\n");

  // 1. Fetch repair catalog
  console.log("Fetching repair catalog...");
  const { data: repairCatalog } = await supabase.from("diy_difficulty").select("repair_slug, repair_name").order("repair_name");
  const repairSlugs = new Set((repairCatalog ?? []).map((r) => r.repair_slug));
  const catalogText = (repairCatalog ?? []).map((r) => `- ${r.repair_slug} (${r.repair_name})`).join("\n");
  console.log(`  ${repairCatalog.length} repairs in catalog\n`);

  // 2. Check if table exists, create if needed
  console.log("Ensuring obd_diagnostic_steps table exists...");
  const { error: tableError } = await supabase.from("obd_diagnostic_steps").select("id").limit(1);
  if (tableError && tableError.code === "42P01") {
    console.log("  Table does not exist. Please run migration 029 first.");
    console.log("  Run: npx supabase db push");
    process.exit(1);
  }

  // 3. Fetch OBD codes to process
  console.log("Fetching OBD codes with causes...");
  const progress = loadProgress();
  const { data: allCodes, count } = await supabase
    .from("obd_codes")
    .select("code, title, severity, symptoms_json, causes_json", { count: "exact" })
    .not("causes_json", "is", null)
    .order("code");

  if (!allCodes || allCodes.length === 0) {
    console.log("  No codes found!");
    process.exit(1);
  }
  console.log(`  ${count} codes total\n`);

  // 4. Process codes
  const results = [];
  let completed = progress.completed || 0;
  let newRepairsCreated = 0;
  let totalCauses = 0;
  let matchedCauses = 0;

  for (let i = completed; i < allCodes.length; i++) {
    const obd = allCodes[i];
    const symptoms = obd.symptoms_json ?? [];
    const causes = obd.causes_json ?? [];

    if (causes.length === 0) continue;

    totalCauses += causes.length;

    const pct = ((i / allCodes.length) * 100).toFixed(1);
    console.log(`[${i + 1}/${allCodes.length} ${pct}%] ${obd.code} (${causes.length} causes, level ${obd.severity})`);

    // ── Call 1: Verification steps + repair matching ──────
    const content1 = await callDeepSeek(
      buildCall1SystemPrompt(catalogText),
      buildCall1UserMessage(obd.code, obd.title, obd.severity, symptoms, causes)
    );

    if (!content1) {
      console.log("  ✗ Call 1 failed, skipping");
      continue;
    }

    const parsed = parseJSON(content1);
    if (!parsed || !parsed.causes) {
      console.log(`  ✗ Failed to parse Call 1 response`);
      continue;
    }

    // ── Handle unmatched repairs (Call 2) ─────────────────
    for (const cause of parsed.causes) {
      if (!cause.repair_matched && cause.repair_name) {
        // Check if we already created this repair earlier in this session
        if (!repairSlugs.has(cause.repair_slug)) {
          console.log(`    → Missing repair: "${cause.repair_name}", generating...`);
          const content2 = await callDeepSeek(
            buildCall2SystemPrompt(),
            buildCall2UserMessage(cause.repair_name, obd.code, obd.title)
          );

          if (content2) {
            const newRepair = parseJSON(content2);
            if (newRepair && newRepair.repair_slug) {
              // Insert into diy_difficulty
              const { data: inserted, error: insertErr } = await supabase
                .from("diy_difficulty")
                .insert({
                  repair_slug: newRepair.repair_slug,
                  repair_name: newRepair.repair_name,
                  difficulty_label: newRepair.difficulty_label || "Intermediate",
                  est_time: newRepair.est_time || "Varies",
                  description: newRepair.description || "",
                  tools: newRepair.tools || [],
                  steps: newRepair.steps || [],
                })
                .select("repair_slug")
                .single();

              if (insertErr) {
                console.log(`    ✗ Failed to insert repair: ${insertErr.message}`);
                // Try again with a modified slug
                const altSlug = newRepair.repair_slug + "_repair";
                const { error: altErr } = await supabase.from("diy_difficulty").insert({
                  repair_slug: altSlug,
                  repair_name: newRepair.repair_name,
                  difficulty_label: newRepair.difficulty_label || "Intermediate",
                  est_time: newRepair.est_time || "Varies",
                  description: newRepair.description || "",
                  tools: newRepair.tools || [],
                  steps: newRepair.steps || [],
                });
                if (!altErr) {
                  newRepairsCreated++;
                  repairSlugs.add(altSlug);
                  cause.repair_slug = altSlug;
                  cause.repair_matched = true;
                  console.log(`    ✓ Created repair: ${altSlug}`);
                }
              } else {
                newRepairsCreated++;
                repairSlugs.add(newRepair.repair_slug);
                cause.repair_slug = newRepair.repair_slug;
                cause.repair_matched = true;
                console.log(`    ✓ Created repair: ${newRepair.repair_slug}`);
              }
            }
          }
        }
      }

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
      console.log(`  ✗ Failed to save: ${upsertErr.message}`);
    } else {
      results.push({
        obd_code: obd.code,
        severity: obd.severity,
        causeCount: causes.length,
        matchedCount: parsed.causes.filter((c) => c.repair_matched).length,
      });
    }

    completed = i + 1;
    if (i % 50 === 0) {
      saveProgress(completed, allCodes.length, results);
    }
  }

  // 5. Final summary
  saveProgress(completed, allCodes.length, results);
  const matchRate = totalCauses > 0 ? ((matchedCauses / totalCauses) * 100).toFixed(1) : "0";
  console.log(`\n=== Complete ===`);
  console.log(`Total codes processed: ${completed}`);
  console.log(`Total causes: ${totalCauses}`);
  console.log(`Matched repairs: ${matchedCauses} (${matchRate}%)`);
  console.log(`New repairs created: ${newRepairsCreated}`);
  console.log(`Total DeepSeek calls: ${callCount}`);

  // Clean up progress file
  try { fs.unlinkSync(PROGRESS_FILE); } catch {}
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
