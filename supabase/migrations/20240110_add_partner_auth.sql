-- Add authentication columns to partners table
alter table public.partners 
add column if not exists email text,
add column if not exists password text,
add column if not exists provider text default 'email';
