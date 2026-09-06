---
name: launch-satellite
description: >-
  Launches a gold-quality Emigro country satellite with a city focus
  (15 life guides: cheap draft → GPT Sol, search, unique WebPs, Telegram, parser).
  Use when the user names a city or country to spin up a satellite, says
  сателлит, запусти сателлит, satellite 100, replicate Portugal, Valencia,
  Berlin, Warsaw, or asks for Telegram chat name/bio/avatar for a city.
---

# Launch country satellite (gold, not a half-product)

**1 satellite = 1 country** (`{country}.emigro.online`).  
**Focus city** = owned private chat + default practice geo on notes.  
Do **not** create a second satellite for another city in the same country — fold into the existing country hub.

**Definition of done = Portugal gold**, not Spain v1. Spain is a **gap to close**. Read [definition-of-done.md](definition-of-done.md), [portugal-gold.md](portugal-gold.md), [min-guides.md](min-guides.md), and [guides-pipeline.md](guides-pipeline.md) before writing files.

Do **not** declare launched until `npm run satellite:assert-launch -- --country={country} --city={city}` exits 0.

## This pipeline is not one-shot magic

A previous version asked for 15×1500 words + chat + systemd + DNS **in one agent turn**. That produces Spain-thin again: padded FAQs, invented offices, «launched» on file presence.

**Do this instead:**

1. Wire routes/config (clone Spain **pages**, not Spain guides).
2. **CORE 8** — cheap draft (`composer-2.5-fast`) with **WebSearch/WebFetch**; then **GPT Sol** (`gpt-5.6-sol-medium`) reviews. See [guides-pipeline.md](guides-pipeline.md).
3. Unique **WebP + COMMITTED_NOTE_OG_SLUGS for those 8 immediately**. Then life 7 the same way (draft → Sol → images).
4. If context/time runs out after CORE: **stop**. Say «не launched, CORE готов, life слоты: …». Do not invent 7 stubs so assert goes green.
5. Chat `chat_id`, DNS, `systemctl enable` on VPS — **human**. Commit unit files; do not claim cron is live.

Statuses: **stocked** (15 pass quality) · **community** (live chat_id) · **ops files** (systemd committed) · **launched** = all three. Assert cannot verify VPS.

Word count is a floor, not the product. Missing «к 4–6 месяцу» or Nota Emigro → FAIL even at 1500 words.

## Map input → country + focus

| User says | `country_key` | Focus city | Status |
|-----------|---------------|------------|--------|
| Порту / Португалия / PT | `portugal` | `porto` | **GOLD — do not rebuild.** Gap-fill only if asked. |
| Валенсия / Испания / ES | `spain` | `valencia` | Exists but **not gold** (7 thin guides, no live chat/bank). Close gaps; do not clone this as quality. |
| Берлин / Германия | `germany` | `berlin` | New — gold bar, not Spain-thin. |
| Варшава / Польша | `poland` | `warsaw` | New — gold bar, not Spain-thin. |
| Прага / Чехия | `czechia` | `prague` | New — gold bar, not Spain-thin. |

City-only input: map to country. Ambiguous second city in a live country (Braga, Lisboa, Madrid) → **same satellite**, extra geo in guides, **no new subdomain / no new owned chat** unless the user explicitly wants a second chat.

If the satellite already exists: print a gap list vs DoD and close gaps. Do not duplicate hubs.

## What «100» means (gold)

| Surface | Gold (ship) | Not gold |
|---------|-------------|----------|
| Country hub + notes + tags + llms | yes | path-only without DNS plan |
| **15 life guides** cheap draft → **Sol review** + search + unique WebP + **SEO/AEO fields** on **all** slugs same batch | yes | one cheap dump; images «потом»; SERP skipped; «допилим мета» |
| Fact-check **Nota Emigro** + official sources + competitor SEO **+ AEO** (`quick_answer` / FAQ / `ai:description`) in the **same** ship | yes | publish on trust; meta follow-up |
| 3–6 third-party TG chats in `parser/groups.yaml` | yes | `@emigro_chat` / `@Emigro_news` as sources |
| Owned **private city chat** as a **product feature** («для своих»: важное + общение + эксперты) + `city-chats.ts` + live `EMIGRO_{CITY}_CHAT_ID` | yes (user creates group) | public `t.me/+`; CTA without chat_id; timid «просто чат» |
| Group **bank** + discussion prompts (1 / 3 days, recycle 45d) | yes, 15+ slugs | auto-refill; visa dump; “cron later” |
| VPS daily systemd **files** (`emigro-{country}-community.timer`) | yes, committed | claiming cron is live without human `systemctl` |
| Threads | city notes + chat CTA on satellite stream | new Threads account |
| News channel | keep `@Emigro_news` | per-country news channel |
| DNS `{country}.emigro.online` + middleware + `SatelliteCountryKey` + funnel-urls | yes | leftover `if (spain) else portugal` forever |
| Corridor FeaturedNotes + `hasPractice` | yes | extra pillars on www unless corridor exists |
| HubDepth + city chat CTA on hub **and** notes | yes | thin hub without inventory |
| **Wizard → bot → city chat** | yes | always-Porto invite; `t.me/+` |
| Unique note WebPs + `COMMITTED_NOTE_OG_SLUGS` **for all 15 at stocked** | yes | shared DEFAULT_OG; cron later; untracked `public/images/` |
| `npm run build` + **assert-launch PASS** | yes | “ship and grow later” |

**Banks** = `lib/community-notes/{city}-group-bank.json` (chat post queue) + Threads CTA bank rows. Also write the **bank/IBAN guide** as the `bank` slot.

## Stop for the user (only these)

Agent cannot create a Telegram group. After the brief, send this card and keep coding the rest:

```
Создай в Telegram закрытую группу (не канал, не публичный @):

Название: {CityRu} и вокруг
Описание:
Для своих в {CityRu} и вокруг.
Публикуем важное, общаемся, эксперты отвечают на вопросы.
Без визового флуда и стены объявлений.
Гайды: https://{country}.emigro.online

Аватар: файл ниже (640×640). Загрузить в группу.
1) Добавь @emigro_chat_bot админом с правом Invite users via link
2) Пришли сюда chat_id (перешли любое сообщение боту / дай id из @userinfobot)

Пока id нет — чат на сайте не включаем и сателлит не называем launched.
```

Generate the avatar (Emigro mark + city, square). Do not invent a public invite hash.

If the group already exists (Portugal): skip the card.

DNS: tell the user CNAME `{country}` → `cname.vercel-dns.com` and add `{country}.emigro.online` in Vercel. Do not call launched before DNS is planned in the brief.

## Agent workflow (one turn as far as possible)

Copy this checklist and tick it.

```
- [ ] 0 Brief: country_key, focus city, corridor exists?, satellite exists?, gold vs gap
- [ ] 1 Search 3–6 relocant TG chats (city + country); attach to groups.yaml
- [ ] 2 User card: chat name / bio / avatar / bot admin
- [ ] 3 Clone Spain **routes/layout** (HubDepth + CityChatCta already there) + lib/satellite/{country}.ts + middleware + site-url + seed union + funnel-urls
- [ ] 4 CORE 8: cheap draft + **search** + **SEO/AEO fields** → **GPT Sol** review ([guides-pipeline.md](guides-pipeline.md)). Then life 7 the same. Never 15 stubs. Never «мета потом».
- [ ] 4b Unique WebP + `COMMITTED_NOTE_OG_SLUGS` for **every** accepted slug **immediately** (`{country}:generate-note-images`, git add)
- [ ] 5 Editorial index: `{COUNTRY}_EDITORIAL_GUIDES` + `{COUNTRY}_GUIDE_SLOTS` (all 15 keys)
- [ ] 6 Group bank JSON + `{city}-group-prompts.ts` + `{country}-post-group-note.ts` (clone porto-group-*)
- [ ] 7 Registry row in `lib/satellite/city-chats.ts`; env on Vercel + VPS when chat_id arrives
- [ ] 8 Wizard funnel is automatic once the row is live — do not clone Porto-only CTAs
- [ ] 9 HubDepth + SatelliteCityChatCta on hub + notes
- [ ] 10 FeaturedNotes; hasPractice; Threads inventory (heroes already in 4b)
- [ ] 11 systemd **files** (clone spain-community). Print enable commands. Do not claim VPS is live.
- [ ] 12 DNS instructions + npm run build
- [ ] 13 `npm run satellite:assert-launch -- --country={country} --city={city}` must PASS
- [ ] 14 Upsert notes. Do not git push unless asked. Do not say launched if assert fails or chat_id missing.
```

### 0 — Brief (first reply)

```
Satellite: {country}.emigro.online
Focus city: {city} ({CityRu})
Clone files from: Spain routes (HubDepth + chat CTA)
Quality bar: Portugal gold — 15 life guides (week 0 → month 6), owned chat, bank, VPS cron
Owned chat: {CityRu} и вокруг → @emigro_chat_bot?start={city}_chat
Parser: @a @b @c …
Min guides: 15 slots covering papers, home, money, health, districts, transport, family, consulate, work/SS, rhythm
User action: create group (card) + DNS CNAME
Gate: npm run satellite:assert-launch -- --country={country} --city={city}
```

### 1 — Find Telegram chats

Search (WebSearch / tgstat / t.me): `{CityRu} чат`, `{country} релокация telegram`, `{city} русские экспаты`, visa keywords from [portugal-gold.md](portugal-gold.md).

Pick **3–6**:

- 1–2 focus-city chats
- 1–2 country-wide relocant
- 0–1 specialty (auto / housing) if active

Reject: tourism ads, one-shot news, owned Emigro surfaces, dead chats.

Write `parser/groups.yaml` with `country_key` + `city`. Mirror handles in `lib/satellite/{country}.ts` → `sourceChannels`.

### 3 — Clone Spain files, Portugal quality

Portugal is the **quality bar**. Spain is the **file template** (5 app routes + HubDepth + CityChatCta). Do **not** copy Spain’s 7 short guides as the body target.

Clone `app/satellite/spain/*`, `lib/satellite/spain.ts`, `components/satellite/SpainSatelliteLayout.tsx`.  
Wire `middleware.ts`, `lib/site-url.ts`, `lib/satellite/paths.ts`, `lib/community-notes/seed.ts` (`SatelliteCountryKey`), `lib/satellite/funnel-urls.ts`, sitemap/robots.

Do not add `if (spain) … else portugal` forever — extend the union and a small config object.

### 4–5 — Guides

See [min-guides.md](min-guides.md) and [guides-pipeline.md](guides-pipeline.md).

**Cheap draft** (`composer-2.5-fast`) with WebSearch/WebFetch + SERP. **GPT Sol** (`gpt-5.6-sol-medium`) re-fetches official URLs and rejects padding. Orchestrator does not upsert until Sol accepts the batch.

Write CORE 8 first, then life 7. For each slot **read** `SATELLITE_LAUNCH_CLONE_FROM` (Portugal file) before drafting. If there is no clone file (`home_setup`, `work_ss`), write from official portals — do not clone a Spain tip.

`SATELLITE_LAUNCH_PT_SLOT_CAVEATS` — PT slug may be the wrong *topic* (renewal vs arrival, internet vs SIM, SS-risk vs NISS how-to). Match length and official/practice, not the PT plot.

Fact-check: fetch BOE / gov / consulate page. If not fetched, Nota lists UNCHECKED — never silent-guess, never pad.

**Images in the same batch as Sol OK:** `npm run {country}:generate-note-images -- {slug}` for every accepted slug, unique WebP ≥20KB, `COMMITTED_NOTE_OG_SLUGS`, `git add public/images/community-notes/{slug}.webp`. No «картинки потом».

Export `{COUNTRY}_GUIDE_SLOTS` with **all 15** keys from `SATELLITE_LAUNCH_SLOTS`. Missing slot = assert FAIL.

Publish: `npm run {country}:upsert-editorial` (clone `scripts/spain-upsert-editorial.ts`). `city` field = focus city slug.

The owned chat is a **product feature**, not a leftover Telegram group:

- Pitch on every live surface (`CityChatPitch`): **для своих** = важное + общение + эксперты отвечают.
- Copy lives in `lib/satellite/city-chat-copy.ts` — hub, notes, wizard, bot invite, Telegram bio, `/ru/community`.
- Group bank posts **discussion**, not visa dumps. Pavel/Emigro answers until the room talks.
- Never `t.me/+` on the site.

### 6–8 — Owned chat + wizard funnel + discussion (not later)

Clone Porto **add** a city — do not reuse `EMIGRO_PORTO_CHAT_ID` / `porto_chat`.

1. User creates the private group (card above). Bot admin + Invite users via link.
2. Add **one row** to `SATELLITE_CITY_CHATS` in `lib/satellite/city-chats.ts`.
3. Env on **Vercel + VPS**: `EMIGRO_{CITY}_CHAT_ID=…`
4. Until chat_id is set, `isCityChatLive` is false → **no** CTA on wizard/site (do not leak Porto to the wrong country). **Assert fails** — do not call launched.

After the row is live, **do not clone** `WizardPortugalPracticeCta` / handle-update:

- Hub `/ru/wizard` results: pick.countrySegment → that chat
- Corridor `/ru/{country}/results`: topic → that chat
- Site button: `@emigro_chat_bot?start={city}_chat_wizhub` (never `t.me/+`)
- Bot `/start wiz_hub_*` / `wiz_corridor_*`: send report, **then** invite to the chat for that wizard country
- Bare `/start` and nav «Чат» stay Porto (default live community)

Bank: city-life slugs first (districts, health, local_life); 1 discussion / 3 days; recycle 45d. Clone `porto-group-prompts.ts` (hook + question, not a visa dump). Wire `{country}:daily` to post when due — same as Portugal, not “editorial-only like Spain”.

### 10 — Threads

One brand account. Add notes to `lib/threads/inventory.ts` satellite picker. CTA = bot start link, Assist, or wizard. Run `npm run threads:assert-banks` if banks change.

### 11–14 — Ship

- systemd: clone `deploy/systemd/emigro-spain-community.{service,timer}` in the **same** turn
- DNS: CNAME `{country}` → `cname.vercel-dns.com`; Vercel domain `{country}.emigro.online`
- `npm run build` must pass
- `npm run satellite:assert-launch -- --country={country} --city={city}` must pass
- Commit / push only if the user asked
- If assert fails: print FAIL list; keep working; never say «сателлит запущен»

## Hard rules

- No thin household / one-shot notes (`.cursor/rules/portugal-no-thin-household-guides.mdc`).
- Telegram = signals, not copy-paste. Notes: `official | practice | gap`.
- Do not parse or cite `@emigro_chat` / `@Emigro_news` as field practice.
- Do not deploy if build fails. Do not `vercel --prod` after push to `main`.
- Monetization on hub: Assist + corridor wizard; Prep2Go only on PT language surfaces.
- Spain-thin (7 guides, no chat, no bank, no VPS) is a **debt**, not a template.
