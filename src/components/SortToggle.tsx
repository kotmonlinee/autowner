"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SortToggle() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("sort") ?? "hot";

  const handleSort = (sort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sort);
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex gap-0.5 bg-surface-2 rounded-lg p-1 border border-surface-border">
      {(["popular", "hot", "new"] as const).map(sort => (
        <button
          key={sort}
          onClick={() => handleSort(sort)}
          aria-pressed={current === sort}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium rounded-md transition-all duration-150 font-heading ${
            current === sort
              ? "bg-surface-3 text-text-primary shadow-sm"
              : "text-text-muted hover:text-text-secondary"
          }`}
        >
          {sort === "popular" && (
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14 2 9.27l6.91-1.01L12 1z"/>
            </svg>
          )}
          {sort === "hot" && (
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.66 11.2C17.43 10.9 17.15 10.64 16.89 10.38C16.22 9.78 15.46 9.35 14.82 8.72C13.33 7.26 13 4.85 13.95 3C13 3.23 12.17 3.75 11.46 4.32C8.87 6.4 7.85 10.07 9.07 13.22C9.11 13.32 9.15 13.42 9.15 13.55C9.15 13.77 9 13.97 8.8 14.05C8.57 14.15 8.33 14.09 8.14 13.93C8.08 13.88 8.04 13.83 8 13.76C6.87 12.33 6.69 10.28 7.45 8.64C5.78 10 4.87 12.3 5 14.47C5.06 14.97 5.12 15.47 5.29 15.97C5.43 16.57 5.7 17.17 6 17.7C7.08 19.43 8.95 20.67 10.96 20.92C13.1 21.19 15.39 20.8 16.85 19.32C18.53 17.61 19.09 15.15 18.64 12.85C18.45 11.55 18.1 10.4 17.66 11.2Z"/>
            </svg>
          )}
          {sort === "new" && (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {sort}
        </button>
      ))}
    </div>
  );
}
