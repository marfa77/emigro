#!/usr/bin/env bash
# Refresh long-lived Threads token (~60d). Must run while the token is still valid.
set -euo pipefail

SCRIPT_ROOT="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_ROOT/../.." && pwd)"
cd "$REPO_ROOT"

LOG_DIR="$SCRIPT_ROOT/logs"
mkdir -p "$LOG_DIR"
exec >> "$LOG_DIR/refresh-$(date +%Y%m%d).log" 2>&1

echo "[$(date '+%Y-%m-%d %H:%M:%S %Z')] === Threads token refresh ==="

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

cd "$REPO_ROOT"
npm run threads:refresh-token -- --write
echo "[$(date '+%Y-%m-%d %H:%M:%S %Z')] === Threads token refresh OK ==="
