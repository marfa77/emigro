#!/usr/bin/env bash
# Daily YouTube Shorts (@Emigro_news) — VPS systemd (same host as Portugal parser).
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$REPO_ROOT"

notify_cron_failure() {
  local detail="$1"
  if [[ -f "$REPO_ROOT/.env" ]]; then
    set -a
    # shellcheck disable=SC1091
    source "$REPO_ROOT/.env"
    set +a
  fi
  (cd "$REPO_ROOT" && npm run youtube-short:notify-cron -- "$detail") >/dev/null 2>&1 || true
}

LOG_DIR="$REPO_ROOT/data/youtube-shorts/logs"
LOCK_FILE="$REPO_ROOT/data/youtube-shorts/.daily.lock"
DATA_DIR="$REPO_ROOT/data/youtube-shorts"
mkdir -p "$LOG_DIR" "$DATA_DIR" "$REPO_ROOT/data/gcloud-config"

# Service runs as www-data; dirs must be writable (root-owned dirs break exec redirect).
if [[ ! -w "$DATA_DIR" || ! -w "$LOG_DIR" ]]; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S %Z')] ERROR: $DATA_DIR not writable by $(id -un). Fix: chown -R www-data:www-data $DATA_DIR" >&2
  notify_cron_failure "Нет прав на запись в $DATA_DIR (user $(id -un)). chown www-data."
  exit 1
fi

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S %Z')] $*"
}

LOG_FILE="$LOG_DIR/scheduled-$(date +%Y%m%d).log"
if ! touch "$LOG_FILE" 2>/dev/null; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S %Z')] ERROR: cannot write log $LOG_FILE" >&2
  notify_cron_failure "Не удалось создать лог $LOG_FILE (часто root-owned файл после ручного запуска)."
  exit 1
fi
exec >> "$LOG_FILE" 2>&1

if [[ -f "$REPO_ROOT/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$REPO_ROOT/.env"
  set +a
fi

export EMIGRO_YOUTUBE_SHORTS_ENABLED="${EMIGRO_YOUTUBE_SHORTS_ENABLED:-1}"
export EMIGRO_YOUTUBE_SHORTS_OUTPUT_ROOT="${EMIGRO_YOUTUBE_SHORTS_OUTPUT_ROOT:-$REPO_ROOT/data/youtube-shorts}"
export EMIGRO_YOUTUBE_SHORTS_STATE_FILE="${EMIGRO_YOUTUBE_SHORTS_STATE_FILE:-$REPO_ROOT/data/youtube-shorts-state.json}"
export GSUTIL_HOME="${GSUTIL_HOME:-$REPO_ROOT/data}"
export CLOUDSDK_CONFIG="${CLOUDSDK_CONFIG:-$REPO_ROOT/data/gcloud-config}"
export GOOGLE_APPLICATION_CREDENTIALS="${GOOGLE_APPLICATION_CREDENTIALS:-$REPO_ROOT/data/gcs-upload-key.json}"

if [[ -f "$GOOGLE_APPLICATION_CREDENTIALS" ]] && command -v gcloud >/dev/null 2>&1; then
  gcloud auth activate-service-account --key-file="$GOOGLE_APPLICATION_CREDENTIALS" >/dev/null 2>&1 || true
fi

log "=== Emigro YouTube Shorts daily ==="

if ! npm run news:youtube-short -- --health >/tmp/youtube-shorts-health.log 2>&1; then
  log "ERROR: health check failed — see /tmp/youtube-shorts-health.log"
  cat /tmp/youtube-shorts-health.log || true
  notify_cron_failure "Health check failed — см. /tmp/youtube-shorts-health.log"
  exit 1
fi
log "Health check OK"

for bin in ffmpeg ffprobe gsutil npm; do
  if ! command -v "$bin" >/dev/null 2>&1; then
    log "ERROR: missing dependency: $bin"
    exit 1
  fi
done

run_pipeline() {
  cd "$REPO_ROOT" && npm run news:youtube-short:daily
}

if command -v flock >/dev/null 2>&1; then
  exec 9>"$LOCK_FILE"
  if ! flock -n 9; then
    log "=== YouTube Shorts daily skipped (already running) ==="
    exit 0
  fi
fi

if run_pipeline; then
  log "=== YouTube Shorts daily OK ==="
  exit 0
else
  code=$?
  log "=== YouTube Shorts daily FAILED (exit $code) ==="
  notify_cron_failure "Pipeline exit $code — см. $LOG_FILE"
  exit "$code"
fi
