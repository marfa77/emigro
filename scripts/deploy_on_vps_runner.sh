#!/usr/bin/env bash
# Run on the self-hosted GitHub Actions runner (same VPS as /opt/emigro).
# Syncs the Actions checkout into /opt/emigro without wiping .env / parser/out.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REMOTE="${REMOTE:-/opt/emigro}"

if [[ "$(id -u)" -eq 0 ]]; then
  SUDO=""
else
  SUDO="sudo -n"
fi

echo "🚀 Emigro Threads deploy from runner workspace → ${REMOTE}"

$SUDO install -d "${REMOTE}/parser/out" \
  "${REMOTE}/deploy/threads-daily/logs" \
  "${REMOTE}/deploy/threads-satellites/logs" \
  "${REMOTE}/deploy/threads-refresh/logs" \
  "${REMOTE}/deploy/threads-replies/logs"

$SUDO rsync -a --delete \
  --exclude 'node_modules' --exclude '.next' --exclude '.git' \
  --exclude 'parser/.venv' --exclude 'parser/media' --exclude 'parser/tg.session' \
  --exclude 'parser/__pycache__' --exclude 'parser/logs' --exclude 'parser/.env' \
  --exclude 'parser/out' --exclude '.cursor' --exclude 'branding' \
  --exclude '.env' --exclude '.env.local' --exclude '.DS_Store' \
  --exclude 'scripts/output' \
  "${ROOT}/" "${REMOTE}/"

$SUDO chmod +x \
  "${REMOTE}/deploy/threads-daily/run_scheduled.sh" \
  "${REMOTE}/deploy/threads-satellites/run_scheduled.sh" \
  "${REMOTE}/deploy/threads-refresh/run_scheduled.sh" \
  "${REMOTE}/deploy/threads-replies/run_scheduled.sh"

$SUDO chown -R www-data:www-data \
  "${REMOTE}/deploy/threads-daily" \
  "${REMOTE}/deploy/threads-satellites" \
  "${REMOTE}/deploy/threads-refresh" \
  "${REMOTE}/deploy/threads-replies" \
  "${REMOTE}/parser/out" || true
$SUDO chmod 600 "${REMOTE}/.env" "${REMOTE}/parser/.env" 2>/dev/null || true

$SUDO -u www-data bash -lc "cd '${REMOTE}' && npm ci --include=dev"

$SUDO cp "${REMOTE}/deploy/systemd/emigro-threads-"*.service /etc/systemd/system/
$SUDO cp "${REMOTE}/deploy/systemd/emigro-threads-"*.timer /etc/systemd/system/
$SUDO systemctl daemon-reload
$SUDO systemctl enable --now emigro-threads-daily.timer
$SUDO systemctl enable --now emigro-threads-satellites.timer
$SUDO systemctl enable --now emigro-threads-refresh.timer
$SUDO systemctl enable --now emigro-threads-replies.timer
$SUDO systemctl list-timers --all | grep emigro-threads || true

echo "✅ Emigro Threads deployed from git checkout $(git -C "${ROOT}" rev-parse --short HEAD)"
