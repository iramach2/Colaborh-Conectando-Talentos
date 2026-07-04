create or replace function public.list_active_jobs()
returns setof public.jobs
language sql
security definer
set search_path = public
as $$
  select *
  from public.jobs
  where lower(coalesce(status, '')) in ('', 'active', 'ativa')
  order by created_at desc;
$$;

revoke all on function public.list_active_jobs() from public;
grant execute on function public.list_active_jobs() to anon, authenticated;
