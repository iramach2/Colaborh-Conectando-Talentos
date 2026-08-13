-- Restore talent-bank access for authenticated company accounts, including
-- legacy companies whose owner_user_id was not populated when they were created.

create or replace function public.is_company_account()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select
    auth.uid() is not null
    and (
      exists (
        select 1
        from public.companies company
        where company.owner_user_id = auth.uid()
      )
      or lower(coalesce(auth.jwt() -> 'user_metadata' ->> 'role', '')) in ('company', 'empresa')
      or lower(coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '')) in ('company', 'empresa')
    );
$$;

revoke all on function public.is_company_account() from public;
grant execute on function public.is_company_account() to authenticated;

drop policy if exists talents_company_select_bank on public.talents;

create policy talents_company_select_bank on public.talents
  for select
  to authenticated
  using (
    coalesce(lower(role), '') not in ('empresa', 'company')
    and public.is_company_account()
  );
