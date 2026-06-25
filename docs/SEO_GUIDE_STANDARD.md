# Emigro — стандарт SEO-гайда (traffic pillar)

Синтез требований из **Prep2Go/CIPLE A2** (`quick_answer`, signal-gated intent, mock/wizard CTA), **PixID** (`SEO_ARTICLE_STANDARD.md` — 24 пункта head/schema/LLM), **Barakhlo** (pillar-гайды на русском, playbook по странам, `llm-summary` блок).

Гайд ≠ еженедельный news digest. Гайд = **evergreen pillar** на растущий спрос, с чётким geo (ru-RU) и воронкой в **hub wizard** / коридор.

---

## 1. Когда писать гайд, а не digest

| Digest (новости) | Guide (гайд) |
|------------------|--------------|
| Событие недели | Вечный поисковый intent |
| 5 источников за 7 дней | Официальные якоря + обновление раз в квартал |
| «Что случилось» | «Что делать мне» |
| `/ru/news/[slug]` | `/ru/guides/[slug]` |

---

## 2. Обязательная структура страницы

### Meta (SEO)

| Поле | Правило |
|------|---------|
| `title` | ≤60 символов, primary keyword в начале, год `2026` если актуальность критична |
| `description` | 145–160 символов: боль + обещание + дифференциатор Emigro |
| `canonical` | `https://www.emigro.online/ru/guides/{slug}` |
| `keywords` | 5–8 фраз: ВНЖ, страна, паспорт RU/BY/UA, маршрут |
| `hreflang` | `ru-RU` |
| `robots` | index, follow |

### Schema.org

- `Article` — headline, datePublished, dateModified, author Emigro, publisher
- `BreadcrumbList` — Emigro → Гайды → статья
- `FAQPage` — минимум 5 вопросов из видимого FAQ-блока

### LLM / AEO

- `ai:description` — 2–3 предложения: для кого, какие страны/маршруты, что делает Emigro (wizard без выбора страны заранее)
- Блок **«Краткая выжимка»** в конце (как Barakhlo `llm-summary`) — факты списком для цитирования
- Ссылка на `/llms.txt`

### Тело (не thin)

| Блок | Минимум |
|------|---------|
| `quick_answer` | 2–4 предложения — прямой ответ без воды |
| H2-секции | **6–10**, каждая с конкретикой (цифры 2026, органы, сроки) |
| Таблица или чеклист | ≥1 на гайд |
| Официальные ссылки | ≥3 (MFA, AIMA, IND, Make it in Germany, BOE…) |
| FAQ | 5–7 вопросов |
| CTA | Hub wizard `/ru/wizard` + релевантный коридор |
| Дисклеймер | Не юридическая консультация |

### Запрещено (как в news editorial)

- «Важно отметить», «на фоне изменений», «европейский тренд» без факта
- Google News как единственный источник
- Обещания «гарантированного ВНЖ»
- Инструкции по обходу закона / сокрытию мобилизации — только **легальные маршруты** долгосрочного статуса

### Аудитория и боль (2026)

- Паспорта: **RU, BY, UA, KZ** — явно в тексте где релевантно
- Контекст: война РФ–Украины, неопределённость, рост отказов в консульствах, ужесточение гражданства в PT/ES
- Тон: спокойный навигатор, не паника и не «розовые пони»

---

## 3. Именование файлов

```
content/guides/ru/{slug}.md
slug: kebab-case, latin, keyword-rich
Пример: kuda-pereehat-iz-rossii-2026-evropa-vnj.md
```

### Frontmatter (YAML)

```yaml
---
slug: example-slug
title: "Заголовок H1"
seo_title: "SEO title ≤60"
seo_description: "145-160 chars"
excerpt: "1-2 предложения для карточки"
quick_answer: "Прямой ответ"
corridor_slugs: [ru-speaking-to-portugal]
topic_keys: [portugal, spain]
tags: [ВНЖ, релокация, 2026]
primary_intent: informational|comparison|checklist
cta_primary: /ru/wizard
cta_secondary: /ru/portugal
official_sources:
  - url: https://...
    label: AIMA
estimated_minutes: 12
date_published: 2026-06-25
date_modified: 2026-06-25
---
```

---

## 4. Воронка

```
SEO / LLM citation
    → Guide (pillar)
        → Hub wizard (/ru/wizard) — «подобрать страну»
        → Corridor wizard — углубление
        → Lead form / partners
```

---

## 5. Чеклист перед публикацией

- [ ] Title/description уникальны, keyword в первых 30 символах title
- [ ] quick_answer отвечает на запрос за 10 секунд чтения
- [ ] Есть цифры порогов 2026 с оговоркой «проверьте на дату подачи»
- [ ] ≥3 официальных URL в «Источники»
- [ ] FAQ совпадает со schema FAQPage
- [ ] CTA на hub wizard
- [ ] Блок llm-summary в конце
- [ ] Нет thin: <800 слов только если ultra-narrow FAQ; pillar ≥1200 слов

---

## 6. Кластер из 10 гайдов (launch set)

См. `content/guides/ru/` — первая волна трафика под русскоязычный спрос «куда валить легально»:

1. Куда переехать из России в Европу 2026 (pillar)
2. ВНЖ Португалии D8/D7 и закон о гражданстве 2026
3. Digital nomad: Португалия vs Испания vs Италия
4. Украинцы и белорусы: временная защита vs ВНЖ
5. Германия: Blue Card и Chancenkarte для граждан СНГ
6. ВНЖ без работы — пассивный доход и сбережения
7. Воссоединение семьи в ЕС
8. Релокация с детьми: школы, ВНЖ, сроки
9. Отказы в национальных визах: как готовить пакет
10. Бюджет релокации в Европу 2026 по странам
