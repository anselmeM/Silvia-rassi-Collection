import { z } from "zod";

export const envSchema = z.object({
  VITE_MEDUSA_BACKEND_URL: z.string().url().default("http://localhost:9000"),
  VITE_MEDUSA_PUBLISHABLE_KEY: z.string().optional(),
  VITE_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
});

export function validateEnv() {
  const result = envSchema.safeParse(import.meta.env);

  if (!result.success) {
    console.error("❌ Invalid storefront environment variables:", result.error.format());
    // In browser, we might just log instead of throwing to prevent total crash
    // but for security-hardening we want visibility.
  }

  return result.data;
}
