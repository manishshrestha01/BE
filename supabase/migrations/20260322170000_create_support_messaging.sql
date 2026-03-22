create extension if not exists pgcrypto;

create table if not exists public.support_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  name text,
  email text,
  subject text,
  message text not null,
  metadata jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists support_messages_created_at_idx
on public.support_messages (created_at desc);

create index if not exists support_messages_email_idx
on public.support_messages (email);

create table if not exists public.support_replies (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.support_messages (id) on delete cascade,
  recipient_email text not null,
  email_subject text not null,
  reply_message text not null,
  sent_by text,
  provider text not null default 'resend',
  provider_message_id text,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists support_replies_message_id_idx
on public.support_replies (message_id);

create index if not exists support_replies_created_at_idx
on public.support_replies (created_at desc);

alter table public.support_messages enable row level security;
alter table public.support_replies enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'support_messages'
      and policyname = 'support_messages_insert_all'
  ) then
    create policy support_messages_insert_all
      on public.support_messages
      for insert
      to anon, authenticated
      with check (true);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'support_messages'
      and policyname = 'support_messages_select_own'
  ) then
    create policy support_messages_select_own
      on public.support_messages
      for select
      to authenticated
      using (auth.uid() = user_id);
  end if;
end $$;
