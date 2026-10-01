import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as repository from '../../../routes/v1/modules/auth/auth.repository.js'
import { issueAuthTokens } from '../../../routes/v1/modules/auth/auth.tokens.js'
import { logoutUser } from '../../../routes/v1/modules/auth/auth.service.js'
import { UnauthorizedError } from '../../../utils/errors.js'
import { log } from 'node:console'
import { promise } from 'zod'

vi.mock('../../../routes/v1/modules/auth/auth.repository.js')

describe('logoutUser', () => {
  const userId = '0190f0f0-7b1b-7c3a-8a5e-2f6d3c4b5a69'
  let storedHash: string | undefined

  beforeEach(() => {
    vi.resetAllMocks()
    storedHash = undefined

    vi.mocked(repository.clearRefreshTokenHash).mockImplementation(async (id, tokenHash) => {
      if (id === userId && tokenHash === storedHash) {
        storedHash = undefined
      }
    })
  })

  const startSession = () => {
    const tokens = issueAuthTokens(userId)
    storedHash = tokens.refreshTokenHash
    return tokens.refreshToken
  }

  it('não é feito o logout caso o cookie não seja fornecido', async () => {
    await Promise.all([await logoutUser(''), await logoutUser(undefined)])

    expect(repository.clearRefreshTokenHash).not.toHaveBeenCalled()
  })

  it('remove a sessão ativa quando o token é válido', async () => {
    const refreshToken = startSession()

    await logoutUser(refreshToken)

    expect(storedHash).toBeUndefined()
  })

  it('ignora token malformatado', async () => {
    await logoutUser('qualquer-token')

    expect(repository.clearRefreshTokenHash).not.toHaveBeenCalled()
  })
})
