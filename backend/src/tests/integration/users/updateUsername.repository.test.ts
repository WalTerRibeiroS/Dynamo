import { describe, it, expect, beforeEach } from 'vitest'
import { uuidv7 } from 'uuidv7'
import { createUser } from '../../../routes/v1/modules/auth/auth.repository.js'
import { updateUsername } from '../../../routes/v1/modules/users/users.repository.js'
import { resetDatabase } from '../../resetDatabase.js'
import pool from '../../../config/db.js'

//getUserDataById foi testada na me.test.ts

describe('updateUsername', () => {
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

  it('retorna o novo username quando username é atualizado', async () => {
    await createUser(userFake)

    const newUsername = await updateUsername(idFake, 'novo-username')

    expect(newUsername).toBe('novo-username')
  })

  it('retorna undefined quando não existe o id no banco', async () => {
    await createUser(userFake)

    const newUsername = await updateUsername(
      '01a15577-31b5-757e-9bb8-e186c7e0a0f1',
      'novo-username',
    )

    expect(newUsername).toBeUndefined()
  })

  it('rejeita com erro de unique_violation quando o username já existe', async () => {
    await createUser({
      id: uuidv7(),
      username: 'walter',
      email: 'email.fds@gmail.com',
      passwordHash: 'hash-fake',
      refreshTokenHash: 'refresh-hash-fake',
    })

    await createUser(userFake)

    await expect(updateUsername(idFake, 'walter')).rejects.toMatchObject({
      code: 'USERNAME_ALREADY_EXISTS',
      publicDetails: { field: 'username' },
      statusCode: 409,
    })
  })

  it('atualiza updated_at junto com o username', async () => {
    await createUser(userFake)

    const timestampAntigo = new Date('2000-01-01T00:00:00.000Z')

    await pool.query(`UPDATE users SET updated_at = $1 WHERE id = $2`, [timestampAntigo, idFake])

    await updateUsername(idFake, 'novo-username')

    const { rows } = await pool.query<{ updatedAt: Date }>(
      `SELECT updated_at AS "updatedAt" FROM users WHERE id = $1`,
      [idFake],
    )

    expect(rows[0]?.updatedAt.getTime()).toBeGreaterThan(timestampAntigo.getTime())
  })
})
