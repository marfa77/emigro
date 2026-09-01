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

echo "📘 Deploy Emigro Threads replies timer → ${SERVER_USER}@${SERVER_HOST}:${REMOTE}"

rsync -avz \
  --exclude 'node_modules' --exclude '.next' --exclude '.git' \
  --exclude 'parser/.venv' --exclude 'parser/media' --exclude 'parser/tg.session' \
  --exclude 'parser/__pycache__' --exclude 'parser/logs' --exclude 'parser/.env' \
  --exclude 'parser/out' --exclude '.cursor' \
  --exclude '.env' --exclude '.env.local' --exclude '.DS_Store' \
  --exclude 'scripts/output' \
  -e "ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no" \
  ./ "${SERVER_USER}@${SERVER_HOST}:${REMOTE}/"

"${SSH[@]}" "${SERVER_USER}@${SERVER_HOST}" bash -s <<REMOTE
set -euo pipefail
cd "${REMOTE}"
chmod +x deploy/threads-replies/run_scheduled.sh
mkdir -p deploy/threads-replies/logs parser/out
chown -R www-data:www-data deploy/threads-replies parser/out
chmod 600 parser/.env 2>/dev/null || true
chmod 600 .env 2>/dev/null || true
npm ci --include=dev
cp deploy/systemd/emigro-threads-replies.service /etc/systemd/system/
cp deploy/systemd/emigro-threads-replies.timer /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now emigro-threads-replies.timer
systemctl list-timers --all | grep emigro-threads-replies || true
REMOTE

echo "✅ Replies timer enabled (DM drafts only)."
echo "Live Threads replies still need Telegram ✅ + THREADS_AUTO_PUBLISH=1 + whoami=@emigro2eu."
echo "Dry-run on VPS: sudo -u www-data npm run threads:replies -- --dry-run"
