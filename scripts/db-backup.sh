#!/usr/bin/env bash
# Logical backup of the linked Supabase Postgres database.
# Output: backups/emigro-YYYYMMDD[-tag].sql.gz (gitignored)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

PROJECT_REF="wcwadwcjqutdxwbrkyai"
OUT_DIR="${DB_BACKUP_DIR:-$ROOT/backups}"
TAG=""

usage() {
  cat <<'EOF'
Usage: scripts/db-backup.sh [--tag LABEL]

Creates a gzipped SQL dump of the linked emigro Supabase project.

Options:
  --tag LABEL   Suffix for pre-migration snapshots (e.g. before-poland-wait-times)
  -h, --help    Show this help

Requires:
  - supabase CLI (brew install supabase/tap/supabase)
  - supabase link --project-ref wcwadwcjqutdxwbrkyai (once per machine)
  - SUPABASE_DB_PASSWORD in .env.local, or pass -p via env

Examples:
  npm run db:backup
  npm run db:backup -- --tag before-risky-migration
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --tag)
      TAG="${2:-}"
      shift 2
      ;;
    -h | --help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

if ! command -v supabase >/dev/null 2>&1; then
  echo "supabase CLI not found. Install: brew install supabase/tap/supabase" >&2
  exit 1
fi

if [[ -f "$ROOT/.env.local" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$ROOT/.env.local"
  set +a
fi

if [[ -z "${SUPABASE_DB_PASSWORD:-}" ]]; then
  echo "SUPABASE_DB_PASSWORD is not set." >&2
  echo "Add it to .env.local or export it before running this script." >&2
  echo "Password: Supabase Dashboard → Project Settings → Database." >&2
  exit 1
fi

mkdir -p "$OUT_DIR"

STAMP="$(date -u +%Y%m%d-%H%M%S)"
BASENAME="emigro-${STAMP}"
if [[ -n "$TAG" ]]; then
  SAFE_TAG="$(echo "$TAG" | tr '[:upper:]' '[:lower:]' | tr -cs 'a-z0-9-' '-' | sed 's/^-//;s/-$//')"
  BASENAME="${BASENAME}-${SAFE_TAG}"
fi

SQL_PATH="$OUT_DIR/${BASENAME}.sql"
GZ_PATH="${SQL_PATH}.gz"

echo "→ Dumping project ${PROJECT_REF} to ${GZ_PATH}"

supabase db dump \
  --linked \
  --password "$SUPABASE_DB_PASSWORD" \
  -f "$SQL_PATH"

gzip -9 -f "$SQL_PATH"

BYTES="$(wc -c <"$GZ_PATH" | tr -d ' ')"
echo "✓ Backup ready: ${GZ_PATH} (${BYTES} bytes)"
echo "  Keep off Supabase (local disk, GitHub Actions artifact, or external storage)."
