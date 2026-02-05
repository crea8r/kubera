# Kubera Frontend (React)

This is a React (Vite) frontend built using `mock/` as a visual reference.

## Configure

```bash
cp .env.example .env
```

Edit `VITE_API_BASE_URL` (default backend is `http://localhost:29001`).

## Run

```bash
npm install
npm run dev -- --port 29002
```

Open: http://localhost:29002

## Pages
- `/login` – login (seed creds prefilled)
- `/` – dashboard (lists workspaces)
- `/budget` – budget lines for selected cycle
- `/operations` – operations + KPIs for selected cycle
- `/proposals` – proposals list + approve/reject (MVP)
- `/settings` – fystack assets/networks (read-only)

## Notes
- Uses cookie-based auth from the backend (`credentials: include`).
- Timeline view is a placeholder until we add activity endpoints.
