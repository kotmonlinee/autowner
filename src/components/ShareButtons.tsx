"use client";

import { useState } from "react";

export default function ShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers / non-HTTPS
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareX = () => {
    const shareUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=400");
  };

  const shareFacebook = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=400");
  };

  return (
    <div className="bg-surface-1 rounded-xl border border-surface-border p-4 mt-4">
      <p className="text-xs font-bold uppercase tracking-widest text-text-muted font-heading mb-3">
        Share
      </p>
      <div className="flex items-center gap-2">
        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          aria-label={copied ? "Link copied" : "Copy link to clipboard"}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-2 border border-surface-border rounded-lg text-xs text-text-secondary hover:text-text-primary hover:border-surface-4 hover:bg-surface-3 transition-all duration-150"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
          <span className="font-heading font-medium">
            {copied ? "Copied!" : "Copy Link"}
          </span>
        </button>

        {/* Share on X */}
        <button
          onClick={shareX}
          aria-label="Share on X (Twitter)"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-2 border border-surface-border rounded-lg text-xs text-text-secondary hover:text-text-primary hover:border-surface-4 hover:bg-surface-3 transition-all duration-150"
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span className="font-heading font-medium">Share on X</span>
        </button>

        {/* Share on Facebook */}
        <button
          onClick={shareFacebook}
          aria-label="Share on Facebook"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-2 border border-surface-border rounded-lg text-xs text-text-secondary hover:text-text-primary hover:border-surface-4 hover:bg-surface-3 transition-all duration-150"
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span className="font-heading font-medium">Share on Facebook</span>
        </button>
      </div>
    </div>
  );
}
