#!/usr/bin/env bash
# Every new northern Italy outdoor event → @milan_echat.
# Timer: emigro-italy-outdoor.timer (Europe/Rome).

set -euo pipefail

SCRIPT_ROOT="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_ROOT/../.." && pwd)"
cd "$REPO_ROOT"

LOG_DIR="$SCRIPT_ROOT/logs"
LOCK_FILE="$LOG_DIR/.scheduled.lock"
mkdir -p "$LOG_DIR" "$SCRIPT_ROOT/state"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S %Z')] $*"
}

exec >> "$LOG_DIR/scheduled-$(date +%Y%m%d).log" 2>&1

if [[ -f "$REPO_ROOT/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$REPO_ROOT/.env"
  set +a
fi

log "=== Italy outdoor channel ==="

run_channel() {
  npx tsx scripts/italy-outdoor-channel.ts
}

if ! command -v flock >/dev/null 2>&1; then
  run_channel
else
  exec 9>"$LOCK_FILE"
  if ! flock -n 9; then
    log "=== Italy outdoor skipped (already running) ==="
    exit 0
  fi
  run_channel
fi

log "=== Italy outdoor finished OK ==="
