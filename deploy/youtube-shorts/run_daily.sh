#!/usr/bin/env bash
# Daily YouTube Shorts (@Emigro_news) — VPS systemd (same host as Portugal parser).
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$REPO_ROOT"

LOG_DIR="$REPO_ROOT/data/youtube-shorts/logs"
LOCK_FILE="$REPO_ROOT/data/youtube-shorts/.daily.lock"
mkdir -p "$LOG_DIR" "$REPO_ROOT/data/youtube-shorts" "$REPO_ROOT/data/gcloud-config"
chmod 775 "$REPO_ROOT/data/youtube-shorts" "$LOG_DIR" 2>/dev/null || true

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S %Z')] $*"
}

exec >> "$LOG_DIR/scheduled-$(date +%Y%m%d).log" 2>&1

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

log "=== Emigro YouTube Shorts daily ==="

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
fi

code=$?
log "=== YouTube Shorts daily FAILED (exit $code) ==="
exit "$code"
