# Database Notes

This project initializes MySQL through Docker Compose by mounting only:

- `database/schema.sql` as `/docker-entrypoint-initdb.d/01_schema.sql`
- `database/seed.sql` as `/docker-entrypoint-initdb.d/02_seed.sql`
- `database/staging-bootstrap.sql` as `/docker-entrypoint-initdb.d/03_staging_bootstrap.sql` in staging only

## Why this matters

- `backup.sql` and `staging-backup.sql` are operational dump files, not bootstrap scripts.
- They must **not** be auto-executed during container initialization.
- `database/migrations/` contains incremental SQL for manual/controlled updates and is not auto-run by MySQL entrypoint.

## Local and staging behavior

- The active database name comes from `MYSQL_DATABASE` in compose/env (`smartworkshop` for local, `smartworkshop_staging` for staging).
- `schema.sql` must stay database-agnostic (no hardcoded `USE <db_name>`).
- Staging uses a separate persistent volume so a fresh stack starts with a clean database and only the bootstrap admin account.
- `STAGING_DB_VOLUME` can override the staging volume name when you want to move data into a new persistent volume.
- `scripts/staging/start-staging-v1.ps1` and `scripts/staging/start-staging-v2.ps1` are convenience wrappers for starting staging on `db_data_staging` or `db_data_staging_v2` without editing `.env.staging`.

## Rebuild reminder

If you change schema/seed and need to reapply from scratch, recreate the DB volume for the target stack before starting it again.
For staging, `scripts/staging/reset-staging.ps1` removes the staging volume and recreates the stack with the clean bootstrap.
Backups and restores for staging live in `scripts/staging/backup-staging-db.ps1` and `scripts/staging/restore-staging-db.ps1`.
