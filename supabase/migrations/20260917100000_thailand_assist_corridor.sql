insert into public.emigro_corridors (
  slug,
  title_en,
  title_ru,
  audience_description_en,
  audience_description_ru,
  primary_passport_iso2,
  is_published,
  url_segment,
  publish_status
) values (
  'ru-speaking-to-thailand',
  'Russian-speaking → Thailand',
  'Русскоязычные → Таиланд',
  'Relocation and property help for Russian-speaking applicants moving to Thailand.',
  'Помощь русскоязычным заявителям с переездом, обустройством и недвижимостью в Таиланде.',
  'RU',
  true,
  'thailand',
  'active'
)
on conflict (slug) do update set
  title_en = excluded.title_en,
  title_ru = excluded.title_ru,
  audience_description_en = excluded.audience_description_en,
  audience_description_ru = excluded.audience_description_ru,
  primary_passport_iso2 = excluded.primary_passport_iso2,
  is_published = excluded.is_published,
  url_segment = excluded.url_segment,
  publish_status = excluded.publish_status;
