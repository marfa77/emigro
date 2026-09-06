# Satellite gold — definition of done

A satellite is **launched** only when stocked + community + ops files are true. Spain v1 is **not** done.

Statuses (say these words; do not collapse to «запущен» early):

- **stocked** — 15 guides pass assert quality (CORE 8 first, no stubs)
- **community** — live `EMIGRO_{CITY}_CHAT_ID`
- **ops files** — systemd unit committed (human enables on VPS)
- **launched** — all three

Gate: `npm run satellite:assert-launch -- --country={country} --city={city}` exits **0**. Assert cannot see VPS.

## Product

- [ ] One host: `{country}.emigro.online` (DNS CNAME + Vercel domain + middleware)
- [ ] One focus city: owned private chat «{CityRu} и вокруг», default `city` on notes
- [ ] No second satellite for another city in the same country
- [ ] No public `t.me/+` on the site; join via `@emigro_chat_bot?start={city}_chat`
- [ ] National news stays `@Emigro_news`; do not parse `@emigro_chat`

## Editorial (15 life guides, week 0 → month 6)

- [ ] `{COUNTRY}_EDITORIAL_GUIDES` has **15** `content_kind: "guide"` — CORE 8 cheap→**Sol**, then life 7; no stubs
- [ ] Each guide: live **search** (official fetch + SERP) recorded in Nota
- [ ] Unique `public/images/community-notes/{slug}.webp` ≥20KB **for all 15** + slug in `COMMITTED_NOTE_OG_SLUGS` (same batch, git-tracked)
- [ ] `{COUNTRY}_GUIDE_SLOTS` has all keys in `SATELLITE_LAUNCH_SLOTS` (papers, home, money, health, districts, transport, family, consulate, work/SS, rhythm)
- [ ] Each guide ≥ **1200** words (target 1500), ≥6 sections, glossary first, ≥4 FAQ, labeled takeaways, ≥2 official links
- [ ] Each slot answers `mustAnswer` in `SATELLITE_LAUNCH_SLOT_META` and has a **«к 4–6 месяцу»** beat
- [ ] **SEO + AEO in the same batch** as Sol OK: `primaryQuery` / `aeoQuestion` / `seoAnyOf`; `satelliteGuideSeoAeoGaps` empty (title 24–58 + year + geo, description 140–165, excerpt ≠ meta, quick_answer ≥180, FAQ По правилам/На практике, tags, official https). No «SERP later»
- [ ] Note pages: `ai:description` in head (`withSatelliteAiMetadata`), `data-llm="facts|commercial"`, satellite `/llms` with llm UTM
- [ ] Fact-check Nota + competitor SEO in the same ship
- [ ] No thin household standalone notes; no buy-land / festivals as v1

## Community loop (same turn — not later)

- [ ] 3–6 third-party chats in `parser/groups.yaml` with `country_key`
- [ ] Row in `SATELLITE_CITY_CHATS` + `EMIGRO_{CITY}_CHAT_ID` **set** (Vercel + VPS)
- [ ] Surfaces pitch the chat as **для своих**: важное + общение + эксперты (`CityChatPitch` on hub, notes, wizard)
- [ ] `{city}-group-bank.json` ≥15 slugs, policy 1 discussion / 3 days, recycle 45d
- [ ] `{city}-group-prompts.ts` — hook + question, not a dump
- [ ] `{country}-post-group-note.ts` wired from `{country}:daily`
- [ ] `deploy/systemd/emigro-{country}-community.{service,timer}` committed

## Site + funnel

- [ ] `SatelliteHubDepth` on the hub
- [ ] `SatelliteCityChatCta` on hub + notes (hidden until chat live — then visible)
- [ ] Wizard hub + corridor results invite **this** country’s chat, not Porto
- [ ] FeaturedNotes on www corridor + `hasPractice`
- [ ] `SatelliteCountryKey` + `funnel-urls.ts` extended (no silent Portugal fallback)
- [ ] Threads inventory knows the country; CTA = bot start / Assist / wizard
- [ ] Assist + wizard CTAs on hub (Prep2Go only Portugal language)

## Ship

- [ ] `npm run build` pass
- [ ] `satellite:assert-launch` pass
- [ ] Notes upserted
- [ ] git push / Vercel only if the user asked

**If chat_id is missing or assert fails → say «не launched», list gaps, keep the CTA off.**
