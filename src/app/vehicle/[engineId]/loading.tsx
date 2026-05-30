export default function VehicleLoading() {
  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <header className="h-14 border-b border-surface-border bg-surface-1/80 backdrop-blur-sm" />
      <main className="max-w-5xl mx-auto px-5 py-6 flex-1 w-full">
        <div className="space-y-4 animate-pulse">
          <div className="h-10 w-80 rounded bg-surface-2" />
          <div className="h-6 w-96 rounded bg-surface-2" />
          <div className="h-40 rounded-xl bg-surface-1 border border-surface-border" />
        </div>
      </main>
    </div>
  );
}
