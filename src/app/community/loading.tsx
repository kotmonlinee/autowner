export default function CommunityLoading() {
  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <header className="h-14 border-b border-surface-border bg-surface-1/80 backdrop-blur-sm" />
      <main className="max-w-5xl mx-auto px-5 py-8 flex-1 w-full animate-pulse">
        <div className="h-8 w-48 rounded bg-surface-2 mb-8" />
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-surface-1 border border-surface-border" />
          ))}
        </div>
      </main>
    </div>
  );
}
