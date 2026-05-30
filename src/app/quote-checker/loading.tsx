export default function QuoteCheckerLoading() {
  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <header className="h-14 border-b border-surface-border bg-surface-1/80 backdrop-blur-sm" />
      <main className="max-w-4xl mx-auto px-5 py-10 flex-1 w-full animate-pulse">
        <div className="h-8 w-48 rounded bg-surface-2 mb-4" />
        <div className="h-5 w-96 rounded bg-surface-2 mb-8" />
        <div className="h-80 rounded-2xl bg-surface-1 border border-surface-border" />
      </main>
    </div>
  );
}
