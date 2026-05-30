"use client";

import { useState } from "react";

const REASONS = [
  { value: "spam", label: "Spam" },
  { value: "harassment", label: "Harassment" },
  { value: "misinformation", label: "Misinformation" },
  { value: "offensive", label: "Offensive" },
  { value: "other", label: "Other" },
] as const;

type ReportState = "idle" | "open" | "submitting" | "submitted";

export default function ReportButton({
  targetType,
  targetId,
  userId,
}: {
  targetType: "post" | "comment";
  targetId: string;
  userId?: string;
}) {
  const [state, setState] = useState<ReportState>("idle");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  if (!userId) return null;

  const handleOpen = () => {
    setState("open");
    setReason("");
    setDescription("");
    setError("");
  };

  const handleClose = () => {
    setState("idle");
  };

  const handleSubmit = async () => {
    if (!reason) return;
    setState("submitting");
    setError("");

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetType,
          targetId,
          reason,
          description: description.trim() || undefined,
        }),
      });

      if (res.ok) {
        setState("submitted");
      } else {
        const data = await res.json().catch(() => ({ error: "Failed to submit report" }));
        setError(data.error ?? "Failed to submit report");
        setState("open");
      }
    } catch {
      setError("Network error. Please try again.");
      setState("open");
    }
  };

  return (
    <>
      {/* Flag icon button */}
      <button
        onClick={handleOpen}
        className="p-2.5 text-text-muted hover:text-amber-400 transition-colors rounded-lg"
        title="Report this content"
        aria-label="Report this content"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
          />
        </svg>
      </button>

      {/* Modal overlay */}
      {state !== "idle" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <div
            className="bg-surface-1 rounded-xl border border-surface-border p-5 w-full max-w-sm mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {state === "submitted" ? (
              /* Submitted state */
              <div className="text-center py-4">
                <svg
                  className="w-10 h-10 mx-auto mb-3 text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-text-primary font-heading font-semibold text-sm">
                  Thanks for reporting
                </p>
                <p className="text-text-muted text-xs mt-1">
                  We will review this content.
                </p>
                <button
                  onClick={handleClose}
                  className="mt-4 px-4 py-2 bg-surface-3 text-text-secondary text-xs font-bold rounded-lg hover:bg-surface-4 transition-colors font-heading"
                >
                  Close
                </button>
              </div>
            ) : (
              /* Form state */
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-text-primary font-heading">
                    Report {targetType === "post" ? "Post" : "Comment"}
                  </h3>
                  <button
                    onClick={handleClose}
                    className="p-2.5 text-text-muted hover:text-text-secondary transition-colors rounded-lg"
                    aria-label="Close"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-medium">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  {/* Reason dropdown */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5 font-heading">
                      Reason
                    </label>
                    <select
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full px-3 py-2 bg-surface-2 text-text-primary text-sm rounded-lg border border-surface-border focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-all appearance-none"
                    >
                      <option value="">Select a reason...</option>
                      {REASONS.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Description textarea */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5 font-heading">
                      Description{" "}
                      <span className="text-text-muted font-normal normal-case tracking-normal">
                        (optional)
                      </span>
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      placeholder="Additional details..."
                      className="w-full px-3 py-2 bg-surface-2 text-text-primary text-sm rounded-lg border border-surface-border focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-all resize-none placeholder:text-text-muted"
                    />
                  </div>

                  {/* Submit button */}
                  <button
                    onClick={handleSubmit}
                    disabled={state === "submitting" || !reason}
                    className="w-full px-4 py-2 bg-amber-500 text-white text-sm font-bold rounded-lg hover:bg-amber-600 transition-colors font-heading disabled:opacity-40 shadow-sm shadow-amber-500/20"
                  >
                    {state === "submitting" ? "Submitting..." : "Submit Report"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
