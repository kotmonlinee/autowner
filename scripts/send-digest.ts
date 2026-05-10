// Weekly digest sender — calls the admin digest API endpoint.
// Run: npx tsx scripts/send-digest.ts [--user <userId>]
//   Without --user: sends digests to all users with primary vehicles.
//   With --user: sends a test digest to the specified user ID.
import { readFileSync } from "fs";

// ── Parse .env.local ──────────────────────────────────────

function loadEnv(): Record<string, string> {
  const content = readFileSync(".env.local", "utf-8");
  return Object.fromEntries(
    content
      .split("\n")
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => line.split("=").map((s) => s.trim())),
  );
}

const env = loadEnv();

const SITE_URL = env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const SCRAPE_SECRET = env.SCRAPE_API_SECRET;

// ── Main ──────────────────────────────────────────────────

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    console.log("AutOwner Weekly Digest Sender");
    console.log("");
    console.log("Usage:");
    console.log("  npx tsx scripts/send-digest.ts                  Send digests to all users");
    console.log("  npx tsx scripts/send-digest.ts --user <userId>  Send test digest to one user");
    console.log("  npx tsx scripts/send-digest.ts --help           Show this help");
    console.log("");
    return;
  }

  let userId: string | undefined;
  const userIdx = args.indexOf("--user");
  if (userIdx !== -1 && userIdx + 1 < args.length) {
    userId = args[userIdx + 1];
  }

  if (!SCRAPE_SECRET) {
    console.error("Error: SCRAPE_API_SECRET not set in .env.local");
    process.exit(1);
  }

  const url = `${SITE_URL}/api/admin/digest`;

  console.log(userId
    ? `Sending test digest to user ${userId}...`
    : "Sending weekly digests to all users with primary vehicles..."
  );

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-scrape-secret": SCRAPE_SECRET,
      },
      body: JSON.stringify(userId ? { userId } : {}),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error(`Error (${res.status}):`, data.error ?? data);
      process.exit(1);
    }

    console.log("Done:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error:", err instanceof Error ? err.message : err);
    process.exit(1);
  }
}

main();
