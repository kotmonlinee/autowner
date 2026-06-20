/**
 * Match each diagnosis cause to a repair_slug using keyword matching.
 * Usage: node scripts/match-cause-repairs.mjs
 */
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const { data: rc } = await s.from("repair_costs").select("repair_slug");
const slugs = [...new Set((rc || []).map(r => r.repair_slug))];
console.log(`${slugs.length} repair types`);

function kw(slug) { return slug.replace(/_/g, " ").split(" ").filter(w => w.length > 2); }
const rk = {};
for (const sl of slugs) rk[sl] = kw(sl);

function match(desc) {
  if (!desc) return null;
  const t = desc.toLowerCase();
  let best = null, bs = 0;
  for (const sl of slugs) {
    const ks = rk[sl]; let s = 0;
    for (const k of ks) if (t.includes(k)) s++;
    if (s > bs) { bs = s; best = sl; }
  }
  return bs >= 2 ? best : null;
}

let fixed = 0, total = 0;
let rs = 0;
while (true) {
  const { data } = await s.from("diagnoses").select("id,diagnosis_json").range(rs, rs + 999);
  if (!data?.length) break;
  for (const row of data) {
    const d = row.diagnosis_json;
    if (!d?.causes) continue;
    let changed = false;
    const causes = d.causes.map(c => {
      total++;
      if (c.repair_slug) return c; // already has one
      const repair = match(c.description);
      if (repair) changed = true;
      return { ...c, repair_slug: repair || null };
    });
    if (changed) {
      await s.from("diagnoses").update({ diagnosis_json: { ...d, causes } }).eq("id", row.id);
      fixed++;
    }
  }
  rs += 1000;
}
console.log(`Fixed: ${fixed} diagnoses, ${total} causes checked`);
