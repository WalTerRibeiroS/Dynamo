import { ENV } from '../../../../config/env.js'
import type { CookieOptions, Response } from 'express'

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