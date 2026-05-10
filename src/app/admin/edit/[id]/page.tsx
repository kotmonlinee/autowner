import { getPostByIdAdmin, updatePost, getCategories, getCurrentUser } from "@/lib/data/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import DeleteButton from "./DeleteButton";

export default async function AdminEditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");

  const { id } = await params;
  const [post, categories] = await Promise.all([getPostByIdAdmin(id), getCategories()]);

  if (!post) {
    return (
      <div>
        <div className="bg-surface-1 rounded-xl border border-surface-border p-12 text-center">
          <h1 className="text-2xl font-bold text-text-primary font-heading mb-2">Post not found</h1>
          <p className="text-text-muted mb-4">No post exists with ID: {id}</p>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-glow transition-colors font-heading"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l-7 7 7 7" />
            </svg>
            Back to Admin
          </Link>
        </div>
      </div>
    );
  }

  const statuses: { value: string; label: string; color: string }[] = [
    { value: "approved", label: "Approved", color: "text-emerald-400" },
    { value: "pending", label: "Pending", color: "text-amber-400" },
    { value: "rejected", label: "Rejected", color: "text-red-400" },
    { value: "deleted", label: "Deleted", color: "text-slate-400" },
  ];

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="mb-5 flex items-center gap-2 text-sm text-text-muted font-heading">
        <Link href="/admin" className="hover:text-primary transition-colors">Admin</Link>
        <svg className="w-3 h-3 text-surface-border" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-text-secondary">Edit Post</span>
      </nav>

      <div className="bg-surface-1 rounded-xl border border-surface-border p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-text-primary font-heading">Edit Post</h1>
            <p className="text-sm text-text-muted mt-0.5">
              {post.source === "scraped" && (
                <span className="px-1.5 py-0.5 bg-amber-400/10 text-amber-400 rounded text-[10px] font-bold uppercase border border-amber-400/20 mr-2">
                  {post.source}
                </span>
              )}
              ID: {post.id.slice(0, 8)}... · Created {new Date(post.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/post/${post.id}`}
              target="_blank"
              className="px-4 py-2 bg-surface-3 text-text-secondary rounded-lg text-sm font-bold hover:bg-surface-4 hover:text-text-primary transition-colors font-heading border border-surface-border"
            >
              View Post &rarr;
            </Link>
            <DeleteButton postId={post.id} />
          </div>
        </div>

        <form action={async (formData: FormData) => {
          "use server";
          const quickAnswerRaw = (formData.get("quick_answer") as string)?.trim();
          let quickAnswer = null;
          if (quickAnswerRaw) {
            try {
              quickAnswer = JSON.parse(quickAnswerRaw);
            } catch {
              // If JSON is invalid, silently ignore — the admin can fix it next edit.
            }
          }
          const updated: Record<string, unknown> = {
            title: formData.get("title") as string,
            body: formData.get("body") as string,
            category_id: formData.get("category_id") as string,
            status: formData.get("status") as string,
            quick_answer: quickAnswer,
          };
          await updatePost(id, updated);
          revalidatePath(`/admin/edit/${id}`);
          revalidatePath("/admin");
          revalidatePath(`/post/${id}`);
          revalidatePath("/");
          redirect("/admin");
        }}>
          {/* Title */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-bold text-text-secondary font-heading mb-1.5">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              defaultValue={post.title}
              required
              className="w-full px-3 py-2 bg-surface-2 border border-surface-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors placeholder:text-text-muted"
            />
          </div>

          {/* Body */}
          <div className="mb-4">
            <label htmlFor="body" className="block text-sm font-bold text-text-secondary font-heading mb-1.5">
              Body
            </label>
            <textarea
              id="body"
              name="body"
              defaultValue={post.body}
              required
              rows={20}
              className="w-full px-3 py-2 bg-surface-2 border border-surface-border rounded-lg text-text-primary text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors placeholder:text-text-muted resize-y"
            />
          </div>

          {/* Quick Answer (JSON) — collapsible */}
          <details className="mb-4 bg-surface-2 rounded-xl border border-surface-border overflow-hidden">
            <summary className="px-4 py-3 cursor-pointer hover:bg-surface-3 transition-colors select-none">
              <span className="text-sm font-bold text-text-secondary font-heading">
                Quick Answer (JSON)
              </span>
              <span className="ml-2 text-xs text-text-muted font-normal">
                — structured diagnosis box for guide posts
              </span>
            </summary>
            <div className="px-4 pb-4">
              <p className="text-xs text-text-muted mb-2">
                Paste JSON for the Quick Diagnosis card. Leave empty to remove. Example:
              </p>
              <pre className="text-[11px] text-text-muted bg-surface-0 rounded-lg p-2 mb-2 overflow-x-auto border border-surface-border">
{`{
  "most_likely_cause": "Loose gas cap",
  "probability": "60%",
  "cost_min": 0,
  "cost_max": 0,
  "first_step": "Tighten gas cap until it clicks",
  "next_steps": ["Check purge valve", "Scan for codes"]
}`}
              </pre>
              <textarea
                id="quick_answer"
                name="quick_answer"
                defaultValue={post.quick_answer ? JSON.stringify(post.quick_answer, null, 2) : ""}
                rows={10}
                placeholder='{"most_likely_cause": "..."}'
                className="w-full px-3 py-2 bg-surface-0 border border-surface-border rounded-lg text-text-primary text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors placeholder:text-text-muted resize-y"
              />
            </div>
          </details>

          {/* Category + Status row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            {/* Category select */}
            <div>
              <label htmlFor="category_id" className="block text-sm font-bold text-text-secondary font-heading mb-1.5">
                Category
              </label>
              <select
                id="category_id"
                name="category_id"
                defaultValue={post.category_id ?? ""}
                className="w-full px-3 py-2 bg-surface-2 border border-surface-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              >
                <option value="">No category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Status radio group */}
            <div>
              <label className="block text-sm font-bold text-text-secondary font-heading mb-1.5">
                Status
              </label>
              <div className="flex items-center gap-3 pt-2">
                {statuses.map((s) => (
                  <label key={s.value} className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value={s.value}
                      defaultChecked={post.status === s.value}
                      className="w-3.5 h-3.5 accent-primary"
                    />
                    <span className={`text-sm font-bold font-heading ${s.color}`}>{s.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Source (read-only) */}
            <div>
              <label className="block text-sm font-bold text-text-secondary font-heading mb-1.5">
                Source
              </label>
              <div className="pt-2">
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase font-heading ${
                  post.source === "scraped"
                    ? "bg-amber-400/10 text-amber-400 border border-amber-400/20"
                    : "bg-primary/10 text-primary border border-primary/20"
                }`}>
                  {post.source}
                </span>
              </div>
            </div>
          </div>

          {/* Save button */}
          <div className="flex items-center gap-3 pt-4 border-t border-surface-border">
            <button
              type="submit"
              className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-glow hover:-translate-y-px transition-all duration-150 font-heading shadow-sm shadow-primary/20"
            >
              Save Changes
            </button>
            <Link
              href="/admin"
              className="px-4 py-2 text-sm font-bold text-text-muted hover:text-text-secondary transition-colors font-heading"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
