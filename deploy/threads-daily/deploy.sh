#!/usr/bin/env bash
# Backward-compatible entry: deploy Threads from GitHub main (git on VPS).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
exec bash "${ROOT}/scripts/deploy_vps_from_git.sh"
