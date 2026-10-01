import { describe, it, expect, vi } from 'vitest'
import type { Response } from 'express'
import {
  setRefreshTokenCookie,
  REFRESH_COOKIE_NAME,
  REFRESH_COOKIE_OPTIONS,
} from '../../../routes/v1/modules/auth/auth.cookie.js'

describe('setRefreshTokenCookie', () => {
  it('seta o cookie com o nome e as opções configuradas', () => {
    const res = { cookie: vi.fn() } as unknown as Response

    setRefreshTokenCookie(res, 'meu-token')

    expect(res.cookie).toHaveBeenCalledTimes(1)
    expect(res.cookie).toHaveBeenCalledWith(
      REFRESH_COOKIE_NAME,
      'meu-token',
      REFRESH_COOKIE_OPTIONS,
    )
  })
})
