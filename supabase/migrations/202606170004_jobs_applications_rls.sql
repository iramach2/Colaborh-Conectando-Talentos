alter table public.jobs enable row level security;
alter table public.applications enable row level security;

alter table public.applications add column if not exists candidate_email text;
alter table public.applications add column if not exists email text;
alter table public.applications add column if not exists candidate_user_id uuid references auth.users(id) on delete set null;
alter table public.jobs add column if not exists company_id uuid references public.companies(id) on delete set null;
alter table public.jobs add column if not exists company_name text;

create index if not exists idx_jobs_company_id on public.jobs(company_id);
create index if not exists idx_jobs_company_name_lower on public.jobs(lower(company_name));
create index if not exists idx_applications_job_id on public.applications(job_id);
create index if not exists idx_applications_candidate_user_id on public.applications(candidate_user_id);
create index if not exists idx_applications_candidate_email_lower on public.applications(lower(candidate_email));
create index if not exists idx_applications_email_lower on public.applications(lower(email));

drop policy if exists jobs_public_read on public.jobs;
drop policy if exists jobs_company_owner_insert on public.jobs;
drop policy if exists jobs_company_owner_update on public.jobs;
drop policy if exists jobs_company_owner_delete on public.jobs;

create policy jobs_public_read on public.jobs
  for select
  using (true);

create policy jobs_company_owner_insert on public.jobs
  for insert
  with check (
    exists (
      select 1
      from public.companies c
      where (
        c.id = jobs.company_id
        or lower(c.trade_name) = lower(jobs.company_name)
      )
      and c.owner_user_id = auth.uid()
    )
  );

create policy jobs_company_owner_update on public.jobs
  for update
  using (
    exists (
      select 1
      from public.companies c
      where (
        c.id = jobs.company_id
        or lower(c.trade_name) = lower(jobs.company_name)
      )
      and c.owner_user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.companies c
      where (
        c.id = jobs.company_id
        or lower(c.trade_name) = lower(jobs.company_name)
      )
      and c.owner_user_id = auth.uid()
    )
  );

create policy jobs_company_owner_delete on public.jobs
  for delete
  using (
    exists (
      select 1
      from public.companies c
      where (
        c.id = jobs.company_id
        or lower(c.trade_name) = lower(jobs.company_name)
      )
      and c.owner_user_id = auth.uid()
    )
  );

drop policy if exists applications_related_select on public.applications;
drop policy if exists applications_candidate_insert on public.applications;
drop policy if exists applications_related_update on public.applications;
drop policy if exists applications_company_delete on public.applications;

create policy applications_related_select on public.applications
  for select
  using (
    candidate_user_id = auth.uid()
    or lower(candidate_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    or exists (
      select 1
      from public.jobs j
      left join public.companies c on c.id = j.company_id
      left join public.companies c_name on lower(c_name.trade_name) = lower(j.company_name)
      where j.id = applications.job_id
        and (c.owner_user_id = auth.uid() or c_name.owner_user_id = auth.uid())
    )
  );

create policy applications_candidate_insert on public.applications
  for insert
  with check (
    auth.role() = 'authenticated'
    and (
      candidate_user_id = auth.uid()
      or lower(candidate_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
  );

create policy applications_related_update on public.applications
  for update
  using (
    candidate_user_id = auth.uid()
    or lower(candidate_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    or exists (
      select 1
      from public.jobs j
      left join public.companies c on c.id = j.company_id
      left join public.companies c_name on lower(c_name.trade_name) = lower(j.company_name)
      where j.id = applications.job_id
        and (c.owner_user_id = auth.uid() or c_name.owner_user_id = auth.uid())
    )
  )
  with check (
    candidate_user_id = auth.uid()
    or lower(candidate_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    or exists (
      select 1
      from public.jobs j
      left join public.companies c on c.id = j.company_id
      left join public.companies c_name on lower(c_name.trade_name) = lower(j.company_name)
      where j.id = applications.job_id
        and (c.owner_user_id = auth.uid() or c_name.owner_user_id = auth.uid())
    )
  );

create policy applications_company_delete on public.applications
  for delete
  using (
    exists (
      select 1
      from public.jobs j
      left join public.companies c on c.id = j.company_id
      left join public.companies c_name on lower(c_name.trade_name) = lower(j.company_name)
      where j.id = applications.job_id
        and (c.owner_user_id = auth.uid() or c_name.owner_user_id = auth.uid())
    )
  );
