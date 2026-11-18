create function public.update_character_resources(
  target_character uuid,
  new_hp integer,
  new_pe integer,
  new_san integer
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_character public.characters%rowtype;
  active_session public.game_sessions%rowtype;
  character_campaign_id uuid;
  resource record;
  maximum_value text;
  previous_value text;
  updated_fields jsonb;
  has_changes boolean := false;
begin
  if (select auth.uid()) is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;
  if new_hp is null or new_pe is null or new_san is null
    or new_hp < 0 or new_pe < 0 or new_san < 0 then
    raise exception 'invalid_character_resources' using errcode = '22023';
  end if;

  select * into current_character
  from public.characters
  where id = target_character;
  if not found then
    raise exception 'character_not_available' using errcode = '42501';
  end if;
  if current_character.system <> 'ordem' then
    raise exception 'character_resources_not_supported' using errcode = '22023';
  end if;
  if current_character.campaign_id is null then
    if current_character.owner_id <> (select auth.uid()) then
      raise exception 'character_not_available' using errcode = '42501';
    end if;
  elsif not public.is_campaign_member(current_character.campaign_id)
    or (
      current_character.owner_id <> (select auth.uid())
      and not public.is_campaign_master(current_character.campaign_id)
    ) then
    raise exception 'character_not_available' using errcode = '42501';
  end if;

  character_campaign_id := current_character.campaign_id;
  if character_campaign_id is not null then
    perform 1 from public.campaigns
    where id = character_campaign_id
    for update;
    if not found or not public.is_campaign_member(character_campaign_id) then
      raise exception 'character_not_available' using errcode = '42501';
    end if;
    select * into active_session
    from public.game_sessions
    where campaign_id = character_campaign_id and status = 'active'
    for update;
  end if;

  select * into current_character
  from public.characters
  where id = target_character
  for update;
  if not found or current_character.campaign_id is distinct from character_campaign_id then
    raise exception 'character_not_available' using errcode = '42501';
  end if;
  if current_character.campaign_id is null then
    if current_character.owner_id <> (select auth.uid()) then
      raise exception 'character_not_available' using errcode = '42501';
    end if;
  elsif current_character.owner_id <> (select auth.uid())
    and not public.is_campaign_master(current_character.campaign_id) then
    raise exception 'character_not_available' using errcode = '42501';
  end if;

  updated_fields := current_character.fields;
  for resource in
    select * from (values
      ('PV atual', 'PV máximo', 'Pontos de vida', new_hp),
      ('PE atual', 'PE máximo', 'Pontos de esforço', new_pe),
      ('SAN atual', 'SAN máxima', 'Sanidade', new_san)
    ) as resources(field_key, maximum_key, label, amount)
  loop
    maximum_value := current_character.fields ->> resource.maximum_key;
    if maximum_value is null or maximum_value !~ '^[0-9]{1,9}$'
      or resource.amount > maximum_value::numeric then
      raise exception 'invalid_character_resources' using errcode = '22023';
    end if;

    previous_value := coalesce(current_character.fields ->> resource.field_key, '—');
    if previous_value is distinct from resource.amount::text then
      updated_fields := jsonb_set(
        updated_fields,
        array[resource.field_key],
        to_jsonb(resource.amount::text),
        true
      );
      has_changes := true;

      if active_session.id is not null then
        insert into public.session_events (
          session_id, character_id, author_id, field_name, value_before, value_after, created_at
        ) values (
          active_session.id, target_character, (select auth.uid()), resource.label,
          previous_value, resource.amount::text, clock_timestamp()
        );
      end if;
    end if;
  end loop;

  if has_changes then
    update public.characters
    set fields = updated_fields, updated_at = now()
    where id = target_character;
  end if;
end;
$$;

revoke all on function public.update_character_resources(uuid, integer, integer, integer) from public;
grant execute on function public.update_character_resources(uuid, integer, integer, integer) to authenticated;
