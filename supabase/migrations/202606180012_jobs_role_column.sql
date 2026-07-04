alter table public.jobs
  add column if not exists role text;

update public.jobs
set role = title
where role is null
  and title is not null;
