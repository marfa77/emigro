#!/usr/bin/env bash
# Install Geo2Go → @emigro_portugal timer on the Emigro VPS.
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

echo "Geo2Go events → ${SERVER_USER}@${SERVER_HOST}:${REMOTE}"

"${SSH[@]}" "${SERVER_USER}@${SERVER_HOST}" "mkdir -p ${REMOTE}/lib/news ${REMOTE}/scripts ${REMOTE}/deploy/geo2go-events ${REMOTE}/deploy/systemd"

rsync -avz -e "${RSYNC_SSH}" \
  "$ROOT/lib/news/geo2go-events.ts" \
  "${SERVER_USER}@${SERVER_HOST}:${REMOTE}/lib/news/"

rsync -avz -e "${RSYNC_SSH}" \
  "$ROOT/scripts/geo2go-events-channel.ts" \
  "${SERVER_USER}@${SERVER_HOST}:${REMOTE}/scripts/geo2go-events-channel.ts"

rsync -avz -e "${RSYNC_SSH}" \
  "$ROOT/deploy/geo2go-events/run_scheduled.sh" \
  "${SERVER_USER}@${SERVER_HOST}:${REMOTE}/deploy/geo2go-events/run_scheduled.sh"

rsync -avz -e "${RSYNC_SSH}" \
  "$ROOT/deploy/systemd/emigro-geo2go-events.service" \
  "$ROOT/deploy/systemd/emigro-geo2go-events.timer" \
  "${SERVER_USER}@${SERVER_HOST}:${REMOTE}/deploy/systemd/"

"${SSH[@]}" "${SERVER_USER}@${SERVER_HOST}" "REMOTE=${REMOTE}" bash -s <<'REMOTE'
set -euo pipefail
cd "${REMOTE}"
chmod +x deploy/geo2go-events/run_scheduled.sh
mkdir -p deploy/geo2go-events/logs deploy/geo2go-events/state
chown -R www-data:www-data deploy/geo2go-events
cp deploy/systemd/emigro-geo2go-events.service /etc/systemd/system/
cp deploy/systemd/emigro-geo2go-events.timer /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now emigro-geo2go-events.timer
echo "GEO2GO=$(systemctl is-enabled emigro-geo2go-events.timer)"
systemctl list-timers emigro-geo2go-events.timer --no-pager
REMOTE

echo "Geo2Go events timer enabled."
