import { Router } from 'express'

import { validateBody } from '../../../../middlewares/validateBody.js'
import { registerUserSchema } from './schemas/auth.register.schema.js'
import { loginUserSchema } from './schemas/auth.login.schema.js'

import * as controller from './auth.controller.js'

const router = Router()

router.post('/register', validateBody(registerUserSchema), controller.register)
router.post('/login', validateBody(loginUserSchema), controller.login)
router.post('/refresh', controller.refresh)
router.post('/logout', controller.logout)

export default router
