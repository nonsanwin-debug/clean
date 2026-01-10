-- Create quotes table to store partner bids
create table if not exists public.quotes (
  id uuid not null default gen_random_uuid(),
  created_at timestamp with time zone not null default now(),
  request_id uuid not null references public.requests(id) on delete cascade,
  partner_id uuid references public.partners(id), -- Optional: Link to partner if exists
  price integer not null,
  message text,
  status text default 'sent', -- sent, accepted, rejected
  constraint quotes_pkey primary key (id)
);

-- Enable RLS
alter table public.quotes enable row level security;

-- Policies for quotes
-- 1. Allow public insertion (for demo partner dashboard)
create policy "Allow public to insert quotes"
on public.quotes for insert to anon with check (true);

-- 2. Allow public view (for now)
create policy "Allow public to select quotes"
on public.quotes for select to anon using (true);
