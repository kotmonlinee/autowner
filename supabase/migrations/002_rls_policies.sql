-- RLS policies: allow public read access to all content
-- Run this in Supabase SQL Editor

-- Enable RLS on all tables
alter table public.posts enable row level security;
alter table public.categories enable row level security;
alter table public.comments enable row level security;
alter table public.profiles enable row level security;
alter table public.car_tags enable row level security;
alter table public.post_tags enable row level security;
alter table public.votes enable row level security;
alter table public.bookmarks enable row level security;

-- Public read access
create policy "Anyone can read categories" on public.categories for select using (true);
create policy "Anyone can read approved posts" on public.posts for select using (status = 'approved');
create policy "Anyone can read comments" on public.comments for select using (true);
create policy "Anyone can read profiles" on public.profiles for select using (true);
create policy "Anyone can read car_tags" on public.car_tags for select using (true);
create policy "Anyone can read post_tags" on public.post_tags for select using (true);

-- Authenticated write access
create policy "Authenticated users can create posts" on public.posts for insert with check (auth.uid() = author_id);
create policy "Authors can update their posts" on public.posts for update using (auth.uid() = author_id);
create policy "Authenticated users can create comments" on public.comments for insert with check (auth.uid() = author_id);
create policy "Authenticated users can manage votes" on public.votes for insert with check (auth.uid() = user_id);
create policy "Authenticated users can update votes" on public.votes for update using (auth.uid() = user_id);
create policy "Authenticated users can delete votes" on public.votes for delete using (auth.uid() = user_id);
create policy "Authenticated users can manage bookmarks" on public.bookmarks for insert with check (auth.uid() = user_id);
create policy "Authenticated users can delete bookmarks" on public.bookmarks for delete using (auth.uid() = user_id);
create policy "Authenticated users can manage car_tags" on public.car_tags for insert with check (true);
create policy "Authenticated users can manage post_tags" on public.post_tags for insert with check (true);
