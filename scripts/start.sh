#!/bin/sh
set -e

echo "[startup] Syncing Prisma schema with database..."
attempt=1
max_attempts=20

until npx prisma db push --skip-generate; do
  if [ "$attempt" -ge "$max_attempts" ]; then
    echo "[startup] Failed to sync schema after ${max_attempts} attempts"
    exit 1
  fi

  echo "[startup] Database not ready yet, retrying (${attempt}/${max_attempts})..."
  attempt=$((attempt + 1))
  sleep 2
done

echo "[startup] Starting application services..."
npm run start
