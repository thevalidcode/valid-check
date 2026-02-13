import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

// Define schema
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  DATABASE_URL: z.url().default(""),
  FRONTEND_URL: z.string().optional(),
});

// Parse and validate
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "❌ Invalid environment variables:",
    parsed.error.flatten().fieldErrors,
  );
  process.exit(1);
}

export const env = parsed.data;
