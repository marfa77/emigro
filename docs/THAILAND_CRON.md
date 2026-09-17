# Thailand satellite — production operations

The Thailand community pipeline runs on the existing VPS through systemd. It is not duplicated in Vercel cron.

## Schedule

- `emigro-thailand-community.timer`: every day at 08:00 UTC, persistent after reboot.
- Service: `parser/run_scheduled_thailand.sh` → `npm run thailand:daily`.
- Sources: third-party Thailand/Phuket chats in `parser/groups.yaml`; owned Emigro chats are never parsed.
- Output: signals, at most one reviewed draft, spotlight refresh, and at most one Phuket discussion every three days.

## Required VPS environment

```env
TG_API_ID=
TG_API_HASH=
TG_SESSION_STRING=
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
GOOGLE_API_KEY=
EMIGRO_NEWS_FAST_MODEL=gemini-2.5-flash
THAILAND_SATELLITE_USE_SUBDOMAIN=true
EMIGRO_CHAT_BOT_TOKEN=
EMIGRO_PHUKET_CHAT_ID=
```

`EMIGRO_PHUKET_CHAT_ID` is the private group Bot API ID, never a `t.me/+` invite hash.

## Enable after deploy

```bash
sudo cp /opt/emigro/deploy/systemd/emigro-thailand-community.service /etc/systemd/system/
sudo cp /opt/emigro/deploy/systemd/emigro-thailand-community.timer /etc/systemd/system/
sudo chmod +x /opt/emigro/parser/run_scheduled_thailand.sh
sudo systemctl daemon-reload
sudo systemctl enable --now emigro-thailand-community.timer
systemctl list-timers --all | grep emigro-thailand
```

Manual checks:

```bash
npm run thailand:daily -- --skip-drafts
npm run thailand:post-group -- --dry-run
npm run satellite:assert-launch -- --country=thailand --city=phuket
```
