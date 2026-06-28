export default function RootLoading() {
  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa", display: "flex", flexDirection: "column", fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif" }}>
      <header style={{ height: 56, borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", padding: "0 20px" }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 80" width="120" height="23" style={{ opacity: 0.3 }}>
          <defs><linearGradient id="l-grad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#2563eb"/><stop offset="100%" stopColor="#60a5fa"/></linearGradient></defs>
          <text x="76" y="54" fontFamily="'Russo One','Arial Black',sans-serif" fontSize="40" fill="#1a1a2e">AUT<tspan fill="url(#l-grad)">O</tspan>WNER</text>
        </svg>
      </header>
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#6b7280" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}>
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          <span style={{ fontSize: 14, fontWeight: 500 }}>Loading...</span>
        </div>
      </main>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}@media(prefers-color-scheme:dark){body{background:#0a0b0f;color:#f0f1f3}}`}</style>
    </div>
  );
}
