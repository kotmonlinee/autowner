// src/app/auth/confirm/route.ts
// Handles email confirmation links sent by Supabase Auth.
// Example URL: /auth/confirm?token_hash=xxx&type=signup
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");

  if (token_hash && type === "signup") {
    const supabase = await createServerSupabase();
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: "signup",
    });
    if (!error) {
      return NextResponse.redirect(`${origin}/`);
    }
  }

  // On any error, redirect to login with a message
  return NextResponse.redirect(`${origin}/auth/login?error=confirmation-failed`);
}
