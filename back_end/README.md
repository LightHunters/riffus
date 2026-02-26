# Riffus Backend (NestJS)

Independent modular-monolith backend for Riffus using:
- NestJS + TypeScript
- PostgreSQL + Prisma
- Deezer + iTunes provider integration
- **Google OAuth2 Authentication with Passport + JWT**

> 🔐 **NEW**: This backend now includes Google OAuth2 authentication! See [OAUTH_SETUP.md](./OAUTH_SETUP.md) for detailed setup instructions.

## What This Service Does
- Exposes API parity endpoints for songs, orders, and demo users.
- Runs independently from the Next.js frontend.
- **Handles Google OAuth2 login and JWT protected routes**
- Uses standardized API envelopes:
  - success: `{ success: true, data: ... }`
  - error: `{ success: false, message: "...", details?: ... }`

## Authentication (NEW!)
- `GET /auth/google` - Initiate Google OAuth login
- `GET /auth/google/callback` - OAuth callback (automatic redirect)
- `GET /auth/profile` - Get current user (requires JWT)
- `GET /auth/logout` - Logout (requires JWT)

See [OAUTH_SETUP.md](./OAUTH_SETUP.md) for complete OAuth setup guide.

## Modules
- `health`: liveness/readiness.
- `users`: demo/mock role users.
- `songs`: recent/recommended/search/play + provider caching.
- `orders`: queue create/list/status/reorder.
- `integrations`: Deezer and iTunes HTTP clients.
- `prisma`: database client lifecycle.

## Environment
Copy `.env.example` to `.env`.

Required:
- `DATABASE_URL`

Defaults:
- `PORT=4001`
- `DEEZER_API_URL=https://api.deezer.com`
- `ITUNES_API_URL=https://itunes.apple.com`
- `FRONTEND_ORIGIN=http://localhost:3000`

## Run
1. Install:
   - `npm install`
2. Generate Prisma client:
   - `npm run prisma:generate`
3. Apply migrations:
   - `npm run prisma:migrate`
4. Seed demo data:
   - `npm run prisma:seed`
5. Start dev server:
   - `npm run start:dev`

## API Endpoints
- `GET /health/live`
- `GET /health/ready`
- `GET /api/users/demo?role=customer|owner`
- `GET /api/songs/recent?limit=10`
- `GET /api/songs/recommended?limit=10`
- `GET /api/songs/search?q=...&limit=25`
- `POST /api/songs/:id/play`
- `GET /api/orders?status=queued|playing|completed`
- `POST /api/orders` body `{ userId, songId }`
- `PATCH /api/orders/:id/status` body `{ status }`
- `POST /api/orders/reorder` body `{ orderedIds: string[] }`

## API Docs
- Swagger UI: `/docs`

## Testing
- Unit tests:
  - `npm run test`
- E2E test config:
  - `npm run test:e2e`
