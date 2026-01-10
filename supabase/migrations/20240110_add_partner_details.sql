-- Add new columns for detailed partner registration
alter table public.partners 
add column if not exists categories text[] default '{}',
add column if not exists services text[] default '{}';

-- Optional: If we want to store services as JSONB for more flexibility later
-- alter table public.partners add column if not exists services_json jsonb default '[]';
-- For now, text arrays are simple and sufficient for the requirements.
