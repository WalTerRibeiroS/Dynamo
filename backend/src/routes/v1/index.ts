import { Router } from 'express'

import authRoutes from '../v1/modules/auth/auth.routes.js'
import healthRoutes from '../v1/modules/health/health.routes.js'
import usersRoutes from "../v1/modules/users/users.routes.js"

import { authLimiter, usersLimiter } from '../../config/rateLimiter.js'

const v1 = Router()

v1.use('/health', healthRoutes)
v1.use('/auth', authLimiter, authRoutes)
v1.use('/users', usersLimiter, usersRoutes)

export default v1
