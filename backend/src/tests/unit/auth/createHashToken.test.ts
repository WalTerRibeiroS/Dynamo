import { describe, it, expect } from 'vitest'
import { createHashToken } from "../../../routes/v1/modules/auth/auth.tokens.js"
import { createHash } from 'node:crypto'

describe("createHashToken", () => {
  it("cria o hash equivalente ao token fonecido", () => {
    const inputToken = "tokenSemHash"

    const outputTokenHash = createHashToken(inputToken)
    const expectedHash = createHash('sha256').update(inputToken).digest('hex')

    expect(outputTokenHash).toBe(expectedHash)
  })

  it("gera sempre o mesmo hash para o mesmo token", () => {
    const token = "tokenSemHash"

    const hash1 = createHashToken(token)
    const hash2 = createHashToken(token)

    expect(hash1).toBe(hash2)
  })

  it("gera hashes diferentes para tokens diferentes", () => {
    const hash1 = createHashToken("token1")
    const hash2 = createHashToken("token2")

    expect(hash1).not.toBe(hash2)
  })
})