#!/usr/bin/env bash
# Installed copy lives on the VPS at /opt/farm-lock/farm-protect.sh
# Canonical source: Barakhlo/scripts/farm_protect.sh
set -euo pipefail
exec /opt/farm-lock/farm-protect.sh "$@"
