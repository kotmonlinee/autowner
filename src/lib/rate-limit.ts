import { createServerSupabase } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number; // Unix timestamp in seconds
}

/**
 * A file-based rate limiter backed by Supabase `rate_limits` table.
 * Works on Vercel serverless — no Redis/Vercel KV required.
 *
 * Fails open: if the DB call fails, the request is allowed through.
 */
export async function rateLimit(
  identifier: string,
  action: string,
  maxRequests: number,
  windowSeconds: number,
): Promise<RateLimitResult> {
  const now = Date.now();
  const windowStart = new Date(now - windowSeconds * 1000).toISOString();

  try {
    const supabase = await createServerSupabase();

    // Delete entries outside the current window to keep the table lean.
    await supabase
      .from("rate_limits")
      .delete()
      .eq("identifier", identifier)
      .eq("action", action)
      .lt("window_start", windowStart);

    // Count entries inside the current window.
    const { count, error: countError } = await supabase
      .from("rate_limits")
      .select("id", { count: "exact", head: true })
      .eq("identifier", identifier)
      .eq("action", action)
      .gte("window_start", windowStart);

    if (countError) {
      // Fail open — allow the request if we can't count.
      return { success: true, remaining: maxRequests, reset: 0 };
    }

    const currentCount = count ?? 0;
    const remaining = Math.max(0, maxRequests - currentCount);

    if (currentCount >= maxRequests) {
      // Compute the reset time: the oldest entry's window_start + windowSeconds.
      const { data: oldest } = await supabase
        .from("rate_limits")
        .select("window_start")
        .eq("identifier", identifier)
        .eq("action", action)
        .gte("window_start", windowStart)
        .order("window_start", { ascending: true })
        .limit(1)
        .single();

      const oldestStart = oldest?.window_start
        ? new Date(oldest.window_start).getTime()
        : now;
      const reset = Math.ceil((oldestStart + windowSeconds * 1000) / 1000);

      return { success: false, remaining: 0, reset };
    }

    // Insert a new entry to record this request.
    await supabase.from("rate_limits").insert({
      identifier,
      action,
      window_start: new Date(now).toISOString(),
    });

    return { success: true, remaining: remaining - 1, reset: 0 };
  } catch {
    // Fail open — allow the request if the DB is unavailable.
    return { success: true, remaining: maxRequests, reset: 0 };
  }
}

/**
 * Convenience wrapper: runs `rateLimit` and returns a 429 error response when
 * the limit is exceeded. Returns `null` when the request can proceed.
 *
 * Usage:
 *   const limited = await withRateLimit(userId, "votes", 30, 60);
 *   if (limited) return limited;  // 429 response
 */
export async function withRateLimit(
  identifier: string,
  action: string,
  maxRequests: number,
  windowSeconds: number,
): Promise<NextResponse | null> {
  const result = await rateLimit(identifier, action, maxRequests, windowSeconds);

  if (!result.success) {
    return NextResponse.json(
      {
        error: "Too many requests. Please slow down.",
        retryAfter: Math.max(0, result.reset - Math.ceil(Date.now() / 1000)),
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(
            Math.max(0, result.reset - Math.ceil(Date.now() / 1000)),
          ),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(result.reset),
        },
      },
    );
  }

  return null;
}
