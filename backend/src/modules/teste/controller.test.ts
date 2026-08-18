import type { Request, Response } from "express"
import { asyncHandler } from "../../utils/asyncHandler.js"
import logger from "../../utils/logger.js"
import { inserirMensagemSchema } from "./schemas/teste.schema.js"
import { serviceTest } from "./service.test.js"
import { sendSuccess } from "../../utils/sendSuccess.js"

export const teste = asyncHandler(async (req: Request, res: Response) => {

  logger.info("Request recebida no controller")

  const texto = /* inserirMensagemSchema.parse */(req.body.texto)
  const mensagem = await serviceTest(texto)

  /* res.status(200).json({ resposta: mensagem}) */
  return sendSuccess(res, { resposta: mensagem })// testar statusCode e mensagem
})