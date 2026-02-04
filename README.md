# Kubera

This repo currently contains:
- `mock/` — the interactive HTML mock
- `docs/` — product + technical docs
- `backend/` — **real API server** (Fastify + Prisma + Postgres)

## Backend quickstart

### 1) Configure env

```bash
cd backend
cp .env.example .env
```

Fill in:
- `DATABASE_URL` (local Postgres)
- `JWT_SECRET`
- `FYSTACK_API_KEY` + `FYSTACK_SECRET_KEY`

### 2) Install + run

```bash
cd backend
npm install
npx prisma generate

# You need a running Postgres instance matching DATABASE_URL
npx prisma migrate dev
npm run seed

npm run dev
```

API:
- Health: `GET http://localhost:4000/health`
- Swagger UI: `http://localhost:4000/docs`

## Fystack integration (MVP)

Kubera currently integrates with Fystack via:
- Wallet creation: `POST /api/fystack/workspaces/:workspaceId/wallets`
- Withdrawals: executed from proposal approval (optional) + status query endpoint
- Webhook receiver: `POST /api/fystack/webhook` (stores raw events)

Notes:
- Fystack auth is HMAC-based (see `backend/src/integrations/fystack/client.ts`).
- Withdrawal idempotency is supported via `X-Idempotency-Key`.
- Webhook signature verification is TODO (docs we pulled did not specify the header scheme).
