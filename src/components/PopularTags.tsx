import { getPopularTags } from "@/lib/data/server";
import Link from "next/link";

export default async function PopularTags() {
  const tags = await getPopularTags(15);

  if (tags.length === 0) {
    return (
      <div className="mt-4 pt-3 border-t border-surface-border">
        <p className="text-xs font-bold uppercase tracking-widest text-text-muted font-heading mb-3 px-2">
          Popular Tags
        </p>
        <p className="text-xs text-text-muted px-2">No tags yet</p>
      </div>
    );
  }

  const maxCount = tags[0].post_count;

  function getTagStyle(count: number) {
    const ratio = count / maxCount;
    if (ratio >= 0.8) return "text-sm font-semibold text-text-primary";
    if (ratio >= 0.5) return "text-sm font-medium text-text-secondary";
    if (ratio >= 0.3) return "text-xs font-medium text-text-secondary";
    return "text-xs text-text-muted";
  }

  return (
    <div className="mt-4 pt-3 border-t border-surface-border">
      <p className="text-xs font-bold uppercase tracking-widest text-text-muted font-heading mb-3 px-2">
        Popular Tags
      </p>
      <div className="flex flex-wrap gap-1.5 px-2">
        {tags.map((tag) => (
          <Link
            key={tag.id}
            href={`/?tag=${tag.slug}`}
            className={`inline-flex items-center px-2.5 py-1 rounded-full transition-all duration-150 font-heading hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 ${getTagStyle(tag.post_count)}`}
            title={`${tag.post_count} post${tag.post_count === 1 ? "" : "s"}`}
          >
            {tag.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
