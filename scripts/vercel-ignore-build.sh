#!/usr/bin/env bash
# Vercel Ignored Build Step: exit 0 = skip build, exit 1 = build.
# Skip when the commit only touches docs/scripts/reports (not the Next app).
set -euo pipefail

if [[ "${VERCEL_FORCE_BUILD:-}" == "1" ]]; then
  echo "▶ VERCEL_FORCE_BUILD=1 — build"
  exit 1
fi

PREV="${VERCEL_GIT_PREVIOUS_SHA:-}"
CURR="${VERCEL_GIT_COMMIT_SHA:-HEAD}"

if [[ -z "$PREV" ]] || ! git cat-file -e "${PREV}^{commit}" 2>/dev/null; then
  if git rev-parse --verify HEAD^ >/dev/null 2>&1; then
    PREV="HEAD^"
  else
    echo "▶ No previous commit — build"
    exit 1
  fi
fi

# Paths that change the running site / build graph.
APP_PATHS=(
  app
  components
  lib
  public
  data
  content
  types
  middleware.ts
  next.config.mjs
  next.config.ts
  package.json
  package-lock.json
  pnpm-lock.yaml
  yarn.lock
  tsconfig.json
  vercel.json
  postcss.config.mjs
  tailwind.config.ts
  instrumentation.ts
  instrumentation-client.ts
  auth.ts
  auth.config.ts
)

if git diff --quiet "$PREV" "$CURR" -- "${APP_PATHS[@]}"; then
  echo "⏭ Skipping build — no app/runtime changes ($PREV...$CURR)"
  exit 0
fi

echo "▶ Building — app/runtime files changed ($PREV...$CURR)"
exit 1
