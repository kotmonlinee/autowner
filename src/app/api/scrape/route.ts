// TODO: Rate limiting — add IP-based rate limiting in production (e.g. using Upstash Redis
// or Vercel KV). Scraping is expensive and should be limited to ~1 trigger per minute per
// admin user, or use a cron job instead of manual triggering.
import { getCurrentUser } from "@/lib/data/server";
import { runScrape } from "@/scrapers/orchestrator";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const secret = request.headers.get("x-scrape-secret");
    if (secret !== process.env.SCRAPE_API_SECRET) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 403 });
    }

    const result = await runScrape();
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Scrape failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
