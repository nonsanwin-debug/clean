-- Add detailed columns to requests table
alter table public.requests
add column if not exists building_type text,
add column if not exists room_count text,
add column if not exists bathroom_count text,
add column if not exists veranda_count text,
add column if not exists features text[],
add column if not exists extra_services text[],
add column if not exists date_type text,
add column if not exists status text default 'pending';

-- Update RLS if needed (usually 'true' for public insert is enough, but good to ensure)
-- Ensuring policies exist
drop policy if exists "Enable insert for everyone" on public.requests;
create policy "Enable insert for everyone" on public.requests for insert with check (true);

drop policy if exists "Enable select for everyone" on public.requests;
create policy "Enable select for everyone" on public.requests for select using (true);
