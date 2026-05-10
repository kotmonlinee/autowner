"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function CategoryFilter({
  categories,
}: {
  categories: { slug: string; name: string }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") ?? "";
  const currentQuery = searchParams.get("q") ?? "";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value;
    const params = new URLSearchParams();
    if (currentQuery) params.set("q", currentQuery);
    if (category) params.set("category", category);
    const qs = params.toString();
    router.push(`/search${qs ? `?${qs}` : ""}`);
  };

  return (
    <select
      value={currentCategory}
      onChange={handleChange}
      className="px-3 py-2 bg-surface-2 text-text-primary text-sm rounded-lg border border-surface-border focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-all appearance-none cursor-pointer"
    >
      <option value="">All Categories</option>
      {categories.map((cat) => (
        <option key={cat.slug} value={cat.slug}>
          {cat.name}
        </option>
      ))}
    </select>
  );
}
