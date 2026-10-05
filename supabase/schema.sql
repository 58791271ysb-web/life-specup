-- 인생 스펙업 v11 Cloud Save schema
create table if not exists public.life_specup_saves (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.life_specup_saves enable row level security;
revoke all on table public.life_specup_saves from anon, authenticated;
grant select, insert, update, delete on table public.life_specup_saves to authenticated;
drop policy if exists "life_specup_select_own" on public.life_specup_saves;
drop policy if exists "life_specup_insert_own" on public.life_specup_saves;
drop policy if exists "life_specup_update_own" on public.life_specup_saves;
drop policy if exists "life_specup_delete_own" on public.life_specup_saves;
create policy "life_specup_select_own" on public.life_specup_saves for select to authenticated using ((select auth.uid()) = user_id);
create policy "life_specup_insert_own" on public.life_specup_saves for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "life_specup_update_own" on public.life_specup_saves for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "life_specup_delete_own" on public.life_specup_saves for delete to authenticated using ((select auth.uid()) = user_id);
create index if not exists life_specup_saves_user_idx on public.life_specup_saves(user_id);
