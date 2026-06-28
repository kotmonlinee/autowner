"use client";

interface DiscussionPromptProps {
  commentCount: number;
  commentFormId?: string;
}

export default function DiscussionPrompt({
  commentCount,
  commentFormId = "comment-form",
}: DiscussionPromptProps) {
  const scrollToForm = () => {
    const el = document.getElementById(commentFormId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      // Focus the textarea if it exists
      const textarea = el.querySelector("textarea");
      if (textarea) {
        setTimeout(() => textarea.focus(), 400);
      }
    }
  };

  const promptText =
    commentCount === 0
      ? "Be the first to share your experience. Have you dealt with this issue on your car?"
      : commentCount <= 3
        ? "Join the discussion. What worked for you?"
        : "Continue the conversation";

  const ctaText =
    commentCount === 0
      ? "Start the discussion"
      : commentCount <= 3
        ? "Share your experience"
        : "Join in";

  return (
    <div className="bg-surface-1 rounded-xl border border-surface-border p-5">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <svg
            className="w-5 h-5 text-primary"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
           width={20} height={20}>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-text-primary font-heading mb-1">
            {promptText}
          </p>
          <p className="text-xs text-text-muted mb-3">
            Share your knowledge, tips, or experience with fellow car owners.
          </p>
          <button
            type="button"
            onClick={scrollToForm}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-glow hover:-translate-y-px transition-all duration-150 font-heading shadow-sm shadow-primary/20"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
             width={16} height={16}>
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            {ctaText}
          </button>
        </div>
      </div>
    </div>
  );
}
