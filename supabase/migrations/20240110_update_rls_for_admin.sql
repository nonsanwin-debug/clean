-- Allow anonymous select for demo purposes or authenticated users
-- In a real production app, this should be strictly for 'admin' role.
-- For this MVP/Demo, we will allow 'anon' to select so the admin page works without complex auth setup yet.
create policy "Allow public to view requests"
on public.requests
for select
to anon
using (true);

create policy "Allow authenticated to view requests"
on public.requests
for select
to authenticated
using (true);
