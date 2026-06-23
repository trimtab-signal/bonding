# BONDING Deployment Guide

## Two Projects, Two Domains

There are **two separate BONDING projects** deployed to Cloudflare Pages:

| Project            | URL                                 | What It Is                                                  |
| ------------------ | ----------------------------------- | ----------------------------------------------------------- |
| **Chemistry Game** | https://bonding.p31ca.org           | Molecule-building chemistry game (React Three Fiber, VSEPR) |
| **Meatspace Game** | https://bonding-meatspace.pages.dev | Real-world social game onboarding site (this repo)          |

The chemistry game is a separate codebase at `/home/p31/andromeda/software/bonding/` and is NOT part of this repo.

## Architecture (This Repo — Meatspace Game)

```
┌──────────────────────────┐     ┌──────────────────┐     ┌──────────────┐
│  bonding-meatspace.      │     │  api.bonding.     │     │  PostgreSQL   │
│  pages.dev               │     │  p31ca.org         │     │  (Render/     │
│  (Cloudflare Pages)      │     │  Express + Socket.io│     │  Railway)     │
│  Onboarding Site         │     │  (Docker)          │     │               │
└──────────────────────────┘     └──────────────────┘     └──────────────┘
         │                              │                       │
         ▼                              ▼                       ▼
   Cloudflare Pages                Docker Container          Managed DB
   (static, global CDN)            (Node 22, auto-scaled)
```

## Deployed URLs

| Service                   | URL                                       | Status                  |
| ------------------------- | ----------------------------------------- | ----------------------- |
| Meatspace Onboarding      | https://bonding-meatspace.pages.dev       | ✅ Live                 |
| Meatspace (custom domain) | https://meatspace.bonding.p31ca.org       | 🟡 Provisioning         |
| Chemistry Game            | https://bonding.p31ca.org                 | ✅ Live (separate repo) |
| GitHub                    | https://github.com/trimtab-signal/bonding | ✅ Live                 |
| API Server                | http://localhost:3001                     | Local only              |

## Quick Deploy

### Onboarding Site (Cloudflare Pages — Meatspace)

```bash
# One command — builds + deploys to https://bonding-meatspace.pages.dev
pnpm deploy:onboarding

# Or manually:
pnpm build:onboarding
wrangler pages deploy apps/onboarding/dist --project-name bonding-meatspace --branch master
```

### Chemistry Game (Separate Project)

The chemistry game is at `/home/p31/andromeda/software/bonding/` and deploys to the `bonding` Pages project:

```bash
cd /home/p31/andromeda/software/bonding
npx wrangler pages deploy dist --project-name=bonding
```

### API Server (Docker + Render/Railway)

The server needs PostgreSQL and WebSocket support. Options:

#### Option A: Render.com (recommended for MVP)

1. Push to GitHub
2. Create a new Web Service on Render, connect repo
3. Select **Docker** environment
4. Render uses the `Dockerfile` at repo root
5. Add a PostgreSQL database via Render Dashboard
6. Set env vars:
   - `DATABASE_URL` — auto-populated from Render DB
   - `NODE_ENV=production`
7. Deploy

#### Option B: Railway.app

1. Push to GitHub, connect to Railway
2. Railway auto-detects the `railway.json` config
3. Railway also auto-provisions PostgreSQL

#### Option C: Manual VPS (DigitalOcean, Hetzner, etc.)

```bash
docker build -t bonding-server .
docker run -d -p 3001:3001 -e DATABASE_URL=postgresql://user:pass@host:5432/bonding bonding-server
```

## Environment Variables

| Variable       | Required | Description                       |
| -------------- | -------- | --------------------------------- |
| `DATABASE_URL` | ✅       | PostgreSQL connection string      |
| `PORT`         | ❌       | Server port (default 3001)        |
| `NODE_ENV`     | ❌       | `production` or `development`     |
| `CORS_ORIGIN`  | ❌       | Allowed CORS origin (default `*`) |

## Run Migrations

```bash
# Locally pointing to production DB:
DATABASE_URL=postgresql://... pnpm db:migrate

# Or after server deploy, migrations run automatically on startup
```

## CI/CD

Auto-deploy on push to `master` via GitHub Actions at `.github/workflows/deploy.yml`.

**Required GitHub Secret:**
| Secret | Value |
|--------|-------|
| `CF_API_TOKEN` | Cloudflare API token with `pages:write` permission |

The workflow triggers only when `apps/onboarding/`, `packages/shared-types/`, `pnpm-lock.yaml`, or the workflow file itself changes.

## Troubleshooting

| Problem                   | Solution                                            |
| ------------------------- | --------------------------------------------------- |
| Site not loading          | Check Cloudflare Pages deployment status            |
| 502 Bad Gateway           | Server process crashed — check Render logs          |
| WebSocket disconnects     | Ensure Socket.io transport includes `websocket`     |
| Database connection fails | Verify `DATABASE_URL` and IP whitelist              |
| Chemistry game missing    | Deploy from `/home/p31/andromeda/software/bonding/` |
