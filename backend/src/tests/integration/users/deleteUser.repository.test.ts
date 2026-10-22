import { describe, it, expect, beforeEach } from 'vitest'
import { uuidv7 } from 'uuidv7'
import { createUser } from '../../../routes/v1/modules/auth/auth.repository.js'
import {
  deleteAccount,
  getUserDataById,
} from '../../../routes/v1/modules/users/users.repository.js'
import { resetDatabase } from '../../resetDatabase.js'

//getPasswordHashById foi testada na updatePassword.repository

describe('deleteAccount', () => {
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

  it('deleta a conta com sucesso', async () => {
    await createUser(userFake)

    const deleted = await deleteAccount(idFake, 'hash-fake-123')

    expect(deleted).toBe(true)
    expect(await getUserDataById(idFake)).toBeUndefined()
  })

  it('não deleta a conta se o id estiver errado', async () => {
    await createUser(userFake)

    const deleted = await deleteAccount('01a15577-31b5-757e-9bb8-e186c7e0a0f1', 'hash-fake-123')

    expect(deleted).toBe(false)
    expect(await getUserDataById(idFake)).toMatchObject({ id: idFake })
  })

  it('não deleta a conta se a senha estiver errado', async () => {
    await createUser(userFake)

    const deleted = await deleteAccount(idFake, 'senha-errada')

    expect(deleted).toBe(false)
    expect(await getUserDataById(idFake)).toMatchObject({ id: idFake })
  })
})
