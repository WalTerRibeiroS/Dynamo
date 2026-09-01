import { Router } from "express"

import { validateBody } from "../../../../middlewares/validateBody.js"
import { registerUserSchema } from '../auth/schemas/register.user.schema.js'

import * as controller from "./auth.controller.js"

const router = Router()

router.post('/register', validateBody(registerUserSchema), controller.register)

export default router