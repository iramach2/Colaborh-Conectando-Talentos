alter table public.interviews add column if not exists transcript text;
alter table public.interviews add column if not exists ai_report text;
alter table public.interviews add column if not exists ai_report_json jsonb;
alter table public.interviews add column if not exists transcript_status text not null default 'not_started';
alter table public.interviews add column if not exists transcript_generated_at timestamptz;
alter table public.interviews add column if not exists ai_report_generated_at timestamptz;

create index if not exists idx_interviews_transcript_status on public.interviews(transcript_status);