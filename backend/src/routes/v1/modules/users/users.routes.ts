import { Router } from 'express'

import { validateBody } from '../../../../middlewares/validateBody.js'
import { updateUsernameSchema } from './schemas/users.update.schema.js'
import { authMiddleware } from '../../../../middlewares/authMiddleware.js'

import * as controller from "./users.controller.js"

const router = Router()

router.get('/me', authMiddleware, controller.me)
router.patch('/me', authMiddleware, validateBody(updateUsernameSchema), controller.updateUsername)

export default router
