FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.base.json ./
COPY packages/shared-types ./packages/shared-types
COPY apps/server ./apps/server
RUN corepack enable && pnpm install --frozen-lockfile
RUN pnpm --filter @meatspace/shared-types build
RUN pnpm --filter @meatspace/server build
RUN pnpm --filter @meatspace/server deploy --prod --legacy /app/deploy

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/deploy/dist ./dist
COPY --from=builder /app/deploy/node_modules ./node_modules
COPY --from=builder /app/deploy/package.json ./
COPY --from=builder /app/apps/server/migrations ./migrations
EXPOSE 3001
CMD ["node", "dist/index.js"]
