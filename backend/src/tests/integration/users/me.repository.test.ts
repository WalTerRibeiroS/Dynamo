import { describe, it, expect, beforeEach } from 'vitest'
import * as repository from '../../../routes/v1/modules/users/users.repository.js'
import { createUser } from '../../../routes/v1/modules/auth/auth.repository.js'
import { resetDatabase } from '../../resetDatabase.js'
import { uuidv7 } from 'uuidv7'

describe('getUserDataById', () => {
  beforeEach(async () => {
    await resetDatabase()
  })

  const idFake = uuidv7()
  const userFake = {
    id: idFake,
    username: 'walter123',
    email: 'walter@email.com',
    passwordHash: 'hash-fake-123',
    refreshTokenHash: 'refresh-hash-inicial',
  }

  it('retorna undefined quando não existe usuário com o uuidv7id fornecido', async () => {
    const userData = await repository.getUserDataById('01a15537-eb57-741c-8c8e-933bfb97b4ca')

    expect(userData).toBeUndefined()
  })

  it('retorna os dados quando o usuário existe', async () => {
    await createUser(userFake)

    const user = await repository.getUserDataById(idFake)

    expect(user).toEqual({
      id: userFake.id,
      username: userFake.username,
      email: userFake.email,
      theme: 'system',
      createdAt: expect.any(Date),
    })
  })
})
