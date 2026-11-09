#!/usr/bin/env bash
# Friday morning weekend digest → Portugal channel, Milan chat, Valencia chat.
# Links point at the detailed event posts already in each feed.

set -euo pipefail

SCRIPT_ROOT="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_ROOT/../.." && pwd)"
cd "$REPO_ROOT"

LOG_DIR="$SCRIPT_ROOT/logs"
LOCK_FILE="$LOG_DIR/.scheduled.lock"
mkdir -p "$LOG_DIR"

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

log "=== Outdoor weekend digest ==="

run_digest() {
  npx tsx scripts/outdoor-weekend-digest.ts
}

if ! command -v flock >/dev/null 2>&1; then
  run_digest
else
  exec 9>"$LOCK_FILE"
  if ! flock -n 9; then
    log "=== Outdoor digest skipped (already running) ==="
    exit 0
  fi
  run_digest
fi

log "=== Outdoor digest finished OK ==="
