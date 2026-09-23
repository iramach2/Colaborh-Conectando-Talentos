-- Preserve one custom assessment per questionnaire/template instead of
-- overwriting the previous custom assessment for the same application.

alter table public.application_assessments
  add column if not exists assessment_key text;

update public.application_assessments
set assessment_key = case
  when assessment_type = 'custom' then coalesce(
    nullif(result ->> 'templateId', ''),
    'legacy-' || id::text
  )
  else 'default'
end
where assessment_key is null or btrim(assessment_key) = '';

alter table public.application_assessments
  alter column assessment_key set default 'default',
  alter column assessment_key set not null;

do $$
declare
  constraint_row record;
begin
  for constraint_row in
    select conname
    from pg_constraint
    where conrelid = 'public.application_assessments'::regclass
      and contype = 'u'
      and pg_get_constraintdef(oid) = 'UNIQUE (application_id, assessment_type)'
  loop
    execute format(
      'alter table public.application_assessments drop constraint %I',
      constraint_row.conname
    );
  end loop;

  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.application_assessments'::regclass
      and conname = 'application_assessments_application_type_key_unique'
  ) then
    alter table public.application_assessments
      add constraint application_assessments_application_type_key_unique
      unique (application_id, assessment_type, assessment_key);
  end if;
end
$$;

create index if not exists idx_application_assessments_custom_key
  on public.application_assessments(application_id, assessment_key)
  where assessment_type = 'custom';

drop function if exists public.list_candidate_assessments(text);

create function public.list_candidate_assessments(candidate_email_input text)
returns table(
  id uuid,
  application_id uuid,
  assessment_type text,
  assessment_key text,
  status text,
  responses jsonb,
  result jsonb,
  requested_at timestamptz,
  completed_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select
    aa.id,
    aa.application_id,
    aa.assessment_type,
    aa.assessment_key,
    aa.status,
    aa.responses,
    aa.result,
    aa.requested_at,
    aa.completed_at
  from public.application_assessments aa
  join public.applications a on a.id = aa.application_id
  where (
    a.candidate_user_id = auth.uid()
    or lower(a.candidate_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    or lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    or lower(aa.candidate_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    or (
      lower(trim(candidate_email_input)) = lower(coalesce(auth.jwt() ->> 'email', ''))
      and (
        lower(a.candidate_email) = lower(trim(candidate_email_input))
        or lower(a.email) = lower(trim(candidate_email_input))
        or lower(aa.candidate_email) = lower(trim(candidate_email_input))
      )
    )
  )
  order by aa.requested_at desc, aa.completed_at desc nulls last;
$$;

revoke all on function public.list_candidate_assessments(text) from public;
grant execute on function public.list_candidate_assessments(text) to authenticated;
