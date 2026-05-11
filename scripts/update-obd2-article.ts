// Update the OBD2 article with products data and ensure slug exists
// Run: npx tsx scripts/update-obd2-article.ts
//
// IMPORTANT: Before running this, add the products column to your Supabase database:
//   1. Go to https://supabase.com/dashboard/project/icpwkhcifzzyzjumzblu/sql/new
//   2. Paste and run: ALTER TABLE posts ADD COLUMN IF NOT EXISTS products JSONB;
//   3. Then re-run this script

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

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

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 200);
}

const products = [
  {
    name: "BlueDriver Bluetooth Pro",
    description:
      "Reads and clears check engine codes, live data, smog check. Best for DIYers with one car.",
    price: "$99.95",
    rating: 4.7,
    link: "",
  },
  {
    name: "Ancel AD310",
    description:
      "Basic OBD2 code reader. No Bluetooth, no frills. Reads and clears engine codes only.",
    price: "$29.99",
    rating: 4.5,
    link: "",
  },
  {
    name: "Autel MaxiCOM MK808",
    description:
      "Full diagnostic tool. ABS, SRS, transmission, oil reset, EPB. For serious home mechanics.",
    price: "$389",
    rating: 4.6,
    link: "",
  },
];

async function main() {
  // Find the OBD2 article by title
  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, title, slug")
    .ilike("title", "%Best OBD2 Scanners%")
    .limit(5);

  if (error) {
    console.error("Error finding OBD2 article:", error.message);
    return;
  }

  if (!posts || posts.length === 0) {
    console.log("OBD2 article not found.");
    return;
  }

  let needMigration = false;

  for (const post of posts) {
    console.log(`\nArticle ID: ${post.id}`);
    console.log(`Title: ${post.title}`);
    console.log(`Current slug: ${post.slug || "(none)"}`);

    // Step 1: Ensure slug exists
    if (!post.slug) {
      const newSlug = generateSlug(post.title);
      const { error: slugError } = await supabase
        .from("posts")
        .update({ slug: newSlug })
        .eq("id", post.id);

      if (slugError) {
        console.log(`  Slug update error: ${slugError.message}`);
      } else {
        console.log(`  Slug set to: ${newSlug}`);
        post.slug = newSlug;
      }
    }

    // Step 2: Try to update products
    const { error: productsError } = await supabase
      .from("posts")
      .update({ products })
      .eq("id", post.id);

    if (productsError) {
      if (productsError.message.includes("products")) {
        needMigration = true;
        console.log("  Products update skipped: column does not exist yet");
      } else {
        console.log(`  Products update error: ${productsError.message}`);
      }
    } else {
      console.log("  Products updated successfully!");
    }

    // Step 3: Also update source/content_type for the showcase (老李 articles are guides)
    const { error: typeError } = await supabase
      .from("posts")
      .update({
        source: "user",
        content_type: "guide",
      })
      .eq("id", post.id);

    if (typeError) {
      console.log(`  Type update error: ${typeError.message}`);
    } else {
      console.log("  Content type set to: guide (source: user)");
    }

    const finalSlug = post.slug || post.id;
    console.log(`\n  Showcase URL: https://www.autowner.com/post/${finalSlug}`);
  }

  if (needMigration) {
    console.log("\n" + "=".repeat(60));
    console.log("MIGRATION REQUIRED: The 'products' column doesn't exist yet.");
    console.log("Run this SQL in the Supabase SQL Editor:");
    console.log("  ALTER TABLE posts ADD COLUMN IF NOT EXISTS products JSONB;");
    console.log("SQL Editor: https://supabase.com/dashboard/project/icpwkhcifzzyzjumzblu/sql/new");
    console.log("Then re-run this script to populate the products data.");
    console.log("=".repeat(60));
  }

  console.log("\nDone.");
}

main().catch(console.error);
