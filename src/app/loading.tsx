import PostCardSkeleton from "@/components/PostCardSkeleton";

export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-surface-0 relative flex flex-col">
      {/* Navbar placeholder */}
      <header className="h-14 border-b border-surface-border bg-surface-1/80 backdrop-blur-sm" />

      <div className="max-w-7xl mx-auto px-5 py-6 flex gap-8 flex-1">
        {/* Sidebar placeholder */}
        <aside className="w-52 shrink-0 hidden md:block">
          <nav className="sticky top-20 space-y-0.5">
            <div className="px-2 pb-2 mb-2 border-b border-surface-border">
              <div className="h-3 w-12 rounded bg-surface-2 animate-pulse" />
            </div>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2.5 px-3 py-2">
                <div className="w-4 h-4 rounded bg-surface-2 animate-pulse shrink-0" />
                <div className="h-3.5 w-20 rounded bg-surface-2 animate-pulse" />
              </div>
            ))}
            <div className="mt-4 pt-3 border-t border-surface-border" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2.5 px-3 py-2">
                <div className="h-3.5 w-24 rounded bg-surface-2 animate-pulse" />
              </div>
            ))}
          </nav>
        </aside>

        {/* Main feed area */}
        <main className="flex-1 min-w-0">
          {/* Sort toggle placeholder */}
          <div className="flex items-center justify-between mb-5">
            <div className="h-9 w-28 rounded-lg bg-surface-1 animate-pulse border border-surface-border" />
            <div className="h-4 w-14 rounded bg-surface-2 animate-pulse" />
          </div>

          {/* 6 skeleton cards */}
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <PostCardSkeleton key={i} index={i} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
