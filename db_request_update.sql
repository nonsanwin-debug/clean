-- 견적 요청 테이블에 '최대 견적 개수'와 '안심번호' 칸을 추가합니다.

-- 1. 최대 견적 개수 (기본 5개)
alter table public.requests 
add column if not exists max_quotes integer default 5;

-- 2. 안심번호 (0504-xxxx-xxxx)
alter table public.requests 
add column if not exists safe_number text;

-- 3. 안심번호 관리용 ID (나중에 해지할 때 필요)
alter table public.requests 
add column if not exists safe_number_id text;
