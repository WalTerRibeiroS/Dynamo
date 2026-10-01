import { describe, it, expect, beforeEach } from 'vitest'
import { uuidv7 } from 'uuidv7'
import * as repository from '../../../routes/v1/modules/auth/auth.repository.js'
import { resetDatabase } from '../../resetDatabase.js'

describe('auth.register.repository (integração)', () => {
  beforeEach(async () => {
    await resetDatabase()
  })

  describe('emailExists', () => {
    it('retorna false quando não existe usuário com esse email', async () => {
      const exists = await repository.emailExists('ninguem@gmail.com')
      expect(exists).toBe(false)
    })

    it('retorna true depois que o usuário é criado com um email que não está em uso', async () => {
      await repository.createUser({
        id: uuidv7(),
        username: 'walter',
        email: 'walter@email.com',
        passwordHash: 'hash-fake',
        refreshTokenHash: 'refresh-hash-fake',
      })

      const exists = await repository.emailExists('walter@email.com')
      expect(exists).toBe(true)
    })
  })

  describe('createUser', () => {
    it('insere o usuário e retorna apenas id e username', async () => {
      const id = uuidv7()

      const created = await repository.createUser({
        id: id,
        username: 'walter',
        email: 'walter@email.com',
        passwordHash: 'hash-fake',
        refreshTokenHash: 'refresh-hash-fake',
      })

      expect(created).toEqual({
        id,
        username: 'walter',
      })
      expect(created).not.toHaveProperty('password_hash')
    })

    it('rejeita com erro de unique_violation quando o email já existe', async () => {
      const emailDuplicado = 'walter@email.com'
      await repository.createUser({
        id: uuidv7(),
        username: 'walter',
        email: emailDuplicado,
        passwordHash: 'hash-fake',
        refreshTokenHash: 'refresh-hash-fake',
      })

      await expect(
        repository.createUser({
          id: uuidv7(),
          username: 'outrousuario',
          email: emailDuplicado,
          passwordHash: 'hash-fake',
          refreshTokenHash: 'refresh-hash-fake',
        }),
      ).rejects.toMatchObject({ code: 'DUPLICATE_FIELD' })
    })
  })
})
