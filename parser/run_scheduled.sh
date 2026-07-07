#!/usr/bin/env bash
# Daily Portugal community pipeline (VPS systemd — same pattern as Barakhlo parser).
#
# Prod: systemd timer emigro-portugal-community.timer (07:00 UTC).
# See docs/PORTUGAL_CRON.md.
#
# Flow: sync cursor → Telethon → Supabase signals → Gemini draft → spotlight.

set -euo pipefail

PARSER_ROOT="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$PARSER_ROOT/.." && pwd)"
cd "$REPO_ROOT"

LOG_DIR="$PARSER_ROOT/logs"
LOCK_FILE="$PARSER_ROOT/.scheduled.lock"
mkdir -p "$LOG_DIR" "$PARSER_ROOT/out"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S %Z')] $*"
}

exec >> "$LOG_DIR/scheduled-$(date +%Y%m%d).log" 2>&1

if [[ -f "$PARSER_ROOT/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$PARSER_ROOT/.env"
  set +a
fi
if [[ -f "$REPO_ROOT/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$REPO_ROOT/.env"
  set +a
fi

export PARSER_MAX_AGE_HOURS="${PARSER_MAX_AGE_HOURS:-36}"
export PARSER_INCREMENTAL_LIMIT="${PARSER_INCREMENTAL_LIMIT:-60}"
export PORTUGAL_SATELLITE_USE_SUBDOMAIN="${PORTUGAL_SATELLITE_USE_SUBDOMAIN:-true}"
export EMIGRO_PUBLIC_SITE_URL="${EMIGRO_PUBLIC_SITE_URL:-https://www.emigro.online}"

log "=== Emigro Portugal daily (age<=${PARSER_MAX_AGE_HOURS}h, limit=${PARSER_INCREMENTAL_LIMIT}/ch) ==="

RUN_DAILY="cd '$REPO_ROOT' && npm run portugal:daily"

if ! command -v flock >/dev/null 2>&1; then
  RUN=(bash -c "$RUN_DAILY")
else
  RUN=(flock -n "$LOCK_FILE" bash -c "$RUN_DAILY")
fi

if "${RUN[@]}"; then
  log "=== Portugal daily finished OK ==="
  exit 0
else
  code=$?
  if [[ "$code" -eq 1 ]]; then
    log "=== Portugal daily skipped (already running) ==="
    exit 0
  fi
  log "=== Portugal daily FAILED (exit $code) ==="
  exit "$code"
fi
