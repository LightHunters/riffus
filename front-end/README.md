# Riffus

Riffus is a cafe music app:
- Customers search and request songs.
- Cafe owners manage the queue and control playback.

This repo now supports two backend modes:
- Built-in Next.js API (MongoDB).
- Independent NestJS backend in `backend/` (PostgreSQL + Prisma).

## Architecture
- Frontend: Next.js App Router (`app/`, `src/components/`).
- Current default backend: Next.js route handlers (`app/api/**`), Mongo via Mongoose.
- New independent backend: NestJS modular monolith in `backend/`.

## Frontend-Backend Toggle
Frontend API calls use `NEXT_PUBLIC_API_URL`:
- Empty or unset: use local Next.js APIs (`/api/...`).
- Set to backend URL (for example `http://localhost:4001`): use Nest backend.

Example:
```env
NEXT_PUBLIC_API_URL=http://localhost:4001
```

## Root App (Next.js) Setup
1. Install dependencies:
   - `npm install`
2. Create `.env` from `.env.example`.
3. Set at least:
   - `MONGO_URI`
4. Start:
   - `npm run dev`

## Independent Backend (NestJS) Setup
1. Go to backend:
   - `cd backend`
2. Install:
   - `npm install`
3. Create backend env from `backend/.env.example`.
4. Run Prisma:
   - `npm run prisma:generate`
   - `npm run prisma:migrate`
   - `npm run prisma:seed`
5. Start backend:
   - `npm run start:dev`

Default backend URL: `http://localhost:4001`
Swagger docs: `http://localhost:4001/docs`

## API Contract (Both Backends)
Envelope:
- Success: `{ "success": true, "data": ... }`
- Error: `{ "success": false, "message": "...", "details"?: ... }`

Endpoints:
- `GET /api/users/demo?role=customer|owner`
- `GET /api/songs/recent?limit=10`
- `GET /api/songs/recommended?limit=10`
- `GET /api/songs/search?q=...&limit=25`
- `POST /api/songs/:id/play`
- `GET /api/orders?status=queued|playing|completed`
- `POST /api/orders` with `{ userId, songId }`
- `PATCH /api/orders/:id/status` with `{ status }`
- `POST /api/orders/reorder` with `{ orderedIds: string[] }`
- `GET /health/live` (Nest backend)
- `GET /health/ready` (Nest backend)

## Scripts (Root)
- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run typecheck`
- `npm run backend:dev`
- `npm run backend:build`
- `npm run backend:test`

## Notes
- Keep both backends side-by-side until final cutover choice is made.
- No automatic Mongo -> Postgres migration is included in this phase.
- See `backend/README.md` for backend internals.
