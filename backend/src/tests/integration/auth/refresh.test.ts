import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { uuidv7 } from 'uuidv7'

import app from '../../../app.js'
import * as repository from '../../../routes/v1/modules/auth/auth.repository.js'
import { issueAuthTokens } from '../../../routes/v1/modules/auth/auth.tokens.js'
import { REFRESH_COOKIE_NAME } from '../../../routes/v1/modules/auth/auth.cookie.js'
import { resetDatabase } from '../../resetDatabase.js'

const getSetCookie = (response: request.Response, name: string) => {
  const raw = response.get('Set-Cookie')?.find((cookie) => cookie.startsWith(`${name}=`))

  if (!raw) throw new Error(`Cookie ${name} não veio na resposta`)

  const cookiePair = raw.split(';')[0]
  if (!cookiePair) throw new Error(`Cookie ${name} veio vazio na resposta`)

  return { raw, value: cookiePair.slice(name.length + 1) }
}

const refreshWith = (token: string) =>
  request(app).post('/api/v1/auth/refresh').set('Cookie', `${REFRESH_COOKIE_NAME}=${token}`)

describe('POST /api/v1/auth/refresh (integração)', () => {
  const userId = uuidv7()
  let refreshToken: string

  beforeEach(async () => {
    await resetDatabase()

    const tokens = issueAuthTokens(userId)
    refreshToken = tokens.refreshToken

    await repository.createUser({
      id: userId,
      username: 'walter',
      email: 'walter@email.com',
      passwordHash: 'hash-fake',
      refreshTokenHash: tokens.refreshTokenHash,
    })
  })

  it('rotaciona o refresh token e retorna um novo access token', async () => {
    const response = await refreshWith(refreshToken)

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.data).toEqual(expect.any(String))

    const { raw, value: newRefreshToken } = getSetCookie(response, REFRESH_COOKIE_NAME)

    await refreshWith(newRefreshToken).expect(200)

    expect(raw).toMatch(/HttpOnly/i)
    expect(raw).toContain('Path=/api/v1/auth')
    expect(newRefreshToken).not.toBe(refreshToken)
  })

  it('rejeita o reuso do refresh token antigo', async () => {
    await refreshWith(refreshToken).expect(200)
    await refreshWith(refreshToken).expect(401)
  })

  it('rejeita quando não há cookie', async () => {
    await request(app).post('/api/v1/auth/refresh').expect(401)
  })

  it('só uma de duas requisições simultâneas vence', async () => {
    const responses = await Promise.all([refreshWith(refreshToken), refreshWith(refreshToken)])

    expect(responses.map((response) => response.status).sort()).toEqual([200, 401])
  })
})
