"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import PostFeed from "./PostFeed";
import Link from "next/link";
import type { PostWithRelations } from "@/lib/types";

const LOCALSTORAGE_KEY = "autowner_bookmarks";

function getBookmarkedIds(): string[] {
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

export default function AnonymousBookmarks() {
  const [posts, setPosts] = useState<PostWithRelations[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ids = getBookmarkedIds();
    if (ids.length === 0) {
      setLoading(false);
      return;
    }

    const supabase = createClient();

    async function fetchPosts() {
      try {
        const { data } = await supabase
          .from("posts")
          .select("*, profiles(username, avatar_url), categories(name, slug), post_tags(car_tags(name, slug))")
          .in("id", ids)
          .eq("status", "approved");
        if (data) {
          // Preserve bookmark order
          const postMap = new Map(
            (data as unknown as PostWithRelations[]).map((p) => [p.id, p]),
          );
          const ordered = ids
            .map((id) => postMap.get(id))
            .filter(Boolean) as PostWithRelations[];
          setPosts(ordered);
        }
      } catch {
        // Silently fail — posts may have been deleted
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-text-muted">Loading your bookmarks...</p>
      </div>
    );
  }

  return (
    <>
      {/* Sign-in banner */}
      <div className="mb-6 p-4 bg-surface-2 rounded-xl border border-surface-border flex items-start gap-3">
        <svg
          className="w-5 h-5 text-amber mt-0.5 shrink-0"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v4.7c0 5-3.3 9.45-7 10.7-3.7-1.25-7-5.7-7-10.7V6.3l7-3.12z" />
        </svg>
        <div>
          <p className="text-sm text-text-secondary font-medium">
            These bookmarks are saved only on this device.
          </p>
          <p className="text-xs text-text-muted mt-0.5">
            Sign in to save your bookmarks permanently and access them anywhere.
            Anonymous bookmarks are separate and do not sync automatically when
            you sign in.
          </p>
          <Link
            href="/auth/login?next=/bookmarks"
            className="inline-block mt-2 px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-glow transition-colors font-heading"
          >
            Sign In
          </Link>
        </div>
      </div>

      {posts.length === 0 ? (
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
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </div>
          <p className="text-lg font-semibold text-text-secondary font-heading mb-1">
            No bookmarks yet
          </p>
          <p className="text-sm text-text-muted mt-1 max-w-xs mx-auto leading-relaxed">
            Found a useful guide or an interesting discussion? Click the
            bookmark icon on any post to save it here for later.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-glow hover:-translate-y-px transition-all duration-150 font-heading shadow-sm shadow-primary/20"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l-7 7 7 7" />
            </svg>
            Browse Popular Posts
          </Link>
        </div>
      ) : (
        <PostFeed posts={posts} />
      )}
    </>
  );
}
