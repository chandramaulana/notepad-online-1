FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG DATABASE_URL=postgresql://postgres:postgres@db:5432/chandra_notepad?schema=public
ARG NOTE_AUTH_SECRET=build-only-secret
ARG NEXT_PUBLIC_APP_URL=http://localhost:7800
ARG NEXT_PUBLIC_COLLAB_WS_URL=ws://localhost:1234
ARG NEXT_PUBLIC_SAVE_INTERVAL_MS=3000
ARG GOOGLE_SITE_VERIFICATION=
ENV DATABASE_URL=$DATABASE_URL
ENV NOTE_AUTH_SECRET=$NOTE_AUTH_SECRET
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_COLLAB_WS_URL=$NEXT_PUBLIC_COLLAB_WS_URL
ENV NEXT_PUBLIC_SAVE_INTERVAL_MS=$NEXT_PUBLIC_SAVE_INTERVAL_MS
ENV GOOGLE_SITE_VERIFICATION=$GOOGLE_SITE_VERIFICATION
RUN npx prisma generate --schema prisma/schema.prisma && npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY prisma ./prisma
COPY --from=builder /app/collab-server.ts ./collab-server.ts
COPY --from=builder /app/src ./src
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY scripts ./scripts
RUN chmod +x /app/scripts/start.sh
EXPOSE 7800
EXPOSE 1234
CMD ["sh", "/app/scripts/start.sh"]
