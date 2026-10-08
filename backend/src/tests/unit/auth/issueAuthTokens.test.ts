import { describe, it, expect } from 'vitest'
import jwt from "jsonwebtoken"
import { uuidv7 } from 'uuidv7'
import { ENV } from '../../../config/env.js'
import { createHashToken, issueAuthTokens, verifyRefreshToken } from "../../../routes/v1/modules/auth/auth.tokens.js"

describe("issueAuthTokens", () => {
  it("retorna access token, refresh token e hash", () => {
    const userId = uuidv7()

    const { accessToken, refreshToken, refreshTokenHash } =
      issueAuthTokens(userId)

    expect(accessToken).toEqual(expect.any(String))
    expect(refreshToken).toEqual(expect.any(String))
    expect(refreshTokenHash).toEqual(expect.any(String))

    expect(refreshTokenHash).toBe(createHashToken(refreshToken))
  })

  it("retorna os tokens com a assinatura correta",() => {
    const userId = uuidv7()

    const { accessToken, refreshToken } = issueAuthTokens(userId)

    const accessPayload = jwt.verify(
      accessToken,
      ENV.ACCESS_TOKEN,
      { algorithms: ["HS256"] }
    )

    const refreshPayload = jwt.verify(
      refreshToken,
      ENV.REFRESH_TOKEN,
      { algorithms: ["HS256"] }
    )

    expect(accessPayload).toMatchObject({ id: userId })
    expect(refreshPayload).toMatchObject({ id: userId })
  })

  it("gera um refresh token válido", () => {
    const userId = uuidv7()

    const { refreshToken } = issueAuthTokens(userId)

    expect(verifyRefreshToken(refreshToken)).toBe(userId)
  })
})