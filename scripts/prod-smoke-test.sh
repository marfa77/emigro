#!/usr/bin/env bash
# Full production smoke test for www.emigro.online
set -uo pipefail

BASE="${1:-https://www.emigro.online}"
PASS=0
FAIL=0
WARN=0

ok()   { echo "✅ $1"; PASS=$((PASS+1)); }
fail() { echo "❌ $1"; FAIL=$((FAIL+1)); }
warn() { echo "⚠️  $1"; WARN=$((WARN+1)); }

check_status() {
  local label="$1" url="$2" expect="${3:-200}"
  local follow="${4:-yes}"
  local curl_args=(-sS -o /dev/null -w "%{http_code}" --max-time 25)
  [[ "$follow" == "yes" ]] && curl_args+=(-L)
  local code
  code=$(curl "${curl_args[@]}" "$url" || echo "000")
  if [[ "$code" == "$expect" ]]; then ok "$label ($code)"; else fail "$label expected $expect got $code — $url"; fi
}

check_contains() {
  local label="$1" url="$2" needle="$3"
  local body
  body=$(curl -sS -L --max-time 25 "$url" || true)
  if echo "$body" | grep -q "$needle"; then ok "$label"; else fail "$label — missing '$needle' in $url"; fi
}

echo "=== Emigro prod smoke: $BASE ==="
echo ""

# Core pages (root uses Next.js redirect — 307 without follow)
check_status "page / → /ru redirect" "$BASE/" "307" "no"
for path in /ru /ru/wizard /ru/guides /ru/news /ru/contact /ru/partners /ru/privacy /ru/terms /ru/cookies; do
  check_status "page $path" "$BASE$path"
done

# Corridors
for c in portugal spain france italy germany netherlands scandinavia; do
  check_status "corridor /ru/$c" "$BASE/ru/$c"
  check_status "wizard /ru/$c/wizard" "$BASE/ru/$c/wizard"
  check_status "digest /ru/$c/digest" "$BASE/ru/$c/digest"
done

# Guides sample
check_status "guide pillar" "$BASE/ru/guides/kuda-pereehat-iz-rossii-2026-evropa-vnj"
check_contains "guide content" "$BASE/ru/guides/kuda-pereehat-iz-rossii-2026-evropa-vnj" "wizard"

# News article
check_status "news article" "$BASE/ru/news/portugal-relocation-news-2026-06-24"
check_contains "news article title" "$BASE/ru/news/portugal-relocation-news-2026-06-24" "Португал"

# Program page
check_status "program D8" "$BASE/ru/portugal/programs/portugal-d8-digital-nomad"

# SEO
check_status "sitemap" "$BASE/sitemap.xml"
check_contains "sitemap guides" "$BASE/sitemap.xml" "/ru/guides/"
check_status "robots" "$BASE/robots.txt"
check_contains "robots admin disallow" "$BASE/robots.txt" "admin"

# Assets
check_status "favicon" "$BASE/favicon.svg"
check_status "og image" "$BASE/og-default.svg"

# Admin protected (do not follow redirect — login page would return 200)
code=$(curl -sS -o /dev/null -w "%{http_code}" --max-time 15 "$BASE/admin/leads" || echo "000")
if [[ "$code" == "307" || "$code" == "308" || "$code" == "302" ]]; then
  ok "admin /admin/leads redirects to login ($code)"
else
  fail "admin /admin/leads status $code (expected redirect)"
fi
check_status "admin login page" "$BASE/admin/login"

# Hub wizard API
SESSION=$(curl -sS -X POST "$BASE/api/v1/hub/wizard/sessions" \
  -H "Content-Type: application/json" \
  -d '{"wizard_id":"hub-global-v1","answers":{"passport_iso2":"BY","relocation_goal":"residency","remote_income":"yes","monthly_income_eur":"5000","relocating_with_spouse":"yes","relocating_children_count":"1"}}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin).get('id',''))" 2>/dev/null || echo "")

if [[ -n "$SESSION" && "$SESSION" != "" ]]; then
  ok "hub wizard session created ($SESSION)"
  EVAL=$(curl -sS -X POST "$BASE/api/v1/hub/wizard/sessions/$SESSION/evaluate" --max-time 120)
  MATCHES=$(echo "$EVAL" | python3 -c "import sys,json; d=json.load(sys.stdin); print(len([r for r in d.get('results',[]) if r.get('outcome')!='unlikely']))" 2>/dev/null || echo "0")
  PICK=$(echo "$EVAL" | python3 -c "import sys,json; d=json.load(sys.stdin); print((d.get('pick') or {}).get('programSlug',''))" 2>/dev/null || echo "")
  if [[ "$MATCHES" -gt 0 ]]; then ok "hub evaluate: $MATCHES matches, pick=$PICK"; else fail "hub evaluate: 0 matches"; fi
else
  fail "hub wizard session creation"
fi

# Corridor wizard API (Portugal)
PT_SESSION=$(curl -sS -X POST "$BASE/api/v1/corridors/ru-speaking-to-portugal/wizard/sessions" \
  -H "Content-Type: application/json" \
  -d '{"wizard_id":"00000000-0000-0000-0000-000000000001","answers":{"passport_iso2":"RU","remote_income":"yes","monthly_income_eur":"4000"}}' \
  2>/dev/null | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('id',''))" 2>/dev/null || echo "")

# Try fetching actual wizard id from API
WIZARD_JSON=$(curl -sS "$BASE/api/v1/corridors/ru-speaking-to-portugal/wizard" --max-time 20 2>/dev/null || echo "{}")
WIZARD_ID=$(echo "$WIZARD_JSON" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('id',''))" 2>/dev/null || echo "")

if [[ -n "$WIZARD_ID" ]]; then
  ok "portugal wizard API ($WIZARD_ID)"
  PT_SESSION=$(curl -sS -X POST "$BASE/api/v1/corridors/ru-speaking-to-portugal/wizard/sessions" \
    -H "Content-Type: application/json" \
    -d "{\"wizard_id\":\"$WIZARD_ID\",\"answers\":{\"passport_iso2\":\"RU\",\"remote_income\":\"yes\",\"monthly_income_eur\":\"4000\",\"relocating_with_spouse\":\"yes\",\"relocating_children_count\":\"2\"}}" \
    | python3 -c "import sys,json; print(json.load(sys.stdin).get('id',''))" 2>/dev/null || echo "")
  if [[ -n "$PT_SESSION" ]]; then
    ok "portugal wizard session ($PT_SESSION)"
    PT_EVAL=$(curl -sS -X POST "$BASE/api/v1/corridors/ru-speaking-to-portugal/wizard/sessions/$PT_SESSION/evaluate" --max-time 90)
    PT_D8=$(echo "$PT_EVAL" | python3 -c "import sys,json; r=json.load(sys.stdin).get('results',[]); print(next((x['outcome'] for x in r if 'd8' in x.get('programSlug','')), 'none'))" 2>/dev/null || echo "err")
    ok "portugal evaluate done (D8 outcome: $PT_D8)"
  else
    fail "portugal wizard session"
  fi
else
  warn "portugal wizard API — could not fetch wizard id"
fi

# Corridor public API
check_status "corridor API" "$BASE/api/v1/corridors/ru-speaking-to-portugal"

# News RSS
check_status "news RSS" "$BASE/ru/news/feed.xml"

echo ""
echo "=== SUMMARY ==="
echo "PASS: $PASS | FAIL: $FAIL | WARN: $WARN"
[[ "$FAIL" -eq 0 ]] && exit 0 || exit 1
