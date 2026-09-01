import { Router } from "express"

import authRoutes from "../v1/modules/auth/auth.routes.js"

const v1 = Router()

v1.use("/auth", authRoutes)

export default v1