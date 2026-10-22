import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import app from '../../../app.js'
import * as repository from '../../../routes/v1/modules/auth/auth.repository.js'
import { resetDatabase } from '../../resetDatabase.js'
import { uuidv7 } from 'uuidv7'
import { issueAuthTokens } from '../../../routes/v1/modules/auth/auth.tokens.js'

describe('GET /api/v1/users/me (integração)', () => {
  const idFake = uuidv7()
  const { accessToken, refreshTokenHash } = issueAuthTokens(idFake)

  const userFake = {
    id: idFake,
    username: 'walter123',
    email: 'email@fake.com',
    passwordHash: 'senha-fake',
    refreshTokenHash: refreshTokenHash,
  }

  beforeEach(async () => {
    await resetDatabase()
  })

  it('retorna 200 junto com os dados do user', async () => {
    await repository.createUser(userFake)

    const response = await request(app)
      .get('/api/v1/users/me')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.status).toBe(200)

    expect(response.body.success).toBe(true)

    expect(response.body.data.user).toEqual({
      id: idFake,
      username: 'walter123',
      email: 'email@fake.com',
      theme: 'system',
      createdAt: expect.any(String),
    })
  })

  it('recusa usuário inexistente', async () => {
    const response = await request(app)
      .get('/api/v1/users/me')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.status).toBe(404)

    expect(response.body.success).toBe(false)
  })
})
