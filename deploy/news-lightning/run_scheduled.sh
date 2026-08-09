#!/usr/bin/env bash
# Spaced #молния posts to @Emigro_news (separate from news:stories).
#
# Prod: systemd timer emigro-news-lightning.timer (11/13/15/17/19 UTC).
# See docs/PORTUGAL_NEWS_STORIES_CRON.md.

set -euo pipefail

SCRIPT_ROOT="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_ROOT/../.." && pwd)"
cd "$REPO_ROOT"

LOG_DIR="$SCRIPT_ROOT/logs"
# Lock must live in logs/ — www-data can write there; parent dir is often root-owned after rsync.
LOCK_FILE="$LOG_DIR/.scheduled.lock"
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

log "=== Emigro news lightning (#молния → @Emigro_news) ==="

RUN_CMD="cd '$REPO_ROOT' && npm run news:lightning"

if ! command -v flock >/dev/null 2>&1; then
  RUN=(bash -c "$RUN_CMD")
else
  RUN=(flock -n "$LOCK_FILE" bash -c "$RUN_CMD")
fi

if "${RUN[@]}"; then
  log "=== News lightning finished OK ==="
  exit 0
else
  code=$?
  if [[ "$code" -eq 1 ]]; then
    log "=== News lightning skipped (already running) ==="
    exit 0
  fi
  log "=== News lightning FAILED (exit $code) ==="
  exit "$code"
fi
