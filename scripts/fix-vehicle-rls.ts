// Fix RLS policies for vehicle tables — allow public read
// Run: npx tsx scripts/fix-vehicle-rls.ts

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const SQL = `
ALTER TABLE vehicle_makes ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_engines ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'vehicle_makes' AND policyname = 'Anyone can view vehicle makes') THEN
    CREATE POLICY "Anyone can view vehicle makes" ON vehicle_makes FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'vehicle_models' AND policyname = 'Anyone can view vehicle models') THEN
    CREATE POLICY "Anyone can view vehicle models" ON vehicle_models FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'vehicle_generations' AND policyname = 'Anyone can view vehicle generations') THEN
    CREATE POLICY "Anyone can view vehicle generations" ON vehicle_generations FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'vehicle_engines' AND policyname = 'Anyone can view vehicle engines') THEN
    CREATE POLICY "Anyone can view vehicle engines" ON vehicle_engines FOR SELECT USING (true);
  END IF;
END $$;
`;

async function main() {
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
  const { error } = await supabase.rpc("exec_sql", { sql: SQL }).maybeSingle();

  if (error) {
    // Fallback: use REST API to execute raw SQL via management API
    console.log("RPC not available, trying direct SQL approach...");

    // Try the SQL via Supabase management API
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SERVICE_KEY,
        "Authorization": `Bearer ${SERVICE_KEY}`,
      },
      body: JSON.stringify({ sql: SQL }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Failed:", text);
      console.log("\nPlease run supabase/migrations/022_vehicle_rls.sql in SQL Editor instead.");
      return;
    }
  }

  console.log("RLS policies created successfully.");
}

main().catch(console.error);
