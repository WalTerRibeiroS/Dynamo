import { describe, it, expect, beforeEach, vi } from 'vitest'

import * as repository from '../../../routes/v1/modules/users/users.repository.js'
import { deleteUser } from '../../../routes/v1/modules/users/users.service.js'
import { AppError, NotFoundError, ValidationError } from '../../../utils/errors.js'
import bcrypt from 'bcrypt'

vi.mock('../../../routes/v1/modules/users/users.repository.js')
vi.mock('bcrypt')

describe('deleteUser', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deleta o usuário com sucesso', async () => {
    vi.mocked(repository.getPasswordHashById).mockResolvedValue('senha-hash')
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never)
    vi.mocked(repository.deleteAccount).mockResolvedValue(true)

    await deleteUser('id', 'senha')

    expect(bcrypt.compare).toHaveBeenCalledWith('senha', 'senha-hash')
    expect(repository.deleteAccount).toHaveBeenCalledWith('id', 'senha-hash')
  })

  it('lança NotFoundError quando não é encontrado usuário no banco', async () => {
    vi.mocked(repository.getPasswordHashById).mockResolvedValue(undefined)

    await expect(deleteUser('id', 'senha')).rejects.toThrow(NotFoundError)
  })

  it('lança ValidationError quando a senha que está no banco é diferente da do input do usuário', async () => {
    vi.mocked(repository.getPasswordHashById).mockResolvedValue('senha-hash')
    vi.mocked(bcrypt.compare).mockResolvedValue(false as never)

    await expect(deleteUser('id', 'senha-errada')).rejects.toThrow(ValidationError)

    expect(bcrypt.compare).toHaveBeenCalledWith('senha-errada', 'senha-hash')
  })

  it('lança erro de concorrencia quando não foi possivel deletar a conta', async () => {
    vi.mocked(repository.getPasswordHashById).mockResolvedValue('senha-hash')
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never)
    vi.mocked(repository.deleteAccount).mockResolvedValue(false)

    await expect(deleteUser('id', 'senha')).rejects.toThrow(AppError)

    expect(bcrypt.compare).toHaveBeenCalledWith('senha', 'senha-hash')
    expect(repository.deleteAccount).toHaveBeenCalledWith('id', 'senha-hash')
  })
})
