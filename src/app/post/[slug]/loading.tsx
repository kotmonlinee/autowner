export default function PostLoading() {
  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <header className="h-14 border-b border-surface-border bg-surface-1/80 backdrop-blur-sm" />
      <div className="max-w-7xl mx-auto px-5 py-6 flex gap-8 flex-1">
        <aside className="w-52 shrink-0 hidden md:block animate-pulse">
          <div className="sticky top-20 space-y-2">
            <div className="h-4 w-16 rounded bg-surface-2" />
            <div className="h-4 w-24 rounded bg-surface-2" />
            <div className="h-4 w-20 rounded bg-surface-2" />
          </div>
        </aside>
        <main className="flex-1 min-w-0 animate-pulse">
          <div className="space-y-4">
            <div className="h-5 w-32 rounded bg-surface-2" />
            <div className="h-10 w-96 rounded bg-surface-2" />
            <div className="h-6 w-64 rounded bg-surface-2" />
            <div className="h-80 rounded-xl bg-surface-1 border border-surface-border" />
          </div>
        </main>
      </div>
    </div>
  );
}
