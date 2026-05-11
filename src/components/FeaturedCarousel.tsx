"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import type { PostWithRelations } from "@/lib/types";

function excerpt(body: string, maxLen = 150): string {
  const plain = body.replace(/\s+/g, " ").trim();
  if (plain.length <= maxLen) return plain;
  return plain.slice(0, maxLen).replace(/\s+\S*$/, "") + "...";
}

export default function FeaturedCarousel({
  posts,
}: {
  posts: PostWithRelations[];
}) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = posts.length;
  const isSingle = total <= 1;

  const goTo = useCallback(
    (index: number) => {
      setCurrent(((index % total) + total) % total);
    },
    [total]
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (isSingle || isPaused) return;
    timerRef.current = setInterval(next, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isSingle, isPaused, next]);

  if (total === 0) return null;

  return (
    <section
      className="mb-6"
      aria-roledescription="carousel"
      aria-label="Featured posts"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative overflow-hidden rounded-2xl bg-surface-1 border border-surface-border">
        {/* Slides container */}
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {posts.map((post) => (
            <div key={post.id} className="w-full shrink-0">
              <div className="flex flex-col sm:flex-row gap-6 p-6 sm:p-8">
                {/* Accent bar */}
                <div className="hidden sm:block w-1.5 shrink-0 rounded-full bg-gradient-to-b from-primary to-primary-glow" />

                <div className="flex-1 min-w-0">
                  {/* Badges */}
                  <div className="flex items-center gap-2 mb-3">
                    {post.categories && (
                      <Link
                        href={`/?category=${post.categories.slug}`}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-surface-3 text-text-secondary rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-surface-4 hover:text-primary transition-colors font-heading"
                      >
                        <span className="w-1 h-1 rounded-full bg-primary" />
                        {post.categories.name}
                      </Link>
                    )}
                    <span className="px-1.5 py-0.5 bg-purple-600/10 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded text-[10px] font-medium font-heading tracking-wide border border-purple-600/20 dark:border-purple-500/20">
                      FEATURED
                    </span>
                    {post.content_type === "guide" && (
                      <span className="px-1.5 py-0.5 bg-teal-600/10 dark:bg-teal-400/10 text-teal-600 dark:text-teal-400 rounded text-[10px] font-medium font-heading tracking-wide border border-teal-600/20 dark:border-teal-400/20">
                        GUIDE
                      </span>
                    )}
                    {post.content_type === "review" && (
                      <span className="px-1.5 py-0.5 bg-amber-700/10 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 rounded text-[10px] font-medium font-heading tracking-wide border border-amber-700/20 dark:border-amber-500/20">
                        REVIEW
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <Link href={`/post/${post.slug || post.id}`}>
                    <h2 className="text-xl sm:text-2xl font-bold text-text-primary font-heading leading-tight hover:text-primary transition-colors duration-150 line-clamp-2">
                      {post.title}
                    </h2>
                  </Link>

                  {/* Excerpt */}
                  <p className="mt-3 text-sm text-text-secondary leading-relaxed line-clamp-3">
                    {excerpt(post.body)}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center gap-3 mt-4">
                    <Link
                      href={`/post/${post.slug || post.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-lg transition-colors duration-150 font-heading"
                    >
                      Read more
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                    {post.profiles?.username && (
                      <>
                        <span className="text-surface-border">by</span>
                        <Link
                          href={`/user/${post.profiles.username}`}
                          className="text-sm text-text-muted hover:text-text-secondary transition-colors font-medium"
                        >
                          {post.profiles.username}
                        </Link>
                      </>
                    )}
                    {post.comment_count > 0 && (
                      <>
                        <span className="text-surface-border">·</span>
                        <span className="text-xs text-text-muted flex items-center gap-1">
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                          </svg>
                          {post.comment_count}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation arrows (only when > 1 slide) */}
        {!isSingle && (
          <>
            <button
              onClick={prev}
              aria-label="Previous slide"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-surface-3/80 hover:bg-surface-4 text-text-secondary hover:text-text-primary flex items-center justify-center transition-all duration-150 shadow-lg backdrop-blur-sm"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={next}
              aria-label="Next slide"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-surface-3/80 hover:bg-surface-4 text-text-secondary hover:text-text-primary flex items-center justify-center transition-all duration-150 shadow-lg backdrop-blur-sm"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {posts.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1} of ${total}`}
                  aria-current={i === current ? "true" : undefined}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === current
                      ? "bg-primary w-5"
                      : "bg-surface-4 hover:bg-surface-border"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
