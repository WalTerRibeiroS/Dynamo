import { describe, it, expect, beforeEach, vi } from 'vitest'

import * as repository from '../../../routes/v1/modules/users/users.repository.js'
import { changeSettings } from '../../../routes/v1/modules/users/users.service.js'
import { NotFoundError } from '../../../utils/errors.js'

vi.mock('../../../routes/v1/modules/users/users.repository.js')

describe('changeSettings', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('retorna o theme salvo pelo repository', async () => {
    vi.mocked(repository.getUserDataById).mockResolvedValue({
      id: 'n-importa',
      username: 'username-no-banco',
      email: 'fds',
      theme: 'dark',
      createdAt: expect.any(Date),
    })
    vi.mocked(repository.updateSettings).mockResolvedValue('light')

    const result = await changeSettings('n-importa', 'system')

    expect(result).toBe('light')
    expect(repository.updateSettings).toHaveBeenCalledWith('n-importa', 'system')
  })

  it('rejeita quando não tem dados no banco', async () => {
    vi.mocked(repository.getUserDataById).mockResolvedValue(undefined)

    await expect(changeSettings('user-id', 'dark')).rejects.toThrow(NotFoundError)
  })

  it('retorna o theme atual caso o novo e o atual sejam iguais', async () => {
    vi.mocked(repository.getUserDataById).mockResolvedValue({
      id: 'n-importa',
      username: 'username-no-banco',
      email: 'fds',
      theme: 'dark',
      createdAt: expect.any(Date),
    })
    vi.mocked(repository.updateSettings).mockResolvedValue('dark')

    const result = await changeSettings('n-importa', 'dark')

    expect(result).toBe('dark')

    expect(repository.updateSettings).not.toHaveBeenCalled()
  })

  it('lança NotFoundError quando não é encontrado o id ao inserir o novo theme no banco', async () => {
    vi.mocked(repository.getUserDataById).mockResolvedValue({
      id: 'n-importa',
      username: 'username-no-banco',
      email: 'fds',
      theme: 'dark',
      createdAt: expect.any(Date),
    })
    vi.mocked(repository.updateSettings).mockResolvedValue(undefined)

    await expect(changeSettings('n-importa', 'light')).rejects.toThrow(NotFoundError)
  })
})
