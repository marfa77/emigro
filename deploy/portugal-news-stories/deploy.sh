#!/usr/bin/env bash
# Deploy Portugal Observador story tiles cron to Emigro VPS.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

DEPLOY_USER_HOME="$(python3 -c 'import os,pwd; print(pwd.getpwuid(os.getuid()).pw_dir)' 2>/dev/null || echo "/Users/$(whoami)")"
SERVER_USER="${SERVER_USER:-root}"
SERVER_HOST="${SERVER_HOST:-37.27.0.210}"
SSH_KEY="${SSH_KEY:-${DEPLOY_USER_HOME}/.ssh/id_ed25519_github}"
REMOTE="${REMOTE:-/opt/emigro}"

SSH=(ssh -i "${SSH_KEY}" -o StrictHostKeyChecking=no)

echo "🇵🇹 Deploy Portugal news stories cron → ${SERVER_USER}@${SERVER_HOST}:${REMOTE}"

rsync -avz \
  --exclude 'node_modules' --exclude '.next' --exclude '.git' \
  --exclude 'parser/.venv' --exclude 'parser/media' --exclude 'parser/tg.session' \
  --exclude 'parser/__pycache__' --exclude 'parser/logs' --exclude 'parser/.env' \
  --exclude '.env' --exclude '.env.local' --exclude '.DS_Store' \
  --exclude 'scripts/output' \
  -e "ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no" \
  ./ "${SERVER_USER}@${SERVER_HOST}:${REMOTE}/"

"${SSH[@]}" "${SERVER_USER}@${SERVER_HOST}" bash -s <<REMOTE
set -euo pipefail
REMOTE="${REMOTE}"
cd "\$REMOTE"
chmod +x deploy/portugal-news-stories/run_scheduled.sh
mkdir -p deploy/portugal-news-stories/logs
chown -R www-data:www-data deploy/portugal-news-stories/logs
if command -v npm >/dev/null 2>&1; then
  npm ci --include=dev
fi
cp deploy/systemd/emigro-portugal-news-stories.service /etc/systemd/system/
cp deploy/systemd/emigro-portugal-news-stories.timer /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now emigro-portugal-news-stories.timer
systemctl list-timers --all | grep portugal-news-stories || true

if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi
SECRET="\${CRON_SECRET:-\${EMIGRO_ADMIN_SECRET:-}}"
SITE="\${EMIGRO_PUBLIC_SITE_URL:-https://www.emigro.online}"
if [[ "\$SITE" == *"localhost"* ]]; then
  SITE="https://www.emigro.online"
fi
if [[ -n "\$SECRET" ]]; then
  curl -sS -X POST "\${SITE%/}/api/revalidate/news" \
    -H "Authorization: Bearer \$SECRET" \
    -H "Content-Type: application/json" \
    -d '{"slugs":["portugal-story-2026-08-08-13tjll","portugal-story-2026-08-08-1arfe8","portugal-story-2026-08-08-1dwd14"]}' \
    || true
  echo
else
  echo "WARN: no CRON_SECRET on VPS — skip revalidate"
fi
REMOTE

echo "✅ Portugal news stories timer enabled (10:00 UTC daily)"
