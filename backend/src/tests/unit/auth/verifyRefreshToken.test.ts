import { describe, it, expect } from 'vitest'
import jwt from "jsonwebtoken"
import { UnauthorizedError } from "../../../utils/errors.js"
import { uuidv7 } from 'uuidv7'
import { ENV } from '../../../config/env.js'
import { verifyRefreshToken } from "../../../routes/v1/modules/auth/auth.tokens.js"

describe("verifyRefreshToken", () => {

  it("retorna o id válido de dentro do JWT", () => {
    
    const userId = uuidv7()
    const tokenVálido = jwt.sign({ id: userId }, ENV.REFRESH_TOKEN, { algorithm: 'HS256' })

    const result = verifyRefreshToken(tokenVálido)

    expect(result).toBe(userId)
  })

  it("lança UnauthorizedError quando o refresh token é inválido", () => {
    expect(() => verifyRefreshToken("token-invalido")).toThrow(UnauthorizedError)
  })

  it("lança UnauthorizedError quando o payload do refresh token é inválido", () => {

    const userId = "qualquer-id-ai-q-n-seja-uuidv7"
    const payloadInválido = jwt.sign({ id: userId }, ENV.REFRESH_TOKEN, { algorithm: 'HS256' })

    expect(() => verifyRefreshToken(payloadInválido)).toThrow(UnauthorizedError)
  })
})