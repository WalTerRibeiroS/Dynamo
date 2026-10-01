import { z } from 'zod'
import jwt from 'jsonwebtoken'
import { ENV } from '../../../../config/env.js'
import { UnauthorizedError } from '../../../../utils/errors.js'

import type { CookieOptions, Response } from 'express'
import type { JwtPayload } from 'jsonwebtoken'

const isProd = ENV.NODE_ENV === 'production'

export const REFRESH_COOKIE_NAME = 'refreshToken'

export const REFRESH_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
  path: '/api/v1/auth',
}

export function setRefreshTokenCookie(res: Response, refreshToken: string): void {
  res.cookie(REFRESH_COOKIE_NAME, refreshToken, REFRESH_COOKIE_OPTIONS)
}

export function clearRefreshTokenHashCookie(res: Response): void {
  res.clearCookie(REFRESH_COOKIE_NAME, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/api/v1/auth',
  })
}

const refreshTokenPayloadSchema = z.object({
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
