#!/usr/bin/env bash
# Install northern Italy outdoor → @emigro_Italy timer on the Emigro VPS.
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

echo "Italy outdoor → ${SERVER_USER}@${SERVER_HOST}:${REMOTE}"

"${SSH[@]}" "${SERVER_USER}@${SERVER_HOST}" "mkdir -p ${REMOTE}/lib/news/italy-outdoor ${REMOTE}/scripts ${REMOTE}/deploy/italy-outdoor ${REMOTE}/deploy/systemd"

rsync -avz -e "${RSYNC_SSH}" \
  "$ROOT/lib/news/italy-outdoor/" \
  "${SERVER_USER}@${SERVER_HOST}:${REMOTE}/lib/news/italy-outdoor/"

rsync -avz -e "${RSYNC_SSH}" \
  "$ROOT/scripts/italy-outdoor-channel.ts" \
  "${SERVER_USER}@${SERVER_HOST}:${REMOTE}/scripts/"

rsync -avz -e "${RSYNC_SSH}" \
  "$ROOT/deploy/italy-outdoor/run_scheduled.sh" \
  "${SERVER_USER}@${SERVER_HOST}:${REMOTE}/deploy/italy-outdoor/run_scheduled.sh"

rsync -avz -e "${RSYNC_SSH}" \
  "$ROOT/deploy/systemd/emigro-italy-outdoor.service" \
  "$ROOT/deploy/systemd/emigro-italy-outdoor.timer" \
  "${SERVER_USER}@${SERVER_HOST}:${REMOTE}/deploy/systemd/"

"${SSH[@]}" "${SERVER_USER}@${SERVER_HOST}" "REMOTE=${REMOTE}" bash -s <<'REMOTE'
set -euo pipefail
cd "${REMOTE}"
chmod +x deploy/italy-outdoor/run_scheduled.sh
mkdir -p deploy/italy-outdoor/logs deploy/italy-outdoor/state
chown -R www-data:www-data deploy/italy-outdoor
cp deploy/systemd/emigro-italy-outdoor.service /etc/systemd/system/
cp deploy/systemd/emigro-italy-outdoor.timer /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now emigro-italy-outdoor.timer
echo "ITALY_OUTDOOR=$(systemctl is-enabled emigro-italy-outdoor.timer)"
systemctl list-timers emigro-italy-outdoor.timer --no-pager
REMOTE

echo "Italy outdoor timer enabled."
