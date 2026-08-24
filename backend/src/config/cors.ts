import type { CorsOptions } from 'cors'
import { ENV } from './env.js'

const allowedOrigins = [ENV.BACKEND_URL, ENV.FRONTEND_URL]

export const corsOrigins: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)

    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Bloqueado pelo CORS'))
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
  optionsSuccessStatus: 200,
}
