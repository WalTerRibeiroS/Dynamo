import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import app from '../../../app.js'
import * as repository from '../../../routes/v1/modules/auth/auth.repository.js'
import { resetDatabase } from '../../resetDatabase.js'
import { uuidv7 } from 'uuidv7'
import { issueAuthTokens } from '../../../routes/v1/modules/auth/auth.tokens.js'
import bcrypt from 'bcrypt'
import { REFRESH_COOKIE_NAME } from '../../../routes/v1/modules/auth/auth.cookie.js'
import { getPasswordHashById } from '../../../routes/v1/modules/users/users.repository.js'

const getSetCookie = (response: request.Response, name: string) => {
  const raw = response.get('Set-Cookie')?.find((cookie) => cookie.startsWith(`${name}=`))

  if (!raw) throw new Error(`Cookie ${name} não veio na resposta`)

  const cookiePair = raw.split(';')[0]
  if (!cookiePair) throw new Error(`Cookie ${name} veio vazio na resposta`)

  return { raw, value: cookiePair.slice(name.length + 1) }
}

describe('PATCH /api/v1/users/me/password (integração)', () => {
  const idFake = uuidv7()
  const { accessToken, refreshTokenHash, refreshToken } = issueAuthTokens(idFake)

  beforeEach(async () => {
    await resetDatabase()
    const passwordHash = await bcrypt.hash('senhaBoa123', 10)

    await repository.createUser({
      id: idFake,
      username: 'walter123',
      email: 'email@fake.com',
      passwordHash: passwordHash,
      refreshTokenHash: refreshTokenHash,
    })
  })

  it('apaga o cookie e o refreshTokenHash do banco e troca a senha', async () => {
    const response = await request(app)
      .patch('/api/v1/users/me/password')
      .set('Cookie', `${REFRESH_COOKIE_NAME}=${refreshToken}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        currentPassword: 'senhaBoa123',
        newPassword: 'BatatoFrita15',
      })

    expect(response.status).toBe(200)

    expect(response.body.success).toBe(true)

    const { raw, value } = getSetCookie(response, REFRESH_COOKIE_NAME)

    expect(raw).toMatch(/HttpOnly/i)
    expect(raw).toContain('Path=/api/v1/auth')
    expect(value).toBe('')

    expect(await repository.getRefreshTokenHashById(idFake)).toBeNull()

    const newPasswordHash = await getPasswordHashById(idFake)

    expect(await bcrypt.compare('BatatoFrita15', newPasswordHash as string)).toBe(true) // 'as string' só pro compilador n encher o saco, mas aqui é safe usar 'as'
  })

  it('lança ValidationError quando a senha está incorreta', async () => {
    const response = await request(app)
      .patch('/api/v1/users/me/password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        currentPassword: 'senhaErrada123',
        newPassword: 'BatatoFrita15',
      })

    expect(response.status).toBe(422)

    expect(response.body.success).toBe(false)
  })

  it('lança ValidationError quando a senha nova é igual a antiga', async () => {
    const response = await request(app)
      .patch('/api/v1/users/me/password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        currentPassword: 'senhaBoa123',
        newPassword: 'senhaBoa123',
      })

    expect(response.status).toBe(422)

    expect(response.body.success).toBe(false)
  })

  it('só uma de duas requisições simultâneas vence', async () => {
    // duas requisições iguais
    const responses = await Promise.all([
      request(app)
        .patch('/api/v1/users/me/password')
        .set('Cookie', `${REFRESH_COOKIE_NAME}=${refreshToken}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          currentPassword: 'senhaBoa123',
          newPassword: 'BatatoFrita15',
        }),

      request(app)
        .patch('/api/v1/users/me/password')
        .set('Cookie', `${REFRESH_COOKIE_NAME}=${refreshToken}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          currentPassword: 'senhaBoa123',
          newPassword: 'BatatoFrita15',
        }),
    ])

    expect(responses.map((response) => response.status).sort()).toEqual([200, 409])
  })

  it('rejeita quando a nova senha vem malformatada', async () => {
    const response = await request(app)
      .patch('/api/v1/users/me/password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        currentPassword: 'senhaBoa123',
        newPassword: 'senhanormal',
      })

    expect(response.status).toBe(422)

    expect(response.body.success).toBe(false)
  })

  it('rejeita quando vem com cambos ausentes', async () => {
    const response = await request(app)
      .patch('/api/v1/users/me/password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.status).toBe(422)

    expect(response.body.success).toBe(false)
  })

  it('faz login com a nova senha', async () => {
    await request(app)
      .patch('/api/v1/users/me/password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        currentPassword: 'senhaBoa123',
        newPassword: 'BatatoFrita15',
      })

    const login = await request(app).post('/api/v1/auth/login').send({
      email: 'email@fake.com',
      password: 'BatatoFrita15',
    })

    expect(login.status).toBe(200)

    expect(login.body.success).toBe(true)
  })

  it('rejeita renovação da sessão após mudar a senha', async () => {
    await request(app)
      .patch('/api/v1/users/me/password')
      .set('Cookie', `${REFRESH_COOKIE_NAME}=${refreshToken}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        currentPassword: 'senhaBoa123',
        newPassword: 'BatatoFrita15',
      })

    const refresh = await request(app)
      .post('/api/v1/auth/refresh')
      .set('Cookie', `${REFRESH_COOKIE_NAME}=${refreshToken}`)

    expect(refresh.status).toBe(401)

    expect(refresh.body.success).toBe(false)
  })
})
