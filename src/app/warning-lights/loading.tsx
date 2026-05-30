export default function WarningLightsLoading() {
  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <header className="h-14 border-b border-surface-border bg-surface-1/80 backdrop-blur-sm" />
      <main className="max-w-4xl mx-auto px-5 py-10 flex-1 w-full animate-pulse">
        <div className="h-8 w-96 rounded bg-surface-2 mb-4" />
        <div className="h-5 w-64 rounded bg-surface-2 mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-48 rounded-2xl bg-surface-1 border border-surface-border" />
          ))}
        </div>
      </main>
    </div>
  );
}
