create or replace function public.check_candidate_registration_conflict(
  candidate_email text,
  candidate_phone text
)
returns table(email_exists boolean, phone_exists boolean)
language sql
security definer
set search_path = public
as $$
  select
    exists (
      select 1
      from public.talents t
      where lower(trim(t.email)) = lower(trim(candidate_email))
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

do $$
begin
  if not exists (
    select 1
    from pg_indexes
    where schemaname = 'public'
      and indexname = 'idx_talents_email_unique_lower_candidate'
  ) then
    if not exists (
      select lower(trim(email))
      from public.talents
      where coalesce(lower(role), '') <> 'empresa'
        and nullif(trim(email), '') is not null
      group by lower(trim(email))
      having count(*) > 1
    ) then
      create unique index idx_talents_email_unique_lower_candidate
        on public.talents (lower(trim(email)))
        where coalesce(lower(role), '') <> 'empresa'
          and nullif(trim(email), '') is not null;
    else
      raise notice 'Skipped unique candidate email index because duplicate talent emails already exist.';
    end if;
  end if;

  if not exists (
    select 1
    from pg_indexes
    where schemaname = 'public'
      and indexname = 'idx_talents_phone_unique_digits_candidate'
  ) then
    if not exists (
      select regexp_replace(coalesce(phone, ''), '\D', '', 'g')
      from public.talents
      where coalesce(lower(role), '') <> 'empresa'
        and regexp_replace(coalesce(phone, ''), '\D', '', 'g') <> ''
      group by regexp_replace(coalesce(phone, ''), '\D', '', 'g')
      having count(*) > 1
    ) then
      create unique index idx_talents_phone_unique_digits_candidate
        on public.talents (regexp_replace(coalesce(phone, ''), '\D', '', 'g'))
        where coalesce(lower(role), '') <> 'empresa'
          and regexp_replace(coalesce(phone, ''), '\D', '', 'g') <> '';
    else
      raise notice 'Skipped unique candidate phone index because duplicate talent phones already exist.';
    end if;
  end if;
end $$;
