"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Pagination({
  page,
  totalCount,
  limit = 30,
  basePath = "/",
}: {
  page: number;
  totalCount: number;
  limit?: number;
  basePath?: string;
}) {
  const searchParams = useSearchParams();
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  if (totalPages <= 1 && !hasNext) return null;

  const buildHref = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (p === 1) {
      params.delete("page");
    } else {
      params.set("page", String(p));
    }
    const qs = params.toString();
    const path = basePath.endsWith("/") ? basePath.slice(0, -1) : basePath;
    return qs ? `${path}?${qs}` : path || "/";
  };

  const btnBase =
    "px-4 py-2 text-sm font-medium rounded-lg border transition-colors duration-150 font-heading";
  const btnEnabled =
    "bg-surface-2 border-surface-border text-text-secondary hover:bg-surface-3 hover:text-text-primary";
  const btnDisabled = "bg-surface-2 border-surface-border text-text-muted opacity-30 cursor-not-allowed";

  return (
    <div className="mt-8 pt-6 border-t border-surface-border space-y-4">
      {/* Load More button — prominent, full-width */}
      {hasNext && (
        <Link
          href={buildHref(page + 1)}
          className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-surface-2 text-text-secondary text-sm font-semibold font-heading rounded-xl border border-surface-border hover:bg-surface-3 hover:text-text-primary hover:border-surface-4 transition-all duration-150"
          aria-label="Load more posts"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          Load more posts...
        </Link>
      )}

      {/* Traditional numbered pagination */}
      <nav
        className="flex items-center justify-center gap-3"
        aria-label="Pagination"
      >
        {hasPrev ? (
          <Link href={buildHref(page - 1)} className={`${btnBase} ${btnEnabled}`} aria-label="Previous page">
            Previous
          </Link>
        ) : (
          <span className={`${btnBase} ${btnDisabled}`} aria-disabled="true">
            Previous
          </span>
        )}

        <span
          className="px-4 py-2 text-sm font-medium text-text-muted font-heading bg-surface-1 rounded-lg border border-surface-border"
          aria-current="page"
        >
          Page {page} of ~{totalPages}
        </span>

        {hasNext ? (
          <Link href={buildHref(page + 1)} className={`${btnBase} ${btnEnabled}`} aria-label="Next page">
            Next
          </Link>
        ) : (
          <span className={`${btnBase} ${btnDisabled}`} aria-disabled="true">
            Next
          </span>
        )}
      </nav>
    </div>
  );
}
