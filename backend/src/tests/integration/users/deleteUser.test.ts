import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import app from '../../../app.js'
import { createUser } from '../../../routes/v1/modules/auth/auth.repository.js'
import * as repository from '../../../routes/v1/modules/users/users.repository.js'
import { resetDatabase } from '../../resetDatabase.js'
import { uuidv7 } from 'uuidv7'
import { issueAuthTokens } from '../../../routes/v1/modules/auth/auth.tokens.js'
import bcrypt from 'bcrypt'
import { REFRESH_COOKIE_NAME } from '../../../routes/v1/modules/auth/auth.cookie.js'

const getSetCookie = (response: request.Response, name: string) => {
  const raw = response.get('Set-Cookie')?.find((cookie) => cookie.startsWith(`${name}=`))

  if (!raw) throw new Error(`Cookie ${name} não veio na resposta`)

  const cookiePair = raw.split(';')[0]
  if (!cookiePair) throw new Error(`Cookie ${name} veio vazio na resposta`)

  return { raw, value: cookiePair.slice(name.length + 1) }
}

describe('DELETE /api/v1/users/me (integração)', () => {
  const idFake = uuidv7()
  const { accessToken, refreshTokenHash, refreshToken } = issueAuthTokens(idFake)

  beforeEach(async () => {
    await resetDatabase()
    const passwordHash = await bcrypt.hash('senhaBoa123', 10)

    await createUser({
      id: idFake,
      username: 'walter123',
      email: 'email@fake.com',
      passwordHash: passwordHash,
      refreshTokenHash: refreshTokenHash,
    })
  })

  // no futuro quando eu tiver mais tabelas vai ser necessario adicionar nesse teste
  // se os outros dados em outras tabelas foi deletado tbm em cascata
  it('deleta a conta com sucesso e apaga o cookie do navegador', async () => {
    const response = await request(app)
      .delete('/api/v1/users/me')
      .set('Cookie', `${REFRESH_COOKIE_NAME}=${refreshToken}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ password: 'senhaBoa123' })

    expect(response.status).toBe(200)

    expect(response.body.success).toBe(true)

    const { raw, value } = getSetCookie(response, REFRESH_COOKIE_NAME)

    expect(raw).toMatch(/HttpOnly/i)
    expect(raw).toContain('Path=/api/v1/auth')
    expect(value).toBe('')

    expect(await repository.getUserDataById(idFake)).toBeUndefined()
  })

  it('não deleta a conta e nem apaga o cookie do navegador se a senha estiver errada', async () => {
    const response = await request(app)
      .delete('/api/v1/users/me')
      .set('Cookie', `${REFRESH_COOKIE_NAME}=${refreshToken}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ password: 'senhaErrada123' })

    expect(response.status).toBe(422)

    expect(response.body.success).toBe(false)

    expect(await repository.getUserDataById(idFake)).toMatchObject({ id: idFake })

    const setCookies = response.get('Set-Cookie') ?? []

    expect(setCookies.some((cookie) => cookie.startsWith(`${REFRESH_COOKIE_NAME}=`))).toBe(false)
  })

  it('só uma de duas requisições simultâneas vence', async () => {
    // duas requisições iguais
    const responses = await Promise.all([
      request(app)
        .delete('/api/v1/users/me')
        .set('Cookie', `${REFRESH_COOKIE_NAME}=${refreshToken}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ password: 'senhaBoa123' }),

      request(app)
        .delete('/api/v1/users/me')
        .set('Cookie', `${REFRESH_COOKIE_NAME}=${refreshToken}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ password: 'senhaBoa123' }),
    ])

    expect(responses.map((response) => response.status).sort()).toEqual([200, 409])
  })

  it('rejeita senha quando vem mal formatada', async () => {
    const response = await request(app)
      .delete('/api/v1/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ password: '' })

    expect(response.status).toBe(422)

    expect(response.body.success).toBe(false)
  })

  it('rejeita quando vem corpo ausente', async () => {
    const response = await request(app)
      .delete('/api/v1/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.status).toBe(422)

    expect(response.body.success).toBe(false)
  })
})
