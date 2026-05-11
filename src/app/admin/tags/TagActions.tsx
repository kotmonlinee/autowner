"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

interface TagInfo {
  id: string;
  name: string;
  slug: string;
  post_count: number;
}

export default function TagActions({
  tag,
  allTags,
}: {
  tag: TagInfo;
  allTags: TagInfo[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(tag.name);
  const [mergeOpen, setMergeOpen] = useState(false);
  const [mergeTarget, setMergeTarget] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  async function handleRename() {
    if (!editName.trim() || editName.trim() === tag.name || loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/tags/${tag.id}/rename`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName.trim() }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error ?? "Failed to rename tag");
      } else {
        setEditing(false);
        router.refresh();
      }
    } catch {
      alert("Network error");
    } finally {
      setLoading(false);
    }
  }

  async function handleMerge() {
    if (!mergeTarget || mergeTarget === tag.id || loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/tags/${tag.id}/merge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toId: mergeTarget }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error ?? "Failed to merge tag");
      } else {
        setMergeOpen(false);
        router.refresh();
      }
    } catch {
      alert("Network error");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (loading) return;
    const confirmMsg = tag.post_count > 0
      ? `This tag has ${tag.post_count} post${tag.post_count !== 1 ? "s" : ""}. Delete it and remove the tag from all posts?`
      : `Delete tag "${tag.name}"?`;

    if (!confirm(confirmMsg)) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/tags/${tag.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error ?? "Failed to delete tag");
      } else {
        router.refresh();
      }
    } catch {
      alert("Network error");
    } finally {
      setLoading(false);
    }
  }

  const otherTags = allTags.filter((t) => t.id !== tag.id);

  return (
    <div className="flex items-center gap-2 justify-end">
      {editing ? (
        <div className="flex items-center gap-1.5">
          <input
            ref={inputRef}
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRename();
              if (e.key === "Escape") {
                setEditing(false);
                setEditName(tag.name);
              }
            }}
            className="w-28 px-2 py-1 bg-surface-0 border border-surface-border rounded text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary transition-colors"
          />
          <button
            onClick={handleRename}
            disabled={loading || !editName.trim() || editName.trim() === tag.name}
            className="px-2 py-1 bg-primary text-white rounded text-xs font-bold hover:bg-primary-glow transition-colors font-heading disabled:opacity-50"
          >
            Save
          </button>
          <button
            onClick={() => {
              setEditing(false);
              setEditName(tag.name);
            }}
            disabled={loading}
            className="px-2 py-1 bg-surface-3 text-text-muted rounded text-xs font-bold hover:bg-surface-4 transition-colors font-heading"
          >
            Cancel
          </button>
        </div>
      ) : (
        <>
          <button
            onClick={() => setEditing(true)}
            disabled={loading}
            className="px-3 py-1.5 bg-surface-3 text-text-secondary rounded-lg text-xs font-bold hover:bg-surface-4 hover:text-text-primary transition-colors font-heading border border-surface-border disabled:opacity-50"
          >
            Rename
          </button>

          {otherTags.length > 0 && (mergeOpen ? (
            <div className="flex items-center gap-1.5">
              <select
                value={mergeTarget}
                onChange={(e) => setMergeTarget(e.target.value)}
                className="w-32 px-2 py-1 bg-surface-0 border border-surface-border rounded text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary transition-colors"
              >
                <option value="">Select tag...</option>
                {otherTags.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.post_count})
                  </option>
                ))}
              </select>
              <button
                onClick={handleMerge}
                disabled={!mergeTarget || loading}
                className="px-2 py-1 bg-amber-400/80 text-white rounded text-xs font-bold hover:bg-amber-400 transition-colors font-heading disabled:opacity-50"
              >
                Merge
              </button>
              <button
                onClick={() => {
                  setMergeOpen(false);
                  setMergeTarget("");
                }}
                disabled={loading}
                className="px-2 py-1 bg-surface-3 text-text-muted rounded text-xs font-bold hover:bg-surface-4 transition-colors font-heading"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setMergeOpen(true)}
              disabled={loading}
              className="px-3 py-1.5 bg-amber-700/10 dark:bg-amber-400/10 text-amber-700 dark:text-amber-400 rounded-lg text-xs font-bold hover:bg-amber-700/20 dark:hover:bg-amber-400/20 transition-colors font-heading border border-amber-700/20 dark:border-amber-400/20 disabled:opacity-50"
            >
              Merge
            </button>
          ))}

          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg text-xs font-bold hover:bg-red-500/20 transition-colors font-heading border border-red-500/20 disabled:opacity-50"
          >
            Delete
          </button>
        </>
      )}
    </div>
  );
}
