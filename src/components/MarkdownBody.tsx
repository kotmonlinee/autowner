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

    // Add default width/height to prevent CLS (browsers reserve space via aspect-ratio)
    if (!/width\s*=/i.test(newAttrs)) {
      newAttrs += ' width="800"';
    }
    if (!/height\s*=/i.test(newAttrs)) {
      newAttrs += ' height="450"';
    }

    const imgTag = `<img${newAttrs} style="max-width:100%;height:auto">`;

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

/**
 * Post-process the rendered HTML to auto-link OBD-II diagnostic trouble codes.
 * Wraps codes like P0420, P0301, C0035, U0100 in links to /obd/[code],
 * but avoids double-wrapping codes that are already inside an anchor tag.
 */
function autoLinkObdCodes(html: string): string {
  // First, extract all existing <a>...</a> tags and replace with placeholders
  // so we don't accidentally double-wrap OBD codes inside links.
  const anchors: string[] = [];
  const htmlWithoutAnchors = html.replace(
    /<a\b[^>]*>.*?<\/a>/gi,
    (match) => {
      anchors.push(match);
      return `\x00OBD_ANCHOR_${anchors.length - 1}\x00`;
    },
  );

  // Match OBD-II diagnostic trouble codes:
  //   Powertrain:   P0xxx–P3xxx
  //   Chassis:      C0xxx–C2xxx
  //   Body:         B0xxx–B3xxx
  //   Network:      U0xxx–U2xxx
  // Case-insensitive, whole-word only.
  const obdRegex =
    /\b([Pp][0-3]\d{3}|[Cc][0-2]\d{3}|[Bb][0-3]\d{3}|[Uu][0-2]\d{3})\b/g;

  const linkedHtml = htmlWithoutAnchors.replace(
    obdRegex,
    (_match, code) =>
      `<a href="/obd/${code}" class="obd-code-link">${code}</a>`,
  );

  // Restore the original anchor tags
  return linkedHtml.replace(
    /\x00OBD_ANCHOR_(\d+)\x00/g,
    (_match, index) => anchors[parseInt(index as string, 10)],
  );
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
  const withObdLinks = autoLinkObdCodes(withImages);
  const html = addHeadingIds(withObdLinks);

  const defaultClasses = "prose-dark text-[15px] leading-relaxed min-w-0";
  const combinedClasses = className ? `${defaultClasses} ${className}` : defaultClasses;

  return (
    <div
      className={combinedClasses}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
