# SmartWorkshop / Smart Vehicle Service Marketplace

Working prototype built with Node.js + Express + MySQL + phpMyAdmin (Docker). No Directus.

## Prerequisites

- Windows 10/11
- Docker Desktop (with Compose)
- Node.js 18+ (only needed if running backend locally outside Docker)

## Quick Start (Docker)

1. Copy `.env.example` to `.env` and adjust values if needed.
2. Run:

```bash
docker compose up --build
```

This starts:

- MySQL on `localhost:3306`
- Backend API on `localhost:3000`
- phpMyAdmin on `localhost:8081`

The database schema is created automatically from `db/init/01_schema.sql`. Seed data is inserted automatically when the backend starts.

## Default Seed Accounts

- Admin: `admin@smartworkshop.local` / `Admin123!`
- Mechanic: `mechanic@smartworkshop.local` / `Mechanic123!`
- Customer: `customer@smartworkshop.local` / `Customer123!`

## phpMyAdmin

- URL: `http://localhost:8081`
- Server: `db` (inside Docker) or `localhost` (from host)
- User: `DB_USER` in `.env`
- Password: `DB_PASSWORD` in `.env`

## Backend Access

- Health check: `http://localhost:3000/health`
- API base URL: `http://localhost:3000/api`

Example login:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"customer@smartworkshop.local\",\"password\":\"Customer123!\"}"
```

## Frontend (Separate)

A standalone frontend lives in `frontend/` and runs independently from the API.

```bash
cd frontend
node server.js
```

Open `http://localhost:5173`. The frontend calls the API at `http://localhost:3000`.

If you change the frontend port, update `.env`:

```Host cor - CORS_ORIGIN = 'http://localhost:5173'
```

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

## Running Backend Locally (optional)

If you want to run the backend outside Docker:

```bash
cd backend
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
./scripts/reset.sh
```

This removes containers/volumes and recreates the stack from scratch.

Host - <http://localhost:3000/>
