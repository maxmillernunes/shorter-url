import { z } from 'zod';

export const envSchema = z.object({
  DATABASE_URL: z.url().startsWith('postgres://'),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  PORT: z.coerce.number().default(3333),
  BASE_URL: z.url().default('http://localhost'),
});

export type Env = z.infer<typeof envSchema>;
