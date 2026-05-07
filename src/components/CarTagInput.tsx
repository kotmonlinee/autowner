"use client";

import { useState, useEffect, useRef } from "react";
import { searchCarTags } from "@/lib/data/browser";

export default function CarTagInput({
  selected,
  onChange,
}: {
  selected: { name: string; slug: string }[];
  onChange: (tags: { name: string; slug: string }[]) => void;
}) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<{ name: string; slug: string }[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (input.length < 2) { setSuggestions([]); return; }
    const timer = setTimeout(async () => {
      const data = await searchCarTags(input);
      setSuggestions(data);
    }, 200);
    return () => clearTimeout(timer);
  }, [input]);

  const addTag = (tag: { name: string; slug: string }) => {
    if (!selected.find(t => t.slug === tag.slug)) {
      onChange([...selected, tag]);
    }
    setInput("");
    setSuggestions([]);
  };

  const removeTag = (slug: string) => {
    onChange(selected.filter(t => t.slug !== slug));
  };

  return (
    <div ref={ref} className="relative">
      <div className="flex flex-wrap gap-1.5 mb-2">
        {selected.map(tag => (
          <span key={tag.slug} className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 text-xs font-medium rounded-lg font-heading">
            {tag.name}
            <button onClick={() => removeTag(tag.slug)} className="hover:text-primary-glow transition-colors">&times;</button>
          </span>
        ))}
      </div>
      <input
        type="text" value={input} onChange={e => setInput(e.target.value)}
        placeholder="Add car model tag (e.g. BMW M3)..."
        className="w-full px-4 py-2.5 bg-surface-2 text-text-primary text-sm rounded-xl border border-surface-border focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-all placeholder:text-text-muted"
        onKeyDown={e => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (input.trim()) {
              addTag({ name: input.trim(), slug: input.trim().toLowerCase().replace(/\s+/g, "-") });
            }
          }
        }}
      />
      {suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1.5 bg-surface-2 border border-surface-border rounded-xl shadow-xl max-h-44 overflow-y-auto py-1">
          {suggestions.map(s => (
            <button
              key={s.slug}
              onClick={() => addTag(s)}
              className="w-full px-4 py-2 text-left text-sm text-text-secondary hover:bg-surface-3 hover:text-text-primary transition-colors font-medium"
            >
              {s.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
