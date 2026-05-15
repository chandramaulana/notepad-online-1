import { z } from "zod";

export const slugSchema = z
  .string()
  .min(1)
  .max(120)
  .regex(/^[a-zA-Z0-9_-]+$/);

export const lockSchema = z.object({
  pin: z.string().regex(/^\d{4,6}$/)
});

export const saveSchema = z.object({
  contentJson: z.string().max(2_000_000)
});

export const unlockSchema = z.object({
  pin: z.string().regex(/^\d{4,6}$/)
});
