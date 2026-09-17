#!/usr/bin/env bash
# Daily Thailand community pipeline (VPS systemd, 08:00 UTC).

set -euo pipefail

PARSER_ROOT="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$PARSER_ROOT/.." && pwd)"
cd "$REPO_ROOT"

LOG_DIR="$PARSER_ROOT/logs"
LOCK_FILE="$PARSER_ROOT/.scheduled-thailand.lock"
mkdir -p "$LOG_DIR" "$PARSER_ROOT/out"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S %Z')] $*"
}

exec >> "$LOG_DIR/scheduled-thailand-$(date +%Y%m%d).log" 2>&1

if [[ -f "$PARSER_ROOT/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$PARSER_ROOT/.env"
  set +a
fi
if [[ -f "$REPO_ROOT/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$REPO_ROOT/.env"
  set +a
fi

export PARSER_MAX_AGE_HOURS="${PARSER_MAX_AGE_HOURS:-36}"
export PARSER_INCREMENTAL_LIMIT="${PARSER_INCREMENTAL_LIMIT:-60}"
export THAILAND_SATELLITE_USE_SUBDOMAIN="${THAILAND_SATELLITE_USE_SUBDOMAIN:-true}"
export EMIGRO_PUBLIC_SITE_URL="${EMIGRO_PUBLIC_SITE_URL:-https://www.emigro.online}"

log "=== Emigro Thailand daily (age<=${PARSER_MAX_AGE_HOURS}h, limit=${PARSER_INCREMENTAL_LIMIT}/ch) ==="

if command -v flock >/dev/null 2>&1; then
  exec 9>"$LOCK_FILE"
  if ! flock -n 9; then
    log "=== Thailand daily skipped (already running) ==="
    exit 0
  fi
fi

set +e
(
  cd "$REPO_ROOT"
  npm run thailand:daily
)
code=$?
set -e

if [[ "$code" -eq 0 ]]; then
  log "=== Thailand daily finished OK ==="
  exit 0
fi

log "=== Thailand daily FAILED (exit $code) ==="
exit "$code"
