# P3 Synthesis — Production Hardening

**Node 2 (Synthesis) Deliverable**
**Date:** 2026-06-17
**Handoff:** → Node 3 (Implementation) → Node 4 (Validation)

---

## 1. Decisions (from Discovery)

| Item                      | Decision                                                                                             | Rationale                                                                                 |
| ------------------------- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **Deploy target**         | Render.com — Docker web + managed PostgreSQL                                                         | Render config (`render.yaml`) already exists. Auto-provisions DB, health checks built-in. |
| **Logging**               | Pino — structured JSON output, zero deps conflict                                                    | Lightweight, native ESM support, integrates with Render log dashboard.                    |
| **Error handling**        | Global `unhandledRejection` + `uncaughtException` handlers + Socket.io per-handler try/catch wrapper | Prevents server crashes from unhandled promise rejections.                                |
| **Health check**          | Extend `/health` to probe `SELECT 1` and return `503` on failure                                     | Required by Render for auto-restart. Gives visibility into DB connectivity.               |
| **Pilot metrics**         | Inline counters in community_state (already done in P2) + a weekly summary log                       | No new infra needed. Community era IS the progress metric.                                |
| **Mobile secure storage** | Defer to P4                                                                                          | Acceptable for 3–10 person pilot; users consenting.                                       |

---

## 2. Implementation Sprint Plan

### Phase 1: Dockerfile + Deploy Config

| Task | Files                         | Description                                                                             |
| ---- | ----------------------------- | --------------------------------------------------------------------------------------- |
| 1.1  | `Dockerfile` (new — missing!) | Multi-stage Node 22 Alpine: `pnpm install --frozen-lockfile`, `pnpm build`, run server. |
| 1.2  | `.dockerignore` (new)         | Exclude `node_modules`, `.git`, `dist`, `*.md`.                                         |
| 1.3  | `render.yaml`                 | Already exists — verify health check path.                                              |
| 1.4  | `railway.json`                | Already exists — verify health check path.                                              |
| 1.5  | `docs/DEPLOYMENT.md`          | Update API Server URL (was `localhost:3001`) and deployment instructions.               |

### Phase 2: Structured Logging

| Task | Files                                      | Description                                                        |
| ---- | ------------------------------------------ | ------------------------------------------------------------------ |
| 2.1  | `apps/server/package.json`                 | Add `pino` dependency.                                             |
| 2.2  | `apps/server/src/lib/logger.ts` (new)      | Create Pino logger instance with pino-pretty in dev, JSON in prod. |
| 2.3  | `apps/server/src/index.ts`                 | Replace `console.log` with `logger.info`.                          |
| 2.4  | `apps/server/src/services/game-handler.ts` | Replace `console.log` with `logger.info` / `logger.error`.         |

### Phase 3: Global Error Handling

| Task | Files                                      | Description                                                                            |
| ---- | ------------------------------------------ | -------------------------------------------------------------------------------------- |
| 3.1  | `apps/server/src/index.ts`                 | Add `process.on('unhandledRejection')` and `process.on('uncaughtException')` handlers. |
| 3.2  | `apps/server/src/services/game-handler.ts` | Wrap per-message handler in try/catch; emit error to client and log.                   |

### Phase 4: Health Check with DB Probe

| Task | Files                      | Description                                                        |
| ---- | -------------------------- | ------------------------------------------------------------------ |
| 4.1  | `apps/server/src/index.ts` | Extend `/health` to run `SELECT 1`, return 200/503 with DB status. |

### Phase 5: Manual Deploy

| Task | Description                                      |
| ---- | ------------------------------------------------ |
| 5.1  | Create Render account (if needed)                |
| 5.2  | Connect GitHub repo, create Web Service (Docker) |
| 5.3  | Add PostgreSQL database via Render dashboard     |
| 5.4  | Set `DATABASE_URL` env var                       |
| 5.5  | Deploy — monitor health checks                   |

---

## 3. Code Snippets

### A. Dockerfile

```dockerfile
FROM node:22-alpine AS base
RUN npm i -g pnpm

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/server/package.json ./apps/server/package.json
COPY packages/shared-types/package.json ./packages/shared-types/package.json
RUN pnpm install --frozen-lockfile

FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build:server

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/server/dist ./apps/server/dist
COPY --from=build /app/apps/server/migrations ./apps/server/migrations
COPY --from=build /app/packages/shared-types/dist ./packages/shared-types/dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

EXPOSE 3001
CMD ["node", "apps/server/dist/index.js"]
```

### B. Logger (`apps/server/src/lib/logger.ts`)

```typescript
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  transport:
    process.env.NODE_ENV !== 'production'
      ? { target: 'pino-pretty', options: { colorize: true } }
      : undefined,
});

export default logger;
```

### C. Enhanced Health Check (`apps/server/src/index.ts`)

```typescript
import { query } from './db/pool.js';

app.get('/health', async (_req, res) => {
  try {
    await query('SELECT 1');
    res.json({ status: 'ok', version: '0.1.0', service: 'bonding-server', database: 'connected' });
  } catch {
    res.status(503).json({
      status: 'error',
      version: '0.1.0',
      service: 'bonding-server',
      database: 'disconnected',
    });
  }
});
```

### D. Global Error Handlers (`apps/server/src/index.ts`)

```typescript
process.on('unhandledRejection', (reason) => {
  logger.error({ err: reason }, 'Unhandled rejection — process continuing');
});

process.on('uncaughtException', (err) => {
  logger.fatal({ err }, 'Uncaught exception — exiting');
  process.exit(1);
});
```

### E. Socket.io Handler Error Wrap (`apps/server/src/services/game-handler.ts`)

```typescript
socket.on('message', async (raw: string) => {
  try {
    const msg: ClientMessage = JSON.parse(raw);
    await handleMessage(io, socket, userId, msg);
  } catch (e) {
    logger.error({ err: e, userId, raw }, 'Error handling message');
    socket.emit(
      'message',
      JSON.stringify({
        type: 'error',
        code: 'INTERNAL_ERROR',
        message: 'Something went wrong',
      } satisfies ServerMessage),
    );
  }
});
```

---

## 4. Success Criteria (for Node 4 Validation)

| Phase       | Criteria                                                                                                      |
| ----------- | ------------------------------------------------------------------------------------------------------------- |
| **Docker**  | `docker build -t bonding-server .` succeeds. Container starts and responds on port 3001.                      |
| **Health**  | `/health` returns 200 + `database: connected` when DB is up. Returns 503 when DB is down.                     |
| **Logging** | Server outputs structured JSON logs. Log level configurable via `LOG_LEVEL` env var.                          |
| **Errors**  | Unhandled promise rejections are logged, don't crash the process. Malformed messages return error to client.  |
| **Deploy**  | Server accessible at `https://bonding-server.onrender.com` (or custom domain). WebSocket connections succeed. |

---

## 5. Handoff

**Implementation order:** Phases 1–4 (code) → Phase 5 (deploy). Estimated effort: 0.5–1 day.

---

## 6. Sign-off

**Node 2 (Synthesis) — ✅ Complete**
**Handoff to Node 3 (Implementation) — ✅ Ready**
