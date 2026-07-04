alter table public.talents enable row level security;

alter table public.talents add column if not exists user_id uuid references auth.users(id) on delete set null;
alter table public.talents add column if not exists email text;
alter table public.talents add column if not exists role text;

create index if not exists idx_talents_user_id on public.talents(user_id);
create index if not exists idx_talents_email_lower on public.talents(lower(email));
create index if not exists idx_talents_role_lower on public.talents(lower(role));

drop policy if exists talents_candidate_select_own on public.talents;
drop policy if exists talents_candidate_insert_own on public.talents;
drop policy if exists talents_candidate_update_own on public.talents;
drop policy if exists talents_company_select_bank on public.talents;

create policy talents_candidate_select_own on public.talents
  for select
  using (
    user_id = auth.uid()
    or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

create policy talents_company_select_bank on public.talents
  for select
  using (
    coalesce(lower(role), '') <> 'empresa'
    and exists (
      select 1
      from public.companies c
      where c.owner_user_id = auth.uid()
    )
  );

create policy talents_candidate_insert_own on public.talents
  for insert
  with check (
    auth.role() = 'authenticated'
    and coalesce(lower(role), '') <> 'empresa'
    and (
      user_id = auth.uid()
      or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
  );

create policy talents_candidate_update_own on public.talents
  for update
  using (
    user_id = auth.uid()
    or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  )
  with check (
    coalesce(lower(role), '') <> 'empresa'
    and (
      user_id = auth.uid()
      or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
  );
