import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import app from '../../../app.js'
import * as repository from '../../../routes/v1/modules/auth/auth.repository.js'
import { resetDatabase } from '../../resetDatabase.js'
import { uuidv7 } from 'uuidv7'
import { issueAuthTokens } from '../../../routes/v1/modules/auth/auth.tokens.js'

describe('PATCH /api/v1/users/me/settings (integração)', () => {
  const idFake = uuidv7()
  const { accessToken, refreshTokenHash } = issueAuthTokens(idFake)

  beforeEach(async () => {
    await resetDatabase()

    await repository.createUser({
      id: idFake,
      username: 'walter123',
      email: 'email@fake.com',
      passwordHash: 'senha-fake',
      refreshTokenHash: refreshTokenHash,
    })
  })

  it('retorna 200 junto com o novo theme', async () => {
    const response = await request(app)
      .patch('/api/v1/users/me/settings')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ theme: 'dark' })

    expect(response.status).toBe(200)

    expect(response.body.success).toBe(true)

    expect(response.body.data.theme).toBe('dark')
  })

  it('retorna erro caso não seja encontrado o id fornecido no banco', async () => {
    const { accessToken: tokenFake } = issueAuthTokens('01a15562-1251-766d-b174-cc96982911fe')

    const response = await request(app)
      .patch('/api/v1/users/me/settings')
      .set('Authorization', `Bearer ${tokenFake}`)
      .send({ theme: 'dark' })

    expect(response.status).toBe(404)

    expect(response.body.success).toBe(false)
  })

  it('rejeita theme inexistente', async () => {
    const response = await request(app)
      .patch('/api/v1/users/me/settings')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ theme: 'blue' })

    expect(response.status).toBe(422)

    expect(response.body.success).toBe(false)
  })

  it('rejeita corpo ausente', async () => {
    const response = await request(app)
      .patch('/api/v1/users/me/settings')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.status).toBe(422)

    expect(response.body.success).toBe(false)
  })
})
