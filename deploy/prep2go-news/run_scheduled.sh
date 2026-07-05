#!/usr/bin/env bash
# Daily Prep2Go news import (VPS systemd — same host as Portugal parser).
#
# Prod: systemd timer emigro-prep2go-news.timer (09:00 UTC).
# See docs/PREP2GO_CRON.md.
#
# Flow: fetch latest Prep2Go digest → Gemini RU translation → emigro_news_digests → Telegram.

set -euo pipefail

SCRIPT_ROOT="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_ROOT/../.." && pwd)"
cd "$REPO_ROOT"

LOG_DIR="$SCRIPT_ROOT/logs"
LOCK_FILE="$SCRIPT_ROOT/.scheduled.lock"
mkdir -p "$LOG_DIR"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S %Z')] $*"
}

exec >> "$LOG_DIR/scheduled-$(date +%Y%m%d).log" 2>&1

if [[ -f "$REPO_ROOT/parser/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$REPO_ROOT/parser/.env"
  set +a
fi
if [[ -f "$REPO_ROOT/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$REPO_ROOT/.env"
  set +a
fi

log "=== Emigro Prep2Go news daily ==="

RUN_DAILY="cd '$REPO_ROOT' && npm run news:import-prep2go -- --daily"

if ! command -v flock >/dev/null 2>&1; then
  RUN=(bash -c "$RUN_DAILY")
else
  RUN=(flock -n "$LOCK_FILE" bash -c "$RUN_DAILY")
fi

if "${RUN[@]}"; then
  log "=== Prep2Go news daily finished OK ==="
  exit 0
else
  code=$?
  if [[ "$code" -eq 1 ]]; then
    log "=== Prep2Go news daily skipped (already running) ==="
    exit 0
  fi
  log "=== Prep2Go news daily FAILED (exit $code) ==="
  exit "$code"
fi
