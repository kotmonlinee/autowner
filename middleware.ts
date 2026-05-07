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
  ],
};
