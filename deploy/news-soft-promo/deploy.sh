#!/usr/bin/env bash
# Deploy weekly soft promo cron to Emigro VPS.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

DEPLOY_USER_HOME="$(python3 -c 'import os,pwd; print(pwd.getpwuid(os.getuid()).pw_dir)' 2>/dev/null || echo "/Users/$(whoami)")"
SERVER_USER="${SERVER_USER:-root}"
SERVER_HOST="${SERVER_HOST:-37.27.0.210}"
SSH_KEY="${SSH_KEY:-${DEPLOY_USER_HOME}/.ssh/id_ed25519_github}"
REMOTE="${REMOTE:-/opt/emigro}"

SSH=(ssh -i "${SSH_KEY}" -o StrictHostKeyChecking=no)

echo "📣 Deploy soft promo cron → ${SERVER_USER}@${SERVER_HOST}:${REMOTE}"

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
chmod +x deploy/news-soft-promo/run_scheduled.sh
mkdir -p deploy/news-soft-promo/logs
chown -R www-data:www-data deploy/news-soft-promo
if command -v npm >/dev/null 2>&1; then
  npm ci --include=dev
fi
cp deploy/systemd/emigro-news-soft-promo.service /etc/systemd/system/
cp deploy/systemd/emigro-news-soft-promo.timer /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now emigro-news-soft-promo.timer
systemctl list-timers --all | grep soft-promo || true
REMOTE

echo "✅ Soft promo timer enabled (Mon–Fri 09:00 UTC + up to 8h random; ≤1 post/week)"
