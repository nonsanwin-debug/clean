-- 이 코드를 Supabase SQL Editor에 복사해서 실행하세요 (Run 버튼)

-- 1. requests 테이블에 누락된 상세 정보 컬럼들 추가
alter table public.requests
add column if not exists building_type text,
add column if not exists room_count text,
add column if not exists bathroom_count text,
add column if not exists veranda_count text,
add column if not exists features text[],
add column if not exists extra_services text[],
add column if not exists date_type text,
add column if not exists status text default 'pending';

-- 2. 누구나 견적 요청을 넣을 수 있도록 보안 정책 업데이트
drop policy if exists "Enable insert for everyone" on public.requests;
create policy "Enable insert for everyone" on public.requests for insert with check (true);

-- 3. 파트너가 요청을 볼 수 있도록 정책 추가 (혹시 누락되었을 경우를 대비)
drop policy if exists "Enable select for everyone" on public.requests;
create policy "Enable select for everyone" on public.requests for select using (true);
