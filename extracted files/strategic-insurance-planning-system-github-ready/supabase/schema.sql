create extension if not exists pgcrypto;

create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null references auth.users(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  email text,
  phone text,
  notes text
);

alter table clients enable row level security;

drop policy if exists "Users can view their own clients" on clients;
drop policy if exists "Users can insert their own clients" on clients;
drop policy if exists "Users can update their own clients" on clients;
drop policy if exists "Users can delete their own clients" on clients;

create policy "Users can view their own clients"
on clients for select
using (auth.uid() = user_id);

create policy "Users can insert their own clients"
on clients for insert
with check (auth.uid() = user_id);

create policy "Users can update their own clients"
on clients for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own clients"
on clients for delete
using (auth.uid() = user_id);
