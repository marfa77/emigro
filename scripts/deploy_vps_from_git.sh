#!/usr/bin/env bash
# Deploy Emigro Threads runtime on VPS from GitHub main (not laptop rsync).
# Preserves .env / parser/.env / parser/out.
set -euo pipefail

DEPLOY_USER_HOME="$(python3 -c 'import os,pwd; print(pwd.getpwuid(os.getuid()).pw_dir)' 2>/dev/null || echo "/Users/$(whoami)")"
SERVER_USER="${SERVER_USER:-root}"
SERVER_HOST="${SERVER_HOST:-37.27.0.210}"
SSH_KEY="${SSH_KEY:-${DEPLOY_USER_HOME}/.ssh/id_ed25519_github}"
REMOTE="${REMOTE:-/opt/emigro}"
REPO_SSH="${REPO_SSH:-git@github.com:marfa77/emigro.git}"
REF="${REF:-origin/main}"
SSH=(ssh -i "${SSH_KEY}" -o StrictHostKeyChecking=no)

echo "📘 Git deploy Emigro Threads → ${SERVER_USER}@${SERVER_HOST}:${REMOTE} (${REF})"

"${SSH[@]}" "${SERVER_USER}@${SERVER_HOST}" bash -s <<REMOTE
set -euo pipefail
cd "${REMOTE}"
export GIT_SSH_COMMAND='ssh -i /root/.ssh/id_ed25519_github -o StrictHostKeyChecking=no'

if [[ ! -d .git ]]; then
  echo "Bootstrap git in ${REMOTE}…"
  git init -b main
  git remote add origin "${REPO_SSH}"
fi

# Keep runtime secrets / state outside reset.
git fetch origin main
git checkout -B main
git reset --hard "${REF}"

chmod +x deploy/threads-daily/run_scheduled.sh deploy/threads-satellites/run_scheduled.sh \
  deploy/threads-refresh/run_scheduled.sh deploy/threads-replies/run_scheduled.sh 2>/dev/null || true
mkdir -p deploy/threads-daily/logs deploy/threads-satellites/logs \
  deploy/threads-refresh/logs deploy/threads-replies/logs parser/out
chown -R www-data:www-data deploy/threads-daily deploy/threads-satellites \
  deploy/threads-refresh deploy/threads-replies parser/out 2>/dev/null || true
chown -R www-data:www-data parser 2>/dev/null || true
chmod 600 .env parser/.env 2>/dev/null || true

npm ci --include=dev

cp deploy/systemd/emigro-threads-daily.service /etc/systemd/system/
cp deploy/systemd/emigro-threads-daily.timer /etc/systemd/system/
cp deploy/systemd/emigro-threads-satellites.service /etc/systemd/system/
cp deploy/systemd/emigro-threads-satellites.timer /etc/systemd/system/
cp deploy/systemd/emigro-threads-refresh.service /etc/systemd/system/
cp deploy/systemd/emigro-threads-refresh.timer /etc/systemd/system/
cp deploy/systemd/emigro-threads-replies.service /etc/systemd/system/
cp deploy/systemd/emigro-threads-replies.timer /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now emigro-threads-daily.timer
systemctl enable --now emigro-threads-satellites.timer
systemctl enable --now emigro-threads-refresh.timer
systemctl enable --now emigro-threads-replies.timer

echo "HEAD=$(git rev-parse --short HEAD)"
git log -1 --oneline
systemctl list-timers --all | grep emigro-threads || true
grep -n 'extraUrl' lib/threads/inventory.ts || echo 'OK: no extraUrl (single CTA link)'
REMOTE

echo "✅ VPS Threads at git ${REF}. Site is Vercel (auto on push to main)."
