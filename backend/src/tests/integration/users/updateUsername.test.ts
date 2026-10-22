import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import app from '../../../app.js'
import * as repository from '../../../routes/v1/modules/auth/auth.repository.js'
import { resetDatabase } from '../../resetDatabase.js'
import { uuidv7 } from 'uuidv7'
import { issueAuthTokens } from '../../../routes/v1/modules/auth/auth.tokens.js'
import { getUserDataById } from '../../../routes/v1/modules/users/users.repository.js'

describe('PATCH /api/v1/users/me (integração)', () => {
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

  it('retorna 200 junto com o novo username', async () => {
    const response = await request(app)
      .patch('/api/v1/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ username: 'novo-username' })

    expect(response.status).toBe(200)

    expect(response.body.success).toBe(true)

    expect(response.body.data.username).toBe('novo-username')
  })

  it('retorna erro caso não seja encontrado o id fornecido no banco', async () => {
    const { accessToken: tokenFake } = issueAuthTokens('01a15562-1251-766d-b174-cc96982911fe')

    const response = await request(app)
      .patch('/api/v1/users/me')
      .set('Authorization', `Bearer ${tokenFake}`)
      .send({ username: 'novo-username' })

    expect(response.status).toBe(404)

    expect(response.body.success).toBe(false)
  })

  it('retorna erro quando o username já existe', async () => {
    await repository.createUser({
      id: '01a15ae0-f11b-708e-8067-50553cc54036',
      username: 'NomeLegal6767',
      email: 'diversao@gmail.com',
      passwordHash: 'senha-fake',
      refreshTokenHash: 'refreshTokenHash-fake',
    })

    const response = await request(app)
      .patch('/api/v1/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ username: 'NomeLegal6767' })

    expect(response.status).toBe(409)

    expect(response.body.success).toBe(false)

    expect(response.body.data).toBeUndefined()
  })

  it('permite apenas uma atualização quando usuários diferentes tentam usar o mesmo username ao mesmo tempo', async () => {
    const secondUserId = uuidv7()
    const { accessToken: secondUserAccessToken, refreshTokenHash: secondUserRefreshTokenHash } =
      issueAuthTokens(secondUserId)

    await repository.createUser({
      id: secondUserId,
      username: 'outro-usuario',
      email: 'outro-email@fake.com',
      passwordHash: 'senha-fake',
      refreshTokenHash: secondUserRefreshTokenHash,
    })

    const responses = await Promise.all([
      request(app)
        .patch('/api/v1/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ username: 'username-concorrente' }),
      request(app)
        .patch('/api/v1/users/me')
        .set('Authorization', `Bearer ${secondUserAccessToken}`)
        .send({ username: 'username-concorrente' }),
    ])

    expect(responses.map((response) => response.status).sort()).toEqual([200, 409])

    const users = await Promise.all([
      getUserDataById(idFake),
      getUserDataById(secondUserId),
    ])

    expect(users.filter((user) => user?.username === 'username-concorrente')).toHaveLength(1)
  })

  it('rejeita username mal formatado', async () => {
    const response = await request(app)
      .patch('/api/v1/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ username: 'caracteresEspeciais@#$@!!*&^' })

    expect(response.status).toBe(422)

    expect(response.body.success).toBe(false)
  })

  it('rejeita campo ausente', async () => {
    const response = await request(app)
      .patch('/api/v1/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.status).toBe(422)

    expect(response.body.success).toBe(false)
  })
})
