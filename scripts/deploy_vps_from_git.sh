#!/usr/bin/env bash
# Deploy Emigro from GitHub main (not laptop rsync).
# Farm paths stay locked on the VPS — never git reset --hard over them.
set -euo pipefail

DEPLOY_USER_HOME="$(python3 -c 'import os,pwd; print(pwd.getpwuid(os.getuid()).pw_dir)' 2>/dev/null || echo "/Users/$(whoami)")"
SERVER_USER="${SERVER_USER:-root}"
SERVER_HOST="${SERVER_HOST:-37.27.0.210}"
SSH_KEY="${SSH_KEY:-${DEPLOY_USER_HOME}/.ssh/id_ed25519_github}"
REMOTE="${REMOTE:-/opt/emigro}"
REPO_SSH="${REPO_SSH:-git@github.com:marfa77/emigro.git}"
REF="${REF:-origin/main}"
SSH=(ssh -i "${SSH_KEY}" -o StrictHostKeyChecking=no)

echo "📘 Git deploy Emigro → ${SERVER_USER}@${SERVER_HOST}:${REMOTE} (${REF})"
echo "   farm paths excluded (unlock only from farm HQ chat)"

"${SSH[@]}" "${SERVER_USER}@${SERVER_HOST}" bash -s <<REMOTE
set -euo pipefail
cd "${REMOTE}"
git config --global --add safe.directory "${REMOTE}" || true
export GIT_SSH_COMMAND='ssh -i /root/.ssh/id_ed25519_github -o StrictHostKeyChecking=no'

if [[ ! -d .git ]]; then
  echo "Bootstrap git in ${REMOTE}…"
  git init -b main
  git remote add origin "${REPO_SSH}"
fi

git fetch origin main

STAGE="\$(mktemp -d /tmp/emigro-git-stage.XXXXXX)"
trap 'rm -rf "\$STAGE"' EXIT
git archive "${REF}" | tar -x -C "\$STAGE"

rsync -a --delete \
  --exclude '.git' --exclude '.env' --exclude '.env.local' \
  --exclude 'parser/.env' --exclude 'parser/out' --exclude 'parser/.venv' \
  --exclude 'node_modules' --exclude '.next' --exclude '.cursor' \
  --exclude 'lib/threads/' \
  --exclude 'scripts/threads-*.ts' \
  --exclude 'scripts/test-threads-*.ts' \
  --exclude 'scripts/threads-assert-banks.ts' \
  --exclude 'deploy/threads-daily/run_scheduled.sh' \
  --exclude 'deploy/threads-investment/run_scheduled.sh' \
  --exclude 'deploy/systemd/emigro-threads-*' \
  --exclude 'deploy/threads-daily/logs' \
  --exclude 'deploy/threads-satellites/logs' \
  --exclude 'deploy/threads-refresh/logs' \
  --exclude 'deploy/threads-replies/logs' \
  --exclude 'deploy/threads-investment/logs' \
  "\$STAGE/" "${REMOTE}/"

git update-ref refs/heads/main "\$(git rev-parse ${REF})"
git symbolic-ref HEAD refs/heads/main || true

chmod +x deploy/threads-satellites/run_scheduled.sh \
  deploy/threads-refresh/run_scheduled.sh \
  deploy/threads-replies/run_scheduled.sh 2>/dev/null || true
mkdir -p deploy/threads-daily/logs deploy/threads-satellites/logs \
  deploy/threads-refresh/logs deploy/threads-replies/logs \
  deploy/threads-investment/logs parser/out
chown -R www-data:www-data deploy/threads-daily deploy/threads-satellites \
  deploy/threads-refresh deploy/threads-replies deploy/threads-investment \
  parser/out 2>/dev/null || true
chown -R www-data:www-data parser 2>/dev/null || true
chmod 600 .env parser/.env 2>/dev/null || true

npm ci --include=dev

if [[ -f /opt/farm-lock/LOCKED ]]; then
  echo "FARM LOCKED — skip overwrite of emigro-threads units"
else
  cp deploy/systemd/emigro-threads-daily.service /etc/systemd/system/
  cp deploy/systemd/emigro-threads-daily.timer /etc/systemd/system/
  cp deploy/systemd/emigro-threads-satellites.service /etc/systemd/system/
  cp deploy/systemd/emigro-threads-satellites.timer /etc/systemd/system/
  cp deploy/systemd/emigro-threads-refresh.service /etc/systemd/system/
  cp deploy/systemd/emigro-threads-refresh.timer /etc/systemd/system/
  cp deploy/systemd/emigro-threads-investment.service /etc/systemd/system/
  cp deploy/systemd/emigro-threads-investment.timer /etc/systemd/system/
fi
systemctl disable --now emigro-threads-replies.timer emigro-threads-replies.service 2>/dev/null || true
rm -f /etc/systemd/system/emigro-threads-replies.timer /etc/systemd/system/emigro-threads-replies.service
systemctl daemon-reload
systemctl mask emigro-threads-replies.timer emigro-threads-replies.service
systemctl enable --now emigro-threads-daily.timer
systemctl enable --now emigro-threads-satellites.timer
systemctl enable --now emigro-threads-refresh.timer
systemctl enable --now emigro-threads-investment.timer

echo "HEAD=\$(git rev-parse --short HEAD) (farm files not reset)"
git log -1 --oneline
systemctl list-timers --all | grep emigro-threads || true
REMOTE

echo "✅ VPS at git ${REF} with farm lock respected. Site is Vercel."
