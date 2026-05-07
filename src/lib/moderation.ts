export interface ModerationResult {
  flagged: boolean;
  reason?: string;
}

// Common spam keywords found in vehicle/finance/crypto spam.
const SPAM_KEYWORDS = [
  "buy now",
  "click here",
  "limited offer",
  "act now",
  "free money",
  "earn money",
  "credit score",
  "refinance",
  "bitcoin",
  "crypto currency",
  "cryptocurrency",
  "forex",
  "casino",
  "gambling",
  "viagra",
  "cialis",
  "weight loss",
  "SEO services",
  "cheap followers",
  "guaranteed approval",
  "no credit check",
  "wire transfer",
  "western union",
  "money gram",
  "lottery",
  "you won",
  "claim prize",
  "nigerian",
  "prince",
  "testimonial",
  "miracle",
  "cure",
];

// Maximum number of links allowed in content.
const MAX_LINKS = 3;

// Minimum body length after trimming whitespace.
const MIN_BODY_LENGTH = 10;

// Minimum title length for scraped posts.
const MIN_SCRAPED_TITLE_LENGTH = 20;

/**
 * Count the number of URLs/links in a text string.
 */
function countLinks(text: string): number {
  const urlPattern = /https?:\/\/[^\s]+/gi;
  const matches = text.match(urlPattern);
  return matches ? matches.length : 0;
}

/**
 * Check if a string is primarily all-caps (title case).
 * Ignores very short strings and allows some lowercase words.
 */
function isAllCapsTitle(title: string): boolean {
  const cleaned = title.replace(/[^a-zA-Z]/g, "");
  if (cleaned.length < 10) return false; // Short titles are ok
  const upperCount = (cleaned.match(/[A-Z]/g) ?? []).length;
  return upperCount / cleaned.length > 0.9;
}

/**
 * Check if content has proper punctuation.
 * Gibberish and auto-generated text often lacks punctuation.
 */
function hasPunctuation(text: string): boolean {
  // Strip markdown formatting first
  const cleaned = text
    .replace(/[#*`\[\]()>!\[\]-]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  // Check for sentence-ending punctuation
  return /[.!?]/.test(cleaned);
}

/**
 * Check if content is essentially just links with no real text.
 */
function isOnlyLinks(text: string): boolean {
  const urlPattern = /https?:\/\/[^\s]+/gi;
  const withoutLinks = text.replace(urlPattern, "").trim();
  // If removing links leaves fewer than 20 chars of real text, it's link-only.
  return withoutLinks.length < 20;
}

/**
 * Check user-generated content (posts, comments) for spam patterns.
 *
 * @param text - The content to check (title for post, body for comment).
 * @param additionalText - Optional second text (e.g., post body when title is first).
 */
export function checkContent(text: string, additionalText?: string): ModerationResult {
  const contentToCheck = additionalText ? `${text}\n${additionalText}` : text;
  const lower = contentToCheck.toLowerCase();

  // Check body length
  const trimmed = text.trim();
  if (trimmed.length < MIN_BODY_LENGTH) {
    return { flagged: true, reason: "Content is too short" };
  }

  // Check for too many links
  const linkCount = countLinks(contentToCheck);
  if (linkCount > MAX_LINKS) {
    return { flagged: true, reason: `Too many links (${linkCount} found, max ${MAX_LINKS} allowed)` };
  }

  // Check for all-caps title (only when title is provided as the first argument)
  if (additionalText && isAllCapsTitle(text)) {
    return { flagged: true, reason: "Title appears to be in all caps" };
  }

  // Check for spam keywords
  for (const keyword of SPAM_KEYWORDS) {
    if (lower.includes(keyword)) {
      return { flagged: true, reason: `Content contains spam keyword: "${keyword}"` };
    }
  }

  return { flagged: false };
}

/**
 * Additional checks for scraped/content-aggregated posts.
 * These are stricter since scraped content comes from automated sources.
 */
export function checkScrapedContent(title: string, body: string): ModerationResult {
  // Run the standard check first
  const standardResult = checkContent(title, body);
  if (standardResult.flagged) return standardResult;

  // Scraped-specific: skip posts with no punctuation (likely gibberish)
  if (!hasPunctuation(body)) {
    return { flagged: true, reason: "Scraped content has no punctuation (likely gibberish)" };
  }

  // Scraped-specific: skip posts that are just links with no text
  if (isOnlyLinks(body)) {
    return { flagged: true, reason: "Scraped content is just links with no meaningful text" };
  }

  // Scraped-specific: skip very short titles after cleanup
  const cleanedTitle = title.replace(/[#*`\[\]()>!\[\]]/g, "").trim();
  if (cleanedTitle.length < MIN_SCRAPED_TITLE_LENGTH) {
    return { flagged: true, reason: `Title too short after cleanup (${cleanedTitle.length} chars, min ${MIN_SCRAPED_TITLE_LENGTH})` };
  }

  return { flagged: false };
}
