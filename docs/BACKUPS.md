# Бэкапы и безопасные миграции (emigro)

PITR ($100/мес) для emigro **не обязателен**: контент меняется редко, потеря суток некритична. Вместо этого — три правила ниже.

Проект: [wcwadwcjqutdxwbrkyai](https://supabase.com/dashboard/project/wcwadwcjqutdxwbrkyai) · регион `ap-south-1`.

---

## 1. Миграции только через git

**Правило:** любое изменение схемы или seed-данных в Postgres — только файл в `supabase/migrations/` + `npm run db:push`.

| Делать | Не делать |
|--------|-----------|
| `supabase migration new …` → SQL в git → `npm run db:push` | Правки в Supabase **SQL Editor** на проде |
| Одна логическая миграция = один файл | «Быстро поправлю в дашборде, потом закоммичу» |
| Имя файла с timestamp: `20260713120000_…sql` | `UPDATE`/`DELETE` без `WHERE` на проде |

### Workflow

```bash
# 1. Новая миграция
supabase migration new poland_wait_times_fix

# 2. Правишь supabase/migrations/2026…_poland_wait_times_fix.sql

# 3. Перед рискованным push — снимок (см. §3)
npm run db:backup -- --tag before-poland-wait-times

# 4. На прод
npm run db:push

# 5. Типы (если менялась схема)
npm run db:types
```

### Исключения (редко, с записью)

- Срочный hotfix в SQL Editor — **сразу** после инцидента выгрузить diff и оформить миграцию в git, иначе git и прод разъедутся.
- Разовый `SELECT` для диагностики — ок.
- Ручной `INSERT` одной строки для ops — лучше через admin API или миграцию с `ON CONFLICT`.

---

## 2. Еженедельный `supabase db dump` вне Supabase

Логический дамп — на случай удаления проекта, переноса или restore без PITR.

### Локально (разработчик)

1. Один раз: `supabase link --project-ref wcwadwcjqutdxwbrkyai`
2. В `.env.local`: `SUPABASE_DB_PASSWORD=…` (Dashboard → **Project Settings → Database**)
3. Запуск:

```bash
npm run db:backup
# или с меткой:
npm run db:backup -- --tag weekly-manual
```

Файл: `backups/emigro-YYYYMMDD-HHMMSS.sql.gz` (в `.gitignore`, **не коммитить**).

Хранить копию **вне** Supabase: локальный диск, NAS, S3, и т.д.

### GitHub Actions (автоматически по воскресеньям)

Workflow: [`.github/workflows/db-backup-weekly.yml`](../.github/workflows/db-backup-weekly.yml)

**Один раз настроить secrets** в GitHub → Settings → Secrets → Actions:

| Secret | Где взять |
|--------|-----------|
| `SUPABASE_ACCESS_TOKEN` | [Account tokens](https://supabase.com/dashboard/account/tokens) |
| `SUPABASE_DB_PASSWORD` | Dashboard → Project Settings → Database |

Артефакт: **Actions → Weekly database backup → run → Artifacts** (хранение 90 дней).

Ручной запуск: **Actions → Weekly database backup → Run workflow**.

---

## 3. Перед рискованной миграцией

**Рискованная** = `DROP`, `DELETE`/`UPDATE` без узкого `WHERE`, `ALTER` с переписыванием таблицы, массовый seed, смена типов, `ON DELETE CASCADE` на больших связях.

### Чеклист

- [ ] Миграция в git, diff просмотрен
- [ ] `npm run db:backup -- --tag before-<краткое-имя>`
- [ ] По возможности — прогон на копии (локальный `supabase start` + restore, или Supabase branch)
- [ ] `npm run db:push`
- [ ] Smoke: `npm run smoke:wizard` или ручная проверка ключевых страниц
- [ ] При ошибке — restore из Supabase daily backup (Dashboard → Database → Backups) или из `.sql.gz`

### Restore из локального дампа

```bash
gunzip -c backups/emigro-20260713-120000-before-foo.sql.gz | \
  psql "$DATABASE_URL"
```

`DATABASE_URL` — direct connection string из Dashboard (не pooler, если restore ругается).

Для **частичного** отката одной таблицы — вытащить нужные `COPY`/`INSERT` из `.sql` вручную; полный restore перезапишет всю БД.

---

## Что уже есть в Supabase без PITR

| Механизм | RPO | Стоимость |
|----------|-----|-----------|
| Daily backup (Pro) | до ~24 ч | входит в Pro |
| Weekly `db dump` (этот док) | до 7 дней | бесплатно (+ место на диске) |
| PITR | ~2 мин | ~$100/мес |

Для emigro достаточно **daily + weekly dump**. PITR имеет смысл, если появятся платежи, критичные пользовательские данные или ежедневные правки в проде.

---

## Связанные документы

- [DEPLOY.md](./DEPLOY.md) — деплой на Vercel
- [README.md](../README.md) — `db:push`, миграции
- [Supabase: Database Backups](https://supabase.com/docs/guides/platform/backups)
