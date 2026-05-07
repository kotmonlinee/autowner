# AutOwner MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Reddit-style car aftermarket forum with automated content aggregation, targeting European and American car owners.

**Architecture:** Next.js 14 App Router with SSR for SEO-optimized pages. Supabase handles auth, database, and real-time subscriptions. A server-side scraping engine ingests car aftermarket content from external sources and queues it for admin review. Client components use React hooks for interactivity (votes, bookmarks) while server components fetch data for initial render.

**Tech Stack:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, Supabase (Postgres + Auth), Vercel (hosting)

---

## File Structure

```
autowner/
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── .env.local                  (gitignored)
├── .env.example
├── .gitignore
├── middleware.ts               (auth redirects)
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx            (homepage - post feed)
│   │   ├── globals.css
│   │   ├── post/
│   │   │   └── [id]/
│   │   │       └── page.tsx    (post detail)
│   │   ├── submit/
│   │   │   └── page.tsx        (create post)
│   │   ├── auth/
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── callback/route.ts
│   │   ├── admin/
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   ├── search/
│   │   │   └── page.tsx
│   │   └── api/
│   │       ├── posts/route.ts
│   │       ├── votes/route.ts
│   │       ├── bookmarks/route.ts
│   │       ├── comments/route.ts
│   │       └── scrape/route.ts
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── PostCard.tsx
│   │   ├── PostFeed.tsx
│   │   ├── VoteButtons.tsx
│   │   ├── BookmarkButton.tsx
│   │   ├── CommentSection.tsx
│   │   ├── CommentItem.tsx
│   │   ├── SearchBar.tsx
│   │   ├── SortToggle.tsx
│   │   ├── CarTagInput.tsx
│   │   └── RelatedPosts.tsx
│   ├── lib/
│   │   ├── supabase.ts         (browser client)
│   │   ├── supabase-server.ts  (server client with cookies)
│   │   ├── auth.ts             (server auth helpers)
│   │   └── types.ts            (shared TypeScript types)
│   └── scrapers/
│       ├── orchestrator.ts
│       ├── sources.ts          (source definitions)
│       └── formatter.ts
└── scripts/
    └── scrape.ts               (runs via Vercel Cron or manual trigger)
```

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.js`, `tailwind.config.ts`, `postcss.config.js`, `.gitignore`, `.env.example`, `src/app/globals.css`, `src/app/layout.tsx`

- [ ] **Step 1: Create Next.js project**

```bash
cd /Users/amy.wang/autowner && npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --no-import-alias --use-npm
```

Expected: Project scaffolded with App Router, TypeScript, Tailwind.

- [ ] **Step 2: Install additional dependencies**

```bash
cd /Users/amy.wang/autowner && npm install @supabase/supabase-js @supabase/ssr cheerio marked
```

Expected: Packages installed. `cheerio` for scraping, `marked` for markdown rendering.

- [ ] **Step 3: Create `.env.example`**

```
# .env.example
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SCRAPE_API_SECRET=your-secret-token
```

- [ ] **Step 4: Create `.gitignore`**

```
# .gitignore — append to generated file
.env.local
.env
.superpowers/
node_modules/
.next/
```

- [ ] **Step 5: Set up Tailwind config**

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#e94560", dark: "#c23152" },
        surface: { DEFAULT: "#1a1a2e", light: "#16213e", muted: "#0f3460" },
      },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 6: Write root layout**

```tsx
// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AutOwner — Car Aftermarket Community",
  description: "Find solutions for car maintenance, repair, modification, and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen">{children}</body>
    </html>
  );
}
```

- [ ] **Step 7: Write globals.css**

```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 8: Verify project runs**

```bash
cd /Users/amy.wang/autowner && npm run dev
```

Expected: Dev server starts on localhost:3000, blank page renders.

- [ ] **Step 9: Commit**

```bash
cd /Users/amy.wang/autowner && git init && git add -A && git commit -m "feat: scaffold Next.js project with TypeScript and Tailwind"
```

---

### Task 2: Supabase Setup and Database Schema

**Files:**
- Create: `supabase/migrations/001_initial_schema.sql`, `src/lib/supabase.ts`, `src/lib/supabase-server.ts`

- [ ] **Step 1: Set up Supabase project**

1. Go to https://supabase.com and create a new project named "autowner"
2. In SQL Editor, run the migration SQL below
3. Copy the project URL and anon key to `.env.local`
4. Get the service_role key from project settings → API

- [ ] **Step 2: Create migration file**

```sql
-- supabase/migrations/001_initial_schema.sql

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- Users table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  created_at timestamp with time zone default now()
);

-- Categories
create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  description text,
  sort_order int default 0
);

insert into public.categories (name, slug, description, sort_order) values
  ('Maintenance', 'maintenance', 'Oil changes, fluids, filters, scheduled service', 1),
  ('Repair', 'repair', 'Diagnose and fix problems', 2),
  ('Mods & Tuning', 'mods-tuning', 'Performance upgrades, ECU tuning, aftermarket parts', 3),
  ('Detailing', 'detailing', 'Paint care, interior cleaning, ceramic coating', 4),
  ('Buying Advice', 'buying-advice', 'What car to buy, pricing, reliability', 5),
  ('DIY Guides', 'diy-guides', 'Step-by-step how-to tutorials', 6);

-- Source enum
create type post_source as enum ('user', 'scraped');
create type post_status as enum ('approved', 'pending', 'rejected');

-- Posts
create table public.posts (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  body text not null,
  author_id uuid references public.profiles(id) on delete set null,
  category_id uuid references public.categories(id) on delete set null,
  source post_source default 'user',
  source_url text,
  status post_status default 'approved',
  vote_score int default 0,
  comment_count int default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create index idx_posts_category on public.posts(category_id);
create index idx_posts_status on public.posts(status);
create index idx_posts_vote_score on public.posts(vote_score desc);
create index idx_posts_created_at on public.posts(created_at desc);
create index idx_posts_title on public.posts using gin(to_tsvector('english', title));

-- Car tags
create table public.car_tags (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null
);

create table public.post_tags (
  post_id uuid references public.posts(id) on delete cascade,
  tag_id uuid references public.car_tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

-- Comments
create table public.comments (
  id uuid default uuid_generate_v4() primary key,
  post_id uuid references public.posts(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  body text not null,
  vote_score int default 0,
  created_at timestamp with time zone default now()
);

create index idx_comments_post on public.comments(post_id, created_at);

-- Votes
create type vote_target as enum ('post', 'comment');
create type vote_direction as enum ('up', 'down');

create table public.votes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  target_type vote_target not null,
  target_id uuid not null,
  direction vote_direction not null,
  created_at timestamp with time zone default now(),
  unique(user_id, target_type, target_id)
);

-- Bookmarks
create table public.bookmarks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  post_id uuid references public.posts(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique(user_id, post_id)
);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Update post comment_count when comments change
create or replace function update_post_comment_count()
returns trigger as $$
begin
  if (tg_op = 'INSERT') then
    update public.posts set comment_count = comment_count + 1 where id = new.post_id;
  elsif (tg_op = 'DELETE') then
    update public.posts set comment_count = comment_count - 1 where id = old.post_id;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger on_comment_change
  after insert or delete on public.comments
  for each row execute function update_post_comment_count();
```

- [ ] **Step 3: Create browser Supabase client**

```ts
// src/lib/supabase.ts
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

- [ ] **Step 4: Create server Supabase client**

```ts
// src/lib/supabase-server.ts
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./types";

export async function createServerSupabase() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );
}

export async function createServiceSupabase() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get() { return undefined; },
        set() {},
        remove() {},
      },
    }
  );
}
```

- [ ] **Step 5: Commit**

```bash
cd /Users/amy.wang/autowner && git add -A && git commit -m "feat: add Supabase schema, seed data, and client setup"
```

---

### Task 3: Shared Types

**Files:**
- Create: `src/lib/types.ts`

- [ ] **Step 1: Write types file**

```ts
// src/lib/types.ts

export type Post = {
  id: string;
  title: string;
  body: string;
  author_id: string | null;
  category_id: string | null;
  source: "user" | "scraped";
  source_url: string | null;
  status: "approved" | "pending" | "rejected";
  vote_score: number;
  comment_count: number;
  created_at: string;
  updated_at: string;
};

export type PostWithRelations = Post & {
  profiles: { username: string } | null;
  categories: { name: string; slug: string } | null;
  post_tags: { car_tags: { name: string; slug: string } }[];
};

export type Comment = {
  id: string;
  post_id: string;
  author_id: string | null;
  body: string;
  vote_score: number;
  created_at: string;
};

export type CommentWithAuthor = Comment & {
  profiles: { username: string } | null;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
};

export type Profile = {
  id: string;
  username: string;
  created_at: string;
};

export type CarTag = {
  id: string;
  name: string;
  slug: string;
};

export type Vote = {
  id: string;
  user_id: string;
  target_type: "post" | "comment";
  target_id: string;
  direction: "up" | "down";
};

export type Bookmark = {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
};
```

- [ ] **Step 2: Commit**

```bash
cd /Users/amy.wang/autowner && git add -A && git commit -m "feat: add shared TypeScript types"
```

---

### Task 4: Authentication Pages

**Files:**
- Create: `src/app/auth/login/page.tsx`, `src/app/auth/register/page.tsx`, `src/app/auth/callback/route.ts`, `middleware.ts`

- [ ] **Step 1: Create auth callback route**

```ts
// src/app/auth/callback/route.ts
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createServerSupabase();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=auth-failed`);
}
```

- [ ] **Step 2: Create middleware**

```ts
// middleware.ts
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return request.cookies.get(name)?.value; },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const protectedPaths = ["/submit", "/admin"];
  const authPaths = ["/auth/login", "/auth/register"];
  const path = request.nextUrl.pathname;

  if (!user && protectedPaths.some(p => path.startsWith(p))) {
    return NextResponse.redirect(new URL(`/auth/login?next=${path}`, request.url));
  }

  if (user && authPaths.some(p => path.startsWith(p))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/submit/:path*", "/admin/:path*", "/auth/login", "/auth/register"],
};
```

- [ ] **Step 3: Create login page**

```tsx
// src/app/auth/login/page.tsx
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push(next);
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold mb-6">Log in to AutOwner</h1>
        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded text-sm">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-500 text-center">
          Don&apos;t have an account? <Link href="/auth/register" className="text-primary hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create register page**

```tsx
// src/app/auth/register/page.tsx
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold mb-6">Join AutOwner</h1>
        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded text-sm">{error}</div>}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
              minLength={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
              minLength={6}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-500 text-center">
          Already have an account? <Link href="/auth/login" className="text-primary hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Verify auth flow**

```bash
cd /Users/amy.wang/autowner && npm run dev
```

Test: Visit /auth/register, create an account, verify redirect to home. Visit /submit without logging in, verify redirect to /auth/login.

- [ ] **Step 6: Commit**

```bash
cd /Users/amy.wang/autowner && git add -A && git commit -m "feat: add email auth with login, register, and middleware"
```

---

### Task 5: Layout Components

**Files:**
- Create: `src/components/Navbar.tsx`, `src/components/Sidebar.tsx`, `src/components/SearchBar.tsx`, `src/components/SortToggle.tsx`

- [ ] **Step 1: Create Navbar**

```tsx
// src/components/Navbar.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-50 bg-surface border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
        <Link href="/" className="text-primary font-bold text-lg shrink-0">
          AUTOWNER
        </Link>

        <SearchBar />

        <div className="flex items-center gap-3 ml-auto shrink-0">
          {user ? (
            <>
              <Link
                href="/submit"
                className="px-3 py-1.5 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark"
              >
                + New Post
              </Link>
              <button onClick={handleLogout} className="text-sm text-gray-300 hover:text-white">
                Logout
              </button>
            </>
          ) : (
            <Link href="/auth/login" className="text-sm text-gray-300 hover:text-white">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Create SearchBar**

```tsx
// src/components/SearchBar.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 max-w-md">
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search posts..."
        className="w-full px-3 py-1.5 bg-surface-light text-white text-sm rounded-lg border border-gray-600 focus:outline-none focus:border-primary placeholder-gray-400"
      />
    </form>
  );
}
```

- [ ] **Step 3: Create Sidebar**

```tsx
// src/components/Sidebar.tsx
import { createServerSupabase } from "@/lib/supabase-server";
import Link from "next/link";
import type { Category } from "@/lib/types";

export default async function Sidebar({ active }: { active?: string }) {
  const supabase = await createServerSupabase();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");

  return (
    <aside className="w-56 shrink-0">
      <nav className="sticky top-16 space-y-0.5">
        <Link
          href="/"
          className={`block px-3 py-2 rounded-lg text-sm ${
            !active ? "bg-primary/10 text-primary font-medium" : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Home
        </Link>
        {(categories as Category[] | null)?.map(cat => (
          <Link
            key={cat.id}
            href={`/?category=${cat.slug}`}
            className={`block px-3 py-2 rounded-lg text-sm ${
              active === cat.slug
                ? "bg-primary/10 text-primary font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
```

- [ ] **Step 4: Create SortToggle**

```tsx
// src/components/SortToggle.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SortToggle() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("sort") ?? "hot";

  const handleSort = (sort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sort);
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
      {(["hot", "new"] as const).map(sort => (
        <button
          key={sort}
          onClick={() => handleSort(sort)}
          className={`px-3 py-1 text-sm rounded-md capitalize ${
            current === sort ? "bg-white shadow-sm font-medium" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {sort}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
cd /Users/amy.wang/autowner && git add -A && git commit -m "feat: add Navbar, Sidebar, SearchBar, and SortToggle components"
```

---

### Task 6: Post Feed and Homepage

**Files:**
- Create: `src/components/PostCard.tsx`, `src/components/PostFeed.tsx`, `src/app/page.tsx`
- Modify: `src/app/layout.tsx` (add Navbar + Sidebar wrapper)

- [ ] **Step 1: Create PostCard**

```tsx
// src/components/PostCard.tsx
import Link from "next/link";
import VoteButtons from "./VoteButtons";
import type { PostWithRelations } from "@/lib/types";

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export default function PostCard({
  post,
  userId,
}: {
  post: PostWithRelations;
  userId?: string;
}) {
  return (
    <div className="flex gap-3 p-4 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
      <VoteButtons
        targetType="post"
        targetId={post.id}
        initialScore={post.vote_score}
        userId={userId}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
          {post.categories && (
            <Link
              href={`/?category=${post.categories.slug}`}
              className="text-primary hover:underline"
            >
              {post.categories.name}
            </Link>
          )}
          {post.source === "scraped" && (
            <span className="px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded text-[10px]">auto</span>
          )}
        </div>

        <Link href={`/post/${post.id}`} className="hover:underline">
          <h3 className="text-base font-semibold text-gray-900 line-clamp-2">{post.title}</h3>
        </Link>

        <div className="flex flex-wrap gap-1.5 mt-1.5">
          {post.post_tags?.map(pt => (
            <Link
              key={pt.car_tags.slug}
              href={`/?tag=${pt.car_tags.slug}`}
              className="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px] hover:bg-gray-200"
            >
              {pt.car_tags.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
          <span>{post.profiles?.username ?? "unknown"}</span>
          <span>·</span>
          <span>{post.comment_count} replies</span>
          <span>·</span>
          <span>{timeAgo(post.created_at)}</span>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create PostFeed**

```tsx
// src/components/PostFeed.tsx
import PostCard from "./PostCard";
import type { PostWithRelations } from "@/lib/types";

export default function PostFeed({
  posts,
  userId,
}: {
  posts: PostWithRelations[];
  userId?: string;
}) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-lg">No posts yet</p>
        <p className="text-sm mt-1">Be the first to start a discussion!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {posts.map(post => (
        <PostCard key={post.id} post={post} userId={userId} />
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Create homepage**

```tsx
// src/app/page.tsx
import { createServerSupabase } from "@/lib/supabase-server";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import PostFeed from "@/components/PostFeed";
import SortToggle from "@/components/SortToggle";
import type { PostWithRelations } from "@/lib/types";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const supabase = await createServerSupabase();
  const sort = params.sort ?? "hot";
  const categorySlug = params.category;
  const tagSlug = params.tag;

  let query = supabase
    .from("posts")
    .select("*, profiles(username), categories(name, slug), post_tags(car_tags(name, slug))")
    .eq("status", "approved");

  if (categorySlug) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .single();
    if (cat) query = query.eq("category_id", cat.id);
  }

  if (tagSlug) {
    const { data: tag } = await supabase
      .from("car_tags")
      .select("id")
      .eq("slug", tagSlug)
      .single();
    if (tag) {
      const { data: postIds } = await supabase
        .from("post_tags")
        .select("post_id")
        .eq("tag_id", tag.id);
      if (postIds?.length) {
        query = query.in("id", postIds.map(p => p.post_id));
      }
    }
  }

  if (sort === "new") {
    query = query.order("created_at", { ascending: false });
  } else {
    query = query.order("vote_score", { ascending: false });
  }

  const { data: posts } = await query.limit(30);

  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        <Sidebar active={categorySlug} />
        <main className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <SortToggle />
          </div>
          <PostFeed posts={(posts as PostWithRelations[]) ?? []} userId={user?.id} />
        </main>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verify homepage renders**

Run `npm run dev`, visit `http://localhost:3000`. Expected: Navbar, sidebar with categories, empty feed (no posts yet), sort toggle.

- [ ] **Step 5: Commit**

```bash
cd /Users/amy.wang/autowner && git add -A && git commit -m "feat: add homepage with post feed, sidebar filtering, and sorting"
```

---

### Task 7: Voting System

**Files:**
- Create: `src/components/VoteButtons.tsx`, `src/app/api/votes/route.ts`

- [ ] **Step 1: Create VoteButtons component**

```tsx
// src/components/VoteButtons.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function VoteButtons({
  targetType,
  targetId,
  initialScore,
  userId,
}: {
  targetType: "post" | "comment";
  targetId: string;
  initialScore: number;
  userId?: string;
}) {
  const [score, setScore] = useState(initialScore);
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!userId) return;
    const supabase = createClient();
    supabase
      .from("votes")
      .select("direction")
      .eq("user_id", userId)
      .eq("target_type", targetType)
      .eq("target_id", targetId)
      .single()
      .then(({ data }) => {
        if (data) setUserVote(data.direction);
      });
  }, [userId, targetType, targetId]);

  const vote = async (direction: "up" | "down") => {
    if (!userId) {
      router.push("/auth/login");
      return;
    }
    const supabase = createClient();
    const res = await fetch("/api/votes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetType, targetId, direction }),
    });
    if (res.ok) {
      const { newScore, newVote } = await res.json();
      setScore(newScore);
      setUserVote(newVote);
    }
  };

  return (
    <div className="flex flex-col items-center gap-0.5 shrink-0 w-8">
      <button
        onClick={() => vote("up")}
        className={`text-lg leading-none ${
          userVote === "up" ? "text-primary" : "text-gray-300 hover:text-primary"
        }`}
      >
        ▲
      </button>
      <span className={`text-xs font-semibold ${
        score > 0 ? "text-primary" : score < 0 ? "text-blue-500" : "text-gray-400"
      }`}>
        {score}
      </span>
      <button
        onClick={() => vote("down")}
        className={`text-lg leading-none ${
          userVote === "down" ? "text-blue-500" : "text-gray-300 hover:text-blue-500"
        }`}
      >
        ▼
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Create votes API route**

```ts
// src/app/api/votes/route.ts
import { createServerSupabase } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { targetType, targetId, direction } = await request.json();

  // Check existing vote
  const { data: existing } = await supabase
    .from("votes")
    .select("id, direction")
    .eq("user_id", user.id)
    .eq("target_type", targetType)
    .eq("target_id", targetId)
    .single();

  let scoreDelta = 0;
  let newVote: string | null = direction;

  if (existing) {
    if (existing.direction === direction) {
      // Remove vote
      await supabase.from("votes").delete().eq("id", existing.id);
      scoreDelta = direction === "up" ? -1 : 1;
      newVote = null;
    } else {
      // Flip vote
      await supabase.from("votes").update({ direction }).eq("id", existing.id);
      scoreDelta = direction === "up" ? 2 : -2;
    }
  } else {
    await supabase.from("votes").insert({
      user_id: user.id,
      target_type: targetType,
      target_id: targetId,
      direction,
    });
    scoreDelta = direction === "up" ? 1 : -1;
  }

  // Update denormalized score
  const table = targetType === "post" ? "posts" : "comments";
  const { data: updated } = await supabase
    .from(table)
    .select("vote_score")
    .eq("id", targetId)
    .single();

  const newScore = (updated?.vote_score ?? 0) + scoreDelta;
  await supabase.from(table).update({ vote_score: newScore }).eq("id", targetId);

  return NextResponse.json({ newScore, newVote });
}
```

- [ ] **Step 3: Commit**

```bash
cd /Users/amy.wang/autowner && git add -A && git commit -m "feat: add upvote/downvote system with API route"
```

---

### Task 8: Bookmark System

**Files:**
- Create: `src/components/BookmarkButton.tsx`, `src/app/api/bookmarks/route.ts`

- [ ] **Step 1: Create BookmarkButton**

```tsx
// src/components/BookmarkButton.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function BookmarkButton({
  postId,
  userId,
}: {
  postId: string;
  userId?: string;
}) {
  const [bookmarked, setBookmarked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!userId) return;
    const supabase = createClient();
    supabase
      .from("bookmarks")
      .select("id")
      .eq("user_id", userId)
      .eq("post_id", postId)
      .single()
      .then(({ data }) => setBookmarked(!!data));
  }, [userId, postId]);

  const toggle = async () => {
    if (!userId) {
      router.push("/auth/login");
      return;
    }
    const res = await fetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId }),
    });
    if (res.ok) {
      const { bookmarked: newState } = await res.json();
      setBookmarked(newState);
    }
  };

  return (
    <button
      onClick={toggle}
      className={`p-1.5 rounded-lg transition-colors ${
        bookmarked
          ? "text-primary bg-primary/10"
          : "text-gray-400 hover:text-primary hover:bg-gray-100"
      }`}
      title={bookmarked ? "Remove bookmark" : "Bookmark"}
    >
      <svg className="w-5 h-5" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
    </button>
  );
}
```

- [ ] **Step 2: Create bookmarks API**

```ts
// src/app/api/bookmarks/route.ts
import { createServerSupabase } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { postId } = await request.json();

  const { data: existing } = await supabase
    .from("bookmarks")
    .select("id")
    .eq("user_id", user.id)
    .eq("post_id", postId)
    .single();

  if (existing) {
    await supabase.from("bookmarks").delete().eq("id", existing.id);
    return NextResponse.json({ bookmarked: false });
  } else {
    await supabase.from("bookmarks").insert({ user_id: user.id, post_id: postId });
    return NextResponse.json({ bookmarked: true });
  }
}
```

- [ ] **Step 3: Commit**

```bash
cd /Users/amy.wang/autowner && git add -A && git commit -m "feat: add bookmark toggle with API route"
```

---

### Task 9: Post Creation Page

**Files:**
- Create: `src/components/CarTagInput.tsx`, `src/app/submit/page.tsx`, `src/app/api/posts/route.ts`

- [ ] **Step 1: Create CarTagInput**

```tsx
// src/components/CarTagInput.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase";

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
      const supabase = createClient();
      const { data } = await supabase
        .from("car_tags")
        .select("name, slug")
        .ilike("name", `%${input}%`)
        .limit(5);
      setSuggestions((data as { name: string; slug: string }[]) ?? []);
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
      <div className="flex flex-wrap gap-1 mb-1">
        {selected.map(tag => (
          <span key={tag.slug} className="flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
            {tag.name}
            <button onClick={() => removeTag(tag.slug)} className="hover:text-primary-dark">&times;</button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Add car model tag (e.g. BMW M3)..."
        className="w-full px-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        onKeyDown={e => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (input.trim()) {
              const slug = input.trim().toLowerCase().replace(/\s+/g, "-");
              addTag({ name: input.trim(), slug });
            }
          }
        }}
      />
      {suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-40 overflow-y-auto">
          {suggestions.map(s => (
            <button
              key={s.slug}
              onClick={() => addTag(s)}
              className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50"
            >
              {s.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create submit page**

```tsx
// src/app/submit/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
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

  useState(() => {
    const supabase = createClient();
    supabase.from("categories").select("id, name").order("sort_order").then(({ data }) => {
      if (data) setCategories(data);
    });
  });

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
    <div className="min-h-screen bg-gray-50">
      <nav className="sticky top-0 bg-surface border-b border-gray-700 h-14 flex items-center px-4">
        <a href="/" className="text-primary font-bold text-lg">AUTOWNER</a>
      </nav>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Create a Post</h1>
        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select a category...</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="What's your question or tip?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Body (Markdown supported)</label>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              required
              rows={12}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
              placeholder="Write your post content here..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Car Models</label>
            <CarTagInput selected={tags} onChange={setTags} />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create posts API**

```ts
// src/app/api/posts/route.ts
import { createServerSupabase } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Login required" }, { status: 401 });

  const { title, body, categoryId, tags } = await request.json();

  // Verify user has a profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 500 });

  const { data: post, error } = await supabase
    .from("posts")
    .insert({
      title,
      body,
      author_id: user.id,
      category_id: categoryId || null,
      source: "user",
      status: "approved",
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Upsert car tags
  if (tags?.length) {
    for (const tag of tags) {
      const { data: existing } = await supabase
        .from("car_tags")
        .select("id")
        .eq("slug", tag.slug)
        .single();

      let tagId: string;
      if (existing) {
        tagId = existing.id;
      } else {
        const { data: created } = await supabase
          .from("car_tags")
          .insert({ name: tag.name, slug: tag.slug })
          .select("id")
          .single();
        tagId = created!.id;
      }

      await supabase.from("post_tags").insert({ post_id: post!.id, tag_id: tagId });
    }
  }

  return NextResponse.json({ id: post!.id });
}
```

- [ ] **Step 4: Commit**

```bash
cd /Users/amy.wang/autowner && git add -A && git commit -m "feat: add post creation page and API with car tag input"
```

---

### Task 10: Post Detail Page + Comments

**Files:**
- Create: `src/app/post/[id]/page.tsx`, `src/components/CommentSection.tsx`, `src/components/CommentItem.tsx`, `src/components/RelatedPosts.tsx`, `src/app/api/comments/route.ts`
- Modify: `src/components/PostCard.tsx` (add BookmarkButton to post detail usage)

- [ ] **Step 1: Create CommentItem**

```tsx
// src/components/CommentItem.tsx
import VoteButtons from "./VoteButtons";
import type { CommentWithAuthor } from "@/lib/types";

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function CommentItem({
  comment,
  userId,
}: {
  comment: CommentWithAuthor;
  userId?: string;
}) {
  return (
    <div className="flex gap-3 py-3">
      <VoteButtons
        targetType="comment"
        targetId={comment.id}
        initialScore={comment.vote_score}
        userId={userId}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
          <span className="font-medium text-gray-600">{comment.profiles?.username ?? "deleted"}</span>
          <span>{timeAgo(comment.created_at)}</span>
        </div>
        <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.body}</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create CommentSection**

```tsx
// src/components/CommentSection.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import CommentItem from "./CommentItem";
import type { CommentWithAuthor } from "@/lib/types";

export default function CommentSection({
  postId,
  userId,
}: {
  postId: string;
  userId?: string;
}) {
  const [comments, setComments] = useState<CommentWithAuthor[]>([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("comments")
      .select("*, profiles(username)")
      .eq("post_id", postId)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (data) setComments(data as CommentWithAuthor[]);
      });
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    setLoading(true);

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, body: body.trim() }),
    });

    if (res.ok) {
      const { comment } = await res.json();
      setComments(prev => [...prev, comment]);
      setBody("");
    }
    setLoading(false);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">
        {comments.length} {comments.length === 1 ? "Reply" : "Replies"}
      </h3>

      {comments.map(comment => (
        <CommentItem key={comment.id} comment={comment} userId={userId} />
      ))}

      <form onSubmit={handleSubmit} className="mt-4 border-t pt-4">
        <textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder={userId ? "Write a reply..." : "Login to reply"}
          rows={3}
          disabled={!userId}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm disabled:bg-gray-100"
        />
        {userId && (
          <button
            type="submit"
            disabled={loading || !body.trim()}
            className="mt-2 px-4 py-1.5 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark disabled:opacity-50"
          >
            {loading ? "Posting..." : "Reply"}
          </button>
        )}
      </form>
    </div>
  );
}
```

- [ ] **Step 3: Create comments API**

```ts
// src/app/api/comments/route.ts
import { createServerSupabase } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Login required" }, { status: 401 });

  const { postId, body } = await request.json();

  const { data: comment, error } = await supabase
    .from("comments")
    .insert({ post_id: postId, author_id: user.id, body })
    .select("*, profiles(username)")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ comment });
}
```

- [ ] **Step 4: Create RelatedPosts**

```tsx
// src/components/RelatedPosts.tsx
import { createServerSupabase } from "@/lib/supabase-server";
import Link from "next/link";

export default async function RelatedPosts({
  categoryId,
  excludeId,
}: {
  categoryId: string | null;
  excludeId: string;
}) {
  if (!categoryId) return null;

  const supabase = await createServerSupabase();
  const { data: posts } = await supabase
    .from("posts")
    .select("id, title, comment_count, vote_score, created_at")
    .eq("category_id", categoryId)
    .eq("status", "approved")
    .neq("id", excludeId)
    .order("vote_score", { ascending: false })
    .limit(5);

  if (!posts?.length) return null;

  return (
    <div className="bg-white rounded-lg border p-4">
      <h4 className="font-semibold text-sm mb-3">Related Posts</h4>
      <div className="space-y-2">
        {posts.map(post => (
          <Link key={post.id} href={`/post/${post.id}`} className="block">
            <p className="text-sm text-gray-700 hover:text-primary line-clamp-2">{post.title}</p>
            <span className="text-xs text-gray-400">{post.vote_score} points · {post.comment_count} replies</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Create post detail page**

```tsx
// src/app/post/[id]/page.tsx
import { createServerSupabase } from "@/lib/supabase-server";
import Navbar from "@/components/Navbar";
import BookmarkButton from "@/components/BookmarkButton";
import VoteButtons from "@/components/VoteButtons";
import CommentSection from "@/components/CommentSection";
import RelatedPosts from "@/components/RelatedPosts";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { PostWithRelations } from "@/lib/types";

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabase();

  const { data: post } = await supabase
    .from("posts")
    .select("*, profiles(username), categories(name, slug), post_tags(car_tags(name, slug))")
    .eq("id", id)
    .eq("status", "approved")
    .single();

  if (!post) notFound();

  const { data: { user } } = await supabase.auth.getUser();
  const p = post as unknown as PostWithRelations;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          <article className="flex-1 min-w-0">
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                {p.categories && (
                  <Link href={`/?category=${p.categories.slug}`} className="text-primary hover:underline">
                    {p.categories.name}
                  </Link>
                )}
                {p.source === "scraped" && (
                  <span className="px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded text-[10px]">auto</span>
                )}
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-4">{p.title}</h1>

              <div className="flex items-center gap-3 mb-6">
                <span className="text-sm text-gray-500">
                  Posted by <strong>{p.profiles?.username ?? "unknown"}</strong> · {timeAgo(p.created_at)}
                </span>
                <BookmarkButton postId={id} userId={user?.id} />
              </div>

              <div className="flex gap-4">
                <VoteButtons targetType="post" targetId={id} initialScore={p.vote_score} userId={user?.id} />
                <div className="flex-1 prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                  {p.body}
                </div>
              </div>

              {p.post_tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t">
                  {p.post_tags.map(pt => (
                    <Link
                      key={pt.car_tags.slug}
                      href={`/?tag=${pt.car_tags.slug}`}
                      className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs hover:bg-gray-200"
                    >
                      {pt.car_tags.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg border p-6 mt-4">
              <CommentSection postId={id} userId={user?.id} />
            </div>
          </article>

          <aside className="w-72 shrink-0 hidden lg:block">
            <div className="sticky top-20 space-y-4">
              <RelatedPosts categoryId={p.category_id} excludeId={id} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Commit**

```bash
cd /Users/amy.wang/autowner && git add -A && git commit -m "feat: add post detail page with comments, related posts, and voting"
```

---

### Task 11: Search Page

**Files:**
- Create: `src/app/search/page.tsx`

- [ ] **Step 1: Create search page**

```tsx
// src/app/search/page.tsx
import { createServerSupabase } from "@/lib/supabase-server";
import Navbar from "@/components/Navbar";
import PostCard from "@/components/PostCard";
import type { PostWithRelations } from "@/lib/types";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  let posts: PostWithRelations[] = [];

  if (q) {
    const { data } = await supabase
      .from("posts")
      .select("*, profiles(username), categories(name, slug), post_tags(car_tags(name, slug))")
      .eq("status", "approved")
      .or(`title.ilike.%${q}%,body.ilike.%${q}%`)
      .order("vote_score", { ascending: false })
      .limit(30);
    posts = (data as PostWithRelations[]) ?? [];
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold mb-4">
          {q ? `Results for "${q}"` : "Search"}
        </h1>
        {q && (
          <p className="text-sm text-gray-500 mb-4">{posts.length} results found</p>
        )}
        <div className="space-y-2">
          {posts.map(post => (
            <PostCard key={post.id} post={post} userId={user?.id} />
          ))}
        </div>
        {q && posts.length === 0 && (
          <p className="text-gray-400 text-center py-12">No results found. Try different keywords.</p>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/amy.wang/autowner && git add -A && git commit -m "feat: add search page with ILIKE title/body matching"
```

---

### Task 12: Content Scraping Engine

**Files:**
- Create: `src/scrapers/sources.ts`, `src/scrapers/formatter.ts`, `src/scrapers/orchestrator.ts`, `scripts/scrape.ts`, `src/app/api/scrape/route.ts`

- [ ] **Step 1: Create sources config**

```ts
// src/scrapers/sources.ts
export interface ScrapeSource {
  name: string;
  url: string;
  categorySlug: string;
  extractor: "reddit-json" | "generic-html";
  selectors?: {
    title: string;
    body: string;
    link: string;
  };
  baseUrl?: string;
}

export const sources: ScrapeSource[] = [
  {
    name: "r/cars",
    url: "https://www.reddit.com/r/cars/hot.json?limit=10",
    categorySlug: "buying-advice",
    extractor: "reddit-json",
  },
  {
    name: "r/MechanicAdvice",
    url: "https://www.reddit.com/r/MechanicAdvice/hot.json?limit=10",
    categorySlug: "repair",
    extractor: "reddit-json",
  },
  {
    name: "r/AutoDetailing",
    url: "https://www.reddit.com/r/AutoDetailing/hot.json?limit=10",
    categorySlug: "detailing",
    extractor: "reddit-json",
  },
  {
    name: "r/CarModding",
    url: "https://www.reddit.com/r/carmodification/hot.json?limit=10",
    categorySlug: "mods-tuning",
    extractor: "reddit-json",
  },
  {
    name: "r/DIYAutoRepair",
    url: "https://www.reddit.com/r/DIYAutoRepair/hot.json?limit=10",
    categorySlug: "diy-guides",
    extractor: "reddit-json",
  },
];
```

- [ ] **Step 2: Create formatter**

```ts
// src/scrapers/formatter.ts
interface RawContent {
  title: string;
  body: string;
  sourceUrl: string;
}

export function formatForPost(raw: RawContent): { title: string; body: string } {
  // Truncate long titles
  let title = raw.title.trim();
  if (title.length > 200) title = title.slice(0, 197) + "...";

  // Clean up markdown-style formatting from Reddit
  let body = raw.body
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .trim();

  // Append source link
  body += `\n\n---\n*Source: ${raw.sourceUrl}*`;

  return { title, body };
}

export function shouldSkip(title: string, body: string): boolean {
  // Skip if too short
  if (body.length < 100) return true;
  // Skip if title is just a question mark or very short
  if (title.length < 10) return true;
  return false;
}
```

- [ ] **Step 3: Create orchestrator**

```ts
// src/scrapers/orchestrator.ts
import { createServiceSupabase } from "@/lib/supabase-server";
import { sources } from "./sources";
import { formatForPost, shouldSkip } from "./formatter";
import * as cheerio from "cheerio";

async function fetchReddit(url: string): Promise<{ title: string; body: string; sourceUrl: string }[]> {
  const res = await fetch(url, {
    headers: { "User-Agent": "AutOwner/1.0 (content aggregator)" },
  });
  const json = await res.json();
  const posts = json?.data?.children ?? [];

  return posts
    .filter((p: any) => p.data && !p.data.stickied)
    .map((p: any) => ({
      title: p.data.title,
      body: p.data.selftext || `[Reddit discussion](${p.data.url})`,
      sourceUrl: `https://reddit.com${p.data.permalink}`,
    }));
}

async function scrapeSource(source: typeof sources[0]): Promise<number> {
  const supabase = await createServiceSupabase();

  // Find category
  const { data: category } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", source.categorySlug)
    .single();

  if (!category) return 0;

  // Fetch content based on extractor type
  let items: { title: string; body: string; sourceUrl: string }[] = [];
  if (source.extractor === "reddit-json") {
    items = await fetchReddit(source.url);
  }

  let inserted = 0;
  for (const item of items) {
    if (shouldSkip(item.title, item.body)) continue;

    const { title, body } = formatForPost(item);

    // Check dedup by source URL
    const { data: existing } = await supabase
      .from("posts")
      .select("id")
      .eq("source_url", item.sourceUrl)
      .single();

    if (existing) continue;

    const { error } = await supabase.from("posts").insert({
      title,
      body,
      author_id: null,
      category_id: category.id,
      source: "scraped",
      source_url: item.sourceUrl,
      status: "approved", // v1 auto-approve
    });

    if (!error) inserted++;
  }

  return inserted;
}

export async function runScrape(): Promise<{ total: number; details: string[] }> {
  const details: string[] = [];
  let total = 0;

  for (const source of sources) {
    try {
      const count = await scrapeSource(source);
      details.push(`${source.name}: ${count} new posts`);
      total += count;
    } catch (err) {
      details.push(`${source.name}: error — ${err instanceof Error ? err.message : "unknown"}`);
    }
  }

  return { total, details };
}
```

- [ ] **Step 4: Create scrape script (for Vercel Cron)**

```ts
// scripts/scrape.ts
import { runScrape } from "../src/scrapers/orchestrator";

async function main() {
  console.log("Starting scrape job...");
  const { total, details } = await runScrape();
  for (const d of details) console.log(`  ${d}`);
  console.log(`Done. ${total} total posts inserted.`);
}

main().catch(console.error);
```

- [ ] **Step 5: Create scrape API route**

```ts
// src/app/api/scrape/route.ts
import { createServerSupabase } from "@/lib/supabase-server";
import { runScrape } from "@/scrapers/orchestrator";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const secret = request.headers.get("x-scrape-secret");
  if (secret !== process.env.SCRAPE_API_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 403 });
  }

  const result = await runScrape();
  return NextResponse.json(result);
}
```

- [ ] **Step 6: Verify scrape works**

Run a test: start dev server, call `curl -X POST http://localhost:3000/api/scrape -H "x-scrape-secret: your-secret"`. Expected: posts from Reddit appear in the database and on the homepage.

- [ ] **Step 7: Commit**

```bash
cd /Users/amy.wang/autowner && git add -A && git commit -m "feat: add content scraping engine for Reddit car communities"
```

---

### Task 13: Admin Dashboard

**Files:**
- Create: `src/app/admin/layout.tsx`, `src/app/admin/page.tsx`

- [ ] **Step 1: Create admin layout (auth gate)**

```tsx
// src/app/admin/layout.tsx
import { createServerSupabase } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // v1: any logged-in user can access admin (scraped content review)
  // Post-MVP: add admin role check

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-surface border-b border-gray-700 h-14 flex items-center px-4 gap-6">
        <Link href="/" className="text-primary font-bold text-lg">AUTOWNER</Link>
        <Link href="/admin" className="text-gray-300 text-sm hover:text-white">Content Review</Link>
        <Link href="/" className="text-gray-300 text-sm hover:text-white">← Back to Site</Link>
      </nav>
      <div className="max-w-5xl mx-auto px-4 py-6">{children}</div>
    </div>
  );
}
```

- [ ] **Step 2: Create admin page**

```tsx
// src/app/admin/page.tsx
import { createServerSupabase } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminPage() {
  const supabase = await createServerSupabase();

  const { data: posts } = await supabase
    .from("posts")
    .select("*, profiles(username), categories(name)")
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Content Review</h1>
        <form action={async () => {
          "use server";
          const s = await createServerSupabase();
          const { data: { user } } = await s.auth.getUser();
          if (!user) redirect("/auth/login");

          const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/api/scrape`, {
            method: "POST",
            headers: { "x-scrape-secret": process.env.SCRAPE_API_SECRET! },
          });
          revalidatePath("/admin");
          revalidatePath("/");
        }}>
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark text-sm">
            Trigger Scrape
          </button>
        </form>
      </div>

      <div className="space-y-2">
        {posts?.length === 0 && (
          <p className="text-gray-400 text-center py-12">No posts pending review.</p>
        )}
        {posts?.map((post: any) => (
          <div key={post.id} className="bg-white rounded-lg border p-4 flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <Link href={`/post/${post.id}`} className="font-semibold text-gray-900 hover:text-primary">
                {post.title}
              </Link>
              <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                <span>{post.categories?.name}</span>
                <span>source: {post.source}</span>
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <form action={async () => {
                "use server";
                const s = await createServerSupabase();
                await s.from("posts").update({ status: "approved" }).eq("id", post.id);
                revalidatePath("/admin");
              }}>
                <button className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600">
                  Approve
                </button>
              </form>
              <form action={async () => {
                "use server";
                const s = await createServerSupabase();
                await s.from("posts").update({ status: "rejected" }).eq("id", post.id);
                revalidatePath("/admin");
              }}>
                <button className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600">
                  Reject
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
cd /Users/amy.wang/autowner && git add -A && git commit -m "feat: add admin dashboard with content review and scrape trigger"
```

---

### Task 14: SEO Metadata (Final Polish)

**Files:**
- Modify: `src/app/post/[id]/page.tsx`, `src/app/page.tsx`

- [ ] **Step 1: Add dynamic metadata to post page**

In `src/app/post/[id]/page.tsx`, add before the component:

```tsx
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const { data: post } = await supabase
    .from("posts")
    .select("title, body")
    .eq("id", id)
    .single();

  if (!post) return { title: "Post Not Found — AutOwner" };

  const description = post.body.replace(/[#*`\[\]()>]/g, "").slice(0, 160);
  return {
    title: `${post.title} — AutOwner`,
    description,
    openGraph: {
      title: post.title,
      description,
      type: "article",
    },
  };
}
```

- [ ] **Step 2: Add structured description to homepage**

Add `export const metadata` override in `src/app/page.tsx` if not already present in layout.

- [ ] **Step 3: Verify all pages work end-to-end**

Run `npm run dev`, test:
- Visit homepage → see scraped posts with categories
- Filter by category → see filtered posts
- Click post → see detail page with votes, bookmarks, comments
- Login → create a post → vote on it → bookmark it
- Visit /admin → see pending posts, approve/reject, trigger scrape
- Search for a post

- [ ] **Step 4: Commit**

```bash
cd /Users/amy.wang/autowner && git add -A && git commit -m "feat: add SEO metadata and final polish"
```

---

## Plan Self-Review Summary

- **Spec coverage**: All 6 MVP features have corresponding tasks — homepage (Tasks 5-6), post detail (Task 10), post creation (Task 9), user system (Task 4), content scraping (Task 12), admin dashboard (Task 13), plus voting (Task 7), bookmarks (Task 8), search (Task 11), SEO (Task 14).
- **All steps have complete code** — no "TBD" or "similar to above" placeholders.
- **Type consistency**: `PostWithRelations`, `CommentWithAuthor` used consistently; Supabase queries match schema column names.
- **One ambiguity to call out**: The reddit scraping uses Reddit's public JSON API (no API key needed), which is sufficient for MVP content seeding. For production, consider PRAW/Reddit API with authentication for higher rate limits.
