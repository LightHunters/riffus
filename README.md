## Music Café — Full‑Stack Demo

### Prerequisites
- Node.js 18+
- Local MongoDB running at `mongodb://127.0.0.1:27017`

### Setup
1. Install dependencies
   - Backend: `cd backend && npm install`
   - Frontend: `cd ../frontend && npm install`

2. Configure backend environment
   - See `backend/.env` (already set with sensible defaults).

3. Seed sample data
   - `cd backend && npm run seed`

4. Run apps
   - Backend: `npm run dev` (port 4000)
   - Frontend: in another shell `cd ../frontend && npm run dev` (port 5173)

### API
- `GET /songs/recent`
- `GET /songs/recommended`
- `POST /songs/order` — body: `{ userId, songId }`
- `GET /users/demo` — returns a demo user (created on first call)


