"""Apply the year-2027 title rule (scripts/year-2027-titles.py) to community_notes title / seo_title /
seo_description / excerpt in the DB. Festival / event notes are skipped. --dry-run prints counts only."""
import json, os, re, sys, urllib.request

ns = {}
exec(open("scripts/year-2027-titles.py", encoding="utf-8").read().split("changed = kept = 0")[0], ns)
switch = ns["switch"]
env = {}
for line in open(".env.local", encoding="utf-8"):
    if "=" in line and not line.startswith("#"):
        k, v = line.rstrip("\n").split("=", 1)
        env[k] = v.strip().strip('"')
U = env.get("NEXT_PUBLIC_SUPABASE_URL") or env["SUPABASE_URL"]
K = env["SUPABASE_SERVICE_ROLE_KEY"]
H = {"apikey": K, "Authorization": "Bearer " + K, "Content-Type": "application/json"}
DRY = "--dry-run" in sys.argv
FIELDS = ["title", "seo_title", "seo_description", "excerpt"]
rows = json.load(urllib.request.urlopen(urllib.request.Request(f"{U}/rest/v1/community_notes?select=id,slug,content_kind,{','.join(FIELDS)}&limit=2000", headers=H)))
n = 0
for r in rows:
    # Guides only: news notes date events («с 2026 года», «отмена льгот в 2026?»).
    if r.get("content_kind") != "guide" or re.search(r"festival|fest|afisha|calendar|event|kontsert", r["slug"], re.I):
        continue
    patch = {f: switch(r[f]) for f in FIELDS if r.get(f) and switch(r[f]) != r[f]}
    if not patch:
        continue
    n += 1
    if DRY:
        if n <= 8:
            print(" ", r["slug"], "→", patch.get("title") or patch.get("seo_title"))
        continue
    req = urllib.request.Request(f"{U}/rest/v1/community_notes?id=eq.{r['id']}", data=json.dumps(patch).encode(), headers=H, method="PATCH")
    urllib.request.urlopen(req)
print(("would update" if DRY else "updated"), n, "notes")
