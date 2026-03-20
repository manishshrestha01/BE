insert into public.site_settings (key, value)
values ('pdf_download_enabled', 'true'::jsonb)
on conflict (key) do nothing;
