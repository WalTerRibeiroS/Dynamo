import rateLimit from 'express-rate-limit'
import type { Options, RateLimitInfo } from 'express-rate-limit'
import type { Request, NextFunction } from 'express'
import { TooManyRequestsError } from '../utils/errors.js'

type LimiterConfig = Pick<Partial<Options>, 'windowMs' | 'limit'> & {
  windowMs: number
  limit: number
}

/*
 * ===== Justificando a complexidade do tipo 'LimiterConfig' ===========
 *
 * Options: Options é o tipo nativo da lib de rate limit é ele quem carrega
 * todas as opcoes como windowMs, limit...
 *
 * Partial: usado aqui para transformar todos os campos do Options em  opcionais
 *
 * Pick: usado aqui apenas para pegar o windowMs e o limit do Options nada mais
 *
 * Uso '&' para fazer uma nova interseção, como ambos possuem a mesma chave
 * o tipo que é mais restrito subscreve o outro
 *
 * depois eu infiro que windowMs e limit é number e obrigatório
 *
 * ===== prevencao de erro no 'req.rateLimit?.resetTime' ===============
 *
 * como a lib de rate limiting injeta no 'req' a propriedade 'rateLimit'
 * mas o ts n a reconhece fica dando erro, por isso eu injeto com interseção
 * o tipo 'RateLimitInfo' nativo da lib
 * caso o projeto cresça e eu precise usar isso alem desse arquivo
 * o ideal é eu fazer um declaration merging global na 'Request' com 'RateLimitInfo'
 *
 * =====================================================================
 */

export function createLimiter({ windowMs, limit }: LimiterConfig) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: true,
    legacyHeaders: false,

    handler: (req: Request & { rateLimit?: RateLimitInfo }, _, next: NextFunction) => {
      const resetTime = req.rateLimit?.resetTime

      const retryAfterSeconds = resetTime
        ? Math.max(1, Math.ceil((resetTime.getTime() - Date.now()) / 1000))
        : Math.ceil(windowMs / 1000)

      next(new TooManyRequestsError(retryAfterSeconds))
    },
  })
}
