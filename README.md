# SmartWorkshop / Smart Vehicle Service Marketplace

Working prototype built with Node.js + Express + MySQL + phpMyAdmin (Docker). No Directus.

## Prerequisites

- Windows 10/11
- Docker Desktop (with Compose)
- Node.js 18+ (only needed if running the app locally outside Docker)

## Quick Start (Docker)

1. Copy `.env.example` to `.env` in the repo root and adjust values if needed.
2. Run from the repo root (recommended):

```bash
docker compose -f docker-compose.yml up --build -d
```

If you run the command from a subfolder, pass the env file explicitly:

```bash
docker compose --env-file ../.env -f ../docker-compose.yml up --build -d
```

This starts:

- MySQL on `localhost:3306`
- App (API + UI) on `localhost:3000`
- phpMyAdmin on `localhost:8081`

Dev scripts live in `scripts/dev/`:

- `./scripts/dev/start.ps1`
- `./scripts/dev/build.ps1`
- `./scripts/dev/stop.ps1`
- `./scripts/dev/recreate.ps1`
- `./scripts/dev/backup-db.ps1`
- `./scripts/dev/restore-db.ps1`
- `./scripts/dev/tunnel.ps1`

## Cloudflare Tunnel

Use Cloudflare Tunnel when you want to open the local app from a tablet or phone on any network, including places where the devices cannot see each other directly.

1. Start the app locally as usual:

```powershell
./scripts/dev/start.ps1
```

2. In a second terminal, open the tunnel:

```powershell
./scripts/dev/tunnel.ps1
```

By default the tunnel points to `http://localhost:3000`.

If you need public links and redirects to point at the tunnel URL, set these values in `.env` before starting the app:

- `APP_BASE_URL`
- `CORS_ORIGIN`

If `cloudflared` is not installed yet, download it from the official Cloudflare docs and make sure it is available in your `PATH`.

### Fixed tunnel name

If you want the tunnel to keep the same name/host each time, create a local config based on:

- [`docs/cloudflared-tunnel.example.yml`](/C:/Users/LianGel2DPro/SmartWorkshop-Management-System/docs/cloudflared-tunnel.example.yml)

Then run:

```powershell
./scripts/dev/tunnel.ps1 -TunnelName smartworkshop-dev -ConfigPath .cloudflared/tunnel.yml
```

Or run the helper that prints the exact setup steps:

```powershell
npm run tunnel:fixed
```

## Staging Tunnel

If you need to expose the staging stack instead of local dev, run the staging tunnel helper. It points to `http://localhost:3001` by default.

```powershell
npm run tunnel:staging:named
```

For a fixed staging hostname on this domain, use this example:

- [`docs/cloudflared-staging.example.yml`](/C:/Users/LianGel2DPro/SmartWorkshop-Management-System/docs/cloudflared-staging.example.yml)

The suggested public URL is:

- `https://staging.smartworkshop.me`

You still need to create the tunnel and download the credentials file in Cloudflare first. After that, update:

- `APP_BASE_URL`
- `CORS_ORIGIN`

to your public hostname so redirects and generated links use the tunnel URL.

If you want one command to open both windows, use:

```powershell
npm run staging:all
```

## Staging Stack

Use a separate staging environment to validate the app before the final domain cutover.

1. Copy `.env.staging.example` to `.env.staging`.
2. Set staging-specific values:
   - staging database name and credentials
   - staging SMTP credentials
   - staging base URL
3. Start the staging stack:

```powershell
./scripts/staging/stack-staging.ps1 start
```

To rebuild staging:

```powershell
./scripts/staging/rebuild-staging.ps1
```

To reset staging from scratch:

```powershell
./scripts/staging/reset-staging.ps1
```

To start staging on a specific volume:

```powershell
./scripts/staging/start-staging-v1.ps1
./scripts/staging/start-staging-v2.ps1
./scripts/staging/start-staging-dev.ps1
```

To back up or restore the staging database:

```powershell
./scripts/staging/backup-staging-db.ps1
./scripts/staging/restore-staging-db.ps1
```

To migrate preserved staging data to a new volume:

```powershell
./scripts/staging/migrate-staging-volume.ps1
```

Ports used by default:

- App: `http://localhost:3001`
- MySQL: `localhost:3307`
- phpMyAdmin: `http://localhost:8082`

The staging stack runs against its own MySQL volume, so it stays isolated from local development.
The staging backend now runs with `nodemon`, so code changes in `src/`, `views/`, and `public/` reload automatically after the stack restarts.
You can override the staging volume name with `STAGING_DB_VOLUME` if you need to point staging at a different persistent volume.
Use `./scripts/staging/migrate-staging-volume.ps1` when you want to move the preserved admin/mechanic/catalog data into a new staging volume.
Use `./scripts/staging/start-staging-v1.ps1` or `./scripts/staging/start-staging-v2.ps1` when you want to start staging against a specific saved volume without changing `.env.staging`.
Use `./scripts/staging/start-staging-dev.ps1` when you want staging on `db_data_staging_v2` with `nodemon` watching code changes.
Staging bootstrap also seeds 10 extra London mechanic test accounts for booking and search flows.

Environment validation rules:

- `development` can start with placeholder values and only emits warnings.
- `staging` is validated strictly and must use real values for required secrets and database settings.
- `STRICT_ENV_VALIDATION=true` forces strict validation in any environment.
- Keep `.env.staging` aligned with the staging stack so it does not rely on placeholder secrets.
- `TWO_FACTOR_REAUTH_HOURS` controls how long a successful login stays exempt from a new 2FA code. Default: `24`.
- Admin accounts always require 2FA on login when 2FA is enabled; customer and mechanic accounts use the reauth window above.

Smoke test plan for this stage: [docs/staging-smoke-test-plan.md](docs/staging-smoke-test-plan.md)
Smoke test report template: [docs/staging-smoke-test-report-template.md](docs/staging-smoke-test-report-template.md)
Plain text report template: [docs/staging-smoke-test-report-template.txt](docs/staging-smoke-test-report-template.txt)
Plain text plan: [docs/staging-smoke-test-plan.txt](docs/staging-smoke-test-plan.txt)

The database schema is created automatically from `database/schema.sql`. Seed data is inserted automatically when the app starts.
For staging, the database is now intentionally isolated and boots with a clean dataset plus the default admin and mechanic demo accounts only.

## Default Seed Accounts

- Admin: `admin@smartworkshop.local` / `Admin123!`
- Mechanic: `mechanic@smartworkshop.local` / `Mechanic123!`
- Customer: `customer@smartworkshop.local` / `Customer123!`

## phpMyAdmin

- URL: `http://localhost:8081`
- Server: `db` (inside Docker) or `localhost` (from host)
- User: `DB_USER` in `.env`
- Password: `DB_PASSWORD` in `.env`

## App Access

- Health check: `http://localhost:3000/health`
- API base URL: `http://localhost:3000/api`

Example login:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"customer@smartworkshop.local\",\"password\":\"Customer123!\"}"
```

## UI (Pug)

The UI is served directly by Express at `http://localhost:3000/` (no separate frontend server).

## API Endpoints (Minimum Viable)

Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

Service Requests

- `POST /api/service-requests` (Customer)
- `GET /api/service-requests/me` (Customer)
- `GET /api/service-requests/:id` (Customer own or Admin)
- `GET /api/service-requests/available` (Mechanic/Admin)

Quotations

- `POST /api/quotations` (Mechanic)
- `GET /api/quotations/request/:requestId` (Customer owner/Mechanic/Admin)
- `POST /api/quotations/:quotationId/accept` (Customer)

Jobs

- `GET /api/jobs/me` (Customer/Mechanic/Admin)
- `PATCH /api/jobs/:jobId/status` (Mechanic/Admin)
- `GET /api/jobs/:jobId/history` (Authorized)

Admin (Workshops + Users)

- `GET /api/admin/workshops`
- `POST /api/admin/workshops`
- `PATCH /api/admin/workshops/:workshopId`
- `DELETE /api/admin/workshops/:workshopId`
- `GET /api/admin/users`

## Demo Script (PowerShell)

A Windows-friendly demo script is provided:

```powershell
./scripts/demo.ps1
```

It logs in as the seeded customer/mechanic, creates a service request, submits a quotation, accepts it, and updates job status.

## Running Locally (optional)

If you want to run the app outside Docker:

```bash
cd server
npm install
npm run dev
```

Ensure MySQL is running and `.env` points to your DB.

## Notes on Architecture

- Directus is intentionally not used to keep the prototype lightweight and aligned with the requirement.
- RBAC is enforced in middleware for Customer, Mechanic, and Admin roles.
- Job creation is transactional and only occurs when a quotation is accepted.

## Reset Environment

```bash
docker compose -f docker-compose.yml down -v
docker compose -f docker-compose.yml up --build -d
```

This removes containers/volumes and recreates the stack from scratch.

## Start/Stop Stack (PowerShell)

```powershell
./scripts/dev/start.ps1
./scripts/dev/build.ps1
./scripts/dev/stop.ps1
./scripts/dev/recreate.ps1
```

Host - <http://localhost:3000/>
