import jwt from 'jsonwebtoken'
import { createHash } from 'node:crypto'
import { ENV } from '../../../../config/env.js'
import { randomUUID } from 'node:crypto'

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
