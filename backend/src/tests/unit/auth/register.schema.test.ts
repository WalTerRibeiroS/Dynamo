// register.schema.test.ts
import { describe, it, expect } from 'vitest'
import { registerUserSchema } from '../../../routes/v1/modules/auth/schemas/auth.register.schema.js'

describe('registerUserSchema', () => {
  const validPayload = {
    username: 'walter123',
    email: 'walter@email.com',
    password: 'Senha1234',
  }

  it('aceita um payload válido', () => {
    const result = registerUserSchema.safeParse(validPayload)
    expect(result.success).toBe(true)
  })

  it('rejeita username com menos de 3 caractéres', () => {
    const result = registerUserSchema.safeParse({ ...validPayload, username: 'wa' })
    expect(result.success).toBe(false)
  })

  it('aceita username com exatamente 3 caractéres (limite mínimo)', () => {
    const result = registerUserSchema.safeParse({ ...validPayload, username: 'wal' })
    expect(result.success).toBe(true)
  })

  it('rejeita username com espaço', () => {
    const result = registerUserSchema.safeParse({ ...validPayload, username: 'walter 123' })
    expect(result.success).toBe(false)
  })

  it('rejeita email com formato inválido', () => {
    const result = registerUserSchema.safeParse({ ...validPayload, email: 'não-é-email' })
    expect(result.success).toBe(false)
  })

  it('rejeita senha sem letra maiúscula', () => {
    const result = registerUserSchema.safeParse({ ...validPayload, password: 'senha1234' })
    expect(result.success).toBe(false)
  })

  it('rejeita senha com mais de 72 caractéres', () => {
    const senhaGigante = 'A'.repeat(73) + 'a' // 74 caractéres, com maiúscula e minúscula
    const result = registerUserSchema.safeParse({ ...validPayload, password: senhaGigante })
    expect(result.success).toBe(false)
  })
})
