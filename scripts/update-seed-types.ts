// Update seed post content types — run: npx tsx scripts/update-seed-types.ts
// Marks all hand-written seed posts (source='user', content_type IS NULL, source_url IS NULL)
// as content_type='guide'.
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

// Parse .env.local manually (no dotenv dependency needed)
const env = Object.fromEntries(
  readFileSync(".env.local", "utf-8")
    .split("\n")
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => l.split("=").map((s) => s.trim()))
);

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL!,
  env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  // First, count matching rows
  const { count, error: countError } = await supabase
    .from("posts")
    .select("id", { count: "exact", head: true })
    .eq("source", "user")
    .is("content_type", null)
    .is("source_url", null);

  if (countError) {
    console.error("Failed to count matching posts:", countError.message);
    process.exit(1);
  }

  if (!count) {
    console.log("No matching seed posts found. Nothing to update.");
    return;
  }

  console.log(`Found ${count} seed posts to update...`);

  // Perform the update
  const { error: updateError } = await supabase
    .from("posts")
    .update({ content_type: "guide" })
    .eq("source", "user")
    .is("content_type", null)
    .is("source_url", null);

  if (updateError) {
    console.error("Update failed:", updateError.message);
    process.exit(1);
  }

  console.log(`Successfully updated ${count} seed posts to content_type='guide'.`);
}

main();
