import { Router } from 'express'

import { validateBody } from '../../../../middlewares/validateBody.js'
import { updateUsernameSchema } from './schemas/users.username.schema.js'
import { updateSettingsSchema } from './schemas/users.update.settings.schema.js'

import * as controller from './users.controller.js'
import { updatePasswordSchema } from './schemas/users.update.password.schema.js'
import { deleteUserSchema } from './schemas/users.delete.user.schema.js'
import { usersSecurityLimiter } from '../../../../config/rateLimiter.js'

const router = Router()

router.get('/me', controller.me)

router.patch('/me', validateBody(updateUsernameSchema), controller.updateUsername)

router.delete('/me', usersSecurityLimiter, validateBody(deleteUserSchema), controller.deleteUser)

router.patch('/me/settings', validateBody(updateSettingsSchema), controller.updateSettings)

router.patch(
  '/me/password',
  usersSecurityLimiter,
  validateBody(updatePasswordSchema),
  controller.updatePassword,
)

export default router
