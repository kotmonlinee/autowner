// middleware.ts
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Clean and canonicalize /obd/ URLs (only 1-segment, not /obd/code/make/model)
  const obdMatch = request.nextUrl.pathname.match(/^\/obd\/([PCBU]\d{4,5})$/i);
  if (obdMatch) {
    const code = obdMatch[1].toLowerCase();
    const cleanPath = `/obd/${code}`;
    // Redirect if uppercase, or if path has trailing garbage (params are fine)
    if (request.nextUrl.pathname !== cleanPath) {
      const target = new URL(cleanPath, request.url);
      target.search = request.nextUrl.search; // preserve query params
      return NextResponse.redirect(target, 301);
    }
    return NextResponse.next(); // clean lowercase OBD — skip auth checks
  }

  // Tool pages render identical content for every query string (share and
  // prefill links such as /quote-checker?repair=... or /recall-check?make=...).
  // Keep those variants out of the index without making the pages dynamic or
  // sending them through the Supabase auth round trip.
  if (
    request.nextUrl.pathname === "/quote-checker" ||
    request.nextUrl.pathname === "/recall-check"
  ) {
    const response = NextResponse.next({ request });
    if ([...request.nextUrl.searchParams.keys()].length > 0) {
      response.headers.set("X-Robots-Tag", "noindex, follow");
    }
    return response;
  }

  try {
    const response = NextResponse.next({ request });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { return request.cookies.get(name)?.value; },
          set(name: string, value: string, options: CookieOptions) {
            response.cookies.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            response.cookies.set({ name, value: "", ...options });
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    const protectedPaths = ["/submit", "/admin", "/bookmarks", "/settings", "/drafts"];
    const authPaths = ["/auth/login", "/auth/register"];
    const path = request.nextUrl.pathname;

    if (!user && protectedPaths.some(p => path.startsWith(p))) {
      return NextResponse.redirect(new URL(`/auth/login?next=${path}`, request.url));
    }

    if (user && authPaths.some(p => path.startsWith(p))) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Check if authenticated user is banned
    if (user && !path.startsWith("/auth/login") && !path.startsWith("/api/")) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_banned")
        .eq("id", user.id)
        .single();

      if (profile?.is_banned) {
        // Sign out the banned user and redirect to login with error
        await supabase.auth.signOut();
        return NextResponse.redirect(new URL("/auth/login?error=banned", request.url));
      }
    }

    // Throttled last_active_at update — at most once per 5 minutes per user.
    // Uses a cookie to track the last ping timestamp so we avoid a DB read.
    if (user) {
      const now = Date.now();
      const fiveMinutesMs = 5 * 60 * 1000;

      const lastPing = request.cookies.get("last_active_ping")?.value;
      if (!lastPing || now - new Date(lastPing).getTime() > fiveMinutesMs) {
        await supabase
          .from("profiles")
          .update({ last_active_at: new Date().toISOString() })
          .eq("id", user.id);

        response.cookies.set({
          name: "last_active_ping",
          value: new Date().toISOString(),
          httpOnly: true,
          sameSite: "lax",
          maxAge: 60 * 60 * 24,
          path: "/",
        });
      }

      // Throttled last_visited_at update — at most once per 30 minutes.
      // Used by Feature 1 ("New" content markers) to track when the user
      // last visited, so posts created after that time can show a "NEW" badge.
      const thirtyMinutesMs = 30 * 60 * 1000;
      const lastVisitedPing = request.cookies.get("last_visited_ping")?.value;
      if (!lastVisitedPing || now - new Date(lastVisitedPing).getTime() > thirtyMinutesMs) {
        await supabase
          .from("profiles")
          .update({ last_visited_at: new Date().toISOString() })
          .eq("id", user.id);

        response.cookies.set({
          name: "last_visited_ping",
          value: new Date().toISOString(),
          httpOnly: true,
          sameSite: "lax",
          maxAge: 60 * 60 * 24,
          path: "/",
        });
      }
    }

    // Set/update last_visit cookie for matched paths. This cookie stores the
    // time of the current visit; on the next page load the server reads it to
    // determine which posts are "new" (created after the previous visit).
    // Non-httpOnly so client-side code can also read it.
    response.cookies.set({
      name: "last_visit",
      value: new Date().toISOString(),
      httpOnly: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    return response;
  } catch {
    // Fail open: if Supabase auth is unavailable or slow, never block the
    // page. A middleware error must not turn public pages into 500s, which
    // would cause Google to de-index them.
    return NextResponse.next({ request });
  }
}

export const config = {
  matcher: [
    // OBD canonicalization only — no Supabase calls for crawlers.
    "/obd/:path*",
    // Tool pages: query-string variants get X-Robots-Tag noindex.
    "/quote-checker",
    "/recall-check",
    // Auth-protected paths (everything else is public and skips middleware).
    "/submit/:path*",
    "/admin/:path*",
    "/bookmarks/:path*",
    "/drafts/:path*",
    "/settings/:path*",
    "/auth/login",
    "/auth/register",
    "/auth/reset-password",
    "/auth/update-password",
  ],
};
