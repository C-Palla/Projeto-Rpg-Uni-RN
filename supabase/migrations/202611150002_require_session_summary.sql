create function public.require_nonempty_session_summary()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.status <> 'finished'
    and new.status = 'finished'
    and nullif(trim(new.master_summary), '') is null then
    raise exception 'session_summary_required' using errcode = '22023';
  end if;
  return new;
end;
$$;

create trigger require_session_summary_before_finish
  before update of status, master_summary on public.game_sessions
  for each row execute function public.require_nonempty_session_summary();
