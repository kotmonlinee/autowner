"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchCategories } from "@/lib/data/browser";
import CarTagInput from "@/components/CarTagInput";

export default function SubmitPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tags, setTags] = useState<{ name: string; slug: string }[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body, categoryId, tags }),
    });
    if (res.ok) {
      const { id } = await res.json();
      router.push(`/post/${id}`);
    } else {
      const { error: err } = await res.json();
      setError(err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-0 relative">
      <nav className="sticky top-0 z-50 bg-surface-0/80 backdrop-blur-xl border-b border-surface-border h-16 flex items-center px-5">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="w-8 h-8 rounded-md bg-primary flex items-center justify-center group-hover:bg-primary-glow transition-colors">
            <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
          <span className="font-display text-lg text-text-primary tracking-wide">
            AUTO<span className="text-primary">WNER</span>
          </span>
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-5 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text-primary font-heading">Create a Post</h1>
          <p className="text-sm text-text-muted mt-1">Share your knowledge with the community</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5 font-heading">Category</label>
            <select
              value={categoryId} onChange={e => setCategoryId(e.target.value)} required
              className="w-full px-4 py-2.5 bg-surface-2 text-text-primary text-sm rounded-xl border border-surface-border focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-all appearance-none"
            >
              <option value="">Select a category...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5 font-heading">Title</label>
            <input
              type="text" value={title} onChange={e => setTitle(e.target.value)} required
              placeholder="What's your question or tip?"
              className="w-full px-4 py-2.5 bg-surface-2 text-text-primary text-sm rounded-xl border border-surface-border focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-all placeholder:text-text-muted"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5 font-heading">Body <span className="text-text-muted font-normal normal-case tracking-normal">(Markdown)</span></label>
            <textarea
              value={body} onChange={e => setBody(e.target.value)} required rows={14}
              placeholder="Write your post content here..."
              className="w-full px-4 py-3 bg-surface-2 text-text-primary text-sm rounded-xl border border-surface-border focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-all placeholder:text-text-muted resize-y font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5 font-heading">Car Models</label>
            <CarTagInput selected={tags} onChange={setTags} />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit" disabled={loading}
              className="px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-glow hover:-translate-y-px transition-all duration-150 disabled:opacity-50 disabled:hover:translate-y-0 font-heading shadow-sm shadow-primary/20"
            >
              {loading ? "Posting..." : "Publish Post"}
            </button>
            <Link href="/" className="px-6 py-2.5 bg-surface-2 text-text-secondary text-sm font-medium rounded-xl hover:bg-surface-3 transition-colors font-heading border border-surface-border">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
