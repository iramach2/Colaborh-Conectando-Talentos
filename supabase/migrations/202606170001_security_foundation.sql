-- Security and data-model foundation for Colaborh.
-- This migration is intentionally additive so it can be applied before the
-- frontend is fully refactored away from serialized text fields.

create extension if not exists pgcrypto;

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references auth.users(id) on delete set null,
  legal_name text,
  trade_name text not null,
  contact_name text,
  industry text,
  logo_url text,
  plan text not null default 'starter' check (plan in ('starter', 'growth', 'enterprise')),
  credits integer not null default 5 check (credits >= 0),
  saved_talents text[] not null default array[]::text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.companies add column if not exists contact_name text;
alter table public.companies add column if not exists logo_url text;
alter table public.companies add column if not exists saved_talents text[] not null default array[]::text[];

create table if not exists public.job_stages (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null,
  name text not null,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  unique (job_id, name)
);

create table if not exists public.job_stage_tests (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null,
  stage_name text not null,
  test_key text not null check (test_key in ('disc', 'questions', 'mbti', 'temperamentos', 'custom')),
  trigger_mode text not null default 'manual' check (trigger_mode in ('manual', 'auto')),
  created_at timestamptz not null default now(),
  unique (job_id, stage_name, test_key)
);

create table if not exists public.application_assessments (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null,
  candidate_email text,
  assessment_type text not null check (
    assessment_type in ('disc', 'questions', 'mbti', 'temperamentos', 'custom')
  ),
  status text not null default 'pending' check (status in ('pending', 'completed', 'cancelled')),
  requested_by uuid references auth.users(id) on delete set null,
  requested_at timestamptz not null default now(),
  completed_at timestamptz,
  responses jsonb not null default '{}'::jsonb,
  result jsonb not null default '{}'::jsonb,
  unique (application_id, assessment_type)
);

create table if not exists public.custom_questionnaires (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete cascade,
  job_id uuid,
  title text not null,
  questions jsonb not null default '[]'::jsonb,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.companies enable row level security;
alter table public.job_stages enable row level security;
alter table public.job_stage_tests enable row level security;
alter table public.application_assessments enable row level security;
alter table public.custom_questionnaires enable row level security;

do $$
begin
  if to_regclass('public.talents') is not null then
    alter table public.talents enable row level security;
    alter table public.talents add column if not exists user_id uuid references auth.users(id) on delete set null;
  end if;

  if to_regclass('public.jobs') is not null then
    alter table public.jobs enable row level security;
    alter table public.jobs add column if not exists company_id uuid references public.companies(id) on delete set null;
  end if;

  if to_regclass('public.applications') is not null then
    alter table public.applications enable row level security;
    alter table public.applications add column if not exists candidate_user_id uuid references auth.users(id) on delete set null;
  end if;

  if to_regclass('public.messages') is not null then
    alter table public.messages enable row level security;
  end if;

  if to_regclass('public.interviews') is not null then
    alter table public.interviews enable row level security;
  end if;

  if to_regclass('public.notifications') is not null then
    alter table public.notifications enable row level security;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'companies' and policyname = 'companies_select_own'
  ) then
    create policy companies_select_own on public.companies
      for select
      using (owner_user_id = auth.uid());
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'companies' and policyname = 'companies_write_own'
  ) then
    create policy companies_write_own on public.companies
      for all
      using (owner_user_id = auth.uid())
      with check (owner_user_id = auth.uid());
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'custom_questionnaires' and policyname = 'custom_questionnaires_company_owner'
  ) then
    create policy custom_questionnaires_company_owner on public.custom_questionnaires
      for all
      using (
        exists (
          select 1 from public.companies c
          where c.id = custom_questionnaires.company_id
            and c.owner_user_id = auth.uid()
        )
      )
      with check (
        exists (
          select 1 from public.companies c
          where c.id = custom_questionnaires.company_id
            and c.owner_user_id = auth.uid()
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'application_assessments' and policyname = 'application_assessments_authenticated_dual_write'
  ) then
    -- Temporary compatibility policy for the frontend dual-write phase.
    -- Tighten this after applications/jobs have reliable candidate_user_id/company_id ownership.
    create policy application_assessments_authenticated_dual_write on public.application_assessments
      for all
      using (auth.role() = 'authenticated')
      with check (auth.role() = 'authenticated');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'job_stages' and policyname = 'job_stages_public_read'
  ) then
    create policy job_stages_public_read on public.job_stages
      for select
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'job_stages' and policyname = 'job_stages_authenticated_write'
  ) then
    create policy job_stages_authenticated_write on public.job_stages
      for all
      using (auth.role() = 'authenticated')
      with check (auth.role() = 'authenticated');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'job_stage_tests' and policyname = 'job_stage_tests_public_read'
  ) then
    create policy job_stage_tests_public_read on public.job_stage_tests
      for select
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'job_stage_tests' and policyname = 'job_stage_tests_authenticated_write'
  ) then
    create policy job_stage_tests_authenticated_write on public.job_stage_tests
      for all
      using (auth.role() = 'authenticated')
      with check (auth.role() = 'authenticated');
  end if;
end $$;
