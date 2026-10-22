#!/usr/bin/env bash
# Daily @chatporto question → owner DM draft (max 1/day).
# Timer: emigro-chatporto-scan.timer (10:00 UTC).

set -euo pipefail

SCRIPT_ROOT="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_ROOT/../.." && pwd)"
cd "$REPO_ROOT"

LOG_DIR="$SCRIPT_ROOT/logs"
mkdir -p "$LOG_DIR"
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

echo "[$(date '+%Y-%m-%d %H:%M:%S %Z')] === chatporto scan ==="
cd "$REPO_ROOT" && npx tsx scripts/chatporto-scan.ts
echo "[$(date '+%Y-%m-%d %H:%M:%S %Z')] === chatporto scan done ==="
