import { getCategories } from "@/lib/data/server";
import Link from "next/link";
import TrendingPosts from "./TrendingPosts";
import PopularTags from "./PopularTags";

const categoryIcons: Record<string, string> = {
  home: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1",
  maintenance: "M13 10V3L4 14h7v7l9-11h-7z",
  repair: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4",
  "mods-tuning": "M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z",
  detailing: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01",
  "buying-advice": "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  "diy-guides": "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
};

export default async function Sidebar({ active }: { active?: string }) {
  const categories = await getCategories();

  return (
    <aside className="w-52 shrink-0 hidden md:block">
      <nav className="sticky top-20 space-y-0.5" aria-label="Categories">
        <div className="px-2 pb-2 mb-2 border-b border-surface-border">
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted font-heading">Browse</p>
        </div>
        <Link
          href="/"
          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 font-heading ${
            !active
              ? "bg-primary/10 text-primary border-l-2 border-primary"
              : "text-text-secondary hover:text-text-primary hover:bg-surface-2 border-l-2 border-transparent"
          }`}
        >
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={categoryIcons.home} />
          </svg>
          Home
        </Link>
        {categories.map(cat => (
          <Link
            key={cat.id}
            href={`/?category=${cat.slug}`}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 font-heading ${
              active === cat.slug
                ? "bg-primary/10 text-primary border-l-2 border-primary"
                : "text-text-secondary hover:text-text-primary hover:bg-surface-2 border-l-2 border-transparent"
            }`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={categoryIcons[cat.slug] || categoryIcons.home} />
            </svg>
            {cat.name}
          </Link>
        ))}

        <div className="mt-4 px-2 pt-3 border-t border-surface-border">
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted font-heading mb-1">Community</p>
        </div>
        <a href="https://www.reddit.com/r/cars/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-text-muted hover:text-orange-400 hover:bg-surface-2 transition-all duration-150 font-heading border-l-2 border-transparent">r/cars ↗</a>
        <a href="https://www.reddit.com/r/MechanicAdvice/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-text-muted hover:text-orange-400 hover:bg-surface-2 transition-all duration-150 font-heading border-l-2 border-transparent">r/MechanicAdvice ↗</a>

        <TrendingPosts />
        <PopularTags />
      </nav>
    </aside>
  );
}
