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

echo "🇵🇹 Deploy chatporto scan → ${SERVER_USER}@${SERVER_HOST}:${REMOTE}"

"${SSH[@]}" "${SERVER_USER}@${SERVER_HOST}" "mkdir -p ${REMOTE}/lib/chatporto ${REMOTE}/scripts ${REMOTE}/parser ${REMOTE}/deploy/chatporto-scan ${REMOTE}/deploy/systemd ${REMOTE}/scripts/output ${REMOTE}/docs"

rsync -avz -e "ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no" \
  "$ROOT/lib/chatporto/" \
  "${SERVER_USER}@${SERVER_HOST}:${REMOTE}/lib/chatporto/"

rsync -avz -e "ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no" \
  "$ROOT/scripts/chatporto-scan.ts" \
  "${SERVER_USER}@${SERVER_HOST}:${REMOTE}/scripts/chatporto-scan.ts"

rsync -avz -e "ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no" \
  "$ROOT/parser/fetch_chatporto.py" \
  "${SERVER_USER}@${SERVER_HOST}:${REMOTE}/parser/fetch_chatporto.py"

rsync -avz -e "ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no" \
  "$ROOT/deploy/chatporto-scan/run_scheduled.sh" \
  "$ROOT/deploy/chatporto-scan/deploy.sh" \
  "${SERVER_USER}@${SERVER_HOST}:${REMOTE}/deploy/chatporto-scan/"

rsync -avz -e "ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no" \
  "$ROOT/deploy/systemd/emigro-chatporto-scan.service" \
  "$ROOT/deploy/systemd/emigro-chatporto-scan.timer" \
  "${SERVER_USER}@${SERVER_HOST}:${REMOTE}/deploy/systemd/"

rsync -avz -e "ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no" \
  "$ROOT/docs/CHATPORTO_EXPERT.md" \
  "${SERVER_USER}@${SERVER_HOST}:${REMOTE}/docs/CHATPORTO_EXPERT.md" 2>/dev/null || true

"${SSH[@]}" "${SERVER_USER}@${SERVER_HOST}" bash -s <<REMOTE
set -euo pipefail
cd "${REMOTE}"
chmod +x deploy/chatporto-scan/run_scheduled.sh deploy/chatporto-scan/deploy.sh
mkdir -p deploy/chatporto-scan/logs scripts/output
chown -R www-data:www-data deploy/chatporto-scan/logs scripts/output
cp deploy/systemd/emigro-chatporto-scan.service /etc/systemd/system/
cp deploy/systemd/emigro-chatporto-scan.timer /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now emigro-chatporto-scan.timer
systemctl list-timers --all | grep chatporto || true
echo "✅ chatporto timer: daily 10:00 UTC (max 1 draft/day)"
REMOTE
