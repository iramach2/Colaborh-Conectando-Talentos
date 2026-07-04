create or replace function public.send_application_message(
  target_application_id text,
  sender_type_input text,
  message_input text
)
returns table(
  id text,
  application_id text,
  sender_type text,
  sender_name text,
  content text,
  message text,
  read boolean,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  clean_message text := nullif(trim(message_input), '');
  application_column_type text;
begin
  if auth.role() <> 'authenticated' then
    raise exception 'not authenticated' using errcode = '42501';
  end if;

  if sender_type_input not in ('candidate', 'company') then
    raise exception 'invalid sender type' using errcode = '22023';
  end if;

  if clean_message is null then
    raise exception 'message cannot be empty' using errcode = '22023';
  end if;

  if not exists (
    select 1
    from public.applications a
    left join public.jobs j on j.id = a.job_id
    left join public.companies c on c.id = j.company_id
    left join public.companies c_name on lower(c_name.trade_name) = lower(j.company_name)
    where a.id::text = target_application_id
      and (
        (
          sender_type_input = 'candidate'
          and (
            a.candidate_user_id = auth.uid()
            or lower(a.candidate_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
            or lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
          )
        )
        or (
          sender_type_input = 'company'
          and (c.owner_user_id = auth.uid() or c_name.owner_user_id = auth.uid())
        )
      )
  ) then
    raise exception 'message access denied' using errcode = '42501';
  end if;

  select format_type(a.atttypid, a.atttypmod)
    into application_column_type
  from pg_attribute a
  where a.attrelid = 'public.messages'::regclass
    and a.attname = 'application_id'
    and not a.attisdropped;

  if application_column_type = 'uuid' then
    return query
      insert into public.messages (application_id, sender_type, content, message, read)
      values (target_application_id::uuid, sender_type_input, clean_message, clean_message, false)
      returning
        messages.id::text,
        messages.application_id::text,
        messages.sender_type,
        messages.sender_name,
        messages.content,
        messages.message,
        messages.read,
        messages.created_at;
  else
    return query
      insert into public.messages (application_id, sender_type, content, message, read)
      values (target_application_id, sender_type_input, clean_message, clean_message, false)
      returning
        messages.id::text,
        messages.application_id::text,
        messages.sender_type,
        messages.sender_name,
        messages.content,
        messages.message,
        messages.read,
        messages.created_at;
  end if;
end;
$$;

drop function if exists public.send_application_message(uuid, text, text);
revoke all on function public.send_application_message(text, text, text) from public;
grant execute on function public.send_application_message(text, text, text) to authenticated;
