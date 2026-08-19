import { Router } from "express"

import { teste } from "./controller.test.js"
import { inserirMensagemSchema } from "./schemas/teste.schema.js"
import { validateBody } from "../../middlewares/validateBody.js"

const router = Router()

router.post("/mudar", validateBody(inserirMensagemSchema), teste)

export default router