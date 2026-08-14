# Lightning → Threads after Telegram approve

## Goal

Owner taps ✅ on #молния DM → **Telegram stays one channel post** (current HTML) **and** Threads gets the **hook + slides reply-chain** already composed for pv.inform.

## Flow

1. Cron builds TG HTML + Threads draft (`reshapeNewsForThreadsRepost`).
2. Persist draft JSON in `threads_text` with pending prefix (still “awaiting owner”).
3. Owner ✅ → `approvePendingLightning`:
   - publish Telegram HTML to `@Emigro_news` (unchanged);
   - `composeThreadsChainFromRepost` → `publishThreadsChain({ forcePublish: true })`;
   - soft-fail Threads: TG stays; on any publish error — **отдельная личка** владельцу.
4. Skip ❌ unchanged (no Threads).

## Formats

| Channel | Format |
|---------|--------|
| Telegram | One `#молния` post (flag, title, slides/excerpt, source, Emigro link) |
| Threads | **1/2** OG image + packed caption (≤500 UTF-8 bytes) · **2/2** Telegram CTA |

## Gates

- Live Threads only after owner approve (same webhook path).
- Requires `THREADS_AUTO_PUBLISH=1` + tokens on **Vercel** (webhook host).
- No separate Threads approve button.

## Non-goals

- Auto-post digests/guides to Threads.
- Rolling back Telegram if Threads fails.
