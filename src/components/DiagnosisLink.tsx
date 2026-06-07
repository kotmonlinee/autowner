"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function DiagnosisLink() {
  const [query, setQuery] = useState("");

  useEffect(() => {
    // Listen for input changes on the search bar to capture user's query
    const input = document.querySelector<HTMLInputElement>('input[name="search"]');
    if (!input) return;
    const handler = () => setQuery(input.value);
    input.addEventListener("input", handler);
    return () => input.removeEventListener("input", handler);
  }, []);

  const href = query.trim() ? `/symptom-checker?q=${encodeURIComponent(query.trim())}` : "/symptom-checker";

  return (
    <div className="mt-2 text-sm font-heading">
      <span className="text-text-muted">Not sure what's wrong? </span>
      <Link href={href} className="text-primary hover:text-primary-glow font-semibold transition-colors">
        AI Diagnosis →
      </Link>
    </div>
  );
}
