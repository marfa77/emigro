# Satellite requirements checklist — все коридоры

Эталон: **Portugal** (`docs/PORTUGAL_SATELLITE.md`). Используйте таблицу ниже при репликации на Spain, Germany, Poland и др.

**Статус Jul 2026:** Portugal — production gold standard; Spain — догоняет (Phase 3).

---

## Сводная таблица: Portugal vs Spain

| Критерий | Portugal (эталон) | Spain (текущий) | Gap |
|----------|-------------------|-----------------|-----|
| **Parser channels** | 4 (`@chatlisboa`, `@por_tugal`, `@lepta`, `@autolife_pt`) | 5 (`@spain_granitsa`, `@spainchats`, `@valenforum`, `@valenciarusia`, `@migranty_barselona`) | ✅ |
| **Daily cron (VPS)** | `emigro-portugal-community.timer` 07:00 UTC | `emigro-spain-community.timer` 07:30 UTC | ✅ |
| **Editorial seed notes** | 4 в `publish-seed.ts` + 6 hand-curated blueprints | 7 hand-curated blueprints (`SPAIN_EDITORIAL_GUIDES`) | ✅ (≥7) |
| **body_sections (guide)** | ≥5 секций + glossary first | 5–6 секций + glossary | ✅ |
| **FAQ (guide)** | ≥4 | 4 (guide), 3–4 (tip/qa/lifehack) | ✅ |
| **official_links** | ≥2 gov/official URL | ≥2 на каждой заметке | ✅ |
| **Word count (guide)** | 600+ gate; hand-curated ~1500–2000 | 600+ gate; expanded ~900–1100 | ⚠️ короче PT blueprints |
| **Per-note hero image** | `public/images/community-notes/{slug}.webp` + manifest | 7 unique WebP committed | ✅ (Jul 2026) |
| **NoteCard — не DEFAULT_OG** | `resolveNoteCardImage()` → committed/dynamic/fallback | Уникальный WebP или distinct OG JPG | ✅ |
| **Pillar guide OG (www)** | `guide-{slug}.jpg` on disk | `vnj-ispaniya`, `pervye-30-dnej-v-ispanii`, `portugaliya-vs-ispaniya` | ✅ |
| **Sitemap** | hub + `/llms` + notes + tags | hub + `/llms` + notes + tags | ✅ |
| **llms.txt / llms-full** | Portugal hub + notes | Spain hub + notes | ✅ |
| **Canonical subdomain** | `portugal.emigro.online` | `spain.emigro.online` | ✅ |
| **Corridor FeaturedNotes** | `PortugalFeaturedNotes` | `SpainFeaturedNotes` | ✅ |
| **hasPractice** | `true` в `lib/corridor/hub.ts` | `true` | ✅ |
| **Guide fact-check** | `portugal:guide-factcheck` | `spain:guide-factcheck` | ✅ |
| **Note images cron (Vercel)** | `/api/cron/portugal-note-images` | `/api/cron/spain-note-images` | ✅ |
| **Quality gate pass** | `validateNoteDraft` + blueprint (PT) | `validateNoteDraft` (ES geo) | ✅ (no blueprint yet) |

---

## 1. Parser & signals

- [ ] Каналы в `parser/groups.yaml` с `country_key: {country}` (не `@emigro_chat`)
- [ ] `python main.py --once --dry-run` без ошибок
- [ ] Ingest → `community_signals` (`status=new`)
- [ ] Бэкфилл: `npm run {country}:backfill-month` (Portugal) или seed editorial (Spain v1)
- [ ] **Метрика:** ≥100 signals за 30 дней после бэкфилла (цель)

| | Portugal | Spain |
|---|----------|-------|
| Channels | 4 | 5 |
| City focus | Lisboa / Norte | Valencia (+ BCN signals) |
| npm daily | `portugal:daily` | `spain:daily` |

---

## 2. Editorial notes

- [ ] Минимум **7 editorial notes** на старте (Spain: 7 ✅)
- [ ] `body_sections`: glossary first, затем `official` + `practice` + `gap`
- [ ] `key_takeaways`: ≥2 с префиксом «Официально:» / «На практике:» / «Расхождение:»
- [ ] `faq`: guide ≥4, qa/news ≥4, tip/lifehack ≥3
- [ ] `official_links`: ≥2 ссылки на gov/official
- [ ] `content_kind` корректен (guide / qa / tip / lifehack / news)
- [ ] Quality gate: `lib/community-notes/editorial-quality.ts` + `official-vs-practice.ts`

**Portugal reference:** `lib/community-notes/guides/*.ts`, `publish-seed.ts`  
**Spain reference:** `lib/community-notes/guides/spain-*.ts`, `spain-editorial-index.ts`

---

## 3. Images (CRITICAL)

### Per-note hero (satellite cards)

- [ ] **НЕ** использовать один `DEFAULT_OG_IMAGE` для всех карточек
- [ ] `resolveNoteCardImage(note)` → committed WebP **или** distinct static fallback **или** `/api/community-notes/hero/{slug}`
- [ ] Committed WebP: `public/images/community-notes/{slug}.webp` + slug в `lib/community-notes/note-og-slugs.ts`
- [ ] Генерация: `npm run {country}:generate-note-images` (Pexels → 1200×630 WebP)
- [ ] Vercel warm: `/api/cron/{country}-note-images` (Bearer `CRON_SECRET`)

### Spain note → image mapping (Jul 2026)

| Slug | Committed WebP | Static fallback OG |
|------|----------------|-------------------|
| `nie-empadronamiento-poryadok-2026` | ✅ unique | `guide-vnj-ispaniya-2026.jpg` |
| `tie-cita-extranjeria-valencia-2026` | ✅ unique | `guide-otkaz-v-natsionalnoy-vize-konsulstvo-2026.jpg` |
| `dnv-uge-konsulstvo-2026` | ✅ unique | `guide-digital-nomad-portugaliya-ispaniya-italiya-2026.jpg` |
| `arenda-valencia-idealista-2026` | ✅ unique | `guide-pervye-30-dnej-v-ispanii-2026.jpg` |
| `bank-iban-nerezident-ispaniya-2026` | ✅ unique | `guide-bank-i-iban-dlya-rossiyan-v-evrope-2026.jpg` |
| `beckham-autonomo-mify-2026` | ✅ unique | `guide-grazhdanstvo-portugaliya-ispaniya-2026.jpg` |
| `pervye-30-dnej-v-ispanii-satelit-2026` | ✅ unique | `guide-portugaliya-vs-ispaniya-vnj-2026.jpg` |

### Per-guide cover (www pillar)

- [ ] `lib/guides/covers.ts` — `GUIDE_COVER_BY_SLUG` + `resolveGuideCoverPath(slug)` → `public/images/og/guide-{slug}.jpg` если есть
- [ ] **НЕ** делить один `corridor-{country}.jpg` между всеми pillar-гайдами, если есть dedicated OG

**Portugal:** ~25 committed note WebPs; pillar OG JPG для D8/D7, 30 дней PT, etc.  
**Spain:** 7 committed note WebPs; pillar `vnj-ispaniya-2026`, `pervye-30-dnej-v-ispanii-2026` имеют dedicated OG JPG.

---

## 4. SEO

- [ ] `app/sitemap.ts` — satellite hub, `/llms`, `/notes/{slug}`, `/tag/{tag}`
- [ ] `app/llm-sitemap.xml/route.ts` — satellite llms URLs
- [ ] `lib/seo/llms-full.ts` — полный llms с заметками
- [ ] Canonical: `{country}.emigro.online` (env `*_SATELLITE_USE_SUBDOMAIN`)
- [ ] `middleware.ts` — 301 `www.../satellite/{country}` → subdomain
- [ ] Schema: note pages — Article/FAQ (см. `app/satellite/{country}/notes/[slug]/page.tsx`)
- [ ] `seo_description` 140–165 chars, `seo_title` ≤58

---

## 5. Corridor integration (www)

- [ ] `components/{country}/{Country}FeaturedNotes.tsx`
- [ ] `CorridorLanding.tsx` — `is{Country}HubTopic` + FeaturedNotes block
- [ ] `lib/corridor/hub.ts` — `hasPractice: true`
- [ ] Pillar wizard / digest остаются на `www.emigro.online/ru/{country}`

---

## 6. Guide fact-check

- [ ] `lib/guides/{country}-telegram-citations.ts`
- [ ] `scripts/{country}-guide-telegram-factcheck.ts`
- [ ] `npm run {country}:guide-factcheck`
- [ ] `docs/{COUNTRY}_GUIDE_FACTCHECK.md`
- [ ] 3–5 TG-цитат max на pillar-гайд; official = primary

---

## 7. VPS deploy (systemd)

- [ ] `deploy/systemd/emigro-{country}-community.{service,timer}`
- [ ] `parser/run_scheduled_{country}.sh`
- [ ] `cd parser && ./deploy.sh`
- [ ] Логи: `/opt/emigro/parser/logs/scheduled-{country}-*.log`
- [ ] **Не** дублировать community pipeline на Vercel cron

| | Portugal | Spain |
|---|----------|-------|
| Timer | 07:00 UTC | 07:30 UTC |
| Unit | `emigro-portugal-community` | `emigro-spain-community` |

---

## 8. DNS subdomain

- [ ] CNAME `{country}` → `cname.vercel-dns.com`
- [ ] Vercel Domains: `{country}.emigro.online`
- [ ] Проверка: `dig +short {country}.emigro.online CNAME`
- [ ] Fallback dev: `{COUNTRY}_SATELLITE_USE_SUBDOMAIN=false` → path `/satellite/{country}`

---

## 9. Quality gate pass criteria

Перед publish / deploy:

```bash
npm run build   # exit 0 обязателен
```

`validateNoteDraft(draft, countryKey)` должен вернуть `[]`:

| content_kind | sections | faq | takeaways | minWords |
|--------------|----------|-----|-----------|----------|
| guide | ≥4 (+ glossary) | ≥4 | ≥4 | ≥600 |
| qa | ≥3 | ≥4 | ≥3 | ≥450 |
| tip | ≥2 | ≥3 | ≥3 | ≥350 |
| lifehack | ≥2 | ≥3 | ≥2 | ≥280 |
| news | ≥3 | ≥3 | ≥3 | ≥400 |

Дополнительно:

- [ ] `official-vs-practice`: official + practice sections, ≥2 labeled takeaways
- [ ] Portugal guide: `validateAgainstBlueprint` (article-blueprint.ts)
- [ ] `publish-drafts.ts`: Gemini draft проходит gate или отклоняется
- [ ] 1 note/day max (не 2+), Gemini Pro для guide rewrite

---

## Файлы-референсы (Portugal gold)

| Слой | Путь |
|------|------|
| Документация | `docs/PORTUGAL_SATELLITE.md`, `PORTUGAL_CRON.md`, `PORTUGAL_GUIDE_FACTCHECK.md` |
| Satellite UI | `lib/satellite/portugal.ts`, `app/satellite/portugal/*` |
| Images | `lib/community-notes/note-og-image.ts`, `note-og-slugs.ts`, `app/api/community-notes/hero/[slug]/route.ts` |
| Cron images | `app/api/cron/portugal-note-images/route.ts` |
| Guide covers | `lib/guides/covers.ts` |
| Quality | `lib/community-notes/editorial-quality.ts`, `official-vs-practice.ts`, `publish-drafts.ts` |
| Playbook | `docs/CORRIDOR_SATELLITE_PLAYBOOK.md` |

---

## Следующие коридоры

После Spain на 100% checklist: **Germany** → **Poland** → **Czechia** (см. `CORRIDOR_SATELLITE_PLAYBOOK.md`).
