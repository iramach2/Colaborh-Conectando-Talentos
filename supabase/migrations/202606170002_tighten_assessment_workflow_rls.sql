-- Tighten workflow and assessment RLS after the additive foundation migration.
-- This keeps public reads for job workflow metadata, but restricts writes to
-- company owners and assessment access to the related company or candidate.

create index if not exists idx_companies_owner_user_id on public.companies(owner_user_id);
create index if not exists idx_companies_trade_name_lower on public.companies(lower(trade_name));
create index if not exists idx_job_stages_job_id on public.job_stages(job_id);
create index if not exists idx_job_stage_tests_job_id on public.job_stage_tests(job_id);
create index if not exists idx_application_assessments_application_id on public.application_assessments(application_id);
create index if not exists idx_application_assessments_candidate_email_lower on public.application_assessments(lower(candidate_email));

do $$
begin
  if to_regclass('public.applications') is not null then
    alter table public.applications add column if not exists candidate_email text;
    alter table public.applications add column if not exists candidate_user_id uuid references auth.users(id) on delete set null;
  end if;

  if to_regclass('public.jobs') is not null then
    alter table public.jobs add column if not exists company_id uuid references public.companies(id) on delete set null;
    alter table public.jobs add column if not exists company_name text;
  end if;
end $$;

drop policy if exists application_assessments_authenticated_dual_write on public.application_assessments;
drop policy if exists job_stages_authenticated_write on public.job_stages;
drop policy if exists job_stage_tests_authenticated_write on public.job_stage_tests;

create policy application_assessments_related_access on public.application_assessments
  for all
  using (
    exists (
      select 1
      from public.applications a
      left join public.jobs j on j.id = a.job_id
      left join public.companies c on c.id = j.company_id
      left join public.companies c_name on lower(c_name.trade_name) = lower(j.company_name)
      where a.id = application_assessments.application_id
        and (
          a.candidate_user_id = auth.uid()
          or lower(a.candidate_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
          or c.owner_user_id = auth.uid()
          or c_name.owner_user_id = auth.uid()
        )
    )
  )
  with check (
    exists (
      select 1
      from public.applications a
      left join public.jobs j on j.id = a.job_id
      left join public.companies c on c.id = j.company_id
      left join public.companies c_name on lower(c_name.trade_name) = lower(j.company_name)
      where a.id = application_assessments.application_id
        and (
          a.candidate_user_id = auth.uid()
          or lower(a.candidate_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
          or c.owner_user_id = auth.uid()
          or c_name.owner_user_id = auth.uid()
        )
    )
  );

create policy job_stages_company_owner_write on public.job_stages
  for all
  using (
    exists (
      select 1
      from public.jobs j
      left join public.companies c on c.id = j.company_id
      left join public.companies c_name on lower(c_name.trade_name) = lower(j.company_name)
      where j.id = job_stages.job_id
        and (c.owner_user_id = auth.uid() or c_name.owner_user_id = auth.uid())
    )
  )
  with check (
    exists (
      select 1
      from public.jobs j
      left join public.companies c on c.id = j.company_id
      left join public.companies c_name on lower(c_name.trade_name) = lower(j.company_name)
      where j.id = job_stages.job_id
        and (c.owner_user_id = auth.uid() or c_name.owner_user_id = auth.uid())
    )
  );

create policy job_stage_tests_company_owner_write on public.job_stage_tests
  for all
  using (
    exists (
      select 1
      from public.jobs j
      left join public.companies c on c.id = j.company_id
      left join public.companies c_name on lower(c_name.trade_name) = lower(j.company_name)
      where j.id = job_stage_tests.job_id
        and (c.owner_user_id = auth.uid() or c_name.owner_user_id = auth.uid())
    )
  )
  with check (
    exists (
      select 1
      from public.jobs j
      left join public.companies c on c.id = j.company_id
      left join public.companies c_name on lower(c_name.trade_name) = lower(j.company_name)
      where j.id = job_stage_tests.job_id
        and (c.owner_user_id = auth.uid() or c_name.owner_user_id = auth.uid())
    )
  );
