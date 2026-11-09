#!/usr/bin/env bash
# Install the Portugal Porto channel timer on the Emigro VPS.
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

echo "Portugal Porto channel → ${SERVER_USER}@${SERVER_HOST}:${REMOTE}"

"${SSH[@]}" "${SERVER_USER}@${SERVER_HOST}" "mkdir -p ${REMOTE}/lib/news ${REMOTE}/scripts ${REMOTE}/deploy/portugal-porto ${REMOTE}/deploy/systemd"

rsync -avz -e "${RSYNC_SSH}" \
  "$ROOT/lib/news/portugal-porto-channel.ts" \
  "$ROOT/lib/news/audience-gatekeeper.ts" \
  "${SERVER_USER}@${SERVER_HOST}:${REMOTE}/lib/news/"

rsync -avz -e "${RSYNC_SSH}" \
  "$ROOT/scripts/portugal-porto-channel.ts" \
  "${SERVER_USER}@${SERVER_HOST}:${REMOTE}/scripts/portugal-porto-channel.ts"

rsync -avz -e "${RSYNC_SSH}" \
  "$ROOT/deploy/portugal-porto/run_scheduled.sh" \
  "${SERVER_USER}@${SERVER_HOST}:${REMOTE}/deploy/portugal-porto/run_scheduled.sh"

rsync -avz -e "${RSYNC_SSH}" \
  "$ROOT/deploy/systemd/emigro-portugal-porto.service" \
  "$ROOT/deploy/systemd/emigro-portugal-porto.timer" \
  "${SERVER_USER}@${SERVER_HOST}:${REMOTE}/deploy/systemd/"

"${SSH[@]}" "${SERVER_USER}@${SERVER_HOST}" "REMOTE=${REMOTE}" bash -s <<'REMOTE'
set -euo pipefail
cd "${REMOTE}"
chmod +x deploy/portugal-porto/run_scheduled.sh
mkdir -p deploy/portugal-porto/logs deploy/portugal-porto/state
chown -R www-data:www-data deploy/portugal-porto
cp deploy/systemd/emigro-portugal-porto.service /etc/systemd/system/
cp deploy/systemd/emigro-portugal-porto.timer /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now emigro-portugal-porto.timer
echo "PORTO=$(systemctl is-enabled emigro-portugal-porto.timer)"
systemctl list-timers emigro-portugal-porto.timer --no-pager
REMOTE

echo "Portugal Porto timer enabled."
