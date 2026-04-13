insert into public.site_settings (key, value)
values
  ('folder_colors', '{}'::jsonb),
  ('site_ad', '{"enabled": false}'::jsonb)
on conflict (key) do nothing;
