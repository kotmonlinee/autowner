import type { Metadata } from "next";
import { getPostBySlug, getPostByIdAny, getCurrentUser, getPostVehicles } from "@/lib/data/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Avatar from "@/components/Avatar";
import BookmarkButton from "@/components/BookmarkButton";
import VoteButtons from "@/components/VoteButtons";
import CommentSection from "@/components/CommentSection";
import RelatedPosts from "@/components/RelatedPosts";
import ToolCTAs from "@/components/ToolCTAs";
import DiscussionPrompt from "@/components/DiscussionPrompt";
import SimilarOwners from "@/components/SimilarOwners";
import ShareButtons from "@/components/ShareButtons";
import MarkdownBody from "@/components/MarkdownBody";
import QuickAnswerCard from "@/components/QuickAnswerCard";
import ViewTracker from "@/components/ViewTracker";
import PostEditDeleteButtons from "./PostEditDeleteButtons";
import ReportButton from "@/components/ReportButton";
import ArticleTOC from "@/components/ArticleTOC";
import ProductCard from "@/components/ProductCard";
import AuthorBio from "@/components/AuthorBio";
import ReadingProgress from "@/components/ReadingProgress";
import { FollowVehicleButton } from "@/app/vehicle/[engineId]/FollowVehicleButton";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { timeAgo } from "@/lib/utils";

// ── UUID detection ─────────────────────────────────────────
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isUUID(str: string): boolean {
  return UUID_RE.test(str);
}

// ── Structured Data helpers ───────────────────────────────

function plainDescription(body: string, maxLen = 160): string {
  return body
    .replace(/[#*`\[\]()>!\[\]]/g, "")
    .replace(/\s+/g, " ")
    .slice(0, maxLen)
    .trim();
}

function isQuestionHeading(heading: string): boolean {
  return /^(how|what|why|when|can|is|does|should|best|which)\b/i.test(heading.trim());
}

function extractFaqItems(
  body: string,
): { question: string; answer: string }[] {
  const lines = body.split("\n");
  const items: { question: string; answer: string }[] = [];
  const headingRegex = /^(#{1,4})\s+(.+)$/;

  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(headingRegex);
    if (!match) continue;

    const headingText = match[2].trim();
    if (!isQuestionHeading(headingText)) continue;

    // Capture all non-empty lines until the next heading
    const answerLines: string[] = [];
    for (let j = i + 1; j < lines.length; j++) {
      if (headingRegex.test(lines[j])) break;
      const trimmed = lines[j].trim();
      if (trimmed) answerLines.push(trimmed);
    }

    const answer = answerLines
      .join(" ")
      .replace(/[#*`\[\]()>!\[\]]/g, "")
      .replace(/\s+/g, " ")
      .slice(0, 300)
      .trim();

    if (answer) {
      items.push({ question: headingText, answer });
    }
  }

  return items.slice(0, 10); // Google recommends up to 10 FAQ items
}

function readingTime(body: string): string {
  const words = body.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${Math.max(1, minutes)} min read`;
}

function formatCount(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  // Try slug lookup first
  let post = await getPostBySlug(slug);

  // If not found and looks like a UUID, try ID lookup
  if (!post && isUUID(slug)) {
    post = await getPostByIdAny(slug);
  }

  if (!post) return { title: "Post Not Found — AutOwner" };
  const description = post.body.replace(/[#*`\[\]()>!\[\]]/g, "").slice(0, 160);
  const canonicalSlug = post.slug || post.id;
  return {
    title: `${post.title} — AutOwner`,
    description,
    alternates: {
      canonical: `https://www.autowner.com/post/${canonicalSlug}`,
    },
    openGraph: {
      title: post.title,
      description,
      type: "article",
      url: `https://www.autowner.com/post/${canonicalSlug}`,
      images: [
        {
          url: "https://www.autowner.com/og-default.jpg",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Try slug-based lookup first (for new SEO-friendly URLs)
  let post = await getPostBySlug(slug);

  // If not found and the parameter looks like a UUID, try ID-based lookup
  // (backward compatibility for old /post/[uuid] URLs)
  if (!post && isUUID(slug)) {
    post = await getPostByIdAny(slug);
    // If found by UUID, 301 redirect to the slug-based URL
    if (post && post.slug) {
      permanentRedirect(`/post/${post.slug}`);
    }
  }

  if (!post) notFound();

  const id = post.id;
  const [user, postVehicles] = await Promise.all([
    getCurrentUser(),
    getPostVehicles(id),
  ]);

  const isAuthor = user && post.author_id === user.id;
  const isDeleted = post.status === "deleted";

  // ── Compute structured data ──────────────────────────────
  const desc = plainDescription(post.body);
  const articleUrl = `https://www.autowner.com/post/${post.slug || id}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    datePublished: new Date(post.created_at).toISOString(),
    dateModified: new Date(post.updated_at).toISOString(),
    author: {
      "@type": "Person",
      name: post.profiles?.username ?? "AutOwner",
    },
    description: desc,
    publisher: {
      "@type": "Organization",
      name: "AutOwner",
    },
    url: articleUrl,
  };

  // BreadcrumbList: Home > [Category] > [Post Title]
  const breadcrumbItemList: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item?: string;
  }> = [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.autowner.com" },
  ];
  if (post.categories) {
    breadcrumbItemList.push({
      "@type": "ListItem",
      position: 2,
      name: post.categories.name,
      item: `https://www.autowner.com/?category=${post.categories.slug}`,
    });
  }
  breadcrumbItemList.push({
    "@type": "ListItem",
    position: post.categories ? 3 : 2,
    name: post.title,
  });

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItemList,
  };

  // FAQPage for guide posts whose body contains question headings
  const isGuide = post.content_type === "guide";
  const faqItems = isGuide ? extractFaqItems(post.body) : [];
  const faqJsonLd =
    faqItems.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }
      : null;

  const isLaoliExpert =
    post.content_type === "guide" && post.source === "user";

  return (
    <div className="min-h-screen bg-surface-0 relative flex flex-col">
      <ReadingProgress />
      <Navbar />
      <main id="main-content" className="max-w-3xl mx-auto px-5 py-6 flex-1 w-full">
        <div className="flex gap-8">
          <article className="flex-1 min-w-0">
            {/* JSON-LD Structured Data */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
            />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            {faqJsonLd && (
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
              />
            )}

            {/* Breadcrumb */}
            <nav className="mb-4 flex items-center gap-2 text-sm text-text-muted font-heading" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <svg className="w-3 h-3 text-surface-border" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              {post.categories && (
                <>
                  <Link href={`/?category=${post.categories.slug}`} className="hover:text-primary transition-colors">{post.categories.name}</Link>
                  <svg className="w-3 h-3 text-surface-border" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </>
              )}
              <span className="text-text-secondary truncate">{post.title}</span>
            </nav>

            <div className="bg-surface-1 rounded-xl border border-surface-border p-6">
              {isDeleted ? (
                /* Deleted post state */
                <div className="py-12 text-center">
                  <svg className="w-12 h-12 mx-auto mb-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <h1 className="text-xl font-bold text-text-secondary font-heading mb-2">This post has been deleted</h1>
                  <p className="text-text-muted text-sm">The author has removed this content.</p>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-surface-3 text-text-secondary text-sm font-bold rounded-lg hover:bg-surface-4 transition-colors font-heading"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l-7 7 7 7" />
                    </svg>
                    Back to Home
                  </Link>
                </div>
              ) : (
                /* Normal post view */
                <>
                  <div className="flex items-center gap-2 mb-3">
                    {post.categories && (
                      <Link href={`/?category=${post.categories.slug}`} className="inline-flex items-center gap-1 px-2.5 py-1 bg-surface-3 text-text-secondary rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-surface-4 hover:text-primary transition-colors font-heading">
                        <span className="w-1 h-1 rounded-full bg-primary" />
                        {post.categories.name}
                      </Link>
                    )}
                    {post.source === "scraped" && (
                      <span className="px-2 py-1 bg-amber-700/10 dark:bg-amber-400/10 text-amber-700 dark:text-amber-400 rounded text-[10px] font-bold font-heading tracking-wide border border-amber-700/20 dark:border-amber-400/20">AUTO</span>
                    )}
                  </div>

                  <h1 className="text-2xl font-bold text-text-primary mb-4 font-heading leading-tight">{post.title}</h1>

                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-surface-border">
                    <Avatar
                      username={post.profiles?.username}
                      avatarUrl={post.profiles?.avatar_url}
                      size="md"
                    />
                    <div>
                      {post.profiles?.username ? (
                        <Link href={`/user/${post.profiles.username}`} className="text-sm font-semibold text-text-secondary font-heading hover:text-primary transition-colors">
                          {post.profiles.username}
                        </Link>
                      ) : (
                        <p className="text-sm font-semibold text-text-secondary font-heading">unknown</p>
                      )}
                      <p className="text-xs text-text-muted">
                        {timeAgo(post.created_at)}
                        {" · "}
                        {formatCount(post.view_count ?? 0)} views
                        {" · "}
                        {post.comment_count} {post.comment_count === 1 ? "reply" : "replies"}
                        {(post.content_type === "guide" || post.content_type === "review") && (
                          <> · {readingTime(post.body)}</>
                        )}
                      </p>
                    </div>
                    <div className="ml-auto flex items-center gap-1">
                      {isAuthor && <PostEditDeleteButtons postId={id} postSlug={post.slug || id} />}
                      {user && !isAuthor && <ReportButton targetType="post" targetId={id} userId={user.id} />}
                      <BookmarkButton postId={id} userId={user?.id} />
                    </div>
                  </div>

                  {isGuide && post.quick_answer && (
                    <QuickAnswerCard quick_answer={post.quick_answer} />
                  )}

                  <ArticleTOC body={post.body} />

                  <div className="flex gap-5">
                    <VoteButtons targetType="post" targetId={id} initialScore={post.vote_score} userId={user?.id} />
                    <MarkdownBody content={post.body} />
                  </div>

                  {post.post_tags && post.post_tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-6 pt-4 border-t border-surface-border">
                      {post.post_tags.map(pt => (
                        <Link key={pt.car_tags.slug} href={`/?tag=${pt.car_tags.slug}`} className="px-2.5 py-1 bg-surface-3 text-text-muted rounded-lg text-xs font-medium hover:bg-surface-4 hover:text-text-secondary transition-colors">{pt.car_tags.name}</Link>
                      ))}
                    </div>
                  )}

                  {/* Linked vehicles */}
                  {postVehicles && postVehicles.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-surface-border space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted font-heading">
                        Vehicle:
                      </span>
                      <div className="flex flex-wrap items-center gap-2">
                        {postVehicles.map((pv) => {
                          const eng = pv.vehicle_engines as Record<string, unknown> | null;
                          const gen = eng?.vehicle_generations as Record<string, unknown> | null;
                          const model = gen?.vehicle_models as Record<string, unknown> | null;
                          const make = model?.vehicle_makes as Record<string, unknown> | null;
                          return (
                            <div key={pv.engine_id} className="flex items-center gap-1.5">
                              <Link
                                href={`/vehicle/${pv.engine_id}`}
                                className="px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs font-medium hover:bg-primary/20 transition-colors"
                              >
                                {String(make?.name ?? "")} {String(model?.name ?? "")} ({String(gen?.name ?? "")}) &mdash; {String(eng?.code ?? "")}
                              </Link>
                              <FollowVehicleButton
                                engineId={pv.engine_id}
                                userId={user?.id ?? null}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Author Bio */}
                  <AuthorBio
                    username={post.profiles?.username}
                    avatarUrl={post.profiles?.avatar_url}
                    isExpert={isLaoliExpert}
                  />
                </>
              )}
            </div>

            {/* Recommended Products */}
            {!isDeleted && post.products && post.products.length > 0 && (
              <section className="mt-4 bg-surface-1 rounded-xl border border-surface-border p-5">
                <div className="flex items-center gap-2.5 mb-4">
                  <svg
                    className="w-4 h-4 text-amber dark:text-amber-dark shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 01-8 0" />
                  </svg>
                  <h3 className="text-sm font-bold text-text-primary font-heading uppercase tracking-wider">
                    Recommended Products
                  </h3>
                  <span className="text-[10px] text-text-muted ml-auto font-heading">
                    We may earn a commission from purchases
                  </span>
                </div>
                <div className="space-y-3">
                  {post.products.map((product, i) => (
                    <ProductCard
                      key={i}
                      name={product.name}
                      description={product.description}
                      price={product.price}
                      rating={product.rating}
                      link={product.link}
                      imageUrl={product.imageUrl}
                    />
                  ))}
                </div>
              </section>
            )}

            {!isDeleted && (
              <>
                <ViewTracker postId={id} title={post.title} />
                <ShareButtons title={post.title} url={articleUrl} />

                <div className="bg-surface-1 rounded-xl border border-surface-border p-6 mt-4">
                  <CommentSection postId={id} userId={user?.id} />
                </div>

                <div className="mt-4">
                  <DiscussionPrompt commentCount={post.comment_count ?? 0} />
                </div>
              </>
            )}

            <div className="mt-4">
              <RelatedPosts categoryId={post.category_id} excludeId={id} title="You Might Also Like" random />
            </div>
          </article>

          <aside className="w-72 shrink-0 hidden lg:block">
            <div className="sticky top-20 space-y-4">
              <ToolCTAs />
              <RelatedPosts categoryId={post.category_id} excludeId={id} />
              {postVehicles.length > 0 && (
                <SimilarOwners engineId={postVehicles[0].engine_id} />
              )}
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
