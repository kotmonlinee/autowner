import { marked } from "marked";

// Configure marked for safety and good output
marked.setOptions({
  breaks: true,        // single line breaks → <br>
  gfm: true,           // GitHub Flavored Markdown (tables, strikethrough, etc.)
});

/**
 * Decode HTML entities in a URL string.
 * Fixes common encoding issues with external image URLs (e.g. Reddit preview
 * URLs that have `&amp;` instead of `&`).
 */
function decodeUrlEntities(url: string): string {
  return url
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

/**
 * Post-process the rendered HTML to improve image handling:
 * - Fix HTML-entity encoding issues in image src URLs
 * - Add `loading="lazy"` for lazy loading
 * - Wrap each image in an anchor link so clicking opens the full-size image
 *   in a new tab
 *
 * Works on the raw HTML string without modifying marked's renderer, so it's
 * robust against future marked upgrades.
 */
function enhanceImages(html: string): string {
  return html.replace(/<img\b([^>]*?)>/gi, (_match, attrsStr) => {
    // Parse src attribute from the img tag
    const srcMatch = attrsStr.match(/src\s*=\s*"([^"]*)"/i);
    let src = srcMatch ? srcMatch[1] : "";

    // Fix encoding issues (e.g. Reddit `&amp;` → `&`)
    const cleanSrc = decodeUrlEntities(src);

    // Build the new img tag: preserve all attributes but rewrite src with
    // the cleaned URL and ensure loading="lazy" is set.
    let newAttrs = attrsStr;

    // Replace the original src with the cleaned version
    if (srcMatch) {
      newAttrs = newAttrs.replace(srcMatch[1], cleanSrc);
    }

    // Add loading="lazy" if not already present
    if (!/loading\s*=/i.test(newAttrs)) {
      newAttrs += ' loading="lazy"';
    }

    const imgTag = `<img${newAttrs}>`;

    // If there's no meaningful src, just return the img tag as-is
    if (!cleanSrc || cleanSrc.startsWith("data:")) {
      return imgTag;
    }

    // Wrap in a link to the full-size image (opens in new tab)
    return (
      `<a href="${cleanSrc}" target="_blank" rel="noopener noreferrer" ` +
      `class="image-expand-link">${imgTag}</a>`
    );
  });
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function addHeadingIds(html: string): string {
  // Match full h2/h3 elements: <h2>Text</h2> or <h2>Text with <strong>formatting</strong></h2>
  return html.replace(
    /<(h[23])([^>]*)>(.+?)<\/\1>/gi,
    (_match, tag, attrs, innerHtml) => {
      // Strip HTML tags from inner content to get plain text for the id
      const plainText = innerHtml.replace(/<[^>]*>/g, "").trim();
      const id = slugify(plainText);
      return `<${tag} id="${id}"${attrs}>${innerHtml}</${tag}>`;
    }
  );
}

export default function MarkdownBody({ content, className }: { content: string; className?: string }) {
  const rawHtml = marked.parse(content, { async: false }) as string;
  const withImages = enhanceImages(rawHtml);
  const html = addHeadingIds(withImages);

  const defaultClasses = "prose-dark text-[15px] leading-relaxed min-w-0";
  const combinedClasses = className ? `${defaultClasses} ${className}` : defaultClasses;

  return (
    <div
      className={combinedClasses}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
