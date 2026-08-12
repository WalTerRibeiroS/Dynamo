import type { Request, Response } from "express"
import { dbTeste } from "./model.test.js"

export const teste = async (req: Request, res: Response) => {

  const novaMensagem = req.body.texto

  const { mensagem } = await dbTeste(novaMensagem)

  res.status(200).json({ resposta: mensagem})
}