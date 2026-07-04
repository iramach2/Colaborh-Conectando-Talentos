create extension if not exists pgcrypto;

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references public.applications(id) on delete cascade,
  sender_type text,
  sender_name text,
  content text,
  message text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.interviews (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references public.jobs(id) on delete cascade,
  candidate_email text,
  company_name text,
  date_time timestamptz,
  scheduled_at timestamptz,
  status text not null default 'scheduled',
  room_name text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id text,
  user_type text,
  title text,
  message text,
  job_id uuid references public.jobs(id) on delete cascade,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

do $$
begin
  if to_regclass('public.messages') is not null then
    alter table public.messages enable row level security;
    alter table public.messages add column if not exists application_id uuid;
    alter table public.messages add column if not exists sender_type text;
    alter table public.messages add column if not exists content text;
    alter table public.messages add column if not exists message text;
  end if;

  if to_regclass('public.interviews') is not null then
    alter table public.interviews enable row level security;
    alter table public.interviews add column if not exists job_id uuid;
    alter table public.interviews add column if not exists candidate_email text;
  end if;

  if to_regclass('public.notifications') is not null then
    alter table public.notifications enable row level security;
    alter table public.notifications add column if not exists user_id text;
    alter table public.notifications add column if not exists user_type text;
    alter table public.notifications add column if not exists job_id uuid;
  end if;
end $$;

create index if not exists idx_messages_application_id on public.messages(application_id);
create index if not exists idx_interviews_job_id on public.interviews(job_id);
create index if not exists idx_interviews_candidate_email_lower on public.interviews(lower(candidate_email));
create index if not exists idx_notifications_user_lookup on public.notifications(lower(user_id), user_type);
create index if not exists idx_notifications_job_id on public.notifications(job_id);

drop policy if exists messages_related_access on public.messages;
create policy messages_related_access on public.messages
  for all
  using (
    exists (
      select 1
      from public.applications a
      left join public.jobs j on j.id = a.job_id
      left join public.companies c on c.id = j.company_id
      left join public.companies c_name on lower(c_name.trade_name) = lower(j.company_name)
      where a.id::text = messages.application_id::text
        and (
          a.candidate_user_id = auth.uid()
          or lower(a.candidate_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
          or lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
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
      where a.id::text = messages.application_id::text
        and (
          (
            messages.sender_type = 'candidate'
            and (
              a.candidate_user_id = auth.uid()
              or lower(a.candidate_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
              or lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
            )
          )
          or (
            messages.sender_type = 'company'
            and (c.owner_user_id = auth.uid() or c_name.owner_user_id = auth.uid())
          )
        )
    )
  );

drop policy if exists interviews_related_select on public.interviews;
drop policy if exists interviews_company_write on public.interviews;

create policy interviews_related_select on public.interviews
  for select
  using (
    lower(candidate_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    or exists (
      select 1
      from public.jobs j
      left join public.companies c on c.id = j.company_id
      left join public.companies c_name on lower(c_name.trade_name) = lower(j.company_name)
      where j.id::text = interviews.job_id::text
        and (c.owner_user_id = auth.uid() or c_name.owner_user_id = auth.uid())
    )
  );

create policy interviews_company_write on public.interviews
  for all
  using (
    exists (
      select 1
      from public.jobs j
      left join public.companies c on c.id = j.company_id
      left join public.companies c_name on lower(c_name.trade_name) = lower(j.company_name)
      where j.id::text = interviews.job_id::text
        and (c.owner_user_id = auth.uid() or c_name.owner_user_id = auth.uid())
    )
  )
  with check (
    exists (
      select 1
      from public.jobs j
      left join public.companies c on c.id = j.company_id
      left join public.companies c_name on lower(c_name.trade_name) = lower(j.company_name)
      where j.id::text = interviews.job_id::text
        and (c.owner_user_id = auth.uid() or c_name.owner_user_id = auth.uid())
    )
  );

drop policy if exists notifications_related_access on public.notifications;
drop policy if exists notifications_related_select on public.notifications;
drop policy if exists notifications_related_update on public.notifications;
drop policy if exists notifications_related_delete on public.notifications;
drop policy if exists notifications_insert_related on public.notifications;

create policy notifications_related_select on public.notifications
  for select
  using (
    lower(user_id) = lower(coalesce(auth.jwt() ->> 'email', ''))
    or exists (
      select 1
      from public.jobs j
      left join public.companies c on c.id = j.company_id
      left join public.companies c_name on lower(c_name.trade_name) = lower(j.company_name)
      where j.id::text = notifications.job_id::text
        and (c.owner_user_id = auth.uid() or c_name.owner_user_id = auth.uid())
    )
  );

create policy notifications_related_update on public.notifications
  for update
  using (
    lower(user_id) = lower(coalesce(auth.jwt() ->> 'email', ''))
    or exists (
      select 1
      from public.jobs j
      left join public.companies c on c.id = j.company_id
      left join public.companies c_name on lower(c_name.trade_name) = lower(j.company_name)
      where j.id::text = notifications.job_id::text
        and (c.owner_user_id = auth.uid() or c_name.owner_user_id = auth.uid())
    )
  )
  with check (
    lower(user_id) = lower(coalesce(auth.jwt() ->> 'email', ''))
    or exists (
      select 1
      from public.jobs j
      left join public.companies c on c.id = j.company_id
      left join public.companies c_name on lower(c_name.trade_name) = lower(j.company_name)
      where j.id::text = notifications.job_id::text
        and (c.owner_user_id = auth.uid() or c_name.owner_user_id = auth.uid())
    )
  );

create policy notifications_related_delete on public.notifications
  for delete
  using (
    lower(user_id) = lower(coalesce(auth.jwt() ->> 'email', ''))
    or exists (
      select 1
      from public.jobs j
      left join public.companies c on c.id = j.company_id
      left join public.companies c_name on lower(c_name.trade_name) = lower(j.company_name)
      where j.id::text = notifications.job_id::text
        and (c.owner_user_id = auth.uid() or c_name.owner_user_id = auth.uid())
    )
  );

create policy notifications_insert_related on public.notifications
  for insert
  with check (
    auth.role() = 'authenticated'
    and (
      lower(user_id) = lower(coalesce(auth.jwt() ->> 'email', ''))
      or exists (
        select 1
        from public.jobs j
        left join public.companies c on c.id = j.company_id
        left join public.companies c_name on lower(c_name.trade_name) = lower(j.company_name)
        where j.id::text = notifications.job_id::text
          and (c.owner_user_id = auth.uid() or c_name.owner_user_id = auth.uid())
      )
      or (notifications.user_type = 'company' and notifications.job_id is not null)
    )
  );
