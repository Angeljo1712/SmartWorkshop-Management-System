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
- Backend API: http://localhost:${API_PORT}
- Directus Admin UI: http://localhost:8055
- phpMyAdmin: http://localhost:8081

## Academic context
Final Year Project.
Roles: Customer, Mechanic, Admin.
Directus will be used for data management and RBAC.
