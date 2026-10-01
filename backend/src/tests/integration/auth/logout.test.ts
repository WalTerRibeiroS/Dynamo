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
  request(app).post('/api/v1/auth/logout').set('Cookie', `${REFRESH_COOKIE_NAME}=${token}`)

describe('POST /api/v1/auth/logout (integração)', () => {
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

  it('apaga o cookie caso o token seja vaĺido', async () => {
    const response = await refreshWith(refreshToken)

    expect(response.status).toBe(204)

    const { raw, value } = getSetCookie(response, REFRESH_COOKIE_NAME)

    expect(raw).toMatch(/HttpOnly/i)
    expect(raw).toContain('Path=/api/v1/auth')
    expect(value).toBe('')
  })

  it('apaga o cookie mesmo se o token seja inválido', async () => {
    const response = await refreshWith('qualque-token')

    expect(response.status).toBe(204)

    const { raw, value } = getSetCookie(response, REFRESH_COOKIE_NAME)

    expect(raw).toMatch(/HttpOnly/i)
    expect(raw).toContain('Path=/api/v1/auth')
    expect(value).toBe('')
  })

  it('apaga o cookie quando o token não é fornecido', async () => {
    const response = await refreshWith('')

    expect(response.status).toBe(204)

    const { raw, value } = getSetCookie(response, REFRESH_COOKIE_NAME)

    expect(raw).toMatch(/HttpOnly/i)
    expect(raw).toContain('Path=/api/v1/auth')
    expect(value).toBe('')
  })
})
