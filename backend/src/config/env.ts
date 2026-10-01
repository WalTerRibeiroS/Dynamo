import 'dotenv/config'

import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().int().positive(),
  NODE_ENV: z.enum(['development', 'test', 'production']),

  FRONTEND_URL: z.url(),
  BACKEND_URL: z.url(),

  DB_USER: z.string().min(1),
  DB_HOST: z.string().min(1),
  DB_NAME: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_PORT: z.coerce.number().int().positive(),

  REFRESH_TOKEN: z.string().min(1),
  ACCESS_TOKEN: z.string().min(1),
})

export const ENV = envSchema.parse(process.env)
