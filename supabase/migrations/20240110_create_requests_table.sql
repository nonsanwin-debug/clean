create table if not exists public.requests (
  id uuid not null default gen_random_uuid(),
  created_at timestamp with time zone not null default now(),
  status text not null default 'pending', -- pending, contacted, completed
  service_type text not null, -- move_in, residence, commercial
  sq_ft text,
  target_date date,
  location text not null,
  description text,
  customer_name text not null,
  customer_phone text not null,
  
  constraint requests_pkey primary key (id)
);

-- Set up Row Level Security (RLS)
alter table public.requests enable row level security;

-- Create policy to allow inserts from anon/authenticated users (so anyone can request a quote)
-- But only admins (not defined here yet) should be able to view them.
-- For now, we allow insert for anon.
create policy "Allow public to insert requests"
on public.requests
for insert
to anon
with check (true);

-- Allow authenticated users (if any) to insert
create policy "Allow authenticated to insert requests"
on public.requests
for insert
to authenticated
with check (true);
