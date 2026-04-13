-- Add benefits column to partners table to store JSON array of benefits
alter table public.partners add column if not exists benefits jsonb default '[]'::jsonb;
