create function public.enforce_character_campaign_limit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  campaign_owner uuid;
begin
  if new.campaign_id is null then
    return new;
  end if;
  if tg_op = 'UPDATE'
    and new.campaign_id is not distinct from old.campaign_id
    and new.owner_id is not distinct from old.owner_id then
    return new;
  end if;

  select campaigns.owner_id
  into campaign_owner
  from public.campaigns
  where id = new.campaign_id
  for update;
  if not found then
    raise exception 'campaign_not_available' using errcode = '42501';
  end if;

  if campaign_owner <> new.owner_id and exists (
    select 1
    from public.characters
    where campaign_id = new.campaign_id
      and owner_id = new.owner_id
      and id is distinct from new.id
  ) then
    raise exception 'campaign_character_limit' using errcode = '23514';
  end if;

  return new;
end;
$$;

create trigger enforce_character_campaign_limit
  before insert or update on public.characters
  for each row execute function public.enforce_character_campaign_limit();

create or replace function public.unlink_campaign_characters(
  target_campaign uuid,
  target_characters uuid[]
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  target public.characters%rowtype;
  campaign_owner uuid;
  is_master boolean;
  locked_count integer := 0;
  updated_count integer;
  unique_count integer;
begin
  if (select auth.uid()) is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  if target_characters is null
    or cardinality(target_characters) < 1
    or cardinality(target_characters) > 50
    or array_position(target_characters, null) is not null then
    raise exception 'invalid_character_selection' using errcode = '22023';
  end if;

  select count(distinct requested.character_id)
  into unique_count
  from unnest(target_characters) as requested(character_id);
  if unique_count <> cardinality(target_characters) then
    raise exception 'invalid_character_selection' using errcode = '22023';
  end if;

  select campaigns.owner_id
  into campaign_owner
  from public.campaigns
  where id = target_campaign
  for update;
  if not found then
    raise exception 'campaign_not_available' using errcode = '42501';
  end if;

  is_master := campaign_owner = (select auth.uid());
  if not is_master and not public.is_campaign_member(target_campaign) then
    raise exception 'campaign_not_available' using errcode = '42501';
  end if;

  for target in
    select characters.*
    from public.characters
    where id = any(target_characters)
    order by id
    for update
  loop
    locked_count := locked_count + 1;
    if target.campaign_id is distinct from target_campaign then
      raise exception 'character_not_in_campaign' using errcode = '22023';
    end if;
    if not is_master and target.owner_id <> (select auth.uid()) then
      raise exception 'character_not_owned' using errcode = '42501';
    end if;
  end loop;

  if locked_count <> cardinality(target_characters) then
    raise exception 'character_not_in_campaign' using errcode = '22023';
  end if;

  update public.characters
  set campaign_id = null, updated_at = now()
  where id = any(target_characters)
    and campaign_id = target_campaign;
  get diagnostics updated_count = row_count;
  if updated_count <> cardinality(target_characters) then
    raise exception 'character_not_in_campaign' using errcode = '22023';
  end if;
end;
$$;

revoke all on function public.unlink_campaign_characters(uuid, uuid[]) from public;
grant execute on function public.unlink_campaign_characters(uuid, uuid[]) to authenticated;
