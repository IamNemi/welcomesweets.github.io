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
  sort_order int default 0
);

-- 3. Enable Row Level Security (RLS) but allow public read
alter table categories enable row level security;
alter table menu_items enable row level security;

-- Public can read everything
create policy "Public read categories" on categories for select using (true);
create policy "Public read menu_items" on menu_items for select using (true);

-- Anyone with the anon key can insert/update/delete (admin panel)
create policy "Admin insert categories" on categories for insert with check (true);
create policy "Admin update categories" on categories for update using (true);
create policy "Admin delete categories" on categories for delete using (true);

create policy "Admin insert menu_items" on menu_items for insert with check (true);
create policy "Admin update menu_items" on menu_items for update using (true);
create policy "Admin delete menu_items" on menu_items for delete using (true);

-- 4. Create storage bucket for menu images
insert into storage.buckets (id, name, public) values ('menu-images', 'menu-images', true)
on conflict (id) do nothing;

-- Allow public read on the bucket
create policy "Public read storage" on storage.objects
  for select using (bucket_id = 'menu-images');

-- Allow anyone with anon key to upload
create policy "Admin upload storage" on storage.objects
  for insert with check (bucket_id = 'menu-images');

-- Allow anyone with anon key to delete
create policy "Admin delete storage" on storage.objects
  for delete using (bucket_id = 'menu-images');

-- 5. Seed some default categories
insert into categories (name, sort_order) values
  ('Traditional Sweets', 1),
  ('Savory Snacks (Farsan)', 2)
on conflict do nothing;