FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG DATABASE_URL=postgresql://postgres:postgres@db:5432/aitonomous_notepad?schema=public
ARG NOTE_AUTH_SECRET=build-only-secret
ENV DATABASE_URL=$DATABASE_URL
ENV NOTE_AUTH_SECRET=$NOTE_AUTH_SECRET
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
