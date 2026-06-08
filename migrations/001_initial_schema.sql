-- Enable UUID generation
create extension if not exists "uuid-ossp"
;
-- Users table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  created_at timestamp with time zone default now()
)
;
-- Categories
create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  description text,
  sort_order int default 0
)
;
insert into public.categories (name, slug, description, sort_order) values
  ('Maintenance', 'maintenance', 'Oil changes, fluids, filters, scheduled service', 1),
  ('Repair', 'repair', 'Diagnose and fix problems', 2),
  ('Mods & Tuning', 'mods-tuning', 'Performance upgrades, ECU tuning, aftermarket parts', 3),
  ('Detailing', 'detailing', 'Paint care, interior cleaning, ceramic coating', 4),
  ('Buying Advice', 'buying-advice', 'What car to buy, pricing, reliability', 5),
  ('DIY Guides', 'diy-guides', 'Step-by-step how-to tutorials', 6)
;
-- Source enum
create type post_source as enum ('user', 'scraped')
;
create type post_status as enum ('approved', 'pending', 'rejected')
;
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
)
;
create index idx_posts_category on public.posts(category_id)
;
create index idx_posts_status on public.posts(status)
;
create index idx_posts_vote_score on public.posts(vote_score desc)
;
create index idx_posts_created_at on public.posts(created_at desc)
;
create index idx_posts_title on public.posts using gin(to_tsvector('english', title))
;
-- Car tags
create table public.car_tags (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null
)
;
create table public.post_tags (
  post_id uuid references public.posts(id) on delete cascade,
  tag_id uuid references public.car_tags(id) on delete cascade,
  primary key (post_id, tag_id)
)
;
-- Comments
create table public.comments (
  id uuid default uuid_generate_v4() primary key,
  post_id uuid references public.posts(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  body text not null,
  vote_score int default 0,
  created_at timestamp with time zone default now()
)
;
create index idx_comments_post on public.comments(post_id, created_at)
;
-- Votes
create type vote_target as enum ('post', 'comment')
;
create type vote_direction as enum ('up', 'down')
;
create table public.votes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  target_type vote_target not null,
  target_id uuid not null,
  direction vote_direction not null,
  created_at timestamp with time zone default now(),
  unique(user_id, target_type, target_id)
)
;
-- Bookmarks
create table public.bookmarks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  post_id uuid references public.posts(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique(user_id, post_id)
)
;
-- Auto-create profile on user signup
;
return new
;
end
;
$$ language plpgsql security definer
;
after insert on auth.users
;
-- Update post comment_count when comments change
;
elsif (tg_op = 'DELETE') then
    update public.posts set comment_count = comment_count - 1 where id = old.post_id
;
return new
;
end
;
$$ language plpgsql
;
after insert or delete on public.comments;
