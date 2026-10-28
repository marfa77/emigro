#!/usr/bin/env bash
# One outdoor experience from aggregated Norte sources → @emigro_portugal.
# Timer: emigro-portugal-outdoor.timer (Europe/Lisbon).

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

log "=== Portugal outdoor channel ==="

RUN_CMD="cd '$REPO_ROOT' && npx tsx scripts/portugal-outdoor-channel.ts"

if ! command -v flock >/dev/null 2>&1; then
  RUN=(bash -c "$RUN_CMD")
else
  RUN=(flock -n "$LOCK_FILE" bash -c "$RUN_CMD")
fi

if "${RUN[@]}"; then
  log "=== Portugal outdoor finished OK ==="
  exit 0
else
  code=$?
  if [[ "$code" -eq 1 ]]; then
    log "=== Portugal outdoor skipped (already running) ==="
    exit 0
  fi
  log "=== Portugal outdoor FAILED (exit $code) ==="
  exit "$code"
fi
