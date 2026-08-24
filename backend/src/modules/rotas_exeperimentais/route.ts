import { Router } from 'express'

import { teste } from './controller.js'
import { inserirMensagemSchema } from '../rotas_exeperimentais/schemas/teste.js'
import { validateBody } from '../../middlewares/validateBody.js'

const router = Router()

router.post('/mudar', validateBody(inserirMensagemSchema), teste)

export default router
