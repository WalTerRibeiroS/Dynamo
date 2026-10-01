import { DatabaseError } from 'pg'
import type { PgErrorMap, PgErrorCode } from '../../../types/pgError.js'

function isDatabaseError(error: unknown): error is DatabaseError {
  return error instanceof DatabaseError
}
//se o retorno é true o Ts interpreta o retorno como 'DatabaseError'
//permitindo coisas como error.code

const PG_ERROR_CODES = new Set<PgErrorCode>(['23505', '23503', '23514'])

function isPgErrorCode(code: string): code is PgErrorCode {
  return PG_ERROR_CODES.has(code as PgErrorCode)
}
//mesma coisa que isDatabaseError, serve pra fazer type narrowing quando for true
//safe usar `as` aqui pq o has é quem valida o tipo
//continua retornando um boolean

export function mapPgError(error: unknown, map: PgErrorMap): never {
  if (isDatabaseError(error) && error.code && isPgErrorCode(error.code)) {
    const handler = map[error.code]

    if (handler) {
      throw handler(error)
    }
  }
  throw error
}

/*
 * se qualquer '&&' falhar pula pro throw error
 * isDatabaseError(error) - verifica se é erro do pg
 * isPgErrorCode(error.code) - verifica se é algum dos codigo SQLSTATE
 * map[error.code] - passa o code como chave e verifica se uma funcao foi
 * mapeada para esse código, se n, vira undefined e n passa do if
 * handler(error) é eu passando pra funcao o erro q vai ser usado
 * no mapeamento
 * pq : never? isso diz ao ts q essa funcao sempre lança (throw) alguma coisa
 */
