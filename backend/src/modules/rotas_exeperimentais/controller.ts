import type { Request, Response } from 'express'
import { asyncHandler } from '../../utils/asyncHandler.js'
import logger from '../../utils/logger.js'
import { serviceTest } from './service.js'
import { sendSuccess } from '../../utils/sendSuccess.js'
import type { Texto } from '../rotas_exeperimentais/schemas/teste.js'

export const teste = asyncHandler(async (req: Request, res: Response) => {
  logger.info('Request recebida no controller')

  const { mensagem: texto } = req.body as Texto

  const mensagem = await serviceTest(texto)

  return sendSuccess(res, {
    data: {
      resposta: mensagem,
    },
  })
})
