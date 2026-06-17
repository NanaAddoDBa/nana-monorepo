FROM node:22-alpine AS deps

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

RUN corepack enable && corepack prepare pnpm@10.18.3 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM node:22-alpine AS builder

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

RUN corepack enable && corepack prepare pnpm@10.18.3 --activate

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM node:22-alpine AS runner

WORKDIR /app

ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

RUN set -eux; \
  server_path="$(find . -path '*/node_modules/*' -prune -o -name server.js -print | head -n 1)"; \
  test -n "$server_path"; \
  server_dir="$(dirname "$server_path")"; \
  if [ "$server_dir" != "." ]; then \
    mkdir -p "$server_dir/.next"; \
    cp -R ./.next/static "$server_dir/.next/static"; \
    cp -R ./public "$server_dir/public"; \
  fi; \
  printf '%s\n' "$server_path" > /app/server-path.txt

USER nextjs

EXPOSE 3000

CMD ["sh", "-c", "node $(cat /app/server-path.txt)"]
