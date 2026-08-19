import {ValidationError } from "../../utils/errors.js"
import logger from "../../utils/logger.js"
import { dbTeste } from "./model.test.js"

export const serviceTest = async(texto: string) => {

  logger.info("Request recebida no service")

  if (texto.length < 3) {
    throw new ValidationError({
      issues: [
        {
          field: "mensagem",
          message: "deve ser maior ou igual a 3 caracteres",
        },
      ],
      details: "Mensagem foi menor q 3",
      message: "Mensagem inválida"
    });
  }

  const {mensagem}  = await dbTeste(texto)
  logger.info("Mensagem retornada pelo db:", mensagem)
  
  return mensagem
}
