-- Namma Kannada database schema (PostgreSQL 13+). Safe to re-run: everything is "if not exists".
create extension if not exists pg_trgm;

-- ---------- Reference data ----------
create table if not exists regions (
  id            text primary key,
  name          text not null,
  color         text,
  note          text,
  weight        int  not null default 0,
  dialect_group text,
  description   text,
  hero_image    text
);

create table if not exists districts (
  id        serial primary key,
  region_id text not null references regions(id) on delete cascade,
  name      text not null unique
);

-- ---------- Users ----------
create table if not exists users (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  phone            text not null unique check (phone ~ '^[6-9][0-9]{9}$'),
  password_hash    text not null,
  role             text not null default 'learner' check (role in ('learner','contributor','reviewer','admin')),
  home_region      text references regions(id),
  district         text,
  points           int  not null default 0,
  streak           int  not null default 0,
  best_score       int  not null default 0,
  last_active_date date,
  ui_language      text not null default 'en',
  created_at       timestamptz not null default now()
);

-- ---------- Dictionary ----------
create table if not exists concepts (
  id               text primary key,
  english_meaning  text not null,
  standard_kannada text,
  category         text,
  created_at       timestamptz not null default now()
);
create unique index if not exists concepts_en_uidx on concepts (lower(english_meaning));

create table if not exists entries (
  id                  text primary key,
  seq                 bigserial,
  concept_id          text not null references concepts(id),
  region_id           text not null references regions(id),
  kannada_script      text not null,
  romanized           text,
  ipa                 text,
  literal_meaning     text,
  context_tag         text default 'Everyday',
  example_sentence    text,
  example_translation text,
  status              text not null default 'pending' check (status in ('pending','verified','disputed','rejected')),
  version             int  not null default 1,
  submitted_by        uuid references users(id) on delete set null,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create index if not exists entries_region_idx  on entries(region_id);
create index if not exists entries_concept_idx on entries(concept_id);
create index if not exists entries_status_idx  on entries(status);
create index if not exists entries_kn_trgm  on entries using gin (kannada_script gin_trgm_ops);
create index if not exists entries_rom_trgm on entries using gin (lower(romanized) gin_trgm_ops);
create index if not exists concepts_en_trgm on concepts using gin (lower(english_meaning) gin_trgm_ops);

-- 'hogona' / 'hogona' / Kannada spelling should all find the same entry
create table if not exists spelling_variants (
  id       serial primary key,
  entry_id text not null references entries(id) on delete cascade,
  variant  text not null,
  unique (entry_id, variant)
);

create table if not exists entry_versions (
  id         bigserial primary key,
  entry_id   text not null references entries(id) on delete cascade,
  version    int  not null,
  snapshot   jsonb not null,
  edited_by  uuid references users(id) on delete set null,
  created_at timestamptz not null default now()
);


-- ---------- Audio (consent is mandatory) ----------
create table if not exists audio (
  id           uuid primary key default gen_random_uuid(),
  entry_id     text not null references entries(id) on delete cascade,
  speaker_id   uuid references users(id) on delete set null,
  url          text not null,
  file_name    text not null,
  mime_type    text,
  duration     int,
  consent_flag boolean not null check (consent_flag = true),
  speaker_meta jsonb default '{}'::jsonb,
  created_at   timestamptz not null default now()
);
create index if not exists audio_entry_idx on audio(entry_id);

-- ---------- Moderation ----------
create table if not exists corrections (
  id             uuid primary key default gen_random_uuid(),
  entry_id       text not null references entries(id) on delete cascade,
  suggested_by   uuid references users(id) on delete set null,
  field          text not null,
  proposed_value text not null,
  votes          int  not null default 0,
  status         text not null default 'open' check (status in ('open','accepted','rejected')),
  created_at     timestamptz not null default now()
);
create table if not exists correction_votes (
  correction_id uuid references corrections(id) on delete cascade,
  user_id       uuid references users(id) on delete cascade,
  primary key (correction_id, user_id)
);

create table if not exists reports (
  id          uuid primary key default gen_random_uuid(),
  entry_id    text not null references entries(id) on delete cascade,
  reported_by uuid references users(id) on delete set null,
  reason      text not null,
  status      text not null default 'open' check (status in ('open','resolved','dismissed')),
  created_at  timestamptz not null default now()
);

create table if not exists moderation_log (
  id          bigserial primary key,
  entry_id    text references entries(id) on delete cascade,
  reviewer_id uuid references users(id) on delete set null,
  from_status text,
  to_status   text not null,
  note        text,
  created_at  timestamptz not null default now()
);

-- ---------- Learning, games ----------
-- Generic per-user key/value state the frontend syncs (explored, learned, best, points).
create table if not exists user_state (
  user_id    uuid references users(id) on delete cascade,
  key        text not null,
  value      jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, key)
);

create table if not exists progress (
  user_id      uuid references users(id) on delete cascade,
  entry_id     text references entries(id) on delete cascade,
  learned      boolean not null default false,
  quiz_score   int,
  listen_count int not null default 0,
  primary key (user_id, entry_id)
);


create table if not exists attempts (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references users(id) on delete cascade,
  type       text not null check (type in ('detective','battle','talk')),
  region_id  text references regions(id),
  score      int  not null default 0,
  correct    boolean,
  time_taken int,
  created_at timestamptz not null default now()
);
create index if not exists attempts_user_idx on attempts(user_id, created_at desc);

-- ---------- Added: streak freeze, OTP, server-timed quiz, scenarios ----------
alter table users add column if not exists streak_freezes int not null default 1;

create table if not exists otp_codes (
  phone      text primary key,
  code_hash  text not null,
  expires_at timestamptz not null,
  attempts   int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists quiz_sessions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references users(id) on delete cascade,
  used          text[] not null default '{}',
  current_entry text,
  issued_at     timestamptz,
  answered      boolean not null default true,
  score         int not null default 0,
  streak        int not null default 0,
  created_at    timestamptz not null default now()
);

create table if not exists scenarios (
  id   text primary key,
  sort int not null default 0
);
create table if not exists scenario_nodes (
  scenario_id text references scenarios(id) on delete cascade,
  node_id     text not null,
  speaker     text not null,
  kn          text not null,
  rom         text,
  en          text,
  choices     jsonb not null default '[]'::jsonb,
  primary key (scenario_id, node_id)
);
