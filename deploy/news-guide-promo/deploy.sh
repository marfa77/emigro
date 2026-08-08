#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

DEPLOY_USER_HOME="$(python3 -c 'import os,pwd; print(pwd.getpwuid(os.getuid()).pw_dir)' 2>/dev/null || echo "/Users/$(whoami)")"
SERVER_USER="${SERVER_USER:-root}"
SERVER_HOST="${SERVER_HOST:-37.27.0.210}"
SSH_KEY="${SSH_KEY:-${DEPLOY_USER_HOME}/.ssh/id_ed25519_github}"
REMOTE="${REMOTE:-/opt/emigro}"
SSH=(ssh -i "${SSH_KEY}" -o StrictHostKeyChecking=no)

echo "📘 Deploy guide telegram promo → ${SERVER_USER}@${SERVER_HOST}:${REMOTE}"

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
cd "${REMOTE}"
chmod +x deploy/news-guide-promo/run_scheduled.sh
mkdir -p deploy/news-guide-promo/logs
chown -R www-data:www-data deploy/news-guide-promo
npm ci --include=dev
cp deploy/systemd/emigro-news-guide-promo.service /etc/systemd/system/
cp deploy/systemd/emigro-news-guide-promo.timer /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now emigro-news-guide-promo.timer
systemctl list-timers --all | grep guide-promo || true
REMOTE

echo "✅ Guide promo timer enabled (12:30 UTC + up to 2h random)"
