create function public.delete_finished_sessions(target_sessions uuid[])
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  target public.game_sessions%rowtype;
  target_campaign_id uuid;
  locked_count integer := 0;
  deleted_count integer;
  unique_count integer;
begin
  if (select auth.uid()) is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  if target_sessions is null
    or cardinality(target_sessions) < 1
    or cardinality(target_sessions) > 50
    or array_position(target_sessions, null) is not null then
    raise exception 'invalid_session_selection' using errcode = '22023';
  end if;

  select count(distinct requested.session_id)
  into unique_count
  from unnest(target_sessions) as requested(session_id);
  if unique_count <> cardinality(target_sessions) then
    raise exception 'invalid_session_selection' using errcode = '22023';
  end if;

  for target in
    select gs.*
    from public.game_sessions as gs
    where gs.id = any(target_sessions)
    order by gs.id
    for update
  loop
    locked_count := locked_count + 1;
    if target_campaign_id is null then
      target_campaign_id := target.campaign_id;
    elsif target.campaign_id <> target_campaign_id then
      raise exception 'sessions_must_share_campaign' using errcode = '22023';
    end if;
    if target.status <> 'finished' then
      raise exception 'session_not_finished' using errcode = '22023';
    end if;
  end loop;

  if locked_count <> cardinality(target_sessions)
    or public.is_campaign_master(target_campaign_id) is not true then
    raise exception 'session_not_available' using errcode = '42501';
  end if;

  delete from public.game_sessions
  where id = any(target_sessions)
    and campaign_id = target_campaign_id
    and status = 'finished';
  get diagnostics deleted_count = row_count;
  if deleted_count <> cardinality(target_sessions) then
    raise exception 'session_not_available' using errcode = '42501';
  end if;
end;
$$;

revoke all on function public.delete_finished_sessions(uuid[]) from public;
grant execute on function public.delete_finished_sessions(uuid[]) to authenticated;
