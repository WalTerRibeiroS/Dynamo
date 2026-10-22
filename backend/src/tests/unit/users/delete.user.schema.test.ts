import { describe, expect, it } from 'vitest'
import { deleteUserSchema } from '../../../routes/v1/modules/users/schemas/users.delete.user.schema.js'

describe('deleteUserSchema', () => {
  it('aceita uma senha válida', () => {
    const result = deleteUserSchema.safeParse({ password: 'Senha1234' })
    expect(result.success).toBe(true)
  })

  it('rejeita senha ausente', () => {
    const result = deleteUserSchema.safeParse({})
    expect(result.success).toBe(false)
  })

  it('rejeita senha vazia', () => {
    const result = deleteUserSchema.safeParse({ password: '' })
    expect(result.success).toBe(false)
  })
})
