# ---------- Base ----------
FROM node:20-alpine AS base
WORKDIR /app

# ---------- Dependencies ----------
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm install

# ---------- Build ----------
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---------- Runtime ----------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -S nextjs && adduser -S nextjs -G nextjs

# Copy build output and configurations
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY package.json package-lock.json* ./
COPY next.config.ts ./

# Install production dependencies only
RUN npm install --omit=dev

# Set permissions for nextjs user
RUN chown -R nextjs:nextjs /app

# Security
USER nextjs

EXPOSE 3738

CMD ["npm", "start"]