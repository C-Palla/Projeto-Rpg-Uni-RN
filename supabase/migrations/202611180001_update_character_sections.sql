create or replace function public.update_character_section(
  target_character uuid,
  section_name text,
  section_value jsonb
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_character public.characters%rowtype;
  updated_fields jsonb;
  updated_notes text;
  section_key text;
  previous_inventory jsonb;
  updated_inventory jsonb;
  previous_items jsonb;
  updated_items jsonb;
  active_session_id uuid;
  item_entry jsonb;
  previous_item jsonb;
  item_category text;
  item_id text;
  item_name text;
  item_type text;
  item_quantity text;
  item_summary text;
  previous_summary text;
  field_value jsonb;
  field_text text;
  item_limit jsonb;
  required_field text;
begin
  if (select auth.uid()) is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;
  if section_name is null
    or section_name not in ('abilities', 'rituals', 'inventory', 'description')
    or section_value is null
    or octet_length(section_value::text) > 200000 then
    raise exception 'invalid_character_section' using errcode = '22023';
  end if;

  select * into current_character
  from public.characters
  where id = target_character
  for update;
  if not found or current_character.system <> 'ordem' then
    raise exception 'character_not_available' using errcode = '42501';
  end if;
  if current_character.owner_id <> (select auth.uid())
    and (
      current_character.campaign_id is null
      or not public.is_campaign_member(current_character.campaign_id)
      or not public.is_campaign_master(current_character.campaign_id)
    ) then
    raise exception 'character_not_available' using errcode = '42501';
  end if;

  updated_fields := current_character.fields;
  updated_notes := current_character.notes;
  if section_name in ('abilities', 'rituals') then
    if jsonb_typeof(section_value) is distinct from 'array' then
      raise exception 'invalid_character_section' using errcode = '22023';
    end if;
    if jsonb_array_length(section_value) > 100 then
      raise exception 'invalid_character_section' using errcode = '22023';
    end if;
    section_key := case when section_name = 'abilities' then 'Habilidades' else 'Rituais' end;

    for item_entry in select value from jsonb_array_elements(section_value)
    loop
      if jsonb_typeof(item_entry) <> 'object'
        or jsonb_typeof(item_entry -> 'id') is distinct from 'string'
        or coalesce(item_entry ->> 'id', '') = ''
        or char_length(item_entry ->> 'id') > 80
        or jsonb_typeof(item_entry -> 'name') is distinct from 'string'
        or coalesce(item_entry ->> 'name', '') = ''
        or char_length(item_entry ->> 'name') > 100 then
        raise exception 'invalid_character_section' using errcode = '22023';
      end if;
      if section_name = 'abilities' then
        if jsonb_typeof(item_entry -> 'category') is distinct from 'string'
          or jsonb_typeof(item_entry -> 'description') is distinct from 'string'
          or char_length(coalesce(item_entry ->> 'category', '')) > 60
          or char_length(coalesce(item_entry ->> 'description', '')) > 3000 then
          raise exception 'invalid_character_section' using errcode = '22023';
        end if;
      elsif jsonb_typeof(item_entry -> 'circle') is distinct from 'number'
        or coalesce(item_entry ->> 'circle', '') !~ '^[1-4]$'
        or jsonb_typeof(item_entry -> 'element') is distinct from 'string'
        or jsonb_typeof(item_entry -> 'execution') is distinct from 'string'
        or jsonb_typeof(item_entry -> 'range') is distinct from 'string'
        or jsonb_typeof(item_entry -> 'target') is distinct from 'string'
        or jsonb_typeof(item_entry -> 'duration') is distinct from 'string'
        or jsonb_typeof(item_entry -> 'resistance') is distinct from 'string'
        or jsonb_typeof(item_entry -> 'description') is distinct from 'string'
        or char_length(coalesce(item_entry ->> 'element', '')) > 60
        or char_length(coalesce(item_entry ->> 'execution', '')) > 80
        or char_length(coalesce(item_entry ->> 'range', '')) > 80
        or char_length(coalesce(item_entry ->> 'target', '')) > 120
        or char_length(coalesce(item_entry ->> 'duration', '')) > 80
        or char_length(coalesce(item_entry ->> 'resistance', '')) > 120
        or char_length(coalesce(item_entry ->> 'description', '')) > 3000 then
        raise exception 'invalid_character_section' using errcode = '22023';
      end if;
    end loop;

    if (
      select count(*) <> count(distinct value ->> 'id')
      from jsonb_array_elements(section_value)
    ) then
      raise exception 'invalid_character_section' using errcode = '22023';
    end if;
    updated_fields := jsonb_set(updated_fields, array[section_key], section_value, true);
  elsif section_name = 'description' then
    if jsonb_typeof(section_value) is distinct from 'object'
      or jsonb_typeof(section_value -> 'notes') is distinct from 'string'
      or char_length(section_value ->> 'notes') > 5000 then
      raise exception 'invalid_character_section' using errcode = '22023';
    end if;
    updated_notes := section_value ->> 'notes';
    for required_field in
      select unnest(array['appearance', 'personality', 'history', 'objective'])
    loop
      field_text := coalesce(section_value ->> required_field, '');
      if char_length(field_text) > 2000 then
        raise exception 'invalid_character_section' using errcode = '22023';
      end if;
    end loop;
    updated_fields := jsonb_set(updated_fields, '{Aparência}', to_jsonb(coalesce(section_value ->> 'appearance', '')), true);
    updated_fields := jsonb_set(updated_fields, '{Personalidade}', to_jsonb(coalesce(section_value ->> 'personality', '')), true);
    updated_fields := jsonb_set(updated_fields, '{Histórico}', to_jsonb(coalesce(section_value ->> 'history', '')), true);
    updated_fields := jsonb_set(updated_fields, '{Objetivo}', to_jsonb(coalesce(section_value ->> 'objective', '')), true);
  else
    if jsonb_typeof(section_value) is distinct from 'object'
      or jsonb_typeof(section_value -> 'rank') is distinct from 'string'
      or char_length(section_value ->> 'rank') > 80
      or jsonb_typeof(section_value -> 'creditLimit') is distinct from 'string'
      or char_length(section_value ->> 'creditLimit') > 80
      or coalesce(section_value ->> 'capacity', '') !~ '^[0-9]{1,4}$'
      or case
        when coalesce(section_value ->> 'capacity', '') ~ '^[0-9]{1,4}$'
        then (section_value ->> 'capacity')::integer > 9999
        else false
      end
      or jsonb_typeof(section_value -> 'itemLimits') is distinct from 'object' then
      raise exception 'invalid_character_section' using errcode = '22023';
    end if;
    field_value := section_value -> 'prestige';
    if field_value is not null and jsonb_typeof(field_value) <> 'null' then
      if jsonb_typeof(field_value) <> 'number' or field_value::text !~ '^[0-9]{1,6}$' then
        raise exception 'invalid_character_section' using errcode = '22023';
      end if;
      if (field_value::text)::integer > 999999 then
        raise exception 'invalid_character_section' using errcode = '22023';
      end if;
    end if;
    foreach item_category in array array['0', 'I', 'II', 'III', 'IV']
    loop
      item_limit := section_value -> 'itemLimits' -> item_category;
      if item_limit is null or jsonb_typeof(item_limit) = 'null' then
        continue;
      end if;
      if jsonb_typeof(item_limit) <> 'number' or item_limit::text !~ '^[0-9]{1,3}$' then
        raise exception 'invalid_character_section' using errcode = '22023';
      end if;
      if (item_limit::text)::integer > 999 then
        raise exception 'invalid_character_section' using errcode = '22023';
      end if;
    end loop;

    previous_inventory := current_character.fields -> 'Inventário';
    if previous_inventory is null or jsonb_typeof(previous_inventory) is distinct from 'object' then
      previous_inventory := '{}'::jsonb;
    end if;
    previous_items := previous_inventory -> 'items';
    if previous_items is null or jsonb_typeof(previous_items) is distinct from 'array' then
      previous_items := '[]'::jsonb;
    end if;
    updated_items := case
      when section_value ? 'items' then section_value -> 'items'
      else previous_items
    end;
    if jsonb_typeof(updated_items) is distinct from 'array' then
      raise exception 'invalid_character_section' using errcode = '22023';
    end if;
    if jsonb_array_length(updated_items) > 100 then
      raise exception 'invalid_character_section' using errcode = '22023';
    end if;

    for item_entry in select value from jsonb_array_elements(updated_items)
    loop
      if jsonb_typeof(item_entry) <> 'object'
        or jsonb_typeof(item_entry -> 'id') is distinct from 'string'
        or coalesce(item_entry ->> 'id', '') = ''
        or char_length(item_entry ->> 'id') > 80
        or jsonb_typeof(item_entry -> 'name') is distinct from 'string'
        or coalesce(item_entry ->> 'name', '') = ''
        or char_length(item_entry ->> 'name') > 100
        or jsonb_typeof(item_entry -> 'type') is distinct from 'string'
        or coalesce(item_entry ->> 'type', '') not in ('arma', 'municao', 'protecao', 'geral', 'amaldiçoado', 'amaldicoado')
        or jsonb_typeof(item_entry -> 'category') is distinct from 'string'
        or coalesce(item_entry ->> 'category', '') not in ('', '0', 'I', 'II', 'III', 'IV')
        or jsonb_typeof(item_entry -> 'quantity') is distinct from 'number'
        or coalesce(item_entry ->> 'quantity', '') !~ '^[1-9][0-9]{0,2}$'
        or jsonb_typeof(item_entry -> 'spaces') is distinct from 'number'
        or coalesce(item_entry ->> 'spaces', '') !~ '^-?[0-9]{1,3}$'
        or jsonb_typeof(item_entry -> 'capacityBonus') is distinct from 'number'
        or coalesce(item_entry ->> 'capacityBonus', '') !~ '^[0-9]{1,3}$'
        or case
          when coalesce(item_entry ->> 'spaces', '') ~ '^-?[0-9]{1,3}$'
          then (item_entry ->> 'spaces')::integer not between -99 and 999
          else false
        end
        or case
          when coalesce(item_entry ->> 'capacityBonus', '') ~ '^[0-9]{1,3}$'
          then (item_entry ->> 'capacityBonus')::integer > 999
          else false
        end
        or jsonb_typeof(item_entry -> 'description') is distinct from 'string'
        or jsonb_typeof(item_entry -> 'damage') is distinct from 'string'
        or jsonb_typeof(item_entry -> 'critical') is distinct from 'string'
        or jsonb_typeof(item_entry -> 'range') is distinct from 'string'
        or jsonb_typeof(item_entry -> 'damageType') is distinct from 'string'
        or jsonb_typeof(item_entry -> 'ammunition') is distinct from 'string'
        or jsonb_typeof(item_entry -> 'compatibleWeapon') is distinct from 'string'
        or jsonb_typeof(item_entry -> 'defense') is distinct from 'string'
        or jsonb_typeof(item_entry -> 'resistance') is distinct from 'string'
        or char_length(coalesce(item_entry ->> 'damage', '')) > 80
        or char_length(coalesce(item_entry ->> 'critical', '')) > 40
        or char_length(coalesce(item_entry ->> 'range', '')) > 80
        or char_length(coalesce(item_entry ->> 'damageType', '')) > 80
        or char_length(coalesce(item_entry ->> 'ammunition', '')) > 80
        or char_length(coalesce(item_entry ->> 'compatibleWeapon', '')) > 80
        or char_length(coalesce(item_entry ->> 'defense', '')) > 40
        or char_length(coalesce(item_entry ->> 'resistance', '')) > 160
        or char_length(coalesce(item_entry ->> 'description', '')) > 2000 then
        raise exception 'invalid_character_section' using errcode = '22023';
      end if;
    end loop;
    if (
      select count(*) <> count(distinct value ->> 'id')
      from jsonb_array_elements(updated_items)
    ) then
      raise exception 'invalid_character_section' using errcode = '22023';
    end if;

    updated_inventory := jsonb_build_object(
      'prestige', field_value,
      'rank', section_value -> 'rank',
      'creditLimit', section_value -> 'creditLimit',
      'capacity', (section_value ->> 'capacity')::integer,
      'itemLimits', section_value -> 'itemLimits',
      'items', updated_items
    );
    updated_fields := jsonb_set(updated_fields, '{Inventário}', updated_inventory, true);

    if section_value ? 'items' and current_character.campaign_id is not null
      and public.is_campaign_member(current_character.campaign_id) then
      select id into active_session_id
      from public.game_sessions
      where campaign_id = current_character.campaign_id and status = 'active'
      for update;
      if active_session_id is not null then
        for item_entry in select value from jsonb_array_elements(updated_items)
        loop
          item_id := item_entry ->> 'id';
          select value into previous_item
          from jsonb_array_elements(previous_items)
          where value ->> 'id' = item_id
          limit 1;
          item_name := item_entry ->> 'name';
          item_type := item_entry ->> 'type';
          item_quantity := item_entry ->> 'quantity';
          item_summary := item_name || ' (x' || item_quantity || ') · ' || item_type;
          if coalesce(item_entry ->> 'category', '') <> '' then
            item_summary := item_summary || ' · cat. ' || (item_entry ->> 'category');
          end if;
          if previous_item is null then
            insert into public.session_events (
              session_id, character_id, author_id, field_name, value_before, value_after
            ) values (
              active_session_id, target_character, (select auth.uid()), 'Inventário', '—',
              'Adicionado: ' || item_summary
            );
          elsif previous_item is distinct from item_entry then
            previous_summary := coalesce(previous_item ->> 'name', 'Item') || ' (x'
              || coalesce(previous_item ->> 'quantity', '1') || ') · '
              || coalesce(previous_item ->> 'type', 'geral');
            insert into public.session_events (
              session_id, character_id, author_id, field_name, value_before, value_after
            ) values (
              active_session_id, target_character, (select auth.uid()), 'Inventário',
              previous_summary, 'Alterado: ' || item_summary
            );
          end if;
        end loop;
        for previous_item in select value from jsonb_array_elements(previous_items)
        loop
          item_id := previous_item ->> 'id';
          if not exists (
            select 1 from jsonb_array_elements(updated_items)
            where value ->> 'id' = item_id
          ) then
            previous_summary := coalesce(previous_item ->> 'name', 'Item') || ' (x'
              || coalesce(previous_item ->> 'quantity', '1') || ') · '
              || coalesce(previous_item ->> 'type', 'geral');
            insert into public.session_events (
              session_id, character_id, author_id, field_name, value_before, value_after
            ) values (
              active_session_id, target_character, (select auth.uid()), 'Inventário',
              previous_summary, 'Removido: ' || previous_summary
            );
          end if;
        end loop;
      end if;
    end if;
  end if;

  if octet_length(updated_fields::text) > 300000 then
    raise exception 'invalid_character_section' using errcode = '22023';
  end if;
  update public.characters
  set fields = updated_fields, notes = updated_notes, updated_at = now()
  where id = target_character;
end;
$$;

revoke all on function public.update_character_section(uuid, text, jsonb) from public;
grant execute on function public.update_character_section(uuid, text, jsonb) to authenticated;
