import { getCurrentUser } from "@/lib/data/server";
import { runScrape } from "@/scrapers/orchestrator";
import { withRateLimit } from "@/lib/rate-limit";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const secret = request.headers.get("x-scrape-secret");
    if (secret !== process.env.SCRAPE_API_SECRET) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 403 });
    }

    // Rate limit: 1 scrape per minute per user
    const limited = await withRateLimit(user.id, "scrape:trigger", 1, 60);
    if (limited) return limited;

    const result = await runScrape();
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Scrape failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
