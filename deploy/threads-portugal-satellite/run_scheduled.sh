#!/usr/bin/env bash
set -euo pipefail
ROOT="/opt/emigro"
LOG_DIR="${ROOT}/deploy/threads-portugal-satellite/logs"
OUT_DIR="${ROOT}/parser/out"
mkdir -p "$LOG_DIR" "$OUT_DIR"
# Best-effort ownership when running as root; www-data timer already owns these.
if [[ "$(id -u)" -eq 0 ]]; then
  chown -R www-data:www-data \
    "${ROOT}/deploy/threads-portugal-satellite" \
    "$OUT_DIR" 2>/dev/null || true
fi
cd "$ROOT"
exec >>"${LOG_DIR}/scheduled.log" 2>&1
echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] threads-pt-sat start"
npm run threads:pt-sat:daily -- --force-publish "$@"
echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] threads-pt-sat done"
