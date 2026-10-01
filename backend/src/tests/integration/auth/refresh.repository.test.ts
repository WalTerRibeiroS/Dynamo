import { describe, it, expect, beforeEach } from 'vitest'
import * as repository from '../../../routes/v1/modules/auth/auth.repository.js'
import { resetDatabase } from '../../resetDatabase.js'

import { uuidv7 } from 'uuidv7'

const seedUser = async (refreshTokenHash: string) => {
  const id = uuidv7()
  await repository.createUser({
    id,
    username: 'walter',
    email: 'walter@email.com',
    passwordHash: 'hash-fake',
    refreshTokenHash,
  })
  return id
}

describe('auth.refresh.repository (integração)', () => {
  beforeEach(async () => {
    await resetDatabase()
  })

  it('troca o hash quando o hash antigo confere', async () => {
    const id = await seedUser('hash-a')

    const rotated = await repository.rotateRefreshTokenHash(id, 'hash-a', 'hash-b')

    expect(rotated).toBe(true)
  })

  it('não troca quando o hash antigo não confere', async () => {
    const id = await seedUser('hash-a')

    const rotated = await repository.rotateRefreshTokenHash(id, 'outro', 'hash-b')

    expect(rotated).toBe(false)
  })

  it('só uma de duas rotações simultâneas com o mesmo hash antigo vence', async () => {
    const id = await seedUser('hash-a')

    const results = await Promise.all([
      repository.rotateRefreshTokenHash(id, 'hash-a', 'hash-b'),
      repository.rotateRefreshTokenHash(id, 'hash-a', 'hash-c'),
    ])

    expect(results.filter(Boolean)).toHaveLength(1)
  })
})
