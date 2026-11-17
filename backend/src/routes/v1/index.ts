import { Router } from 'express'

import authRoutes from '../v1/modules/auth/auth.routes.js'
import healthRoutes from '../v1/modules/health/health.routes.js'
import usersRoutes from '../v1/modules/users/users.routes.js'
import workspacesRoutes from '../v1/modules/workspaces/workspaces.routes.js'

import { authLimiter, usersLimiter } from '../../config/rateLimiter.js'
import { authMiddleware } from '../../middlewares/authMiddleware.js'

const v1 = Router()

v1.use('/health', healthRoutes)
v1.use('/auth', authLimiter, authRoutes)
v1.use(authMiddleware) // tudo daqui pra baixo requer login
v1.use('/users', usersLimiter, usersRoutes)
v1.use('/workspaces', workspacesRoutes)

export default v1