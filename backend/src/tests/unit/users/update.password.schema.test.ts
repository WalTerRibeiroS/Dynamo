import { describe, expect, it } from 'vitest'
import { updatePasswordSchema } from '../../../routes/v1/modules/users/schemas/users.update.password.schema.js'

describe('updatePasswordSchema', () => {
  const validPayload = {
    currentPassword: 'senha-antiga',
    newPassword: 'NovaSenha123',
  }

  it('aceita um payload válido', () => {
    const result = updatePasswordSchema.safeParse(validPayload)
    expect(result.success).toBe(true)
  })

  it('rejeita senha atual ausente', () => {
    const result = updatePasswordSchema.safeParse({ newPassword: validPayload.newPassword })
    expect(result.success).toBe(false)
  })

  it('rejeita senha atual vazia', () => {
    const result = updatePasswordSchema.safeParse({ ...validPayload, currentPassword: '' })
    expect(result.success).toBe(false)
  })

  it('rejeita senha nova ausente', () => {
    const result = updatePasswordSchema.safeParse({ currentPassword: validPayload.currentPassword })
    expect(result.success).toBe(false)
  })

  it('rejeita senha nova com menos de 8 caracteres', () => {
    const result = updatePasswordSchema.safeParse({ ...validPayload, newPassword: 'Nova123' })
    expect(result.success).toBe(false)
  })

  it('aceita senha nova com exatamente 72 bytes em UTF-8', () => {
    const result = updatePasswordSchema.safeParse({
      ...validPayload,
      newPassword: 'A'.repeat(70) + 'a1',
    })
    expect(result.success).toBe(true)
  })

  it('rejeita senha nova com mais de 72 bytes em UTF-8', () => {
    const result = updatePasswordSchema.safeParse({
      ...validPayload,
      newPassword: 'A'.repeat(71) + 'a1',
    })
    expect(result.success).toBe(false)
  })

  it('rejeita senha nova sem letra maiúscula', () => {
    const result = updatePasswordSchema.safeParse({ ...validPayload, newPassword: 'novasenha123' })
    expect(result.success).toBe(false)
  })

  it('rejeita senha nova sem letra minúscula', () => {
    const result = updatePasswordSchema.safeParse({ ...validPayload, newPassword: 'NOVASENHA123' })
    expect(result.success).toBe(false)
  })
})
