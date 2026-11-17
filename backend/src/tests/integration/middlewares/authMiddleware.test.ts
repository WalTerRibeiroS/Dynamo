import express from 'express'
import request from 'supertest'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import jwt from 'jsonwebtoken'
import { uuidv7 } from 'uuidv7'
import pool from '../../../config/db.js'
import { ENV } from '../../../config/env.js'
import { authMiddleware } from '../../../middlewares/authMiddleware.js'
import errorMiddleware from '../../../middlewares/error.js'
import * as authRepository from '../../../routes/v1/modules/auth/auth.repository.js'
import { issueAuthTokens } from '../../../routes/v1/modules/auth/auth.tokens.js'
import { resetDatabase } from '../../resetDatabase.js'

import type { RequestHandler } from 'express'

function createAppThatRequireAuth(protectedRoute: RequestHandler = (req, res) => {
  res.status(200).json({ userId: req.userId })
}) {
  const app = express()

  app.get('/protect', authMiddleware, protectedRoute)

  app.use(errorMiddleware)

  return app
}

describe("authMiddleware", () => {

  const id = uuidv7()
  const { accessToken: token, refreshToken } = issueAuthTokens(id)

  beforeEach(async () => {
    await resetDatabase()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  const seedUser = async () => {
    await authRepository.createUser({
      id,
      username: 'auth-middleware-user',
      email: 'auth-middleware@example.com',
      passwordHash: 'password-hash',
      refreshTokenHash: 'refresh-token-hash',
    })
  }

  it("permite requisição com token válido", async() => {
    await seedUser()
    const app = createAppThatRequireAuth()

    const response = await request(app)
      .get('/protect')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
  })

  it("adiciona userId ao request", async() => {
    await seedUser()
    const app = createAppThatRequireAuth()

    const response = await request(app)
      .get('/protect')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.userId).toBe(id)
  })

  it('recusa token válido quando o usuário não existe no banco', async () => {
    const protectedRoute = vi.fn<RequestHandler>((_req, res) => {
      res.sendStatus(200)
    })
    const app = createAppThatRequireAuth(protectedRoute)

    const response = await request(app)
      .get('/protect')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(404)
    expect(response.body.code).toBe('NOT_FOUND')
    expect(protectedRoute).not.toHaveBeenCalled()
  })

  it('repassa falha inesperada na consulta ao banco como erro 500', async () => {
    vi.spyOn(pool, 'query').mockRejectedValueOnce(new Error('database unavailable'))
    const app = createAppThatRequireAuth()

    const response = await request(app)
      .get('/protect')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(500)
    expect(response.body.code).toBe('INTERNAL_ERROR')
  })

  it("não permite requisição sem header", async() => {
    const app = createAppThatRequireAuth()

    const response = await request(app)
      .get('/protect')

    expect(response.status).toBe(401)
    expect(response.body.code).toBe('UNAUTHORIZED')
  })

  it("não permite requisição com valor no header Bearer inválido", async() => {
    const app = createAppThatRequireAuth()

    const response = await request(app)
      .get('/protect')
      .set('Authorization', `Bearer ${null}`)

    expect(response.status).toBe(401)
    expect(response.body.code).toBe('UNAUTHORIZED')
  })

  it("não permite requisição com valor inválido do token", async() => {
    const app = createAppThatRequireAuth()

    const tokenInvalido = "token-inválido"

    const response = await request(app)
      .get('/protect')
      .set('Authorization', `Bearer ${tokenInvalido}`)

    expect(response.status).toBe(401)
    expect(response.body.code).toBe('UNAUTHORIZED')
  })

  it("não permite requisição com token expirado", async () => {
    const expiredToken = jwt.sign(
      { id },
      ENV.ACCESS_TOKEN,
      { algorithm: 'HS256', expiresIn: -1 },
    )

    const app = createAppThatRequireAuth()

    const response = await request(app)
      .get('/protect')
      .set('Authorization', `Bearer ${expiredToken}`)

    expect(response.status).toBe(401)
    expect(response.body.code).toBe('UNAUTHORIZED')
  })

  it("não permite requisição com esquema diferente de Bearer", async () => {
    const app = createAppThatRequireAuth()

    const response = await request(app)
      .get('/protect')
      .set('Authorization', 'Basic dXNlcjpwYXNz')

    expect(response.status).toBe(401)
    expect(response.body.code).toBe('UNAUTHORIZED')
  })

  it("não permite usar um Refresh Token como Access Token", async () => {
    const app = createAppThatRequireAuth()

    const response = await request(app)
      .get('/protect')
      .set('Authorization', `Bearer ${refreshToken}`)

    expect(response.status).toBe(401)
    expect(response.body.code).toBe('UNAUTHORIZED')
  })
})
