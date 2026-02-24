-- Migration: 003_create_cry_events
-- Creates the cry_events table and enables RLS with per-user policies.
-- Depends on: 001_create_user_profiles, 002_create_baby_profiles

create table if not exists public.cry_events (
  "eventId"         uuid        primary key default gen_random_uuid(),
  "userId"          uuid        not null references public.user_profiles ("userId") on delete cascade,
  "babyId"          uuid        not null references public.baby_profiles ("babyId") on delete cascade,
  "detectedAt"      timestamptz not null default now(),
  "confidenceScore" float4      not null check ("confidenceScore" >= 0.0 and "confidenceScore" <= 1.0)
);

create index cry_events_user_id_idx    on public.cry_events ("userId");
create index cry_events_baby_id_idx    on public.cry_events ("babyId");
create index cry_events_detected_at_idx on public.cry_events ("detectedAt" desc);

-- Enable Row Level Security
alter table public.cry_events enable row level security;

create policy "cry_events: owner can select"
  on public.cry_events for select
  using (auth.uid() = "userId");

create policy "cry_events: owner can insert"
  on public.cry_events for insert
  with check (auth.uid() = "userId");
