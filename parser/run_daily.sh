#!/usr/bin/env bash
# Daily cron: incremental Telethon → POST /api/v1/ingest/community-signals
# Crontab example (08:00 Europe/Lisbon ≈ 07:00 UTC in winter):
#   0 7 * * * cd /path/to/emigro/parser && ./run_daily.sh >> logs/daily.log 2>&1

set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

export EMIGRO_API_URL="${EMIGRO_API_URL:-https://www.emigro.online}"
export PARSER_MAX_AGE_HOURS="${PARSER_MAX_AGE_HOURS:-36}"
export PARSER_INCREMENTAL_LIMIT="${PARSER_INCREMENTAL_LIMIT:-60}"

mkdir -p logs out

echo "[$(date -Iseconds)] portugal parser daily start"
python3 main.py --once
echo "[$(date -Iseconds)] portugal parser daily done"
