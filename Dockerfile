# Dockerfile for masterpage (Next.js 16)
# Requires Node.js >= 24

FROM node:24-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

FROM node:24-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install ffmpeg and yt-dlp for audio processing
RUN apk update && apk add --no-cache ffmpeg python3 py3-pip || true
RUN pip3 install --break-system-packages yt-dlp || true

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Create upload directories with correct permissions BEFORE switching to nextjs user
RUN mkdir -p public/uploads/images public/uploads/audio && \
    chown -R nextjs:nodejs public/uploads && \
    chmod -R 775 public/uploads

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
