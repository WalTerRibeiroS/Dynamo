import { describe, expect, it } from 'vitest'
import { updateUsernameSchema } from '../../../routes/v1/modules/users/schemas/users.username.schema.js'

describe('updateUsernameSchema', () => {
  it('aceita um username válido', () => {
    const result = updateUsernameSchema.safeParse({ username: 'walter_123' })
    expect(result.success).toBe(true)
  })

  it('rejeita username ausente', () => {
    const result = updateUsernameSchema.safeParse({})
    expect(result.success).toBe(false)
  })

  it('rejeita username com menos de 3 caracteres', () => {
    const result = updateUsernameSchema.safeParse({ username: 'ab' })
    expect(result.success).toBe(false)
  })

  it('aceita username com exatamente 3 caracteres', () => {
    const result = updateUsernameSchema.safeParse({ username: 'abc' })
    expect(result.success).toBe(true)
  })

  it('aceita username com exatamente 32 caracteres', () => {
    const result = updateUsernameSchema.safeParse({ username: 'a'.repeat(32) })
    expect(result.success).toBe(true)
  })

  it('rejeita username com mais de 32 caracteres', () => {
    const result = updateUsernameSchema.safeParse({ username: 'a'.repeat(33) })
    expect(result.success).toBe(false)
  })

  it('rejeita caracteres que não sejam letras, números, _ ou -', () => {
    const result = updateUsernameSchema.safeParse({ username: 'walter.nome' })
    expect(result.success).toBe(false)
  })
})
