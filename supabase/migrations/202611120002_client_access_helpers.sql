create function public.invite_campaign_member(target_campaign uuid, invited_email text)
returns public.campaign_members
language plpgsql
security definer
set search_path = ''
as $$
declare
  invited_user_id uuid;
  created_member public.campaign_members%rowtype;
begin
  if (select auth.uid()) is null or not public.is_campaign_master(target_campaign) then
    raise exception 'campaign_not_available' using errcode = '42501';
  end if;

  select id into invited_user_id
  from auth.users
  where lower(email) = lower(trim(invited_email));
  if invited_user_id is null then
    raise exception 'user_not_found' using errcode = 'P0002';
  end if;

  insert into public.campaign_members (campaign_id, user_id, role)
  values (target_campaign, invited_user_id, 'player')
  returning * into created_member;

  return created_member;
end;
$$;

create function public.accepted_application_count(target_table uuid)
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  select count(*)::integer
  from public.table_applications as applications
  where applications.table_id = target_table
    and applications.status = 'accepted'
    and exists (
      select 1
      from public.public_tables as tables
      where tables.id = target_table
        and (
          tables.status = 'open'
          or tables.owner_id = (select auth.uid())
          or public.is_table_applicant(tables.id)
        )
    );
$$;

revoke all on function public.invite_campaign_member(uuid, text) from public;
grant execute on function public.invite_campaign_member(uuid, text) to authenticated;

revoke all on function public.accepted_application_count(uuid) from public;
grant execute on function public.accepted_application_count(uuid) to anon, authenticated;
