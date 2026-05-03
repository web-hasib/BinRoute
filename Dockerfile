# ---------- Base ----------
FROM node:20-alpine AS base
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.18.1 --activate

# ---------- Dependencies ----------
FROM base AS deps
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# ---------- Build ----------
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# ---------- Runtime ----------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN corepack enable && corepack prepare pnpm@10.18.1 --activate \
  && addgroup -S nextjs \
  && adduser -S nextjs -G nextjs

# Copy build output
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY package.json pnpm-lock.yaml* ./
COPY next.config.ts ./

# Install prod deps only
RUN pnpm install --prod --frozen-lockfile

# Security (optional but good)
USER nextjs

EXPOSE 3737

CMD ["pnpm", "start"]