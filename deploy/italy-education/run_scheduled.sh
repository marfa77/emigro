#!/usr/bin/env bash
# One parent-education post → @emigro_Italy. Does not touch @Emigro_news.
set -euo pipefail

SCRIPT_ROOT="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_ROOT/../.." && pwd)"
cd "$REPO_ROOT"

LOG_DIR="$SCRIPT_ROOT/logs"
LOCK_FILE="$LOG_DIR/.scheduled.lock"
mkdir -p "$LOG_DIR" "$SCRIPT_ROOT/state"

exec >> "$LOG_DIR/scheduled-$(date +%Y%m%d).log" 2>&1

if [[ -f "$REPO_ROOT/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$REPO_ROOT/.env"
  set +a
fi

echo "[$(date '+%Y-%m-%d %H:%M:%S %Z')] === Italy education channel ==="

RUN_CMD="cd '$REPO_ROOT' && npx tsx scripts/italy-education-channel.ts"
if command -v flock >/dev/null 2>&1; then
  flock -n "$LOCK_FILE" bash -c "$RUN_CMD"
else
  bash -c "$RUN_CMD"
fi
echo "[$(date '+%Y-%m-%d %H:%M:%S %Z')] === Italy education channel finished ==="
