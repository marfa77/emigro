#!/usr/bin/env bash
# VPS: scan @milan_4at + @como_4at → draft + factcheck → DM (every 12h timer).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"
mkdir -p scripts/output deploy/milan4at-scan/logs
export PATH="/usr/local/bin:/usr/bin:/bin:${PATH:-}"
# Hours window slightly under 12h so we don't miss posts between runs
exec npx tsx scripts/milan-4at-scan.ts --hours=13 --max=5
