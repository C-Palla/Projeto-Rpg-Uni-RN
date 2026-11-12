create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 80),
  created_at timestamptz not null default now()
);

create function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''), split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_auth_user();

create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  system text not null check (system in ('dnd', 'tormenta', 'ordem')),
  description text not null default '' check (char_length(description) <= 500),
  created_at timestamptz not null default now()
);

create table public.campaign_members (
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('master', 'player')),
  created_at timestamptz not null default now(),
  primary key (campaign_id, user_id)
);

create function public.is_campaign_member(target_campaign uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.campaign_members
    where campaign_id = target_campaign and user_id = (select auth.uid())
  );
$$;

create function public.is_campaign_master(target_campaign uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.campaigns
    where id = target_campaign and owner_id = (select auth.uid())
  );
$$;

create function public.add_campaign_master()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.campaign_members (campaign_id, user_id, role)
  values (new.id, new.owner_id, 'master');
  return new;
end;
$$;

create trigger on_campaign_created
  after insert on public.campaigns
  for each row execute procedure public.add_campaign_master();

create table public.characters (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  campaign_id uuid references public.campaigns(id) on delete set null,
  name text not null check (char_length(name) between 1 and 80),
  system text not null check (system in ('dnd', 'tormenta', 'ordem')),
  fields jsonb not null default '{}'::jsonb,
  notes text not null default '' check (char_length(notes) <= 5000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.game_sessions (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  status text not null check (status in ('active', 'finished', 'cancelled')),
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  master_summary text not null default '' check (char_length(master_summary) <= 10000)
);
create unique index one_active_session_per_campaign
  on public.game_sessions (campaign_id) where status = 'active';

create table public.session_events (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.game_sessions(id) on delete cascade,
  character_id uuid not null references public.characters(id) on delete restrict,
  author_id uuid not null references auth.users(id) on delete restrict,
  field_name text not null check (char_length(field_name) between 1 and 80),
  value_before text not null check (char_length(value_before) <= 1000),
  value_after text not null check (char_length(value_after) <= 1000),
  created_at timestamptz not null default now()
);
create index session_events_order_idx on public.session_events (session_id, created_at, id);

create function public.record_character_event(
  target_session uuid,
  target_character uuid,
  target_field text,
  new_value text
)
returns public.session_events
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_session public.game_sessions%rowtype;
  current_character public.characters%rowtype;
  previous_value text;
  created_event public.session_events%rowtype;
begin
  select * into current_session
  from public.game_sessions where id = target_session for update;
  if current_session.id is null or current_session.status <> 'active'
    or not public.is_campaign_member(current_session.campaign_id) then
    raise exception 'session_not_available' using errcode = '42501';
  end if;

  select * into current_character from public.characters where id = target_character for update;
  if current_character.id is null
    or current_character.owner_id <> (select auth.uid())
    or current_character.campaign_id is distinct from current_session.campaign_id then
    raise exception 'character_not_available' using errcode = '42501';
  end if;
  if char_length(trim(target_field)) not between 1 and 80 or char_length(new_value) > 1000 then
    raise exception 'invalid_event' using errcode = '22023';
  end if;

  previous_value := coalesce(current_character.fields ->> target_field, '—');
  update public.characters
  set fields = jsonb_set(fields, array[target_field], to_jsonb(new_value), true), updated_at = now()
  where id = target_character;

  insert into public.session_events (
    session_id, character_id, author_id, field_name, value_before, value_after
  ) values (
    target_session, target_character, (select auth.uid()), trim(target_field), previous_value, new_value
  ) returning * into created_event;
  return created_event;
end;
$$;

create table public.public_tables (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 100),
  system text not null check (system in ('dnd', 'tormenta', 'ordem')),
  description text not null check (char_length(description) between 1 and 3000),
  schedule text not null check (char_length(schedule) between 1 and 120),
  starts_at timestamptz not null,
  timezone text not null check (char_length(timezone) between 1 and 80),
  seats integer not null check (seats between 1 and 30),
  requirements text not null default '' check (char_length(requirements) <= 2000),
  status text not null default 'open' check (status in ('open', 'full', 'closed', 'cancelled')),
  created_at timestamptz not null default now()
);
create index public_tables_browse_idx on public.public_tables (status, starts_at);

create table public.table_applications (
  id uuid primary key default gen_random_uuid(),
  table_id uuid not null references public.public_tables(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  message text not null default '' check (char_length(message) <= 1000),
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamptz not null default now(),
  decided_at timestamptz,
  unique (table_id, user_id)
);

create function public.is_table_applicant(target_table uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.table_applications
    where table_id = target_table and user_id = (select auth.uid())
  );
$$;

create function public.decide_table_application(target_application uuid, decision text)
returns public.table_applications
language plpgsql
security definer
set search_path = ''
as $$
declare
  application public.table_applications%rowtype;
  target_table public.public_tables%rowtype;
  accepted_count integer;
begin
  if decision not in ('accepted', 'rejected') then
    raise exception 'invalid_decision' using errcode = '22023';
  end if;

  select tables.* into target_table
  from public.public_tables as tables
  join public.table_applications as applications on applications.table_id = tables.id
  where applications.id = target_application
  for update of tables;
  if target_table.id is null or target_table.owner_id <> (select auth.uid()) then
    raise exception 'application_not_available' using errcode = '42501';
  end if;

  select * into application from public.table_applications
  where id = target_application for update;
  if application.status <> 'pending' then
    raise exception 'application_already_decided' using errcode = '22023';
  end if;
  select count(*) into accepted_count from public.table_applications
  where table_id = target_table.id and status = 'accepted';
  if decision = 'accepted' and (target_table.status <> 'open' or accepted_count >= target_table.seats) then
    raise exception 'table_full' using errcode = '23514';
  end if;

  update public.table_applications
  set status = decision, decided_at = now()
  where id = target_application returning * into application;

  if decision = 'accepted' and accepted_count + 1 >= target_table.seats then
    update public.public_tables set status = 'full' where id = target_table.id;
  end if;
  return application;
end;
$$;

create table public.table_messages (
  id uuid primary key default gen_random_uuid(),
  table_id uuid not null references public.public_tables(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  applicant_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);
create index table_messages_thread_idx on public.table_messages (table_id, applicant_id, created_at, id);

alter table public.profiles enable row level security;
alter table public.campaigns enable row level security;
alter table public.campaign_members enable row level security;
alter table public.characters enable row level security;
alter table public.game_sessions enable row level security;
alter table public.session_events enable row level security;
alter table public.public_tables enable row level security;
alter table public.table_applications enable row level security;
alter table public.table_messages enable row level security;

create policy "Profiles can be read by authenticated users"
  on public.profiles for select to authenticated using (true);
create policy "Users can update their profile"
  on public.profiles for update to authenticated using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

create policy "Campaign members can view campaigns"
  on public.campaigns for select to authenticated using (public.is_campaign_member(id));
create policy "Users can create campaigns for themselves"
  on public.campaigns for insert to authenticated with check (owner_id = (select auth.uid()));
create policy "Masters can update campaigns"
  on public.campaigns for update to authenticated using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));
create policy "Masters can delete campaigns"
  on public.campaigns for delete to authenticated using (owner_id = (select auth.uid()));

create policy "Members can see campaign membership"
  on public.campaign_members for select to authenticated using (public.is_campaign_member(campaign_id));
create policy "Masters can add campaign members"
  on public.campaign_members for insert to authenticated with check (public.is_campaign_master(campaign_id));
create policy "Masters or members can leave campaign"
  on public.campaign_members for delete to authenticated using (
    public.is_campaign_master(campaign_id) or user_id = (select auth.uid())
  );

create policy "Campaign members can read characters"
  on public.characters for select to authenticated using (
    owner_id = (select auth.uid()) or (campaign_id is not null and public.is_campaign_member(campaign_id))
  );
create policy "Users can create their own characters"
  on public.characters for insert to authenticated with check (
    owner_id = (select auth.uid()) and
    (campaign_id is null or public.is_campaign_member(campaign_id))
  );
create policy "Owners can update their characters"
  on public.characters for update to authenticated using (owner_id = (select auth.uid()))
  with check (
    owner_id = (select auth.uid()) and
    (campaign_id is null or public.is_campaign_member(campaign_id))
  );
create policy "Owners can delete their characters"
  on public.characters for delete to authenticated using (owner_id = (select auth.uid()));

create policy "Campaign members can read sessions"
  on public.game_sessions for select to authenticated using (public.is_campaign_member(campaign_id));
create policy "Masters can start sessions"
  on public.game_sessions for insert to authenticated with check (public.is_campaign_master(campaign_id));
create policy "Masters can finish sessions"
  on public.game_sessions for update to authenticated using (public.is_campaign_master(campaign_id))
  with check (public.is_campaign_master(campaign_id));
create policy "Masters can delete sessions"
  on public.game_sessions for delete to authenticated using (public.is_campaign_master(campaign_id));

create policy "Campaign members can read session events"
  on public.session_events for select to authenticated using (
    exists (
      select 1 from public.game_sessions
      where game_sessions.id = session_events.session_id
        and public.is_campaign_member(game_sessions.campaign_id)
    )
  );

create policy "Open tables are public"
  on public.public_tables for select to anon, authenticated using (
    status = 'open' or owner_id = (select auth.uid()) or public.is_table_applicant(id)
  );
create policy "Masters can publish tables"
  on public.public_tables for insert to authenticated with check (owner_id = (select auth.uid()));
create policy "Masters can update their tables"
  on public.public_tables for update to authenticated using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));
create policy "Masters can delete their tables"
  on public.public_tables for delete to authenticated using (owner_id = (select auth.uid()));

create policy "Players and masters can read applications"
  on public.table_applications for select to authenticated using (
    user_id = (select auth.uid()) or exists (
      select 1 from public.public_tables
      where public_tables.id = table_applications.table_id
        and public_tables.owner_id = (select auth.uid())
    )
  );
create policy "Players can apply to open tables"
  on public.table_applications for insert to authenticated with check (
    user_id = (select auth.uid()) and exists (
      select 1 from public.public_tables
      where public_tables.id = table_applications.table_id
        and public_tables.status = 'open'
        and public_tables.owner_id <> (select auth.uid())
    )
  );

create policy "Conversation participants can read messages"
  on public.table_messages for select to authenticated using (
    sender_id = (select auth.uid()) or applicant_id = (select auth.uid()) or exists (
      select 1 from public.public_tables
      where public_tables.id = table_messages.table_id
        and public_tables.owner_id = (select auth.uid())
    )
  );
create policy "Conversation participants can send messages"
  on public.table_messages for insert to authenticated with check (
    sender_id = (select auth.uid()) and (
      (applicant_id = (select auth.uid()) and exists (
        select 1 from public.public_tables
        where public_tables.id = table_messages.table_id
          and public_tables.owner_id <> (select auth.uid())
          and public_tables.status in ('open', 'full')
          and exists (
            select 1 from public.table_applications
            where table_applications.table_id = public_tables.id
              and table_applications.user_id = (select auth.uid())
          )
      )) or exists (
        select 1 from public.public_tables
        where public_tables.id = table_messages.table_id
          and public_tables.owner_id = (select auth.uid())
          and exists (
            select 1 from public.table_applications
            where table_applications.table_id = public_tables.id
              and table_applications.user_id = table_messages.applicant_id
          )
      )
    )
  );

grant usage on schema public to anon, authenticated;
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.campaigns to authenticated;
grant select, insert, delete on public.campaign_members to authenticated;
grant select, insert, update, delete on public.characters to authenticated;
grant select, insert, update, delete on public.game_sessions to authenticated;
grant select on public.session_events to authenticated;
grant select on public.public_tables to anon, authenticated;
grant insert, update, delete on public.public_tables to authenticated;
grant select, insert on public.table_applications to authenticated;
grant select, insert on public.table_messages to authenticated;

revoke all on function public.record_character_event(uuid, uuid, text, text) from public;
grant execute on function public.record_character_event(uuid, uuid, text, text) to authenticated;
revoke all on function public.decide_table_application(uuid, text) from public;
grant execute on function public.decide_table_application(uuid, text) to authenticated;
grant execute on function public.is_campaign_member(uuid) to authenticated;
grant execute on function public.is_campaign_master(uuid) to authenticated;
grant execute on function public.is_table_applicant(uuid) to anon, authenticated;
