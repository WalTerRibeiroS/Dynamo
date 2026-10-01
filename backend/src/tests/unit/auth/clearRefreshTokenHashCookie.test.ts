import { describe, it, expect, vi } from 'vitest'
import type { Response } from 'express'
import {
  clearRefreshTokenHashCookie,
  REFRESH_COOKIE_NAME,
  setRefreshTokenCookie,
} from '../../../routes/v1/modules/auth/auth.cookie.js'

describe('clearRefreshTokenHashCookie', () => {
  it('limpa o cookie de refresh token', () => {
    const res = {
      clearCookie: vi.fn(),
    } as unknown as Response

    clearRefreshTokenHashCookie(res)

    expect(res.clearCookie).toHaveBeenCalledTimes(1)

    expect(res.clearCookie).toHaveBeenCalledWith(
      REFRESH_COOKIE_NAME,
      expect.objectContaining({
        // só testa os importantes
        httpOnly: true,
        path: '/api/v1/auth',
      }),
    )
  })
})
