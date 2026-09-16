import { createLimiter } from "../middlewares/createLimiter.js"

export const globalLimiter = createLimiter({ windowMs: 15 * 60 * 1000, limit: 300 })
export const authLimiter = createLimiter({ windowMs: 15 * 60 * 1000, limit: 10 })