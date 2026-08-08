#!/usr/bin/env bash
# Deploy spaced #молния Telegram cron to Emigro VPS.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

DEPLOY_USER_HOME="$(python3 -c 'import os,pwd; print(pwd.getpwuid(os.getuid()).pw_dir)' 2>/dev/null || echo "/Users/$(whoami)")"
SERVER_USER="${SERVER_USER:-root}"
SERVER_HOST="${SERVER_HOST:-37.27.0.210}"
SSH_KEY="${SSH_KEY:-${DEPLOY_USER_HOME}/.ssh/id_ed25519_github}"
REMOTE="${REMOTE:-/opt/emigro}"

SSH=(ssh -i "${SSH_KEY}" -o StrictHostKeyChecking=no)

echo "⚡ Deploy news lightning cron → ${SERVER_USER}@${SERVER_HOST}:${REMOTE}"

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
chmod +x deploy/news-lightning/run_scheduled.sh
mkdir -p deploy/news-lightning/logs
chown -R www-data:www-data deploy/news-lightning/logs
if command -v npm >/dev/null 2>&1; then
  npm ci --include=dev
fi
cp deploy/systemd/emigro-news-lightning.service /etc/systemd/system/
cp deploy/systemd/emigro-news-lightning.timer /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now emigro-news-lightning.timer
systemctl list-timers --all | grep news-lightning || true
REMOTE

echo "✅ News lightning timer enabled (11/13/15/17/19 UTC, 1 post each)"
