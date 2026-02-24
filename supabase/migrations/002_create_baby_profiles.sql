-- Migration: 002_create_baby_profiles
-- Creates the baby_profiles table and enables RLS with per-user policies.
-- Depends on: 001_create_user_profiles

create table if not exists public.baby_profiles (
  "babyId"    uuid        primary key default gen_random_uuid(),
  "userId"    uuid        not null references public.user_profiles ("userId") on delete cascade,
  "babyName"  text        not null,
  "birthDate" date        not null,
  "gender"    text        not null check ("gender" in ('BOY', 'GIRL', 'PREFER_NOT_TO_SAY')),
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create trigger baby_profiles_set_updated_at
  before update on public.baby_profiles
  for each row execute function public.set_updated_at();

create index baby_profiles_user_id_idx on public.baby_profiles ("userId");

-- Enable Row Level Security
alter table public.baby_profiles enable row level security;

create policy "baby_profiles: owner can select"
  on public.baby_profiles for select
  using (auth.uid() = "userId");

create policy "baby_profiles: owner can insert"
  on public.baby_profiles for insert
  with check (auth.uid() = "userId");

create policy "baby_profiles: owner can update"
  on public.baby_profiles for update
  using (auth.uid() = "userId")
  with check (auth.uid() = "userId");
