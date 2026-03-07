create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.site_settings enable row level security;

insert into public.site_settings (key, value)
values ('require_login', 'true'::jsonb)
on conflict (key) do nothing;

