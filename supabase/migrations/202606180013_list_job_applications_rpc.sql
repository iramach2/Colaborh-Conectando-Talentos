create or replace function public.list_job_applications(target_job_id uuid)
returns setof public.applications
language sql
security definer
set search_path = public
as $$
  select a.*
  from public.applications a
  where a.job_id = target_job_id
    and exists (
      select 1
      from public.jobs j
      left join public.companies c on c.id = j.company_id
      left join public.companies c_name on lower(c_name.trade_name) = lower(j.company_name)
      where j.id = a.job_id
        and (
          c.owner_user_id = auth.uid()
          or c_name.owner_user_id = auth.uid()
        )
    )
  order by a.created_at desc;
$$;

revoke all on function public.list_job_applications(uuid) from public;
grant execute on function public.list_job_applications(uuid) to authenticated;
