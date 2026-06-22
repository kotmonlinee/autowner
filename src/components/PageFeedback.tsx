"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "autowner_feedback_done";

export default function PageFeedback() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [helpful, setHelpful] = useState<boolean | null>(null);
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const submitYes = async () => {
    setSaving(true);
    try {
      await fetch("/api/page-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageUrl: pathname, helpful: true }),
      });
    } catch { /* silently fail */ }
    setSaving(false);
    setSubmitted(true);
    localStorage.setItem(STORAGE_KEY, "1");
  };

  const submitNo = async () => {
    setSaving(true);
    try {
      await fetch("/api/page-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageUrl: pathname, helpful: false, reason }),
      });
    } catch { /* silently fail */ }
    setSaving(false);
    setSubmitted(true);
    localStorage.setItem(STORAGE_KEY, "1");
  };

  return (
    <div className="max-w-4xl mx-auto px-5 mb-8">
      <div className="bg-surface-1 rounded-2xl border border-surface-border p-5 text-center">
        {submitted ? (
          <p className="text-sm text-text-secondary font-heading">Thanks for your feedback!</p>
        ) : helpful === false ? (
          <>
            <p className="text-sm text-text-secondary font-heading mb-3">What was missing or unclear?</p>
            <div className="max-w-md mx-auto">
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Let us know what you were looking for... (optional)"
                rows={3}
                className="w-full px-3 py-2 bg-surface-0 border border-surface-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none mb-3"
              />
              <button
                onClick={submitNo}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-primary text-white text-sm font-semibold font-heading rounded-lg hover:bg-primary-glow transition-all disabled:opacity-50"
              >
                Submit Feedback
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-text-secondary font-heading mb-3">Was this page helpful?</p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={submitYes}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-surface-0 border border-surface-border rounded-lg text-sm font-heading font-semibold text-text-primary hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 transition-all disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" /><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>
                Yes
              </button>
              <button
                onClick={() => setHelpful(false)}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-surface-0 border border-surface-border rounded-lg text-sm font-heading font-semibold text-text-primary hover:border-red-400 hover:bg-red-50 hover:text-red-700 transition-all disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z" /><path d="M17 2h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3" /></svg>
                No
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
