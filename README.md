# SmartWorkshop / Smart Vehicle Service Marketplace

Working prototype built with Node.js + Express + MySQL + phpMyAdmin, containerized with Docker. Directus is intentionally not used.

## At a Glance

| Item | Value |
|---|---|
| App | Express UI + API |
| Local URL | `http://localhost:3000` |
| Health check | `http://localhost:3000/health` |
| API base | `http://localhost:3000/api` |
| Database | MySQL |
| DB admin | phpMyAdmin |
| Main stack | Docker Compose |

## What It Does

- Customer booking flow from vehicle details to service request and quotation acceptance
- Mechanic dashboard for assigned bookings, quotations, jobs, and resolution cases
- Admin workspace for users, workshops, catalog, payments, and resolution oversight
- Built-in authentication, role-based access control, 2FA, and email workflows
- Local Docker stack plus staging stack with separate data and tunnel support

## Highlights

| Feature | What you get |
|---|---|
| Fast setup | Local Docker stack with one command |
| Multi-role access | Customer, Mechanic, and Admin flows |
| Real workflows | Requests, quotations, jobs, invoices, and resolution cases |
| Secure access | JWT auth, RBAC, 2FA, and protected APIs |
| Staging support | Separate staging stack, data volume, and tunnel support |
| Friendly ops | phpMyAdmin, backup/restore scripts, and smoke tests |

## Screenshots

Replace these placeholders with your actual captures:

| View | Preview |
|---|---|
| Home | `docs/screenshots/home.png` |
| Customer dashboard | `docs/screenshots/customer-dashboard.png` |
| Mechanic dashboard | `docs/screenshots/mechanic-dashboard.png` |
| Admin dashboard | `docs/screenshots/admin-dashboard.png` |
| Resolution center | `docs/screenshots/resolution-center.png` |

## Role Flow

```text
Customer
  └─ creates service request
      └─ mechanic reviews and sends quotation
          └─ customer accepts quotation
              └─ job is created and tracked
                  └─ admin monitors users, workshops, and support cases
```

## Requirements

| Requirement | Notes |
|---|---|
| Windows | Windows 10/11 |
| Docker | Docker Desktop with Compose |
| Node.js | 18+ only if you run outside Docker |

## Quick Start

1. Copy `.env.example` to `.env` in the repo root and adjust values if needed.
2. Start the stack from the repo root:

```bash
docker compose -f docker-compose.yml up --build -d
```

If you run from a subfolder, pass the env file explicitly:

```bash
docker compose --env-file ../.env -f ../docker-compose.yml up --build -d
```

### Default Local Services

| Service | URL / Port |
|---|---|
| MySQL | `localhost:3306` |
| App | `http://localhost:3000` |
| phpMyAdmin | `http://localhost:8081` |

### Dev Scripts

| Script | Purpose |
|---|---|
| `./scripts/dev/start.ps1` | Start the local stack |
| `./scripts/dev/build.ps1` | Rebuild the local stack |
| `./scripts/dev/stop.ps1` | Stop the local stack |
| `./scripts/dev/recreate.ps1` | Recreate the local stack |
| `./scripts/dev/backup-db.ps1` | Back up the local DB |
| `./scripts/dev/restore-db.ps1` | Restore the local DB |
| `./scripts/dev/tunnel.ps1` | Open a Cloudflare tunnel |

## Cloudflare Tunnel

Use Cloudflare Tunnel when you want to open the app from a phone or tablet on another network.

1. Start the app locally:

```powershell
./scripts/dev/start.ps1
```

2. Open the tunnel in a second terminal:

```powershell
./scripts/dev/tunnel.ps1
```

The tunnel points to `http://localhost:3000` by default.

If you want public links and redirects to use the tunnel URL, set these in `.env` before starting the app:

- `APP_BASE_URL`
- `CORS_ORIGIN`

If `cloudflared` is not installed yet, install it from the official Cloudflare docs and add it to `PATH`.

### Fixed Tunnel Name

If you want the same tunnel name and host each time, create a local config based on:

- [`docs/cloudflared-tunnel.example.yml`](docs/cloudflared-tunnel.example.yml)

Then run:

```powershell
./scripts/dev/tunnel.ps1 -TunnelName smartworkshop-dev -ConfigPath .cloudflared/tunnel.yml
```

Or use the helper:

```powershell
npm run tunnel:fixed
```

## Staging Tunnel

The staging tunnel exposes the staging stack instead of local development.

```powershell
npm run tunnel:staging:named
```

Default staging origin:

- `http://localhost:3001`

Suggested public URL:

- `https://staging.smartworkshop.me`

If you use a fixed staging hostname, start from:

- [`docs/cloudflared-staging.example.yml`](docs/cloudflared-staging.example.yml)

After you create the tunnel and download the Cloudflare credentials, update:

- `APP_BASE_URL`
- `CORS_ORIGIN`

If you want one command to start both windows, use:

```powershell
npm run staging:all
```

## Staging Stack

Use staging to validate the app before final cutover.

1. Copy `.env.staging.example` to `.env.staging`.
2. Set staging-specific values:
   - database name and credentials
   - SMTP credentials
   - staging base URL
3. Start the stack:

```powershell
./scripts/staging/stack-staging.ps1 start
```

### Staging Commands

| Script | Purpose |
|---|---|
| `./scripts/staging/rebuild-staging.ps1` | Rebuild staging |
| `./scripts/staging/reset-staging.ps1` | Reset staging from scratch |
| `./scripts/staging/start-staging-v1.ps1` | Start a specific saved volume |
| `./scripts/staging/start-staging-v2.ps1` | Start a specific saved volume |
| `./scripts/staging/start-staging-dev.ps1` | Start staging with nodemon |
| `./scripts/staging/backup-staging-db.ps1` | Back up staging DB |
| `./scripts/staging/restore-staging-db.ps1` | Restore staging DB |
| `./scripts/staging/migrate-staging-volume.ps1` | Move preserved data to a new volume |

### Staging Ports

| Service | URL / Port |
|---|---|
| App | `http://localhost:3001` |
| MySQL | `localhost:3307` |
| phpMyAdmin | `http://localhost:8082` |

### Staging Notes

- Staging uses its own MySQL volume and stays isolated from local development.
- The staging backend runs with `nodemon`, so code changes in `src/`, `views/`, and `public/` reload after the stack restarts.
- You can override the staging volume name with `STAGING_DB_VOLUME`.
- The staging bootstrap seeds 10 extra London mechanic test accounts for booking and search flows.

## Environment Validation

| Mode | Behavior |
|---|---|
| Development | Placeholder values are allowed and only emit warnings |
| Staging | Strict validation is enforced |
| Any mode | Set `STRICT_ENV_VALIDATION=true` to force strict validation |

Other rules:

- `TWO_FACTOR_REAUTH_HOURS` controls how long a successful login stays exempt from a new 2FA code. Default: `24`.
- Admin accounts always require 2FA on login when 2FA is enabled.
- Customer and mechanic accounts use the reauth window above.
- Keep `.env.staging` aligned with the staging stack and do not rely on placeholder secrets.

Smoke test references:

- [docs/staging-smoke-test-plan.md](docs/staging-smoke-test-plan.md)
- [docs/staging-smoke-test-report-template.md](docs/staging-smoke-test-report-template.md)
- [docs/staging-smoke-test-report-template.txt](docs/staging-smoke-test-report-template.txt)
- [docs/staging-smoke-test-plan.txt](docs/staging-smoke-test-plan.txt)

## Database

The database schema is created automatically from `database/schema.sql`.

Seed data is inserted automatically when the app starts.

For staging, the database is intentionally isolated and boots with a clean dataset plus the default admin and mechanic demo accounts only.

### Default Seed Accounts

| Role | Credentials |
|---|---|
| Admin | `admin@smartworkshop.local` / `Admin123!` |
| Mechanic | `mechanic@smartworkshop.local` / `Mechanic123!` |
| Customer | `customer@smartworkshop.local` / `Customer123!` |

## phpMyAdmin

| Field | Value |
|---|---|
| URL | `http://localhost:8081` |
| Server | `db` inside Docker, or `localhost` from host |
| User | `DB_USER` in `.env` |
| Password | `DB_PASSWORD` in `.env` |

## App Access

| Item | URL |
|---|---|
| Health check | `http://localhost:3000/health` |
| API base | `http://localhost:3000/api` |

Example login:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"customer@smartworkshop.local\",\"password\":\"Customer123!\"}"
```

## UI

The UI is served directly by Express at `http://localhost:3000/` with no separate frontend server.

## API Endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Service Requests

- `POST /api/service-requests` - Customer
- `GET /api/service-requests/me` - Customer
- `GET /api/service-requests/:id` - Customer own or Admin
- `GET /api/service-requests/available` - Mechanic/Admin

### Quotations

- `POST /api/quotations` - Mechanic
- `GET /api/quotations/request/:requestId` - Customer owner/Mechanic/Admin
- `POST /api/quotations/:quotationId/accept` - Customer

### Jobs

- `GET /api/jobs/me` - Customer/Mechanic/Admin
- `PATCH /api/jobs/:jobId/status` - Mechanic/Admin
- `GET /api/jobs/:jobId/history` - Authorized

### Admin

- `GET /api/admin/workshops`
- `POST /api/admin/workshops`
- `PATCH /api/admin/workshops/:workshopId`
- `DELETE /api/admin/workshops/:workshopId`
- `GET /api/admin/users`

## Demo Script

A Windows-friendly demo script is available:

```powershell
./scripts/demo.ps1
```

It logs in as the seeded customer and mechanic, creates a service request, submits a quotation, accepts it, and updates job status.

## Running Locally Without Docker

```bash
npm install
npm run dev
```

Make sure MySQL is running and `.env` points to your database.

## Architecture Notes

- Directus is intentionally not used to keep the prototype lightweight and aligned with the project requirement.
- RBAC is enforced in middleware for Customer, Mechanic, and Admin roles.
- Job creation is transactional and only occurs when a quotation is accepted.

## Reset Environment

```bash
docker compose -f docker-compose.yml down -v
docker compose -f docker-compose.yml up --build -d
```

This removes containers and volumes and recreates the stack from scratch.

## Start / Stop Stack

```powershell
./scripts/dev/start.ps1
./scripts/dev/build.ps1
./scripts/dev/stop.ps1
./scripts/dev/recreate.ps1
```
