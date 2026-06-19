import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

for (let pass = 1; pass <= 5; pass++) {
  // Scan for empty descriptions
  const badCodes = new Map();
  let rs = 0;
  while (true) {
    const { data } = await supabase.from("obd_diagnostic_steps").select("obd_code,causes").range(rs, rs + 999);
    if (!data?.length) break;
    for (const row of data) {
      for (const c of row.causes || []) {
        if (!c.cause_description || String(c.cause_description).trim() === "") {
          badCodes.set(row.obd_code, (badCodes.get(row.obd_code) || 0) + 1);
        }
      }
    }
    rs += 1000;
  }

  if (badCodes.size === 0) {
    console.log(`Pass ${pass}: ALL CLEAN (0 empty descriptions)`);
    break;
  }

  const totalEmpty = [...badCodes.values()].reduce((a, b) => a + b, 0);
  console.log(`Pass ${pass}: ${badCodes.size} codes, ${totalEmpty} empty descriptions`);

  // Fix each code
  for (const [code] of badCodes) {
    const { data: obd } = await supabase.from("obd_codes").select("causes_json").eq("code", code).single();
    const fallbacks = obd?.causes_json || [];
    const { data: diag } = await supabase.from("obd_diagnostic_steps").select("causes").eq("obd_code", code).single();

    const causes = (diag?.causes || []).map((c, i) => {
      const existing = c.cause_description && String(c.cause_description).trim();
      const fallback = fallbacks[i] || fallbacks[0] || `Diagnose and repair issue related to OBD code ${code}`;
      return { ...c, cause_description: existing || fallback };
    });

    await supabase.from("obd_diagnostic_steps").upsert(
      { obd_code: code, causes, generated_at: new Date().toISOString() },
      { onConflict: "obd_code" }
    );
  }
}

console.log("Done. Checking final state...");
// Final verification
let empty = 0, rs = 0;
while (true) {
  const { data } = await supabase.from("obd_diagnostic_steps").select("causes").range(rs, rs + 999);
  if (!data?.length) break;
  for (const row of data) for (const c of row.causes || []) if (!c.cause_description || String(c.cause_description).trim() === "") empty++;
  rs += 1000;
}
console.log(`Final: ${empty} empty descriptions`);
