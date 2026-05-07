import { getCurrentUser } from "@/lib/data/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");

  return (
    <div className="min-h-screen bg-surface-0 relative">
      <nav className="sticky top-0 z-50 bg-surface-0/80 backdrop-blur-xl border-b border-surface-border h-16 flex items-center px-5 gap-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
          <span className="font-display text-lg text-text-primary tracking-wide">
            AUTO<span className="text-primary">WNER</span>
          </span>
        </Link>
        <div className="flex items-center gap-4 ml-4 pl-4 border-l border-surface-border">
          <Link href="/admin" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors font-heading">
            Content Review
          </Link>
          <Link href="/" className="text-sm text-text-muted hover:text-text-secondary transition-colors">
            &larr; Back to Site
          </Link>
        </div>
      </nav>
      <div className="max-w-5xl mx-auto px-5 py-6">{children}</div>
    </div>
  );
}
