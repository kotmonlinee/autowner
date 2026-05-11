"use client";

import { useState, useMemo } from "react";

interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

function extractHeadings(markdown: string): Heading[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: Heading[] = [];
  let match;
  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length as 2 | 3;
    if (level === 2 || level === 3) {
      headings.push({
        id: match[2]
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
        text: match[2],
        level,
      });
    }
  }
  return headings;
}

function headingIdFromMarkdown(headingText: string): string {
  return headingText
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ArticleTOC({ body }: { body: string }) {
  const [collapsed, setCollapsed] = useState(false);

  const headings = useMemo(() => extractHeadings(body), [body]);

  if (headings.length === 0) return null;

  const scrollToHeading = (headingText: string) => {
    const id = headingIdFromMarkdown(headingText);

    // Try direct ID lookup first (headings now have IDs via MarkdownBody)
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
      return;
    }

    // Fallback: search by text content in the prose container
    const proseContainer = document.querySelector(".prose-dark");
    if (!proseContainer) return;
    const allHeadings = proseContainer.querySelectorAll("h2, h3");
    for (const h of allHeadings) {
      if (h.textContent?.trim() === headingText.trim()) {
        h.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", `#${id}`);
        return;
      }
    }
  };

  return (
    <div className="mb-5 bg-surface-2 rounded-xl border border-surface-border overflow-hidden">
      {/* Header — click to toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-surface-3 transition-colors"
        aria-expanded={!collapsed}
      >
        <div className="flex items-center gap-2.5">
          <svg
            className="w-4 h-4 text-primary shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
          <span className="text-xs font-bold text-text-primary font-heading uppercase tracking-wider">
            In this article
          </span>
        </div>
        <svg
          className={`w-4 h-4 text-text-muted transition-transform duration-200 shrink-0 ${
            collapsed ? "" : "rotate-180"
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Body */}
      {!collapsed && (
        <div className="px-4 pb-3 space-y-1 border-t border-surface-border pt-3">
          {headings.map((h, i) => (
            <button
              key={i}
              onClick={() => scrollToHeading(h.text)}
              className={`w-full text-left px-2 py-1.5 rounded-md text-sm leading-snug transition-colors hover:bg-surface-3 hover:text-primary font-heading ${
                h.level === 3
                  ? "pl-6 text-text-muted text-xs"
                  : "text-text-secondary font-medium"
              }`}
            >
              <span className="text-[10px] font-bold text-text-muted mr-1.5 tabular-nums">
                {(i + 1).toString().padStart(2, "0")}
              </span>
              {h.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
