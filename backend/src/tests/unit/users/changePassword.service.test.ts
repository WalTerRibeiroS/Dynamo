import { describe, it, expect, beforeEach, vi } from 'vitest'

import * as repository from '../../../routes/v1/modules/users/users.repository.js'
import { changePassword } from '../../../routes/v1/modules/users/users.service.js'
import { AppError, NotFoundError, ValidationError } from '../../../utils/errors.js'
import bcrypt from 'bcrypt'

vi.mock('../../../routes/v1/modules/users/users.repository.js')
vi.mock('bcrypt')

describe('changePassword', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('altera a senha com sucesso', async () => {
    vi.mocked(repository.getPasswordHashById).mockResolvedValue('senha-atual-hash')
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never)
    vi.mocked(bcrypt.hash).mockResolvedValue('nova-senha-hash' as never)
    vi.mocked(repository.updatePassword).mockResolvedValue(true)

    await changePassword('id', 'senha-atual', 'nova-senha')

    expect(bcrypt.compare).toHaveBeenCalledWith('senha-atual', 'senha-atual-hash')
    expect(repository.updatePassword).toHaveBeenCalledWith(
      'id',
      'senha-atual-hash',
      'nova-senha-hash',
    )
  })

  it('lança NotFoundError quando não é encontrado usuário no banco', async () => {
    vi.mocked(repository.getPasswordHashById).mockResolvedValue(undefined)

    await expect(changePassword('id', 'senha-atual', 'nova-senha')).rejects.toThrow(NotFoundError)
  })

  it('lança ValidationError quando a senha que está no banco é diferente da do input do usuário', async () => {
    vi.mocked(repository.getPasswordHashById).mockResolvedValue('senha-atual-hash')
    vi.mocked(bcrypt.compare).mockResolvedValue(false as never)

    await expect(changePassword('id', 'senha-errada', 'nova-senha')).rejects.toThrow(
      ValidationError,
    )

    expect(bcrypt.compare).toHaveBeenCalledWith('senha-errada', 'senha-atual-hash')
  })

  it('lança ValidationError quando a senha nova é igual a atual', async () => {
    vi.mocked(repository.getPasswordHashById).mockResolvedValue('senha-atual-hash')
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never)

    await expect(changePassword('id', 'senha-atual', 'senha-atual')).rejects.toThrow(
      ValidationError,
    )

    expect(bcrypt.compare).toHaveBeenCalledWith('senha-atual', 'senha-atual-hash')
  })

  it('lança erro de concorrencia quando não foi possivel atualizar a senha', async () => {
    vi.mocked(repository.getPasswordHashById).mockResolvedValue('senha-atual-hash')
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never)
    vi.mocked(bcrypt.hash).mockResolvedValue('nova-senha-hash' as never)
    vi.mocked(repository.updatePassword).mockResolvedValue(false)

    await expect(changePassword('id', 'senha-atual', 'nova-senha')).rejects.toThrow(AppError)

    expect(bcrypt.compare).toHaveBeenCalledWith('senha-atual', 'senha-atual-hash')
    expect(repository.updatePassword).toHaveBeenCalledWith(
      'id',
      'senha-atual-hash',
      'nova-senha-hash',
    )
  })
})
