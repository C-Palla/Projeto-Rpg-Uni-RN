create function public.unlink_campaign_characters(
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

  if public.is_campaign_master(target_campaign) is not true then
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
