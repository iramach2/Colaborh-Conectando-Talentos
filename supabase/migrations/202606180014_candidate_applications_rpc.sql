create or replace function public.list_candidate_applications(candidate_email_input text)
returns setof public.applications
language sql
security definer
set search_path = public
as $$
  select a.*
  from public.applications a
  where (
    a.candidate_user_id = auth.uid()
    or lower(a.candidate_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    or lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    or (
      lower(trim(candidate_email_input)) = lower(coalesce(auth.jwt() ->> 'email', ''))
      and (
        lower(a.candidate_email) = lower(trim(candidate_email_input))
        or lower(a.email) = lower(trim(candidate_email_input))
      )
    )
  )
  order by a.created_at desc;
$$;

create or replace function public.list_candidate_assessments(candidate_email_input text)
returns table(
  application_id uuid,
  assessment_type text,
  status text,
  responses jsonb,
  result jsonb,
  completed_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select
    aa.application_id,
    aa.assessment_type,
    aa.status,
    aa.responses,
    aa.result,
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
  order by aa.completed_at desc nulls last;
$$;

revoke all on function public.list_candidate_applications(text) from public;
revoke all on function public.list_candidate_assessments(text) from public;
grant execute on function public.list_candidate_applications(text) to authenticated;
grant execute on function public.list_candidate_assessments(text) to authenticated;
