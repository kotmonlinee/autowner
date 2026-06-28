import type { Metadata } from "next";
import { getPostBySlug, getPostByIdAny, getCurrentUser, getCategories, editOwnPost } from "@/lib/data/server";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isUUID(str: string): boolean {
  return UUID_RE.test(str);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  let post = await getPostBySlug(slug);
  if (!post && isUUID(slug)) post = await getPostByIdAny(slug);
  if (!post) return { title: "Post Not Found" };
  return { title: `Edit ${post.title}` };
}

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let post = await getPostBySlug(slug);
  if (!post && isUUID(slug)) post = await getPostByIdAny(slug);

  if (!post) notFound();
  const id = post.id;

  const [user, categories] = await Promise.all([
    getCurrentUser(),
    getCategories(),
  ]);

  if (!user) redirect("/auth/login");
  if (post.author_id !== user.id) redirect(`/post/${post.slug || id}`);
  if (post.status === "deleted") redirect(`/post/${post.slug || id}`);

  const postSlug = post.slug || id;
  const userId = user.id;

  async function savePost(formData: FormData) {
    "use server";
    const title = (formData.get("title") as string)?.trim();
    const body = (formData.get("body") as string)?.trim();
    const categoryId = (formData.get("category_id") as string) || null;

    if (!title || !body) return;

    await editOwnPost(id, userId, {
      title,
      body,
      category_id: categoryId,
    });

    // Revalidate old and new slug paths
    revalidatePath(`/post/${postSlug}/edit`);
    revalidatePath(`/post/${postSlug}`);
    revalidatePath("/");
    // After editing, the slug may have changed (if title changed).
    // Fetch the updated post to get the new slug for the redirect.
    const { createServerSupabase } = await import("@/lib/supabase-server");
    const supabase = await createServerSupabase();
    const { data: updated } = await supabase
      .from("posts")
      .select("slug")
      .eq("id", id)
      .single();
    redirect(`/post/${updated?.slug || id}`);
  }

  return (
    <div className="min-h-screen bg-surface-0 relative flex flex-col">
      <Navbar />
      <main id="main-content" className="max-w-4xl mx-auto px-5 py-6 flex-1 w-full">
        {/* Breadcrumb */}
        <nav className="mb-5 flex items-center gap-2 text-sm text-text-muted font-heading" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <svg className="w-3 h-3 text-surface-border" fill="none" stroke="currentColor" viewBox="0 0 24 24" width={12} height={12}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link href={`/post/${postSlug}`} className="hover:text-primary transition-colors truncate max-w-[200px]">
            {post.title}
          </Link>
          <svg className="w-3 h-3 text-surface-border" fill="none" stroke="currentColor" viewBox="0 0 24 24" width={12} height={12}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-text-secondary">Edit</span>
        </nav>

        <div className="bg-surface-1 rounded-xl border border-surface-border p-6">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-text-primary font-heading">Edit Post</h1>
            <p className="text-sm text-text-muted mt-0.5">
              Editing your post. Changes will be visible immediately.
            </p>
          </div>

          <form action={savePost}>
            {/* Title */}
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-sm font-bold text-text-secondary font-heading mb-1.5"
              >
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
              <label
                htmlFor="body"
                className="block text-sm font-bold text-text-secondary font-heading mb-1.5"
              >
                Body (Markdown supported)
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

            {/* Category */}
            <div className="mb-6">
              <label
                htmlFor="category_id"
                className="block text-sm font-bold text-text-secondary font-heading mb-1.5"
              >
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
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-surface-border">
              <button
                type="submit"
                className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-glow hover:-translate-y-px transition-all duration-150 font-heading shadow-sm shadow-primary/20"
              >
                Save Changes
              </button>
              <Link
                href={`/post/${postSlug}`}
                className="px-4 py-2 text-sm font-bold text-text-muted hover:text-text-secondary transition-colors font-heading"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
