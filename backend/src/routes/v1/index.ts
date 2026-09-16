import { Router } from "express"

import authRoutes from "../v1/modules/auth/auth.routes.js"
import { authLimiter } from "../../config/rateLimiter.js"

const v1 = Router()

v1.use("/auth", authLimiter, authRoutes)

export default v1