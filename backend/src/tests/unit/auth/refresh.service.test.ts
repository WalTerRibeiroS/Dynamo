import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as repository from '../../../routes/v1/modules/auth/auth.repository.js'
import { issueAuthTokens } from '../../../routes/v1/modules/auth/auth.tokens.js'
import { refreshSession } from '../../../routes/v1/modules/auth/auth.service.js'
import { UnauthorizedError } from '../../../utils/errors.js'

vi.mock('../../../routes/v1/modules/auth/auth.repository.js')

describe('refreshSession', () => {
  const userId = '0190f0f0-7b1b-7c3a-8a5e-2f6d3c4b5a69' // uuidv7 válido
  let storedHash: string | undefined

  beforeEach(() => {
    vi.resetAllMocks()
    storedHash = undefined

    // repository vira um "banco em memória" simples

    vi.mocked(repository.rotateRefreshTokenHash).mockImplementation(
      async (id, oldhash, newHash) => {
        if (id !== userId || storedHash !== oldhash) {
          return false
        }

        storedHash = newHash
        return true
      },
    )
  })

  // simula um login: gera tokens reais e guarda o hash no "banco"
  const startSession = () => {
    const tokens = issueAuthTokens(userId)
    storedHash = tokens.refreshTokenHash
    return tokens.refreshToken
  }

  it('emite novos tokens quando o refresh token é válido', async () => {
    const oldRefresh = startSession()

    const result = await refreshSession(oldRefresh)

    expect(result.accessToken).toEqual(expect.any(String))
    expect(result.refreshToken).not.toBe(oldRefresh)
  })

  it('invalida o refresh token antigo após a rotação', async () => {
    const oldRefresh = startSession()

    await refreshSession(oldRefresh)

    await expect(refreshSession(oldRefresh)).rejects.toThrow(UnauthorizedError)
  })

  it('rejeita quando não há sessão ativa', async () => {
    const refresh = startSession()
    storedHash = undefined

    await expect(refreshSession(refresh)).rejects.toThrow(UnauthorizedError)
  })

  it('rejeita um token malformado', async () => {
    await expect(refreshSession('lixo')).rejects.toThrow(UnauthorizedError)
  })
})
