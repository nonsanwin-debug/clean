-- 1. 파트너 테이블이 아예 없다면 새로 만듭니다.
create table if not exists public.partners (
  id uuid not null default gen_random_uuid(),
  created_at timestamp with time zone not null default now(),
  status text not null default 'pending',
  name text not null,
  phone text not null,
  area text not null,
  experience text not null,
  primary key (id)
);

-- 2. 이제 이메일, 비밀번호 등 필요한 칸(컬럼)을 확실하게 뚫습니다.
alter table public.partners 
add column if not exists email text,
add column if not exists password text,
add column if not exists provider text default 'email',
add column if not exists categories text[] default '{}',
add column if not exists services text[] default '{}';

-- 3. 누구나(비로그인) 파트너 정보를 볼 수 있게 허용 (로그인 체크용)
alter table public.partners enable row level security;

drop policy if exists "Allow public to view partners" on public.partners;
create policy "Allow public to view partners" on public.partners for select to anon using (true);

drop policy if exists "Allow authenticated to view partners" on public.partners;
create policy "Allow authenticated to view partners" on public.partners for select to authenticated using (true);

drop policy if exists "Allow public to insert partners" on public.partners;
create policy "Allow public to insert partners" on public.partners for insert to anon with check (true);