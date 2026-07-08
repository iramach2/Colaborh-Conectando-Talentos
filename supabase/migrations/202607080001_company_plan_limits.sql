-- Enforce Colaborh commercial plan limits at database level.
-- Frontend checks improve UX, but these triggers protect direct API/RPC access.

alter table public.companies alter column credits set default 0;

update public.companies
set credits = case
  when plan = 'enterprise' then 999999
  when plan = 'growth' then least(greatest(coalesce(credits, 15), 0), 15)
  else 0
end;

create or replace function public.company_plan_limits(company_plan text)
returns table(
  can_use_assessments boolean,
  can_use_interviews boolean,
  can_use_direct_messages boolean,
  custom_questionnaire_limit integer,
  monthly_assessment_limit integer
)
language sql
stable
set search_path = public
as $$
  select
    case when company_plan in ('growth', 'enterprise') then true else false end,
    case when company_plan in ('growth', 'enterprise') then true else false end,
    case when company_plan in ('growth', 'enterprise') then true else false end,
    case when company_plan = 'enterprise' then 2147483647 when company_plan = 'growth' then 3 else 0 end,
    case when company_plan = 'enterprise' then 2147483647 when company_plan = 'growth' then 15 else 0 end;
$$;

create or replace function public.company_for_job(target_job_id uuid, target_company_name text default null)
returns public.companies
language plpgsql
stable
set search_path = public
as $$
declare
  result public.companies;
begin
  select c.*
    into result
  from public.jobs j
  join public.companies c on c.id = j.company_id
  where j.id = target_job_id
  limit 1;

  if result.id is not null then
    return result;
  end if;

  if target_company_name is not null then
    select c.*
      into result
    from public.jobs j
    join public.companies c on lower(c.trade_name) = lower(j.company_name)
    where j.id = target_job_id
       or lower(j.company_name) = lower(target_company_name)
    limit 1;
  end if;

  return result;
end;
$$;

create or replace function public.company_for_application(target_application_id uuid)
returns public.companies
language plpgsql
stable
set search_path = public
as $$
declare
  result public.companies;
begin
  select c.*
    into result
  from public.applications a
  join public.jobs j on j.id = a.job_id
  join public.companies c on c.id = j.company_id
  where a.id = target_application_id
  limit 1;

  if result.id is not null then
    return result;
  end if;

  select c.*
    into result
  from public.applications a
  join public.jobs j on j.id = a.job_id
  join public.companies c on lower(c.trade_name) = lower(j.company_name)
  where a.id = target_application_id
  limit 1;

  return result;
end;
$$;

create or replace function public.enforce_company_questionnaire_plan()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  company_row public.companies;
  limits record;
  existing_count integer;
begin
  select * into company_row from public.companies where id = new.company_id;

  if company_row.id is null then
    raise exception 'Empresa nao encontrada para este questionario.' using errcode = '23503';
  end if;

  select * into limits from public.company_plan_limits(company_row.plan);

  if not limits.can_use_assessments then
    raise exception 'Criacao de testes personalizados nao disponivel no plano gratuito.' using errcode = '42501';
  end if;

  if tg_op = 'INSERT' then
    select count(*) into existing_count
    from public.custom_questionnaires
    where company_id = new.company_id;
  else
    select count(*) into existing_count
    from public.custom_questionnaires
    where company_id = new.company_id
      and id <> new.id;
  end if;

  if existing_count >= limits.custom_questionnaire_limit then
    raise exception 'Limite de testes personalizados atingido para este plano.' using errcode = '42501';
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_company_questionnaire_plan_trigger on public.custom_questionnaires;
create trigger enforce_company_questionnaire_plan_trigger
before insert or update on public.custom_questionnaires
for each row execute function public.enforce_company_questionnaire_plan();

create or replace function public.enforce_application_assessment_plan()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  company_row public.companies;
  limits record;
  used_this_month integer;
  request_is_new boolean;
begin
  request_is_new := new.status = 'pending' and (tg_op = 'INSERT' or coalesce(old.status, '') <> 'pending');

  if not request_is_new then
    return new;
  end if;

  select * into company_row from public.company_for_application(new.application_id);

  if company_row.id is null then
    raise exception 'Empresa nao encontrada para a candidatura deste teste.' using errcode = '23503';
  end if;

  select * into limits from public.company_plan_limits(company_row.plan);

  if not limits.can_use_assessments then
    raise exception 'Envio de testes nao disponivel no plano gratuito.' using errcode = '42501';
  end if;

  select count(*) into used_this_month
  from public.application_assessments aa
  join public.applications a on a.id = aa.application_id
  join public.jobs j on j.id = a.job_id
  left join public.companies c on c.id = j.company_id
  left join public.companies c_name on lower(c_name.trade_name) = lower(j.company_name)
  where coalesce(c.id, c_name.id) = company_row.id
    and aa.status in ('pending', 'completed')
    and aa.requested_at >= date_trunc('month', now())
    and aa.requested_at < date_trunc('month', now()) + interval '1 month'
    and (tg_op <> 'UPDATE' or aa.id <> new.id);

  if used_this_month >= limits.monthly_assessment_limit then
    raise exception 'Limite mensal de envio de testes atingido para este plano.' using errcode = '42501';
  end if;

  if company_row.plan = 'growth' then
    update public.companies
    set credits = greatest(0, 15 - used_this_month - 1),
        updated_at = now()
    where id = company_row.id;
  elsif company_row.plan = 'enterprise' then
    update public.companies
    set credits = 999999,
        updated_at = now()
    where id = company_row.id;
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_application_assessment_plan_trigger on public.application_assessments;
create trigger enforce_application_assessment_plan_trigger
before insert or update on public.application_assessments
for each row execute function public.enforce_application_assessment_plan();

create or replace function public.enforce_company_messages_plan()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  company_row public.companies;
  limits record;
begin
  if new.sender_type <> 'company' then
    return new;
  end if;

  select * into company_row from public.company_for_application(new.application_id);

  if company_row.id is null then
    raise exception 'Empresa nao encontrada para esta mensagem.' using errcode = '23503';
  end if;

  select * into limits from public.company_plan_limits(company_row.plan);

  if not limits.can_use_direct_messages then
    raise exception 'Mensagens diretas nao disponiveis no plano gratuito.' using errcode = '42501';
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_company_messages_plan_trigger on public.messages;
create trigger enforce_company_messages_plan_trigger
before insert on public.messages
for each row execute function public.enforce_company_messages_plan();

create or replace function public.enforce_company_interviews_plan()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  company_row public.companies;
  limits record;
begin
  select * into company_row from public.company_for_job(new.job_id, new.company_name);

  if company_row.id is null then
    raise exception 'Empresa nao encontrada para esta entrevista.' using errcode = '23503';
  end if;

  select * into limits from public.company_plan_limits(company_row.plan);

  if not limits.can_use_interviews then
    raise exception 'Sistema de entrevistas nao disponivel no plano gratuito.' using errcode = '42501';
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_company_interviews_plan_trigger on public.interviews;
create trigger enforce_company_interviews_plan_trigger
before insert on public.interviews
for each row execute function public.enforce_company_interviews_plan();

create or replace function public.enforce_stage_tests_plan()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  company_row public.companies;
  limits record;
begin
  select * into company_row from public.company_for_job(new.job_id, null);

  if company_row.id is null then
    raise exception 'Empresa nao encontrada para a etapa da vaga.' using errcode = '23503';
  end if;

  select * into limits from public.company_plan_limits(company_row.plan);

  if not limits.can_use_assessments then
    raise exception 'Configuracao de testes por etapa nao disponivel no plano gratuito.' using errcode = '42501';
  end if;

  if coalesce(new.trigger_mode, 'auto') <> 'auto' then
    raise exception 'Testes configurados por etapa devem usar envio automatico.' using errcode = '22023';
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_stage_tests_plan_trigger on public.job_stage_tests;
create trigger enforce_stage_tests_plan_trigger
before insert or update on public.job_stage_tests
for each row execute function public.enforce_stage_tests_plan();

