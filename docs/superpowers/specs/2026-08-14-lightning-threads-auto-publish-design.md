# Lightning → separate Telegram / Threads approve

## Goal

Owner approves **Telegram** and **Threads independently**. Not everything that belongs in `@Emigro_news` should go to Threads (and vice versa).

## Flow

1. Cron builds TG HTML + Threads draft (`reshapeNewsForThreadsRepost`).
2. Persist draft JSON in `threads_text` with `__lightning_pending__`.
3. Owner DM buttons:
   - ✅ Telegram
   - ✅ Threads
   - ❌ Пропуск всего
4. After one channel publishes, DM updates to the remaining channel only:
   - TG live → `__lightning_threads_pending__` + ✅ Threads / ❌ Без Threads
   - Threads live → `__lightning_tg_pending__` + ✅ Telegram / ❌ Без Telegram
5. Soft-fail: failed publish keeps the pending mark; owner gets a DM error.

## Markers (`threads_text`)

| Mark | Meaning |
|------|---------|
| `__lightning_pending__` | Neither channel decided yet |
| `__lightning_threads_pending__` | Telegram published; Threads still awaiting |
| `__lightning_tg_pending__` | Threads published; Telegram still awaiting |

## Formats

| Channel | Format |
|---------|--------|
| Telegram | One `#молния` post (flag, title, slides/excerpt, source, Emigro link) |
| Threads | **1/2** text (≤500 UTF-8 bytes) · **2/2** Emigro `/ru/go/telegram` bridge → TG |

## Gates

- Live publish only after the matching owner button (webhook on Vercel).
- Requires `THREADS_AUTO_PUBLISH=1` + tokens on **Vercel** for Threads.
- Legacy `lg:ok` (TG + Threads) still works for old DMs.

## Non-goals

- Auto-post digests/guides to Threads.
- Rolling back Telegram if Threads fails (or the reverse).
