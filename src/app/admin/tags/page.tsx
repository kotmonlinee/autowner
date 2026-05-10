import { getAllCarTags } from "@/lib/data/server";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import TagActions from "./TagActions";

export default async function AdminTagsPage() {
  const tags = await getAllCarTags();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary font-heading mb-1">Tag Management</h1>
        <p className="text-sm text-text-muted">
          Manage car tags. Tags are created automatically when users add them to posts.
        </p>
      </div>

      {tags.length === 0 ? (
        <div className="bg-surface-1 rounded-xl border border-surface-border p-12 text-center">
          <p className="text-text-secondary font-heading font-semibold">No tags yet</p>
          <p className="text-sm text-text-muted mt-1">Tags will appear here when users add them to posts</p>
        </div>
      ) : (
        <div className="bg-surface-1 rounded-xl border border-surface-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-border bg-surface-2/50">
                <th className="text-left px-4 py-3 text-xs font-bold text-text-muted uppercase tracking-wider font-heading">
                  Tag Name
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold text-text-muted uppercase tracking-wider font-heading">
                  Slug
                </th>
                <th className="text-right px-4 py-3 text-xs font-bold text-text-muted uppercase tracking-wider font-heading">
                  Posts
                </th>
                <th className="text-right px-4 py-3 text-xs font-bold text-text-muted uppercase tracking-wider font-heading">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {tags.map((tag) => (
                <tr key={tag.id} className="hover:bg-surface-2/30 transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-text-primary font-semibold font-heading">{tag.name}</span>
                  </td>
                  <td className="px-4 py-3 text-text-muted font-mono text-xs">
                    {tag.slug}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/tag/${tag.slug}`}
                      className="text-primary hover:text-primary-glow font-bold font-heading tabular-nums transition-colors"
                    >
                      {tag.post_count}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <TagActions tag={tag} allTags={tags} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
