/**
 * One-time setup: create obd_diagnostic_steps table
 * Run: node scripts/setup-diagnostic-steps.mjs
 */

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pkg from "pg";
const { Pool } = pkg;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read .env.local manually
function readEnv() {
  const envPath = path.join(__dirname, "..", ".env.local");
  const content = fs.readFileSync(envPath, "utf-8");
  const env = {};
  for (const line of content.split("\n")) {
    const eq = line.indexOf("=");
    if (eq > 0 && !line.trim().startsWith("#")) {
      env[line.substring(0, eq).trim()] = line.substring(eq + 1).trim();
    }
  }
  return env;
}

const env = readEnv();
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

// 1. Try creating table via REST API by just checking if it exists
const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
const { error } = await supabase.from("obd_diagnostic_steps").select("id").limit(1);

if (!error) {
  console.log("Table obd_diagnostic_steps already exists.");
  process.exit(0);
}

if (error.code !== "42P01" && error.code !== "PGRST205") {
  console.error("Unexpected error checking table:", error);
  process.exit(1);
}

console.log("Table does not exist. Attempting to create...");

// 2. Try pg connection to create the table
// Supabase connection: postgresql://postgres.{ref}:{password}@aws-0-us-east-1.pooler.supabase.com:6543/postgres
const ref = SUPABASE_URL.match(/https:\/\/(.+)\.supabase\.co/)?.[1];
if (!ref) {
  console.error("Could not extract project ref from URL:", SUPABASE_URL);
  process.exit(1);
}

// Try multiple pooler hosts
const hosts = [
  `aws-0-us-east-1.pooler.supabase.com`,
  `aws-0-us-west-1.pooler.supabase.com`,
  `aws-0-eu-west-3.pooler.supabase.com`,
  `aws-0-ap-southeast-1.pooler.supabase.com`,
];

let connected = false;
for (const host of hosts) {
  console.log(`  Trying ${host}:6543...`);
  const pool = new Pool({
    host,
    port: 6543,
    user: `postgres.${ref}`,
    password: SERVICE_KEY,
    database: "postgres",
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000,
  });
  try {
    await pool.query("SELECT 1");
    console.log("  Connected!");

    // Create table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS obd_diagnostic_steps (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        obd_code TEXT NOT NULL,
        generated_at TIMESTAMPTZ DEFAULT now(),
        causes JSONB NOT NULL DEFAULT '[]',
        UNIQUE(obd_code)
      )
    `);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_obd_diag_code ON obd_diagnostic_steps(obd_code)`);
    console.log("  Table created successfully.");
    connected = true;
    await pool.end();
    break;
  } catch (e) {
    console.log(`  Failed: ${e.message}`);
    await pool.end();
  }
}

if (!connected) {
  console.log("\nCould not create table automatically.");
  console.log("Please run this SQL in the Supabase Dashboard SQL Editor:");
  console.log("https://supabase.com/dashboard/project/" + ref + "/sql/new");
  console.log(`
CREATE TABLE IF NOT EXISTS obd_diagnostic_steps (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  obd_code TEXT NOT NULL,
  generated_at TIMESTAMPTZ DEFAULT now(),
  causes JSONB NOT NULL DEFAULT '[]',
  UNIQUE(obd_code)
);
CREATE INDEX IF NOT EXISTS idx_obd_diag_code ON obd_diagnostic_steps(obd_code);
  `);
}
