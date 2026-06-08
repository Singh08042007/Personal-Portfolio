-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Create CONTACTS Table
create table if not exists public.contacts (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    email text not null,
    subject text,
    message text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for contacts
alter table public.contacts enable row level security;

-- RLS policies for contacts
drop policy if exists "Allow public to insert contacts" on public.contacts;
create policy "Allow public to insert contacts" on public.contacts
    for insert with check (true);

drop policy if exists "Allow authenticated admin to select contacts" on public.contacts;
create policy "Allow authenticated admin to select contacts" on public.contacts
    for select using (auth.role() = 'authenticated');

drop policy if exists "Allow authenticated admin to delete contacts" on public.contacts;
create policy "Allow authenticated admin to delete contacts" on public.contacts
    for delete using (auth.role() = 'authenticated');


-- 2. Create GALLERY Table
create table if not exists public.gallery (
    id uuid default gen_random_uuid() primary key,
    image_url text not null,
    title text not null,
    category text not null,
    description text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for gallery
alter table public.gallery enable row level security;

-- RLS policies for gallery
drop policy if exists "Allow public to select gallery" on public.gallery;
create policy "Allow public to select gallery" on public.gallery
    for select using (true);

drop policy if exists "Allow authenticated admin all on gallery" on public.gallery;
create policy "Allow authenticated admin all on gallery" on public.gallery
    for all using (auth.role() = 'authenticated');


-- 3. Create CERTIFICATIONS Table
create table if not exists public.certifications (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    issuer text not null,
    issue_date date not null,
    certificate_url text,
    image_url text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for certifications
alter table public.certifications enable row level security;

-- RLS policies for certifications
drop policy if exists "Allow public to select certifications" on public.certifications;
create policy "Allow public to select certifications" on public.certifications
    for select using (true);

drop policy if exists "Allow authenticated admin all on certifications" on public.certifications;
create policy "Allow authenticated admin all on certifications" on public.certifications
    for all using (auth.role() = 'authenticated');


-- 4. Create PROJECTS Table
create table if not exists public.projects (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    description text not null,
    tech_stack text[] not null,
    image_url text not null,
    live_url text,
    github_url text,
    featured boolean default false not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for projects
alter table public.projects enable row level security;

-- RLS policies for projects
drop policy if exists "Allow public to select projects" on public.projects;
create policy "Allow public to select projects" on public.projects
    for select using (true);

drop policy if exists "Allow authenticated admin all on projects" on public.projects;
create policy "Allow authenticated admin all on projects" on public.projects
    for all using (auth.role() = 'authenticated');


-- 5. Create ACHIEVEMENTS Table
create table if not exists public.achievements (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    description text not null,
    date date not null,
    image_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for achievements
alter table public.achievements enable row level security;

-- RLS policies for achievements
drop policy if exists "Allow public to select achievements" on public.achievements;
create policy "Allow public to select achievements" on public.achievements
    for select using (true);

drop policy if exists "Allow authenticated admin all on achievements" on public.achievements;
create policy "Allow authenticated admin all on achievements" on public.achievements
    for all using (auth.role() = 'authenticated');


-- 6. Create ANALYTICS Tables
-- Page Views
create table if not exists public.page_views (
    id uuid default gen_random_uuid() primary key,
    page_path text not null,
    visitor_id text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.page_views enable row level security;

drop policy if exists "Allow public to insert page views" on public.page_views;
create policy "Allow public to insert page views" on public.page_views
    for insert with check (true);

drop policy if exists "Allow authenticated admin to select page views" on public.page_views;
create policy "Allow authenticated admin to select page views" on public.page_views
    for select using (auth.role() = 'authenticated');

drop policy if exists "Allow authenticated admin to delete page views" on public.page_views;
create policy "Allow authenticated admin to delete page views" on public.page_views
    for delete using (auth.role() = 'authenticated');

-- Project Views
create table if not exists public.project_views (
    id uuid default gen_random_uuid() primary key,
    project_id uuid references public.projects(id) on delete cascade,
    visitor_id text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.project_views enable row level security;

drop policy if exists "Allow public to insert project views" on public.project_views;
create policy "Allow public to insert project views" on public.project_views
    for insert with check (true);

drop policy if exists "Allow authenticated admin to select project views" on public.project_views;
create policy "Allow authenticated admin to select project views" on public.project_views
    for select using (auth.role() = 'authenticated');

drop policy if exists "Allow authenticated admin to delete project views" on public.project_views;
create policy "Allow authenticated admin to delete project views" on public.project_views
    for delete using (auth.role() = 'authenticated');


-- 7. SETUP STORAGE BUCKETS
-- Insert buckets if they don't exist
insert into storage.buckets (id, name, public)
values 
  ('gallery-images', 'gallery-images', true),
  ('certificates', 'certificates', true)
on conflict (id) do nothing;

-- Storage RLS Policies for gallery-images bucket
drop policy if exists "Allow public read-only access to gallery-images" on storage.objects;
create policy "Allow public read-only access to gallery-images"
on storage.objects for select
using ( bucket_id = 'gallery-images' );

drop policy if exists "Allow authenticated admin full access to gallery-images" on storage.objects;
create policy "Allow authenticated admin full access to gallery-images"
on storage.objects for all
using ( bucket_id = 'gallery-images' and auth.role() = 'authenticated' )
with check ( bucket_id = 'gallery-images' and auth.role() = 'authenticated' );

-- Storage RLS Policies for certificates bucket
drop policy if exists "Allow public read-only access to certificates" on storage.objects;
create policy "Allow public read-only access to certificates"
on storage.objects for select
using ( bucket_id = 'certificates' );

drop policy if exists "Allow authenticated admin full access to certificates" on storage.objects;
create policy "Allow authenticated admin full access to certificates"
on storage.objects for all
using ( bucket_id = 'certificates' and auth.role() = 'authenticated' )
with check ( bucket_id = 'certificates' and auth.role() = 'authenticated' );


-- 8. Create TIMELINE Table
create table if not exists public.timeline (
    id uuid default gen_random_uuid() primary key,
    role text not null,
    company text not null,
    description text not null,
    order_index integer default 0 not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for timeline
alter table public.timeline enable row level security;

-- RLS policies for timeline
drop policy if exists "Allow public to select timeline" on public.timeline;
create policy "Allow public to select timeline" on public.timeline
    for select using (true);

drop policy if exists "Allow authenticated admin all on timeline" on public.timeline;
create policy "Allow authenticated admin all on timeline" on public.timeline
    for all using (auth.role() = 'authenticated');

-- Populate default timeline items
insert into public.timeline (role, company, description, order_index)
values
  ('Founder & CEO', 'Zanqir', 'Leading the development of AI-driven solutions and operational strategy.', 0),
  ('Campus Ambassador', 'Capgemini', 'Driving corporate-academic engagement and tech awareness.', 1),
  ('Associate Member', 'CodeZen', 'Contributing to community-driven coding excellence and projects.', 2),
  ('Professional Role', 'Wiztron', 'Strategic involvement in technical implementations and systems.', 3)
on conflict do nothing;


-- 9. Create PROFILE Table
create table if not exists public.profile (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    avatar_url text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for profile
alter table public.profile enable row level security;

-- RLS policies for profile
drop policy if exists "Allow public to select profile" on public.profile;
create policy "Allow public to select profile" on public.profile
    for select using (true);

drop policy if exists "Allow authenticated admin all on profile" on public.profile;
create policy "Allow authenticated admin all on profile" on public.profile
    for all using (auth.role() = 'authenticated');

-- Insert default profile row
insert into public.profile (name, avatar_url)
values (
  'Deepinder Singh',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBD7qPMu2tjuczyAR46HMu7L58vgIJCPl1yEG7rNDaHe8Abo-0onjjCDnpLwL5P2zXtXXiIYMeKKwzgzxfAcKpIWX81oRcmZmK9bfw2m1qxTsa0cMIuZahiZsL-vnTdY6ajUAXyKYPjiNpubiYKdkh4hau-x5yTOTkbOEbMPOummSdS_lDky--FLtANP_DrwSJ330ctVKyZco8h45iTgGeU2e-Ghdebo_v8PeYZt-KAydhBpNLhlAklc5dGRBvJBqhTHhfszcQMgfI'
)
on conflict do nothing;


