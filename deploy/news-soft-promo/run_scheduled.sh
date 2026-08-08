#!/usr/bin/env bash
# Weekly soft promo → @Emigro_news (spaced weekday + random delay).
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

export EMIGRO_SOFT_PROMO_STATE="${EMIGRO_SOFT_PROMO_STATE:-$SCRIPT_ROOT/.last-iso-week}"

log "=== Emigro soft promo (weekly product post) ==="

RUN_CMD="cd '$REPO_ROOT' && npm run news:soft-promo"

if ! command -v flock >/dev/null 2>&1; then
  RUN=(bash -c "$RUN_CMD")
else
  RUN=(flock -n "$LOCK_FILE" bash -c "$RUN_CMD")
fi

if "${RUN[@]}"; then
  log "=== Soft promo finished OK ==="
  exit 0
else
  code=$?
  if [[ "$code" -eq 1 ]]; then
    log "=== Soft promo skipped (already running) ==="
    exit 0
  fi
  log "=== Soft promo FAILED (exit $code) ==="
  exit "$code"
fi
