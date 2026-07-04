create or replace function public.check_candidate_registration_conflict(
  candidate_email text,
  candidate_phone text
)
returns table(email_exists boolean, phone_exists boolean)
language sql
security definer
set search_path = public, auth
as $$
  select
    exists (
      select 1
      from public.talents t
      where lower(trim(t.email)) = lower(trim(candidate_email))
    )
    or exists (
      select 1
      from auth.users u
      where lower(trim(u.email)) = lower(trim(candidate_email))
    ) as email_exists,
    exists (
      select 1
      from public.talents t
      where regexp_replace(coalesce(t.phone, ''), '\D', '', 'g') <> ''
        and regexp_replace(coalesce(t.phone, ''), '\D', '', 'g') = regexp_replace(coalesce(candidate_phone, ''), '\D', '', 'g')
    ) as phone_exists;
$$;

revoke all on function public.check_candidate_registration_conflict(text, text) from public;
grant execute on function public.check_candidate_registration_conflict(text, text) to anon, authenticated;
