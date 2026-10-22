import { describe, it, expect, beforeEach, vi } from 'vitest'

import * as repository from '../../../routes/v1/modules/users/users.repository.js'
import { registerNewUsername } from '../../../routes/v1/modules/users/users.service.js'
import { NotFoundError } from '../../../utils/errors.js'

vi.mock('../../../routes/v1/modules/users/users.repository.js')

describe('registerNewUsername', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('retorna o username salvo pelo repository', async () => {
    vi.mocked(repository.getUserDataById).mockResolvedValue({
      id: 'n-importa',
      username: 'username-no-banco',
      email: 'fds',
      theme: 'dark',
      createdAt: expect.any(Date),
    })
    vi.mocked(repository.updateUsername).mockResolvedValue('username-salvo')

    const result = await registerNewUsername('n-importa', 'username-enviado')

    expect(result).toBe('username-salvo')
    expect(repository.updateUsername).toHaveBeenCalledWith('n-importa', 'username-enviado')
  })

  it('lança NotFoundError quando o repository não encontra o usuário', async () => {
    vi.mocked(repository.getUserDataById).mockResolvedValue(undefined)

    await expect(registerNewUsername('n-importa', 'qualquer')).rejects.toThrow(NotFoundError)
  })

  it('retorna o username atual caso o novo e o atual sejam iguais', async () => {
    vi.mocked(repository.getUserDataById).mockResolvedValue({
      id: 'n-importa',
      username: 'username-no-banco',
      email: 'fds',
      theme: 'dark',
      createdAt: expect.any(Date),
    })
    vi.mocked(repository.updateUsername).mockResolvedValue('username-no-banco')

    const result = await registerNewUsername('n-importa', 'username-no-banco')

    expect(result).toBe('username-no-banco')

    expect(repository.updateUsername).not.toHaveBeenCalled()
  })

  it('lança NotFoundError quando não é encontrado o id ao inserir o novo nome no banco', async () => {
    vi.mocked(repository.getUserDataById).mockResolvedValue({
      id: 'n-importa',
      username: 'username-no-banco',
      email: 'fds',
      theme: 'dark',
      createdAt: expect.any(Date),
    })
    vi.mocked(repository.updateUsername).mockResolvedValue(undefined)

    await expect(registerNewUsername('n-importa', 'qualquer')).rejects.toThrow(NotFoundError)
  })
})
