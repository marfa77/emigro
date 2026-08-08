#!/usr/bin/env bash
# Daily SEO guide soft promo → owner DM approval → @Emigro_news
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

log "=== Emigro guide telegram queue ==="

RUN_CMD="cd '$REPO_ROOT' && npm run news:guide-promo"

if ! command -v flock >/dev/null 2>&1; then
  RUN=(bash -c "$RUN_CMD")
else
  RUN=(flock -n "$LOCK_FILE" bash -c "$RUN_CMD")
fi

if "${RUN[@]}"; then
  log "=== Guide telegram queue finished OK ==="
  exit 0
else
  code=$?
  if [[ "$code" -eq 1 ]]; then
    log "=== Guide telegram queue skipped (lock) ==="
    exit 0
  fi
  log "=== Guide telegram queue FAILED (exit $code) ==="
  exit "$code"
fi
