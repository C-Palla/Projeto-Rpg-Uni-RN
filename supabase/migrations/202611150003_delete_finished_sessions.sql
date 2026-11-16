create function public.delete_finished_session(target_session uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  target public.game_sessions%rowtype;
begin
  if (select auth.uid()) is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  select * into target
  from public.game_sessions
  where id = target_session
  for update;
  if not found or not public.is_campaign_master(target.campaign_id) then
    raise exception 'session_not_available' using errcode = '42501';
  end if;
  if target.status <> 'finished' then
    raise exception 'session_not_finished' using errcode = '22023';
  end if;

  delete from public.game_sessions where id = target.id;
end;
$$;

revoke all on function public.delete_finished_session(uuid) from public;
grant execute on function public.delete_finished_session(uuid) to authenticated;

drop policy if exists "Masters can delete sessions" on public.game_sessions;
create policy "Masters can delete finished sessions"
  on public.game_sessions for delete to authenticated
  using (status = 'finished' and public.is_campaign_master(campaign_id));
