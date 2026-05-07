interface RawContent {
  title: string;
  body: string;
  sourceUrl: string;
}

export function formatForPost(raw: RawContent): { title: string; body: string } {
  // Truncate long titles
  let title = raw.title.trim();
  if (title.length > 200) title = title.slice(0, 197) + "...";

  // Clean up markdown-style formatting from Reddit
  let body = raw.body
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .trim();

  // Append source link
  body += `\n\n---\n*Source: ${raw.sourceUrl}*`;

  return { title, body };
}

export function shouldSkip(title: string, body: string): boolean {
  // Skip if too short
  if (body.length < 100) return true;
  // Skip if title is just a question mark or very short
  if (title.length < 10) return true;
  return false;
}
