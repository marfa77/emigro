#!/usr/bin/env bash
# Volatile guides fact-check pipeline is OFF (2026-10-19).
# Do not send the owner Telegram DM from this timer.
# Manual report only: npm run guides:volatile-factcheck
# See docs/VOLATILE_GUIDE_FACTCHECK.md.

set -euo pipefail

SCRIPT_ROOT="$(cd "$(dirname "$0")" && pwd)"
LOG_DIR="$SCRIPT_ROOT/logs"
mkdir -p "$LOG_DIR"

echo "[$(date '+%Y-%m-%d %H:%M:%S %Z')] Volatile guides fact-check DISABLED — no Telegram" \
  >> "$LOG_DIR/scheduled-$(date +%Y%m%d).log"
exit 0
