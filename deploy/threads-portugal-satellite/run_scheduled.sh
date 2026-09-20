#!/usr/bin/env bash
set -euo pipefail
ROOT="/opt/emigro"
cd "$ROOT"
npm run threads:pt-sat:daily -- --force-publish
