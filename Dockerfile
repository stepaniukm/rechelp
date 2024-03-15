FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN apk add --no-cache libc6-compat
RUN pnpm install --frozen-lockfile

FROM base AS builder
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN pnpm run build

FROM base AS runner
COPY --from=builder /app ./

EXPOSE 3000
CMD ["pnpm", "start"]
