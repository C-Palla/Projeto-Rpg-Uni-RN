create function public.create_campaign(
  campaign_name text,
  campaign_system text,
  campaign_description text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  created_campaign_id uuid;
begin
  if (select auth.uid()) is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;
  if campaign_name is null
    or char_length(trim(campaign_name)) not between 1 and 80
    or campaign_system is null
    or campaign_system not in ('dnd', 'tormenta', 'ordem')
    or char_length(coalesce(campaign_description, '')) > 500 then
    raise exception 'invalid_campaign' using errcode = '22023';
  end if;

  insert into public.campaigns (owner_id, name, system, description)
  values (
    (select auth.uid()),
    trim(campaign_name),
    campaign_system,
    coalesce(trim(campaign_description), '')
  )
  returning id into created_campaign_id;

  return created_campaign_id;
end;
$$;

revoke all on function public.create_campaign(text, text, text) from public;
grant execute on function public.create_campaign(text, text, text) to authenticated;
