# Frontend (Standalone)

This frontend runs separately from the backend API and communicates over HTTP using CORS.

## Run (no dependencies)

```bash
cd frontend
node server.js
```

Then open: `http://localhost:5173`

## API Target

The UI calls the backend API at `http://localhost:3000`. Ensure the backend is running.

## CORS

The backend allows `CORS_ORIGIN` (default `http://localhost:5173`). If you change the frontend port, update `.env`.
