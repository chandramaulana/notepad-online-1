const WINDOW_MS = 15_000;
const MAX_REQUEST = 60;

const store = new Map<string, { count: number; expiresAt: number }>();

export function assertRateLimit(key: string): void {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.expiresAt <= now) {
    store.set(key, {
      count: 1,
      expiresAt: now + WINDOW_MS
    });
    return;
  }

  if (entry.count >= MAX_REQUEST) {
    throw new Error("RATE_LIMITED");
  }

  entry.count += 1;
}
