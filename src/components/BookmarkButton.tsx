"use client";

import { useState, useEffect } from "react";
import { getBookmarkState } from "@/lib/data/browser";
import { useRouter } from "next/navigation";

const LOCALSTORAGE_KEY = "autowner_bookmarks";

function getAnonymousBookmarks(): string[] {
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

function setAnonymousBookmarks(ids: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(ids));
}

export default function BookmarkButton({
  postId,
  userId,
}: {
  postId: string;
  userId?: string;
}) {
  const [bookmarked, setBookmarked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (userId) {
      getBookmarkState(userId, postId).then(setBookmarked);
    } else {
      const ids = getAnonymousBookmarks();
      setBookmarked(ids.includes(postId));
    }
  }, [userId, postId]);

  const toggle = async () => {
    if (userId) {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });
      if (res.ok) {
        const { bookmarked: newState } = await res.json();
        setBookmarked(newState);
      }
    } else {
      const ids = getAnonymousBookmarks();
      if (bookmarked) {
        const filtered = ids.filter((id) => id !== postId);
        setAnonymousBookmarks(filtered);
        setBookmarked(false);
      } else {
        setAnonymousBookmarks([...ids, postId]);
        setBookmarked(true);
      }
    }
  };

  return (
    <button
      onClick={toggle}
      className={`p-2 rounded-lg transition-all duration-150 ${
        bookmarked
          ? "text-amber bg-amber/10 hover:bg-amber/15"
          : "text-text-muted hover:text-amber hover:bg-surface-3"
      }`}
      aria-label={bookmarked ? "Remove bookmark" : "Bookmark"}
      aria-pressed={bookmarked}
    >
      <svg className="w-[18px] h-[18px]" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" width={24} height={24}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
    </button>
  );
}
