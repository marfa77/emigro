#!/usr/bin/env bash
# Emergency CLI Production deploy only.
# Prefer: npm run deploy:check && git push origin main (Git integration).
# Never run this in the same turn as pushing the same commit to main.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "deploy:cli — emergency path. Prefer git push to main + wait for Git deploy."
echo "Checking for an in-flight Production deploy…"

STATUS_OUT="$(vercel ls 2>&1 || true)"
if printf '%s\n' "$STATUS_OUT" | head -n 40 | grep -E 'Building[[:space:]]+Production' >/dev/null 2>&1; then
  echo "Abort: a Production deploy is already Building."
  echo "Wait for Ready (npm run deploy:status). Do not start a second Production build."
  printf '%s\n' "$STATUS_OUT" | head -n 25
  exit 1
fi

npm run portugal:assert-note-assets
npm run build
exec vercel --prod
