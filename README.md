# SmartWorkshop Management System

## Requirements
- Docker Desktop

## How to start
1. Copy `.env.example` to `.env` and adjust values.
2. Run:

```bash
docker compose up --build
```

## How to reset the environment
```bash
./scripts/reset.sh
```

## URLs
- Backend API: http://localhost:3000/health
- Directus Admin UI: http://localhost:8055
- phpMyAdmin: http://localhost:8081

Notes

The API_PORT value is configured in .env. If you change it, update the port mapping in docker-compose.yml or use the correct URL accordingly.

## Academic context
Final Year Project.
Roles: Customer, Mechanic, Admin.
Directus will be used for data management and RBAC.
