"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Pagination({
  page,
  totalCount,
  limit = 30,
}: {
  page: number;
  totalCount: number;
  limit?: number;
}) {
  const searchParams = useSearchParams();
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  if (totalPages <= 1) return null;

  const buildHref = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (p === 1) {
      params.delete("page");
    } else {
      params.set("page", String(p));
    }
    const qs = params.toString();
    return qs ? `/?${qs}` : "/";
  };

  const btnBase =
    "px-4 py-2 text-sm font-medium rounded-lg border transition-colors duration-150 font-heading";
  const btnEnabled =
    "bg-surface-2 border-surface-border text-text-secondary hover:bg-surface-3 hover:text-text-primary";
  const btnDisabled = "bg-surface-2 border-surface-border text-text-muted opacity-30 cursor-not-allowed";

  return (
    <nav
      className="flex items-center justify-center gap-3 mt-8 pt-6 border-t border-surface-border"
      aria-label="Pagination"
    >
      {hasPrev ? (
        <Link href={buildHref(page - 1)} className={`${btnBase} ${btnEnabled}`}>
          ← Previous
        </Link>
      ) : (
        <span className={`${btnBase} ${btnDisabled}`} aria-disabled="true">
          ← Previous
        </span>
      )}

      <span className="px-4 py-2 text-sm font-medium text-text-muted font-heading bg-surface-1 rounded-lg border border-surface-border">
        Page {page} of ~{totalPages}
      </span>

      {hasNext ? (
        <Link href={buildHref(page + 1)} className={`${btnBase} ${btnEnabled}`}>
          Next →
        </Link>
      ) : (
        <span className={`${btnBase} ${btnDisabled}`} aria-disabled="true">
          Next →
        </span>
      )}
    </nav>
  );
}
