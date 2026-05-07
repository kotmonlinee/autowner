"use client";

import { useState, useEffect } from "react";
import { getBookmarkState } from "@/lib/data/browser";
import { useRouter } from "next/navigation";

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
    if (!userId) return;
    getBookmarkState(userId, postId).then(setBookmarked);
  }, [userId, postId]);

  const toggle = async () => {
    if (!userId) {
      router.push("/auth/login");
      return;
    }
    const res = await fetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId }),
    });
    if (res.ok) {
      const { bookmarked: newState } = await res.json();
      setBookmarked(newState);
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
      title={bookmarked ? "Remove bookmark" : "Save post"}
    >
      <svg className="w-[18px] h-[18px]" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
    </button>
  );
}
