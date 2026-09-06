#!/usr/bin/env bash
# Stream 2: Portugal satellites / Porto chat on top of daily guides.
# Failures → owner Telegram DM (same as daily).
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

notify_fail() {
  local msg="$1"
  log "notify owner: $msg"
  npx tsx scripts/threads-cron-notify.ts --stream=satellites --error="$msg" || log "notify DM failed"
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

log "=== Emigro Threads satellites ==="

if command -v flock >/dev/null 2>&1; then
  exec 9>"$LOCK_FILE"
  if ! flock -n 9; then
    log "=== Threads satellites skipped (lock held) ==="
    exit 0
  fi
fi

set +e
OUT="$(npm run threads:satellites -- --force-publish 2>&1)"
code=$?
set -e
printf '%s\n' "$OUT"

if [[ "$code" -eq 0 ]]; then
  log "=== Threads satellites finished OK ==="
  exit 0
fi

log "=== Threads satellites FAILED (exit $code) ==="
notify_fail "exit ${code}"$'\n'"$(printf '%s\n' "$OUT" | tail -c 3000)"
exit "$code"
