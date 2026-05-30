import { searchObdCodes } from "@/lib/data/server";
import { rateLimit } from "@/lib/rate-limit";
import { NextResponse } from "next/server";

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() ?? "unknown";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";

  if (!q.trim()) {
    return NextResponse.json({ results: [] });
  }

  // IP-based rate limit: 30 searches per minute
  const limited = await rateLimit(getClientIp(request), "obd:search", 30, 60);
  if (!limited.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const results = await searchObdCodes(q);
    return NextResponse.json({ results });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
