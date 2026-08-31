import { ValidationError } from '../../utils/errors.js'
import logger from '../../utils/logger.js'
import { dbTeste } from './model.js'
import type { Issue } from '../../types/issue.js'

export const serviceTest = async (texto: string) => {
  logger.info('Request recebida no service')

  const issues: Issue[] = []

  if (texto.length < 3) {
    issues.push({
      field: 'mensagem',
      message: 'deve ser maior ou igual a 3 caracteres',
    })
  }

  if (issues.length > 0) {
    throw new ValidationError({ issues })
  }

  const { mensagem } = await dbTeste(texto)
  logger.info('Mensagem retornada pelo db:', mensagem)

  return mensagem
}
