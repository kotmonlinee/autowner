/**
 * Error logging — stores errors in Supabase for later review.
 *
 * Works in both server components/API routes and client components.
 * On the server, it calls the /api/log-error endpoint. On the client,
 * it calls the same endpoint with a relative URL.
 *
 * Usage:
 *   import { logError } from "@/lib/error-logging";
 *   logError(err, { url: window.location.pathname });
 *
 * Fails silently — logging failure should never break the app.
 */

export interface ErrorContext {
  url?: string;
  userId?: string;
  userAgent?: string;
}

export async function logError(
  error: Error | string,
  context?: ErrorContext,
): Promise<void> {
  try {
    const message = typeof error === "string" ? error : error.message;
    const stack = typeof error === "string" ? undefined : (error.stack ?? undefined);

    const body: Record<string, string> = { message };
    if (stack) body.stack = stack;

    const url = context?.url ?? (typeof window !== "undefined" ? window.location.pathname : undefined);
    if (url) body.url = url;

    if (context?.userId) body.userId = context.userId;

    const userAgent =
      context?.userAgent ??
      (typeof navigator !== "undefined" ? navigator.userAgent : undefined);
    if (userAgent) body.userAgent = userAgent;

    const endpoint = getEndpoint();

    await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    // Never throw — logging failure shouldn't break the app
  }
}

function getEndpoint(): string {
  if (typeof window !== "undefined") {
    return "/api/log-error";
  }
  // Server-side: use the full URL
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) return `${siteUrl}/api/log-error`;
  // Fallback — Vercel preview deployments set VERCEL_URL
  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) return `https://${vercelUrl}/api/log-error`;
  return "http://localhost:3000/api/log-error";
}
