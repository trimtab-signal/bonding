# BUILD.md — Build Guide

## Prerequisites

- **Node.js** >= 20
- **pnpm** >= 9
- **Docker** (for PostgreSQL + PostGIS)
- **Git** (optional)

## Step‑by‑Step

### 1. Clone the repository

```bash
git clone https://github.com/p31labs/bonding.git
cd bonding
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment

```bash
cp .env.example apps/server/.env
```

Edit `apps/server/.env` to adjust `DATABASE_URL` or ports if needed (defaults work for local dev).

### 4. Start the database

```bash
docker compose up -d
```

Wait for PostgreSQL to become ready (check logs with `docker logs bonding-db`).

### 5. Build shared types

```bash
pnpm --filter @meatspace/shared-types build
```

### 6. Run migrations

```bash
pnpm --filter @meatspace/server db:migrate
```

### 7. (Optional) Seed test data

```bash
pnpm --filter @meatspace/server db:seed
```

This adds four test atoms and one bond.

### 8. Start the server

```bash
pnpm dev:server
```

Server runs on `http://localhost:3001`.
Verify: `curl http://localhost:3001/health` → `{"status":"ok"}`

### 9. Start the mobile app (development)

```bash
pnpm dev:mobile
```

App runs on `http://localhost:5173`.

### 10. Build for production

```bash
pnpm build:shared && pnpm build:server && pnpm build:mobile
```

- Server output: `apps/server/dist/`
- Mobile output: `apps/mobile/dist/`

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `docker: command not found` | Install Docker Desktop. |
| `DATABASE_URL` error | Check `.env` and ensure Docker container is running. |
| Migration fails (relation exists) | The init script is idempotent; run `pnpm db:migrate` again. |
| CORS errors | Set `CORS_ORIGIN` in `.env` to your frontend URL. |
