// Usage: node scripts/verify-consistency.mjs
// Verifies bidirectional OBD ↔ repair consistency via knowledge graph
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const env = {};
readFileSync(".env.local", "utf8").split("\n").forEach(l => {
  const p = l.split("=");
  if (p.length > 1) env[p[0].trim()] = p.slice(1).join("=").trim();
});
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function obdToRepair(code) {
  // symptom_obd_codes → symptom_causes → diy_difficulty
  const { data: j } = await supabase.from("symptom_obd_codes").select("symptom_id").eq("obd_code", code);
  const sids = [...new Set((j ?? []).map(r => r.symptom_id))];
  if (!sids.length) return [];
  const { data: c } = await supabase.from("symptom_causes").select("repair_slug").in("symptom_id", sids);
  const slugs = [...new Set((c ?? []).map(r => r.repair_slug).filter(Boolean))];
  if (!slugs.length) return [];
  const { data: d } = await supabase.from("diy_difficulty").select("repair_slug, repair_name").in("repair_slug", slugs);
  return (d ?? []).map(r => ({ slug: r.repair_slug, name: r.repair_name }));
}

async function repairToObd(slug) {
  // symptom_causes → symptom_obd_codes
  const { data: c } = await supabase.from("symptom_causes").select("symptom_id").eq("repair_slug", slug);
  const sids = [...new Set((c ?? []).map(r => r.symptom_id))];
  if (!sids.length) return [];
  const { data: j } = await supabase.from("symptom_obd_codes").select("obd_code").in("symptom_id", sids);
  return [...new Set((j ?? []).map(r => r.obd_code))].sort();
}

const TEST_CODES = ["P0300","P0301","P0420","P0171","P0455","P0700","P0128","P0562","C0035"];

console.log("=== Bidirectional Consistency Verification ===\n");

let pass = 0, fail = 0;

for (const code of TEST_CODES) {
  console.log(`─ OBD ${code} ─`);
  const repairs = await obdToRepair(code);
  if (repairs.length === 0) {
    console.log(`  ⚠ No repairs found in knowledge graph (may not be mapped yet)`);
    continue;
  }
  console.log(`  Repairs: ${repairs.map(r => r.name).join(", ")}`);

  for (const r of repairs) {
    const codes = await repairToObd(r.slug);
    if (codes.includes(code)) {
      console.log(`  ✅ ${r.name} → includes ${code}`);
      pass++;
    } else {
      console.log(`  ❌ ${r.name} → does NOT include ${code} (has: ${codes.join(", ") || "none"})`);
      fail++;
    }
  }
  console.log();
}

// Also test random repairs
const { data: randomRepairs } = await supabase.from("diy_difficulty").select("repair_slug, repair_name").limit(5);
console.log("─ Random Repairs ─");
for (const r of (randomRepairs ?? [])) {
  const codes = await repairToObd(r.repair_slug);
  console.log(`  ${r.repair_name}: ${codes.length > 0 ? codes.join(", ") : "no OBD codes mapped"}`);
  if (codes.length > 0) {
    for (const code of codes.slice(0, 3)) {
      const repairs = await obdToRepair(code);
      const match = repairs.some(rp => rp.slug === r.repair_slug);
      console.log(`  ${match ? "✅" : "❌"} ${code} → ${match ? "includes" : "missing"} ${r.repair_name}`);
      if (match) pass++; else fail++;
    }
  }
}

console.log(`\n${pass} passed, ${fail} failed, ${Math.round(pass/(pass+fail)*100)}% consistent`);
