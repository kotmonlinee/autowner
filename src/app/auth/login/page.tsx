import { Suspense } from "react";
import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your AutOwner account.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={
      <main id="main-content" className="flex min-h-screen items-center justify-center bg-surface-0 px-4">
        <div className="w-full max-w-sm border border-surface-border border-l-4 border-l-primary bg-surface-1 p-6 text-center">
          <h1 className="font-display text-3xl font-semibold tracking-[-0.03em] text-text-primary">Welcome back</h1>
          <p className="mt-2 text-sm text-text-muted">Preparing sign in…</p>
        </div>
      </main>
    }>
      <LoginForm />
    </Suspense>
  );
}
