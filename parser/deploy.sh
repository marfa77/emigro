#!/usr/bin/env bash
# Deploy Emigro Portugal cron to VPS (same host/pattern as Barakhlo parser).
set -euo pipefail

PARSER_ROOT="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$PARSER_ROOT/.." && pwd)"
cd "$REPO_ROOT"

SERVER_USER="${SERVER_USER:-root}"
SERVER_HOST="${SERVER_HOST:-37.27.0.210}"
SSH_KEY="${SSH_KEY:-$HOME/.ssh/id_ed25519_github}"
REMOTE="${REMOTE:-/opt/emigro}"

echo "🚀 Деплой Emigro Portugal cron → ${SERVER_USER}@${SERVER_HOST}:${REMOTE}"

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
   chmod +x run_scheduled.sh run_daily.sh deploy.sh; \
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
   systemctl daemon-reload; \
   systemctl enable --now emigro-portugal-community.timer; \
   systemctl list-timers --all | grep emigro-portugal || true"

echo ""
echo "✅ Деплой завершён. Проверка: systemctl start emigro-portugal-community.service"
