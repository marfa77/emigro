"""
Switch the "current year" in page titles / SEO fields from 2026 to 2027 (2026-11-20, Pavel's request).

Rules:
- Only title-like fields: guide frontmatter title / seo_title / seo_description / excerpt, long-tail seoTitle /
  seoDescription, and `title:` / `seoTitle:` / `h1:` string literals in app/ and lib/ page metadata.
- Never touch slugs, URLs, paths, dates like 01.05.2026, or body text (facts stay dated 2026).
- Keep 2026 where the string carries a threshold that is re-indexed every year (minimum wage, SMI, IPREM,
  Blue Card / pay-limit salaries, «/мес», «/год»…): those are updated in the January fact-check pass.

  python3 scripts/year-2027-titles.py --dry-run
  python3 scripts/year-2027-titles.py
"""
import glob, re, sys

DRY = "--dry-run" in sys.argv
# A threshold figure: currency + digits (or digits + currency / k / тыс / млн), or a % of SMI / IPREM / median.
FIGURE = re.compile(
    r"(?:[€$£₸]|\bAED|\bSEK|\bDKK|\bPLN|\bCZK|\bTHB|\bRSD|\bUSD|\bEUR|\bR)\s?\d|\d[\d  .,]*\s?(?:€|\$|k\b|тыс|млн|AED|SEK|DKK|PLN|CZK)|\d+\s?%\s?(?:SMI|IPREM|медиан)",
    re.I,
)
# Figures that are re-indexed every year (minimum wage, SMI, IPREM, salary thresholds, per-month income).
INDEXED_CONTEXT = re.compile(
    r"RMMG|SMI|IPREM|Blue Card|pay limit|SIRI|Migrationsverket|зарплат|медиан|/мес|/год|/month|/year|в месяц|в год|"
    r"D7|D8|digital nomad|nomad|кочевник|доход|Type A|work permit|HSM|Highly Skilled|teletrabajo|lucrativa|Retirement",
    re.I,
)


def is_indexed(text: str) -> bool:
    return bool(FIGURE.search(text) and INDEXED_CONTEXT.search(text))


YEAR = re.compile(r"(?<![\d./\-])2026(?![\d./\-])")


# 2026 as an event date, not the guide year: «в мае 2026», «реформа 2026», «закон … 2026», «после января 2026».
EVENT_BEFORE = re.compile(
    r"(январ|феврал|март|апрел|ма[йяе]|июн|июл|август|сентябр|октябр|ноябр|декабр|реформ|закон|law|lei|decreto|"
    r"enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|janvier|mai|juin|"
    r"после|до|since|until)\S*\s*$",
    re.I,
)


def switch(text: str) -> str:
    if is_indexed(text):
        return text

    def repl(m: re.Match) -> str:
        before = text[max(0, m.start() - 25) : m.start()]
        after = text[m.end() : m.end() + 8]
        if EVENT_BEFORE.search(before) or re.search(r"\bс\s*$", before) or re.match(r"\s*год", after):
            return m.group(0)
        return "2027"

    return YEAR.sub(repl, text)


changed = kept = 0
kept_samples = []

def handle_line(line: str) -> str:
    global changed, kept
    new = switch(line)
    if new != line:
        changed += 1
    elif YEAR.search(line):
        kept += 1
        if len(kept_samples) < 25:
            kept_samples.append(line.strip()[:140])
    return new

# 1. Guides frontmatter
FIELDS = ("title:", "seo_title:", "seo_description:", "excerpt:")
for f in glob.glob("content/guides/*/*.md"):
    raw = open(f, encoding="utf-8").read()
    if not raw.startswith("---") or "festival" in f:
        continue
    end = raw.index("\n---", 3)
    fm, body = raw[:end], raw[end:]
    lines = fm.split("\n")
    out = [handle_line(l) if l.lstrip().startswith(FIELDS) and not l.lstrip().startswith("slug") else l for l in lines]
    new = "\n".join(out) + body
    if new != raw and not DRY:
        open(f, "w", encoding="utf-8").write(new)

# 2. Long-tail SEO strings and page metadata literals
KEYS = re.compile(r'^(\s*)(seoTitle|seoDescription|title|h1|seo_title|seoTitleRu|titleRu|h1Ru|description|seoDescriptionRu|descriptionRu)(:\s*\n?\s*)"')
for f in ["lib/seo/query-longtail.ts"] + glob.glob("app/**/page.tsx", recursive=True) + glob.glob("lib/**/*.ts", recursive=True):
    # Skip: Threads farm banks; satellite note seeds (live copy is in the DB, handled separately);
    # event calendars / festivals (2026 = event dates); the tax page (tax year 2026 stays relevant).
    if any(x in f for x in ("/threads/", "/community-notes/guides/", "festival", "calendar", "events", "/nalogi/")):
        continue
    raw = open(f, encoding="utf-8").read()
    lines = raw.split("\n")
    out = []
    pending = False
    for l in lines:
        m = KEYS.match(l)
        if m or pending:
            if m and l.rstrip().endswith(":"):
                pending = True
                out.append(l)
                continue
            pending = False
            out.append(handle_line(l) if '"' in l else l)
        else:
            out.append(l)
    new = "\n".join(out)
    if new != raw and not DRY:
        open(f, "w", encoding="utf-8").write(new)

print(f"{'would switch' if DRY else 'switched'} {changed} line(s); kept 2026 in {kept} indexed-figure line(s)")
for s in kept_samples:
    print("  kept:", s)
