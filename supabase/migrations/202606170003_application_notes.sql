create table if not exists public.application_notes (
  application_id uuid primary key references public.applications(id) on delete cascade,
  notes text not null default '',
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.application_notes enable row level security;

drop policy if exists application_notes_company_access on public.application_notes;

create policy application_notes_company_access on public.application_notes
  for all
  using (
    exists (
      select 1
      from public.applications a
      left join public.jobs j on j.id = a.job_id
      left join public.companies c on c.id = j.company_id
      left join public.companies c_name on lower(c_name.trade_name) = lower(j.company_name)
      where a.id = application_notes.application_id
        and (
          c.owner_user_id = auth.uid()
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
      where a.id = application_notes.application_id
        and (
          c.owner_user_id = auth.uid()
          or c_name.owner_user_id = auth.uid()
        )
    )
  );

create index if not exists idx_application_notes_updated_by on public.application_notes(updated_by);
