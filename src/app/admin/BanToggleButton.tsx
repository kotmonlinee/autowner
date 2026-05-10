"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BanToggleButton({
  userId,
  isBanned,
}: {
  userId: string;
  isBanned: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/ban/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: isBanned ? "unban" : "ban" }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error ?? "Failed to update ban status");
      } else {
        router.refresh();
      }
    } catch {
      alert("Network error");
    } finally {
      setLoading(false);
    }
  }

  if (isBanned) {
    return (
      <button
        onClick={handleToggle}
        disabled={loading}
        className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg text-xs font-bold hover:bg-emerald-500/20 transition-colors font-heading border border-emerald-500/20 disabled:opacity-50"
      >
        {loading ? "..." : "Unban"}
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className="px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg text-xs font-bold hover:bg-red-500/20 transition-colors font-heading border border-red-500/20 disabled:opacity-50"
    >
      {loading ? "..." : "Ban"}
    </button>
  );
}
