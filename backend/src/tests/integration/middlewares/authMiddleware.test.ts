import express from 'express'
import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { authMiddleware } from "../../../middlewares/authMiddleware.js"
import errorMiddleware from "../../../middlewares/error.js"

import type {  } from "express"
 

import { issueAuthTokens } from "../../../routes/v1/modules/auth/auth.tokens.js"
import { uuidv7 } from "uuidv7"

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
  const { accessToken: token } = issueAuthTokens(id)

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

  // TS é muito chato e n me deixou testar caso o header seja
  // qualquer valor, por isso n tem teste disso, 
  // responsavel por isso é esse IncomingHttpHeaders type

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
})