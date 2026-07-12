#!/usr/bin/env bash
# Weekly volatile guides fact-check → owner Telegram DM (private).
#
# Prod: systemd timer emigro-volatile-guides-factcheck.timer (Mon 08:00 UTC).
# See docs/VOLATILE_GUIDE_FACTCHECK.md.

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

log "=== Emigro volatile guides fact-check ==="

RUN_CMD="cd '$REPO_ROOT' && npm run guides:volatile-factcheck -- --notify"

if ! command -v flock >/dev/null 2>&1; then
  RUN=(bash -c "$RUN_CMD")
else
  RUN=(flock -n "$LOCK_FILE" bash -c "$RUN_CMD")
fi

if "${RUN[@]}"; then
  log "=== Volatile guides fact-check finished OK ==="
  exit 0
else
  code=$?
  if [[ "$code" -eq 1 ]]; then
    log "=== Volatile guides fact-check skipped (already running) ==="
    exit 0
  fi
  log "=== Volatile guides fact-check FAILED (exit $code) ==="
  exit "$code"
fi
