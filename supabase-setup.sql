-- =====================================================
-- Welcome Sweets — Supabase Setup
-- Run this in: Supabase Dashboard > SQL Editor > New query
-- =====================================================

-- 1. Categories table
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sort_order int default 0
);

-- 2. Menu items table
create table if not exists menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete cascade,
  name text not null,
  description text default '',
  price text default '',
  image_url text default '',
  sort_order int default 0,
  popular boolean default false
);

-- 3. Enable Row Level Security (RLS)
alter table categories enable row level security;
alter table menu_items enable row level security;

-- Public can read everything (for the website)
create policy "Public read categories" on categories for select using (true);
create policy "Public read menu_items" on menu_items for select using (true);

-- Only authenticated users can write (for the admin panel)
create policy "Auth insert categories" on categories
  for insert with check (auth.role() = 'authenticated');
create policy "Auth update categories" on categories
  for update using (auth.role() = 'authenticated');
create policy "Auth delete categories" on categories
  for delete using (auth.role() = 'authenticated');

create policy "Auth insert menu_items" on menu_items
  for insert with check (auth.role() = 'authenticated');
create policy "Auth update menu_items" on menu_items
  for update using (auth.role() = 'authenticated');
create policy "Auth delete menu_items" on menu_items
  for delete using (auth.role() = 'authenticated');

-- 4. Create storage bucket for menu images
insert into storage.buckets (id, name, public) values ('menu-images', 'menu-images', true)
on conflict (id) do nothing;

-- Allow public read on the bucket
create policy "Public read storage" on storage.objects
  for select using (bucket_id = 'menu-images');

-- Only authenticated users can upload/delete images
create policy "Auth upload storage" on storage.objects
  for insert with check (bucket_id = 'menu-images' and auth.role() = 'authenticated');

create policy "Auth delete storage" on storage.objects
  for delete using (bucket_id = 'menu-images' and auth.role() = 'authenticated');

-- 5. Seed some default categories
insert into categories (name, sort_order) values
  ('Traditional Sweets', 1),
  ('Savory Snacks (Farsan)', 2)
on conflict do nothing;