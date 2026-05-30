"use client";

import Link from "next/link";
import type { Category } from "@/lib/types";

export default function CategoryBar({
  categories,
  active,
}: {
  categories: Pick<Category, "name" | "slug">[];
  active?: string;
}) {
  return (
    <div className="md:hidden mb-4 -mx-5 px-5">
      <p className="text-xs font-bold uppercase tracking-widest text-text-muted font-heading mb-2 px-0.5">
        Browse
      </p>
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        {/* All / Home pill */}
        <Link
          href="/"
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium font-heading transition-all duration-150 whitespace-nowrap ${
            !active
              ? "bg-primary text-white shadow-sm shadow-primary/20"
              : "bg-surface-2 text-text-secondary border border-surface-border hover:bg-surface-3 hover:text-text-primary"
          }`}
        >
          All
        </Link>

        {categories.map((cat) => {
          const isActive = active === cat.slug;
          return (
            <Link
              key={cat.slug}
              href={`/?category=${cat.slug}`}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium font-heading transition-all duration-150 whitespace-nowrap ${
                isActive
                  ? "bg-primary text-white shadow-sm shadow-primary/20"
                  : "bg-surface-2 text-text-secondary border border-surface-border hover:bg-surface-3 hover:text-text-primary"
              }`}
            >
              {cat.name}
            </Link>
          );
        })}
      </div>

      {/* Hide scrollbar but allow scrolling */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
