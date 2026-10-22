import { describe, it, expect, beforeEach } from 'vitest'
import { uuidv7 } from 'uuidv7'
import { createUser } from '../../../routes/v1/modules/auth/auth.repository.js'
import * as repository from '../../../routes/v1/modules/users/users.repository.js'
import { resetDatabase } from '../../resetDatabase.js'
import pool from '../../../config/db.js'

describe('users.repository.updatePassword (integração)', () => {
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

  describe('getPasswordHashById', () => {
    it('retorna o hash da senha que está no banco', async () => {
      await createUser(userFake)

      const passwordHash = await repository.getPasswordHashById(idFake)

      expect(passwordHash).toBe('hash-fake-123')
    })

    it('retorna undefined quando não é encontrado usuário com esse id no banco', async () => {
      await createUser(userFake)

      const passwordHash = await repository.getPasswordHashById(
        '01a15577-31b5-757e-9bb8-e186c7e0a0f1',
      )

      expect(passwordHash).toBeUndefined()
    })
  })

  describe('updatePassword', () => {
    it('atualiza a senha no banco para a nova senha', async () => {
      await createUser(userFake)

      const updatedPassword = await repository.updatePassword(
        idFake,
        'hash-fake-123',
        'AbacateLimao123',
      )

      expect(updatedPassword).toBe(true)
      expect(await repository.getPasswordHashById(idFake)).toBe('AbacateLimao123')
    })

    it('não atualiza a senha quando não é encontrado usuário válido', async () => {
      await createUser(userFake)

      const updatedPassword = await repository.updatePassword(
        '01a15577-31b5-757e-9bb8-e186c7e0a0f1',
        'hash-fake-123',
        'AbacateLimao123',
      )

      expect(updatedPassword).toBe(false)
      expect(await repository.getPasswordHashById(idFake)).not.toBe('AbacateLimao123')
    })

    it('atualiza updated_at junto com a senha', async () => {
      await createUser(userFake)

      const timestampAntigo = new Date('2000-01-01T00:00:00.000Z')

      await pool.query(`UPDATE users SET updated_at = $1 WHERE id = $2`, [timestampAntigo, idFake])

      await repository.updatePassword(idFake, 'hash-fake-123', 'AbacateLimao123')

      const { rows } = await pool.query<{ updatedAt: Date }>(
        `SELECT updated_at AS "updatedAt" FROM users WHERE id = $1`,
        [idFake],
      )

      expect(rows[0]?.updatedAt.getTime()).toBeGreaterThan(timestampAntigo.getTime())
    })
  })
})
