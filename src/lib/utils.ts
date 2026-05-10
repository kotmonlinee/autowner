/**
 * Format a date string into a human-readable relative time string.
 * - < 60 seconds: "just now"
 * - < 60 minutes: "Xm ago"
 * - < 24 hours:   "Xh ago"
 * - < 30 days:    "Xd ago"
 * - < 12 months:  "Xmo ago"
 * - >= 1 year:    "Mon DD, YYYY"
 */
export function timeAgo(date: string): string {
  const now = Date.now();
  const then = new Date(date).getTime();
  const seconds = Math.floor((now - then) / 1000);

  if (seconds < 60) return "just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;

  // Older than 1 year: "Mon DD, YYYY"
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}
