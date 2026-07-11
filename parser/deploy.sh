#!/usr/bin/env bash
# Deploy Emigro Portugal cron to VPS (same host/pattern as Barakhlo parser).
set -euo pipefail

PARSER_ROOT="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$PARSER_ROOT/.." && pwd)"
cd "$REPO_ROOT"

DEPLOY_USER_HOME="$(python3 -c 'import os,pwd; print(pwd.getpwuid(os.getuid()).pw_dir)' 2>/dev/null || echo "/Users/$(whoami)")"
SERVER_USER="${SERVER_USER:-root}"
SERVER_HOST="${SERVER_HOST:-37.27.0.210}"
SSH_KEY="${SSH_KEY:-${DEPLOY_USER_HOME}/.ssh/id_ed25519_github}"
REMOTE="${REMOTE:-/opt/emigro}"

echo "🚀 Деплой Emigro parser cron (Portugal + Spain) → ${SERVER_USER}@${SERVER_HOST}:${REMOTE}"

echo "📁 rsync emigro (parser + scripts + lib)..."
rsync -avz --delete \
  --exclude 'node_modules' --exclude '.next' --exclude '.git' \
  --exclude 'parser/.venv' --exclude 'parser/media' --exclude 'parser/tg.session' \
  --exclude 'parser/__pycache__' --exclude 'parser/logs' --exclude 'parser/.env' \
  --exclude 'parser/state.json' --exclude 'parser/.scheduled.lock' \
  --exclude '.env' --exclude '.env.local' \
  --exclude '.DS_Store' \
  -e "ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no" \
  ./ "${SERVER_USER}@${SERVER_HOST}:${REMOTE}/"

echo "📥 venv + deps on server..."
ssh -i "${SSH_KEY}" -o StrictHostKeyChecking=no "${SERVER_USER}@${SERVER_HOST}" \
  "set -euo pipefail; \
   cd ${REMOTE}; \
   chown -R www-data:www-data ${REMOTE}; \
   cd parser; \
   python3 -m venv .venv; \
   . .venv/bin/activate; \
   pip install -q -U pip; \
   pip install -q -r requirements.txt; \
   chmod +x run_scheduled.sh run_scheduled_spain.sh run_daily.sh deploy.sh; \
   mkdir -p logs out; \
   chown -R www-data:www-data logs out; \
   cd ${REMOTE}; \
   if command -v npm >/dev/null 2>&1; then \
     npm ci --include=dev; \
   else \
     echo 'WARN: npm not found — install Node 20+ on VPS'; \
   fi; \
   cp ${REMOTE}/deploy/systemd/emigro-portugal-community.service /etc/systemd/system/; \
   cp ${REMOTE}/deploy/systemd/emigro-portugal-community.timer /etc/systemd/system/; \
   cp ${REMOTE}/deploy/systemd/emigro-spain-community.service /etc/systemd/system/; \
   cp ${REMOTE}/deploy/systemd/emigro-spain-community.timer /etc/systemd/system/; \
   cp ${REMOTE}/deploy/systemd/emigro-prep2go-news.service /etc/systemd/system/; \
   cp ${REMOTE}/deploy/systemd/emigro-prep2go-news.timer /etc/systemd/system/; \
   cp ${REMOTE}/deploy/systemd/emigro-youtube-shorts.service /etc/systemd/system/; \
   cp ${REMOTE}/deploy/systemd/emigro-youtube-shorts.timer /etc/systemd/system/; \
   chmod +x ${REMOTE}/deploy/prep2go-news/run_scheduled.sh; \
   chmod +x ${REMOTE}/deploy/youtube-shorts/run_daily.sh; \
   mkdir -p ${REMOTE}/deploy/prep2go-news/logs; \
   mkdir -p ${REMOTE}/data/youtube-shorts/logs; \
   chown -R www-data:www-data ${REMOTE}/deploy/prep2go-news/logs; \
   systemctl daemon-reload; \
   systemctl enable --now emigro-prep2go-news.timer; \
   systemctl enable --now emigro-portugal-community.timer; \
   systemctl enable --now emigro-spain-community.timer; \
   systemctl enable --now emigro-youtube-shorts.timer; \
   systemctl list-timers --all | grep emigro || true"

echo ""
echo "✅ Деплой завершён. Проверка: systemctl start emigro-portugal-community.service"
echo "   Spain: systemctl start emigro-spain-community.service"
