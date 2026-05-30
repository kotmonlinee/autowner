export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <header className="h-14 border-b border-surface-border bg-surface-1/80 backdrop-blur-sm" />
      <main className="max-w-5xl mx-auto px-5 py-16 flex-1 w-full animate-pulse">
        <div className="text-center mb-12">
          <div className="h-10 w-64 mx-auto rounded bg-surface-2 mb-4" />
          <div className="h-5 w-96 mx-auto rounded bg-surface-2" />
        </div>
        <div className="h-14 max-w-2xl mx-auto rounded-xl bg-surface-1 border border-surface-border mb-16" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-48 rounded-2xl bg-surface-1 border border-surface-border" />
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mb-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-8 w-20 rounded-lg bg-surface-1 border border-surface-border" />
          ))}
        </div>
      </main>
    </div>
  );
}
