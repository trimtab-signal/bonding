# ─── Server ────────────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/shared-types ./packages/shared-types
COPY apps/server ./apps/server
RUN corepack enable && pnpm install --frozen-lockfile
RUN pnpm --filter @bonding/shared-types build
RUN pnpm --filter @bonding/server build
RUN pnpm --filter @bonding/server prune --prod

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/apps/server/dist ./dist
COPY --from=builder /app/apps/server/package.json ./
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3001
CMD ["node", "dist/index.js"]
