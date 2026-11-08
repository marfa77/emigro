#!/usr/bin/env bash
# Runs as root (ExecStartPre=+) before the www-data shorts job.
# /opt/emigro/data arrives from the Mac rsync owned by 501:staff, so www-data
# cannot create the state file or write caches there. Fix ownership of only
# the paths the pipeline writes, and seed the state file if it is missing.
set -euo pipefail

DATA=/opt/emigro/data
OUT="$DATA/youtube-shorts"
STATE="$OUT/state.json"

mkdir -p "$OUT/logs" "$DATA/broll-cache" "$DATA/gcloud-config" "$DATA/.gsutil"

if [[ ! -s "$STATE" ]]; then
  for seed in "$DATA/youtube-shorts-state.json" "$DATA/vps-youtube-shorts-state.json"; do
    if [[ -s "$seed" ]]; then
      cp "$seed" "$STATE"
      break
    fi
  done
  [[ -s "$STATE" ]] || echo '{"published":[]}' > "$STATE"
fi

chown -R www-data:www-data "$OUT" "$DATA/broll-cache" "$DATA/gcloud-config" "$DATA/.gsutil"
exit 0
