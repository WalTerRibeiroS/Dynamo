import { describe, it, expect, beforeEach } from 'vitest'
import * as repository from '../../../routes/v1/modules/users/users.repository.js'
import { createUser } from '../../../routes/v1/modules/auth/auth.repository.js'
import { resetDatabase } from '../../resetDatabase.js'
import { uuidv7 } from 'uuidv7'
import pool from '../../../config/db.js'
import type { UserTheme } from '../../../types/user.js'

describe('updateSettings', () => {
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

  it('retorna o novo theme quando username é atualizado', async () => {
    await createUser(userFake)

    const newTheme = await repository.updateSettings(idFake, 'dark')

    expect(newTheme).toBe('dark')
  })

  it('retorna undefined quando não existe o id no banco', async () => {
    await createUser(userFake)

    const newTheme = await repository.updateSettings('01a15577-31b5-757e-9bb8-e186c7e0a0f1', 'dark')

    expect(newTheme).toBeUndefined()
  })

  it('rejeita com erro de check_violation quando o theme não existe no grupo determinado', async () => {
    await createUser(userFake)

    await expect(
      repository.updateSettings(idFake, 'blue' as UserTheme), //uso do 'as' apenas para n dar erro no compilador e eu realmente conseguir testar
    ).rejects.toMatchObject({
      statusCode: 409,
      code: 'THEME_NOT_ALLOWED',
      publicDetails: { field: 'theme' },
    })
  })

  it('atualiza updated_at junto com o theme', async () => {
    await createUser(userFake)

    const timestampAntigo = new Date('2000-01-01T00:00:00.000Z')

    await pool.query(`UPDATE users SET updated_at = $1 WHERE id = $2`, [timestampAntigo, idFake])

    await repository.updateSettings(idFake, 'dark')

    const { rows } = await pool.query<{ updatedAt: Date }>(
      `SELECT updated_at AS "updatedAt" FROM users WHERE id = $1`,
      [idFake],
    )

    expect(rows[0]?.updatedAt.getTime()).toBeGreaterThan(timestampAntigo.getTime())
  })
})
