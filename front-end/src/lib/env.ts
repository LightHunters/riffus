import { z } from "zod";

const envSchema = z.object({
  MONGO_URI: z.string().min(1).default("mongodb://127.0.0.1:27017/music_cafe"),
  DEEZER_API_URL: z.string().url().default("https://api.deezer.com"),
  ITUNES_API_URL: z.string().url().default("https://itunes.apple.com"),
});

const parsed = envSchema.safeParse({
  MONGO_URI: process.env.MONGO_URI,
  DEEZER_API_URL: process.env.DEEZER_API_URL,
  ITUNES_API_URL: process.env.ITUNES_API_URL,
});

if (!parsed.success) {
  const message = parsed.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join(", ");
  throw new Error(`Invalid environment: ${message}`);
}

export const env = parsed.data;
