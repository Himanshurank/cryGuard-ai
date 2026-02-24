-- Migration: 001_create_user_profiles
-- Creates the user_profiles table and enables RLS with per-user policies.

create table if not exists public.user_profiles (
  "userId"             uuid        primary key references auth.users (id) on delete cascade,
  "firstName"          text        not null,
  "lastName"           text        not null,
  "birthDate"          date        not null,
  "mobile"             text        not null,
  "gender"             text        not null check ("gender" in ('MALE', 'FEMALE', 'PREFER_NOT_TO_SAY')),
  "onboardingComplete" boolean     not null default false,
  "createdAt"          timestamptz not null default now(),
  "updatedAt"          timestamptz not null default now()
);

-- Auto-update updatedAt on every row change
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new."updatedAt" = now();
  return new;
end;
$$;

create trigger user_profiles_set_updated_at
  before update on public.user_profiles
  for each row execute function public.set_updated_at();

-- Enable Row Level Security
alter table public.user_profiles enable row level security;

create policy "user_profiles: owner can select"
  on public.user_profiles for select
  using (auth.uid() = "userId");

create policy "user_profiles: owner can insert"
  on public.user_profiles for insert
  with check (auth.uid() = "userId");

create policy "user_profiles: owner can update"
  on public.user_profiles for update
  using (auth.uid() = "userId")
  with check (auth.uid() = "userId");
