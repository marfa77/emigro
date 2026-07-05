#!/usr/bin/env bash
# Deploy YouTube Shorts daily pipeline to Emigro VPS (+ GCS auth for www-data).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

DEPLOY_USER_HOME="$(python3 -c 'import os,pwd; print(pwd.getpwuid(os.getuid()).pw_dir)' 2>/dev/null || echo "/Users/$(whoami)")"
SERVER_USER="${SERVER_USER:-root}"
SERVER_HOST="${SERVER_HOST:-37.27.0.210}"
SSH_KEY="${SSH_KEY:-${DEPLOY_USER_HOME}/.ssh/id_ed25519_github}"
REMOTE="${REMOTE:-/opt/emigro}"

SSH=(ssh -i "${SSH_KEY}" -o StrictHostKeyChecking=no)
RSYNC=(rsync -avz -e "ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no")

echo "🎬 Deploy Emigro YouTube Shorts → ${SERVER_USER}@${SERVER_HOST}:${REMOTE}"

echo "📁 rsync repo…"
rsync -avz --delete \
  --exclude 'node_modules' --exclude '.next' --exclude '.git' \
  --exclude 'parser/.venv' --exclude 'parser/media' --exclude 'parser/tg.session' \
  --exclude 'parser/__pycache__' --exclude 'parser/logs' --exclude 'parser/.env' \
  --exclude 'parser/state.json' --exclude 'parser/.scheduled.lock' \
  --exclude '.env' --exclude '.env.local' \
  --exclude 'scripts/output' --exclude 'data/gcs-upload-key.json' \
  --exclude 'data/youtube-shorts' --exclude 'data/youtube-shorts-state.json' \
  --exclude 'data/gcloud-config' --exclude 'data/.gsutil' --exclude 'data/.npm' \
  --exclude 'data/Library' \
  --exclude '.DS_Store' \
  -e "ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no" \
  ./ "${SERVER_USER}@${SERVER_HOST}:${REMOTE}/"

echo "📥 deps + systemd on server…"
"${SSH[@]}" "${SERVER_USER}@${SERVER_HOST}" bash -s <<REMOTE
set -euo pipefail
REMOTE="${REMOTE}"
cd "\$REMOTE"
chown -R www-data:www-data "\$REMOTE"
chmod +x deploy/youtube-shorts/run_daily.sh

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "Installing ffmpeg…"
  apt-get update -qq && apt-get install -y ffmpeg
fi

if command -v npm >/dev/null 2>&1; then
  npm ci --include=dev
else
  echo "ERROR: npm not found — install Node 20+ on VPS"
  exit 1
fi

mkdir -p data/youtube-shorts/logs data/gcloud-config
# Migrate queue state from manual runs (scripts/output) if systemd state is missing.
if [[ ! -f data/youtube-shorts-state.json && -f scripts/output/youtube-shorts-state.json ]]; then
  cp scripts/output/youtube-shorts-state.json data/youtube-shorts-state.json
fi
chown -R www-data:www-data data/youtube-shorts data/gcloud-config
chown -R www-data:www-data data

cp deploy/systemd/emigro-youtube-shorts.service /etc/systemd/system/
cp deploy/systemd/emigro-youtube-shorts.timer /etc/systemd/system/
systemctl daemon-reload
systemctl enable emigro-youtube-shorts.timer
systemctl start emigro-youtube-shorts.timer
systemctl list-timers --all | grep emigro-youtube || true
REMOTE

KEY_FILE="$(mktemp)"
trap 'rm -f "$KEY_FILE"' EXIT

npx tsx -e "
import { config } from 'dotenv';
import { resolve } from 'path';
import { writeFileSync } from 'fs';
config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });
const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim();
if (!raw) process.exit(2);
writeFileSync(process.argv[1], JSON.stringify(JSON.parse(raw)));
" "$KEY_FILE" 2>/dev/null || GCS_SKIP=1

if [[ "${GCS_SKIP:-}" != "1" ]] && [[ -s "$KEY_FILE" ]]; then
  echo "🔐 Installing GCS key…"
  "${RSYNC[@]}" "$KEY_FILE" "${SERVER_USER}@${SERVER_HOST}:${REMOTE}/data/gcs-upload-key.json"
  "${SSH[@]}" "${SERVER_USER}@${SERVER_HOST}" bash -s <<REMOTE
set -e
REMOTE="${REMOTE}"
chown www-data:www-data "\$REMOTE/data/gcs-upload-key.json"
chmod 600 "\$REMOTE/data/gcs-upload-key.json"
mkdir -p "\$REMOTE/data/.gsutil"
chown -R www-data:www-data "\$REMOTE/data/gcloud-config" "\$REMOTE/data/.gsutil"
if command -v gcloud >/dev/null 2>&1; then
  sudo -u www-data env HOME="\$REMOTE/data" GSUTIL_HOME="\$REMOTE/data" CLOUDSDK_CONFIG="\$REMOTE/data/gcloud-config" GOOGLE_APPLICATION_CREDENTIALS="\$REMOTE/data/gcs-upload-key.json" gcloud auth activate-service-account --key-file="\$REMOTE/data/gcs-upload-key.json" || true
fi
REMOTE
elif [[ -s "$ROOT/data/gcs-upload-key.json" ]]; then
  echo "🔐 Installing GCS key from data/gcs-upload-key.json…"
  "${RSYNC[@]}" "$ROOT/data/gcs-upload-key.json" "${SERVER_USER}@${SERVER_HOST}:${REMOTE}/data/gcs-upload-key.json"
  "${SSH[@]}" "${SERVER_USER}@${SERVER_HOST}" bash -s <<REMOTE
set -e
REMOTE="${REMOTE}"
chown www-data:www-data "\$REMOTE/data/gcs-upload-key.json"
chmod 600 "\$REMOTE/data/gcs-upload-key.json"
mkdir -p "\$REMOTE/data/gcloud-config" "\$REMOTE/data/.gsutil"
chown -R www-data:www-data "\$REMOTE/data/gcloud-config" "\$REMOTE/data/.gsutil"
if command -v gcloud >/dev/null 2>&1; then
  sudo -u www-data env HOME="\$REMOTE/data" GSUTIL_HOME="\$REMOTE/data" CLOUDSDK_CONFIG="\$REMOTE/data/gcloud-config" GOOGLE_APPLICATION_CREDENTIALS="\$REMOTE/data/gcs-upload-key.json" gcloud auth activate-service-account --key-file="\$REMOTE/data/gcs-upload-key.json" || true
fi
REMOTE
else
  echo "⚠️  SKIP GCS key (GOOGLE_SERVICE_ACCOUNT_JSON not in .env.local, no data/gcs-upload-key.json)"
fi

echo ""
echo "✅ YouTube Shorts timer enabled (09:15 UTC daily)."
echo "   Add to ${REMOTE}/.env on VPS: OPENAI_API_KEY, GOOGLE_API_KEY"
echo "   Manual: systemctl start emigro-youtube-shorts.service"
echo "   Logs:   tail -f ${REMOTE}/data/youtube-shorts/logs/scheduled-\$(date +%Y%m%d).log"
