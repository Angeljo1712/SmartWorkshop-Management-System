# Database Notes

This project initializes MySQL through Docker Compose by mounting only:

- `database/schema.sql` as `/docker-entrypoint-initdb.d/01_schema.sql`
- `database/seed.sql` as `/docker-entrypoint-initdb.d/02_seed.sql`

## Why this matters

- `backup.sql` and `staging-backup.sql` are operational dump files, not bootstrap scripts.
- They must **not** be auto-executed during container initialization.
- `database/migrations/` contains incremental SQL for manual/controlled updates and is not auto-run by MySQL entrypoint.

## Local and staging behavior

- The active database name comes from `MYSQL_DATABASE` in compose/env (`smartworkshop` for local, `smartworkshop_staging` for staging).
- `schema.sql` must stay database-agnostic (no hardcoded `USE <db_name>`).

## Rebuild reminder

If you change schema/seed and need to reapply from scratch, recreate the DB volume for the target stack before starting it again.
