-- Portugal naturalisation after Lei Orgânica n.º 1/2026 (art. 6.º/1 c)–e)): language is not the only test.
-- Regulamento da Nacionalidade update (art. 4.º, 90 days) not yet published as of 2026-09-30.

UPDATE emigro_corridor_digest_items
SET
  title_ru = 'Гражданство: язык, культура, гражданские знания',
  title_en = 'Citizenship: language, culture, civics',
  body_ru = 'Lei Orgânica n.º 1/2026 (с 19.05.2026), ст. 6.º/1: 10 лет легального проживания (7 для EU/CPLP) и, помимо языка, — знание культуры, истории и национальных символов (тест или сертификат), прав и обязанностей гражданина и политического устройства государства, торжественная декларация приверженности принципам правового государства, отсутствие судимости свыше 3 лет по тяжким статьям, средства к существованию. Формат теста на культуру и гражданские знания должен определить новый Regulamento da Nacionalidade; на 30.09.2026 он не опубликован. Заявления, поданные до 19.05.2026, рассматриваются по прежней редакции (ст. 7.º/2).',
  body_en = 'Lei Orgânica n.º 1/2026 (from 19 May 2026), art. 6(1): 10 years of legal residence (7 for EU/CPLP) and, beyond language, knowledge of Portuguese culture, history and national symbols (test or certificate), of fundamental rights and duties and the political organisation of the State, a solemn declaration of adherence to the rule of law, no prison sentence over 3 years for listed serious crimes, and means of subsistence. The culture/civics test format is to be set by an updated Nationality Regulation, not yet published as of 30 Sep 2026. Applications filed before 19 May 2026 follow the previous law (art. 7(2)).',
  source_url = 'https://diariodarepublica.pt/dr/detalhe/lei-organica/1-2026-1123539996',
  last_verified = '2026-09-30'
WHERE id = 'd962484f-aa25-4bff-bd88-d1032fbbfebc';

UPDATE emigro_corridor_digest_items
SET
  title_ru = 'CIPLE A2 — только языковая часть',
  title_en = 'CIPLE A2 covers language only',
  body_ru = 'CIPLE (CAPLE) проверяет чтение, письмо, аудирование и говорение на A2 и закрывает языковую часть требования. Культуру, историю, символы и гражданские знания по ст. 6.º/1 c)–d) Lei Orgânica 1/2026 CIPLE не заменяет — формат этой проверки ещё не утверждён. С нуля на A2 закладывайте 3–6 месяцев подготовки.',
  body_en = 'CIPLE (CAPLE) assesses reading, writing, listening and speaking at A2 and covers the language part. It does not replace the culture, history, symbols and civics knowledge required by art. 6(1)(c)–(d) of Lei Orgânica 1/2026, whose test format is not yet set. Plan 3–6 months of study for A2 from zero.',
  source_url = 'https://caple.letras.ulisboa.pt/',
  last_verified = '2026-09-30'
WHERE id = '8d249c99-d8fd-48fb-a0ea-ee39c3f36d7f';

UPDATE emigro_corridor_digest_items
SET
  body_ru = 'Типичный путь: ВНЖ → продления → легальный срок проживания (для большинства — 10 лет по Lei Orgânica 1/2026) → язык A2 (CIPLE) + проверка знаний культуры, истории, символов и устройства государства + торжественная декларация → заявление на гражданство (рассмотрение 12–24 мес.). Задержки AIMA — отдельный админ-риск; они не заменяют требование закона.',
  body_en = 'Typical path: residence permit → renewals → legal residence period (10 years for most under Lei Orgânica 1/2026) → A2 language (CIPLE) + culture, history, symbols and civics knowledge + solemn declaration → citizenship application (12–24 months processing). AIMA backlogs are a separate admin risk; they do not replace the statutory requirements.',
  source_url = 'https://justica.gov.pt/Noticias/Lei-da-Nacionalidade-novas-regras-entram-em-vigor-a-19-de-maio',
  last_verified = '2026-09-30'
WHERE id = '11679759-0c9f-4219-8470-ca7e582a4d1f';
