-- Create partners table
create table if not exists public.partners (
  id uuid not null default gen_random_uuid(),
  created_at timestamp with time zone not null default now(),
  status text not null default 'pending', -- pending, approved, rejected
  name text not null,
  phone text not null,
  area text not null,
  experience text not null,
  
  constraint partners_pkey primary key (id)
);

-- Enable RLS
alter table public.partners enable row level security;

-- Policies
-- 1. Allow public to insert (apply)
create policy "Allow public to insert partners"
on public.partners for insert to anon with check (true);

-- 2. Allow public/anon to view (for demo admin dashboard)
create policy "Allow public to view partners"
on public.partners for select to anon using (true);

-- 3. Allow public/anon to update (for demo admin dashboard approval)
create policy "Allow public to update partners"
on public.partners for update to anon using (true);
