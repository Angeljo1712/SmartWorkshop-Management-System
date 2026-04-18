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

## Staging Stack

Use a separate staging environment to validate the app before the final domain cutover.

1. Copy `.env.staging.example` to `.env.staging`.
2. Set staging-specific values:
   - staging database name and credentials
   - staging SMTP credentials
   - staging base URL
3. Start the staging stack:

```powershell
./scripts/stack-staging.ps1 start
```

Ports used by default:

- App: `http://localhost:3001`
- MySQL: `localhost:3307`
- phpMyAdmin: `http://localhost:8082`

The staging stack runs against its own MySQL volume, so it stays isolated from local development.

Smoke test plan for this stage: [docs/staging-smoke-test-plan.md](docs/staging-smoke-test-plan.md)
Smoke test report template: [docs/staging-smoke-test-report-template.md](docs/staging-smoke-test-report-template.md)
Plain text report template: [docs/staging-smoke-test-report-template.txt](docs/staging-smoke-test-report-template.txt)

The database schema is created automatically from `database/schema.sql`. Seed data is inserted automatically when the app starts.

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
./scripts/stack.ps1 start
./scripts/stack.ps1 build
./scripts/stack.ps1 stop
```

Host - <http://localhost:3000/>
