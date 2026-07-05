#!/usr/bin/env bash
# Pull EMIGRO_YOUTUBE_* OAuth vars from production VPS into .env.local
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="${ROOT}/.env.local"
SSH_KEY="${SSH_KEY:-${HOME}/.ssh/id_ed25519_github}"
SERVER="${SERVER:-root@37.27.0.210}"
REMOTE_ENV="${REMOTE_ENV:-/opt/emigro/.env}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing $ENV_FILE"
  exit 1
fi

lines="$(
  ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "$SERVER" \
    "grep -E '^EMIGRO_YOUTUBE_(CLIENT_ID|CLIENT_SECRET|REFRESH_TOKEN)=' '$REMOTE_ENV' 2>/dev/null || true"
)"

if [[ -z "${lines//[[:space:]]/}" ]]; then
  echo "No EMIGRO_YOUTUBE_* OAuth vars on VPS ($REMOTE_ENV)."
  echo "Run once locally: npm run youtube:oauth-setup"
  exit 1
fi

python3 - "$ENV_FILE" <<PY
import re, sys
path = sys.argv[1]
raw = """$lines"""
updates = dict(line.split("=", 1) for line in raw.splitlines() if "=" in line)
text = open(path, encoding="utf-8").read()
for key, value in updates.items():
    line = f"{key}={value}"
    pattern = rf"^{re.escape(key)}=.*$"
    if re.search(pattern, text, flags=re.M):
        text = re.sub(pattern, line, text, flags=re.M)
    elif not text.endswith("\n"):
        text += "\n" + line + "\n"
    else:
        text += line + "\n"
open(path, "w", encoding="utf-8").write(text)
print(f"Synced {len(updates)} vars into {path}")
PY
