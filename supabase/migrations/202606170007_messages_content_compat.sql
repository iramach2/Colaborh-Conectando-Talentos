alter table public.messages add column if not exists content text;
alter table public.messages add column if not exists message text;

update public.messages
set content = message
where content is null
  and message is not null;

update public.messages
set message = content
where message is null
  and content is not null;
