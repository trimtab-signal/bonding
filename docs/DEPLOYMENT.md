# BONDING Deployment Guide

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌──────────────┐
│  bonding.p31ca.org │     │  api.bonding.     │     │  PostgreSQL   │
│  (Cloudflare Pages) │     │  p31ca.org         │     │  (Render/     │
│  Onboarding Site    │     │  Express + Socket.io│     │  Railway)     │
└─────────────────┘     └──────────────────┘     └──────────────┘
         │                        │                       │
         │                        │                       │
         ▼                        ▼                       ▼
   Cloudflare Pages          Docker Container         Managed DB
   (static, global CDN)      (Node 22, auto-scaled)
```

## Deployed URLs

| Service | URL | Status |
|---------|-----|--------|
| Onboarding Site | https://bonding.p31ca.org | ✅ Live |
| Onboarding Site (preview) | https://bonding.pages.dev | ✅ Live |
| GitHub | https://github.com/anomalyco/bonding | — |
| API Server | http://localhost:3001 | Local only |

## Quick Deploy

### Onboarding Site (Cloudflare Pages)

```bash
# One command — builds + deploys to Cloudflare Pages
pnpm deploy:onboarding

# Or manually:
pnpm build:onboarding
wrangler pages deploy apps/onboarding/dist --project-name bonding --branch main
```

The site is served from Cloudflare's global CDN at `bonding.p31ca.org` (custom domain) and `bonding.pages.dev`.

### API Server (Docker + Render/Railway)

The server needs PostgreSQL and WebSocket support. Two options:

#### Option A: Render.com (recommended for MVP)

1. Push the repo to GitHub
2. Create a new Web Service on Render, connect repo
3. Select **Docker** environment
4. Render will use the `Dockerfile` at repo root
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
# Build the Docker image
docker build -t bonding-server .

# Run with PostgreSQL connection
docker run -d \
  -p 3001:3001 \
  -e DATABASE_URL=postgresql://user:pass@host:5432/bonding \
  bonding-server
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `PORT` | ❌ | Server port (default 3001) |
| `NODE_ENV` | ❌ | `production` or `development` |
| `CORS_ORIGIN` | ❌ | Allowed CORS origin (default `*`) |

## Run Migrations

Once the server is deployed, run:

```bash
# If using Render shell:
curl -X POST https://api.bonding.p31ca.org/api/register \
  -H "Content-Type: application/json" \
  -d '{"publicKeyJwk": {}}'

# Or run locally pointing to production DB:
DATABASE_URL=postgresql://... pnpm db:migrate
```

The migration runs automatically on first start (the `pool.ts#migrate()` function is called at startup).

## Monitoring

- **Cloudflare Pages**: Dashboard at https://dash.cloudflare.com → Pages → bonding
- **Server logs**: Render Dashboard → Web Service → Logs
- **Database**: Render Dashboard → PostgreSQL → Metrics

## CI/CD Pipeline (Future)

For automated deployments, add a `.github/workflows/deploy.yml`:

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy-onboarding:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install
      - run: pnpm build:onboarding
      - uses: cloudflare/wrangler-action@v3
        with:
          command: pages deploy apps/onboarding/dist --project-name bonding --branch main
          apiToken: ${{ secrets.CF_API_TOKEN }}
```

## Domain Setup

`bonding.p31ca.org` is configured as a custom domain in Cloudflare Pages:
- DNS managed by Cloudflare
- SSL/TLS automatic (Full strict)
- Cache rules apply to static assets (JS/CSS cached 1 year, HTML revalidated)

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Site not loading | Check Cloudflare Pages deployment status |
| 502 Bad Gateway | Server process crashed — check Render logs |
| WebSocket disconnects | Ensure Socket.io transport includes `websocket` |
| Database connection fails | Verify `DATABASE_URL` and IP whitelist |
