// middleware.ts
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

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

  const protectedPaths = ["/submit", "/admin", "/bookmarks", "/settings"];
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

  return response;
}

export const config = {
  matcher: [
    "/submit/:path*",
    "/admin/:path*",
    "/bookmarks/:path*",
    "/settings/:path*",
    "/auth/login",
    "/auth/register",
    "/auth/reset-password",
    "/auth/update-password",
    "/post/:path*",
    "/user/:path*",
    "/",
  ],
};
