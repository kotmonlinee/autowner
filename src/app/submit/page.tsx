"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchCategories } from "@/lib/data/browser";
import CarTagInput from "@/components/CarTagInput";
import ImageUploader from "@/components/ImageUploader";
import MarkdownBody from "@/components/MarkdownBody";

export default function SubmitPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tags, setTags] = useState<{ name: string; slug: string }[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [previewMode, setPreviewMode] = useState<"write" | "preview">("write");
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

  const handleImageUploaded = (url: string) => {
    setUploadedUrls((prev) => [...prev, url]);
  };

  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Clipboard API may not be available; silently fail
    }
  };

  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const copyUrl = async (url: string, idx: number) => {
    await handleCopyUrl(url);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
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

      <main id="main-content" className="max-w-3xl mx-auto px-5 py-8 w-full">
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
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-text-muted font-heading">
                Body <span className="text-text-muted font-normal normal-case tracking-normal">(Markdown)</span>
              </label>
              {/* Write / Preview tabs */}
              <div className="flex rounded-lg bg-surface-2 border border-surface-border overflow-hidden">
                <button
                  type="button"
                  onClick={() => setPreviewMode("write")}
                  className={`px-3 py-1 text-xs font-semibold font-heading transition-colors ${
                    previewMode === "write"
                      ? "bg-primary text-white"
                      : "text-text-muted hover:text-text-secondary"
                  }`}
                >
                  Write
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode("preview")}
                  className={`px-3 py-1 text-xs font-semibold font-heading transition-colors ${
                    previewMode === "preview"
                      ? "bg-primary text-white"
                      : "text-text-muted hover:text-text-secondary"
                  }`}
                >
                  Preview
                </button>
              </div>
            </div>
            {previewMode === "write" ? (
              <textarea
                value={body} onChange={e => setBody(e.target.value)} required rows={14}
                placeholder="Write your post content here..."
                className="w-full px-4 py-3 bg-surface-2 text-text-primary text-sm rounded-xl border border-surface-border focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-all placeholder:text-text-muted resize-y font-mono"
              />
            ) : (
              <div className="w-full min-h-[14rem] px-4 py-3 bg-surface-2 text-text-primary text-sm rounded-xl border border-surface-border overflow-y-auto">
                {body.trim() ? (
                  <MarkdownBody content={body} />
                ) : (
                  <p className="text-text-muted italic">Nothing to preview yet...</p>
                )}
              </div>
            )}
          </div>

          {/* Image uploader */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5 font-heading">
              Images
              <span className="text-text-muted font-normal normal-case tracking-normal"> (upload then paste URL into body)</span>
            </label>
            <ImageUploader onChange={handleImageUploaded} />
            {uploadedUrls.length > 0 && (
              <div className="mt-2 space-y-1.5">
                <p className="text-xs text-text-muted font-medium">Uploaded images:</p>
                {uploadedUrls.map((url, idx) => (
                  <div key={`${url}-${idx}`} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={url}
                      readOnly
                      className="flex-1 px-3 py-1.5 bg-surface-2 text-text-secondary text-xs rounded-lg border border-surface-border font-mono truncate"
                    />
                    <button
                      type="button"
                      onClick={() => copyUrl(url, idx)}
                      className="shrink-0 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all font-heading border border-surface-border text-text-secondary hover:text-text-primary hover:border-surface-4"
                    >
                      {copiedIdx === idx ? "Copied!" : "Copy"}
                    </button>
                  </div>
                ))}
              </div>
            )}
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
      </main>
    </div>
  );
}
