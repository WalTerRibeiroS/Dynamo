import { describe, it, expect, beforeEach } from 'vitest'
import { uuidv7 } from 'uuidv7'
import * as repository from '../../../routes/v1/modules/auth/auth.repository.js'
import { resetDatabase } from '../../resetDatabase.js'
import pool from '../../../config/db.js'

describe('auth.login.repository (integração)', () => {
  beforeEach(async () => {
    await resetDatabase()
  })

  const userFake = {
    id: uuidv7(),
    username: 'walter123',
    email: 'walter@email.com',
    passwordHash: 'hash-fake-123',
    refreshTokenHash: 'refresh-hash-inicial',
  }

  describe('getUserByEmail', () => {
    it('retorna undefined quando não existe usuário com o email fornecido', async () => {
      const user = await repository.getUserByEmail('naoexiste@email.com')

      expect(user).toBeUndefined()
    })

    it('retorna id e passwordHash quando o usuário com o email existe', async () => {
      await repository.createUser(userFake)

      const user = await repository.getUserByEmail(userFake.email)

      expect(user).toEqual({
        id: userFake.id,
        passwordHash: userFake.passwordHash,
      })
    })
  })

  describe('saveNewRefreshToken', () => {
    it('atualiza o refresh_token_hash do usuário no banco', async () => {
      await repository.createUser(userFake)

      const novoRefreshTokenHash = 'novo-refresh-token-hash'

      await repository.saveNewRefreshToken(novoRefreshTokenHash, userFake.id)

      const res = await pool.query(`SELECT refresh_token_hash FROM users WHERE id = $1`, [
        userFake.id,
      ])

      expect(res.rows[0].refresh_token_hash).toBe(novoRefreshTokenHash)
    })
  })
})
