-- Portugal news focus: ARI/Golden Visa «grey zone» cohort (invested ~2021–22 for 5y passport).
UPDATE public.emigro_news_topics
SET
  focus_hint_ru = 'Приоритет Португалии: «серая зона» Golden Visa / ARI — инвесторы ~2021–2022, ждавшие ~5 лет до паспорта, теперь без перехода (Lei da Nacionalidade 5→10, счёт с cartão, AIMA backlog). Следить: Provedoria, regime transitório, иски против Estado, IRN/AIMA. Также D8/D7/CIPLE.',
  rss_queries = ARRAY[
    'Portugal Golden Visa grey zone nationality law',
    'Portugal zona cinzenta vistos gold nacionalidade',
    'Portugal Golden Visa investors 5 to 10 years citizenship',
    'Portugal ARI 2021 2022 transitional regime nationality',
    'Portugal vistos gold investidores ação Estado setembro',
    'Portugal Lei da Nacionalidade Provedoria Golden Visa',
    'Portugal AIMA backlog residence card Golden Visa clock',
    'Portugal citizenship from residence card issuance ARI',
    'Португалия золотая виза серая зона гражданство',
    'Португалия ARI 2021 2022 гражданство 10 лет',
    'Portugal D8 digital nomad visa',
    'Portugal D7 AIMA renovação'
  ],
  updated_at = now()
WHERE key = 'portugal';
