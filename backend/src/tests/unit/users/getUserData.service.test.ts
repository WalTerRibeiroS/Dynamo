import { describe, it, expect, beforeEach, vi } from 'vitest'

import * as repository from '../../../routes/v1/modules/users/users.repository.js'
import { getUserData } from '../../../routes/v1/modules/users/users.service.js'
import { NotFoundError } from '../../../utils/errors.js'

vi.mock('../../../routes/v1/modules/users/users.repository.js')

describe('getUserData', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('retorna os dados atualizados do usuário quando o id é válido', async () => {
    vi.mocked(repository.getUserDataById).mockResolvedValue({
      id: 'id-do-usuario-no-banco',
      username: 'user-fake',
      email: 'email-fake',
      theme: 'dark',
      createdAt: expect.any(Date),
    })

    const result = await getUserData('id-do-usuario-no-banco')

    expect(result).toMatchObject({
      id: 'id-do-usuario-no-banco',
      username: 'user-fake',
      email: 'email-fake',
      theme: 'dark',
      createdAt: expect.any(Date),
    })

    expect(repository.getUserDataById).toHaveBeenCalledWith('id-do-usuario-no-banco')
  })

  it('lança NotFoundError quando o repository não encontra o usuario', async () => {
    vi.mocked(repository.getUserDataById).mockResolvedValue(undefined)

    await expect(getUserData('qualquer-id')).rejects.toThrow(NotFoundError)
  })
})
