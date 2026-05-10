import type { Metadata } from "next";
import { getUserDrafts, getCurrentUser } from "@/lib/data/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DeleteDraftButton from "./DeleteDraftButton";
import { timeAgo } from "@/lib/utils";

export const metadata: Metadata = {
  title: "My Drafts — AutOwner",
  description: "Your saved draft posts on AutOwner.",
};

export default async function DraftsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login?next=/drafts");
  }

  const drafts = await getUserDrafts(user.id);

  return (
    <div className="min-h-screen bg-surface-0 relative flex flex-col">
      <Navbar />
      <main id="main-content" className="max-w-3xl mx-auto px-5 py-6 flex-1 w-full">
        <div className="mb-6 pb-4 border-b border-surface-border">
          <h1 className="text-2xl font-bold text-text-primary font-heading">
            My Drafts
          </h1>
          <p className="text-sm text-text-muted mt-1">
            {drafts.length > 0
              ? `${drafts.length} draft${drafts.length !== 1 ? "s" : ""}`
              : "Posts you save as drafts will appear here"}
          </p>
        </div>

        {drafts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-5 bg-surface-2 rounded-3xl flex items-center justify-center">
              <svg
                className="w-10 h-10 text-text-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <p className="text-lg font-semibold text-text-secondary font-heading mb-1">
              No drafts
            </p>
            <p className="text-sm text-text-muted mt-1 max-w-sm mx-auto leading-relaxed">
              Drafts let you start writing and come back later to finish. Your work is saved automatically &mdash; no need to publish until you&apos;re ready. Perfect for longer guides, detailed walkthroughs, or when inspiration strikes at 2 AM.
            </p>
            <Link
              href="/submit"
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-glow hover:-translate-y-px transition-all duration-150 font-heading shadow-sm shadow-primary/20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Start Writing
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {drafts.map((draft) => (
              <div
                key={draft.id}
                className="group flex items-center gap-4 p-4 bg-surface-1 rounded-xl border border-surface-border hover:border-surface-4 transition-colors"
              >
                <Link
                  href={`/submit?draft=${draft.id}`}
                  className="flex-1 min-w-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-text-primary font-heading truncate group-hover:text-primary transition-colors">
                        {draft.title || "Untitled"}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-text-muted">
                          Updated {timeAgo(draft.updated_at)}
                        </span>
                        {draft.categories?.name && (
                          <span className="text-xs text-text-muted px-2 py-0.5 rounded-full bg-surface-2 border border-surface-border">
                            {draft.categories.name}
                          </span>
                        )}
                      </div>
                    </div>
                    <svg
                      className="w-4 h-4 text-text-muted group-hover:text-text-secondary shrink-0 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </div>
                </Link>
                <DeleteDraftButton draftId={draft.id} />
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
