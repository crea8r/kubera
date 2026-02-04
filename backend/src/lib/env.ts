import 'dotenv/config';
import { z } from 'zod';

const EnvSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.string().default('development'),
  LOG_LEVEL: z.string().default('info'),

  JWT_SECRET: z.string().min(16),

  DATABASE_URL: z.string().min(1),

  FYSTACK_BASE_URL: z.string().url().default('https://api.fystack.io'),
  FYSTACK_API_KEY: z.string().optional(),
  FYSTACK_SECRET_KEY: z.string().optional(),

  FYSTACK_WEBHOOK_SECRET: z.string().optional()
});

export const env = EnvSchema.parse(process.env);
