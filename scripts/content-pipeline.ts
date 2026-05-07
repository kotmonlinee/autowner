// Content pipeline — logs content stats, identifies gaps, and runs scraping
// Run: npx tsx scripts/content-pipeline.ts
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

// ── Parse .env.local ──────────────────────────────────────

function loadEnv(): Record<string, string> {
  const content = readFileSync(".env.local", "utf-8");
  return Object.fromEntries(
    content
      .split("\n")
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => line.split("=").map((s) => s.trim()))
  );
}

const env = loadEnv();

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL!,
  env.SUPABASE_SERVICE_ROLE_KEY!
);

// ── Types ─────────────────────────────────────────────────

interface ContentStats {
  totalPosts: number;
  approvedPosts: number;
  pendingPosts: number;
  guideCount: number;
  scrapedCount: number;
  userCount: number;
  postsByCategory: { category: string; total: number; guides: number }[];
  postsByContentType: Record<string, number>;
  postsBySource: { user: number; scraped: number };
}

interface ContentGap {
  category: string;
  guideCount: number;
  totalPosts: number;
}

interface PipelineReport {
  stats: ContentStats;
  gaps: ContentGap[];
}

// ── Content Stats ─────────────────────────────────────────

async function getContentStats(): Promise<ContentStats> {
  // Total and status counts
  const { count: totalPosts } = await supabase
    .from("posts")
    .select("id", { count: "exact", head: true });

  const { count: approvedPosts } = await supabase
    .from("posts")
    .select("id", { count: "exact", head: true })
    .eq("status", "approved");

  const { count: pendingPosts } = await supabase
    .from("posts")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending");

  // Guide count (content_type = "guide")
  const { count: guideCount } = await supabase
    .from("posts")
    .select("id", { count: "exact", head: true })
    .eq("content_type", "guide");

  // Scraped count
  const { count: scrapedCount } = await supabase
    .from("posts")
    .select("id", { count: "exact", head: true })
    .eq("source", "scraped");

  // User count
  const { count: userCount } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true });

  // Posts by source
  const { count: userPostCount } = await supabase
    .from("posts")
    .select("id", { count: "exact", head: true })
    .eq("source", "user");

  // Posts by content_type
  const { data: contentTypeData } = await supabase
    .from("posts")
    .select("content_type");

  const postsByContentType: Record<string, number> = {};
  for (const row of contentTypeData ?? []) {
    const type = row.content_type ?? "unclassified";
    postsByContentType[type] = (postsByContentType[type] ?? 0) + 1;
  }

  // Posts by category
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("sort_order");

  const postsByCategory: { category: string; total: number; guides: number }[] = [];

  for (const cat of categories ?? []) {
    const [{ count: total }, { count: guides }] = await Promise.all([
      supabase
        .from("posts")
        .select("id", { count: "exact", head: true })
        .eq("category_id", cat.id),
      supabase
        .from("posts")
        .select("id", { count: "exact", head: true })
        .eq("category_id", cat.id)
        .eq("content_type", "guide"),
    ]);

    postsByCategory.push({
      category: cat.name,
      total: total ?? 0,
      guides: guides ?? 0,
    });
  }

  return {
    totalPosts: totalPosts ?? 0,
    approvedPosts: approvedPosts ?? 0,
    pendingPosts: pendingPosts ?? 0,
    guideCount: guideCount ?? 0,
    scrapedCount: scrapedCount ?? 0,
    userCount: userCount ?? 0,
    postsByCategory,
    postsByContentType,
    postsBySource: {
      user: userPostCount ?? 0,
      scraped: scrapedCount ?? 0,
    },
  };
}

// ── Content Gaps ──────────────────────────────────────────

function identifyContentGaps(stats: ContentStats): ContentGap[] {
  return stats.postsByCategory
    .filter((cat) => cat.guides < 2)
    .map((cat) => ({
      category: cat.category,
      guideCount: cat.guides,
      totalPosts: cat.total,
    }));
}

// ── Report Output ─────────────────────────────────────────

function printReport(report: PipelineReport): void {
  const { stats, gaps } = report;

  console.log("═══════════════════════════════════════════");
  console.log("  AutOwner Content Pipeline Report");
  console.log("═══════════════════════════════════════════\n");

  console.log("── Overview ──");
  console.log(`  Total posts:     ${stats.totalPosts}`);
  console.log(`  Approved:        ${stats.approvedPosts}`);
  console.log(`  Pending review:  ${stats.pendingPosts}`);
  console.log(`  Guides:          ${stats.guideCount}`);
  console.log(`  Users:           ${stats.userCount}\n`);

  console.log("── Posts by Source ──");
  console.log(`  User-submitted:  ${stats.postsBySource.user}`);
  console.log(`  Scraped:         ${stats.postsBySource.scraped}\n`);

  console.log("── Posts by Category ──");
  for (const cat of stats.postsByCategory) {
    const bar = "█".repeat(Math.min(cat.total, 40));
    console.log(`  ${cat.category.padEnd(20)} ${String(cat.total).padStart(3)} ${bar}`);
  }
  console.log("");

  console.log("── Posts by Content Type ──");
  for (const [type, count] of Object.entries(stats.postsByContentType).sort(
    ([, a], [, b]) => b - a
  )) {
    console.log(`  ${type.padEnd(20)} ${count}`);
  }
  console.log("");

  console.log("── Content Gaps (< 2 guides) ──");
  if (gaps.length === 0) {
    console.log("  No gaps found. All categories have >= 2 guide posts.");
  } else {
    for (const gap of gaps) {
      console.log(
        `  ${gap.category.padEnd(20)} ${String(gap.guideCount).padStart(2)} guides (${gap.totalPosts} total posts)`
      );
    }
  }
  console.log("");
}

// ── Main ──────────────────────────────────────────────────

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const showHelp = args.includes("--help") || args.includes("-h");

  if (showHelp) {
    console.log("AutOwner Content Pipeline");
    console.log("");
    console.log("Usage:");
    console.log("  npx tsx scripts/content-pipeline.ts          Show content stats report");
    console.log("  npx tsx scripts/content-pipeline.ts --help   Show this help");
    console.log("");
    console.log("Options:");
    console.log("  --help, -h    Show help");
    return;
  }

  console.log("Fetching content stats...\n");

  try {
    const stats = await getContentStats();
    const gaps = identifyContentGaps(stats);
    printReport({ stats, gaps });
  } catch (err) {
    console.error("Error:", err instanceof Error ? err.message : err);
    process.exit(1);
  }
}

main();
