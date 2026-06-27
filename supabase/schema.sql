-- otherhalf / simulacra — supabase schema
-- All access is server-side via the service-role key. RLS is enabled with no
-- public policies so the anon key cannot read or write these tables directly.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- onboarding
-- ---------------------------------------------------------------------------
create table if not exists onboarding_sessions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null,
  status       text not null default 'in_progress',
  answers_json jsonb not null default '{}'::jsonb,
  type_code    text,
  created_at   timestamptz not null default now(),
  completed_at timestamptz
);
create index if not exists idx_sessions_user on onboarding_sessions (user_id, created_at desc);

create table if not exists onboarding_answers (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null,
  session_id  uuid not null,
  question_id text not null,
  answer      text not null,
  created_at  timestamptz not null default now(),
  unique (session_id, question_id)
);

-- kept for backward compatibility with the older image-preference step
create table if not exists image_preferences (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null,
  session_id uuid not null,
  image_id   text not null,
  liked      boolean not null,
  created_at timestamptz not null default now(),
  unique (session_id, image_id)
);

-- ---------------------------------------------------------------------------
-- companion profile + evolving memory dossier
-- ---------------------------------------------------------------------------
create table if not exists companion_profiles (
  user_id    uuid primary key,
  session_id uuid,
  type_code  text,
  type_name  text,
  memory     text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- billing
-- ---------------------------------------------------------------------------
create table if not exists subscriptions (
  user_id                uuid primary key,
  status                 text not null default 'none',
  stripe_customer_id     text,
  stripe_subscription_id text,
  stripe_session_id      text,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create table if not exists checkout_events (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid,
  stripe_event_id  text unique,
  stripe_event_type text,
  payload_json     jsonb,
  created_at       timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- telegram bridge
-- ---------------------------------------------------------------------------
create table if not exists telegram_links (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null,
  token               text not null unique,
  telegram_chat_id    bigint,
  telegram_user_id    bigint,
  telegram_first_name text,
  linked_at           timestamptz,
  created_at          timestamptz not null default now()
);
create index if not exists idx_links_chat on telegram_links (telegram_chat_id);
create index if not exists idx_links_user on telegram_links (user_id);

create table if not exists telegram_messages (
  id               bigserial primary key,
  telegram_chat_id bigint not null,
  user_id          uuid,
  role             text not null,
  content          text not null,
  created_at       timestamptz not null default now()
);
create index if not exists idx_msgs_chat on telegram_messages (telegram_chat_id, created_at);

-- ---------------------------------------------------------------------------
-- lock down: enable RLS, add no public policies (service role bypasses RLS)
-- ---------------------------------------------------------------------------
alter table onboarding_sessions  enable row level security;
alter table onboarding_answers   enable row level security;
alter table image_preferences    enable row level security;
alter table companion_profiles   enable row level security;
alter table subscriptions        enable row level security;
alter table checkout_events      enable row level security;
alter table telegram_links       enable row level security;
alter table telegram_messages    enable row level security;
