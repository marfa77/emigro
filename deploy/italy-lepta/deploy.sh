#!/usr/bin/env bash
# Install the Italy Lepta channel timer on the Emigro VPS.
# Does not rsync the Threads farm tree.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

DEPLOY_USER_HOME="$(python3 -c 'import os,pwd; print(pwd.getpwuid(os.getuid()).pw_dir)' 2>/dev/null || echo "/Users/$(whoami)")"
SERVER_USER="${SERVER_USER:-root}"
SERVER_HOST="${SERVER_HOST:-37.27.0.210}"
SSH_KEY="${SSH_KEY:-${DEPLOY_USER_HOME}/.ssh/id_ed25519_github}"
REMOTE="${REMOTE:-/opt/emigro}"
SSH=(ssh -i "${SSH_KEY}" -o StrictHostKeyChecking=no)
RSYNC_SSH="ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no"

echo "Italy Lepta channel → ${SERVER_USER}@${SERVER_HOST}:${REMOTE}"

rsync -avz -e "${RSYNC_SSH}" \
  "$ROOT/lib/news/italy-lepta.ts" \
  "$ROOT/lib/news/audience-gatekeeper.ts" \
  "${SERVER_USER}@${SERVER_HOST}:${REMOTE}/lib/news/"

rsync -avz -e "${RSYNC_SSH}" \
  "$ROOT/scripts/italy-lepta-channel.ts" \
  "${SERVER_USER}@${SERVER_HOST}:${REMOTE}/scripts/italy-lepta-channel.ts"

rsync -avz -e "${RSYNC_SSH}" \
  "$ROOT/deploy/italy-lepta/run_scheduled.sh" \
  "${SERVER_USER}@${SERVER_HOST}:${REMOTE}/deploy/italy-lepta/run_scheduled.sh"

rsync -avz -e "${RSYNC_SSH}" \
  "$ROOT/deploy/systemd/emigro-italy-lepta.service" \
  "$ROOT/deploy/systemd/emigro-italy-lepta.timer" \
  "${SERVER_USER}@${SERVER_HOST}:${REMOTE}/deploy/systemd/"

"${SSH[@]}" "${SERVER_USER}@${SERVER_HOST}" "REMOTE=${REMOTE}" bash -s <<'REMOTE'
set -euo pipefail
cd "${REMOTE}"
chmod +x deploy/italy-lepta/run_scheduled.sh deploy/italy-lepta/deploy.sh 2>/dev/null || true
mkdir -p deploy/italy-lepta/logs deploy/italy-lepta/state
chown -R www-data:www-data deploy/italy-lepta
cp deploy/systemd/emigro-italy-lepta.service /etc/systemd/system/
cp deploy/systemd/emigro-italy-lepta.timer /etc/systemd/system/
systemctl daemon-reload
systemctl disable --now emigro-italy-education.timer 2>/dev/null || true
systemctl enable --now emigro-italy-lepta.timer
echo "LEPTA=$(systemctl is-enabled emigro-italy-lepta.timer)"
echo "EDU=$(systemctl is-enabled emigro-italy-education.timer 2>&1 || true)"
systemctl list-timers emigro-italy-lepta.timer --no-pager
REMOTE

echo "Italy Lepta timer enabled."
