import { describe, it, expect } from 'vitest'
import { loginUserSchema } from '../../../routes/v1/modules/auth/schemas/auth.login.schema.js'

describe('loginUserSchema', () => {
  const validPayload = {
    email: 'walter@email.com',
    password: 'Senha1234',
  }

  it('aceita um payload válido', () => {
    const result = loginUserSchema.safeParse(validPayload)
    expect(result.success).toBe(true)
  })

  it('rejeita email mal formatado', () => {
    const result = loginUserSchema.safeParse({ ...validPayload, email: 'não-é-email' })
    expect(result.success).toBe(false)
  })

  it('rejeita email com mais de 255 caractéres', () => {
    const emailGrande = 'a'.repeat(255) + 'a' // 256 caractéres
    const result = loginUserSchema.safeParse({ ...validPayload, email: emailGrande })
    expect(result.success).toBe(false)
  })

  // feito assim para reduzir o acoplamento das regras do register em cima do login
  // isso evita q se regras do register mudar, usuarios antigos ainda consigam logar

  it('aceita senha com menos de 8 caractéres', () => {
    const result = loginUserSchema.safeParse({ ...validPayload, password: 'a' })
    expect(result.success).toBe(true)
  })

  it('aceita senha com formato simples', () => {
    const result = loginUserSchema.safeParse({ ...validPayload, password: 'senha-normal' })
    expect(result.success).toBe(true)
  })

  it('rejeita senha com mais de 72 caractéres', () => {
    const senhaGigante = 'a'.repeat(73) // 73 caractéres
    const result = loginUserSchema.safeParse({ ...validPayload, password: senhaGigante })
    expect(result.success).toBe(false)
  })
})
