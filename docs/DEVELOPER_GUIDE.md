# DEVELOPER_GUIDE.md — For Contributors

## Project Structure

```
bonding/
├── packages/shared-types/    # All shared TypeScript definitions
├── apps/server/              # Backend (Node.js + Express + Socket.io)
├── apps/mobile/              # Frontend (React + Capacitor)
├── docker-compose.yml        # PostgreSQL + PostGIS
└── docs/                     # Documentation
```

---

## Development Workflow

1. **Install dependencies**: `pnpm install`
2. **Start database**: `docker compose up -d`
3. **Run migrations**: `pnpm --filter @meatspace/server db:migrate`
4. **Build shared types**: `pnpm --filter @meatspace/shared-types build`
5. **Run both server and mobile** (two terminals):
   - Terminal 1: `pnpm dev:server`
   - Terminal 2: `pnpm dev:mobile`

---

## Adding a New Zone

1. Edit `packages/shared-types/src/index.ts` — add to the `ZONES` object.
2. Update the database constraint `valid_zone` in `migrations/init.sql`.
3. Rebuild shared types and run migrations.

## Extending the Game Loop

- Server logic lives in `apps/server/src/services/`.
- Add new message types in `ClientMessage`/`ServerMessage` in shared types.
- Implement handlers in `game-handler.ts`.

## Adding a New Reaction Type

1. Add to `ReactionType` in shared types.
2. Update `valid_reaction_type` check in `migrations/init.sql`.
3. Handle submission in `game-handler.ts`.

---

## Testing

- Run type checks: `pnpm -r exec tsc --noEmit`
- Unit tests (planned): use `vitest` or `jest`.
- Manual testing: open two browsers with different identities.

## Deployment

### Backend (Render / Railway)
- Set `DATABASE_URL` to a managed PostgreSQL.
- Set `CORS_ORIGIN` to your frontend URL.
- Build: `pnpm build:server` → start: `node dist/index.js`.

### Frontend (Vercel / Netlify)
- Build: `pnpm build:mobile` → deploy `apps/mobile/dist`.

### Mobile Apps (Capacitor)
- Add platforms: `npx cap add ios` / `npx cap add android`.
- Sync: `npx cap sync`.
- Open native IDE: `npx cap open ios` etc.
