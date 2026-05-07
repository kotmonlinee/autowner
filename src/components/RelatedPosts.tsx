import { getRelatedPosts, getRandomRelatedPosts } from "@/lib/data/server";
import Link from "next/link";

export default async function RelatedPosts({
  categoryId,
  excludeId,
  title = "Related Posts",
  random = false,
}: {
  categoryId: string | null;
  excludeId: string;
  title?: string;
  random?: boolean;
}) {
  if (!categoryId) return null;
  const posts = random
    ? await getRandomRelatedPosts(categoryId, excludeId)
    : await getRelatedPosts(categoryId, excludeId);
  if (!posts.length) return null;

  return (
    <div className="bg-surface-1 rounded-xl border border-surface-border p-5">
      <h4 className="text-xs font-bold uppercase tracking-widest text-text-muted font-heading mb-4">{title}</h4>
      <div className="space-y-3">
        {posts.map((post: any, i: number) => (
          <Link key={post.id} href={`/post/${post.id}`} className="block group">
            <div className="flex items-start gap-2.5">
              <span className="text-[10px] font-bold text-text-muted mt-0.5 font-heading tabular-nums">
                {(i + 1).toString().padStart(2, "0")}
              </span>
              <div>
                <p className="text-sm text-text-secondary group-hover:text-primary transition-colors line-clamp-2 font-medium leading-snug">{post.title}</p>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-text-muted">
                  <span>{post.vote_score} pts</span><span>·</span><span>{post.comment_count} replies</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
