// Content Pipeline v2 — SEO competitor research pipeline
// Run: npx tsx scripts/content-pipeline-v2.ts "best brake pads for BMW 3 series"
//
// Pipeline: SEO keyword → Search competitors → Analyze gaps → Generate better content → Publish
//
// Uses Bing RSS feed (free, no API key needed). Falls back gracefully if search is unavailable.

import * as cheerio from "cheerio";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

// ═══════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  domain: string;
}

interface CompetitorContent {
  url: string;
  domain: string;
  title: string;
  headings: string[];
  keyPoints: string[];
  snippet: string;
  wordCount: number;
  error?: string;
}

interface GapAnalysis {
  competitors: CompetitorContent[];
  coveredTopics: string[];
  missingTopics: string[];
  suggestedTopics: string[];
}

// ═══════════════════════════════════════════════════════════════
// Configuration
// ═══════════════════════════════════════════════════════════════

const DELAY_MS = 2000;
const REQUEST_TIMEOUT_MS = 12_000;
const MAX_COMPETITORS = 5;
const OUTPUT_DIR = join(process.cwd(), "docs", "content", "briefs");

// Domains we prefer for authentic, first-hand automotive knowledge
const FORUM_DOMAINS = [
  "reddit.com",
  "bimmerpost.com",
  "vwvortex.com",
  "tacomaworld.com",
  "bobistheoilguy.com",
  "mechanics.stackexchange.com",
  "youtube.com",
  "bimmerfest.com",
  "e90post.com",
  "f30post.com",
  "m3post.com",
  "xoutpost.com",
  "renntech.org",
  "6speedonline.com",
  "rennlist.com",
  "clublexus.com",
  "mbworld.org",
  "audiworld.com",
  "audizine.com",
  "corvetteforum.com",
  "mustang6g.com",
  "camaro6.com",
  "jeepforum.com",
  "wranglerforum.com",
  "tundras.com",
  "tacomaforum.com",
  "ramforum.com",
  "ford-trucks.com",
  "f150forum.com",
  "gmtruckclub.com",
  "garagejournal.com",
  "grassrootsmotorsports.com",
  "miata.net",
  "nsxprime.com",
  "s2ki.com",
  "rx7club.com",
  "rx8club.com",
  "ls1tech.com",
  "nasioc.com",
  "iwsti.com",
  "golfmk7.com",
  "golfmk6.com",
  "vwroc.com",
  "pelicanparts.com",
  "e46fanatics.com",
  "m5board.com",
  "ferrarichat.com",
  "lamborghini-talk.com",
  "planet-9.com",
  "teslamotorsclub.com",
  "priuschat.com",
  "honda-tech.com",
  "driveaccord.net",
  "odyclub.com",
  "fitfreak.net",
  "8thcivic.com",
  "civicx.com",
  "bringatrailer.com",
  "bimmerpulse.com",
  "bmwblog.com",
  "bmwtuning.co",
  "europremiumparts.com",
  "roadlancer.com",
  "gearshifters.org",
  "bmwguide.net",
  "classic.com",
  "prestigeandperformancecar.com",
  "insideevs.com",
];

// Known content farms — skip these entirely
const CONTENT_FARM_PATTERNS = [
  "ezoic",
  "mediavine",
  "article-city",
  "articlealley",
  "ezinearticles",
  "hubpages.com",
  "buzzle.com",
  "infobarrel.com",
  "articlebase.com",
];

// Topics 老李 can uniquely cover (real-world mechanic knowledge)
const LAOLI_EXPERTISE = [
  "Real part numbers (OEM and aftermarket options with pricing)",
  "Torque specs and tightening sequences",
  "Actual labor time (book time vs real time)",
  "Common mistakes DIYers make on this job",
  "Tools needed (including specialty tools)",
  "Step-by-step install procedure with photos",
  "Before/after driving impressions",
  "Long-term durability update",
  "Cost breakdown (parts + labor + shop quotes)",
  "Alternative/budget options that actually work",
  "Warning signs of failing parts",
  "Compatibility notes (year ranges, trim levels, packages)",
];

// ═══════════════════════════════════════════════════════════════
// Utilities
// ═══════════════════════════════════════════════════════════════

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 80);
}

function cleanText(text: string): string {
  if (!text) return "";
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#x2F;/g, "/")
    .replace(/&nbsp;/g, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function extractDomain(url: string): string {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    return hostname;
  } catch {
    return "";
  }
}

function isForumDomain(domain: string): boolean {
  return FORUM_DOMAINS.some(
    (d) => domain === d || domain.endsWith("." + d)
  );
}

function isAutomotiveDomain(domain: string): boolean {
  const autoTerms = [
    "bmw", "bimmer", "car", "auto", "motor", "truck", "jeep", "toyota",
    "honda", "ford", "chevy", "mopar", "diesel", "tuner", "racing",
    "overland", "garage", "mechanic", "tire", "wheel", "drive",
    "classic", "review", "bringatrailer", "insideevs", "caranddriver",
    "roadandtrack", "motortrend", "autoblog", "jalopnik", "the drive",
    "gear", "shift", "piston", "crank", "axle", "brake", "suspension",
  ];
  return autoTerms.some((t) => domain.includes(t));
}

function isContentFarm(url: string): boolean {
  const lower = url.toLowerCase();
  return CONTENT_FARM_PATTERNS.some((p) => lower.includes(p));
}

// ═══════════════════════════════════════════════════════════════
// HTTP helpers
// ═══════════════════════════════════════════════════════════════

async function fetchWithTimeout(
  url: string,
  timeoutMs: number = REQUEST_TIMEOUT_MS
): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}`);
    }

    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

// ═══════════════════════════════════════════════════════════════
// Step 2: Search — Bing RSS (primary), DuckDuckGo HTML (fallback)
// ═══════════════════════════════════════════════════════════════

async function searchBingRSS(keyword: string): Promise<SearchResult[]> {
  // Bing RSS feed — clean XML, works internationally, no API key needed
  // Parameters: ensearch=1 forces English search, cc=us uses US market
  const url =
    `https://www.bing.com/search?q=${encodeURIComponent(keyword)}` +
    `&format=rss&ensearch=1&cc=us&setmkt=en-US&setlang=en`;

  console.log(`  Bing RSS: ${url}`);
  const xml = await fetchWithTimeout(url);
  const $ = cheerio.load(xml, { xmlMode: true });

  const results: SearchResult[] = [];

  $("item").each((_i, el) => {
    const $el = $(el);
    const title = cleanText($el.find("title").text());
    const url = $el.find("link").text().trim();
    const snippet = cleanText($el.find("description").text());

    if (!title || !url || !url.startsWith("http")) return;

    const domain = extractDomain(url);
    if (!domain) return;

    // Skip content farms
    if (isContentFarm(url)) return;

    // Skip social media aggregators that won't have useful content
    if (
      domain.includes("pinterest") ||
      domain.includes("facebook.com") ||
      domain.includes("instagram.com") ||
      domain.includes("tiktok.com")
    ) {
      return;
    }

    results.push({ title, url, snippet, domain });
  });

  return results;
}

async function searchDuckDuckGoHTML(
  keyword: string
): Promise<SearchResult[]> {
  const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(keyword)}`;
  console.log(`  DDG HTML: ${url}`);

  const html = await fetchWithTimeout(url, 8000); // shorter timeout since DDG is often blocked
  const $ = cheerio.load(html);

  const results: SearchResult[] = [];

  $(".result").each((_i, el) => {
    const $el = $(el);
    const $link = $el.find("a.result__a").first();
    const title = cleanText($link.text());
    let resultUrl = $link.attr("href") ?? "";
    const snippet = cleanText(
      $el.find("a.result__snippet").text() ||
        $el.find(".result__snippet").text() ||
        ""
    );

    if (!title || !resultUrl) return;

    // Decode DDG redirect URLs
    if (resultUrl.startsWith("/l/?uddg=")) {
      const match = resultUrl.match(/uddg=([^&]+)/);
      if (match) resultUrl = decodeURIComponent(match[1]);
    }

    if (!resultUrl.startsWith("http")) return;

    const domain = extractDomain(resultUrl);
    if (!domain || isContentFarm(resultUrl)) return;

    results.push({ title, url: resultUrl, snippet, domain });
  });

  return results;
}

async function searchAll(keyword: string): Promise<SearchResult[]> {
  // Try Bing RSS first (reliable internationally)
  try {
    const results = await searchBingRSS(keyword);
    if (results.length > 0) return results;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log(`  Bing RSS failed: ${msg}`);
  }

  // Fallback to DuckDuckGo HTML
  try {
    const results = await searchDuckDuckGoHTML(keyword);
    if (results.length > 0) return results;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log(`  DDG HTML failed: ${msg}`);
  }

  return [];
}

// ═══════════════════════════════════════════════════════════════
// Step 3: Fetch and parse competitor content
// ═══════════════════════════════════════════════════════════════

async function parseCompetitorPage(
  result: SearchResult
): Promise<CompetitorContent> {
  const isYouTube = result.domain.includes("youtube.com");

  try {
    console.log(`  Fetching: ${result.domain} — ${result.title.substring(0, 50)}`);
    const html = await fetchWithTimeout(result.url);
    const $ = cheerio.load(html);

    if (isYouTube) {
      return parseYouTubePage($, result);
    }
    return parseGeneralPage($, result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log(`  ✗ Skipping ${result.domain}: ${msg}`);
    return {
      url: result.url,
      domain: result.domain,
      title: result.title,
      headings: [],
      keyPoints: [result.snippet].filter(Boolean),
      snippet: result.snippet,
      wordCount: 0,
      error: msg,
    };
  }
}

function parseYouTubePage(
  $: cheerio.CheerioAPI,
  result: SearchResult
): CompetitorContent {
  const metaTitle =
    $('meta[property="og:title"]').attr("content") ||
    $("title").text() ||
    result.title;
  const metaDescription =
    $('meta[property="og:description"]').attr("content") ||
    $('meta[name="description"]').attr("content") ||
    "";

  const descLower = metaDescription.toLowerCase();
  const keyPoints: string[] = [];
  const topicPatterns = [
    "best", "review", "install", "replacement", "upgrade",
    "comparison", "vs", "budget", "premium", "oem",
    "aftermarket", "performance", "cost", "price", "worth",
    "guide", "tutorial", "diy", "how to", "step",
  ];
  for (const pattern of topicPatterns) {
    if (descLower.includes(pattern)) {
      const idx = descLower.indexOf(pattern);
      const snippet = metaDescription.substring(
        Math.max(0, idx - 20),
        Math.min(metaDescription.length, idx + 60)
      );
      keyPoints.push(snippet.trim());
    }
  }

  return {
    url: result.url,
    domain: result.domain,
    title: cleanText(metaTitle),
    headings: ["YouTube video — see title and description for topics"],
    keyPoints: keyPoints.slice(0, 5),
    snippet: metaDescription.substring(0, 300),
    wordCount: metaDescription.split(/\s+/).length,
  };
}

function parseGeneralPage(
  $: cheerio.CheerioAPI,
  result: SearchResult
): CompetitorContent {
  // Remove non-content elements
  $(
    "script, style, nav, footer, header, .sidebar, .ad, .advertisement, " +
    ".comments, .social-share, .related-posts, noscript, iframe"
  ).remove();

  // Page title
  const pageTitle =
    $('meta[property="og:title"]').attr("content") ||
    $("h1").first().text() ||
    $("title").text() ||
    result.title;

  // Headings (H2, H3) — filter out site chrome / nav / marketing headings
  const skipHeadingPatterns = [
    "shop", "search", "menu", "footer", "header", "sidebar",
    "social", "share", "subscribe", "newsletter", "login", "sign up",
    "account", "cart", "checkout", "cookie", "privacy", "terms",
    "copyright", "all rights reserved", "©",
    "site map", "navigation", "related posts", "recent posts",
    "advertisement", "sponsored", "follow us", "connect with us",
    "previous", "next page", "load more", "see more",
  ];

  // Imperative marketing/sales verbs that indicate CTA, not content
  const imperativeCtaVerbs = [
    "buy", "shop", "get", "view", "find", "go", "try", "learn",
    "watch", "download", "sign", "log", "create", "add", "edit",
    "save", "delete", "discover", "explore", "start", "join",
    "check", "browse", "order", "book", "reserve", "schedule",
    "build", "design", "configure", "customize", "compare",
    "finance", "lease", "apply", "contact", "call", "visit",
    "locate", "search", "enter", "submit", "register",
    "pay", "donate", "invest", "trade",
  ];

  const headings: string[] = [];
  $("h2, h3").each((_i, el) => {
    const text = cleanText($(el).text());
    if (!text || text.length < 15 || text.length > 200) return;

    const lower = text.toLowerCase();

    // Skip if matches noise patterns
    const isNoise = skipHeadingPatterns.some(
      (p) => lower === p || lower.startsWith(p + " ") || lower.includes(p)
    );
    if (isNoise) return;

    // Skip if it's a short CTA (imperative verb + few words)
    const wordCount = lower.split(/\s+/).length;
    const firstWord = lower.split(/\s+/)[0]?.replace(/[.!?,;:]$/, "") ?? "";

    if (wordCount <= 4 && imperativeCtaVerbs.includes(firstWord)) return;

    // Skip marketing/CTA questions and exclamations
    if (wordCount <= 5 && /[?!]$/.test(text.trim())) return;

    // Skip if heading is just a branded slogan (≤3 words, starts with capital)
    if (wordCount <= 3 && /^[A-Z]/.test(text)) {
      const brandWords = [
        "bmw", "mercedes", "audi", "toyota", "honda", "ford",
        "ultimate", "driving", "machine", "sheer", "pleasure",
        "innovation", "sustainability", "excellence", "premium",
        "luxury", "performance", "quality",
      ];
      const hasBrandTerm = brandWords.some((bw) => lower.includes(bw));
      if (hasBrandTerm && !lower.includes("brake") && !lower.includes("pad") &&
          !lower.includes("rotor") && !lower.includes("install")) {
        return;
      }
    }

    headings.push(text);
  });

  // Deduplicate
  const seen = new Set<string>();
  const uniqueHeadings = headings.filter((h) => {
    if (seen.has(h)) return false;
    seen.add(h);
    return true;
  });

  // Main content text for word count and key points
  const mainContent = $(
    "article, main, .post-content, .entry-content, .content, #content, .post-body"
  );

  let bodyText = "";
  if (mainContent.length > 0) {
    bodyText = cleanText(mainContent.text());
  } else {
    bodyText = cleanText($("body").text());
  }

  // Extract key points from meta description and first paragraph
  const metaDesc =
    $('meta[name="description"]').attr("content") ||
    $('meta[property="og:description"]').attr("content") ||
    "";

  const firstP = cleanText(
    $("article p, main p, .post-content p, .entry-content p, p")
      .first()
      .text()
  );

  const keyPoints: string[] = [];
  if (metaDesc) keyPoints.push(metaDesc.substring(0, 200));
  if (firstP && firstP.length > 20)
    keyPoints.push(firstP.substring(0, 200));
  if (result.snippet && !keyPoints.includes(result.snippet))
    keyPoints.push(result.snippet.substring(0, 200));

  return {
    url: result.url,
    domain: result.domain,
    title: cleanText(pageTitle),
    headings: uniqueHeadings,
    keyPoints,
    snippet: result.snippet || metaDesc.substring(0, 200),
    wordCount: bodyText.split(/\s+/).filter(Boolean).length,
  };
}

// ═══════════════════════════════════════════════════════════════
// Step 4: Analyze content gaps
// ═══════════════════════════════════════════════════════════════

function analyzeGaps(competitors: CompetitorContent[]): GapAnalysis {
  // Collect all headings across competitors
  const allHeadings: string[] = [];
  for (const c of competitors) {
    allHeadings.push(...c.headings);
  }

  // Normalize and filter
  const normalizedTopics = allHeadings
    .map((h) => h.toLowerCase().trim())
    .filter((h) => h.length > 10);

  // Count topic frequency
  const topicMap = new Map<string, number>();
  for (const h of normalizedTopics) {
    topicMap.set(h, (topicMap.get(h) ?? 0) + 1);
  }

  // Sort by frequency — convert Map entries to array
  const entries: [string, number][] = [];
  topicMap.forEach((count, topic) => entries.push([topic, count]));
  entries.sort(([, a], [, b]) => b - a);

  const coveredTopics = entries
    .slice(0, 15)
    .map(([topic, count]) =>
      `${topic} (${count} competitor${count > 1 ? "s" : ""})`
    );

  // Identify missing topics (老李's expertise areas not covered)
  const missingTopics: string[] = [];
  for (const expertise of LAOLI_EXPERTISE) {
    const expertiseLower = expertise.toLowerCase();
    const isCovered = normalizedTopics.some((h) => {
      const keywords = expertiseLower
        .split(" ")
        .filter((w) => w.length > 4);
      const matchCount = keywords.filter((kw) => h.includes(kw)).length;
      return matchCount >= keywords.length * 0.5;
    });

    if (!isCovered) {
      missingTopics.push(expertise);
    }
  }

  // Check for common automotive topics
  const commonCarTopics = [
    "compatibility", "fitment", "year range", "model years",
    "installation difficulty", "time required", "tools needed",
    "common problems", "failure symptoms", "maintenance interval",
    "warranty", "lifespan", "break-in procedure",
  ];

  for (const topic of commonCarTopics) {
    if (!normalizedTopics.some((h) => h.includes(topic))) {
      const alreadyInMissing = missingTopics.some((m) =>
        m.toLowerCase().includes(topic)
      );
      if (!alreadyInMissing) {
        missingTopics.push(`No competitor covers: ${topic}`);
      }
    }
  }

  // Suggested topics: combine covered + gaps
  const rawTopics = [
    ...coveredTopics.map((t) => t.replace(/\s*\(\d+ competitor.*\)$/, "")),
    ...missingTopics.map((t) => t.replace(/^No competitor covers: /, "")),
  ];
  const dedup = new Set<string>();
  const suggestedTopics = rawTopics.filter((t) => {
    if (dedup.has(t)) return false;
    dedup.add(t);
    return true;
  });

  return {
    competitors,
    coveredTopics,
    missingTopics,
    suggestedTopics: suggestedTopics.slice(0, 20),
  };
}

// ═══════════════════════════════════════════════════════════════
// Step 5: Generate article outline
// ═══════════════════════════════════════════════════════════════

function generateOutline(
  keyword: string,
  analysis: GapAnalysis
): string[] {
  const outline: string[] = [];

  outline.push(`# ${keyword}: The Complete Guide`);

  outline.push("");
  outline.push("## Introduction");
  outline.push(
    `- Hook: Why ${keyword} matters for your car — performance, safety, and value`
  );
  outline.push("- What this guide covers (and what the competition misses)");
  outline.push("- Quick answer / TL;DR for those in a hurry");

  // Competitor coverage section — only include if headings are substantive
  const competitorSectionTopics = analysis.coveredTopics
    .map((t) => t.replace(/\s*\(\d+ competitor.*\)$/, ""))
    .filter((t) => !t.includes("youtube") && t.length > 20)
    .slice(0, 6);

  // Determine if competitor headings are real content topics (not just nav/marketing)
  const navOrMarketing = [
    "bmw group", "annual", "press release", "financial services",
    "sustainable future", "conference", "meeting", "innovation at",
    "ready to find", "find your", "experience the",
  ];
  const substantiveTopics = competitorSectionTopics.filter((t) => {
    const lower = t.toLowerCase();
    // Must be long enough (5+ words of real content)
    if (lower.split(/\s+/).length < 5) return false;
    // Must not be nav/marketing noise
    if (navOrMarketing.some((n) => lower.includes(n))) return false;
    // Must not be a question or end with a period (marketing copy)
    if (/[?!.]$/.test(t.trim())) return false;
    return true;
  });

  if (substantiveTopics.length >= 2) {
    outline.push("");
    outline.push("## What Most Guides Cover");
    for (const topic of substantiveTopics) {
      const sectionTitle =
        topic.charAt(0).toUpperCase() + topic.slice(1);
      outline.push("");
      outline.push(`### ${sectionTitle}`);
      outline.push(`- What competitors say about ${topic}`);
      outline.push("- What they get right");
      outline.push("- What they miss or get wrong");
    }
  } else if (analysis.competitors.length > 0) {
    // Competitor pages were analyzed but headings were mostly site nav — skip to practical guide
    outline.push("");
    outline.push("## Competitor Landscape");
    outline.push(
      "- Most competing pages are generic overviews that don't cover real-world installation details"
    );
    outline.push(
      "- Major SEO opportunity: no one has written the definitive practical guide for this topic"
    );
    outline.push("- Key pages analyzed (note what they are missing):");
    for (const c of analysis.competitors.slice(0, 5)) {
      outline.push(`  - [${c.title}](${c.url}) — ${c.domain}`);
      if (c.keyPoints.length > 0 && c.keyPoints[0].length > 20) {
        outline.push(`    > ${c.keyPoints[0].substring(0, 150)}`);
      }
    }
  }

  // 老李's unique sections
  const missingTopics = analysis.missingTopics.slice(0, 8);
  if (missingTopics.length > 0) {
    outline.push("");
    outline.push(
      "## What Everyone Else Misses (老李's Insider Knowledge)"
    );
    for (const topic of missingTopics) {
      const cleanTopic = topic
        .replace(/^No competitor covers: /, "")
        .trim();
      const sectionTitle =
        cleanTopic.charAt(0).toUpperCase() + cleanTopic.slice(1);
      outline.push("");
      outline.push(`### ${sectionTitle}`);
      outline.push("- [老李's detailed breakdown here]");
    }
  }

  outline.push("");
  outline.push("## Tools and Parts Checklist");
  outline.push("- Complete parts list with OEM and aftermarket part numbers");
  outline.push("- All tools required (including specialty tools)");
  outline.push("- Torque specs reference table");
  outline.push("- Estimated cost breakdown");

  outline.push("");
  outline.push("## Step-by-Step Installation Guide");
  outline.push("- Preparation steps");
  outline.push("- Removal procedure (with torque specs)");
  outline.push("- Installation procedure (with torque specs)");
  outline.push("- Post-install checks and break-in procedure");
  outline.push("- Common mistakes to avoid at each step");

  outline.push("");
  outline.push("## Real-World Results");
  outline.push("- Before/after measurements or driving impressions");
  outline.push("- Photos or video documentation of the install");
  outline.push("- Long-term update (6 month / 1 year follow-up)");

  outline.push("");
  outline.push("## Cost Comparison");
  outline.push("- DIY cost breakdown (parts + supplies)");
  outline.push("- Independent shop quote comparison");
  outline.push("- Dealership quote comparison");
  outline.push("- Is it worth doing yourself? Honest answer");

  outline.push("");
  outline.push("## FAQ");
  outline.push("- Common questions from forums and comments");
  outline.push("- Compatibility across model years and trim levels");
  outline.push("- Alternative and budget-friendly options");

  return outline;
}

// ═══════════════════════════════════════════════════════════════
// Step 6: Output markdown brief
// ═══════════════════════════════════════════════════════════════

function writeBrief(
  keyword: string,
  analysis: GapAnalysis,
  outline: string[],
  searchEngine: string
): string {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  const slug = slugify(keyword);
  const filepath = join(OUTPUT_DIR, `${slug}.md`);
  const now = new Date().toISOString().split("T")[0];

  let md = "";
  md += `# Content Brief: ${keyword}\n\n`;
  md += `**Date:** ${now}\n`;
  md += `**Keyword:** \`${keyword}\`\n`;
  md += `**Search engine:** ${searchEngine}\n`;
  md += `**Competitors analyzed:** ${analysis.competitors.length}\n\n`;
  md += `---\n\n`;

  // Competitor summary
  md += `## Competitor Pages Analyzed\n\n`;
  for (const c of analysis.competitors) {
    const status = c.error
      ? ` [ERROR: ${c.error}]`
      : ` [${c.wordCount} words]`;
    md += `- **[${c.title}](${c.url})** — ${c.domain}${status}\n`;
    if (c.snippet) {
      md += `  > ${c.snippet.substring(0, 250)}\n`;
    }
    if (c.headings.length > 0) {
      md += `  - Key sections: ${c.headings.slice(0, 5).join(" | ")}\n`;
    }
    md += "\n";
  }

  // Coverage analysis
  md += `## What Top Competitors Cover\n\n`;
  if (analysis.coveredTopics.length > 0) {
    for (const topic of analysis.coveredTopics) {
      md += `- ${topic}\n`;
    }
  } else {
    md += `- _(No competitor headings extracted — generating outline from keyword analysis)_\n`;
  }

  md += `\n## Content Gaps — What They DON'T Cover\n\n`;
  for (const missing of analysis.missingTopics) {
    md += `- ${missing}\n`;
  }

  // Outline
  md += `\n## Suggested Article Outline\n\n`;
  for (const line of outline) {
    md += `${line}\n`;
  }

  // Sources footer
  md += `\n---\n\n`;
  md += `*Research generated by AutOwner Content Pipeline v2*\n`;
  md += `*Date: ${now} | Keyword: ${keyword}*\n`;

  writeFileSync(filepath, md, "utf-8");
  return filepath;
}

// ═══════════════════════════════════════════════════════════════
// Console output helpers
// ═══════════════════════════════════════════════════════════════

function printDivider(char: string = "─", len: number = 60): void {
  console.log(char.repeat(len));
}

function printBanner(): void {
  console.log("");
  console.log("╔══════════════════════════════════════════════════════╗");
  console.log("║   AutOwner Content Pipeline v2                       ║");
  console.log("║   SEO Competitor Research → Better Content            ║");
  console.log("╚══════════════════════════════════════════════════════╝");
  console.log("");
}

// ═══════════════════════════════════════════════════════════════
// Main pipeline
// ═══════════════════════════════════════════════════════════════

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const keyword = args[0];

  if (!keyword || args.includes("--help") || args.includes("-h")) {
    console.log("AutOwner Content Pipeline v2 — SEO Competitor Research");
    console.log("");
    console.log("Usage:");
    console.log(
      '  npx tsx scripts/content-pipeline-v2.ts "best brake pads for BMW 3 series"'
    );
    console.log("");
    console.log(
      "Pipeline: SEO keyword → Search competitors → Analyze gaps → Generate better content → Publish"
    );
    console.log("");
    console.log("Options:");
    console.log("  --help, -h         Show this help");
    console.log("  --no-brief         Skip writing the markdown brief file");
    console.log("  --max N            Max competitor pages to analyze (default: 5)");
    console.log("");
    console.log("Search engines tried (in order, free — no API keys needed):");
    console.log("  1. Bing RSS feed (format=rss, works internationally)");
    console.log("  2. DuckDuckGo HTML search (html.duckduckgo.com — fallback)");
    process.exit(0);
  }

  const skipBrief = args.includes("--no-brief");
  const maxIdx = args.indexOf("--max");
  const maxCompetitors =
    maxIdx !== -1 && args[maxIdx + 1]
      ? parseInt(args[maxIdx + 1], 10)
      : MAX_COMPETITORS;

  printBanner();
  console.log(`Keyword: "${keyword}"`);
  console.log(`Max competitors: ${maxCompetitors}`);
  console.log("");

  // ── Step 1: Search ────────────────────────────────────
  console.log("═══ Step 1: Searching ═══");
  printDivider();

  let searchEngine = "none";
  let allResults: SearchResult[] = [];

  // Try Bing RSS
  try {
    allResults = await searchBingRSS(keyword);
    if (allResults.length > 0) {
      searchEngine = "Bing RSS";
    }
  } catch (err) {
    console.log(
      `  Bing RSS failed: ${err instanceof Error ? err.message : err}`
    );
  }

  // Fallback to DuckDuckGo
  if (allResults.length === 0) {
    try {
      allResults = await searchDuckDuckGoHTML(keyword);
      if (allResults.length > 0) {
        searchEngine = "DuckDuckGo HTML";
      }
    } catch (err) {
      console.log(
        `  DDG HTML failed: ${err instanceof Error ? err.message : err}`
      );
    }
  }

  console.log(`  Search engine used: ${searchEngine}`);
  console.log(`  Found ${allResults.length} total results`);

  // Separate forum/community results from general results
  const forumResults = allResults.filter((r) => isForumDomain(r.domain));
  const autoResults = allResults.filter(
    (r) => !isForumDomain(r.domain) && isAutomotiveDomain(r.domain)
  );
  const generalResults = allResults.filter(
    (r) => !isForumDomain(r.domain) && !isAutomotiveDomain(r.domain)
  );

  console.log(`  Forum sources: ${forumResults.length}`);
  console.log(`  Automotive sources: ${autoResults.length}`);
  console.log(`  General sources: ${generalResults.length}`);

  // Prioritize: forum > automotive > general
  const selectedResults = [
    ...forumResults,
    ...autoResults,
    ...generalResults,
  ].slice(0, maxCompetitors);

  if (selectedResults.length === 0) {
    console.log("");
    console.log(
      "  ⚠ No search results found. Generating outline from keyword analysis only."
    );
  } else {
    console.log(`\n  Selected ${selectedResults.length} competitors:`);
    for (const r of selectedResults) {
      let tag = "[GENERAL]";
      if (isForumDomain(r.domain)) tag = "[FORUM]";
      else if (isAutomotiveDomain(r.domain)) tag = "[AUTO]";
      console.log(`    ${tag} ${r.domain}: ${r.title.substring(0, 60)}`);
    }
  }
  console.log("");

  // ── Step 2: Fetch competitor content ──────────────────
  const competitors: CompetitorContent[] = [];

  if (selectedResults.length > 0) {
    console.log("═══ Step 2: Fetching Competitor Content ═══");
    printDivider();

    for (let i = 0; i < selectedResults.length; i++) {
      const result = selectedResults[i];
      const content = await parseCompetitorPage(result);
      competitors.push(content);

      if (content.error) {
        console.log(`  ✗ ${result.domain}: ${content.error}`);
      } else {
        console.log(
          `  ✓ ${result.domain}: ${content.headings.length} headings, ${content.wordCount} words`
        );
      }

      // Rate limit between fetches
      if (i < selectedResults.length - 1) {
        await sleep(DELAY_MS);
      }
    }
  }

  const successful = competitors.filter((c) => !c.error);
  if (selectedResults.length > 0) {
    console.log(
      `\n  Successfully analyzed: ${successful.length}/${competitors.length}\n`
    );
  }

  // ── Step 3: Analyze gaps ──────────────────────────────
  console.log("═══ Step 3: Content Gap Analysis ═══");
  printDivider();

  const analysis = analyzeGaps(successful);

  if (analysis.coveredTopics.length > 0) {
    console.log("\n📋 Topics competitors cover:");
    printDivider();
    for (const topic of analysis.coveredTopics.slice(0, 10)) {
      console.log(`  • ${topic}`);
    }
  } else {
    console.log("\n📋 No competitor headings extracted.");
    console.log("   Generating gap analysis from keyword + 老李's expertise.");
  }

  console.log("\n🚫 Content GAPS — What competitors DON'T cover:");
  printDivider();
  for (const missing of analysis.missingTopics) {
    console.log(`  • ${missing}`);
  }

  // ── Step 4: Generate outline ──────────────────────────
  console.log("\n═══ Step 4: Suggested Article Outline ═══");
  printDivider();

  const outline = generateOutline(keyword, analysis);

  console.log("");
  for (const line of outline) {
    if (line.startsWith("# ")) {
      console.log(`\n${line}`);
    } else if (line.startsWith("## ")) {
      console.log(`\n  ${line}`);
    } else if (line.startsWith("### ")) {
      console.log(`\n    ${line}`);
    } else if (line.startsWith("- ")) {
      console.log(`      ${line}`);
    }
  }

  // ── Step 5: Write brief ───────────────────────────────
  if (!skipBrief) {
    console.log("\n═══ Step 5: Writing Content Brief ═══");
    printDivider();

    const filepath = writeBrief(keyword, analysis, outline, searchEngine);
    console.log(`  Brief saved: ${filepath}`);
  }

  // ── Summary ───────────────────────────────────────────
  console.log("\n═══ Pipeline Complete ═══");
  printDivider("═");
  console.log(`  Keyword:          ${keyword}`);
  console.log(`  Search engine:    ${searchEngine}`);
  console.log(`  Competitors:      ${successful.length} analyzed`);
  console.log(`  Topics found:     ${analysis.coveredTopics.length}`);
  console.log(`  Gaps identified:  ${analysis.missingTopics.length}`);
  console.log(
    `  Outline sections: ${outline.filter((l) => l.startsWith("##")).length}`
  );
  if (!skipBrief) {
    console.log(`  Brief:            docs/content/briefs/${slugify(keyword)}.md`);
  }
  console.log("");
}

main().catch((err) => {
  console.error(
    "Pipeline failed:",
    err instanceof Error ? err.message : err
  );
  process.exit(1);
});
