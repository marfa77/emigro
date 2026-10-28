#!/usr/bin/env bash
# Install multi-source outdoor → @emigro_portugal timer on the Emigro VPS.
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

echo "Portugal outdoor → ${SERVER_USER}@${SERVER_HOST}:${REMOTE}"

"${SSH[@]}" "${SERVER_USER}@${SERVER_HOST}" "mkdir -p ${REMOTE}/lib/news/outdoor ${REMOTE}/scripts ${REMOTE}/deploy/portugal-outdoor ${REMOTE}/deploy/geo2go-events ${REMOTE}/deploy/systemd"

rsync -avz -e "${RSYNC_SSH}" \
  "$ROOT/lib/news/outdoor/" \
  "${SERVER_USER}@${SERVER_HOST}:${REMOTE}/lib/news/outdoor/"

rsync -avz -e "${RSYNC_SSH}" \
  "$ROOT/lib/news/geo2go-events.ts" \
  "${SERVER_USER}@${SERVER_HOST}:${REMOTE}/lib/news/"

rsync -avz -e "${RSYNC_SSH}" \
  "$ROOT/scripts/portugal-outdoor-channel.ts" \
  "$ROOT/scripts/geo2go-events-channel.ts" \
  "${SERVER_USER}@${SERVER_HOST}:${REMOTE}/scripts/"

rsync -avz -e "${RSYNC_SSH}" \
  "$ROOT/deploy/portugal-outdoor/run_scheduled.sh" \
  "${SERVER_USER}@${SERVER_HOST}:${REMOTE}/deploy/portugal-outdoor/run_scheduled.sh"

rsync -avz -e "${RSYNC_SSH}" \
  "$ROOT/deploy/systemd/emigro-portugal-outdoor.service" \
  "$ROOT/deploy/systemd/emigro-portugal-outdoor.timer" \
  "${SERVER_USER}@${SERVER_HOST}:${REMOTE}/deploy/systemd/"

# Keep geo2go timer pointing at outdoor runner (same channel); disable duplicate if present.
"${SSH[@]}" "${SERVER_USER}@${SERVER_HOST}" "REMOTE=${REMOTE}" bash -s <<'REMOTE'
set -euo pipefail
cd "${REMOTE}"
chmod +x deploy/portugal-outdoor/run_scheduled.sh
mkdir -p deploy/portugal-outdoor/logs deploy/portugal-outdoor/state deploy/geo2go-events/state
chown -R www-data:www-data deploy/portugal-outdoor deploy/geo2go-events
cp deploy/systemd/emigro-portugal-outdoor.service /etc/systemd/system/
cp deploy/systemd/emigro-portugal-outdoor.timer /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now emigro-portugal-outdoor.timer
# Prefer single outdoor timer — disable old geo2go-only if installed
if systemctl list-unit-files | grep -q emigro-geo2go-events.timer; then
  systemctl disable --now emigro-geo2go-events.timer || true
fi
echo "OUTDOOR=$(systemctl is-enabled emigro-portugal-outdoor.timer)"
systemctl list-timers emigro-portugal-outdoor.timer --no-pager
REMOTE

echo "Portugal outdoor timer enabled."
