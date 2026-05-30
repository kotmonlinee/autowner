export default function ObdLoading() {
  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <header className="h-14 border-b border-surface-border bg-surface-1/80 backdrop-blur-sm" />
      <main className="max-w-4xl mx-auto px-5 py-6 flex-1 w-full animate-pulse">
        <div className="h-5 w-32 rounded bg-surface-2 mb-4" />
        <div className="h-14 w-full max-w-xl rounded-xl bg-surface-1 border border-surface-border mb-8" />
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-surface-1 border border-surface-border" />
          ))}
        </div>
      </main>
    </div>
  );
}
