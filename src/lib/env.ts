function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl: required("DATABASE_URL", process.env.DATABASE_URL),
  noteAuthSecret: required("NOTE_AUTH_SECRET", process.env.NOTE_AUTH_SECRET),
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:7800",
  collabUrl: process.env.NEXT_PUBLIC_COLLAB_WS_URL || "ws://localhost:1234",
  saveIntervalMs: Number(process.env.NEXT_PUBLIC_SAVE_INTERVAL_MS || 3000)
};
