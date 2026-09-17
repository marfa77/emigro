#!/usr/bin/env bash
set -euo pipefail

ROOT="/opt/emigro"
cd "$ROOT"

# The TypeScript runner still requires its own --force-publish gate and refuses
# phases beyond THREADS_INVESTMENT_PHASE.
npm run threads:investment:daily -- --force-publish
