#!/usr/bin/env bash
# Legacy alias → full VPS pipeline (parser + Supabase + Gemini + spotlight).
# Prod: systemd emigro-portugal-community.timer — see docs/PORTUGAL_CRON.md
exec "$(cd "$(dirname "$0")" && pwd)/run_scheduled.sh"
