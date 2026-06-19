/**
 * AI labels each fix text with the correct repair_slug.
 * Index-aligned: fixes_json[i] ↔ fix_repair_slugs[i]
 * Usage: node scripts/tag-fix-repairs.mjs
 */
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const DK = process.env.DEEPSEEK_API_KEY;

// ── Repair catalog ──
const { data: rc } = await s.from("repair_costs").select("repair_slug");
const allSlugs = [...new Set((rc || []).map(r => r.repair_slug))];
console.log(`${allSlugs.length} repair types`);

const catalogLines = allSlugs.map(slug =>
  `  ${slug} (${slug.replace(/_/g, " ")})`
).join("\n");

const SYSTEM = `You are an ASE master tech. For each fix description, assign the SINGLE most appropriate repair_slug from the catalog below. If nothing matches, use null.

## Repair Catalog:
${catalogLines}

## Input format: JSON array of fix items
[{"code":"P0171","fix_index":0,"text":"Inspect and repair vacuum leaks - $150-$400"},
 {"code":"P0171","fix_index":1,"text":"Clean or replace Mass Air Flow sensor - $50-$200"}]

## Output format: JSON array with repair_slug assigned
[{"code":"P0171","fix_index":0,"repair_slug":"vacuum_leak"},
 {"code":"P0171","fix_index":1,"repair_slug":"mass_air_flow_sensor"}]

Rules:
- Use EXACT repair_slug values from the catalog above
- Match based on the fix text, not the code
- Assign null only if genuinely no match exists
- Return ONLY valid JSON array (no markdown, no explanation)`;

// ── Load all fixes ──
console.log("Loading fixes...");
let allRows = [];
let rs = 0;
while (true) {
  const { data } = await s.from("obd_codes").select("code,fixes_json").range(rs, rs + 999);
  if (!data?.length) break;
  for (const row of data) {
    if ((row.fixes_json || []).length > 0) allRows.push(row);
  }
  rs += 1000;
}
console.log(`${allRows.length} codes with fixes`);

// ── Flatten into fix items ──
const items = [];
for (const row of allRows) {
  const fixes = row.fixes_json || [];
  fixes.forEach((text, i) => {
    if (text.trim()) items.push({ code: row.code, fix_index: i, text });
  });
}
console.log(`${items.length} total fix items`);

// ── Process in batches ──
const BATCH = 50;
const CONCURRENCY = 200;
let completed = 0;
const results = [];
let apiCalls = 0;

async function processBatch(batch) {
  const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${DK}` },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: JSON.stringify(batch.map(it => ({ code: it.code, fix_index: it.fix_index, text: it.text }))) },
      ],
      temperature: 0.1,
      max_tokens: 8000,
    }),
  });
  apiCalls++;
  if (!res.ok) {
    console.error(`  HTTP ${res.status}`);
    return [];
  }
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content || "";
  try {
    return JSON.parse(content.replace(/```json\n?|```/g, "").trim());
  } catch {
    return [];
  }
}

const queue = [...items];
async function worker() {
  while (queue.length > 0) {
    const batch = queue.splice(0, BATCH);
    if (!batch.length) break;
    const matches = await processBatch(batch);
    for (const m of matches) {
      if (m.repair_slug === undefined) continue; // skip invalid
      if (m.repair_slug === null || allSlugs.includes(m.repair_slug)) {
        results.push(m);
      }
    }
    completed += batch.length;
    if (completed % 5000 === 0 || completed >= items.length) {
      console.log(`  ${completed}/${items.length} (${(completed / items.length * 100).toFixed(0)}%) | ${apiCalls} API calls`);
    }
  }
}

console.log(`Starting ${CONCURRENCY} workers...`);
const workers = Array.from({ length: CONCURRENCY }, () => worker());
await Promise.all(workers);
console.log(`${results.length}/${items.length} matched (${(results.length / items.length * 100).toFixed(1)}%) | ${apiCalls} API calls`);

// ── Apply to database ──
console.log("Applying to database...");
// Group by code
const byCode = new Map();
for (const r of results) {
  if (!byCode.has(r.code)) byCode.set(r.code, []);
  byCode.get(r.code).push({ index: r.fix_index, slug: r.repair_slug });
}

let applied = 0;
for (const [code, entries] of byCode) {
  const { data } = await s.from("obd_codes").select("fixes_json").eq("code", code).single();
  const fixes = data?.fixes_json || [];
  const slugs = new Array(fixes.length).fill(null);
  for (const { index, slug } of entries) {
    if (index < slugs.length) slugs[index] = slug;
  }
  await s.from("obd_codes").update({ fix_repair_slugs: slugs }).eq("code", code);
  applied++;
}

console.log(`Applied to ${applied} codes`);
