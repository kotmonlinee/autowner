export default function ContentSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <header className="h-14 border-b border-surface-border bg-surface-1/80 backdrop-blur-sm" />
      <main className="max-w-4xl mx-auto px-5 py-6 flex-1 w-full animate-pulse">
        <div className="h-4 w-32 rounded bg-surface-2 mb-6" />
        <div className="h-8 w-72 rounded bg-surface-2 mb-4" />
        <div className="h-5 w-full max-w-2xl rounded bg-surface-2 mb-3" />
        <div className="h-5 w-5/6 rounded bg-surface-2 mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-surface-1 border border-surface-border" />
          ))}
        </div>
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="h-16 rounded-xl bg-surface-1 border border-surface-border mb-3" />
        ))}
      </main>
    </div>
  );
}
