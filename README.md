# SubHub Fullstack

## Stack
- Frontend: Vite + React + TypeScript
- Backend: Express + TypeScript (`/server`)
- DB: PostgreSQL + Prisma
- Auth: JWT access token + refresh token (HTTP-only cookie)

## Setup
1. Install deps:
   - `npm install`
   - `npm --prefix server install`
2. Start Postgres:
   - `docker compose up -d`
3. Configure env files:
   - copy `.env.example` -> `.env`
   - copy `server/.env.example` -> `server/.env`
4. Run Prisma:
   - `npm --prefix server run prisma:generate`
   - `npm --prefix server run prisma:migrate -- --name init`
   - `npm --prefix server run prisma:seed`
5. Run app (client + server):
   - `npm run dev`

## Seeded credentials
- Admin: `admin@subhub.com` / `Admin123!`
- User: `john@subhub.com` / `User123!`

## API groups implemented
- `/api/auth`
- `/api/admin/users`
- `/api/domains` + `/api/domains/:id/subdomains`
- `/api/wallet`
- `/api/transfers`
- `/api/invoices`
- `/api/support` + `/api/admin/support`
- `/api/admin/audit-logs`
- `/api/admin/abuse`
- `/api/admin/settings`
- `/api/status`
- `/api/whois`
