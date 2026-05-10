"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import Link from "next/link";
import { timeAgo } from "@/lib/utils";

const LOCALSTORAGE_KEY = "autowner_view_history";

interface HistoryEntry {
  postId: string;
  title: string;
  viewedAt: string;
}

function getAnonymousHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCALSTORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function AnonymousHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(false);

  useEffect(() => {
    const history = getAnonymousHistory();

    if (history.length === 0) {
      setEntries([]);
      setLoading(false);
      return;
    }

    // Validate entries against DB — but show cached data immediately first
    setEntries(history);
    setLoading(false);

    // Then validate in background
    async function validate() {
      try {
        const supabase = createClient();
        const postIds = history.map((e) => e.postId);
        const { data: posts, error } = await supabase
          .from("posts")
          .select("id, title")
          .in("id", postIds)
          .eq("status", "approved");

        if (error || !posts) { setDbError(true); return; }

        const validIds = new Set(posts.map((p) => p.id));
        const valid = history.filter((e) => validIds.has(e.postId));

        if (valid.length !== history.length) {
          try { localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(valid.slice(0, 50))); } catch {}
        }

        const titleMap = new Map(posts.map((p) => [p.id, p.title]));
        setEntries(valid.map((e) => ({ ...e, title: titleMap.get(e.postId) ?? e.title })));
      } catch {
        setDbError(true);
      }
    }
    validate();
  }, []);

  const handleClear = () => {
    try { localStorage.removeItem(LOCALSTORAGE_KEY); } catch {}
    setEntries([]);
  };

  return (
    <>
      {/* Sign-in banner */}
      <div className="mb-6 p-4 bg-surface-2 rounded-xl border border-surface-border flex items-start gap-3">
        <svg className="w-5 h-5 text-amber mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v4.7c0 5-3.3 9.45-7 10.7-3.7-1.25-7-5.7-7-10.7V6.3l7-3.12z" />
        </svg>
        <div>
          <p className="text-sm text-text-secondary font-medium">
            Your reading history is saved only on this device.
          </p>
          <p className="text-xs text-text-muted mt-0.5">
            Sign in to save your history permanently and access it anywhere.
          </p>
          <Link
            href="/auth/login?next=/history"
            className="inline-block mt-2 px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-glow transition-colors font-heading"
          >
            Sign In
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-sm text-text-muted">Loading your history...</p>
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 mx-auto mb-5 bg-surface-2 rounded-3xl flex items-center justify-center">
            <svg className="w-10 h-10 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-text-secondary font-heading mb-1">
            No reading history yet
          </p>
          <p className="text-sm text-text-muted mt-1 max-w-xs mx-auto leading-relaxed">
            Posts you view will appear here — no login required. Browse some articles first, then come back.
          </p>
          {dbError && (
            <p className="text-xs text-amber mt-2">
              Could not verify saved history entries. Your local data is shown if available.
            </p>
          )}
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-glow hover:-translate-y-px transition-all duration-150 font-heading shadow-sm shadow-primary/20"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l-7 7 7 7" />
            </svg>
            Browse Posts
          </Link>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-end mb-4">
            <button
              onClick={handleClear}
              className="text-xs text-text-muted hover:text-red-400 transition-colors font-medium"
            >
              Clear history
            </button>
          </div>
          <div className="space-y-1">
            {entries.map((entry) => (
              <Link
                key={entry.postId}
                href={`/post/${entry.postId}`}
                className="flex items-center justify-between gap-4 p-3.5 bg-surface-1 rounded-lg border border-surface-border hover:border-surface-4 hover:bg-surface-2/50 transition-all duration-150"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <svg className="w-4 h-4 text-text-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-text-primary font-medium truncate hover:text-primary transition-colors">
                    {entry.title}
                  </span>
                </div>
                <span className="text-xs text-text-muted shrink-0">{timeAgo(entry.viewedAt)}</span>
              </Link>
            ))}
          </div>
        </>
      )}
    </>
  );
}
