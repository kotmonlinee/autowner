export default function PostCardSkeleton({ index = 0 }: { index?: number }) {
  return (
    <article
      className="flex gap-4 p-4 bg-surface-1 rounded-xl border border-surface-border animate-pulse"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Vote buttons placeholder */}
      <div className="flex flex-col items-center shrink-0 w-9 gap-0.5">
        <div className="w-6 h-6 rounded bg-surface-3" />
        <div className="w-5 h-3 rounded bg-surface-3 my-0.5" />
        <div className="w-6 h-6 rounded bg-surface-3" />
      </div>

      {/* Content area */}
      <div className="flex-1 min-w-0 space-y-2.5">
        {/* Category badge + extra badges */}
        <div className="flex items-center gap-2">
          <div className="h-[18px] w-16 rounded-full bg-surface-3" />
          <div className="h-[18px] w-10 rounded bg-surface-3" />
          <div className="h-[18px] w-12 rounded bg-surface-3" />
        </div>

        {/* Title — 2 lines */}
        <div className="space-y-1.5">
          <div className="h-[18px] w-full rounded bg-surface-3" />
          <div className="h-[18px] w-3/4 rounded bg-surface-3" />
        </div>

        {/* Tags area */}
        <div className="flex gap-1.5">
          <div className="h-[20px] w-14 rounded-md bg-surface-3" />
          <div className="h-[20px] w-12 rounded-md bg-surface-3" />
          <div className="h-[20px] w-16 rounded-md bg-surface-3" />
        </div>

        {/* Footer: username, comments, time */}
        <div className="flex items-center gap-2.5">
          <div className="h-3 w-16 rounded bg-surface-3" />
          <div className="w-0.5 h-0.5 rounded-full bg-surface-border" />
          <div className="h-3 w-10 rounded bg-surface-3" />
          <div className="w-0.5 h-0.5 rounded-full bg-surface-border" />
          <div className="h-3 w-12 rounded bg-surface-3" />
        </div>
      </div>
    </article>
  );
}
