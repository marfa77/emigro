#!/usr/bin/env bash
# Poll Threads comments, draft, DM owner. Publish only after Telegram ✅.
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

log "=== Emigro Threads replies (ask owner) ==="

RUN_CMD="cd '$REPO_ROOT' && npm run threads:replies -- --ask-owner"

if command -v flock >/dev/null 2>&1; then
  exec 9>"$LOCK_FILE"
  if ! flock -n 9; then
    log "=== Threads replies skipped (lock) ==="
    exit 0
  fi
fi

if bash -c "$RUN_CMD"; then
  log "=== Threads replies finished OK ==="
  exit 0
fi
code=$?
log "=== Threads replies FAILED (exit $code) ==="
exit "$code"
