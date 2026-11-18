create or replace function public.enforce_character_account_limit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  owned_character_count integer;
begin
  if tg_op = 'UPDATE' and new.owner_id is not distinct from old.owner_id then
    return new;
  end if;

  perform pg_advisory_xact_lock(0, hashtext(new.owner_id::text));
  select count(*)
  into owned_character_count
  from public.characters
  where owner_id = new.owner_id
    and id is distinct from new.id;

  if owned_character_count >= 15 then
    raise exception 'character_limit_reached' using errcode = '23514';
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_character_account_limit on public.characters;
create trigger enforce_character_account_limit
  before insert or update on public.characters
  for each row execute function public.enforce_character_account_limit();

