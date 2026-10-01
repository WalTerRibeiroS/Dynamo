import { describe, it, expect, vi, beforeEach } from 'vitest'
import { loginUser } from '../../../routes/v1/modules/auth/auth.service.js'
import * as repository from '../../../routes/v1/modules/auth/auth.repository.js'
import { issueAuthTokens } from '../../../routes/v1/modules/auth/auth.tokens.js'
import { ValidationError } from '../../../utils/errors.js'
import bcrypt from 'bcrypt'

vi.mock('../../../routes/v1/modules/auth/auth.repository.ts')
vi.mock('../../../routes/v1/modules/auth/auth.tokens.ts')
vi.mock('bcrypt')

describe('loginUser', () => {
  const validInput = {
    email: 'walter@email.com',
    password: 'Senha1234',
  }

  const userFake = {
    id: 'id-fake',
    passwordHash: 'passwordHash-fake',
  }

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('Cria novos tokens de acesso e refresh após o user ser autentificado', async () => {
    vi.mocked(repository.getUserByEmail).mockResolvedValue(userFake)

    vi.mocked(bcrypt.compare).mockResolvedValue(true as never)

    vi.mocked(issueAuthTokens).mockReturnValue({
      accessToken: 'access-fake',
      refreshToken: 'refresh-fake',
      refreshTokenHash: 'refresh-hash-fake',
    })

    vi.mocked(repository.saveNewRefreshToken).mockResolvedValue()

    const result = await loginUser(validInput)

    expect(result).toEqual({
      accessToken: 'access-fake',
      refreshToken: 'refresh-fake',
    })

    expect(bcrypt.compare).toHaveBeenCalledWith(validInput.password, userFake.passwordHash)

    expect(repository.getUserByEmail).toHaveBeenCalledWith(validInput.email)

    expect(repository.saveNewRefreshToken).toHaveBeenCalledWith('refresh-hash-fake', userFake.id)

    expect(issueAuthTokens).toHaveBeenCalledWith(userFake.id)
  })

  it('lança ValidationError quando não é encontrado user com o email forneceido', async () => {
    vi.mocked(repository.getUserByEmail).mockResolvedValue(undefined)

    await expect(loginUser(validInput)).rejects.toThrow(ValidationError)

    expect(repository.saveNewRefreshToken).not.toHaveBeenCalled()

    expect(bcrypt.compare).not.toHaveBeenCalled()
  })

  it('lança ValidationError quando a senha está incorreta', async () => {
    vi.mocked(repository.getUserByEmail).mockResolvedValue(userFake)
    vi.mocked(bcrypt.compare).mockResolvedValue(false as never)

    await expect(loginUser(validInput)).rejects.toThrow(ValidationError)

    expect(bcrypt.compare).toHaveBeenCalledWith(validInput.password, userFake.passwordHash)

    expect(repository.saveNewRefreshToken).not.toHaveBeenCalled()

    expect(issueAuthTokens).not.toHaveBeenCalled()
  })
})
