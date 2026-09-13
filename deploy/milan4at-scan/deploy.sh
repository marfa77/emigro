#!/usr/bin/env bash
# Deploy @milan_4at scan cron to Emigro VPS (every 12h).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

DEPLOY_USER_HOME="$(python3 -c 'import os,pwd; print(pwd.getpwuid(os.getuid()).pw_dir)' 2>/dev/null || echo "/Users/$(whoami)")"
SERVER_USER="${SERVER_USER:-root}"
SERVER_HOST="${SERVER_HOST:-37.27.0.210}"
SSH_KEY="${SSH_KEY:-${DEPLOY_USER_HOME}/.ssh/id_ed25519_github}"
REMOTE="${REMOTE:-/opt/emigro}"

SSH=(ssh -i "${SSH_KEY}" -o StrictHostKeyChecking=no)

echo "🇮🇹 Deploy milan4at scan cron → ${SERVER_USER}@${SERVER_HOST}:${REMOTE}"

rsync -avz \
  --exclude 'node_modules' --exclude '.next' --exclude '.git' \
  --exclude 'parser/.venv' --exclude 'parser/media' --exclude 'parser/tg.session' \
  --exclude 'parser/__pycache__' --exclude 'parser/logs' --exclude 'parser/.env' \
  --exclude '.env' --exclude '.env.local' --exclude '.DS_Store' \
  --exclude 'scripts/output' \
  -e "ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no" \
  ./ "${SERVER_USER}@${SERVER_HOST}:${REMOTE}/"

"${SSH[@]}" "${SERVER_USER}@${SERVER_HOST}" bash -s <<REMOTE
set -euo pipefail
REMOTE="${REMOTE}"
cd "\$REMOTE"
chmod +x deploy/milan4at-scan/run_scheduled.sh
mkdir -p deploy/milan4at-scan/logs scripts/output
chown -R www-data:www-data deploy/milan4at-scan/logs scripts/output
chown -R www-data:www-data "\$REMOTE/parser" 2>/dev/null || true
chmod 600 "\$REMOTE/parser/.env" 2>/dev/null || true
# Ensure notify chat + bot token present (do not overwrite if already set)
if ! grep -q '^MILAN4AT_BOT_TOKEN=' .env 2>/dev/null; then
  echo "WARN: MILAN4AT_BOT_TOKEN missing in /opt/emigro/.env — add before enabling timer"
fi
if ! grep -q '^MILAN4AT_NOTIFY_CHAT_ID=' .env 2>/dev/null; then
  echo "WARN: MILAN4AT_NOTIFY_CHAT_ID missing — add your /start chat id"
fi
if command -v npm >/dev/null 2>&1; then
  npm ci --include=dev
fi
cp deploy/systemd/emigro-milan4at-scan.service /etc/systemd/system/
cp deploy/systemd/emigro-milan4at-scan.timer /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now emigro-milan4at-scan.timer
systemctl list-timers --all | grep milan4at || true
REMOTE

echo "✅ milan4at timer: 07:00 + 19:00 UTC (every 12h)"
