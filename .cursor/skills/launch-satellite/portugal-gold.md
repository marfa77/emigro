# Portugal gold — country satellite, city focus = Porto

Use this as the **quality bar and definition of launched**. Clone **Spain routes** for file speed; write **Portugal-length** guides and live surfaces. Do **not** ship Spain-shaped (7 thin editorial, no owned chat, “cron later”).

## Identity

| Field | Value |
|-------|--------|
| Host | `portugal.emigro.online` |
| `country_key` | `portugal` |
| Focus city | `porto` (Norte: Porto, Braga, Minho; Lisboa as second geo) |
| Config | `lib/satellite/portugal.ts` |
| Corridor | `https://www.emigro.online/ru/portugal` |
| Pillar | `vnj-portugaliya-d8-d7-grazhdanstvo-2026` |
| Wizard | `/ru/portugal/wizard` |

## Owned surfaces (Emigro)

| Surface | What | Do not |
|---------|------|--------|
| `@Emigro_news` | National news + lightning | New per-country news channel |
| `@emigro_chat` | Comments linked to the channel | Parse as practice; public join CTA |
| **Порту и вокруг** | Private group, no public @ | `t.me/+` on site |
| Join | `@emigro_chat_bot?start={city}_chat` — wizard results + after TG report | Invite hash in HTML |
| Env | `EMIGRO_PORTO_CHAT_ID`, `EMIGRO_CHAT_BOT_TOKEN` | — |
| Group bank | `lib/community-notes/porto-group-bank.json` — 1 discussion / 3 days; recycle 45d | Auto-refill from new drafts; daily dumps |
| Daily post | `portugal:daily` → discussion prompt if due (3 days) | Visa dump into city chat |
| Threads | Brand account; satellite stream every 2 days | Second Threads login |
| VPS | `emigro-portugal-community.timer` | Vercel cron for community ingest |

Chat copy (gold):

- **Name:** Порту и вокруг
- **Bio:** Для своих в Порту и вокруг. Публикуем важное, общаемся, эксперты отвечают на вопросы. Без визового флуда и стены объявлений. Гайды: https://portugal.emigro.online
- **Pitch:** `lib/satellite/city-chat-copy.ts` — важное + общение + эксперты
- CTA: `SatelliteCityChatCta` / `CityChatPitch` (`PortoChatCta` is a thin wrapper)

## Parser (third-party only)

`parser/groups.yaml` + `PORTUGAL_SATELLITE.sourceChannels`:

`@chatlisboa`, `@por_tugal`, `@lepta`, `@autolife_pt`, `@braga_pt_rus`

Signals → `community_signals` → editorial notes. Not copy-paste.

## 15 life topics (0–6 months) — Portugal names

См. [min-guides.md](min-guides.md). Зафиксировано: чеклист 30 дней · NIF · SIM/интернет/ЖКХ · аренда · AIMA · виза/продление · банк · медицина · районы · транспорт/авто · школа/семья · жёлтые страницы · консульство · SS/работа · климат/ритм к 4–6 месяцу.

Spain mapped a subset (NIE, TIE, DNV, аренда, банк, Beckham, 30 дней) and **stopped**. A new country must finish all **15** + chat + bank + systemd.

Do **not** ship buy-land, festivals, or wine as the launch set.

## Code map

| Layer | Path |
|-------|------|
| Hub | `app/satellite/portugal/*` |
| Daily | `scripts/portugal-community-daily.ts` |
| Group prompts | `lib/community-notes/porto-group-prompts.ts` |
| Cron | `docs/PORTUGAL_CRON.md` |
| Quality | `lib/community-notes/editorial-quality.ts`, `official-vs-practice.ts`, `article-blueprint.ts` |
| Featured | `lib/portugal/featured-notes.ts` |
| Threads sat | `lib/threads/satellite-pipeline.ts` |
| Launch gate | `npm run satellite:assert-launch` |
| DoD | [definition-of-done.md](definition-of-done.md) |

## Spain vs Portugal

| | Portugal | Spain today |
|--|----------|-------------|
| Guides | many, 1200–2000w system pieces | 7 editorial ~900–1100w |
| Owned city chat | live | registry row, **no** chat_id |
| Group bank + discussion | live | missing |
| HubDepth + chat CTA | yes | hub wired; CTA hidden until chat_id |
| VPS daily | yes | systemd files exist; still not gold |

**Clone Spain for files. Clone Portugal for quality. Assert must FAIL on Spain until gaps close.**
