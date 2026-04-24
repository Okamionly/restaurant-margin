# DB Backup Runbook — Supabase (RestauMargin)

Runbook for creating a logical backup of the Supabase Postgres database before
running destructive migrations such as `20260425_1050_timestamps_tz` (column
type change, rewrites full tables under ACCESS EXCLUSIVE lock) or
`20260425_1060_rls_tenant` (Row Level Security rollout).

This runbook is intentionally hand-runnable: nothing is automated, every step
requires human confirmation. The goal is that a non-DBA can execute it without
fear.

---

## When to run

Before any migration labelled `⚠️ DESTRUCTIVE` in the commit message or in the
top-comment of the `migration.sql` file. Concretely:

- `20260425_1050_timestamps_tz` (type rewrite)
- Any future migration that does `ALTER COLUMN ... TYPE` on a large table
- Any future migration that `DROP`s a column with data
- Anything that touches `users`, `restaurants`, `invoices`, or financial data

---

## Prerequisites (once)

1. Install PostgreSQL client tools (only the binaries — no server needed):
   - macOS: `brew install libpq && brew link --force libpq`
   - Ubuntu: `sudo apt install postgresql-client-16`
   - Windows: download [Postgres installer](https://www.postgresql.org/download/windows/),
     check "Command Line Tools", uncheck everything else.
2. Verify: `pg_dump --version` prints >= 15.
3. From Supabase dashboard -> Project Settings -> Database, copy the
   **Connection string -> URI** (contains a service-role password). Store it
   in a local `.env.backup` file (gitignored).

---

## Step 1 — Snapshot (`pg_dump`)

Create a compressed custom-format dump of the entire project. Custom format
(`-Fc`) is the fastest to restore and supports selective restore.

```bash
# Load the service-role URL into the env for this shell only.
source .env.backup   # defines $SUPABASE_DB_URL

# Timestamped filename so you never overwrite a previous dump.
STAMP=$(date -u +%Y%m%dT%H%M%SZ)
OUT="backups/restaumargin-${STAMP}.dump"

mkdir -p backups

pg_dump \
  --dbname="$SUPABASE_DB_URL" \
  --format=custom \
  --compress=9 \
  --no-owner \
  --no-privileges \
  --verbose \
  --file="$OUT"

ls -lh "$OUT"
```

Expected duration: ~1-3 min for the current dataset (< 500 MB). Abort if it
runs > 10 min — check network or firewall.

Verify the dump by reading its table of contents:

```bash
pg_restore --list "$OUT" | head -40
```

You should see all the tenant tables (`ingredients`, `recipes`, `invoices`,
etc.) plus the Prisma-managed schema tables.

---

## Step 2 — Smoke test the dump (strongly recommended)

Before trusting the dump as a rollback target, confirm it can be restored into
a scratch database. Supabase free tier gives you branches for exactly this.

```bash
# Using Supabase MCP:
#   mcp__<project>__create_branch  ->  returns a new DB connection string.
# Or with the CLI:
supabase branches create pre-migration-test --project-ref wsrzcgbfekifalgtwmyy
```

Restore:

```bash
pg_restore \
  --dbname="$BRANCH_DB_URL" \
  --no-owner \
  --no-privileges \
  --clean \
  --if-exists \
  --verbose \
  "$OUT"
```

Sanity queries on the branch:

```sql
SELECT count(*) FROM ingredients;
SELECT count(*) FROM invoices;
SELECT max(created_at) FROM users;
```

If counts match production within a reasonable delta, the dump is valid.

---

## Step 3 — Run the destructive migration

Only after steps 1 and 2 succeed:

```bash
# From server/ so prisma picks up DATABASE_URL.
cd server
npx prisma migrate deploy
# Or apply a single file manually:
psql "$SUPABASE_DB_URL" -f prisma/migrations/20260425_1050_timestamps_tz/migration.sql
```

Watch `\timing` output in psql or Prisma's log. If any ALTER TABLE exceeds
30s on production data, abort (Ctrl-C) and investigate under a branch first.

---

## Step 4 — Post-migration validation

Run these spot checks as the first thing after deploy:

```sql
-- Prisma sanity: can we read every recently-touched table?
SELECT id, "createdAt" FROM users     ORDER BY id DESC LIMIT 5;
SELECT id, "createdAt" FROM invoices  ORDER BY id DESC LIMIT 5;
SELECT id, created_at  FROM ai_usage_logs ORDER BY id DESC LIMIT 5;

-- Timezone column type check:
SELECT column_name, data_type, datetime_precision
FROM information_schema.columns
WHERE table_name IN ('users','restaurants','ingredients','recipes','suppliers','invoices')
  AND column_name IN ('createdAt','updatedAt');
-- All rows should show data_type = 'timestamp with time zone'.
```

If anything looks wrong: proceed to Step 5 immediately.

---

## Step 5 — Rollback (only if Step 4 fails)

The migration is NOT automatically reversible. To roll back:

```bash
# Put the app in maintenance mode first (Vercel env MAINTENANCE=1).
vercel env add MAINTENANCE production  # value: 1

# Restore from the dump taken in Step 1.
pg_restore \
  --dbname="$SUPABASE_DB_URL" \
  --no-owner \
  --no-privileges \
  --clean \
  --if-exists \
  --verbose \
  "$OUT"

# Remove the matching row from _prisma_migrations so Prisma does not think
# the migration succeeded:
psql "$SUPABASE_DB_URL" -c \
  "DELETE FROM _prisma_migrations WHERE migration_name = '20260425_1050_timestamps_tz';"

# Take app out of maintenance.
vercel env rm MAINTENANCE production
```

---

## Retention

- Keep every pre-destructive dump for 30 days minimum
- Store in `backups/` locally AND upload to a private S3 / Supabase Storage bucket
- Rotate older dumps quarterly — keep one per quarter for 2 years for FR
  fiscal audit compliance (art. L102 B LPF)

---

## Related

- Migration `20260425_1050_timestamps_tz` — first user of this runbook
- Migration `20260425_1060_rls_tenant` — RLS rollout, less destructive but
  can lock out the API if the policy has a bug
- `server/prisma/schema.prisma` — Prisma source of truth
