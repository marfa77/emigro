#!/usr/bin/env bash
# @emigro_invest dated calendar. Failures MUST DM owner — silent exit=1 is forbidden.
# Never chown this script dir from systemd ExecStartPre (farm-lock immutable).
set -euo pipefail

SCRIPT_ROOT="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_ROOT/../.." && pwd)"
cd "$REPO_ROOT"

LOG_DIR="$SCRIPT_ROOT/logs"
OUT_DIR="$REPO_ROOT/parser/out"
LOCK_FILE="$SCRIPT_ROOT/.scheduled.lock"
mkdir -p "$LOG_DIR" "$OUT_DIR"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S %Z')] $*"
}

notify_fail() {
  local msg="$1"
  log "notify owner: $msg"
  npx tsx scripts/threads-cron-notify.ts --stream=investment --error="$msg" || log "notify DM failed"
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

log "=== Emigro Threads investment (@emigro_invest) ==="

if command -v flock >/dev/null 2>&1; then
  exec 9>"$LOCK_FILE"
  if ! flock -n 9; then
    log "=== investment skipped (lock held) ==="
    exit 0
  fi
fi

set +e
OUT="$(npm run threads:investment:daily -- --force-publish "$@" 2>&1)"
code=$?
set -e
printf '%s\n' "$OUT"

if [[ "$code" -eq 0 ]]; then
  log "=== investment finished OK ==="
  exit 0
fi

log "=== investment FAILED (exit $code) ==="
notify_fail "что: @emigro_invest publisher exit ${code}"$'\n'"почему:"$'\n'"$(printf '%s\n' "$OUT" | tail -c 3000)"
exit "$code"
