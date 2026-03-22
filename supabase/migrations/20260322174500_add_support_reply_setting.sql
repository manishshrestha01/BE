insert into public.site_settings (key, value)
values ('support_reply_enabled', 'true'::jsonb)
on conflict (key) do nothing;
