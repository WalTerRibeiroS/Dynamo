import { describe, it, expect, beforeEach } from 'vitest'
import * as repository from '../../../routes/v1/modules/auth/auth.repository.js'
import { resetDatabase } from '../../resetDatabase.js'

import { uuidv7 } from 'uuidv7'

const seedUser = async (refreshTokenHash: string) => {
  const id = uuidv7()
  await repository.createUser({
    id,
    username: `user-${id.slice(-8)}`,
    email: `${id}@email.com`,
    passwordHash: 'hash-fake',
    refreshTokenHash,
  })
  return id
}

describe('auth.logout.repository (integração)', () => {
  beforeEach(async () => {
    await resetDatabase()
  })

  it('limpa o hash quando o id e o hash do cookie conferem', async () => {
    const id = await seedUser('hash-a')

    await repository.clearRefreshTokenHash(id, 'hash-a')

    expect(await repository.getRefreshTokenHashById(id)).toBeNull()
  })

  it('não limpa quando o hash enviado não confere', async () => {
    const id = await seedUser('hash-a')

    await repository.clearRefreshTokenHash(id, 'hash-antigo')

    expect(await repository.getRefreshTokenHashById(id)).toBe('hash-a')
  })

  it('não afeta outros usuários', async () => {
    const idA = await seedUser('hash-a')
    const idB = await seedUser('hash-b')

    await repository.clearRefreshTokenHash(idA, 'hash-a')

    expect(await repository.getRefreshTokenHashById(idB)).toBe('hash-b')
  })

  it('não lança erro quando o usuário não existe (idempotente', async () => {
    await expect(repository.clearRefreshTokenHash(uuidv7(), 'qualquer')).resolves.toBeUndefined()
  })
})
