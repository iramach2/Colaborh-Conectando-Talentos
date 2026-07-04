alter table public.jobs enable row level security;

drop policy if exists jobs_public_read on public.jobs;

create policy jobs_public_read on public.jobs
  for select
  using (true);
