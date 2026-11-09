#!/usr/bin/env bash
# Install Valencia outdoor events → @valencia_echat on the Emigro VPS.
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

echo "Valencia outdoor → ${SERVER_USER}@${SERVER_HOST}:${REMOTE}"

"${SSH[@]}" "${SERVER_USER}@${SERVER_HOST}" "mkdir -p ${REMOTE}/lib/news/valencia-outdoor ${REMOTE}/scripts ${REMOTE}/deploy/valencia-outdoor ${REMOTE}/deploy/systemd"

rsync -avz -e "${RSYNC_SSH}" \
  "$ROOT/lib/news/valencia-outdoor/" \
  "${SERVER_USER}@${SERVER_HOST}:${REMOTE}/lib/news/valencia-outdoor/"

rsync -avz -e "${RSYNC_SSH}" \
  "$ROOT/scripts/valencia-outdoor-channel.ts" \
  "${SERVER_USER}@${SERVER_HOST}:${REMOTE}/scripts/"

rsync -avz -e "${RSYNC_SSH}" \
  "$ROOT/deploy/valencia-outdoor/run_scheduled.sh" \
  "${SERVER_USER}@${SERVER_HOST}:${REMOTE}/deploy/valencia-outdoor/run_scheduled.sh"

rsync -avz -e "${RSYNC_SSH}" \
  "$ROOT/deploy/systemd/emigro-valencia-outdoor.service" \
  "$ROOT/deploy/systemd/emigro-valencia-outdoor.timer" \
  "${SERVER_USER}@${SERVER_HOST}:${REMOTE}/deploy/systemd/"

"${SSH[@]}" "${SERVER_USER}@${SERVER_HOST}" "REMOTE=${REMOTE}" bash -s <<'REMOTE'
set -euo pipefail
cd "${REMOTE}"
chmod +x deploy/valencia-outdoor/run_scheduled.sh
mkdir -p deploy/valencia-outdoor/logs deploy/valencia-outdoor/state
chown -R www-data:www-data deploy/valencia-outdoor
cp deploy/systemd/emigro-valencia-outdoor.service /etc/systemd/system/
cp deploy/systemd/emigro-valencia-outdoor.timer /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now emigro-valencia-outdoor.timer
echo "VALENCIA_OUTDOOR=$(systemctl is-enabled emigro-valencia-outdoor.timer)"
systemctl list-timers emigro-valencia-outdoor.timer --no-pager
REMOTE

echo "Valencia outdoor timer enabled."
