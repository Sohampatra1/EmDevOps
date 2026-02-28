# ==============================================================================
# Base Setup
# ==============================================================================
FROM node:20-alpine AS base
# Install necessary tools for prisma and pnpm
RUN apk add --no-cache libc6-compat openssl
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# ==============================================================================
# Dependencies Setup
# ==============================================================================
FROM base AS deps
WORKDIR /app
# Copy package definitions
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
# Copy prisma schema specifically for generation
COPY apps/web/prisma ./apps/web/prisma

# Install dependencies
RUN pnpm install --frozen-lockfile

# Generate Prisma Client
RUN pnpm --filter web exec prisma generate

# ==============================================================================
# Builder Phase
# ==============================================================================
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
# Copy all source code
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1

# Build the application
RUN pnpm --filter web build

# ==============================================================================
# Production Runner Phase
# ==============================================================================
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Set up unprivileged user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Copy standalone output from the builder stage
COPY --from=builder /app/apps/web/public ./apps/web/public

# The standalone build automatically creates a self-contained folder
# Note: Ensure `output: 'standalone'` is set in next.config.ts
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

# Expose the application port
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/web/server.js"]
