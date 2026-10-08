import jwt from 'jsonwebtoken'
import { createHash } from 'node:crypto'
import { ENV } from '../../../../config/env.js'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { UnauthorizedError } from '../../../../utils/errors.js'

import type { JwtPayload } from 'jsonwebtoken'

type AuthTokens = {
  accessToken: string
  refreshToken: string
  refreshTokenHash: string
}

export const createHashToken = (token: string): string =>
  createHash('sha256').update(token).digest('hex')

export function issueAuthTokens(userId: string): AuthTokens {
  const accessToken = jwt.sign({ id: userId }, ENV.ACCESS_TOKEN, { expiresIn: '15m' })
  const refreshToken = jwt.sign({ id: userId }, ENV.REFRESH_TOKEN, {
    expiresIn: '7d',
    algorithm: 'HS256',
    jwtid: randomUUID(),
  })

  const refreshTokenHash = createHashToken(refreshToken)

  return { accessToken, refreshToken, refreshTokenHash }
}

export const refreshTokenPayloadSchema = z.object({
  id: z.uuid({ version: 'v7' }),
})

export function verifyRefreshToken(token: string): string {
  let payload: string | JwtPayload

  try {
    payload = jwt.verify(token, ENV.REFRESH_TOKEN, { algorithms: ['HS256'] })
  } catch {
    throw new UnauthorizedError('refresh token inválido')
  }

  const parsedPayload = refreshTokenPayloadSchema.safeParse(payload)

  if (!parsedPayload.success) {
    throw new UnauthorizedError('payload do refresh token inválido')
  }

  return parsedPayload.data.id
}
