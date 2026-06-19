/**
 * AI-only repair slug matching. Does NOT regenerate any content —
 * only matches cause_description to the repair catalog.
 *
 * Usage: node scripts/ai-repair-match.mjs
 */
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const DK = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions";

// Load repair catalog
const { data: rc } = await s.from("repair_costs").select("repair_slug");
const allSlugs = [...new Set((rc || []).map(r => r.repair_slug))];
console.log(`${allSlugs.length} repair types`);

const catalogText = allSlugs.map(s => {
  const readable = s.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  return `  ${s} (${readable})`;
}).join("\n");

// Build system prompt
const SYSTEM = `You are an ASE master tech. Match each diagnostic cause to the SINGLE most appropriate repair from the catalog.

## Repair Catalog:
${catalogText}

## Input: a JSON array of causes with code and description
## Output: the same array with "repair_slug" filled in (exact slug from catalog, or null if nothing matches)

Example input:
[{"code":"P0171","cause_index":0,"desc":"Vacuum leak from cracked intake boot or leaking intake manifold gasket"}]

Example output:
[{"code":"P0171","cause_index":0,"repair_slug":"intake_manifold_gasket"}]

Rules:
- Only use exact slugs from the catalog. Never invent new ones.
- Match based on the CAUSE DESCRIPTION, not the code.
- If genuinely no match in catalog, use null.
- Return ONLY valid JSON array, no markdown, no explanation.`;

// Load all diagnostic causes
console.log("Loading diagnostic causes...");
const allCauses = []; // {code, cause_index, desc}
const diagMap = new Map();
let rs = 0;
while (true) {
  const { data } = await s.from("obd_diagnostic_steps").select("obd_code,causes").range(rs, rs + 999);
  if (!data?.length) break;
  for (const row of data) {
    const causes = [];
    for (const c of (row.causes || [])) {
      const desc = c.cause_description || "";
      if (desc.trim()) {
        allCauses.push({ code: row.obd_code, cause_index: c.cause_index || 0, desc });
      }
    }
    diagMap.set(row.obd_code, causes);
  }
  rs += 1000;
}
console.log(`${allCauses.length} causes across ${diagMap.size} codes`);

// Process in batches
const BATCH = 50;
const CONCURRENCY = 200;
let completed = 0;
let apiCalls = 0;
const queue = [...allCauses];
const results = []; // {code, cause_index, repair_slug}

async function processBatch(batch) {
  const res = await fetch(DEEPSEEK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${DK}` },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: JSON.stringify(batch.map(c => ({ code: c.code, cause_index: c.cause_index, desc: c.desc }))) },
      ],
      temperature: 0.1,
      max_tokens: 4000,
    }),
  });
  apiCalls++;
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error(`  HTTP ${res.status}: ${text.substring(0, 100)}`);
    return [];
  }
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content || "";
  try {
    const cleaned = content.replace(/```json\n?|```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed)) return parsed;
    // Sometimes wrapped in an object
    if (parsed.causes) return parsed.causes;
    return [];
  } catch (e) {
    console.error(`  Parse error: ${e.message}`);
    return [];
  }
}

async function worker() {
  while (queue.length > 0) {
    const batch = queue.splice(0, BATCH);
    if (!batch.length) break;
    const matches = await processBatch(batch);
    for (const m of matches) {
      if (m.repair_slug && allSlugs.includes(m.repair_slug)) {
        results.push(m);
      }
    }
    completed += batch.length;
    if (completed % 5000 === 0 || completed >= allCauses.length) {
      console.log(`  ${completed}/${allCauses.length} (${(completed / allCauses.length * 100).toFixed(0)}%) | ${apiCalls} API calls`);
    }
  }
}

console.log(`Starting ${CONCURRENCY} workers, batch size ${BATCH}...`);
const workers = Array.from({ length: CONCURRENCY }, () => worker());
await Promise.all(workers);
console.log(`Done. ${results.length} matches from ${apiCalls} API calls`);

// Apply results to database
console.log("Applying matches...");
// Group results by code
const byCode = new Map();
for (const r of results) {
  if (!byCode.has(r.code)) byCode.set(r.code, []);
  byCode.get(r.code).push(r);
}

let applied = 0;
for (const [code, matches] of byCode) {
  const { data } = await s.from("obd_diagnostic_steps").select("causes").eq("obd_code", code).single();
  if (!data?.causes) continue;
  const causes = [...data.causes];
  let changed = false;
  for (const m of matches) {
    const idx = causes.findIndex(c => c.cause_index === m.cause_index);
    if (idx >= 0) {
      causes[idx] = { ...causes[idx], repair_slug: m.repair_slug };
      changed = true;
    }
  }
  if (changed) {
    await s.from("obd_diagnostic_steps").update({ causes }).eq("obd_code", code);
    applied++;
  }
}
console.log(`Applied to ${applied} codes`);

// Check final coverage
let withRepair = 0, total = 0;
rs = 0;
while (true) {
  const { data } = await s.from("obd_diagnostic_steps").select("causes").range(rs, rs + 999);
  if (!data?.length) break;
  for (const row of data) {
    total++;
    if ((row.causes || []).some(c => c.repair_slug)) withRepair++;
  }
  rs += 1000;
}
console.log(`Final: ${withRepair}/${total} codes have repair (${(withRepair / total * 100).toFixed(1)}%)`);
