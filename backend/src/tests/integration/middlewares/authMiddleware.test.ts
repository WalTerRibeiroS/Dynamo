import express from 'express'
import request from 'supertest'
import { describe, expect, it } from 'vitest'
import jwt from 'jsonwebtoken'
import { uuidv7 } from 'uuidv7'
import { ENV } from '../../../config/env.js'
import { authMiddleware } from '../../../middlewares/authMiddleware.js'
import errorMiddleware from '../../../middlewares/error.js'
import { issueAuthTokens } from '../../../routes/v1/modules/auth/auth.tokens.js'

function createAppThatRequeireAuth() {
  const app = express()

  app.get("/protect", authMiddleware, (req, res, ) => {
    res.status(200).json({ userId: req.userId })
  })

  app.use(errorMiddleware)

  return app
}

describe("authMiddleware", () => {

  const id = uuidv7()
  const { accessToken: token, refreshToken } = issueAuthTokens(id)

  it("permite requisição com token válido", async() => {
    const app = createAppThatRequeireAuth()

    const response = await request(app)
      .get("/protect")
      .set("Authorization", `Bearer ${token}`)

    expect(response.status).toBe(200)
  })

  it("adiciona userId ao request", async() => {
    const app = createAppThatRequeireAuth()

    const response = await request(app)
      .get("/protect")
      .set("Authorization", `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.userId).toBe(id)
  })

  it("não permite requisição sem header", async() => {
    const app = createAppThatRequeireAuth()

    const response = await request(app)
      .get("/protect")

    expect(response.status).toBe(401)
  })

  it("não permite requisição com valor no header Bearer inválido", async() => {
    const app = createAppThatRequeireAuth()

    const response = await request(app)
      .get("/protect")
      .set("Authorization", `Bearer ${null}`)

    expect(response.status).toBe(401)
  })

  it("não permite requisição com valor inválido do token", async() => {
    const app = createAppThatRequeireAuth()

    const tokenInvalido = "token-inválido"

    const response = await request(app)
      .get("/protect")
      .set("Authorization", `Bearer ${tokenInvalido}`)

    expect(response.status).toBe(401)
  })

  it("não permite requisição com token expirado", async () => {
    const expiredToken = jwt.sign(
      { id },
      ENV.ACCESS_TOKEN,
      { algorithm: 'HS256', expiresIn: -1 },
    )

    const app = createAppThatRequeireAuth()

    const response = await request(app)
      .get("/protect")
      .set("Authorization", `Bearer ${expiredToken}`)

    expect(response.status).toBe(401)
  })

  it("não permite requisição com esquema diferente de Bearer", async () => {
    const app = createAppThatRequeireAuth()

    const response = await request(app)
      .get("/protect")
      .set("Authorization", "Basic dXNlcjpwYXNz")

    expect(response.status).toBe(401)
  })

  it("não permite usar um Refresh Token como Access Token", async () => {
    const app = createAppThatRequeireAuth()

    const response = await request(app)
      .get("/protect")
      .set("Authorization", `Bearer ${refreshToken}`)

    expect(response.status).toBe(401)
  })
})
