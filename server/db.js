const fs = require("node:fs");
const path = require("node:path");
const Database = require("better-sqlite3");

const dataDirectory = path.join(__dirname, "..", "data");
fs.mkdirSync(dataDirectory, { recursive: true });

const database = new Database(process.env.DATABASE_PATH || path.join(dataDirectory, "mesa-rpg.sqlite"));
database.pragma("foreign_keys = ON");
database.pragma("journal_mode = WAL");
database.pragma("busy_timeout = 5000");

database.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    display_name TEXT NOT NULL CHECK(length(display_name) BETWEEN 1 AND 80),
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS auth_sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS auth_sessions_user_idx ON auth_sessions(user_id);
  CREATE INDEX IF NOT EXISTS auth_sessions_expiry_idx ON auth_sessions(expires_at);

  CREATE TABLE IF NOT EXISTS campaigns (
    id TEXT PRIMARY KEY,
    owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL CHECK(length(name) BETWEEN 1 AND 80),
    system TEXT NOT NULL CHECK(system IN ('dnd', 'tormenta', 'ordem')),
    description TEXT NOT NULL DEFAULT '' CHECK(length(description) <= 500),
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS campaign_members (
    campaign_id TEXT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK(role IN ('master', 'player')),
    created_at TEXT NOT NULL,
    PRIMARY KEY (campaign_id, user_id)
  );
  CREATE INDEX IF NOT EXISTS campaign_members_user_idx ON campaign_members(user_id);

  CREATE TABLE IF NOT EXISTS characters (
    id TEXT PRIMARY KEY,
    owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    campaign_id TEXT REFERENCES campaigns(id) ON DELETE SET NULL,
    name TEXT NOT NULL CHECK(length(name) BETWEEN 1 AND 80),
    system TEXT NOT NULL CHECK(system IN ('dnd', 'tormenta', 'ordem')),
    fields_json TEXT NOT NULL DEFAULT '{}',
    notes TEXT NOT NULL DEFAULT '' CHECK(length(notes) <= 5000),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS characters_owner_idx ON characters(owner_id);
  CREATE INDEX IF NOT EXISTS characters_campaign_idx ON characters(campaign_id);

  CREATE TABLE IF NOT EXISTS game_sessions (
    id TEXT PRIMARY KEY,
    campaign_id TEXT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK(status IN ('active', 'finished', 'cancelled')),
    started_at TEXT NOT NULL,
    ended_at TEXT,
    master_summary TEXT NOT NULL DEFAULT '' CHECK(length(master_summary) <= 10000)
  );
  CREATE UNIQUE INDEX IF NOT EXISTS one_active_session_per_campaign
    ON game_sessions(campaign_id) WHERE status = 'active';

  CREATE TABLE IF NOT EXISTS session_events (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
    character_id TEXT NOT NULL REFERENCES characters(id) ON DELETE RESTRICT,
    author_id TEXT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    field_name TEXT NOT NULL CHECK(length(field_name) BETWEEN 1 AND 80),
    value_before TEXT NOT NULL CHECK(length(value_before) <= 1000),
    value_after TEXT NOT NULL CHECK(length(value_after) <= 1000),
    created_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS session_events_order_idx ON session_events(session_id, created_at, id);

  CREATE TABLE IF NOT EXISTS public_tables (
    id TEXT PRIMARY KEY,
    owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL CHECK(length(title) BETWEEN 1 AND 100),
    system TEXT NOT NULL CHECK(system IN ('dnd', 'tormenta', 'ordem')),
    description TEXT NOT NULL CHECK(length(description) BETWEEN 1 AND 3000),
    schedule TEXT NOT NULL CHECK(length(schedule) BETWEEN 1 AND 120),
    starts_at TEXT NOT NULL,
    timezone TEXT NOT NULL CHECK(length(timezone) BETWEEN 1 AND 80),
    seats INTEGER NOT NULL CHECK(seats BETWEEN 1 AND 30),
    requirements TEXT NOT NULL DEFAULT '' CHECK(length(requirements) <= 2000),
    status TEXT NOT NULL CHECK(status IN ('open', 'full', 'closed', 'cancelled')),
    created_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS public_tables_browse_idx ON public_tables(status, starts_at);
  CREATE INDEX IF NOT EXISTS public_tables_owner_idx ON public_tables(owner_id);

  CREATE TABLE IF NOT EXISTS table_applications (
    id TEXT PRIMARY KEY,
    table_id TEXT NOT NULL REFERENCES public_tables(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL DEFAULT '' CHECK(length(message) <= 1000),
    status TEXT NOT NULL CHECK(status IN ('pending', 'accepted', 'rejected')),
    created_at TEXT NOT NULL,
    decided_at TEXT,
    UNIQUE(table_id, user_id)
  );
  CREATE INDEX IF NOT EXISTS applications_user_idx ON table_applications(user_id);
  CREATE INDEX IF NOT EXISTS applications_table_idx ON table_applications(table_id, status);

  CREATE TABLE IF NOT EXISTS table_messages (
    id TEXT PRIMARY KEY,
    table_id TEXT NOT NULL REFERENCES public_tables(id) ON DELETE CASCADE,
    sender_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    applicant_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    body TEXT NOT NULL CHECK(length(body) BETWEEN 1 AND 2000),
    created_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS table_messages_thread_idx ON table_messages(table_id, applicant_id, created_at, id);
`);

module.exports = database;
